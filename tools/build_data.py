#!/usr/bin/env python3
"""Regenerate data/ror2-data.js from the official Risk of Rain 2 wiki.

The wiki (riskofrain2.wiki.gg) keeps its game data in Scribunto/Lua modules,
which are machine-readable and track the live game including DLC. We fetch the
raw Lua, execute it in a sandboxed Lua runtime, normalise it, and emit a single
classic <script> file that defines window.ROR2_DATA.

    pip install lupa
    python3 tools/build_data.py

Emitting a classic script (not an ES module or a fetched .json) is deliberate:
it keeps index.html working when opened straight off the filesystem, where both
module scripts and fetch() are blocked by the browser.
"""
from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path

WIKI = "https://riskofrain2.wiki.gg"
MODULES = [
    "Items/Data",
    "Equipment/Data",
    "Artifacts/Data",
    "Survivors/Data",
    "Challenges/Data",
    "Skills/Data",
    "Environments/Data",
]

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "tools" / ".cache"
OUT = ROOT / "data" / "ror2-data.js"

# Rarities we surface, in display order. Anything else (cut content, the
# "Unused (...)" buckets) is dropped.
ITEM_TIERS = [
    "Common",
    "Uncommon",
    "Legendary",
    "Boss",
    "Lunar",
    "Void",
    "Meal",
    "Untiered",
]
EQUIP_TIERS = ["Equipment", "Lunar Equipment", "Elite Equipment"]

# Category tags that describe gameplay. The rest of the Category field is
# engine bookkeeping (AIBlacklist, PrinterBlacklist, ...) and is not useful
# as a filter.
REAL_CATEGORIES = {
    "Damage",
    "Healing",
    "Utility",
    "Technology",
    "MobilityRelated",
    "SprintRelated",
    "OnKillEffect",
    "OnStageBeginEffect",
    "EquipmentRelated",
    "HoldoutZoneRelated",
    "InteractableRelated",
    "LowHealth",
    "Scrap",
    "WorldUnique",
}

EXPANSIONS = {
    None: "Base game",
    "SotV": "Survivors of the Void",
    "SotS": "Seekers of the Storm",
    "AC": "Alloyed Collective",
}

# Canonical names for the stats we aggregate in the loadout planner. The wiki
# spells several of these more than one way.
STAT_ALIASES = {
    "attack speed": "Attack Speed",
    "movement speed": "Movement Speed",
    "crit chance": "Crit Chance",
    "crit. chance": "Crit Chance",
    "critical chance": "Crit Chance",
    "max health": "Max Health",
    "maximum health": "Max Health",
    "health": "Max Health",
    "health regen": "Health Regen",
    "regen": "Health Regen",
    "armor": "Armor",
    "block chance": "Block Chance",
    "luck": "Luck",
}

# Deliberately absent: "Damage" and "Cooldown Reduction". The wiki uses each as
# a label for many unrelated effects -- Crowbar's conditional bonus, AtG's
# missile hit and Gasoline's on-kill AoE all record a "Damage" stat -- so a sum
# across them would be a confident wrong answer. They stay on the item detail.


def slug(name: str) -> str:
    """Stable, filesystem-safe id for an item name; also the icon filename."""
    out = "".join(c.lower() if c.isalnum() else "-" for c in name)
    while "--" in out:
        out = out.replace("--", "-")
    return out.strip("-")


