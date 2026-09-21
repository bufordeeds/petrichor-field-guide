#!/usr/bin/env python3
"""Download item, equipment and survivor icons from the wiki into assets/.

    pip install pillow
    python3 tools/fetch_icons.py

Icons are looked up through the MediaWiki imageinfo API by page title, then
downscaled and written as WebP -- the whole set lands around 1 MB rather than
the ~12 MB the originals weigh, which keeps the single-file bundle practical.

Names that do not resolve on the first try are retried against a few known
spelling variations; anything still missing is reported and simply renders as
a tier-coloured tile with no art, so a miss degrades rather than breaks.
"""
from __future__ import annotations

import io
import json
import pathlib
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

WIKI = "https://riskofrain2.wiki.gg"
ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "ror2-data.js"
OUT = ROOT / "assets" / "items"

SIZE = 96          # rendered at 48-128px; 96 covers retina at typical sizes
QUALITY = 82
BATCH = 40         # imageinfo accepts up to 50 titles per query
WORKERS = 8


sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from build_data import slug  # noqa: E402  -- one definition, shared


def title_variants(name: str):
    """Page titles to try, in order."""
    yield f"File:{name}.png"
    # A few items carry a qualifier the file name drops, e.g. "(Consumed)".
    if "(" in name:
        yield f"File:{name.split('(')[0].strip()}.png"
    if "'" in name:                       # straight vs typographic apostrophe
        yield f"File:{name.replace(chr(39), chr(8217))}.png"


def api(params: dict):
    url = WIKI + "/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "ror2-companion-icons/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def resolve(titles: list[str]) -> dict[str, str]:
    """Map page title -> image URL for the titles that exist."""
    found: dict[str, str] = {}
    for i in range(0, len(titles), BATCH):
        chunk = titles[i:i + BATCH]
        data = api({
            "action": "query", "titles": "|".join(chunk),
            "prop": "imageinfo", "iiprop": "url", "format": "json",
        })
        pages = (data.get("query") or {}).get("pages") or {}
        for page in pages.values():
            info = page.get("imageinfo")
            if info:
                found[page["title"]] = info[0]["url"]
    return found


def download(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "ror2-companion-icons/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read()


def save_webp(raw: bytes, path: pathlib.Path) -> None:
    from PIL import Image

    img = Image.open(io.BytesIO(raw))
    img = img.convert("RGBA")
    img.thumbnail((SIZE, SIZE), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "WEBP", quality=QUALITY, method=6)


def load_names() -> list[str]:
    if not DATA.exists():
        sys.exit("data/ror2-data.js missing -- run tools/build_data.py first")
    text = DATA.read_text(encoding="utf-8")
    payload = text[text.index("=") + 1:].rstrip().rstrip(";")
    data = json.loads(payload)
    names = [e["name"] for e in data["items"]] + [e["name"] for e in data["equipment"]]
    return sorted(set(names))


def main() -> int:
    names = load_names()
    print(f"resolving {len(names)} icons...", file=sys.stderr)

    # Try the plain title for everything first, then variants for the misses.
    wanted: dict[str, str] = {}          # name -> url
    pending = list(names)
    for attempt in range(3):
        titles, owner = [], {}
        for name in pending:
            variants = list(title_variants(name))
            if attempt >= len(variants):
                continue
            title = variants[attempt]
            titles.append(title)
            owner[title] = name
        if not titles:
            break
        for title, url in resolve(titles).items():
            wanted[owner[title]] = url
        pending = [n for n in pending if n not in wanted]
        if not pending:
            break

    print(f"  resolved {len(wanted)}, missing {len(pending)}", file=sys.stderr)

    OUT.mkdir(parents=True, exist_ok=True)
    failures: list[str] = []

    def work(item):
        name, url = item
        target = OUT / f"{slug(name)}.webp"
        if target.exists():
            return
        try:
            save_webp(download(url), target)
        except Exception as exc:                      # noqa: BLE001
            failures.append(f"{name}: {exc}")

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        list(pool.map(work, wanted.items()))

    written = sorted(OUT.glob("*.webp"))
    total = sum(p.stat().st_size for p in written)
    print(f"  wrote {len(written)} icons, {total / 1024:.0f} KB total", file=sys.stderr)

    if pending:
        print("  no icon found for: " + ", ".join(sorted(pending)), file=sys.stderr)
    for failure in failures:
        print(f"  failed: {failure}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
