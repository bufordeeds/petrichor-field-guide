#!/usr/bin/env python3
"""Draw the home-screen icons into assets/icons/.

    python3 tools/make_icons.py

An original mark, not game art: the hexagonal box from the Items tab, in the
app's accent colour on its dark background. Drawn at 4x and downsampled for
smooth edges. The maskable variant keeps the mark inside the central 60%
safe zone that Android crops to.
"""
from __future__ import annotations

import pathlib

from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "icons"

BG = (16, 18, 26)        # --bg (dark)
ACCENT = (232, 116, 59)  # --accent (dark)
SCALE = 4

# The Items tab icon on a 24-unit grid: hexagon outline, two top edges, spine.
HEX = [(12, 2), (21, 7), (21, 17), (12, 22), (3, 17), (3, 7)]
LINES = [[(3, 7), (12, 12), (21, 7)], [(12, 12), (12, 22)]]


def draw(size: int, mark: float, rounded: bool) -> Image.Image:
    big = size * SCALE
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    radius = int(big * 0.22) if rounded else 0
    d.rounded_rectangle([0, 0, big - 1, big - 1], radius=radius, fill=BG)

    span = big * mark                 # how much of the canvas the 24-unit grid covers
    off = (big - span) / 2
    unit = span / 24

    def pt(p):
        return (off + p[0] * unit, off + p[1] * unit)

    width = max(1, int(unit * 1.9))
    d.line([pt(p) for p in HEX + HEX[:1]], fill=ACCENT, width=width, joint="curve")
    for line in LINES:
        d.line([pt(p) for p in line], fill=ACCENT, width=width, joint="curve")
    # round the joins the line joints leave square
    for p in HEX + [(12, 12)]:
        x, y = pt(p)
        r = width / 2
        d.ellipse([x - r, y - r, x + r, y + r], fill=ACCENT)

    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    # iOS applies its own corner mask, so the touch icon is a full square.
    draw(180, 0.62, rounded=False).convert("RGB").save(OUT / "apple-touch-icon.png")
    draw(192, 0.62, rounded=True).save(OUT / "icon-192.png")
    draw(512, 0.62, rounded=True).save(OUT / "icon-512.png")
    draw(512, 0.50, rounded=False).convert("RGB").save(OUT / "icon-maskable-512.png")
    draw(32, 0.70, rounded=True).save(OUT / "favicon-32.png")
    for path in sorted(OUT.glob("*.png")):
        print(f"  wrote {path.relative_to(ROOT)} ({path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
