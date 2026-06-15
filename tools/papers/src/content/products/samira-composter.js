// BioBoost Countertop Composter — Samira's first product.
// Focus: food-contact materials, off-gassing/Prop 65, electrical safety, and the
// EU compost-output rules. Electronic (motor + heater) so it uses EMC, plus a
// bespoke food-contact migration test.

import { getMaterial, getSupplier } from '../materials.js';

export default {
  id: 'samira-composter',
  name: 'BioBoost Countertop Composter',
  category: 'mains-power',
  categories: ['electronics', 'mains-power', 'food-contact'],
  difficulty: 3,
  startBudget: 130000,

  availableMarkets: ['usa', 'california', 'eu', 'china', 'japan', 'australia'],

  defaultBudgetAllocation: {
    testing:       45000,
    materials:     35000,
    manufacturing: 35000,
    consulting:    15000
  },
  priceRange: { min: 79.99, max: 299.99, default: 149.99 },

  components: [
    { id: 'housing', name: 'Chamber & Housing', kind: 'material', materialSet: 'enclosure' },
    { id: 'heater', name: 'Heating Element', kind: 'supplier', critical: true,
      note: 'A mains heater sitting against food waste. It must be both electrically safe and food-contact safe.' },
    { id: 'motor', name: 'Grinder Motor', kind: 'supplier' },
    { id: 'filter', name: 'Carbon Filter', kind: 'supplier' }
  ],

  phases: {
    brief: {
      from: 'Samira',
      memo: `Our first product: turn yesterday's dinner into garden gold on the kitchen counter. The catch is that it touches food, heats it, and vents air into someone's home — so we're juggling food-contact rules, off-gassing limits, electrical safety, and the EU's rules on what the compost output can even be called. Pick markets and budget. Let's make something genuinely green that can actually be sold.`,
      marketingClaim: '"BioBoost: turns ANY waste into PERFECT soil and possibly REVERSES CLIMATE CHANGE from your COUNTERTOP."',
      legalNote: 'Cannot claim to reverse climate change or process "any" waste. — REMOVED',
      internNote: 'Kevin put a fork in it "to see what happens". We have lost a fork and gained a small fire. Kevin is fine. The fork is not.',
      hint: 'Anything touching food triggers food-contact rules (FDA 21 CFR, EU 1935/2004). Cheap plastics can leach.',
      emails: [
        { id: 'scb1', from: 'Anya · Sustainability', subject: 'the compost claim',
          body: "Heads up: we can't just call the output \"compost\". The EU has actual rules about that word. If we want the green halo we need the testing to back it. I will not let us greenwash this." }
      ]
    },

    design: {
      intro: `A composter is a food-contact appliance that runs hot for hours. The chamber material has to be food-safe and heat-stable, the heater safe against waste, and the whole thing quiet enough not to wake the house.`,
      steveNote: 'Steve: "Carlos found a cheaper non-food-grade plastic for the chamber. It\'s basically the same, right? It\'s touching banana peels, not a baby." ',
      emails: [
        { id: 'scd1', from: 'Dr. Okeke · Materials', subject: 'chamber material',
          body: "Please choose a food-contact-rated grade for the chamber. Under continuous heat, a non-rated plastic will migrate constituents into the organic matter — which we then sell as soil for food. Consider the loop." }
      ]
    },

    testing: {
      intro: `Heat, food, and a motor in one box. Pre-test the emissions, the electrical safety, the food-contact migration, and the off-gassing before any certifier or food-safety lab sees it.`,
      emails: [
        { id: 'sct1', from: 'Food-Safety Lab', subject: 'migration results',
          body: "Migration scan attached. We also composted an entire office lunch in it. The results were excellent and the break room now smells of \"victory and slightly warm kale\"." }
      ],
      tests: [
        { id: 'emc', name: 'EMC Pre-Scan', cost: 2400, days: 2, interactive: true, minigame: 'emc',
          certRequired: true, certReworkCost: 1700, certMissingCost: 2400,
          desc: 'Sweep the grinder motor and heater control against FCC & CE limits.' },
        { id: 'electrical', name: 'Electrical Safety', cost: 2000, days: 2,
          certRequired: true, certReworkCost: 1600, certMissingCost: 2000,
          desc: 'Check the mains heater and motor for shock and fire hazards.',
          resolve: (p) => {
            const heat = getSupplier(p.selectedSuppliers.heater);
            if (heat && heat.rating <= 2)
              return { status: 'fail', details: `${heat.name} heater has no safety certification — an uninsulated mains element against wet waste is a real shock/fire hazard.` };
            if (heat && heat.rating === 3)
              return { status: 'conditional', details: 'Heater passes basic checks but thermal cut-out margin is thin; acceptable with an added fuse.' };
            return { status: 'pass', details: 'Certified heater with proper insulation and thermal cut-out.' };
          } },
        { id: 'foodcontact', name: 'Food-Contact Migration', cost: 3200, days: 3,
          certRequired: true, certReworkCost: 2200, certMissingCost: 3200,
          desc: 'Measure what the heated chamber leaches into the organic matter.',
          resolve: (p) => {
            const mat = getMaterial(p.selectedMaterials.housing);
            if (!mat) return { status: 'fail', details: 'No chamber material selected.' };
            if (mat.id === 'bamboo')
              return { status: 'fail', details: 'Composite binders migrate into the heated waste — fails food-contact migration limits.' };
            if (mat.id === 'abs')
              return { status: 'conditional', details: 'Standard ABS is borderline under continuous heat; passable only with a food-grade certified batch.' };
            return { status: 'pass', details: `${mat.name} stays within migration limits at chamber temperature.` };
          } },
        { id: 'chemical', name: 'Off-gassing & Prop 65', cost: 2600, days: 3,
          desc: 'Screen vented air and materials for restricted and Prop 65 substances.' }
      ],
      emc: {
        standardLabel: 'FCC §15 / CE EMC',
        maxApplications: 5,
        peaks: [
          { id: 'triac', freq: '120 kHz', label: '120 kHz heater triac', source: 'Heater phase-control triac', excess: 7, correctFix: 'ferrite', psuSensitive: true },
          { id: 'motor', freq: '800 kHz', label: '800 kHz grinder brush noise', source: 'Grinder motor commutation', excess: 6, correctFix: 'filter' },
          { id: 'smps',  freq: '2.4 MHz', label: '2.4 MHz logic supply', source: 'Control-board switching supply', excess: 4, correctFix: 'shield' },
          { id: 'clk',   freq: '20 MHz',  label: '20 MHz MCU clock', source: 'Microcontroller clock (filtered)', excess: -2, correctFix: null }
        ]
      }
    },

    certification: {
      modelName: 'BioBoost BB-1',
      materialLabel: 'Declared chamber material',
      critCorrectCost: 2000,
      toleranceCheck: {
        id: 'power-rating', doc: 'Form 12-A', field: 'Rated heater power',
        fileValue: '248 W', formValue: '250 W', correctCost: 150,
        note: 'File measures 248 W; the label says 250 W. Real mismatch, or fair rounding?'
      },
      deskIntro: `Food appliances carry an electrical file, a food-contact file, and — because Anya insisted — a compost-claim file. The reviewer is meticulous about anything touching food. Separate the genuine errors from the rounding.`,
      emails: [
        { id: 'scc1', from: 'EU Compost Desk', subject: 'the word "compost"',
          body: "Your output may be called \"soil improver\" but not \"compost\" until it meets the Fertilising Products Regulation criteria. Marketing has used the word \"compost\" 47 times. We counted." }
      ],
      letter: {
        body: `RE: Application BB-1/FCM/2026. The authority observes that the material declared for the food-contact chamber is not substantiated by a declaration of compliance under the applicable food-contact framework, and conditions issuance upon provision of the said declaration.`,
        translation: `Plain English (via Dr. Okeke): "You haven't provided the food-contact compliance declaration for the chamber material. Supply the Declaration of Compliance and we'll proceed."`,
        responses: [
          { id: 'doc', text: 'Submit the food-grade Declaration of Compliance for the chamber material.', correct: true },
          { id: 'argue', text: 'Argue it "only touches compost, not food".', correct: false,
            outcome: 'You sell the output as a soil improver for growing food — the loop is in scope. Rejected. (Reputation −.)' },
          { id: 'ignore', text: 'Ship it; nobody eats the composter.', correct: false,
            outcome: 'Food-contact non-compliance is a recall trigger. (Reputation −.)' }
        ]
      }
    },

    manufacturing: {
      intro: `Last gate. Food appliances are sampled hard, and a missing food-safe mark or compliance declaration stops the shipment. Pick a partner, inspect, and label it correctly.`,
      emails: [
        { id: 'scm1', from: 'Factory Floor', subject: 'cost saving!',
          body: "We switched the chamber to a cheaper plastic that looks identical and costs half. Non-food-grade, but who's checking a compost bin? Already in 3,000 units. Green savings!" }
      ],
      factories: [
        { id: 'shenzhen', name: 'Shenzhen MegaFab', quality: 3, speed: 5, cost: 1, compliance: 2, setup: 8000,
          note: 'Fast and cheap. Carlos\'s pick. Substitutes materials freely.' },
        { id: 'vietnam', name: 'Hanoi Precision', quality: 4, speed: 3, cost: 3, compliance: 4, setup: 12000,
          note: 'Holds your food-grade material spec.' },
        { id: 'brno', name: 'Brno Assembly (EU)', quality: 5, speed: 2, cost: 5, compliance: 5, setup: 19000,
          note: 'Food-appliance certified, audited, expensive.' }
      ],
      firstArticle: [
        { id: 'finish', finding: 'Housing colour slightly off the swatch', real: false, reworkCost: 350,
          note: 'Within tolerance. Cosmetic.' },
        { id: 'grade',  finding: 'Chamber moulded in non-food-grade resin', real: true, reworkCost: 1200,
          note: 'A non-food-grade chamber voids your food-contact certification.' },
        { id: 'earth',  finding: 'Earth bonding wire omitted on this batch', real: true, reworkCost: 800,
          note: 'A mains appliance without earth bonding is an electrocution hazard.' }
      ],
      availableMarks: [
        { id: 'ce',      label: 'CE',          market: 'eu' },
        { id: 'weee',    label: 'WEEE bin',    market: 'eu' },
        { id: 'foodeu',  label: 'Food-safe ⌖', market: 'eu' },
        { id: 'fcc',     label: 'FCC',         market: 'usa' },
        { id: 'fda',     label: 'FDA',         market: 'usa' },
        { id: 'prop65',  label: 'Prop 65',     market: 'california' },
        { id: 'ccc',     label: 'CCC',         market: 'china' },
        { id: 'rcm',     label: 'RCM',         market: 'australia' },
        { id: 'recycle', label: 'Recycle ♺',   market: null }
      ]
    },

    launch: {
      intro: `Launch day. Eco-reviewers test whether the output is really compostable, food-safety bloggers test what it leaches, and everyone tests how it smells. Your material and claim choices are now public.`,
      baseUnits: 8000,
      critBurnText: 'Customers report the heater running dangerously hot and a faint electrical smell, with one unit melting its base. "Is my compost bin a fire hazard?" is trending.'
    }
  }
};
