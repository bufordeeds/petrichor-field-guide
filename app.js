/* ===========================================================================
   Risk of Rain 2 companion

   A no-build, offline-capable second screen: item and equipment reference with
   real stack maths, a loadout planner that aggregates what a build actually
   gives you, survivor stats at level, the artifact codes, and an unlock
   tracker. Data comes from data/ror2-data.js (see tools/build_data.py).

   Written as a classic script on purpose — no modules, no fetch — so the page
   works when opened directly off the filesystem.
   ======================================================================== */
(function () {
  'use strict';

  var D = window.ROR2_DATA;
  if (!D) {
    document.body.textContent = 'Could not load game data (data/ror2-data.js).';
    return;
  }

  /* ---------------------------------------------------------------- helpers */

  var TIER_VAR = {
    'Common': 't-common',
    'Uncommon': 't-uncommon',
    'Legendary': 't-legendary',
    'Boss': 't-boss',
    'Lunar': 't-lunar',
    'Void': 't-void',
    'Meal': 't-meal',
    'Untiered': 't-untiered',
    'Equipment': 't-equipment',
    'Lunar Equipment': 't-lunarequip',
    'Elite Equipment': 't-eliteequip'
  };

  function tierColor(tier) {
    return 'var(--' + (TIER_VAR[tier] || 'line') + ')';
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'style') node.setAttribute('style', v);
        else if (k in node && k !== 'list' && typeof v !== 'string') node[k] = v;
        else node.setAttribute(k, v);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  /** Round to at most `places` decimals and drop trailing zeros. */
  function num(value, places) {
    if (value == null || !isFinite(value)) return '—';
    var p = places == null ? 2 : places;
    var rounded = Math.round(value * Math.pow(10, p)) / Math.pow(10, p);
    return String(rounded);
  }

  function icon(paths) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    paths.forEach(function (d) {
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d);
      svg.appendChild(p);
    });
    return svg;
  }

  var ICONS = {
    items: ['M12 2 3 7v10l9 5 9-5V7z', 'M3 7l9 5 9-5', 'M12 12v10'],
    loadout: ['M4 6h16', 'M4 12h16', 'M4 18h10', 'M18 15v6', 'M15 18h6'],
    survivors: ['M12 3a4 4 0 100 8 4 4 0 000-8z', 'M4 21a8 8 0 0116 0'],
    artifacts: ['M12 3l8 4.5v9L12 21l-8-4.5v-9z', 'M12 8.5v7', 'M9 10.2l6 3.6', 'M15 10.2l-6 3.6'],
    unlocks: ['M4 12.5l5 5L20 6.5'],
    search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M20 20l-4.2-4.2'],
    close: ['M6 6l12 12', 'M18 6L6 18'],
    plus: ['M12 5v14', 'M5 12h14']
  };

  /* Persisted state — always optional, the app works without it. */
  var store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem('ror2c.' + key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem('ror2c.' + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    }
  };

  /* -------------------------------------------------------- stacking maths */

  /* Formulas as documented at riskofrain2.wiki.gg/wiki/Item_Stacking.
     We only compute the two we can compute exactly for every item that
     carries them; the rest are shown with their formula, not a guess. */
  var STACK_NOTE = {
    'Linear': 'Linear — f(x) = base + step × (x − 1)',
    'Hyperbolic': 'Hyperbolic — f(x) = 1 − 1 / (1 + a·x)',
    'Exponential': 'Exponential — f(x) = aˣ',
    'Reciprocal': 'Reciprocal — f(x) = a / x',
    'Special': 'Special — this item uses its own formula',
    'None': 'Does not stack',
    'ProcCoeff': 'Proc coefficient'
  };

  function perStackAmount(stat) {
    return stat.addNum != null ? stat.addNum : stat.baseNum;
  }

  /** Can we produce a trustworthy number for this stat at N stacks? */
  function isComputable(stat) {
    if (stat.baseNum == null) return false;
    if (stat.stack === 'Linear') return stat.addNum != null;
    if (stat.stack === 'Hyperbolic') return stat.unit === '%' && perStackAmount(stat) > 0;
    return false;
  }

  function stackValue(stat, stacks) {
    if (!isComputable(stat)) return null;
    if (stat.stack === 'Linear') {
      return stat.baseNum + stat.addNum * (stacks - 1);
    }
    // Hyperbolic: a is the per-stack fraction; x is the number of items.
    var a = perStackAmount(stat) / 100;
    return (1 - 1 / (1 + a * stacks)) * 100;
  }

  function formatStat(stat, value) {
    if (value == null) return '—';
    var unit = stat.unit || '';
    var places = unit === '%' ? 2 : 2;
    return num(value, places) + (unit ? (unit === '%' ? '%' : ' ' + unit) : '');
  }

  /* ------------------------------------------------------------------ data */

  var ALL = D.items.concat(D.equipment);
  var BY_NAME = {};
  ALL.forEach(function (entry) { BY_NAME[entry.name] = entry; });

  var TIERS = D.itemTiers.concat(D.equipTiers);
  var EXPANSIONS = ['Base game', 'Survivors of the Void', 'Seekers of the Storm', 'Alloyed Collective'];

  var CATEGORY_LABEL = {
    'Damage': 'Damage', 'Healing': 'Healing', 'Utility': 'Utility',
    'Technology': 'Technology', 'MobilityRelated': 'Mobility',
    'SprintRelated': 'Sprint', 'OnKillEffect': 'On kill',
    'OnStageBeginEffect': 'On stage start', 'EquipmentRelated': 'Equipment',
    'HoldoutZoneRelated': 'Teleporter zone', 'InteractableRelated': 'Interactables',
    'LowHealth': 'Low health', 'Scrap': 'Scrap', 'WorldUnique': 'World unique'
  };

  var CATEGORIES = Object.keys(CATEGORY_LABEL).filter(function (key) {
    return ALL.some(function (entry) { return (entry.categories || []).indexOf(key) >= 0; });
  });

  /* ----------------------------------------------------------------- state */

  /* A first-time visitor should see the planner doing its job rather than an
     empty shell, so seed a plausible mid-run build. Clearing it sticks. */
  var SAMPLE_BUILD = [
    { name: 'Soldier\'s Syringe', count: 6 },
    { name: 'Lens-Maker\'s Glasses', count: 4 },
    { name: 'Paul\'s Goat Hoof', count: 5 },
    { name: 'Tougher Times', count: 4 },
    { name: 'Bison Steak', count: 3 },
    { name: 'Rose Buckler', count: 2 },
    { name: 'Crowbar', count: 3 }
  ];

  var state = {
    tab: store.get('tab', 'items'),
    query: '',
    tiers: [],
    category: '',
    expansion: '',
    selected: null,
    stacks: 1,
    loadout: store.get('loadout', null) || SAMPLE_BUILD.slice(),
    sampled: store.get('loadout', null) === null,
    survivor: null,
    level: 1,
    done: store.get('done', {}),
    unlockFilter: 'all',
    unlockQuery: ''
  };

  var TABS = [
    { id: 'items', label: 'Items', icon: 'items' },
    { id: 'loadout', label: 'Build', icon: 'loadout' },
    { id: 'survivors', label: 'Crew', icon: 'survivors' },
    { id: 'artifacts', label: 'Codes', icon: 'artifacts' },
    { id: 'unlocks', label: 'Unlocks', icon: 'unlocks' }
  ];

  if (!TABS.some(function (t) { return t.id === state.tab; })) state.tab = 'items';

  /* ------------------------------------------------------------------ shell */

  var main = document.getElementById('main');
  var railNav = document.getElementById('rail-tabs');
  var drawerHost = document.getElementById('drawer-host');

  TABS.forEach(function (tab) {
    var btn = el('button', {
      'class': 'tab',
      type: 'button',
      role: 'tab',
      id: 'tab-' + tab.id,
      'aria-selected': String(tab.id === state.tab),
      'aria-controls': 'main'
    }, [icon(ICONS[tab.icon]), el('span', { 'class': 'tab__label', text: tab.label })]);
    btn.addEventListener('click', function () { go(tab.id); });
    railNav.appendChild(btn);
  });

  function go(tabId) {
    state.tab = tabId;
    state.selected = null;
    state.survivor = null;
    store.set('tab', tabId);
    TABS.forEach(function (tab) {
      document.getElementById('tab-' + tab.id)
        .setAttribute('aria-selected', String(tab.id === tabId));
    });
    render();
  }

  /* ------------------------------------------------------------ items view */

  function matches(entry) {
    if (state.tiers.length && state.tiers.indexOf(entry.tier) < 0) return false;
    if (state.category && (entry.categories || []).indexOf(state.category) < 0) return false;
    if (state.expansion && entry.expansion !== state.expansion) return false;
    if (state.query) {
      var q = state.query.toLowerCase();
      if (entry.search.indexOf(q) < 0) return false;
    }
    return true;
  }

  function renderItems(view) {
    var results = ALL.filter(matches);

    view.appendChild(el('div', { 'class': 'view__head' }, [
      el('h1', { text: 'Items & Equipment' }),
      el('span', {
        'class': 'view__count',
        text: results.length + (results.length === 1 ? ' result' : ' results')
      }),
      el('p', {
        'class': 'view__note',
        text: 'Pick anything to see its stats at a chosen stack count. Stack maths '
            + 'is computed from the game’s own formulas, so a few numbers differ '
            + 'from the in-game tooltip — that is the tooltip rounding, not a bug.'
      })
    ]));

    /* search + selects */
    var search = el('input', {
      type: 'search', id: 'item-search', value: state.query,
      placeholder: 'Search name or effect…', 'aria-label': 'Search items'
    });
    search.addEventListener('input', function () {
      state.query = search.value;
      repaintGrid();
    });

    var catSel = el('select', { id: 'item-category', 'aria-label': 'Filter by category' },
      [el('option', { value: '', text: 'All categories' })].concat(
        CATEGORIES.map(function (key) {
          return el('option', {
            value: key, text: CATEGORY_LABEL[key],
            selected: state.category === key
          });
        })
      ));
    catSel.addEventListener('change', function () {
      state.category = catSel.value;
      repaintGrid();
    });

    var expSel = el('select', { id: 'item-expansion', 'aria-label': 'Filter by expansion' },
      [el('option', { value: '', text: 'Base game + all DLC' })].concat(
        EXPANSIONS.map(function (name) {
          return el('option', { value: name, text: name, selected: state.expansion === name });
        })
      ));
    expSel.addEventListener('change', function () {
      state.expansion = expSel.value;
      repaintGrid();
    });

    view.appendChild(el('div', { 'class': 'controls' }, [
      el('div', { 'class': 'search' }, [icon(ICONS.search), search]),
      catSel, expSel
    ]));

    /* tier chips double as the tier colour legend */
    var chips = el('div', { 'class': 'chips' });
    TIERS.forEach(function (tier) {
      var total = ALL.filter(function (e) { return e.tier === tier; }).length;
      if (!total) return;
      var on = state.tiers.indexOf(tier) >= 0;
      var chip = el('button', {
        'class': 'chip', type: 'button', 'aria-pressed': String(on),
        style: '--chip-color:' + tierColor(tier)
      }, [
        el('span', { text: tier }),
        el('span', { 'class': 'chip__n', text: String(total) })
      ]);
      chip.addEventListener('click', function () {
        var at = state.tiers.indexOf(tier);
        if (at >= 0) state.tiers.splice(at, 1); else state.tiers.push(tier);
        chip.setAttribute('aria-pressed', String(at < 0));
        repaintGrid();
      });
      chips.appendChild(chip);
    });
    view.appendChild(chips);

    var grid = el('div', { id: 'item-grid' });
    view.appendChild(grid);

    function repaintGrid() {
      var list = ALL.filter(matches);
      view.querySelector('.view__count').textContent =
        list.length + (list.length === 1 ? ' result' : ' results');
      clear(grid);
      if (!list.length) {
        grid.appendChild(el('p', {
          'class': 'empty',
          text: 'Nothing matches those filters. Try clearing a tier or the search box.'
        }));
        return;
      }
      /* Grouped by tier: a flat grid of 227 icons is a wall, and tier is the
         first thing you sort by in your head anyway. */
      TIERS.forEach(function (tier) {
        var rows = list.filter(function (entry) { return entry.tier === tier; });
        if (!rows.length) return;
        var tiles = el('div', { 'class': 'igrid' });
        rows.forEach(function (entry) { tiles.appendChild(itemTile(entry)); });
        grid.appendChild(el('section', {
          'class': 'tiergroup', style: '--tier:' + tierColor(tier)
        }, [
          el('h2', { 'class': 'tiergroup__h' }, [
            el('span', { text: tier }),
            el('span', { 'class': 'tiergroup__n', text: String(rows.length) })
          ]),
          tiles
        ]));
      });
    }

    repaintGrid();
  }

  /** Where an entry's icon lives — a bundled data URI, or the assets folder. */
  function iconURL(entry) {
    if (!entry.icon) return null;
    if (window.ROR2_ICONS && window.ROR2_ICONS[entry.icon]) {
      return window.ROR2_ICONS[entry.icon];
    }
    return 'assets/items/' + entry.icon + '.webp';
  }

  function initials(name) {
    return name.split(/[\s-]+/).slice(0, 2).map(function (word) {
      return word.charAt(0).toUpperCase();
    }).join('');
  }

  function itemTile(entry) {
    var label = entry.name + ' — ' + entry.tier;
    var tile = el('button', {
      'class': 'tile', type: 'button',
      title: label, 'aria-label': label,
      'data-name': entry.name,
      style: '--tier:' + tierColor(entry.tier),
      'aria-current': String(state.selected === entry.name)
    });

    var src = iconURL(entry);
    if (src) {
      var img = el('img', { src: src, alt: '', loading: 'lazy', decoding: 'async' });
      /* A missing icon falls back to initials rather than a broken-image box. */
      img.addEventListener('error', function () {
        img.remove();
        tile.appendChild(el('span', { 'class': 'tile__abbr', text: initials(entry.name) }));
      });
      tile.appendChild(img);
    } else {
      tile.appendChild(el('span', { 'class': 'tile__abbr', text: initials(entry.name) }));
    }

    tile.addEventListener('click', function () { select(entry.name); });
    return tile;
  }

  function dlcShort(name) {
    if (name === 'Survivors of the Void') return 'SotV';
    if (name === 'Seekers of the Storm') return 'SotS';
    if (name === 'Alloyed Collective') return 'Alloyed';
    return name;
  }

  /* ---------------------------------------------------------------- drawer */

  function markSelected(name) {
    Array.prototype.forEach.call(document.querySelectorAll('.tile'), function (tile) {
      tile.setAttribute('aria-current', String(tile.getAttribute('data-name') === name));
    });
  }

  function select(name) {
    state.selected = name;
    state.stacks = 1;
    markSelected(name);
    paintDrawer();
  }

  function closeDrawer() {
    state.selected = null;
    clear(drawerHost);
    markSelected(null);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && state.selected) closeDrawer();
  });

  function drawerIcon(entry) {
    var src = iconURL(entry);
    return src ? el('img', { 'class': 'drawer__icon', src: src, alt: '' }) : null;
  }

  function paintDrawer() {
    clear(drawerHost);
    var entry = BY_NAME[state.selected];
    if (!entry) return;

    var closeBtn = el('button', {
      'class': 'iconbtn', type: 'button', 'aria-label': 'Close details'
    }, [icon(ICONS.close)]);
    closeBtn.addEventListener('click', closeDrawer);

    var subParts = [entry.tier];
    if (entry.expansion) subParts.push(entry.expansion);

    var body = el('div', { 'class': 'drawer__body' });

    body.appendChild(el('p', { 'class': 'drawer__desc', html: entry.desc || entry.quote || '' }));

    /* equipment cooldown / duration */
    if (entry.cooldown != null || entry.duration != null) {
      var facts = el('div', { 'class': 'statgrid' });
      if (entry.cooldown != null) {
        facts.appendChild(el('div', { 'class': 'stat' }, [
          el('span', { 'class': 'stat__k', text: 'Cooldown' }),
          el('span', { 'class': 'stat__v', text: entry.cooldown + 's' })
        ]));
      }
      if (entry.duration != null) {
        facts.appendChild(el('div', { 'class': 'stat' }, [
          el('span', { 'class': 'stat__k', text: 'Duration' }),
          el('span', { 'class': 'stat__v', text: entry.duration + 's' })
        ]));
      }
      if (entry.proc != null) {
        facts.appendChild(el('div', { 'class': 'stat' }, [
          el('span', { 'class': 'stat__k', text: 'Proc coeff.' }),
          el('span', { 'class': 'stat__v', text: num(entry.proc, 2) })
        ]));
      }
      body.appendChild(facts);
    } else if (entry.proc != null) {
      body.appendChild(el('div', { 'class': 'statgrid' }, [
        el('div', { 'class': 'stat' }, [
          el('span', { 'class': 'stat__k', text: 'Proc coefficient' }),
          el('span', { 'class': 'stat__v', text: num(entry.proc, 2) })
        ])
      ]));
    }

    /* stack calculator */
    if (entry.stats && entry.stats.length) {
      var block = el('div', { 'class': 'block' });
      block.appendChild(el('h3', { 'class': 'block__h', text: 'Stats at stack count' }));

      var out = el('output', { 'for': 'stack-dec stack-inc', text: String(state.stacks) });
      var dec = el('button', { type: 'button', id: 'stack-dec', 'aria-label': 'One fewer stack', text: '−' });
      var inc = el('button', { type: 'button', id: 'stack-inc', 'aria-label': 'One more stack', text: '+' });
      var tbody = el('tbody');

      function paintRows() {
        out.textContent = String(state.stacks);
        dec.disabled = state.stacks <= 1;
        clear(tbody);
        entry.stats.forEach(function (stat) {
          var computed = stackValue(stat, state.stacks);
          tbody.appendChild(el('tr', null, [
            el('td', null, [
              el('div', { text: stat.stat }),
              el('div', {
                'class': 'stat__sub',
                text: STACK_NOTE[stat.stack] || stat.stack
              })
            ]),
            el('td', { 'class': 'num', text: stat.add || stat.base || '—' }),
            el('td', {
              'class': 'num',
              style: computed != null ? 'color:var(--accent);font-weight:700' : '',
              text: computed != null ? formatStat(stat, computed) : '—'
            })
          ]));
        });
      }

      dec.addEventListener('click', function () {
        if (state.stacks > 1) { state.stacks--; paintRows(); }
      });
      inc.addEventListener('click', function () {
        if (state.stacks < 99) { state.stacks++; paintRows(); }
      });

      block.appendChild(el('div', { 'class': 'stackrow' }, [
        el('span', { 'class': 'stackrow__label', text: 'Stacks' }),
        el('div', { 'class': 'stepper' }, [dec, out, inc])
      ]));

      block.appendChild(el('div', { 'class': 'tablewrap' }, [
        el('table', null, [
          el('thead', null, [
            el('tr', null, [
              el('th', { text: 'Stat' }),
              el('th', { 'class': 'num', text: 'Per stack' }),
              el('th', { 'class': 'num', text: 'At ' }, [])
            ])
          ]),
          tbody
        ])
      ]));

      /* keep the "At N" header in sync */
      var atN = block.querySelector('thead th:last-child');
      var syncHeader = function () { atN.textContent = 'At ' + state.stacks; };
      dec.addEventListener('click', syncHeader);
      inc.addEventListener('click', syncHeader);

      paintRows();
      syncHeader();

      var uncomputed = entry.stats.filter(function (s) { return !isComputable(s); });
      if (uncomputed.length) {
        block.appendChild(el('p', {
          'class': 'callout',
          text: 'Rows without a computed value stack in a way the wiki records as a '
              + 'per-item formula rather than a general one, so the per-stack modifier '
              + 'is shown instead of a number we would have to guess at.'
        }));
      }

      body.appendChild(block);
    }

    /* unlock / corruption relationships */
    var rel = [];
    if (entry.unlock) rel.push(['Unlocked by', entry.unlock]);
    if (entry.boss) rel.push(['Dropped by', entry.boss]);
    if (entry.corrupt) rel.push(['Corrupted by', entry.corrupt]);
    if (entry.uncorrupt) rel.push(['Corrupts', Array.isArray(entry.uncorrupt) ? entry.uncorrupt.join(', ') : entry.uncorrupt]);
    if (entry.consumed) rel.push(['Consumed', 'Single use — consumed on trigger']);
    if (rel.length) {
      var relBlock = el('div', { 'class': 'block' }, [
        el('h3', { 'class': 'block__h', text: 'Details' })
      ]);
      var relTable = el('tbody');
      rel.forEach(function (pair) {
        var valueCell;
        if ((pair[0] === 'Corrupted by' || pair[0] === 'Corrupts') && BY_NAME[pair[1]]) {
          var jump = el('button', { 'class': 'linkish', type: 'button', text: pair[1] });
          jump.addEventListener('click', function () { select(pair[1]); });
          valueCell = el('td', null, [jump]);
        } else {
          valueCell = el('td', { text: pair[1] });
        }
        relTable.appendChild(el('tr', null, [el('th', { text: pair[0] }), valueCell]));
      });
      relBlock.appendChild(el('div', { 'class': 'tablewrap' }, [el('table', null, [relTable])]));
      body.appendChild(relBlock);
    }

    /* add to build */
    var addBtn = el('button', { 'class': 'btn btn--primary', type: 'button' },
      [icon(ICONS.plus), el('span', { text: 'Add to build' })]);
    addBtn.addEventListener('click', function () {
      addToLoadout(entry.name);
      addBtn.querySelector('span').textContent = 'Added to build';
      window.setTimeout(function () {
        var label = addBtn.querySelector('span');
        if (label) label.textContent = 'Add to build';
      }, 1400);
    });
    body.appendChild(el('div', null, [addBtn]));

    drawerHost.appendChild(el('aside', {
      'class': 'drawer', role: 'dialog', 'aria-label': entry.name + ' details',
      style: '--tier:' + tierColor(entry.tier)
    }, [
      el('div', { 'class': 'drawer__bar' }, [
        drawerIcon(entry),
        el('div', { 'class': 'drawer__title' }, [
          el('h2', { text: entry.name }),
          el('div', { 'class': 'drawer__sub', text: subParts.join(' · ') })
        ]),
        closeBtn
      ]),
      body
    ]));
  }

  /* --------------------------------------------------------- loadout view */

  function addToLoadout(name) {
    var row = state.loadout.filter(function (r) { return r.name === name; })[0];
    if (row) row.count++;
    else state.loadout.push({ name: name, count: 1 });
    state.sampled = false;
    store.set('loadout', state.loadout);
    if (state.tab === 'loadout') render();
  }

  function setCount(name, count) {
    state.loadout = state.loadout.map(function (row) {
      return row.name === name ? { name: name, count: count } : row;
    }).filter(function (row) { return row.count > 0; });
    state.sampled = false;
    store.set('loadout', state.loadout);
    render();
  }

  /**
   * Aggregate a build into per-stat totals.
   * Linear percentage bonuses are additive in game, so they sum. Hyperbolic
   * chances are independent probabilities, so they combine as
   * 1 - product(1 - p). Stats we cannot compute exactly are left out and
   * reported separately rather than folded in with a guess.
   */
  function aggregate() {
    var buckets = {};
    var skipped = [];

    state.loadout.forEach(function (row) {
      var entry = BY_NAME[row.name];
      if (!entry) return;
      (entry.stats || []).forEach(function (stat) {
        if (!stat.canon) {
          return;
        }
        if (!isComputable(stat)) {
          skipped.push(entry.name + ' — ' + stat.stat);
          return;
        }
        var key = stat.canon + '|' + (stat.unit || '');
        if (!buckets[key]) {
          buckets[key] = {
            label: stat.canon, unit: stat.unit || '',
            linear: 0, hyper: [], parts: [], kinds: {}
          };
        }
        var bucket = buckets[key];
        var value = stackValue(stat, row.count);
        bucket.kinds[stat.stack] = true;
        if (stat.stack === 'Hyperbolic') bucket.hyper.push(value / 100);
        else bucket.linear += value;
        bucket.parts.push({ name: entry.name, count: row.count, value: value, stack: stat.stack });
      });
    });

    return Object.keys(buckets).map(function (key) {
      var bucket = buckets[key];
      var total = bucket.linear;
      if (bucket.hyper.length) {
        var miss = 1;
        bucket.hyper.forEach(function (p) { miss *= (1 - p); });
        total += (1 - miss) * 100;
      }
      bucket.total = total;
      bucket.hyperbolic = bucket.hyper.length > 0;
      return bucket;
    }).sort(function (a, b) { return a.label.localeCompare(b.label); }).concat();
  }

  function renderLoadout(view) {
    var totalItems = state.loadout.reduce(function (sum, row) { return sum + row.count; }, 0);

    view.appendChild(el('div', { 'class': 'view__head' }, [
      el('h1', { text: 'Build Planner' }),
      el('span', {
        'class': 'view__count',
        text: totalItems + (totalItems === 1 ? ' item' : ' items')
      }),
      el('p', {
        'class': 'view__note',
        text: 'Add items and set how many of each you are carrying. Totals use the '
            + 'game’s stacking rules: additive bonuses sum, chance-based ones '
            + 'combine as independent probabilities.'
      })
    ]));

    /* add row */
    var picker = el('select', { id: 'loadout-pick', 'aria-label': 'Add an item to the build' },
      [el('option', { value: '', text: 'Add an item…' })].concat(
        TIERS.filter(function (tier) {
          return ALL.some(function (e) { return e.tier === tier; });
        }).map(function (tier) {
          return el('optgroup', { label: tier }, ALL.filter(function (e) {
            return e.tier === tier;
          }).map(function (e) {
            return el('option', { value: e.name, text: e.name });
          }));
        })
      ));
    picker.addEventListener('change', function () {
      if (picker.value) { addToLoadout(picker.value); }
    });

    var controls = el('div', { 'class': 'controls' }, [picker]);
    if (state.loadout.length) {
      var clearBtn = el('button', {
        'class': 'btn btn--ghost', type: 'button',
        text: state.sampled ? 'Clear example' : 'Clear build'
      });
      clearBtn.addEventListener('click', function () {
        state.loadout = [];
        state.sampled = false;
        store.set('loadout', state.loadout);
        render();
      });
      controls.appendChild(clearBtn);
    }
    view.appendChild(controls);

    if (state.sampled) {
      view.appendChild(el('p', {
        'class': 'callout', style: 'margin:0 0 14px',
        text: 'This is an example build so the totals have something to show. '
            + 'Change any count, or clear it, and it becomes yours.'
      }));
    }

    if (!state.loadout.length) {
      view.appendChild(el('p', {
        'class': 'empty',
        text: 'No items yet. Add one above, or open any item on the Items tab and choose “Add to build”.'
      }));
      return;
    }

    /* item list */
    var list = el('div', { 'class': 'loadout__list' });
    state.loadout.forEach(function (row) {
      var entry = BY_NAME[row.name];
      if (!entry) return;

      var out = el('output', { text: String(row.count) });
      var dec = el('button', { type: 'button', 'aria-label': 'One fewer ' + entry.name, text: '−' });
      var inc = el('button', { type: 'button', 'aria-label': 'One more ' + entry.name, text: '+' });
      dec.addEventListener('click', function () { setCount(row.name, row.count - 1); });
      inc.addEventListener('click', function () { setCount(row.name, row.count + 1); });

      var remove = el('button', {
        'class': 'iconbtn', type: 'button', 'aria-label': 'Remove ' + entry.name
      }, [icon(ICONS.close)]);
      remove.addEventListener('click', function () { setCount(row.name, 0); });

      var rowIcon = iconURL(entry);
      list.appendChild(el('div', {
        'class': 'loadout__row', style: '--tier:' + tierColor(entry.tier)
      }, [
        rowIcon ? el('img', { 'class': 'loadout__icon', src: rowIcon, alt: '', loading: 'lazy' }) : null,
        el('span', { 'class': 'loadout__name', text: entry.name }),
        el('div', { 'class': 'stepper' }, [dec, out, inc]),
        remove
      ]));
    });

    /* totals */
    var totals = aggregate();
    var summary = el('div', { 'class': 'panel panel--sticky' }, [
      el('h2', { 'class': 'block__h', text: 'What this build gives you' })
    ]);

    if (!totals.length) {
      summary.appendChild(el('p', {
        'class': 'callout',
        text: 'None of these items carry a stat we can total exactly. Their effects '
            + 'are described on the Items tab.'
      }));
    } else {
      var rows = el('div', { 'class': 'totals' });
      totals.forEach(function (bucket) {
        var valueText = num(bucket.total, 2) + (bucket.unit === '%' ? '%' : (bucket.unit ? ' ' + bucket.unit : ''));
        var valueCell = el('span', { 'class': 'total__v', text: valueText });
        if (bucket.hyperbolic) {
          valueCell.appendChild(el('span', { 'class': 'total__note', text: 'hyperbolic' }));
        }
        /* Always show where a total came from — an unattributed number invites
           the reader to trust a sum across effects that may not be comparable. */
        var parts = bucket.parts.map(function (part) {
          return part.name + (part.count > 1 ? ' ×' + part.count : '');
        }).join(', ');
        rows.appendChild(el('div', { 'class': 'total' }, [
          el('span', { 'class': 'total__k' }, [
            el('span', { text: bucket.label }),
            el('span', { 'class': 'total__from', text: parts })
          ]),
          valueCell
        ]));
      });
      summary.appendChild(rows);
      summary.appendChild(el('p', {
        'class': 'callout',
        text: 'Only stats that genuinely add up appear here. Bonus damage is left '
            + 'out on purpose: the game files label Crowbar’s conditional bonus, '
            + 'AtG’s missile hit and Gasoline’s on-kill burn all as '
            + '“damage”, and those do not sum into one number.'
      }));
    }

    view.appendChild(el('div', { 'class': 'split' }, [list, summary]));
  }

  /* ------------------------------------------------------- survivors view */

  function renderSurvivors(view) {
    view.appendChild(el('div', { 'class': 'view__head' }, [
      el('h1', { text: 'Survivors' }),
      el('span', { 'class': 'view__count', text: D.survivors.length + ' playable' }),
      el('p', {
        'class': 'view__note',
        text: 'Base stats with the per-level scaling the game applies, plus every '
            + 'loadout skill and what unlocks it.'
      })
    ]));

    var grid = el('div', { 'class': 'grid' });
    D.survivors.forEach(function (survivor) {
      var meta = el('div', { 'class': 'card__meta' }, [
        el('span', { 'class': 'tag', text: survivor.health + ' HP' }),
        el('span', { 'class': 'tag', text: survivor.damage + ' DMG' })
      ]);
      if (survivor.expansion && survivor.expansion !== 'Base game') {
        meta.appendChild(el('span', { 'class': 'tag tag--dlc', text: dlcShort(survivor.expansion) }));
      }
      var card = el('button', {
        'class': 'card', type: 'button',
        style: '--tier:var(--accent)',
        'aria-current': String(state.survivor === survivor.name)
      }, [
        el('div', { 'class': 'card__name', style: 'color:var(--ink)', text: survivor.name }),
        el('div', { 'class': 'card__quote', text: survivor.desc || '' }),
        meta
      ]);
      card.addEventListener('click', function () {
        state.survivor = survivor.name;
        state.level = 1;
        render();
      });
      grid.appendChild(card);
    });
    view.appendChild(grid);

    if (!state.survivor) return;
    var chosen = D.survivors.filter(function (s) { return s.name === state.survivor; })[0];
    if (!chosen) return;
    var panel = survivorPanel(chosen);
    view.appendChild(panel);
    /* The panel lands below the whole grid, so bring it into view — otherwise
       picking a survivor looks like nothing happened. */
    window.requestAnimationFrame(function () {
      panel.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  }

  function survivorPanel(survivor) {
    var panel = el('div', { 'class': 'panel', style: 'margin-top:20px' });

    var head = el('div', { 'class': 'view__head', style: 'margin-bottom:4px' }, [
      el('h1', { style: 'font-size:20px', text: survivor.name })
    ]);
    var close = el('button', { 'class': 'iconbtn', type: 'button', 'aria-label': 'Close survivor details' }, [icon(ICONS.close)]);
    close.addEventListener('click', function () { state.survivor = null; render(); });
    head.appendChild(close);
    panel.appendChild(head);

    if (survivor.umbra) {
      panel.appendChild(el('p', {
        'class': 'view__note', style: 'margin:0',
        text: 'Umbra: “' + survivor.umbra + '”'
      }));
    }

    /* level scaling: stat = base + scaling x (level - 1) */
    var slider = el('input', {
      type: 'range', min: '1', max: '50', step: '1', value: String(state.level),
      id: 'level-slider', 'aria-label': 'Survivor level'
    });
    var readout = el('span', { 'class': 'slider__v', text: 'Level ' + state.level });
    var statgrid = el('div', { 'class': 'statgrid' });

    function paintStats() {
      readout.textContent = 'Level ' + state.level;
      var lv = state.level - 1;
      clear(statgrid);
      var cells = [
        ['Health', survivor.health + survivor.healthScaling * lv, survivor.healthScaling, '/lvl'],
        ['Damage', survivor.damage + survivor.damageScaling * lv, survivor.damageScaling, '/lvl'],
        ['Regen', survivor.regen + survivor.regenScaling * lv, survivor.regenScaling, '/lvl hp/s'],
        ['Armor', survivor.armor, null, null],
        ['Speed', survivor.speed, null, 'm/s'],
        ['Mass', survivor.mass, null, null]
      ];
      cells.forEach(function (cell) {
        if (cell[1] == null) return;
        var sub = cell[2] != null
          ? '+' + num(cell[2], 2) + ' ' + cell[3]
          : (cell[3] || '—');
        statgrid.appendChild(el('div', { 'class': 'stat' }, [
          el('span', { 'class': 'stat__k', text: cell[0] }),
          el('span', { 'class': 'stat__v', text: num(cell[1], 2) }),
          el('span', { 'class': 'stat__sub', text: sub })
        ]));
      });
    }

    slider.addEventListener('input', function () {
      state.level = parseInt(slider.value, 10) || 1;
      paintStats();
    });
    paintStats();

    panel.appendChild(el('div', { 'class': 'slider' }, [readout, slider]));
    panel.appendChild(statgrid);

    if (survivor.skills && survivor.skills.length) {
      var skills = el('div', { 'class': 'block' }, [
        el('h3', { 'class': 'block__h', text: 'Skills (' + survivor.skills.length + ')' })
      ]);
      survivor.skills.forEach(function (skill) {
        var top = el('div', { 'class': 'skill__top' }, [
          skill.type ? el('span', { 'class': 'skill__type', text: skill.type }) : null,
          el('span', { 'class': 'skill__name', text: skill.name })
        ]);
        var node = el('div', { 'class': 'skill' }, [
          top,
          el('div', { 'class': 'skill__desc', html: skill.desc || '' }),
          skill.unlock ? el('div', { 'class': 'skill__unlock', text: 'Unlocked by: ' + skill.unlock }) : null
        ]);
        skills.appendChild(node);
      });
      panel.appendChild(skills);
    }

    return panel;
  }

  /* ------------------------------------------------------- artifacts view */

  var GLYPH = { '●': 'circle', '■': 'square', '♦': 'diamond', '▲': 'triangle' };
  var GLYPH_NAME = { circle: 'Circle', square: 'Square', diamond: 'Diamond', triangle: 'Triangle' };

  function codeGrid(code) {
    var grid = el('div', { 'class': 'code', role: 'img' });
    var names = [];
    code.forEach(function (ch) {
      var kind = GLYPH[ch] || 'circle';
      names.push(GLYPH_NAME[kind]);
      grid.appendChild(el('i', { 'data-g': kind }));
    });
    grid.setAttribute('aria-label', 'Code: ' + names.join(', '));
    return grid;
  }

  function renderArtifacts(view) {
    var withCodes = D.artifacts.filter(function (a) { return a.code && a.code.length === 9; });

    view.appendChild(el('div', { 'class': 'view__head' }, [
      el('h1', { text: 'Artifact Codes' }),
      el('span', { 'class': 'view__count', text: D.artifacts.length + ' artifacts' }),
      el('p', {
        'class': 'view__note',
        text: 'Read each grid left to right, top to bottom, and enter it on the '
            + 'Compound Generator in Sky Meadow to unlock the artifact.'
      })
    ]));

    var legend = el('div', { 'class': 'legend' });
    Object.keys(GLYPH_NAME).forEach(function (kind) {
      legend.appendChild(el('span', { 'class': 'legend__item' }, [
        el('span', { 'class': 'code' }, [el('i', { 'data-g': kind })]),
        el('span', { text: GLYPH_NAME[kind] })
      ]));
    });
    view.appendChild(legend);

    var grid = el('div', { 'class': 'artifacts' });
    D.artifacts.forEach(function (artifact) {
      var right = el('div', null, [
        el('h2', { 'class': 'artifact__name', text: artifact.name }),
        el('p', { 'class': 'artifact__desc', html: artifact.desc || '' })
      ]);
      if (artifact.expansion && artifact.expansion !== 'Base game') {
        right.appendChild(el('div', { 'class': 'card__meta' }, [
          el('span', { 'class': 'tag tag--dlc', text: dlcShort(artifact.expansion) })
        ]));
      }
      grid.appendChild(el('div', { 'class': 'artifact' }, [
        artifact.code && artifact.code.length === 9
          ? codeGrid(artifact.code)
          : el('div', { 'class': 'code', 'aria-label': 'No code' }),
        right
      ]));
    });
    view.appendChild(grid);

    if (withCodes.length !== D.artifacts.length) {
      view.appendChild(el('p', {
        'class': 'callout', style: 'margin-top:14px',
        text: (D.artifacts.length - withCodes.length) + ' of these have no compound '
            + 'code recorded — they are unlocked another way.'
      }));
    }
  }

  /* --------------------------------------------------------- unlocks view */

  function renderUnlocks(view) {
    var done = state.done;
    var total = D.challenges.length;
    var completed = D.challenges.filter(function (c) { return done[c.name]; }).length;

    view.appendChild(el('div', { 'class': 'view__head' }, [
      el('h1', { text: 'Unlock Tracker' }),
      el('span', { 'class': 'view__count', id: 'unlock-count', text: completed + ' of ' + total + ' done' }),
      el('p', {
        'class': 'view__note',
        text: 'Every challenge in the game and what it unlocks. Ticks are saved in '
            + 'this browser only.'
      })
    ]));

    var fill = el('div', {
      'class': 'progress__fill',
      style: 'width:' + (total ? (completed / total * 100) : 0) + '%'
    });
    view.appendChild(el('div', {
      'class': 'progress', role: 'progressbar',
      'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': String(completed),
      'aria-label': 'Challenges completed', style: 'margin-bottom:16px'
    }, [fill]));

    var search = el('input', {
      type: 'search', id: 'unlock-search', value: state.unlockQuery,
      placeholder: 'Search challenges or rewards…', 'aria-label': 'Search challenges'
    });
    var filter = el('select', { id: 'unlock-filter', 'aria-label': 'Filter challenges' }, [
      el('option', { value: 'all', text: 'All challenges', selected: state.unlockFilter === 'all' }),
      el('option', { value: 'open', text: 'Not done yet', selected: state.unlockFilter === 'open' }),
      el('option', { value: 'done', text: 'Completed', selected: state.unlockFilter === 'done' })
    ]);

    var listHost = el('div');

    function visible() {
      var q = state.unlockQuery.toLowerCase();
      return D.challenges.filter(function (c) {
        if (state.unlockFilter === 'open' && done[c.name]) return false;
        if (state.unlockFilter === 'done' && !done[c.name]) return false;
        if (q) {
          var hay = (c.name + ' ' + c.desc + ' ' + c.unlocks.join(' ')).toLowerCase();
          if (hay.indexOf(q) < 0) return false;
        }
        return true;
      });
    }

    function paintList() {
      clear(listHost);
      var list = visible();
      if (!list.length) {
        listHost.appendChild(el('p', { 'class': 'empty', text: 'Nothing matches that filter.' }));
        return;
      }
      var groups = {};
      list.forEach(function (c) {
        (groups[c.type] = groups[c.type] || []).push(c);
      });
      Object.keys(groups).sort().forEach(function (type) {
        var rows = groups[type];
        var groupDone = rows.filter(function (c) { return done[c.name]; }).length;
        var group = el('div', { 'class': 'group' }, [
          el('h2', { 'class': 'group__h' }, [
            el('span', { text: type }),
            el('span', { 'class': 'group__n', text: groupDone + '/' + rows.length })
          ])
        ]);
        var checklist = el('div', { 'class': 'checklist' });
        rows.forEach(function (c) { checklist.appendChild(challengeRow(c)); });
        group.appendChild(checklist);
        listHost.appendChild(group);
      });
    }

    function refreshProgress() {
      var n = D.challenges.filter(function (c) { return done[c.name]; }).length;
      fill.style.width = (total ? (n / total * 100) : 0) + '%';
      var counter = document.getElementById('unlock-count');
      if (counter) counter.textContent = n + ' of ' + total + ' done';
      var bar = fill.parentNode;
      if (bar) bar.setAttribute('aria-valuenow', String(n));
    }

    function challengeRow(c) {
      var box = el('input', { type: 'checkbox', checked: !!done[c.name] });
      var label = el('label', { 'class': 'check' + (done[c.name] ? ' check--done' : '') }, [
        box,
        el('div', { 'class': 'check__body' }, [
          el('div', { 'class': 'check__name', text: c.name }),
          el('div', { 'class': 'check__desc', html: c.desc || '' }),
          c.unlocks.length
            ? el('div', { 'class': 'check__unlock', text: 'Unlocks: ' + c.unlocks.join(', ') })
            : null
        ])
      ]);
      box.addEventListener('change', function () {
        if (box.checked) done[c.name] = true; else delete done[c.name];
        store.set('done', done);
        label.classList.toggle('check--done', box.checked);
        refreshProgress();
        if (state.unlockFilter !== 'all') paintList();
      });
      return label;
    }

    search.addEventListener('input', function () {
      state.unlockQuery = search.value;
      paintList();
    });
    filter.addEventListener('change', function () {
      state.unlockFilter = filter.value;
      paintList();
    });

    view.appendChild(el('div', { 'class': 'controls' }, [
      el('div', { 'class': 'search' }, [icon(ICONS.search), search]),
      filter
    ]));
    view.appendChild(listHost);
    paintList();
  }

  /* ----------------------------------------------------------------- render */

  var RENDERERS = {
    items: renderItems,
    loadout: renderLoadout,
    survivors: renderSurvivors,
    artifacts: renderArtifacts,
    unlocks: renderUnlocks
  };

  function render() {
    clear(main);
    clear(drawerHost);
    var view = el('div', { 'class': 'view' });
    RENDERERS[state.tab](view);
    main.appendChild(view);
    main.appendChild(el('footer', { 'class': 'foot' }, [
      el('div', {
        html: 'Game data generated from the community wiki at '
            + '<a href="' + D.source + '" rel="noreferrer noopener">riskofrain2.wiki.gg</a>'
            + ' — ' + D.items.length + ' items, ' + D.equipment.length + ' equipment, '
            + D.survivors.length + ' survivors, ' + D.challenges.length + ' challenges. '
            + 'Regenerate with <code>tools/build_data.py</code>.'
      })
    ]));
    main.scrollTop = 0;
  }

  render();
})();
