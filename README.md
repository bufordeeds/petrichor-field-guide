# Risk of Rain 2 companion

A second screen for a run: search any item and see what it actually does at
_N_ stacks, plan a build and get real totals, check survivor stats at level,
look up an artifact code, and tick off unlocks.

No build step, no dependencies, no network. Open `index.html` and it works —
including straight off the filesystem, which is the point: it should load
instantly on a phone or a second monitor mid-run.

```
open index.html                 # or drag it into a browser
python3 -m http.server 8000     # if you'd rather serve it
```

## What's in it

| Tab | What it does |
|---|---|
| **Items** | All 183 items and 44 equipment, searchable by name or effect, filterable by tier, category and DLC. Each one opens a stack calculator. |
| **Build** | Add items with counts and see the aggregate — attack speed, crit, block chance, armor, movement speed, health. Saved locally. |
| **Crew** | All 19 survivors with base stats, per-level scaling, and every loadout skill plus its unlock. |
| **Codes** | All 20 artifact codes, drawn as the 3×3 grids you enter on the Compound Generator. |
| **Unlocks** | All 171 challenges with what each one rewards, tracked with a progress bar. Saved locally. |

Everything persists to `localStorage` only — your build and your unlock ticks
stay in that browser, and the app renders fine when storage is unavailable.

## Stack maths

The interesting part. Stacking in Risk of Rain 2 is not all linear, and the
in-game tooltip rounds, so the real numbers differ from what the description
implies. The app uses the game's own formulas:

| Type | Formula | Example |
|---|---|---|
| Linear | `base + step × (x − 1)` | Soldier's Syringe ×6 → +90% attack speed |
| Hyperbolic | `1 − 1 / (1 + a·x)` | Tougher Times ×4 → 37.5% block, not 60% |

That second row is why this exists. One Tougher Times is **13.04%** block, not
the 15% the tooltip shows, and ten is exactly 60%.

Items whose stacking the wiki records as **Exponential**, **Reciprocal** or a
per-item **Special** formula are shown with their formula and per-stack
modifier but **no computed number** — those cases are individually defined and
a general implementation would produce confident wrong answers. The tab says so
where it applies.

The build planner totals only stats that genuinely add up. Bonus damage is
left out on purpose: the game files label Crowbar's conditional bonus, AtG's
missile hit and Gasoline's on-kill burn all as "damage", and those do not sum
into a single meaningful figure. Every total shown lists the items it came
from, so nothing is an unattributed number.

## Where the data comes from

`data/ror2-data.js` is generated, not hand-written. The community wiki keeps
its game data in Scribunto/Lua modules, which are machine-readable and track
the live game including all three DLC (Survivors of the Void, Seekers of the
Storm, Alloyed Collective). `tools/build_data.py` fetches those modules, runs
them in a sandboxed Lua runtime, normalises the result, and writes one file.

```
pip install lupa
python3 tools/build_data.py     # re-fetches and regenerates data/ror2-data.js
```

Re-run it after a patch or a new DLC. Responses are cached in `tools/.cache/`;
delete that directory to force a fresh fetch. The build drops engine-internal
entries (difficulty helpers and hidden buff carriers like `DrizzlePlayerHelper`,
which have no description or pickup quote) and cut content, keeping only real
pickups.

Source: [riskofrain2.wiki.gg](https://riskofrain2.wiki.gg), including its
[Item Stacking](https://riskofrain2.wiki.gg/wiki/Item_Stacking) page for the
formulas above.

## Layout

```
index.html              page shell
app.css                 styles; palette is the game's own tier + keyword colours
app.js                  all five views, classic script so file:// works
data/ror2-data.js       generated game data (~260 KB)
tools/build_data.py     regenerates the above from the wiki
```

Deliberately classic `<script>` tags rather than ES modules, and data baked
into a `.js` file rather than fetched as JSON — browsers block both module
scripts and `fetch()` on `file://`, and offline-from-a-folder was a
requirement.
