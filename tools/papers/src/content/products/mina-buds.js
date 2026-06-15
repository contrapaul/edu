// Lumina LB-2 Wireless Earbuds — Mina's second product.
// Introduces battery safety (the critical component) and the drop-test
// mini-game. Reuses the same generic engine as the speaker; only data differs.

export default {
  id: 'mina-buds',
  name: 'LuminaBuds Wireless Earbuds',
  category: 'wireless',
  categories: ['electronics', 'wireless', 'battery'],
  difficulty: 3,
  startBudget: 200000,

  availableMarkets: ['usa', 'california', 'eu', 'china', 'japan', 'australia'],

  // Buyers expect active noise cancelling on premium earbuds; the rival has it.
  market: { valuedCaps: { anc: 0.28 } },
  competitor: { name: 'SonicWave Air', caps: { bluetooth: true, anc: true } },

  defaultBudgetAllocation: {
    testing:       60000,
    materials:     50000,
    manufacturing: 60000,
    consulting:    30000
  },
  priceRange: { min: 49.99, max: 249.99, default: 129.99 },

  components: [
    { id: 'case', name: 'Charging Case', kind: 'material', materialSet: 'enclosure' },

    { id: 'battery', name: 'Li-ion Cells (55 mAh)', kind: 'supplier', critical: true,
      note: 'Lithium cells govern air-freight (UN 38.3) and your worst-case failure mode. Source them carefully.',
      options: [
        { id: 'lg-inr', name: 'INR-series 55 mAh', mfr: 'LG Energy Solution', unitCost: 2.10,
          rating: 5, docsComplete: true, caps: {}, riskChance: 0.04,
          note: 'Tier-1 cells with full UN 38.3 test summaries on file.' },
        { id: 'eve-55', name: 'EVE 55 mAh', mfr: 'EVE Energy', unitCost: 1.40,
          rating: 4, docsComplete: true, caps: {}, riskChance: 0.07,
          note: 'Solid mid-tier; paperwork complete, slightly thinner thermal margin.' },
        { id: 'generic-cell', name: 'Unbranded 55 mAh', mfr: 'Unbranded', unitCost: 0.70,
          rating: 2, docsComplete: false, caps: {}, riskChance: 0.30,
          risk: { text: 'A few cells run hot and one swelled in its case — battery-swelling posts go viral fast.' },
          note: 'Cheapest by far. "Safe" sticker; no transport test data.' }
      ] },

    { id: 'btsoc', name: 'Bluetooth SoC', kind: 'supplier', options: [
      { id: 'qcc5181', name: 'QCC5181 (BT 5.3, ANC)', mfr: 'Qualcomm', unitCost: 3.80,
        rating: 5, docsComplete: true, caps: { bluetooth: true, anc: true }, riskChance: 0.05,
        note: 'Hardware active noise cancelling and aptX. The premium path.' },
      { id: 'nrf5340', name: 'nRF5340 (BT 5.4)', mfr: 'Nordic', unitCost: 2.60,
        rating: 5, docsComplete: true, caps: { bluetooth: true, anc: false }, riskChance: 0.05,
        note: 'Excellent radio and battery life — but no built-in ANC.' },
      { id: 'generic-bt', name: 'BT 5.0 SoC', mfr: 'Bluetrum', unitCost: 1.10,
        rating: 3, docsComplete: true, caps: { bluetooth: true, anc: false }, riskChance: 0.12,
        note: 'Cheap and gets you paired. No ANC, older stack.' }
    ] },

    { id: 'driver', name: 'Audio Driver', kind: 'supplier', options: [
      { id: 'knowles-ba', name: 'Balanced armature', mfr: 'Knowles', unitCost: 2.40,
        rating: 5, docsComplete: true, caps: {}, riskChance: 0.04,
        note: 'Crisp detailed sound; reviewers notice.' },
      { id: 'dyn-10mm', name: '10 mm dynamic driver', mfr: 'AAC Technologies', unitCost: 0.90,
        rating: 4, docsComplete: true, caps: {}, riskChance: 0.06,
        note: 'Warm, punchy, the sensible default.' },
      { id: 'mylar', name: 'Mylar micro-driver', mfr: 'Unbranded', unitCost: 0.35,
        rating: 2, docsComplete: true, caps: {}, riskChance: 0.10,
        note: 'Tinny and inconsistent batch to batch, but almost free.' }
    ] }
  ],

  phases: {
    brief: {
      from: 'Priya (Electrical)',
      memo: `The speaker shipped, so naturally Marketing has promised earbuds by spring. These are harder: tiny enclosure, a lithium battery in each bud and the case, and a radio that has to thread the same EMC needle in a fraction of the space. Decide our markets and budget — and remember that lithium cells have their own rules for crossing borders by air.`,
      marketingClaim: '"LuminaBuds: the LAST earbuds you will EVER need. Literally immortal sound."',
      legalNote: 'Cannot claim immortality or permanence of audio. — REMOVED',
      internNote: 'Kevin asks whether we can ship the batteries "by just, like, normal post." We cannot. Kevin has been enrolled in dangerous-goods training.',
      hint: 'Lithium batteries add UN 38.3 transport testing and make air freight conditional. Budget for it.',
      emails: [
        { id: 'bb1', from: 'Janet · Marketing', subject: 'colourways',
          body: "Quick one — can the earbuds come in 14 colours by launch? The influencers each want their own. This shouldn't affect certification right?? 🙂" }
      ]
    },

    design: {
      intro: `Miniaturisation is the whole game here. The case material has to survive being dropped on pavement daily, the cells have to be airworthy, and every component is crammed millimetres from the antenna.`,
      steveNote: 'Steve: "These unbranded cells are 40% cheaper and have a sticker that says \'safe\'. The sticker is right there. What more do you want?"',
      emails: [
        { id: 'bd1', from: 'Sarah (loaned from AeroCube)', subject: 'cells',
          body: "Heard you're speccing batteries. One word: documentation. Two words: UN 38.3. Three words: please don't explode." }
      ]
    },

    testing: {
      intro: `Earbuds get dropped, sat on, and rained on, and the battery has to survive all of it. Pre-test the emissions, the drop survival, and the cells before any certifier sees them.`,
      emails: [
        { id: 'bt1', from: 'Test Lab', subject: 'the case',
          body: "Drop results attached. We also flushed one down a toilet to see what would happen. Science. It did not pass the toilet test, but that isn't a standard, so." }
      ],
      tests: [
        { id: 'emc', name: 'EMC Pre-Scan', cost: 2800, days: 2, interactive: true, minigame: 'emc',
          certRequired: true, certReworkCost: 2000, certMissingCost: 2800,
          desc: 'Sweep the Bluetooth radio and charging-case emissions against the limits.' },
        { id: 'droptest', name: 'Drop / Impact Test', cost: 2200, days: 2, interactive: true, minigame: 'droptest',
          certRequired: true, certReworkCost: 1600, certMissingCost: 2400,
          desc: 'Drop the charging case and buds onto hard surfaces; find what cracks.' },
        { id: 'battery', name: 'Battery Safety (UN 38.3)', cost: 4000, days: 4, certReworkCost: 3000,
          desc: 'Thermal, short-circuit and transport testing of the lithium cells.' },
        { id: 'chemical', name: 'Chemical Composition', cost: 3000, days: 3,
          desc: 'Screen the case material and coatings for restricted/Prop 65 substances.' }
      ],
      emc: {
        standardLabel: 'FCC §15 / CE RED',
        maxApplications: 5,
        peaks: [
          { id: 'bt',   freq: '2.4 GHz', label: 'Bluetooth fundamental spur', source: 'Bluetooth SoC antenna radiated emission', excess: 6, correctFix: 'shield' },
          { id: 'buck', freq: '1.5 MHz', label: '1.5 MHz charging noise', source: 'Charging-case buck converter', excess: 6, correctFix: 'ferrite', psuSensitive: true },
          { id: 'harm', freq: '4.8 GHz', label: '2nd-harmonic spur', source: 'Antenna matching network', excess: 4, correctFix: 'filter' },
          { id: 'clk',  freq: '32 MHz',  label: 'SoC clock', source: 'SoC reference clock (already filtered)', excess: -2, correctFix: null }
        ]
      },
      droptest: {
        surfaceNote: '1.5 m drop onto concrete',
        maxReinforcements: 4,
        points: [
          { id: 'hinge', label: 'Case hinge', source: 'Thin living hinge fatigues and snaps', x: 0.5, y: 0.05, weakness: 7, correctFix: 'rib' },
          { id: 'wall',  label: 'Case wall', source: 'Flat panel flexes and cracks on impact', x: 0.12, y: 0.5, weakness: 5, correctFix: 'thicker' },
          { id: 'stem',  label: 'Earbud stem', source: 'Slender stem shears at the root', x: 0.88, y: 0.5, weakness: 6, correctFix: 'material' },
          { id: 'usb',   label: 'USB-C boss', source: 'Port boss is already well-ribbed', x: 0.5, y: 0.92, weakness: -2, correctFix: null }
        ]
      }
    },

    certification: {
      modelName: 'Lumina LB-2',
      materialLabel: 'Declared case material',
      critCorrectCost: 2500,
      toleranceCheck: {
        id: 'cell-rating', doc: 'Form 12-A', field: 'Cell capacity rating',
        fileValue: '55 mAh', formValue: '54 mAh', correctCost: 150,
        note: 'A 1 mAh difference between datasheet and label. Real inconsistency, or measurement tolerance?'
      },
      deskIntro: `Mr. Zhang is back, and lithium paperwork makes him especially thorough. Cross-check the file against the form — the battery annexes are where these submissions usually die.`,
      emails: [
        { id: 'bc1', from: 'IATA Desk', subject: 'air freight',
          body: "Without UN 38.3 test summaries on file, your cells travel by sea. Sea takes six weeks. Just so you've planned for that." }
      ],
      letter: {
        body: `RE: Application LB-2/RED/2026. The competent authority, having regard to the documentation tendered, identifies an absence of correspondence between the nominal cell chemistry as declared and the chemistry recited in the transport test summary annexed hereto, and requires reconciliation thereof prior to the affixing of any mark.`,
        translation: `Plain English (via Gunther): "The battery chemistry written on your form doesn't match the chemistry in your UN 38.3 test report. Make them agree."`,
        responses: [
          { id: 'fix', text: 'Correct the form so the declared chemistry matches the battery test report.', correct: true },
          { id: 'argue', text: 'Insist lithium is lithium and request they proceed.', correct: false,
            outcome: 'Chemistry sub-types matter for transport class. Rejected — resubmit. (Reputation −.)' },
          { id: 'ignore', text: 'Ignore it; the cells are probably fine.', correct: false,
            outcome: '"Probably fine" is not a recognised conformity basis. Launch slips. (Reputation −.)' }
        ]
      }
    },

    manufacturing: {
      intro: `Final stretch. Earbuds are fiddly to assemble and easy to get subtly wrong — and the battery labelling has its own customs rules. Pick a partner, inspect, and label correctly.`,
      emails: [
        { id: 'bm1', from: 'Factory Floor', subject: 'helpful change 😇',
          body: "We swapped your cells for a slightly bigger one that fits almost perfectly (just trimmed a wall). More battery = better, yes? Shipping!" }
      ],
      factories: [
        { id: 'shenzhen', name: 'Shenzhen MegaFab', quality: 3, speed: 5, cost: 1, compliance: 2, setup: 10000, perUnit: 1.20,
          note: 'Fast and cheap. Battery handling history is… we don\'t ask.' },
        { id: 'vietnam', name: 'Hanoi Precision', quality: 4, speed: 3, cost: 3, compliance: 4, setup: 15000, perUnit: 2.00,
          note: 'Reliable, certified lithium assembly line.' },
        { id: 'brno', name: 'Brno Assembly (EU)', quality: 5, speed: 2, cost: 5, compliance: 5, setup: 24000, perUnit: 3.80,
          note: 'Immaculate, audited, and priced like it.' }
      ],
      firstArticle: [
        { id: 'tint',  finding: 'Case plastic is a half-shade lighter than spec', real: false, reworkCost: 400,
          note: 'Within the colour tolerance band. Cosmetic.' },
        { id: 'cell',  finding: 'Substituted battery cell, different part number', real: true, reworkCost: 1200,
          fromFactories: ['shenzhen', 'vietnam'],
          note: 'A different cell invalidates your UN 38.3 testing. Serious.' },
        { id: 'glue',  finding: 'Extra adhesive bead near the acoustic vent', real: true, reworkCost: 500,
          fromFactories: ['shenzhen'],
          note: 'Blocks the vent and changes the certified acoustic design.' }
      ],
      availableMarks: [
        { id: 'ce',      label: 'CE',          market: 'eu' },
        { id: 'weee',    label: 'WEEE bin',    market: 'eu' },
        { id: 'libatt',  label: 'Li-ion ⚡',   market: 'eu' },
        { id: 'fcc',     label: 'FCC',         market: 'usa' },
        { id: 'prop65',  label: 'Prop 65',     market: 'california' },
        { id: 'ccc',     label: 'CCC',         market: 'china' },
        { id: 'pse',     label: 'PSE',         market: 'japan' },
        { id: 'rcm',     label: 'RCM',         market: 'australia' },
        { id: 'recycle', label: 'Recycle ♺',   market: null }
      ]
    },

    launch: {
      intro: `Launch day for the buds. Reviews obsess over fit, battery life, and whether they survive a pavement drop — all things you just decided.`,
      baseUnits: 11000,
      critBurnText: 'A few units are running hot while charging and one swelled in its case. Battery-swelling posts are the worst kind of viral. Support is overwhelmed.'
    }
  }
};
