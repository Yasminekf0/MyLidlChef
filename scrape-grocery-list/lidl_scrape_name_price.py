import csv
import json
import re
import time
import xml.etree.ElementTree as ET
from typing import Optional, Tuple
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

INPUT_SITEMAP = "1771714950422-da_DK-product_sitemap.xml"
OUTPUT_CSV = "lidl_products_name_price.csv"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; LidlNamePriceCollector/1.0)"
}

# Matches common Lidl DK-style prices like "99,-*" or "29,-" or "12,95"
PRICE_PATTERNS = [
    re.compile(r"\b(\d{1,4})\s*,-\s*\*?"),      # 99,- or 99,-*
    re.compile(r"\b(\d{1,4}),(\d{2})\b"),       # 12,95
    re.compile(r"\b(\d{1,4})\s*kr\b", re.I),    # 99 kr
]

def parse_sitemap_urls(path: str) -> list[str]:
    tree = ET.parse(path)
    root = tree.getroot()
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

    locs = root.findall(".//sm:loc", ns)
    if not locs:
        # fallback if namespace differs
        locs = root.findall(".//loc")

    urls = []
    for loc in locs:
        if loc.text:
            urls.append(loc.text.strip())
    return urls

def extract_from_jsonld(soup: BeautifulSoup) -> Tuple[Optional[str], Optional[str]]:
    """
    Try to extract name and price from JSON-LD (if present).
    """
    name = None
    price = None

    for tag in soup.find_all("script", type="application/ld+json"):
        txt = tag.get_text(strip=True)
        if not txt:
            continue
        try:
            data = json.loads(txt)
        except Exception:
            continue

        # JSON-LD can be dict or list
        objs = data if isinstance(data, list) else [data]
        for obj in objs:
            if not isinstance(obj, dict):
                continue

            # Sometimes it's a graph
            if "@graph" in obj and isinstance(obj["@graph"], list):
                objs.extend([x for x in obj["@graph"] if isinstance(x, dict)])

            # Product object
            if obj.get("@type") == "Product":
                name = name or obj.get("name")

                offers = obj.get("offers")
                if isinstance(offers, dict):
                    # price might be a number/string
                    p = offers.get("price")
                    if p is not None:
                        price = price or str(p)
                elif isinstance(offers, list):
                    for off in offers:
                        if isinstance(off, dict) and off.get("price") is not None:
                            price = price or str(off.get("price"))
                            break

    return name, price

def extract_name(soup: BeautifulSoup) -> Optional[str]:
    # Typical: <h1>Product name</h1>
    h1 = soup.find("h1")
    if h1:
        t = h1.get_text(" ", strip=True)
        if t:
            return t
    # Fallback: title
    if soup.title and soup.title.get_text(strip=True):
        return soup.title.get_text(strip=True)
    return None

def extract_price_text(html_text: str) -> Optional[str]:
    # Search the raw page text for a price pattern
    # (Often appears as "99,-*" on Lidl DK pages.)
    for pat in PRICE_PATTERNS:
        m = pat.search(html_text)
        if m:
            if pat.pattern.startswith(r"\b(\d{1,4})\s*,-\s*\*?"):
                return f"{m.group(1)},-"
            if pat.pattern.startswith(r"\b(\d{1,4}),(\d{2})\b"):
                return f"{m.group(1)},{m.group(2)}"
            if "kr" in pat.pattern.lower():
                return f"{m.group(1)}"
    return None

def scrape_one(url: str, session: requests.Session) -> Tuple[Optional[str], Optional[str]]:
    r = session.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()

    soup = BeautifulSoup(r.text, "html.parser")

    # 1) Try JSON-LD first (if available)
    name_ld, price_ld = extract_from_jsonld(soup)

    # 2) HTML name fallback
    name = name_ld or extract_name(soup)

    # 3) Price fallback: regex in full text
    # Use visible text as well as raw html to catch "99,-*" style
    text = soup.get_text(" ", strip=True)
    price = price_ld or extract_price_text(text) or extract_price_text(r.text)

    return name, price

def main():
    urls = parse_sitemap_urls(INPUT_SITEMAP)
    print(f"Loaded {len(urls)} URLs from sitemap")

    session = requests.Session()

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["url", "slug", "name", "price_dkk"])

        for i, url in enumerate(urls, start=1):
            slug = urlparse(url).path.strip("/").split("/")
            slug = slug[1] if len(slug) >= 2 and slug[0] == "p" else ""

            try:
                name, price = scrape_one(url, session)
                w.writerow([url, slug, name or "", price or ""])
                print(f"[{i}/{len(urls)}] OK  name={name!r} price={price!r}")
            except Exception as e:
                w.writerow([url, slug, "", ""])
                print(f"[{i}/{len(urls)}] ERROR {url} -> {e}")

            time.sleep(0.6)  # be polite

    print(f"Done. Wrote: {OUTPUT_CSV}")

if __name__ == "__main__":
    main()