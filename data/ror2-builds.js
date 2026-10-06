/* Hand-curated survivor builds -- edit freely after a patch.
   Items are referenced by their wiki id (the `id` field in data/ror2-data.js)
   so they link into the item reference and stack maths; loadout skills use the
   names in survivors[].skills. Run tools/check_builds.py after editing. */
window.ROR2_BUILDS = {
 "patch": "patch 1.4.1 (Alloyed Collective Patch 1, Dec 2025)",
 "checked": "2026-10-05",
 "survivors": {
  "Acrid": {
   "role": "Poison hybrid: DoT scales with enemy max HP, hit-and-run",
   "unlock": "...To Be Left Alone: fully complete the Void Fields (stabilize every Cell)",
   "loadout": [
    {
     "slot": "Passive",
     "pick": "Poison",
     "note": "Best overall and for looping; % max HP damage melts bosses",
     "alts": [
      {
       "name": "Blight",
       "note": "Stacks and can kill; good on early crowds and aggressive play, needs cooldown items"
      }
     ]
    },
    {
     "slot": "Primary",
     "pick": "Vicious Wounds",
     "note": "Only option; 3rd slash grants regen"
    },
    {
     "slot": "Secondary",
     "pick": "Neurotoxin",
     "note": "Ranged poison spit; safe poison-and-run",
     "alts": [
      {
       "name": "Ravenous Bite",
       "note": "Melee bite with big heal; great with Purity or Spinel Tonic"
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Caustic Leap",
     "note": "Poisons on landing, leaves acid pool, no fall damage",
     "alts": [
      {
       "name": "Frenzied Leap",
       "note": "Cooldown cut per hit; suits Blight and aggressive builds"
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "Epidemic",
     "note": "Only option; bounces between enemies, procs on-hit items"
    }
   ],
   "core": {
    "damage": [
     "NearbyDamageBonus",
     "BossDamageBonus"
    ],
    "onHit": [
     "ChainLightning",
     "Missile",
     "ExecuteLowHealthElite",
     "DeathMark"
    ],
    "sustain": [],
    "defense": [
     "SprintArmor"
    ],
    "mobility": [
     "Hoof"
    ]
   },
   "legendaries": [
    "ArmorReductionOnHit",
    "Clover",
    "PermanentDebuffOnHit"
   ],
   "boss": [
    "BleedOnHitAndExplode"
   ],
   "equipment": [
    "Tonic",
    "TeamWarCry"
   ],
   "avoid": [
    {
     "id": "NovaOnHeal",
     "why": "Doesn't trigger off his Regenerative buff"
    },
    {
     "id": "RepeatHeal",
     "why": "Doesn't use his Regenerative buff and slows burst heals"
    },
    {
     "id": "GoldOnHit",
     "why": "Melee range means lots of hits and lost gold"
    }
   ],
   "tips": [
    "Poison scales with enemy max HP, so tag bosses and elites, then kite.",
    "Aim Epidemic at the floor or walls so it bounces onto flyers.",
    "Old Guillotine lets poisoned elites die instead of sitting at 1 HP."
   ],
   "fun": {
    "name": "Purity Bite",
    "items": [
     "LunarBadLuck",
     "Clover",
     "Tonic"
    ],
    "how": "Run Ravenous Bite. Purity drops the secondary cooldown to about 0.5s, so you can bite nonstop for big regen and damage."
   },
   "disagreements": "Poison (wiki: best overall) vs Blight (rogueranker). Ravenous Bite + Frenzied Leap (rogueranker) vs Neurotoxin + Caustic Leap (poison-and-run). Tier A (Jan 2026) vs C (Apr 2026).",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Acrid",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://rogueranker.com/acrid-ror2/",
    "https://steamcommunity.com/app/632360/discussions/0/6192985336598815362",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/",
    "https://choostgames.com/blog/risk-of-rain-2-tier-list/"
   ]
  },
  "Artificer": {
   "role": "Glass-cannon caster: huge AoE burst, no mobility skill",
   "unlock": "Pause.: free the survivor suspended in time in the Bazaar Between Time",
   "loadout": [
    {
     "slot": "Primary",
     "pick": "Flame Bolt",
     "note": "Best single-target damage, ignites",
     "alts": [
      {
       "name": "Plasma Bolt",
       "note": "Bigger blast, more forgiving aim and AoE"
      }
     ]
    },
    {
     "slot": "Secondary",
     "pick": "Charged Nano-Bomb",
     "note": "Her main damage; biggest, most forgiving AoE, stuns",
     "alts": [
      {
       "name": "Cast Nano-Spear",
       "note": "Freezes and executes under 30%, pierces terrain; strong vs Mithrix"
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Snapfreeze",
     "note": "Only option; freeze wall sets up Flamethrower"
    },
    {
     "slot": "Special",
     "pick": "Flamethrower",
     "note": "Highest raw damage; scales with attack speed",
     "alts": [
      {
       "name": "Ion Surge",
       "note": "Now a Special (not Utility); trades damage for vertical escape and air safety"
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "SecondarySkillMagazine",
     "CritGlasses",
     "Crowbar"
    ],
    "onHit": [
     "FireRing",
     "IceRing"
    ],
    "sustain": [],
    "defense": [
     "Bear"
    ],
    "mobility": [
     "Hoof"
    ]
   },
   "legendaries": [
    "Clover",
    "ShockNearby",
    "AlienHead",
    "Behemoth"
   ],
   "boss": [
    "BleedOnHitAndExplode",
    "NovaOnLowHealth"
   ],
   "equipment": [
    "Blackhole",
    "TeamWarCry",
    "CritOnUse"
   ],
   "avoid": [
    {
     "id": "Mushroom",
     "why": "Needs standing still; she must keep moving"
    },
    {
     "id": "Seed",
     "why": "Few hits per second outside Flamethrower"
    }
   ],
   "tips": [
    "Snapfreeze a group, then Flamethrower them while frozen.",
    "Hold jump to hover with ENV Suit: dodges melee and gives better bomb angles.",
    "Small flyers are her weak spot: Gasoline, Will-o'-the-wisp or Unstable Tesla Coil clean them up."
   ],
   "fun": {
    "name": "Ion Surge Sky Witch",
    "items": [
     "LunarBadLuck",
     "AlienHead",
     "KillEliteFrenzy",
     "SprintBonus"
    ],
    "how": "Run Ion Surge and stack cooldown cuts so you can chain surges and bomb from the air, mostly out of reach of ground enemies."
   },
   "disagreements": "Flamethrower (wiki/rogueranker: damage) vs Ion Surge (tier lists: safety). Nano-Bomb is the usual pick, but Nano-Spear is preferred for Mithrix. Ranked B tier in 2026 lists.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Artificer",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://rogueranker.com/artificer-ror2/",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/",
    "https://choostgames.com/blog/risk-of-rain-2-tier-list/"
   ]
  },
  "Bandit": {
   "role": "Stealth burst assassin; backstab crits and kills that reset cooldowns",
   "unlock": "Warrior: reach and complete the 3rd Teleporter event without dying",
   "loadout": [
    {
     "slot": "Passive",
     "pick": "Backstab",
     "note": "Any hit from the rear 180 degrees is a guaranteed crit"
    },
    {
     "slot": "Primary",
     "pick": "Burst",
     "note": "5 pellets that each roll procs and crit from behind",
     "alts": [
      {
       "name": "Blast",
       "note": "330% at 1.0 proc, no falloff; better at range. Unlock: Classic Man"
      }
     ]
    },
    {
     "slot": "Secondary",
     "pick": "Serrated Dagger",
     "note": "360% lunge; crits apply Hemorrhage",
     "alts": [
      {
       "name": "Serrated Shiv",
       "note": "Ranged throw (240%); safer, same Hemorrhage on crit. Unlock: Sadist"
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Smoke Bomb",
     "note": "Go invisible to reset aggro and line up backstabs"
    },
    {
     "slot": "Special",
     "pick": "Lights Out",
     "note": "600% shot; a kill resets every cooldown",
     "alts": [
      {
       "name": "Desperado",
       "note": "Kills stack permanent damage tokens; scales hard in long runs. Unlock: B&E"
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "Crowbar",
     "Bandolier",
     "EquipmentMagazineVoid"
    ],
    "onHit": [
     "FireRing",
     "IceRing"
    ],
    "sustain": [
     "HealOnCrit"
    ],
    "defense": [],
    "mobility": [
     "Hoof"
    ]
   },
   "legendaries": [
    "UtilitySkillMagazine",
    "CritDamage",
    "Behemoth"
   ],
   "boss": [
    "BleedOnHitAndExplode"
   ],
   "equipment": [
    "TeamWarCry",
    "Lightning"
   ],
   "avoid": [
    {
     "id": "CritGlassesVoid",
     "why": "Instakills skip on-kill effects, so no Lights Out reset"
    },
    {
     "id": "BleedOnHit",
     "why": "Wiki: bleed falls off during his reload windows"
    },
    {
     "id": "CritGlasses",
     "why": "Backstabs already crit; low value"
    }
   ],
   "tips": [
    "Smoke Bomb past a target and hit it from behind while it aggros your old spot.",
    "Save Lights Out for low-HP targets so the kill chains resets.",
    "Hemorrhage only comes from crits, so throw Dagger/Shiv from behind."
   ],
   "fun": {
    "name": "Desperado Stacker",
    "items": [
     "EquipmentMagazineVoid",
     "Bandolier",
     "Behemoth",
     "Crowbar"
    ],
    "how": "Take Desperado and farm tokens on every kill all run; by the final stage one backstab shot can delete bosses."
   },
   "disagreements": "Lights Out (rogueranker, exputer) vs Desperado (Steam players; better for long runs). Shiv (rogueranker) vs Dagger (exputer, wiki: more damage). Shatterspleen is recommended by guides, but the wiki lists bleed items as anti-synergy.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Bandit",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://rogueranker.com/risk-of-rain-2-bandit/",
    "https://exputer.com/guides/risk-of-rain-2-bandit/",
    "https://steamcommunity.com/app/632360/discussions/0/3076495389984137991",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/"
   ]
  },
  "CHEF": {
   "role": "Close-to-mid-range combo cook; chain skills on enemies, burn/freeze groups, kills drop healing food.",
   "unlock": "Order Up!: Complete the Wok's recipe in Reformed Altar (bring it the requested items).",
   "loadout": [
    {
     "slot": "Primary",
     "pick": "Dice",
     "note": "3 piercing cleavers (200%), double damage on recall. Boosted: 16 cleavers in all directions at 400%."
    },
    {
     "slot": "Secondary",
     "pick": "Sear",
     "note": "Ignites for 600%; lights oil. Boosted: adds 3 fireballs (700%) leaving burning oil.",
     "alts": [
      {
       "name": "Ice Box",
       "note": "Unlock via CHEF: It's Getting Hot In Here!. 3x150% frost, 2 charges; oiled targets freeze. Boosted: big cube, 15m instant freeze."
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Roll",
     "note": "Charged stunning dash (300-600%); jump out for a super jump. Boosted: spinning cutlery with stacking bleed.",
     "alts": [
      {
       "name": "Oil Spill",
       "note": "Unlock via CHEF: You've Always Been Crazy. Up to 4 aerial slams that leave oil. Boosted: pools auto-ignite/freeze."
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "Yes, CHEF!",
     "note": "Unlock via CHEF: Barbecued Bison Recipe Complete. 400% blast plus Ignite/Frost, boosts your next skill, 10s cooldown.",
     "alts": [
      {
       "name": "Glaze",
       "note": "Default. 7x250% oil globs that set up Sear/Ice Box combos; use until Yes, CHEF! is unlocked."
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "StrengthenBurn",
     "Syringe",
     "IgniteOnKill",
     "DeathMark"
    ],
    "onHit": [
     "ChainLightning"
    ],
    "sustain": [],
    "defense": [
     "Bear"
    ],
    "mobility": [
     "Feather",
     "Hoof"
    ]
   },
   "legendaries": [
    "AlienHead",
    "UtilitySkillMagazine",
    "CritDamage"
   ],
   "boss": [
    "Knurl"
   ],
   "equipment": [
    "Molotov",
    "FireBallDash"
   ],
   "avoid": [
    {
     "id": "LunarDagger",
     "why": "0 armor and close range already; too fragile."
    },
    {
     "id": "LunarPrimaryReplacement",
     "why": "Replaces Dice, breaking cooking combos and healing food drops."
    }
   ],
   "tips": [
    "Kill with 2+ different skills to drop healing food; more cooking buffs mean bigger heals.",
    "Oil first (Glaze/Oil Spill), then Sear to ignite or Ice Box to freeze.",
    "Yes, CHEF! can cancel Roll mid-dash; the super jump works even at minimum charge."
   ],
   "fun": {
    "name": "Grease Fire",
    "items": [
     "StrengthenBurn",
     "IgniteOnKill",
     "Molotov"
    ],
    "how": "Run Glaze + Sear: oil pools ignite, Ignition Tank quadruples burns, and Gasoline spreads fire on kill."
   },
   "disagreements": "GameRant (Sept 2024, before the v1.3.8 rework) pushes Crowbar/Bandolier/Focus Crystal; RogueRanker (post-rework) pushes attack speed and on-kill AoE. Special choice is split: Glaze (oil combos) vs Yes, CHEF! (boosts). Few post-rework guides exist.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/CHEF",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://riskofrain2.wiki.gg/wiki/Ignition_Tank",
    "https://riskofrain2.wiki.gg/wiki/Death_Mark",
    "https://devtrackers.gg/risk-of-rain/p/91e41a15-update-notes-v1-3-8",
    "https://rogueranker.com/chef-ror2/",
    "https://gamerant.com/risk-of-rain-2-ror-2-best-chef-build-items/",
    "https://www.thegamer.com/risk-of-rain-2-how-to-unlock-every-character/",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/"
   ]
  },
  "Captain": {
   "role": "Shotgun proc-spreader with orbital strikes and loot/support beacons; no mobility skill.",
   "unlock": "Washed Away: Beat the game (kill Mithrix and escape the moon).",
   "loadout": [
    {
     "slot": "Primary",
     "pick": "Vulcan Shotgun",
     "note": "8 pellets at 0.75 proc each; charge to tighten spread. Best on-hit carrier in the game."
    },
    {
     "slot": "Secondary",
     "pick": "Power Tazer",
     "note": "Stuns non-bosses; set up probes so all three land."
    },
    {
     "slot": "Utility",
     "pick": "Orbital Probe",
     "note": "Up to 3 x 1000% strikes; reliable, refreshed by Bandolier.",
     "alts": [
      {
       "name": "OGM-72 'DIABLO' Strike",
       "note": "Unlock via Captain: Smushed. 40,000% after 20s, 40s cooldown; for bosses/shocked groups or fun."
      }
     ]
    },
    {
     "slot": "Special (Beacon 1)",
     "pick": "Beacon: Hacking",
     "note": "Solo default: hacks nearby chests/shrines to $0, so more items per stage. Unlock via Captain: Worth Every Penny.",
     "alts": [
      {
       "name": "Beacon: Healing",
       "note": "Co-op or rough runs: heals allies 10% max HP/s nearby."
      },
      {
       "name": "Beacon: Resupply",
       "note": "Equipment builds; recharges equipment, 3 uses. Unlock via Captain: Wanderlust."
      }
     ]
    },
    {
     "slot": "Special (Beacon 2)",
     "pick": "Beacon: Shocking",
     "note": "Periodically shocks (roots) nearby enemies; drop on teleporter so probes/DIABLO never miss.",
     "alts": [
      {
       "name": "Beacon: Healing",
       "note": "Swap in when you need sustain."
      },
      {
       "name": "Beacon: Hacking",
       "note": "Double hacking for maximum loot speed."
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "Syringe",
     "Bandolier"
    ],
    "onHit": [
     "BleedOnHit",
     "ChainLightning",
     "Missile"
    ],
    "sustain": [],
    "defense": [
     "Bear"
    ],
    "mobility": [
     "Hoof",
     "JumpBoost"
    ]
   },
   "legendaries": [
    "UtilitySkillMagazine",
    "ArmorReductionOnHit",
    "Clover"
   ],
   "boss": [
    "BleedOnHitAndExplode"
   ],
   "equipment": [
    "Blackhole"
   ],
   "avoid": [
    {
     "id": "LunarPrimaryReplacement",
     "why": "Replaces Vulcan Shotgun, losing the 8-pellet proc engine."
    },
    {
     "id": "LunarDagger",
     "why": "Low HP, no escape skill; you die fast."
    }
   ],
   "tips": [
    "Tazer first, then Orbital Probe: stunned targets eat all three strikes.",
    "Drop beacons at the teleporter before starting the event.",
    "Orbital skills and beacons are disabled in Hidden Realms."
   ],
   "fun": {
    "name": "Bleed Shotgun",
    "items": [
     "BleedOnHit",
     "BleedOnHitAndExplode",
     "Syringe"
    ],
    "how": "Every pellet stacks bleed; crits from Shatterspleen make bleeding kills explode and chain through packs."
   },
   "disagreements": "Beacon pick: Hacking+Healing (solo loot/sustain) vs Hacking+Shocking (orbital accuracy). Older eXputer guide (2023) leans Sticky Bomb/Red Whip/Wax Quail; newer guides lean on-hit (Tri-Tip, Ukulele, AtG).",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Captain",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://rogueranker.com/captain-ror2/",
    "https://exputer.com/guides/risk-of-rain-2-captain/",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/"
   ]
  },
  "Commando": {
   "role": "Fast-firing all-rounder; damage comes almost entirely from on-hit procs",
   "unlock": null,
   "loadout": [
    {
     "slot": "Primary",
     "pick": "Double Tap",
     "note": "6 shots/s at 1.0 proc; the engine for every on-hit item"
    },
    {
     "slot": "Secondary",
     "pick": "Phase Round",
     "note": "Long-range piercer, gains damage per enemy pierced; safe vs lines and flyers",
     "alts": [
      {
       "name": "Phase Blast",
       "note": "Far more close-range burst (8 pellets); good with Backup Magazine and Predatory Instincts. Unlock: Rolling Thunder"
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Tactical Slide",
     "note": "Same cooldown as Dive but you keep shooting while sliding. Unlock: Godspeed",
     "alts": [
      {
       "name": "Tactical Dive",
       "note": "Default; roll up slopes for height and to cancel fall damage"
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "Suppressive Fire",
     "note": "Stunning bullet hose; shot count scales with attack speed",
     "alts": [
      {
       "name": "Frag Grenade",
       "note": "Only real AoE; 700% hit reliably triggers bands. Unlock: Incorruptible"
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "Syringe",
     "AttackSpeedOnCrit"
    ],
    "onHit": [
     "BleedOnHit",
     "ChainLightning",
     "Missile"
    ],
    "sustain": [],
    "defense": [
     "Bear"
    ],
    "mobility": [
     "Hoof"
    ]
   },
   "legendaries": [
    "BounceNearby",
    "Dagger",
    "Behemoth"
   ],
   "boss": [
    "FireballsOnHit",
    "BleedOnHitAndExplode"
   ],
   "equipment": [
    "Lightning",
    "CritOnUse"
   ],
   "avoid": [
    {
     "id": "LunarPrimaryReplacement",
     "why": "Replaces Double Tap, his proc engine"
    },
    {
     "id": "CritGlassesVoid",
     "why": "Corrupts your Lens-Maker's Glasses; weak trade"
    }
   ],
   "tips": [
    "Fire a secondary or special mid-stream to reset Double Tap's bullet spread.",
    "Cancel Suppressive Fire's end lag with Phase Round/Blast.",
    "Dive or slide just before landing to skip fall damage."
   ],
   "fun": {
    "name": "Frag Bands",
    "items": [
     "IceRing",
     "FireRing",
     "EquipmentMagazineVoid",
     "Behemoth"
    ],
    "how": "Run Frag Grenade: every 700% blast trips both bands, Lysate adds grenade charges, Behemoth makes the bounces explode too."
   },
   "disagreements": "Phase Blast (rogueranker: much higher burst) vs Phase Round (range/safety). Frag Grenade for AoE and bands vs Suppressive Fire for single target; wiki favors Frag for band builds.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Commando",
    "https://riskofrain2.wiki.gg/wiki/Kjaro%27s_Band",
    "https://rogueranker.com/commando-ror2/",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/"
   ]
  },
  "Drifter": {
   "role": "Melee scavenger; farms Junk to skip cooldowns and spawn temporary items.",
   "unlock": "Lost in Transit: free the survivor from the vault in Solutional Haunt",
   "loadout": [
    {
     "slot": "Passive",
     "pick": "Trash to Treasure",
     "note": "Carried scrap buffs: white +6% move, green +3 HP/s, red +30% atk spd, yellow -15% cooldowns (each)."
    },
    {
     "slot": "Primary",
     "pick": "Blunt Force",
     "note": "3-hit combo, 3rd stuns; 40% Junk chance per hit. Becomes Bludgeon while something is bagged."
    },
    {
     "slot": "Secondary",
     "pick": "Cleanup",
     "note": "Ranged debris volley; spend 2 Junk to skip cooldown, so it's spammable.",
     "alts": [
      {
       "name": "Junk Cube",
       "note": "400%/800% cube; standing on it and hitting it is fast movement. Unlock: Drifter: Trash Compactor."
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Repossess",
     "note": "Bag enemies/allies/interactables, throw with Discard; moves turrets, shrines, chests.",
     "alts": [
      {
       "name": "Tornado Slam",
       "note": "Pure combat pick; buffed in 1.4.1 (220%/600%, more Junk). Unlock: Drifter: In The Bag."
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "Salvage",
     "note": "8 Junk -> 4 temporary items; drop them before the boss.",
     "alts": [
      {
       "name": "Tinker",
       "note": "8 Junk shockwave + debuff; turns item pickups into temp item + scrap, rerolls printers/multishops. Unlock: Drifter: Leave No Trace."
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "Syringe",
     "SpeedOnPickup",
     "Crowbar",
     "SecondarySkillMagazine"
    ],
    "onHit": [],
    "sustain": [],
    "defense": [
     "OutOfCombatArmor"
    ],
    "mobility": [
     "Hoof"
    ]
   },
   "legendaries": [
    "Duplicator",
    "Clover",
    "AlienHead"
   ],
   "boss": [
    "ScrapYellow",
    "Knurl"
   ],
   "equipment": [
    "CritOnUse",
    "TeamWarCry"
   ],
   "avoid": [
    {
     "id": "VoidMegaCrabItem",
     "why": "Corrupts Yellow scrap, killing her cooldown buff."
    },
    {
     "id": "HalfAttackSpeedHalfCooldowns",
     "why": "Halves attack speed, so you get fewer swings and less Junk."
    }
   ],
   "tips": [
    "Hold scrap instead of printing right away: every red scrap is +30% attack speed while carried.",
    "Leave Salvage temp items on the ground until the boss; their decay timer starts on pickup.",
    "Plant Junk Cubes in the teleporter area before starting the event; they never despawn."
   ],
   "fun": {
    "name": "Hoarder",
    "items": [
     "Duplicator",
     "SpeedOnPickup",
     "Clover"
    ],
    "how": "Spam Junk and Salvage so every pickup doubles as a temp copy and refreshes Compulsion stacks."
   },
   "disagreements": "Alloyed Collective is recent and community meta is thin; basically rogueranker plus the wiki. rogueranker calls Substandard Duplicator her best item and ranks her B tier. It also lists Lysate Cell for an extra Salvage charge, which I could not confirm on the wiki. Tornado Slam got a big buff in 1.4.1, so older takes on Repossess vs Tornado Slam may be out of date. The Light Flux Pauldron avoid is my inference.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Drifter",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://riskofrain2.wiki.gg/wiki/Collector%27s_Compulsion",
    "https://riskofrain2.wiki.gg/wiki/Substandard_Duplicator",
    "https://rogueranker.com/drifter-ror2/",
    "https://rogueranker.com/?p=1734",
    "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=632360"
   ]
  },
  "Engineer": {
   "role": "Turret builder; turrets copy your items, so every pickup counts 3x",
   "unlock": "Engineering Perfection: complete 30 stages",
   "loadout": [
    {
     "slot": "Primary",
     "pick": "Bouncing Grenades",
     "note": "Charge up to 8; filler between cooldowns"
    },
    {
     "slot": "Secondary",
     "pick": "Spider Mines",
     "note": "No arming time, seek targets; 1200% if thrown on an enemy. Unlock: 100% Calculated",
     "alts": [
      {
       "name": "Pressure Mines",
       "note": "900% when fully armed; set traps on your Bubble Shield"
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Bubble Shield",
     "note": "Blocks all incoming fire for 15s; your teleporter fort",
     "alts": [
      {
       "name": "Thermal Harpoons",
       "note": "4-charge homing burst for mobile TR58 builds. Unlock: Zero Sum"
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "TR12 Gauss Auto-Turret",
     "note": "Stationary, 1.0 proc; perfect for Bustling Fungus",
     "alts": [
      {
       "name": "TR58 Carbonizer Turret",
       "note": "Follows you and slows targets, but 0.6 proc. Unlock: Better With Friends"
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "EquipmentMagazineVoid",
     "Syringe"
    ],
    "onHit": [
     "BleedOnHit",
     "Missile"
    ],
    "sustain": [
     "Mushroom",
     "Seed"
    ],
    "defense": [
     "Bandolier"
    ],
    "mobility": []
   },
   "legendaries": [
    "UtilitySkillMagazine",
    "IncreaseHealing",
    "NovaOnHeal",
    "DroneWeapons"
   ],
   "boss": [
    "NovaOnLowHealth",
    "Knurl"
   ],
   "equipment": [
    "Blackhole",
    "PassiveHealing"
   ],
   "avoid": [
    {
     "id": "BeetleGland",
     "why": "Turrets don't inherit it (same for Empathy Cores, Halcyon Seed)"
    },
    {
     "id": "ShieldOnly",
     "why": "Makes turret HP all shield, which breaks Fungus healing"
    },
    {
     "id": "MushroomVoid",
     "why": "Corrupts Bustling Fungus; TR12s can't sprint"
    }
   ],
   "tips": [
    "Turrets only get new items when redeployed, so re-place them after big pickups.",
    "Put the TR12s side by side so their Fungus zones heal each other.",
    "Turrets never use equipment, so pick equipment for yourself."
   ],
   "fun": {
    "name": "Heresy Turrets",
    "items": [
     "LunarPrimaryReplacement",
     "LunarBadLuck",
     "EquipmentMagazineVoid"
    ],
    "how": "Turrets swap their cannon for Hungering Gaze; with Purity the wiki puts it near 4x damage, and Lysate gives you a third turret."
   },
   "disagreements": "Spider Mines (rogueranker) vs Pressure Mines (exputer; stack on Bubble). TR12 is the consensus for safe Fungus builds; TR58 + Thermal Harpoons for aggressive mobile play.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Engineer",
    "https://riskofrain2.wiki.gg/wiki/TR12_Gauss_Auto-Turret",
    "https://riskofrain2.wiki.gg/wiki/Lysate_Cell",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://rogueranker.com/engineer-ror2/",
    "https://exputer.com/guides/risk-of-rain-2-engineer/",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/"
   ]
  },
  "False Son": {
   "role": "Slow, tanky melee bruiser; bonus max HP (Growth) turns into extra Lunar Spikes.",
   "unlock": "Purified Freedom: purify the Heart of the False Son using the Halcyon Seed",
   "loadout": [
    {
     "slot": "Passive",
     "pick": "Lunar Tampering",
     "note": "Held spikes: +attack speed/armor. Spent spikes: +move speed/regen."
    },
    {
     "slot": "Primary",
     "pick": "Club of the Forsaken",
     "note": "Only option; hold to charge a 1000% slam."
    },
    {
     "slot": "Secondary",
     "pick": "Lunar Spikes",
     "note": "Spam to stack Lunar Ruin (+damage taken, -healing) before a charged slam.",
     "alts": [
      {
       "name": "Lunar Stakes",
       "note": "Piercing 300% stake, counts as 2 spikes; good vs lines. Unlock: False Son: Protein Heavy Diet."
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Step of the Brothers",
     "note": "Two dashes with explosions; usable mid-charge.",
     "alts": [
      {
       "name": "Meridian's Will",
       "note": "35m teleport + pull; triples Lunar Tampering for 4s; pop before a slam. Unlock: False Son: Family Bonding."
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "Laser of the Father",
     "note": "Big channel laser that refills spikes as it fires; duration grows with Growth.",
     "alts": [
      {
       "name": "Laser Burst",
       "note": "Instant 1250% piercer, refills half spikes, more charges with Growth. Unlock: False Son: Stare Them Down."
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "IncreasePrimaryDamage",
     "Crowbar"
    ],
    "onHit": [],
    "sustain": [
     "Infusion",
     "ExtraStatsOnLevelUp"
    ],
    "defense": [
     "FlatHealth"
    ],
    "mobility": [
     "Hoof"
    ]
   },
   "legendaries": [
    "BoostAllStats",
    "IncreaseHealing",
    "Behemoth"
   ],
   "boss": [
    "Knurl",
    "Pearl"
   ],
   "equipment": [
    "Tonic",
    "GainArmor"
   ],
   "avoid": [
    {
     "id": "ShieldOnly",
     "why": "Shield gives no Growth; wipes all of it."
    },
    {
     "id": "EliteLunarEquipment",
     "why": "Perfected aspect converts HP to shield; removes all Growth."
    },
    {
     "id": "EliteLightningEquipment",
     "why": "Overloading aspect; halves Growth."
    }
   ],
   "tips": [
    "Throw every spike into a target, then land a charged Club slam to cash in stacked Lunar Ruin.",
    "Hold spikes for armor/attack speed; burn them for regen and speed in long fights.",
    "Stone Flux Pauldron is a good lunar for him: +100% HP, and his base speed is already slow."
   ],
   "fun": {
    "name": "Meat Mountain",
    "items": [
     "HalfSpeedDoubleHealth",
     "FlatHealth",
     "Infusion",
     "Knurl",
     "BoostAllStats"
    ],
    "how": "Pile on max HP until you have dozens of spikes and a near-endless Laser of the Father."
   },
   "disagreements": "rogueranker calls Personal Shield Generator a Growth boost, but the wiki says shield adds no Growth, so skip it. Utility: rogueranker swaps to Meridian's Will once it's unlocked; Step of the Brothers is the safer default. Community guides beyond rogueranker were sparse.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/False_Son",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://riskofrain2.wiki.gg/wiki/Stone_Flux_Pauldron",
    "https://riskofrain2.wiki.gg/wiki/Spinel_Tonic",
    "https://riskofrain2.wiki.gg/wiki/Silence_Between_Two_Strikes",
    "https://rogueranker.com/false-son-ror2/",
    "https://rogueranker.com/?p=1734"
   ]
  },
  "Heretic": {
   "role": "Secret lunar survivor: huge base HP/damage but constant health decay; burst with Ruin, survive with Shadowfade.",
   "unlock": "Blockade Breaker (kill 15 bosses in one run) unlocks the Heresy items. Then hold Visions, Hooks, Strides and Essence of Heresy at once in a run to transform. Not permanent: redo it every run.",
   "loadout": [
    {
     "slot": "Primary",
     "pick": "Hungering Gaze",
     "note": "From Visions of Heresy. 12 tracking shards (120%), 2s reload. Passive Nevermore is only a placeholder squawk."
    },
    {
     "slot": "Secondary",
     "pick": "Slicing Maelstrom",
     "note": "From Hooks of Heresy. Grinding orb, then 700% blast that roots enemies 3s."
    },
    {
     "slot": "Utility",
     "pick": "Shadowfade",
     "note": "From Strides of Heresy. 3s intangible, +30% speed, heals 18.2% max HP. Your main heal."
    },
    {
     "slot": "Special",
     "pick": "Ruin",
     "note": "From Essence of Heresy. Hits add Ruin stacks; detonate at any range for 300% + 120% per stack."
    }
   ],
   "core": {
    "damage": [
     "Syringe"
    ],
    "onHit": [
     "FireRing",
     "IceRing"
    ],
    "sustain": [
     "HealWhileSafe",
     "HealOnCrit"
    ],
    "defense": [
     "PersonalShield"
    ],
    "mobility": []
   },
   "legendaries": [
    "IncreaseHealing",
    "AlienHead",
    "KillEliteFrenzy",
    "UtilitySkillMagazine"
   ],
   "boss": [
    "Knurl"
   ],
   "equipment": [
    "PassiveHealing"
   ],
   "avoid": [
    {
     "id": "Tonic",
     "why": "Its regen boost amplifies your health decay (wiki warning)."
    },
    {
     "id": "LunarDagger",
     "why": "Halves HP and makes the decay worse."
    }
   ],
   "tips": [
    "Use Shadowfade on cooldown, not just in emergencies; it is your regen.",
    "Dump all Gaze charges to stack Ruin, then detonate. Bleed (0 proc) won't add Ruin.",
    "Grab 2+ Cautious Slugs to offset decay out of combat."
   ],
   "fun": {
    "name": "Ruin Machine Gun",
    "items": [
     "KillEliteFrenzy",
     "FireRing",
     "IceRing",
     "EquipmentMagazineVoid"
    ],
    "how": "Elite kills give near-zero cooldowns from Brainstalks, so Ruin detonates over and over; Bands proc on the big hits."
   },
   "disagreements": null,
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Heretic",
    "https://riskofrain2.wiki.gg/wiki/Essence_of_Heresy",
    "https://riskofrain2.wiki.gg/wiki/Visions_of_Heresy",
    "https://riskofrain2.wiki.gg/wiki/Blockade_Breaker",
    "https://riskofrain2.wiki.gg/wiki/Spinel_Tonic",
    "https://rogueranker.com/?p=1614",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/"
   ]
  },
  "Huntress": {
   "role": "Mobile auto-aim archer, shoots while sprinting; glass cannon with the lowest base health",
   "unlock": null,
   "loadout": [
    {
     "slot": "Primary",
     "pick": "Strafe",
     "note": "~20% more DPS than Flurry until you have about 20% crit; 1.0 proc",
     "alts": [
      {
       "name": "Flurry",
       "note": "Crits do 4x instead of 2x; beats Strafe past ~20% crit and does ~54% more at 100%. Unlock: kill with every hit of one glaive"
      }
     ]
    },
    {
     "slot": "Secondary",
     "pick": "Laser Glaive",
     "note": "Bounces 6 times and gains damage per bounce; great proc spreader"
    },
    {
     "slot": "Utility",
     "pick": "Phase Blink",
     "note": "3 charges on a short cooldown; smoother dodging. Unlock: hold 12 Crowbars at once",
     "alts": [
      {
       "name": "Blink",
       "note": "Longer range and goes vertical; better on tall maps"
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "Ballista",
     "note": "3x900% at 1.0 proc; best single-target special. Unlock: clear Rallypoint Delta or Scorched Acres without dropping below 100% HP",
     "alts": [
      {
       "name": "Arrow Rain",
       "note": "Area slow and multi-hit; better vs crowds"
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "CritGlasses",
     "SecondarySkillMagazine",
     "AttackSpeedOnCrit"
    ],
    "onHit": [
     "ChainLightning",
     "Missile"
    ],
    "sustain": [],
    "defense": [
     "SprintArmor"
    ],
    "mobility": [
     "SprintBonus"
    ]
   },
   "legendaries": [
    "CritDamage",
    "BounceNearby",
    "Behemoth",
    "Dagger"
   ],
   "boss": [
    "SprintWisp",
    "BleedOnHitAndExplode"
   ],
   "equipment": [
    "CritOnUse",
    "Blackhole"
   ],
   "avoid": [
    {
     "id": "CritGlassesVoid",
     "why": "Eats the Lens-Maker's Glasses that Flurry needs"
    },
    {
     "id": "Mushroom",
     "why": "Needs you standing still; she never should"
    },
    {
     "id": "LunarDagger",
     "why": "Halves the lowest HP pool in the game"
    }
   ],
   "tips": [
    "Never stop moving: you shoot while sprinting, so sprint items give you damage and defense at once.",
    "Cancel Laser Glaive's throw animation with Blink or your special.",
    "Pick Flurry at the menu only if you'll chase crit; loadout locks for the run."
   ],
   "fun": {
    "name": "Glaive Bouncer",
    "items": [
     "SecondarySkillMagazine",
     "ChainLightning",
     "Missile"
    ],
    "how": "Stack Backup Magazines and chain-throw glaives; every bounce rolls your procs, clearing packs without aiming."
   },
   "disagreements": "Strafe vs Flurry: rogueranker defaults to Flurry; wiki math says Strafe is better until ~20% crit. Most agree on Phase Blink + Ballista.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Huntress",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://rogueranker.com/huntress-ror2/",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/"
   ]
  },
  "Loader": {
   "role": "Grapple brawler: huge burst, barrier on hit, top-tier mobility",
   "unlock": "Guidance Offline: destroy 6 Alloy Vulture Nests on Siren's Call to spawn the Alloy Worship Unit, then kill it",
   "loadout": [
    {
     "slot": "Primary",
     "pick": "Knuckleboom",
     "note": "Only option; each hit builds Scrap Barrier"
    },
    {
     "slot": "Secondary",
     "pick": "Grapple Fist",
     "note": "80m swing for mobility and momentum; misses refund instantly",
     "alts": [
      {
       "name": "Spiked Fist",
       "note": "Stuns and yanks targets; good for pulling bosses in"
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Charged Gauntlet",
     "note": "Pierces and scales with velocity; wins late game",
     "alts": [
      {
       "name": "Thunder Gauntlet",
       "note": "Easier early burst; pairs with Thunderslam"
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "Thunderslam",
     "note": "2000% slam with stun; pairs with H3AD-5T v2",
     "alts": [
      {
       "name": "M551 Pylon",
       "note": "Chain-zap crowds and doubles as a grapple anchor"
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "Crowbar",
     "NearbyDamageBonus",
     "CritGlasses"
    ],
    "onHit": [
     "FireRing",
     "IceRing",
     "ChainLightning"
    ],
    "sustain": [],
    "defense": [],
    "mobility": [
     "Hoof",
     "SprintBonus"
    ]
   },
   "legendaries": [
    "FallBoots",
    "UtilitySkillMagazine",
    "Clover",
    "Behemoth"
   ],
   "boss": [
    "Knurl",
    "BleedOnHitAndExplode"
   ],
   "equipment": [
    "Jetpack",
    "CritOnUse"
   ],
   "avoid": [
    {
     "id": "Mushroom",
     "why": "Always moving; it never activates"
    },
    {
     "id": "Feather",
     "why": "Grapple and no fall damage already cover it"
    }
   ],
   "tips": [
    "Release the grapple at the top of the swing, then land a fully charged Gauntlet for max velocity damage.",
    "Tap sprint while attached to widen your swing.",
    "Thunderslam and Pylon don't give Scrap Barrier; punch with Knuckleboom or the Gauntlets for it."
   ],
   "fun": {
    "name": "Meteor Loader",
    "items": [
     "FallBoots",
     "UtilitySkillMagazine",
     "Jetpack"
    ],
    "how": "Grapple or fly high, then Thunderslam straight down. H3AD-5T's explosion scales with fall height, so a slam from high up deletes packs."
   },
   "disagreements": "Thunderslam vs M551 Pylon, and Grapple Fist vs Spiked Fist, are both contested. Wiki says heavy attack speed knocks light enemies out of Knuckleboom range, but guides still recommend Soldier's Syringe. S tier on every 2026 list.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Loader",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://riskofrain2.wiki.gg/wiki/Siren%27s_Call",
    "https://rogueranker.com/?p=1629",
    "https://exputer.com/guides/risk-of-rain-2-loader/",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/",
    "https://choostgames.com/blog/risk-of-rain-2-tier-list/"
   ]
  },
  "MUL-T": {
   "role": "Tanky robot (highest base HP); top on-hit carrier with two primaries and two equipment",
   "unlock": "Verified: complete the first Teleporter event 5 times",
   "loadout": [
    {
     "slot": "Primary",
     "pick": "Auto-Nailgun",
     "note": "12 nails/s; best on-hit carrier. Release before Retool for the 12-nail blast"
    },
    {
     "slot": "Primary (2nd)",
     "pick": "Rebar Puncher",
     "note": "600% piercer at 1.0 proc; snipes wisps and pairs with Crowbar",
     "alts": [
      {
       "name": "Auto-Nailgun",
       "note": "Dual nailguns: max procs, no weak swap"
      },
      {
       "name": "Scrap Launcher",
       "note": "AoE rockets; strong with Purity and Brilliant Behemoth. Unlock: Pest Control"
      },
      {
       "name": "Power-Saw",
       "note": "1000%/s melee; heals well with Harvester's Scythe. Unlock: Gotcha!"
      }
     ]
    },
    {
     "slot": "Secondary",
     "pick": "Blast Canister",
     "note": "Stun bomblets for crowd control"
    },
    {
     "slot": "Utility",
     "pick": "Transport Mode",
     "note": "Charge with 200 armor; rams stun big enemies"
    },
    {
     "slot": "Special",
     "pick": "Retool",
     "note": "Swap primaries and hold two equipment",
     "alts": [
      {
       "name": "Power Mode",
       "note": "Both primaries at once plus 100 armor, but -60% move speed. Unlock: Seventh Day"
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "Syringe",
     "Crowbar"
    ],
    "onHit": [
     "Missile",
     "ChainLightning"
    ],
    "sustain": [
     "Seed"
    ],
    "defense": [],
    "mobility": [
     "Hoof",
     "Feather"
    ]
   },
   "legendaries": [
    "Behemoth",
    "AlienHead",
    "BounceNearby"
   ],
   "boss": [
    "FireballsOnHit",
    "LightningStrikeOnHit"
   ],
   "equipment": [
    "BFG",
    "Lightning",
    "MultiShopCard"
   ],
   "avoid": [
    {
     "id": "LunarUtilityReplacement",
     "why": "Replaces Transport Mode, his escape and armor"
    },
    {
     "id": "LunarSpecialReplacement",
     "why": "Replaces Retool; lose the second equipment"
    },
    {
     "id": "BleedOnHit",
     "why": "Bleed chips enemies below Crowbar's 90% threshold"
    }
   ],
   "tips": [
    "Gesture of the Drowned only fires the active slot, so park Preon in the other one.",
    "Transport Mode works as a panic button: huge armor and it stuns what you hit.",
    "Grab Hopoo Feather or Paul's Goat Hoof early; flyers and tall maps are his weak spot."
   ],
   "fun": {
    "name": "Double Rebar",
    "items": [
     "Crowbar",
     "FireRing",
     "IceRing"
    ],
    "how": "Equip Rebar in both slots and Retool after every shot to skip its cooldown; each 600% hit sets off both bands."
   },
   "disagreements": "Second primary: dual Auto-Nailgun (rogueranker) vs Rebar Puncher (wiki/Steam, for range and Crowbar). Scrap Launcher is 'pointless' to some Steam players but good with Purity per the wiki. Retool vs Power Mode both have fans.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/MUL-T",
    "https://riskofrain2.wiki.gg/wiki/Gesture_of_the_Drowned",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://rogueranker.com/mul-t-risk-of-rain-2/",
    "https://exputer.com/guides/risk-of-rain-2-mult/",
    "https://steamcommunity.com/app/632360/discussions/0/4029095281635544355",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/"
   ]
  },
  "Mercenary": {
   "role": "Melee duelist: chains i-frame skills, Expose cuts cooldowns",
   "unlock": "True Respite: obliterate yourself at the Obelisk in A Moment, Fractured",
   "loadout": [
    {
     "slot": "Primary",
     "pick": "Laser Sword",
     "note": "Every 3rd hit Exposes; use skills during 3rd swing to extend"
    },
    {
     "slot": "Secondary",
     "pick": "Rising Thunder",
     "note": "More damage than Whirlwind (550% vs 400%)",
     "alts": [
      {
       "name": "Whirlwind",
       "note": "Smoother combos and AoE; easy to stay airborne vs bosses"
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Blinding Assault",
     "note": "3-dash chain with i-frames; resets on hit",
     "alts": [
      {
       "name": "Focused Assault",
       "note": "One big 700% dash that Exposes; good with Hardlight Afterburner"
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "Slicing Winds",
     "note": "Beats Eviscerate unless you have ~4 Soldier's Syringes; can keep attacking",
     "alts": [
      {
       "name": "Eviscerate",
       "note": "Long invincibility; scales hard with attack speed and Purity"
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "NearbyDamageBonus",
     "AttackSpeedOnCrit",
     "Syringe"
    ],
    "onHit": [
     "ChainLightning"
    ],
    "sustain": [
     "HealOnCrit"
    ],
    "defense": [
     "Bear"
    ],
    "mobility": [
     "Hoof"
    ]
   },
   "legendaries": [
    "KillEliteFrenzy",
    "Clover",
    "Behemoth",
    "AlienHead"
   ],
   "boss": [
    "BleedOnHitAndExplode",
    "LightningStrikeOnHit"
   ],
   "equipment": [
    "CritOnUse",
    "PassiveHealing"
   ],
   "avoid": [
    {
     "id": "Syringe",
     "why": "Past 3-4 stacks it narrows combo windows and shortens dashes"
    },
    {
     "id": "Mushroom",
     "why": "He never stands still"
    },
    {
     "id": "LunarDagger",
     "why": "Halved HP is brutal in melee"
    }
   ],
   "tips": [
    "Strafe behind enemies; dodge actively instead of leaning only on i-frames.",
    "Open with the 3rd Laser Sword hit to Expose, then follow with any skill for the cooldown refund.",
    "Every skill has proc coefficient 1.0, so on-hit items get full value."
   ],
   "fun": {
    "name": "Purity Merc",
    "items": [
     "LunarBadLuck",
     "Clover",
     "KillEliteFrenzy",
     "AlienHead"
    ],
    "how": "One Purity brings Eviscerate and dashes close to always ready; take Clover to cover the luck penalty. Chain them for near-constant invincibility and flight."
   },
   "disagreements": "Rising Thunder (wiki: more damage) vs Whirlwind (rogueranker: smoother). Old guides call him C tier after nerfs; Jan 2026 list says A. Slicing Winds challenge is named 'Mercenary: Ethereal' (one wiki summary mislabeled it).",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Mercenary",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://riskofrain2.wiki.gg/wiki/Update_Notes_V1.4.1",
    "https://rogueranker.com/?p=1619",
    "https://rogueranker.com/purity-ror2/",
    "https://exputer.com/guides/risk-of-rain-2-mercenary/",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/"
   ]
  },
  "Operator": {
   "role": "Fragile, airborne drone commander; weak early, scales with drone count.",
   "unlock": null,
   "loadout": [
    {
     "slot": "Passive",
     "pick": "Drone Tech",
     "note": "Starts each stage with 2 personal drones that self-repair, can't be scrapped, and follow into Hidden Realms."
    },
    {
     "slot": "Primary",
     "pick": "H3-11 OCR Custom",
     "note": "Charged pistol, up to 600% full-charge shot; kills ricochet."
    },
    {
     "slot": "Secondary",
     "pick": "ADMIN-OVERRIDE",
     "note": "Fires the active drone's unique ability; 1 charge per drone you control.",
     "alts": [
      {
       "name": "CMD-SWARM",
       "note": "Paint targets, drones ram for 450% with crit ignite; raw damage pick. Unlock: Operator: That All You Got?"
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Ascent Protocol",
     "note": "Drone lifts you, hop drone to drone; all skills usable mid-air. Keep it.",
     "alts": [
      {
       "name": "FIREWALL",
       "note": "Drone shield that blocks hits, then launches as a 200-600% projectile. Unlock: Operator: Not So Different."
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "Amp Core",
     "note": "Shoot it while it charges to grow radius/damage (up to 2000%); Crowbar boosts it.",
     "alts": [
      {
       "name": "Ejection Core",
       "note": "Default. 300% launch + Nano Bug; gives an air boost during Ascent Protocol. Amp Core unlock: Operator: That Just Happened."
      }
     ]
    },
    {
     "slot": "Drone 1",
     "pick": "Gunner Drone Mk 2",
     "note": "CROSSHAIRS: ricochet shots; more gunners = more damage charges."
    },
    {
     "slot": "Drone 2",
     "pick": "Gunner Drone Mk 2",
     "note": "Community favors double gunners for damage.",
     "alts": [
      {
       "name": "Healing Drone Mk 2",
       "note": "Default DOC; gives barrier, good while learning on 90 base HP."
      },
      {
       "name": "Transport Drone Mk 2",
       "note": "CHIRP carries chests. Unlock: Operator: Putting Together a Team."
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "Crowbar",
     "Syringe",
     "CritAtLowerElevation",
     "DronesDropDynamite"
    ],
    "onHit": [
     "ChainLightning",
     "Missile"
    ],
    "sustain": [],
    "defense": [
     "Bear"
    ],
    "mobility": [
     "Hoof"
    ]
   },
   "legendaries": [
    "DroneWeapons",
    "Behemoth",
    "Clover"
   ],
   "boss": [
    "RoboBallBuddy"
   ],
   "equipment": [
    "DroneBackup"
   ],
   "avoid": [
    {
     "id": "LunarDagger",
     "why": "Halving an already tiny 90 base HP is a death wish."
    },
    {
     "id": "HalfSpeedDoubleHealth",
     "why": "-50% move speed cripples a squishy kiter."
    }
   ],
   "tips": [
    "Buy every drone early: each one adds a secondary charge. Spare Drone Parts is the top pickup.",
    "Chain Ascent Protocol between drones to stay airborne; Hiker's Boots rewards shooting from above.",
    "The Back-up's Strike Drones count as your drones while active: extra queue slots and charges."
   ],
   "fun": {
    "name": "Drone Carrier",
    "items": [
     "DroneWeapons",
     "DronesDropDynamite",
     "RoboBallBuddy",
     "DroneBackup"
    ],
    "how": "Max out allies so ADMIN-OVERRIDE has charges to burn: Col. Droneman frenzy, Lt. Droneboy bomb runs, Strike Drone volleys."
   },
   "disagreements": "Guidance is sparse; rogueranker is the only build guide found. It claims drones proc your on-hit items and inherit crit, but the wiki says drones aren't affected by passive items, so on-hit items mainly work through your own hits and the drone commands (ADMIN-OVERRIDE/CMD-SWARM). rogueranker picks CMD-SWARM; ADMIN-OVERRIDE has unique per-drone effects. Drone slots: the dev diary says he brings 2 drones of your choice and the wiki lists Gunner/Healing/Transport Drone Mk 2 as passive options; the exact slot layout and whether you can double up are not stated on the wiki. Spare Drone Parts was cut 50% in 1.4.1 but is still the top pick. Avoid list is my inference.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Operator",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://riskofrain2.wiki.gg/wiki/Spare_Drone_Parts",
    "https://riskofrain2.wiki.gg/wiki/Box_of_Dynamite",
    "https://riskofrain2.wiki.gg/wiki/Hiker%27s_Boots",
    "https://riskofrain2.wiki.gg/wiki/The_Back-up",
    "https://riskofrain2.wiki.gg/wiki/Empathy_Cores",
    "https://riskofrain2.wiki.gg/wiki/Drones",
    "https://rogueranker.com/operator-ror2/",
    "https://devtrackers.gg/risk-of-rain/p/a0964bdc-dev-diary-3-operator"
   ]
  },
  "REX": {
   "role": "Ranged plant: spends HP on big skills, heals it back",
   "unlock": "Power Plant: carry the Fuel Array from the stage-1 Escape Pod to the broken robot in Abyssal Depths (it explodes if you drop below 50% HP)",
   "loadout": [
    {
     "slot": "Primary",
     "pick": "DIRECTIVE: Inject",
     "note": "3rd syringe weakens and heals based on damage dealt"
    },
    {
     "slot": "Secondary",
     "pick": "Seed Barrage",
     "note": "Default; big burst mortar for 15% HP",
     "alts": [
      {
       "name": "DIRECTIVE: Drill",
       "note": "Free (no HP cost); great with Backup Magazine; use when HP is tight"
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Bramble Volley",
     "note": "550% blast that heals per enemy hit",
     "alts": [
      {
       "name": "DIRECTIVE: Disperse",
       "note": "Free knockback and weaken; safer on Eclipse"
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "Tangling Growth",
     "note": "Roots and groups enemies, heals you; works at very long range",
     "alts": [
      {
       "name": "DIRECTIVE: Harvest",
       "note": "Single target; kills drop healing fruit"
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "CritGlasses",
     "SecondarySkillMagazine"
    ],
    "onHit": [
     "DeathMark",
     "ExplodeOnDeath"
    ],
    "sustain": [
     "HealOnCrit",
     "Infusion"
    ],
    "defense": [
     "Bear"
    ],
    "mobility": [
     "Hoof"
    ]
   },
   "legendaries": [
    "IncreaseHealing",
    "NovaOnHeal",
    "BarrierOnOverHeal",
    "UtilitySkillMagazine"
   ],
   "boss": [
    "Knurl",
    "ParentEgg"
   ],
   "equipment": [
    "PassiveHealing",
    "Blackhole"
   ],
   "avoid": [
    {
     "id": "ShieldOnly",
     "why": "HP becomes shield, which breaks the HP-cost/heal loop"
    },
    {
     "id": "EliteLightningEquipment",
     "why": "Overloading aspect turns half your HP into shield"
    },
    {
     "id": "EliteLunarEquipment",
     "why": "Shield conversion; self-damage eats it"
    },
    {
     "id": "GoldOnHit",
     "why": "Self-damage makes you lose lots of gold"
    }
   ],
   "tips": [
    "Inject heals off damage dealt, so damage items also buy healing.",
    "Fire Disperse or Bramble Volley downward mid-jump to launch yourself; it's his only mobility.",
    "HP costs can't kill you and they trigger Medkit/Planula; Tougher Times can block them."
   ],
   "fun": {
    "name": "Drill Storm",
    "items": [
     "SecondarySkillMagazine",
     "IgniteOnKill",
     "ExplodeOnDeath",
     "Blackhole"
    ],
    "how": "Group enemies with Tangling Growth or the Cube, then stack several Drills on them; kills chain into fire and wisp blasts."
   },
   "disagreements": "Seed Barrage (burst) vs DIRECTIVE: Drill (free, safer). Rogueranker lists Titanic Knurl as red, but it's a boss item. Tier C (Jan 2026) vs B (Apr 2026). Heal-first vs damage-first itemizing (wiki favors damage).",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/REX",
    "https://riskofrain2.wiki.gg/wiki/Fuel_Array",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://riskofrain2.wiki.gg/wiki/Silence_Between_Two_Strikes",
    "https://rogueranker.com/?p=1621",
    "https://steamcommunity.com/app/632360/discussions/0/6192985336598815362",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/"
   ]
  },
  "Railgunner": {
   "role": "Precision sniper; crit chance becomes crit damage, one-shots elites via weak points.",
   "unlock": null,
   "loadout": [
    {
     "slot": "Primary",
     "pick": "XQR Smart Round System",
     "note": "Tracking rounds for chip damage; recoil can slow falls."
    },
    {
     "slot": "Secondary",
     "pick": "M99 Sniper",
     "note": "1000% piercing shot; hit Active Reload for +500% on the next shot. Passive Magnetic Accelerator turns crit chance into crit damage.",
     "alts": [
      {
       "name": "HH44 Marksman",
       "note": "Unlock via Railgunner: Marksman. 400% shots, 2/s, no reload; easier mobbing if reload timing is hard."
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Concussion Device",
     "note": "2 charges; knocks you and enemies away. Mobility and fall-cancel.",
     "alts": [
      {
       "name": "Polar Field Device",
       "note": "Unlock via Railgunner: Annihilator. Slows enemies and projectiles; good vs projectile-heavy stages or co-op."
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "Supercharge",
     "note": "4000% piercing round, 3.0 proc; weapons disabled 5s after. Boss deleter.",
     "alts": [
      {
       "name": "Cryocharge",
       "note": "Unlock via Railgunner: Trickshot. 2000% freezing round; frozen enemies under 30% HP die. Safer, more CC."
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "CritGlasses",
     "Crowbar",
     "AttackSpeedOnCrit",
     "Syringe"
    ],
    "onHit": [
     "FireRing",
     "IceRing"
    ],
    "sustain": [],
    "defense": [
     "Bear"
    ],
    "mobility": [
     "Hoof"
    ]
   },
   "legendaries": [
    "CritDamage",
    "Clover",
    "Behemoth"
   ],
   "boss": [
    "LightningStrikeOnHit"
   ],
   "equipment": [
    "CritOnUse",
    "Lightning",
    "Blackhole"
   ],
   "avoid": [
    {
     "id": "SecondarySkillMagazine",
     "why": "Extra M99 charges don't get reload bonus; does nothing for HH44."
    },
    {
     "id": "LunarSecondaryReplacement",
     "why": "Heresy items block weak-point crits and replace your sniper skills."
    }
   ],
   "tips": [
    "Always hit the Active Reload sweet spot; attack speed widens it.",
    "Aim for weak points: crit damage scaling only applies there.",
    "Chain both Concussion charges for big height or to cancel fall damage."
   ],
   "fun": {
    "name": "Railnuke",
    "items": [
     "StickyBomb",
     "Behemoth",
     "Missile"
    ],
    "how": "Supercharge's 3.0 proc guarantees Sticky Bomb at ~7 stacks and triples Behemoth's blast radius; one shot clears a line."
   },
   "disagreements": "Unlock: no challenge needed (available with Survivors of the Void enabled). Backup Magazine: eXputer (2022) recommends it; wiki calls it weak for her. M99 vs HH44 is preference.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Railgunner",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://riskofrain2.wiki.gg/wiki/Runald%27s_Band",
    "https://rogueranker.com/?p=1625",
    "https://exputer.com/guides/risk-of-rain-2-railgunner-survivor/",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/"
   ]
  },
  "Seeker": {
   "role": "Mid-range healer/brawler; stacks Tranquility for team revives and big AoE.",
   "unlock": null,
   "loadout": [
    {
     "slot": "Passive",
     "pick": "Inner Strength",
     "note": "Each Tranquility (max 7) buffs every skill and +1% all stats; resets each stage."
    },
    {
     "slot": "Primary",
     "pick": "Spirit Punch",
     "note": "Only option; every 3rd hit explodes and scales hard with Tranquility."
    },
    {
     "slot": "Secondary",
     "pick": "Soul Spiral",
     "note": "Orbs grant barrier on hit; pop it before Sojourn to fly longer.",
     "alts": [
      {
       "name": "Unseen Hand",
       "note": "Default. Piercing ranged burst + heal; safer if you hate close range. Soul Spiral unlock: Seeker: Airborne Souls."
      }
     ]
    },
    {
     "slot": "Utility",
     "pick": "Sojourn",
     "note": "Flight + explosion, immune to other damage while flying; great for mobility and pillar skips.",
     "alts": [
      {
       "name": "Reprieve",
       "note": "Safer barrier/flight with healing cyclone. Unlock: Seeker: Scorched Earth."
      }
     ]
    },
    {
     "slot": "Special",
     "pick": "Meditate",
     "note": "Builds Tranquility via 5-input minigame; at 7 stacks revives allies + Saving Grace self-revive.",
     "alts": [
      {
       "name": "Palm Blast",
       "note": "Aggro charge shot that gains Tranquility by multi-hitting; no revive or Saving Grace. Unlock: Seeker: Clear Mind."
      }
     ]
    }
   ],
   "core": {
    "damage": [
     "Syringe",
     "NearbyDamageBonus",
     "SecondarySkillMagazine"
    ],
    "onHit": [
     "ChainLightning"
    ],
    "sustain": [
     "HealOnCrit"
    ],
    "defense": [
     "Bear"
    ],
    "mobility": [
     "Hoof"
    ]
   },
   "legendaries": [
    "IncreaseHealing",
    "Behemoth",
    "AlienHead",
    "Clover"
   ],
   "boss": [
    "SprintWisp",
    "ParentEgg"
   ],
   "equipment": [
    "TeamWarCry",
    "CritOnUse"
   ],
   "avoid": [
    {
     "id": "RepeatHeal",
     "why": "Turns her burst heals (Unseen Hand, Meditate) into slow trickle."
    },
    {
     "id": "LunarDagger",
     "why": "Halved HP shortens Sojourn, which lasts longer with more HP."
    }
   ],
   "tips": [
    "Meditate right out of the pod and on cooldown; reach 7 Tranquility ASAP each stage. A missed input adds 5s cooldown.",
    "Sojourn cuts healing received the longer you fly and self-damages after ~1.4s; land before you drop under 15%.",
    "Backup Magazine adds Soul Spiral charges, which doubles as extra mobility."
   ],
   "fun": {
    "name": "Buckler Bomber",
    "items": [
     "FlatHealth",
     "SprintArmor",
     "SprintWisp",
     "Infusion"
    ],
    "how": "Stack HP so Sojourn lasts longer; Buckler armor and Disciple wisps work while you sprint-fly over enemies."
   },
   "disagreements": "Secondary split: rogueranker favors Soul Spiral; itemlevel (2024) says Unseen Hand for ranged play, Soul Spiral for aggressive. itemlevel leans defensive (Tougher Times, Repulsion Armor Plate, Rose Buckler, Planula, Weeping Fungus); rogueranker leans damage/cooldowns (Focus Crystal, Backup Magazine, Bandolier). Wiki says Transcendence caps Sojourn self-damage at 1, which is a niche upside, not a standard pick. Both guides predate SotS 2.0 survivor changes (May 2025). Avoid list is my inference from wiki mechanics, not from a guide.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Seeker",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://rogueranker.com/seeker-ror2/",
    "https://itemlevel.net/risk-of-rain-2-seeker-complete-guide-seekers-of-the-storm-dlc/",
    "https://rogueranker.com/?p=1734"
   ]
  },
  "Void Fiend": {
   "role": "Two-form fighter: safe ranged poke, then a high-DPS Corrupted form fueled by crits and damage taken.",
   "unlock": "Dragged Below: Escape the Planetarium (beat Voidling) or clear wave 50 in Simulacrum.",
   "loadout": [
    {
     "slot": "Primary",
     "pick": "Drown",
     "note": "Long-range 300% slowing beam. Corrupted: short-range 2000% piercing beam that slows you."
    },
    {
     "slot": "Secondary",
     "pick": "Flood",
     "note": "600% missile, or charge for 1100% plasma ball. Corrupted: instant arcing 1100% bomb, doubles as a launch."
    },
    {
     "slot": "Utility",
     "pick": "Trespass",
     "note": "Vanish and cleanse all debuffs, upward arc. Corrupted: fast forward dash."
    },
    {
     "slot": "Special",
     "pick": "Suppress",
     "note": "Spend 25% Corruption to heal 25% HP. Corrupted: spend 25% HP to gain 25% Corruption and stay corrupted."
    }
   ],
   "core": {
    "damage": [
     "CritGlasses",
     "Syringe",
     "AttackSpeedOnCrit"
    ],
    "onHit": [
     "FireRing"
    ],
    "sustain": [
     "HealOnCrit"
    ],
    "defense": [
     "Bear"
    ],
    "mobility": [
     "SecondarySkillMagazine",
     "Hoof"
    ]
   },
   "legendaries": [
    "IncreaseHealing",
    "CritDamage",
    "Clover"
   ],
   "boss": [
    "Knurl"
   ],
   "equipment": [
    "CritOnUse"
   ],
   "avoid": [
    {
     "id": "MushroomVoid",
     "why": "Sprint healing drains Corruption and stalls your transform."
    },
    {
     "id": "RepeatHeal",
     "why": "Healing over time slowly drains Corruption."
    }
   ],
   "tips": [
    "Crits and damage taken build Corruption; healing drains it. Plan heals around your form.",
    "Transforming resets cooldowns and gives a brief invuln; corrupted form also has +100 armor.",
    "Each void item raises your minimum Corruption by 2%; Lysate Cell adds a Suppress charge."
   ],
   "fun": {
    "name": "Void Hoarder",
    "items": [
     "BearVoid",
     "EquipmentMagazineVoid",
     "MissileVoid",
     "ChainLightningVoid"
    ],
    "how": "Stack void items to raise the Corruption floor until you basically live in Corrupted form."
   },
   "disagreements": "RogueRanker says avoid Crowbar/Focus Crystal/Delicate Watch because they boost Corrupted Suppress self-damage, and avoid barrier items. Wiki says the self-damage no longer procs your items, and calls Topaz Brooch neutral.",
   "sources": [
    "https://riskofrain2.wiki.gg/wiki/Void_Fiend",
    "https://riskofrain2.wiki.gg/wiki/Challenges",
    "https://rogueranker.com/void-fiend-ror2/",
    "https://commonsensegamer.com/risk-of-rain-2-tier-list/"
   ]
  }
 }
};
