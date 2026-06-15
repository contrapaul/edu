// Aero Micro Drone (Indoor) — Leo's first product.
// Focus: mechanical/impact safety (drones crash), FCC Part 15 radio, ASTM F963
// toy safety, and LiPo battery safety. Uses both the EMC and drop-test mini-games.

export default {
  id: 'leo-microdrone',
  name: 'Aero Micro Drone',
  category: 'wireless',
  categories: ['electronics', 'wireless', 'battery'],
  difficulty: 2,
  startBudget: 140000,

  availableMarkets: ['usa', 'california', 'eu', 'china', 'japan', 'australia'],

  defaultBudgetAllocation: {
    testing:       45000,
    materials:     35000,
    manufacturing: 40000,
    consulting:    20000
  },
  priceRange: { min: 24.99, max: 99.99, default: 49.99 },

  components: [
    { id: 'frame', name: 'Frame & Prop Guards', kind: 'material', materialSet: 'enclosure' },
    { id: 'battery', name: 'LiPo Cell', kind: 'supplier', critical: true,
      note: 'A single LiPo flying around a child\'s bedroom. Source cells with real UN 38.3 data.' },
    { id: 'motor', name: 'Brushless Motors', kind: 'supplier' },
    { id: 'radio', name: '2.4 GHz Radio', kind: 'supplier' }
  ],

  phases: {
    brief: {
      from: 'Leo',
      memo: `Okay team, the micro drone! Indoor, tiny, basically a flying toy — which is the catch: "toy" means ASTM F963 and a whole childproofing rulebook on top of the radio and battery stuff. It also will be flown directly into walls, faces, and the dog. Pick our markets and budget, and let's not make something that loses a propeller into someone's eye.`,
      marketingClaim: '"The Aero Micro Drone: so safe you could let a TODDLER pilot it across a LAKE OF FIRE."',
      legalNote: 'Cannot depict children, lakes of fire, or unsupervised toddler flight. — REMOVED',
      internNote: 'Kevin flew the prototype into the office sprinkler head. The sprinkler held. The drone did not. Kevin says this is "good data".',
      hint: 'Toys trigger ASTM F963 (US) and the EU Toy Directive — small parts, sharp edges, and impact all get tested.',
      emails: [
        { id: 'lmb1', from: 'Sarah · Mechanical', subject: 'prop guards',
          body: "Non-negotiable: full prop guards. I have a folder of crash videos and I will make everyone watch it. Choose a frame material that survives a wall at speed." }
      ]
    },

    design: {
      intro: `Tiny and tough is the brief. The frame has to take repeated crashes and keep the propellers caged, the cells fly inches from a child, and the radio shares 2.4 GHz with every wifi router in the house.`,
      steveNote: 'Steve: "Elena found motors with no markings for almost nothing. The seller\'s store is called \'Definately Motors\'. I think that\'s fine?"',
      emails: [
        { id: 'lmd1', from: 'Elena · Supply Chain', subject: 'cells',
          body: "I can get LiPos 50% cheaper from a guy. No paperwork, but they're \"the same factory, probably\". Your call, but I'm legally obligated to say I told you they had no docs." }
      ]
    },

    testing: {
      intro: `It will be crashed, chewed, and dropped down stairs. Pre-test the emissions, the impact survival, and the battery before any toy-safety lab sees it.`,
      emails: [
        { id: 'lmt1', from: 'Toy Test Lab', subject: 'F963 pre-check',
          body: "Drop and impact results attached. We also gave it to an actual eight-year-old. She named it Gerald and immediately flew Gerald into a ceiling fan. Gerald survived. Mostly." }
      ],
      tests: [
        { id: 'emc', name: 'EMC Pre-Scan', cost: 2200, days: 2, interactive: true, minigame: 'emc',
          certRequired: true, certReworkCost: 1600, certMissingCost: 2400,
          desc: 'Sweep the 2.4 GHz radio and motor-ESC emissions against FCC & CE limits.' },
        { id: 'droptest', name: 'Impact / Crash Test', cost: 2000, days: 2, interactive: true, minigame: 'droptest',
          certRequired: true, certReworkCost: 1500, certMissingCost: 2200,
          desc: 'Fly it into a wall (repeatedly) and find what breaks or sheds parts.' },
        { id: 'battery', name: 'Battery Safety (UN 38.3)', cost: 3500, days: 4, certReworkCost: 2800,
          desc: 'Thermal, crush, and short-circuit testing of the LiPo cell.' },
        { id: 'chemical', name: 'Chemical / Phthalates', cost: 2800, days: 3,
          desc: 'Screen soft parts and coatings for phthalates and Prop 65 substances.' }
      ],
      emc: {
        standardLabel: 'FCC §15 / CE RED',
        maxApplications: 5,
        peaks: [
          { id: 'radio', freq: '2.4 GHz', label: 'Control-radio spur', source: '2.4 GHz control-link transmitter', excess: 6, correctFix: 'shield' },
          { id: 'esc',   freq: '500 kHz', label: '500 kHz ESC switching', source: 'Motor electronic speed controllers', excess: 7, correctFix: 'ferrite', psuSensitive: true },
          { id: 'pwm',   freq: '1.1 MHz', label: '1.1 MHz motor PWM', source: 'Motor drive PWM stage', excess: 4, correctFix: 'filter' },
          { id: 'clk',   freq: '24 MHz',  label: '24 MHz flight-controller clock', source: 'Flight controller (filtered)', excess: -2, correctFix: null }
        ]
      },
      droptest: {
        surfaceNote: 'flown into a wall at full throttle',
        maxReinforcements: 4,
        points: [
          { id: 'guard', label: 'Prop guard', source: 'Guard ring snaps and frees the propeller', x: 0.5, y: 0.05, weakness: 7, correctFix: 'rib' },
          { id: 'arm',   label: 'Motor arm', source: 'Thin arm shears off on impact', x: 0.1, y: 0.5, weakness: 6, correctFix: 'thicker' },
          { id: 'clip',  label: 'Battery clip', source: 'Brittle clip cracks and ejects the cell', x: 0.9, y: 0.5, weakness: 5, correctFix: 'material' },
          { id: 'body',  label: 'Centre body', source: 'Already well-gusseted', x: 0.5, y: 0.92, weakness: -2, correctFix: null }
        ]
      }
    },

    certification: {
      modelName: 'Aero MD-1',
      materialLabel: 'Declared frame material',
      critCorrectCost: 1800,
      toleranceCheck: {
        id: 'mass-rating', doc: 'Form 9-T', field: 'Take-off mass',
        fileValue: '24.6 g', formValue: '25 g', correctCost: 150,
        note: 'File says 24.6 g, the toy label rounds to 25 g. Real error, or fair rounding below the 250 g threshold?'
      },
      deskIntro: `Toy certification means a thick child-safety annex on top of the radio and battery files. Leo\'s assistant has assembled it; the toy-safety reviewer is famously literal. Sort the genuine errors from the rounding.`,
      emails: [
        { id: 'lmc1', from: 'Toy Safety Office', subject: 'small parts',
          body: "Reminder: any part that detaches and fits in the small-parts cylinder needs the choking-hazard warning and the right age grading. Your propellers are, definitionally, small parts that detach. Discuss." }
      ],
      letter: {
        body: `RE: Application MD-1/TOY/2026. The authority, having regard to the conformity dossier, observes that the age-grading marked upon the retail packaging is not reconciled with the small-parts determination recorded in the safety assessment annexed hereto, and requires correspondence between the two prior to placement on the market.`,
        translation: `Plain English (via Sarah): "The age rating on the box doesn't match your small-parts test. The drone has small detachable parts, so it can't be graded for under-3s. Fix the box."`,
        responses: [
          { id: 'regrade', text: 'Reprint the box with the correct age grading (14+) and choking warning.', correct: true },
          { id: 'argue', text: 'Argue that toddlers "probably won\'t" remove the propellers.', correct: false,
            outcome: 'Toy safety is assessed on what a child *can* do, not *will*. Rejected. (Reputation −.)' },
          { id: 'ignore', text: 'Keep the cute "ages 3+" grading; it sells better.', correct: false,
            outcome: 'A mis-graded toy with small parts is a recall waiting to happen. (Reputation −.)' }
        ]
      }
    },

    manufacturing: {
      intro: `Last gate. Toys get sampled hard at customs, and a missing choking-hazard warning or age grade stops the whole shipment. Pick a partner, inspect, and label it right.`,
      emails: [
        { id: 'lmm1', from: 'Factory Floor', subject: 'lighter props!',
          body: "We switched to a thinner, lighter propeller for better flight time. Snaps off a little easier but flies GREAT. Already in 6,000 units. You're welcome!" }
      ],
      factories: [
        { id: 'shenzhen', name: 'Shenzhen MegaFab', quality: 3, speed: 5, cost: 1, compliance: 2, setup: 7000,
          note: 'Fast and cheap. Elena\'s favourite. Toy-safety record is patchy.' },
        { id: 'vietnam', name: 'Hanoi Precision', quality: 4, speed: 3, cost: 3, compliance: 4, setup: 11000,
          note: 'Holds your spec, including the prop guards.' },
        { id: 'brno', name: 'Brno Assembly (EU)', quality: 5, speed: 2, cost: 5, compliance: 5, setup: 18000,
          note: 'Toy-certified line, audited, pricey.' }
      ],
      firstArticle: [
        { id: 'colour', finding: 'Body colour is a shade off the swatch', real: false, reworkCost: 300,
          note: 'Within tolerance. Cosmetic.' },
        { id: 'prop',   finding: 'Propellers are a thinner, snappier type than spec', real: true, reworkCost: 900,
          note: 'Easier-shedding props change the impact and small-parts results you certified.' },
        { id: 'warn',   finding: 'Choking-hazard warning missing from one carton run', real: true, reworkCost: 600,
          note: 'A toy without the required warning is detained at customs.' }
      ],
      availableMarks: [
        { id: 'ce',      label: 'CE',          market: 'eu' },
        { id: 'weee',    label: 'WEEE bin',    market: 'eu' },
        { id: 'fcc',     label: 'FCC',         market: 'usa' },
        { id: 'prop65',  label: 'Prop 65',     market: 'california' },
        { id: 'ccc',     label: 'CCC',         market: 'china' },
        { id: 'pse',     label: 'PSE',         market: 'japan' },
        { id: 'rcm',     label: 'RCM',         market: 'australia' },
        { id: 'recycle', label: 'Recycle ♺',   market: null }
      ]
    },

    launch: {
      intro: `Launch day. Kids fly it, parents review it, and YouTubers test exactly how hard it can hit a wall. Everything you decided about toughness and safety shows up in the comments.`,
      baseUnits: 13000,
      critBurnText: 'Parents report cells getting hot and one puffing up inside the drone after a crash. "Is my kid\'s toy a fire risk?" is now a headline. Support is melting down.'
    }
  }
};
