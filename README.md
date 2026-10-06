# Petrichor Field Guide

**[ror2.buford.dev](https://ror2.buford.dev)** — a second-screen companion for
Risk of Rain 2, made to sit on a phone or tablet next to the game.

I'm new to Risk of Rain 2. I built this for co-op runs with a friend because I
kept losing track of two things: what was in my inventory, and what I should be
going for on each survivor. So it does those well:

- **Recommended builds for every survivor** — loadout, core items by role,
  reds, boss items, equipment, what to skip, and a few tips.
- **Run tracking** — pick a survivor's build as your target, tap items in as
  you pick them up, and see what's still missing (grouped by tier, so you know
  what to print with your scrap) and what you should scrap.
- **Real stack maths** for every item, a build planner that totals what a build
  actually gives you, survivor stats at level, artifact codes and an unlock
  tracker.
- **Share a build** as a link, or copy it as text to ask someone for advice.

### The builds are starting points, not gospel

They were researched from the [community wiki](https://riskofrain2.wiki.gg) and
recent guides for patch 1.4.1, and each build lists its sources. Some survivors
(Drifter and Operator especially) have very little written about them yet, and
where sources disagreed the build says so. If you know better — and many of you
will — please
[open an issue](https://github.com/bufordeeds/petrichor-field-guide/issues/new/choose)
or a pull request. Changes land in the site's "What's new" page.

## Running it

No build step, no dependencies, no network. Open `index.html` and it works —
including straight off the filesystem, which is the point: it should load
instantly on a phone or a second monitor mid-run.

```
open index.html                 # or drag it into a browser
python3 -m http.server 8000     # if you'd rather serve it
python3 tools/bundle.py         # -> dist/ror2-companion.html, one portable file
```

`tools/bundle.py` inlines the stylesheet, the app, the data and every icon (as
data URIs) into a single ~1.9 MB HTML file with no sibling dependencies — handy
for dropping on a phone or hosting anywhere static.

## What's in it

| Tab | What it does |
|---|---|
| **Items** | All 183 items and 44 equipment as an icon grid grouped by tier, searchable by name or effect and filterable by category and DLC. Each one opens a stack calculator. |
| **Build** | Track the run you are carrying against a target build: what is still missing (grouped by tier, with one-tap +1), what is short on stacks, and anything on the survivor's skip list. Totals aggregate attack speed, crit, block chance, armor, movement speed, health. Targets are kept per survivor; save a run as your own target or go back to the recommended one. "Copy build" puts all of it on the clipboard as plain text. Saved locally. |
| **Crew** | All 19 survivors with base stats, per-level scaling, every loadout skill plus its unlock, and a recommended build (loadout, core items by role, reds/boss/equipment, items to skip, tips, a fun alt). Build items open the stack calculator, and "Track this build" makes it the Build tab's target without touching your run. |
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
pip install lupa pillow
python3 tools/build_data.py     # re-fetches and regenerates data/ror2-data.js
python3 tools/fetch_icons.py    # downloads any icons not already in assets/
```

`tools/fetch_icons.py` pulls each item's icon through the same wiki's image API
and writes it as a 96px WebP — the full set is about 1.1 MB rather than the
~12 MB the originals weigh. Icons already on disk are skipped, and an item
whose icon cannot be found renders as a tier-coloured tile with its initials,
so a miss degrades instead of breaking.

Re-run both after a patch or a new DLC. Responses are cached in `tools/.cache/`;
delete that directory to force a fresh fetch. The build drops engine-internal
entries (difficulty helpers and hidden buff carriers like `DrizzlePlayerHelper`,
which have no description or pickup quote) and cut content, keeping only real
pickups.

Source: [riskofrain2.wiki.gg](https://riskofrain2.wiki.gg), including its
[Item Stacking](https://riskofrain2.wiki.gg/wiki/Item_Stacking) page for the
formulas above. Item art is from the game and belongs to Hopoo Games / Gearbox
Publishing; it is used here for a free, unofficial fan reference. This project
is not affiliated with either.

## Survivor builds

`data/ror2-builds.js` is the one hand-written data file. It is kept apart from
the generated `ror2-data.js` so a regenerate never wipes it. Builds are keyed by
survivor name; items are referenced by their wiki `id` (e.g. `Crowbar`,
`BossDamageBonus`), so a display-name change after a patch does not break the
links into the item reference. Loadout skills use the names in
`survivors[].skills`.

After a patch, edit the file and run:

```
python3 tools/check_builds.py   # flags unknown item ids / skill names, lists survivors with no build
```

CI runs the same check on every push and pull request.

## What's new and shared builds

`data/changelog.js` is the hand-written changelog, newest first. Add an entry
for anything a visitor would notice; the footer's "What's new" link shows how
many entries are newer than that visitor's last look.

"Copy link" on the Build tab encodes the run, the tracked survivor and (if the
survivor has one) a custom target into the URL fragment, e.g.
`#s=Engineer&r=Mushroom.3,ChainLightning.2&t=Mushroom.5,Syringe.5` — item wiki
ids with counts. Nothing is sent to the server. Opening such a link offers to
load the build and never overwrites a run without asking.

## Deploying

`.github/workflows/site.yml` runs on every push and pull request:

1. **Check** — syntax-checks the app and data files and runs
   `tools/check_builds.py`, so a build pointing at a renamed item fails CI.
2. **Deploy** (pushes to `main` only) — copies the site into `_site/`, stamps
   every `?v=` asset query in `index.html` with the commit hash so phones fetch
   fresh files instead of a cached copy, and publishes to GitHub Pages at
   `ror2.buford.dev`.

So the release process is: merge to `main`, add a line to `data/changelog.js`
if visitors would notice.

## Layout

```
index.html              page shell
app.css                 styles; palette is the game's own tier + keyword colours
app.js                  all five views, classic script so file:// works
data/ror2-data.js       generated game data (~270 KB)
data/ror2-builds.js     hand-curated survivor builds (~60 KB)
data/changelog.js       hand-written "What's new" entries
.github/workflows/      CI checks and the GitHub Pages deploy
assets/items/           227 item and equipment icons, 96px WebP (~1.1 MB)
tools/build_data.py     regenerates the data from the wiki
tools/fetch_icons.py    downloads and downscales the icons
tools/bundle.py         inlines everything into dist/ as a single file
tools/check_builds.py   validates the builds against the generated data
```

Deliberately classic `<script>` tags rather than ES modules, and data baked
into a `.js` file rather than fetched as JSON — browsers block both module
scripts and `fetch()` on `file://`, and offline-from-a-folder was a
requirement.

## License

Code and hand-written data are [MIT](LICENSE). Game names, descriptions and
art belong to Hopoo Games / Gearbox Publishing and are not covered.
