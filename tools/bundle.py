#!/usr/bin/env python3
"""Inline the app into a single self-contained HTML file.

    python3 tools/bundle.py

Writes two files into dist/:

  ror2-companion.html   a complete standalone document -- one file you can drop
                        on a phone, email to yourself, or open from anywhere
  artifact-body.html    the same page without the <!doctype>/<html>/<head>/<body>
                        wrapper, for hosts that supply their own skeleton

Both inline the stylesheet, the app and the generated data, so neither needs a
sibling file or a server. The webfont link is left external; the page falls back
to system faces without it.
"""
from __future__ import annotations

import base64
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"

TITLE = "Petrichor Field Guide"
DESCRIPTION = (
    "Offline Risk of Rain 2 companion: item reference with real stack maths, "
    "a build planner, survivor stats, artifact codes and an unlock tracker."
)
FONTS = (
    "https://fonts.googleapis.com/css2?"
    "family=Chakra+Petch:wght@500;600;700&"
    "family=Barlow:ital,wght@0,400;0,500;0,600;1,400&display=swap"
)

SHELL = """
<div class="app">
  <nav class="rail" id="rail-tabs" role="tablist" aria-label="Sections">
    <div class="rail__mark" aria-hidden="true">RoR2</div>
  </nav>
  <main class="main" id="main" role="tabpanel"></main>
</div>

<div id="drawer-host"></div>
"""


def icons_script() -> str:
    """Inline every icon as a data URI so the bundle needs no assets folder.

    WebP at 96px keeps the whole set near 1 MB; base64 adds about a third.
    The app falls back to assets/items/<slug>.webp when this is absent."""
    folder = ROOT / "assets" / "items"
    if not folder.is_dir():
        print("  no assets/items -- bundling without icons", file=sys.stderr)
        return ""
    icons = {}
    for path in sorted(folder.glob("*.webp")):
        encoded = base64.b64encode(path.read_bytes()).decode("ascii")
        icons[path.stem] = "data:image/webp;base64," + encoded
    if not icons:
        return ""
    print(f"  inlined {len(icons)} icons", file=sys.stderr)
    return "window.ROR2_ICONS = " + json.dumps(icons, separators=(",", ":")) + ";\n"


def read(relative: str) -> str:
    path = ROOT / relative
    if not path.exists():
        sys.exit(f"missing {relative} -- run tools/build_data.py first")
    return path.read_text(encoding="utf-8")


def main() -> int:
    css = read("app.css")
    app = read("app.js")
    data = read("data/ror2-data.js")
    icons = icons_script()

    # A literal </script> anywhere in the data would close the tag early.
    for name, body in (("data", data), ("app", app), ("icons", icons)):
        if "</script" in body.lower():
            sys.exit(f"{name} contains a literal </script> and cannot be inlined")

    body = (
        f"<title>{TITLE}</title>\n"
        f'<link rel="preconnect" href="https://fonts.googleapis.com">\n'
        f'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        f'<link rel="stylesheet" href="{FONTS}">\n'
        f"<style>\n{css}\n</style>\n"
        f"{SHELL}\n"
        f"<script>\n{data}\n</script>\n"
        + (f"<script>\n{icons}</script>\n" if icons else "")
        + f"<script>\n{app}\n</script>\n"
    )

    document = (
        "<!doctype html>\n"
        '<html lang="en">\n<head>\n'
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        f'<meta name="description" content="{DESCRIPTION}">\n'
        f"{body}"
        "</head>\n<body>\n</body>\n</html>\n"
    )

    # The standalone document needs the shell and scripts inside <body>, not
    # <head>; rebuild it in the right order rather than relying on error
    # recovery in the parser.
    head = (
        f"<title>{TITLE}</title>\n"
        f'<link rel="preconnect" href="https://fonts.googleapis.com">\n'
        f'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        f'<link rel="stylesheet" href="{FONTS}">\n'
        f"<style>\n{css}\n</style>\n"
    )
    document = (
        "<!doctype html>\n"
        '<html lang="en">\n<head>\n'
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        f'<meta name="description" content="{DESCRIPTION}">\n'
        f"{head}"
        "</head>\n<body>\n"
        f"{SHELL}\n"
        f"<script>\n{data}\n</script>\n"
        + (f"<script>\n{icons}</script>\n" if icons else "")
        + f"<script>\n{app}\n</script>\n"
        + "</body>\n</html>\n"
    )

    DIST.mkdir(exist_ok=True)
    standalone = DIST / "ror2-companion.html"
    fragment = DIST / "artifact-body.html"
    standalone.write_text(document, encoding="utf-8")
    fragment.write_text(body, encoding="utf-8")

    for path in (standalone, fragment):
        print(f"  wrote {path.relative_to(ROOT)} ({path.stat().st_size / 1024:.0f} KB)",
              file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
