import xml.etree.ElementTree as ET
from urllib.parse import urlparse

INPUT_FILE = "1771714950422-da_DK-product_sitemap.xml"
OUTPUT_FILE = "lidl_product_slugs.csv"

def extract_slug(url):
    """
    Extract product slug from Lidl product URL.
    Example:
    https://www.lidl.dk/p/parkside-multimeter-eller-stroemmaaleadapter/p10029615
    -> parkside-multimeter-eller-stroemmaaleadapter
    """
    path = urlparse(url).path  # /p/slug/p10029615
    parts = path.strip("/").split("/")

    # Expected structure: ['p', 'slug', 'p10029615']
    if len(parts) >= 3:
        return parts[1]

    return None


def main():
    tree = ET.parse(INPUT_FILE)
    root = tree.getroot()

    # Handle namespace
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

    slugs = []

    for url in root.findall("sm:url/sm:loc", ns):
        product_url = url.text.strip()
        slug = extract_slug(product_url)

        if slug:
            slugs.append(slug)

    # Remove duplicates
    slugs = list(set(slugs))

    # Save to file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("slug\n")
        for s in slugs:
            f.write(s + "\n")

    print(f"Saved {len(slugs)} product slugs to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()