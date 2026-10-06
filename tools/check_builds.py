#!/usr/bin/env python3
"""Check data/ror2-builds.js against the generated game data.

    python3 tools/check_builds.py

The builds are hand-curated, so after a patch (or a fresh tools/build_data.py
run) item and skill names can drift. This verifies that every survivor key is
a real survivor, every item reference is an existing item/equipment id, and
every loadout skill appears in that survivor's skill list. It also reports
survivors that have no build yet. Exits non-zero on any broken reference.
"""
from __future__ import annotations

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def load_global(relative: str) -> dict:
    """Read a `window.NAME = {...};` data file as JSON."""
    text = (ROOT / relative).read_text(encoding="utf-8")
    start, end = text.index("{"), text.rindex("}")
    return json.loads(text[start:end + 1])


def main() -> int:
    data = load_global("data/ror2-data.js")
    builds = load_global("data/ror2-builds.js")

    ids = {e["id"] for e in data["items"] + data["equipment"] if e.get("id")}
    survivors = {s["name"]: s for s in data["survivors"]}
    errors: list[str] = []

    for name, build in builds.get("survivors", {}).items():
        survivor = survivors.get(name)
        if not survivor:
            errors.append(f"{name}: not a survivor in data/ror2-data.js")
            continue
        skills = {s["name"] for s in survivor.get("skills", [])}

        refs = []
        for role, items in build.get("core", {}).items():
            refs += [(f"core.{role}", i) for i in items]
        for key in ("legendaries", "boss", "equipment"):
            refs += [(key, i) for i in build.get(key, [])]
        refs += [("avoid", row["id"]) for row in build.get("avoid", [])]
        if build.get("fun"):
            refs += [("fun", i) for i in build["fun"].get("items", [])]
        for where, item in refs:
            if item not in ids:
                errors.append(f"{name}: {where} references unknown item id {item!r}")

        for slot in build.get("loadout", []):
            for skill in [slot["pick"]] + [a["name"] for a in slot.get("alts", [])]:
                if skills and skill not in skills:
                    errors.append(f"{name}: {slot['slot']} skill {skill!r} not in survivor skills")

    missing = sorted(set(survivors) - set(builds.get("survivors", {})))
    for line in errors:
        print("error:", line)
    if missing:
        print("no build yet:", ", ".join(missing))
    print(f"{len(builds.get('survivors', {}))} builds checked, {len(errors)} problems")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
