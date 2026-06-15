// LumiGlow Smart Lamp — Mina's third product, completing the LuminaTech line.
// Focus: optical/eye safety (IEC 62471 photobiological), LED thermal management,
// Prop 65, and China CCC. Uses a bespoke optical auto-test.

import { getSupplier } from '../materials.js';

export default {
  id: 'mina-lamp',
  name: 'LumiGlow Smart Lamp',
  category: 'wireless',
  categories: ['electronics', 'wireless', 'mains-power'],
  difficulty: 3,
  startBudget: 240000,

  availableMarkets: ['usa', 'california', 'eu', 'china', 'japan', 'australia'],

  defaultBudgetAllocation: {
    testing:       70000,
    materials:     60000,
    manufacturing: 70000,
    consulting:    40000
  },
  priceRange: { min: 39.99, max: 199.99, default: 89.99 },

  components: [
    { id: 'shade', name: 'Shade / Diffuser', kind: 'material', materialSet: 'enclosure' },
    { id: 'led', name: 'LED Module', kind: 'supplier', critical: true,
      note: 'The LEDs set your eye-safety class (IEC 62471). Cheap, unbinned emitters are an optical-hazard risk.' },
    { id: 'driver', name: 'LED Driver', kind: 'supplier' },
    { id: 'wifi', name: 'Wi-Fi Module', kind: 'supplier' }
  ],

  phases: {
    brief: {
      from: 'Marcus (Industrial Design)',
      memo: `The lamp is the prestige piece — the one that ends up on magazine covers. It also throws light directly at human eyes for hours, which regulators care about a great deal. Smart, dimmable, warm. Pick our markets and budget; China's a big one for lighting, and it means CCC.`,
      marketingClaim: '"LumiGlow: light so pure it will REALIGN YOUR CIRCADIAN DESTINY."',
      legalNote: 'Cannot claim circadian or medical effects without evidence. — REMOVED',
      internNote: 'Kevin has suggested we market it as "anti-aging light". Kevin is now in a meeting with Legal that he describes as "not going great".',
      hint: 'Lighting aimed at the eyes triggers photobiological safety testing (IEC 62471). Cheap LEDs fail it.',
      emails: [
        { id: 'lb1', from: 'Janet · Marketing', subject: 'can it be 10000 lumens',
          body: "The brief says cosy reading lamp but can we ALSO say it's bright enough to light a stadium? Both? People love options." }
      ]
    },

    design: {
      intro: `A lamp is mostly an optical and thermal problem wearing a pretty shade. The diffuser material shapes the light and the heat, the LEDs decide your eye-safety class, and the driver is where the emissions hide.`,
      steveNote: 'Steve: "These LEDs have no datasheet but they\'re SO bright. Like, look-directly-at-them bright. Is that good? That feels good."',
      emails: [
        { id: 'ld1', from: 'Dr. Okeke (consulting)', subject: 'diffuser',
          body: "Whatever shade material you pick, remember it sees LED heat continuously for years. Cheap PC yellows. Just so you know before Marketing falls in love with a colour." }
      ]
    },

    testing: {
      intro: `Light, heat, and emissions. Pre-test the eye-safety class, the radio, and the materials before a certifier — failing IEC 62471 in formal testing is an expensive surprise.`,
      emails: [
        { id: 'lt1', from: 'Photometry Lab', subject: 'results',
          body: "Photobiological scan attached. We also left it on for 72 hours pointed at a houseplant. The plant is thriving. Unrelated, but morale is up." }
      ],
      tests: [
        { id: 'emc', name: 'EMC Pre-Scan', cost: 3000, days: 2, interactive: true, minigame: 'emc',
          certRequired: true, certReworkCost: 2000, certMissingCost: 2800,
          desc: 'Sweep the LED driver and Wi-Fi emissions against FCC & CE limits.' },
        { id: 'optical', name: 'Photobiological Safety (IEC 62471)', cost: 3500, days: 3,
          certRequired: true, certReworkCost: 2200, certMissingCost: 3200,
          desc: 'Measure blue-light and retinal-hazard exposure from the LEDs.',
          resolve: (p) => {
            const led = getSupplier(p.selectedSuppliers.led);
            if (led && led.rating <= 2)
              return { status: 'fail', details: `${led.name} emitters exceed the IEC 62471 blue-light limit — a genuine retinal-hazard failure.` };
            if (led && led.rating === 3)
              return { status: 'conditional', details: 'Borderline blue-light hazard; passable behind a diffuser with a viewing-distance label.' };
            return { status: 'pass', details: 'LEDs fall in the exempt risk group — no photobiological hazard.' };
          } },
        { id: 'flammability', name: 'Flammability Test', cost: 900, days: 1, certReworkCost: 1200,
          desc: 'The shade sits over a continuous heat source — does it resist ignition?' },
        { id: 'chemical', name: 'Chemical Composition', cost: 3000, days: 3,
          desc: 'Screen the shade and coatings for restricted and Prop 65 substances.' }
      ],
      emc: {
        standardLabel: 'FCC §15 / CE EMC',
        maxApplications: 5,
        peaks: [
          { id: 'driver', freq: '900 kHz', label: '900 kHz driver switching', source: 'LED constant-current driver', excess: 7, correctFix: 'ferrite', psuSensitive: true },
          { id: 'wifi',   freq: '2.4 GHz', label: 'Wi-Fi 2.4 GHz harmonic', source: 'Smart Wi-Fi module', excess: 6, correctFix: 'shield' },
          { id: 'pwm',    freq: '1.0 MHz', label: '1.0 MHz dimming ripple', source: 'PWM dimming stage', excess: 4, correctFix: 'filter' },
          { id: 'clk',    freq: '48 MHz',  label: '48 MHz MCU clock', source: 'Microcontroller clock (filtered)', excess: -3, correctFix: null }
        ]
      }
    },

    certification: {
      modelName: 'Lumina LG-3',
      materialLabel: 'Declared shade material',
      critCorrectCost: 2200,
      toleranceCheck: {
        id: 'flux-rating', doc: 'Form 12-A', field: 'Rated luminous flux',
        fileValue: '806 lm', formValue: '800 lm', correctCost: 150,
        note: 'Datasheet says 806 lm, the box rounds to 800 lm. Real mismatch, or fair rounding?'
      },
      deskIntro: `Lighting files are thick — photometric reports, driver safety, and the CCC annexes if you chose China. Mr. Zhang has a magnifying glass and nowhere to be. Sort the genuine errors from the within-tolerance ones.`,
      emails: [
        { id: 'lc1', from: 'CCC Bureau', subject: '关于您的申请 / re: application',
          body: "Honoured applicant. Your photometric report is in lumens; our form expects candela for the stated beam angle. Please to reconcile. Also: 47 business days." }
      ],
      letter: {
        body: `RE: Application LG-3/LVD/2026. The authority, upon examination of the photometric dossier, notes a discrepancy between the correlated colour temperature asserted upon the packaging and that substantiated within the test report appended hereto, and conditions issuance of conformity upon the harmonisation of the said values.`,
        translation: `Plain English (via Gunther): "The colour temperature on the box (e.g. 2700K) doesn't match the lab report. Make the box match the measured value."`,
        responses: [
          { id: 'fix', text: 'Reprint the packaging to state the measured colour temperature.', correct: true },
          { id: 'argue', text: 'Argue that "warm white" is a vibe, not a number.', correct: false,
            outcome: 'Colour temperature is a measured quantity, not a vibe. Rejected. (Reputation −.)' },
          { id: 'ignore', text: 'Ship it; nobody checks colour temperature.', correct: false,
            outcome: 'A reviewer with a spectrometer checks colour temperature. Recall risk. (Reputation −.)' }
        ]
      }
    },

    manufacturing: {
      intro: `Last product of the line. Lamps are simple to assemble and easy to cheapen — a swapped LED bin or a thinner heatsink won't show until a customer's lamp flickers. Pick a partner, inspect, and label for every market.`,
      emails: [
        { id: 'lm1', from: 'Factory Floor', subject: 'brighter!!',
          body: "We upgraded your LEDs to a cheaper, brighter bin we had in stock. Much more lumens per dollar. You will be amazed. Already in the first 5,000 units." }
      ],
      factories: [
        { id: 'shenzhen', name: 'Shenzhen MegaFab', quality: 3, speed: 5, cost: 1, compliance: 2, setup: 9000,
          note: 'Fast and cheap. They "improve" LED bins without asking.' },
        { id: 'vietnam', name: 'Hanoi Precision', quality: 4, speed: 3, cost: 3, compliance: 4, setup: 14000,
          note: 'Reliable, and they hold the LED bin you specify.' },
        { id: 'brno', name: 'Brno Assembly (EU)', quality: 5, speed: 2, cost: 5, compliance: 5, setup: 22000,
          note: 'Photometrically consistent, audited, expensive.' }
      ],
      firstArticle: [
        { id: 'shade', finding: 'Shade is a touch glossier than the matte spec', real: false, reworkCost: 400,
          note: 'Within finish tolerance. Cosmetic.' },
        { id: 'bin',   finding: 'LEDs are a different colour bin than specified', real: true, reworkCost: 1100,
          note: 'Wrong bin shifts colour temperature and may void the photometric file.' },
        { id: 'heat',  finding: 'Heatsink is 1 mm thinner than drawing', real: true, reworkCost: 700,
          note: 'Less thermal mass shortens LED life and raises surface temperature.' }
      ],
      availableMarks: [
        { id: 'ce',      label: 'CE',          market: 'eu' },
        { id: 'weee',    label: 'WEEE bin',    market: 'eu' },
        { id: 'fcc',     label: 'FCC',         market: 'usa' },
        { id: 'ul',      label: 'UL',          market: 'usa' },
        { id: 'prop65',  label: 'Prop 65',     market: 'california' },
        { id: 'ccc',     label: 'CCC',         market: 'china' },
        { id: 'pse',     label: 'PSE',         market: 'japan' },
        { id: 'rcm',     label: 'RCM',         market: 'australia' },
        { id: 'recycle', label: 'Recycle ♺',   market: null }
      ]
    },

    launch: {
      intro: `Launch day for the lamp — the line's flagship. Reviewers photograph it, measure its colour, and stare into it, which is exactly what you optimised (or didn't) for.`,
      baseUnits: 9500,
      critBurnText: 'Customers report the LEDs flickering and running uncomfortably hot, with a few units discolouring the shade. "Is my lamp dying?" threads are spreading.'
    }
  }
};
