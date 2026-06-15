// Storm RC Racing Car — Leo's second product.
// Focus: radio-transmitter certification, the EU Toy Directive speed limit,
// phthalates in soft plastics, and small-parts warnings. Uses EMC + a bespoke
// speed-limit test.

import { getPart } from '../materials.js';

export default {
  id: 'leo-rccar',
  name: 'Storm RC Racing Car',
  category: 'wireless',
  categories: ['electronics', 'wireless', 'battery'],
  difficulty: 2,
  startBudget: 160000,

  availableMarkets: ['usa', 'california', 'eu', 'china', 'japan', 'australia'],

  // Hobby buyers want proportional steering/throttle, not cheap on/off control; the rival has it.
  market: { valuedCaps: { proportional: 0.20 } },
  competitor: { name: 'Bolt RC Pro', caps: { proportional: true } },

  defaultBudgetAllocation: {
    testing:       50000,
    materials:     40000,
    manufacturing: 45000,
    consulting:    25000
  },
  priceRange: { min: 29.99, max: 129.99, default: 59.99 },

  components: [
    { id: 'chassis', name: 'Chassis & Body', kind: 'material', materialSet: 'enclosure' },

    { id: 'battery', name: 'Battery Pack', kind: 'supplier', critical: true,
      note: 'A removable pack a child will charge unsupervised. Proper safety docs matter.',
      options: [
        { id: 'reedy', name: 'NiMH race pack', mfr: 'Reedy', unitCost: 2.40,
          rating: 5, docsComplete: true, caps: {}, riskChance: 0.05,
          note: 'Proven hobby pack with full safety documentation.' },
        { id: 'gens-ace', name: 'NiMH pack', mfr: 'Gens Ace', unitCost: 1.40,
          rating: 4, docsComplete: true, caps: {}, riskChance: 0.07,
          note: 'Solid mid-tier pack, docs complete.' },
        { id: 'generic-pack', name: 'Unbranded pack', mfr: 'Unbranded', unitCost: 0.65,
          rating: 2, docsComplete: false, caps: {}, riskChance: 0.26,
          risk: { text: 'The pack runs hot on fast charge and one melted its connector — overnight-charging fears spread.' },
          note: 'Cheap, no safety docs.' }
      ] },

    { id: 'motor', name: 'Drive Motor', kind: 'supplier', options: [
      { id: 'geared-380', name: 'Geared 380, EU speed-rated', mfr: 'Mabuchi', unitCost: 2.10,
        rating: 5, docsComplete: true, caps: {}, riskChance: 0.04,
        note: 'Geared and rated within the EU Toy Directive speed limit.' },
      { id: 'std-380', name: 'Standard 380 motor', mfr: 'Mabuchi', unitCost: 1.30,
        rating: 4, docsComplete: true, caps: {}, riskChance: 0.06,
        note: 'Within the limit with the firmware speed cap fitted.' },
      { id: 'fastfast', name: '"Fast fast" motor (unrated)', mfr: 'Unbranded', unitCost: 0.70,
        rating: 2, docsComplete: false, caps: {}, riskChance: 0.10,
        note: 'No speed rating. Quick — likely over the EU toy limit.' }
    ] },

    { id: 'radio', name: 'Radio Transmitter', kind: 'supplier', options: [
      { id: 'prop-2g4', name: '2.4G proportional radio', mfr: 'FlySky', unitCost: 2.30,
        rating: 5, docsComplete: true, caps: { proportional: true }, riskChance: 0.05,
        note: 'Smooth proportional steering and throttle.' },
      { id: 'onoff-2g4', name: '2.4G on/off radio', mfr: 'FlySky', unitCost: 1.10,
        rating: 4, docsComplete: true, caps: { proportional: false }, riskChance: 0.05,
        note: 'Reliable but only full-left/right, full-throttle control.' },
      { id: 'cheap-2g4', name: 'Cheap 2.4G radio', mfr: 'Unbranded', unitCost: 0.55,
        rating: 3, docsComplete: true, caps: { proportional: false }, riskChance: 0.12,
        note: 'On/off control, occasional glitching.' }
    ] }
  ],

  phases: {
    brief: {
      from: 'Leo',
      memo: `The Storm! A proper hobby-grade RC car at a toy price. The trick: it's fast, and "fast" plus "toy" runs straight into the EU Toy Directive's speed limit. Plus the transmitter needs its own radio certification and the squishy tyres love to contain phthalates. Pick markets and budget — Europe's a huge toy market but the strictest on speed.`,
      marketingClaim: '"The Storm RC: FASTER THAN A REAL CAR. Possibly faster than SOUND. Definitely faster than your REFLEXES."',
      legalNote: 'Cannot claim supersonic speed or compare to road vehicles. — REMOVED',
      internNote: 'Kevin raced the prototype down the stairwell. It reached the lobby. Reception has questions. Kevin has logged the run time "for science".',
      hint: 'The EU Toy Directive caps drive speed for toys. An over-powered motor can fail a market you really want.',
      emails: [
        { id: 'lrb1', from: 'Sarah · Mechanical', subject: 'speed limit',
          body: "Before anyone falls in love with a 40 km/h motor: the EU caps toy speed. We either gear it down, software-limit it, or lose Europe. Pick the motor with that in mind." }
      ]
    },

    design: {
      intro: `Speed, control, and child safety pulling against each other. The chassis must survive being driven into kerbs, the battery is handled by kids, and the motor decides whether you can legally sell in Europe.`,
      steveNote: 'Steve: "Elena found a motor that\'s WAY more powerful for less money. The listing just says \'fast fast\'. No speed rating. How fast is fast fast?"',
      emails: [
        { id: 'lrd1', from: 'Elena · Supply Chain', subject: 'tyres',
          body: "Cheapest soft tyres on the market, great grip. Almost certainly full of phthalates though. If we sell to kids that's a chemical-test problem. Just flagging before you fall for the grip." }
      ]
    },

    testing: {
      intro: `It will be driven into walls, charged on a bedroom carpet, and chewed by a dog. Pre-test the radio, the speed, the battery, and the soft plastics before a toy lab does.`,
      emails: [
        { id: 'lrt1', from: 'Toy Test Lab', subject: 'speed run',
          body: "Speed results attached. We also raced it against the micro drone down a corridor. The car won. Morale remains high. This is not a recognised test methodology." }
      ],
      tests: [
        { id: 'emc', name: 'EMC / Radio Test', cost: 2400, days: 2, interactive: true, minigame: 'emc',
          certRequired: true, certReworkCost: 1700, certMissingCost: 2400,
          desc: 'Sweep the transmitter and motor emissions against FCC & CE radio limits.' },
        { id: 'speed', name: 'Speed-Limit Check (EU Toy)', cost: 1500, days: 1,
          certRequired: true, certReworkCost: 1400, certMissingCost: 1800,
          desc: 'Measure top speed against the EU Toy Directive limit.',
          resolve: (p, def) => {
            const motor = getPart(def.components.find(c => c.id === 'motor'), p.selectedSuppliers.motor);
            if (motor && motor.rating <= 2)
              return { status: 'fail', details: `${motor.name} motor has no speed rating and overshoots the EU Toy Directive limit. Needs gearing or a software limiter.` };
            if (motor && motor.rating === 3)
              return { status: 'conditional', details: 'Right at the speed limit; passable with a firmware speed cap and a documented test.' };
            return { status: 'pass', details: 'Geared and rated within the EU Toy Directive speed limit.' };
          } },
        { id: 'battery', name: 'Battery Safety (UN 38.3)', cost: 3200, days: 3, certReworkCost: 2600,
          desc: 'Thermal and short-circuit testing of the removable pack.' },
        { id: 'chemical', name: 'Phthalates / Prop 65', cost: 2600, days: 3,
          desc: 'Screen the soft tyres and grips for phthalates and Prop 65 substances.' }
      ],
      emc: {
        standardLabel: 'FCC §15 / CE RED',
        maxApplications: 5,
        peaks: [
          { id: 'tx',   freq: '2.4 GHz', label: 'Transmitter spur', source: '2.4 GHz control transmitter', excess: 6, correctFix: 'shield' },
          { id: 'esc',  freq: '450 kHz', label: '450 kHz ESC switching', source: 'Motor speed controller', excess: 7, correctFix: 'ferrite', psuSensitive: true },
          { id: 'brush',freq: '900 kHz', label: '900 kHz brush noise', source: 'Brushed motor commutation', excess: 4, correctFix: 'filter' },
          { id: 'clk',  freq: '16 MHz',  label: '16 MHz receiver clock', source: 'Receiver MCU (filtered)', excess: -2, correctFix: null }
        ]
      }
    },

    certification: {
      modelName: 'Storm RC-2',
      materialLabel: 'Declared chassis material',
      critCorrectCost: 1900,
      toleranceCheck: {
        id: 'speed-rating', doc: 'Form 9-T', field: 'Rated top speed',
        fileValue: '11.8 km/h', formValue: '12 km/h', correctCost: 150,
        note: 'File measures 11.8 km/h; the box says 12 km/h. Real mismatch, or fair rounding under the limit?'
      },
      deskIntro: `Toy-vehicle files carry a radio annex, a speed-test annex, and a chemical annex. Mr. Zhang has cross-referenced all three and is, as ever, thorough. Decide what's a genuine error and what's within tolerance.`,
      emails: [
        { id: 'lrc1', from: 'Toy Safety Office', subject: 'warnings',
          body: "The pinch points around the wheels and the removable battery both need warnings. Also the antenna is a small detachable part. Everything is, technically, a small detachable part. We've made our peace with this." }
      ],
      letter: {
        body: `RE: Application RC-2/TOY/2026. The authority notes that the propulsion velocity asserted within the marketing materials exceeds the maximum permissible value for the declared toy classification as recorded in the test annex, and conditions market placement upon reconciliation of the stated performance with the said classification.`,
        translation: `Plain English (via Sarah): "Your marketing brags about a top speed that's above the toy speed limit you certified to. Either drop the speed claim or re-classify the product."`,
        responses: [
          { id: 'reclaim', text: 'Correct the marketing to the certified, within-limit speed.', correct: true },
          { id: 'argue', text: 'Argue the faster speed is "aspirational".', correct: false,
            outcome: 'Performance claims must match the tested classification. Rejected. (Reputation −.)' },
          { id: 'ignore', text: 'Keep the big speed number; kids love it.', correct: false,
            outcome: 'A toy advertised above its certified speed limit is a market-withdrawal risk. (Reputation −.)' }
        ]
      }
    },

    manufacturing: {
      intro: `Final gate. Toy vehicles get pulled apart at customs for small parts and warnings, and a missing speed/age label stops the load. Pick a partner, inspect, and label it correctly for every market.`,
      emails: [
        { id: 'lrm1', from: 'Factory Floor', subject: 'free upgrade!',
          body: "We swapped in a stronger motor we had spare — much faster! Removed that fiddly speed-limiter chip too, saved a few cents. Already in 7,000 units. Speed!" }
      ],
      factories: [
        { id: 'shenzhen', name: 'Shenzhen MegaFab', quality: 3, speed: 5, cost: 1, compliance: 2, setup: 8000, perUnit: 1.00,
          note: 'Fast and cheap. Has been known to "upgrade" motors uninvited.' },
        { id: 'vietnam', name: 'Hanoi Precision', quality: 4, speed: 3, cost: 3, compliance: 4, setup: 12000, perUnit: 1.80,
          note: 'Keeps your motor and your speed limiter exactly as specified.' },
        { id: 'brno', name: 'Brno Assembly (EU)', quality: 5, speed: 2, cost: 5, compliance: 5, setup: 19000, perUnit: 3.40,
          note: 'Toy-certified, audited, expensive.' }
      ],
      firstArticle: [
        { id: 'paint', finding: 'Body paint slightly more metallic than spec', real: false, reworkCost: 350,
          note: 'Within finish tolerance. Cosmetic.' },
        { id: 'limiter', finding: 'Speed-limiter firmware not flashed on this batch', real: true, reworkCost: 1000,
          fromFactories: ['shenzhen', 'vietnam'],
          note: 'Without the limiter the car exceeds the EU speed limit you certified to.' },
        { id: 'label', finding: 'Age grade / choking warning missing from blister packs', real: true, reworkCost: 600,
          fromFactories: ['shenzhen'],
          note: 'A toy without the required warnings is detained at customs.' }
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
      intro: `Launch day. Kids race it, parents review it, and hobbyists measure its real top speed with a radar gun and post the results. Whatever you decided about speed and toughness is now public record.`,
      baseUnits: 12000,
      critBurnText: 'The removable battery pack is running hot during fast charging and one melted its connector. "Is my kid\'s RC car safe to charge overnight?" threads are spreading.'
    }
  }
};
