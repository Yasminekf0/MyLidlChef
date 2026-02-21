#!/usr/bin/env python3
"""
Fetch product URLs from nemlig.com's Google product sitemap and save to CSV/JSONL.

Notes:
- robots.txt lists the sitemap and disallows the Scrapy user-agent. Don't use Scrapy UA.
- Be polite: low request rate (we only fetch 1 sitemap here), caching if you rerun often.
"""

from __future__ import annotations

import csv
import json
import sys
import time
from typing import List
import requests
import xml.etree.ElementTree as ET

SITEMAP_URL = "https://www.nemlig.com/googleproductsitemap"


def parse_sitemap_urls(xml_bytes: bytes) -> List[str]:
    root = ET.fromstring(xml_bytes)

    # Most sitemaps use this namespace:
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

    loc_nodes = root.findall(".//sm:url/sm:loc", ns)

    # If namespace is missing/unusual, fall back to a no-namespace search:
    if not loc_nodes:
        loc_nodes = root.findall(".//loc")

    urls = []
    for n in loc_nodes:
        if n.text:
            urls.append(n.text.strip())

    # De-duplicate while preserving order
    seen = set()
    deduped = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            deduped.append(u)

    return deduped


def main() -> int:
    headers = {
        # Do NOT pretend to be Scrapy. Keep it normal.
        "User-Agent": "Mozilla/5.0 (compatible; ResearchURLCollector/1.0; +https://example.com/bot)",
        "Accept": "application/xml,text/xml;q=0.9,*/*;q=0.8",
    }

    try:
        resp = requests.get(SITEMAP_URL, headers=headers, timeout=60)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"[ERROR] Failed to fetch sitemap: {e}", file=sys.stderr)
        print("Tips:", file=sys.stderr)
        print("- Try again later (sites can rate-limit).", file=sys.stderr)
        print("- Ensure your network isn’t blocked by a queue/anti-bot page.", file=sys.stderr)
        return 1

    urls = parse_sitemap_urls(resp.content)
    print(f"[OK] Found {len(urls)} product URLs")

    # Save CSV
    csv_path = "nemlig_product_urls.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["url"])
        for u in urls:
            w.writerow([u])
    print(f"[OK] Wrote {csv_path}")

    # Optional: also save JSONL (one URL per line as JSON)
    jsonl_path = "nemlig_product_urls.jsonl"
    with open(jsonl_path, "w", encoding="utf-8") as f:
        for u in urls:
            f.write(json.dumps({"url": u}, ensure_ascii=False) + "\n")
    print(f"[OK] Wrote {jsonl_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())