def fetch(module: str) -> str:
    CACHE.mkdir(exist_ok=True)
    cached = CACHE / (module.replace("/", "_") + ".lua")
    if cached.exists():
        return cached.read_text(encoding="utf-8")
    url = f"{WIKI}/index.php?title=Module:{module}&action=raw"
    print(f"  fetch {module}", file=sys.stderr)
    req = urllib.request.Request(url, headers={"User-Agent": "ror2-companion-build/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        text = resp.read().decode("utf-8")
    cached.write_text(text, encoding="utf-8")
    return text


def lua_to_py(value, depth: int = 0):
    """Recursively convert a Lua table into plain Python data."""
    if depth > 40:
        return None
    if hasattr(value, "keys") and "lua" in type(value).__name__.lower():
        keys = list(value.keys())
        is_array = bool(keys) and all(isinstance(k, int) for k in keys) \
            and sorted(keys) == list(range(1, len(keys) + 1))
        if is_array:
            return [lua_to_py(value[k], depth + 1) for k in sorted(keys)]
        return {str(k): lua_to_py(value[k], depth + 1) for k in keys}
    if isinstance(value, float) and value.is_integer():
        return int(value)
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return str(value)


def load_module(module: str):
    from lupa import LuaRuntime

    src = fetch(module).replace("--<nowiki>", "").replace("--</nowiki>", "")
    lua = LuaRuntime(unpack_returned_tuples=True)
    # The data modules do not call into MediaWiki, but stub `mw` so that a
    # stray reference cannot abort the load.
    lua.execute("mw = { text = { split = function() return {} end }, ustring = string }")
    return lua_to_py(lua.execute(src))


# --------------------------------------------------------------------------
# Description markup
# --------------------------------------------------------------------------
TEMPLATE_RE = re.compile(r"\{\{(Color|Keyword|Stack)\|?([^{}]*)\}\}")


def render_markup(text: str) -> str:
    """Turn the wiki's {{Color|d|x}} / {{Keyword|u|x}} / {{Stack|(...)}} markup
    into HTML spans. Innermost-first so nested templates resolve correctly."""
    if not text:
        return ""
    out = text
    for _ in range(12):
        new = TEMPLATE_RE.sub(_render_one, out)
        if new == out:
            break
        out = new
    # Anything left unmatched: strip the braces rather than show them.
    out = re.sub(r"\{\{|\}\}", "", out)
    return out.strip()


def _render_one(m: re.Match) -> str:
    kind, body = m.group(1), m.group(2)
    if kind == "Stack":
        return f'<span class="mk-stack">{body.strip()}</span>'
    parts = body.split("|", 1)
    if len(parts) == 2:
        code, inner = parts[0].strip(), parts[1]
    else:
        code, inner = "u", parts[0]
    cls = f"mk-{code}" + (" mk-kw" if kind == "Keyword" else "")
    return f'<span class="{cls}">{inner}</span>'


def plain(text: str) -> str:
    """Markup-free version, used for search."""
    return re.sub(r"<[^>]+>", "", render_markup(text))


# --------------------------------------------------------------------------
# Stats
# --------------------------------------------------------------------------
NUM_RE = re.compile(r"^([+-]?[\d.]+)\s*(.*)$")


def parse_amount(raw):
    """Split '+15%' into (15.0, '%'). Returns (None, raw) when not numeric."""
    if raw is None:
        return None, ""
    s = str(raw).strip().replace(",", "")
    if not s:
        return None, ""
    m = NUM_RE.match(s)
    if not m:
        return None, s
    try:
        value = float(m.group(1))
    except ValueError:
        return None, s
    return value, m.group(2).strip()


def normalise_stat(entry):
    name = (entry.get("Stat") or "").strip()
    if not name:
        return None
    stack = (entry.get("Stack") or "None").strip() or "None"
    base, unit = parse_amount(entry.get("Value"))
    add, add_unit = parse_amount(entry.get("Add"))
    out = {
        "stat": name,
        "stack": stack,
        "base": entry.get("Value"),
        "add": entry.get("Add") or "",
    }
    if base is not None:
        out["baseNum"] = base
        out["unit"] = unit or add_unit
    if add is not None:
        out["addNum"] = add
    canon = STAT_ALIASES.get(name.lower())
    # Only treat it as an aggregatable stat if we can actually do the maths.
    if canon and base is not None and stack in ("Linear", "Hyperbolic"):
        out["canon"] = canon
    return out


def build_stats(raw_stats):
    stats, procs = [], []
    for entry in raw_stats or []:
        if not isinstance(entry, dict):
            continue
        if (entry.get("Stack") or "") == "ProcCoeff":
            value, _ = parse_amount(entry.get("Value"))
            if value is not None:
                procs.append(value)
            continue
        norm = normalise_stat(entry)
        if norm:
            stats.append(norm)
    return stats, (procs[0] if procs else None)


# --------------------------------------------------------------------------
# Builders
# --------------------------------------------------------------------------
def build_items(raw):
    items = []
    for name, v in raw["items"].items():
        rarity = (v.get("Rarity") or "").strip()
        if rarity not in ITEM_TIERS or v.get("Unused"):
            continue
        # Engine-internal entries (difficulty helpers, hidden buff carriers such
        # as BoostDamage or DrizzlePlayerHelper) are the only ones with neither
        # a description nor a pickup quote. Every real pickup has both.
        if not (v.get("Desc") or v.get("Quote")):
            continue
        stats, proc = build_stats(v.get("Stats"))
        cats = [c for c in (v.get("Category") or []) if c in REAL_CATEGORIES]
        item = {
            "name": name,
            "icon": slug(name),
            "kind": "item",
            "tier": rarity,
            "id": v.get("ID"),
            "quote": v.get("Quote") or "",
            "desc": render_markup(v.get("Desc") or ""),
            "search": plain(f"{name} {v.get('Quote') or ''} {v.get('Desc') or ''}").lower(),
            "categories": cats,
            "expansion": EXPANSIONS.get(v.get("Expansion"), v.get("Expansion")),
            "stats": stats,
        }
        for src, dst in (("Unlock", "unlock"), ("Corrupt", "corrupt"),
                         ("Uncorrupt", "uncorrupt"), ("Boss", "boss")):
            if v.get(src):
                item[dst] = v[src]
        if proc is not None:
            item["proc"] = proc
        if v.get("Consumed"):
            item["consumed"] = True
        items.append(item)
    items.sort(key=lambda i: (ITEM_TIERS.index(i["tier"]), i["name"]))
    return items


def build_equipment(raw):
    out = []
    for name, v in raw["equipment"].items():
        rarity = (v.get("Rarity") or "").strip()
        if rarity not in EQUIP_TIERS:
            continue
        entry = {
            "name": v.get("Name") or name,
            "icon": slug(v.get("Name") or name),
            "kind": "equipment",
            "tier": rarity,
            "id": v.get("ID"),
            "quote": v.get("Quote") or "",
            "desc": render_markup(v.get("Desc") or ""),
            "search": plain(f"{name} {v.get('Quote') or ''} {v.get('Desc') or ''}").lower(),
            "categories": [],
            "expansion": EXPANSIONS.get(v.get("Expansion"), v.get("Expansion")),
            "stats": [],
        }
        for src, dst in (("Cooldown", "cooldown"), ("Duration", "duration"),
                         ("Unlock", "unlock"), ("Elite", "elite")):
            if v.get(src) is not None:
                entry[dst] = v[src]
        out.append(entry)
    out.sort(key=lambda e: (EQUIP_TIERS.index(e["tier"]), e["name"]))
    return out


def build_artifacts(raw):
    out = []
    for name, v in raw["artifact"].items():
        code = v.get("Code") or []
        out.append({
            "name": name,
            "desc": render_markup(v.get("Desc") or ""),
            "id": v.get("Internal"),
            # 3 rows of 3 glyphs -> flat 9-cell grid
            "code": [ch for row in code for ch in str(row)],
            "expansion": EXPANSIONS.get(v.get("Expansion"), v.get("Expansion")),
        })
    out.sort(key=lambda a: a["name"])
    return out


SKILL_ORDER = ["Passive", "Primary", "Secondary", "Utility", "Special"]


def build_survivors(raw, skills_raw):
    by_survivor: dict[str, list] = {}
    for name, v in (skills_raw.get("skills") or {}).items():
        owner = v.get("Survivor")
        if not owner:
            continue
        by_survivor.setdefault(owner, []).append({
            "name": v.get("Name") or name,
            "type": v.get("Type") or "",
            "desc": render_markup(v.get("Desc") or ""),
            "unlock": v.get("Unlock") or "",
        })
    for group in by_survivor.values():
        group.sort(key=lambda s: (
            SKILL_ORDER.index(s["type"]) if s["type"] in SKILL_ORDER else len(SKILL_ORDER),
            s["name"],
        ))

    out = []
    for name, v in raw["Survivors"].items():
        out.append({
            "name": v.get("Name") or name,
            "desc": v.get("Description") or "",
            "health": v.get("BaseHealth"),
            "healthScaling": v.get("ScalingHealth"),
            "damage": v.get("BaseDamage"),
            "damageScaling": v.get("ScalingDamage"),
            "regen": v.get("BaseHealthRegen"),
            "regenScaling": v.get("ScalingHealthRegen"),
            "armor": v.get("BaseArmor"),
            "speed": v.get("BaseSpeed"),
            "mass": v.get("Mass"),
            "umbra": v.get("Umbra") or "",
            "expansion": EXPANSIONS.get(v.get("Expansion"), v.get("Expansion")),
            "skills": by_survivor.get(v.get("Name") or name, []),
        })
    out.sort(key=lambda s: s["name"])
    return out


def build_challenges(raw):
    out = []
    for name, v in raw["challenges"].items():
        unlock = v.get("Unlock")
        if isinstance(unlock, str):
            unlock = [unlock]
        out.append({
            "name": name,
            "desc": render_markup(v.get("Desc") or ""),
            "type": v.get("Type") or "Other",
            "unlocks": unlock or [],
            "expansion": EXPANSIONS.get(v.get("Expansion"), v.get("Expansion")),
        })
    out.sort(key=lambda c: (c["type"], c["name"]))
    return out


def build_environments(raw):
    out = []
    for name, v in (raw.get("Environments") or {}).items():
        stage = v.get("Stage")
        out.append({
            "name": v.get("Name") or name,
            "subtitle": v.get("SubName") or "",
            "stage": str(stage) if stage is not None else "",
            "desc": v.get("Description") or "",
            "hidden": bool(v.get("HiddenRealm")),
            "soundtrack": v.get("Soundtrack") or "",
            "expansion": EXPANSIONS.get(v.get("Expansion"), v.get("Expansion")),
        })
    out.sort(key=lambda e: (e["stage"], e["name"]))
    return out


def main() -> int:
    print("Building Risk of Rain 2 data...", file=sys.stderr)
    mods = {m: load_module(m) for m in MODULES}

    data = {
        "source": WIKI,
        "items": build_items(mods["Items/Data"]),
        "equipment": build_equipment(mods["Equipment/Data"]),
        "artifacts": build_artifacts(mods["Artifacts/Data"]),
        "survivors": build_survivors(mods["Survivors/Data"], mods["Skills/Data"]),
        "challenges": build_challenges(mods["Challenges/Data"]),
        "environments": build_environments(mods["Environments/Data"]),
        "itemTiers": ITEM_TIERS,
        "equipTiers": EQUIP_TIERS,
    }

    OUT.parent.mkdir(exist_ok=True)
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    OUT.write_text(
        "/* Generated by tools/build_data.py from " + WIKI + " -- do not edit by hand. */\n"
        "window.ROR2_DATA = " + payload + ";\n",
        encoding="utf-8",
    )

    print(
        "  {items} items, {eq} equipment, {art} artifacts, {sv} survivors, "
        "{ch} challenges, {env} environments".format(
            items=len(data["items"]), eq=len(data["equipment"]),
            art=len(data["artifacts"]), sv=len(data["survivors"]),
            ch=len(data["challenges"]), env=len(data["environments"]),
        ),
        file=sys.stderr,
    )
    print(f"  wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.0f} KB)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
