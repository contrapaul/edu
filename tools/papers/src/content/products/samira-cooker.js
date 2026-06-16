// SolChef Portable Solar Cooker — Samira's third product, completing the line.
// Focus: reflective-material safety, UV durability, food-safe cooking
// temperatures, burn-hazard warnings, and FTC Green Guides claim substantiation.
// Non-electronic. Uses the drop test (stability) + bespoke thermal and
// green-claims tests.

import { getMaterial } from '../materials.js';

export default {
  id: 'samira-cooker',
  name: 'SolChef Solar Cooker',
  category: 'food-contact',
  categories: ['food-contact', 'eco-claim'],
  difficulty: 3,
  startBudget: 200000,

  availableMarkets: ['usa', 'california', 'eu', 'china', 'japan', 'australia'],

  // Campers want it to fold flat with a carry case; the rival's does. Skip it and lose sales.
  market: { valuedCaps: { foldable: 0.18 } },
  competitor: { name: 'SunChef Fold', caps: { foldable: true } },

  defaultBudgetAllocation: {
    testing:       55000,
    materials:     50000,
    manufacturing: 50000,
    consulting:    25000
  },
  priceRange: { min: 49.99, max: 199.99, default: 119.99 },

  components: [
    { id: 'reflector', name: 'Reflector Panel', kind: 'material', materialSet: 'reflector' },

    { id: 'frame', name: 'Support Frame', kind: 'supplier', options: [
      { id: 'fold-alu', name: 'Folding aluminium frame + case', mfr: 'Helinox-grade', unitCost: 4.00,
        rating: 5, docsComplete: true, caps: { foldable: true }, riskChance: 0.04,
        note: 'Packs flat into a carry case; light and rigid.' },
      { id: 'fixed-steel', name: 'Fixed steel frame', mfr: 'Generic', unitCost: 2.20,
        rating: 4, docsComplete: true, caps: { foldable: false }, riskChance: 0.06,
        note: 'Sturdy but bulky — no fold-flat.' },
      { id: 'wire-frame', name: 'Cheap wire frame', mfr: 'Unbranded', unitCost: 1.00,
        rating: 3, docsComplete: true, caps: { foldable: false }, riskChance: 0.10,
        note: 'Flimsy, tips in wind, doesn\'t pack down.' }
    ] },

    { id: 'pot', name: 'Cooking Pot', kind: 'supplier', critical: true,
      note: 'The pot holds food at cooking heat for hours. Food-contact safety and even heating both ride on it.',
      options: [
        { id: 'anodised', name: 'Anodised food-grade pot', mfr: 'GSI Outdoors', unitCost: 3.50,
          rating: 5, docsComplete: true, caps: {}, riskChance: 0.04,
          note: 'Even heating, fully food-safe, documented.' },
        { id: 'stainless', name: 'Stainless pot', mfr: 'Generic', unitCost: 2.00,
          rating: 4, docsComplete: true, caps: {}, riskChance: 0.06,
          note: 'Food-safe and solid; heats a little unevenly.' },
        { id: 'uncoated', name: 'Uncoated cheap pot', mfr: 'Unbranded', unitCost: 0.90,
          rating: 2, docsComplete: false, caps: {}, riskChance: 0.18,
          risk: { text: 'The cheap pot leaches and scorches food unevenly; food-safety complaints pile up.' },
          note: 'No food-contact documentation.' }
      ] },

    { id: 'hardware', name: 'Hinges & Hardware', kind: 'supplier', options: [
      { id: 'ss-hinges', name: 'Stainless hinges & hardware', mfr: 'Sugatsune', unitCost: 1.20,
        rating: 5, docsComplete: true, caps: {}, riskChance: 0.04,
        note: 'Corrosion-proof, smooth, durable.' },
      { id: 'zinc-hinges', name: 'Zinc-alloy hinges', mfr: 'Generic', unitCost: 0.60,
        rating: 4, docsComplete: true, caps: {}, riskChance: 0.06,
        note: 'Fine indoors; can corrode outdoors over time.' },
      { id: 'cheap-hinges', name: 'Cheap hinges', mfr: 'Unbranded', unitCost: 0.25,
        rating: 3, docsComplete: true, caps: {}, riskChance: 0.10,
        note: 'Stiff, rust-prone, fatigue early.' }
    ] }
  ],

  phases: {
    brief: {
      from: 'Anya (Sustainability)',
      memo: `The product Samira has wanted from day one: cook a real meal with nothing but sunlight. It's also a minefield of honest claims. It gets hot enough to burn, bright enough to need UV-stable materials, and "eco-friendly" is a claim the FTC will absolutely make us prove. Pick markets and budget — and let's earn every green word on the box.`,
      marketingClaim: '"SolChef: cook ANYTHING with FREE SUNLIGHT and achieve TOTAL CARBON NEGATIVITY and INNER PEACE."',
      legalNote: 'Cannot claim carbon-negativity or inner peace without substantiation. — REMOVED',
      internNote: 'Kevin tried to cook a whole chicken in nine minutes "to test the limits". Food safety is now reviewing what Kevin calls "the chicken incident".',
      hint: 'Cooking food needs proven food-safe temperatures; every "eco" word triggers FTC Green Guides substantiation.',
      emails: [
        { id: 'skb1', from: 'Anya · Sustainability', subject: 'this is the one',
          body: "I've wanted to build this forever, so I'll be the first to say it: if we can't substantiate the green claims, we cut them. A real eco product can survive honest labelling. Let's prove it." }
      ]
    },

    design: {
      intro: `A solar cooker is an optics, materials, and food-safety problem with no electronics to hide behind. The reflector decides whether it cooks and whether it survives years of UV; the pot decides food safety; the frame decides whether a gust tips your dinner into the dirt.`,
      steveNote: 'Steve: "Carlos found a super-cheap reflective panel. It\'s shiny NOW. Will it be shiny after a summer in the sun? Unclear. Bold of us to find out in the field."',
      emails: [
        { id: 'skd1', from: 'Dr. Okeke · Materials', subject: 'UV',
          body: "Whatever reflector you pick has to keep reflecting after years of direct UV. A panel that hazes over in one season turns our eco hero into landfill — which is the opposite of the claim." }
      ]
    },

    testing: {
      intro: `Sun, heat, and food with no power cord. Pre-test the stability, whether it actually reaches food-safe temperatures, the UV durability, and whether your green claims hold up — before the FTC or a food-safety lab asks.`,
      emails: [
        { id: 'skt1', from: 'Field Test Team', subject: 'cook results',
          body: "It reached temperature and cooked a genuinely good stew. We also left it out in a storm to test stability. It tipped. The stew did not survive. We are calling this \"the second chicken incident\"." }
      ],
      tests: [
        { id: 'droptest', name: 'Stability / Drop Test', cost: 2000, days: 2, interactive: true, minigame: 'droptest',
          certRequired: true, certReworkCost: 1500, certMissingCost: 2200,
          desc: 'Tip, drop, and wind-load the cooker; find what bends, snaps, or spills.' },
        { id: 'thermal', name: 'Food-Safe Temperature', cost: 2800, days: 3,
          certRequired: true, certReworkCost: 2000, certMissingCost: 2800,
          desc: 'Verify it reaches and holds safe cooking temperatures (and warn about burns).',
          resolve: (p) => {
            const mat = getMaterial(p.selectedMaterials.reflector);
            if (!mat) return { status: 'fail', details: 'No reflector material selected.' };
            const r = mat.reflectivity ?? 1;
            if (r >= 4)
              return { status: 'pass', details: `${mat.name} concentrates sunlight well — it reaches and holds safe cooking temperature reliably.` };
            if (r <= 2)
              return { status: 'fail', details: `${mat.name} barely concentrates light — it never reaches a food-safe temperature.` };
            return { status: 'conditional', details: `${mat.name} reflects modestly; safe temperature is reached only in strong sun, so it needs a clear usage label.` };
          } },
        { id: 'greenclaims', name: 'Green-Claim Substantiation (FTC)', cost: 2400, days: 2,
          certRequired: true, certReworkCost: 1800, certMissingCost: 2400,
          desc: 'Check whether the "eco-friendly / recyclable" claims can actually be proven.',
          resolve: (p) => {
            const mat = getMaterial(p.selectedMaterials.reflector);
            if (!mat) return { status: 'fail', details: 'No reflector material selected.' };
            if (mat.recyclability >= 5)
              return { status: 'pass', details: `${mat.name} is genuinely recyclable — the eco claims are fully substantiated.` };
            if (mat.recyclability >= 3)
              return { status: 'conditional', details: 'Partly recyclable; "eco" claims must be qualified, not unconditional.' };
            return { status: 'fail', details: 'A low-recyclability material cannot support an unqualified "eco-friendly" claim — that\'s greenwashing under FTC rules.' };
          } },
        { id: 'chemical', name: 'UV & Material Safety', cost: 2600, days: 3,
          desc: 'Screen reflector and coatings for UV breakdown and Prop 65 substances.' }
      ],
      droptest: {
        surfaceNote: 'tipped and wind-loaded on uneven ground',
        maxReinforcements: 4,
        points: [
          { id: 'hinge', label: 'Panel hinge', source: 'Hinge fatigues and a reflector panel folds shut', x: 0.5, y: 0.05, weakness: 7, correctFix: 'rib' },
          { id: 'leg',   label: 'Support leg', source: 'Thin leg bends and the cooker tips over', x: 0.12, y: 0.7, weakness: 6, correctFix: 'thicker' },
          { id: 'arm',   label: 'Pot arm', source: 'Pot arm cracks and drops the food', x: 0.88, y: 0.5, weakness: 5, correctFix: 'material' },
          { id: 'base',  label: 'Base plate', source: 'Wide base is already stable', x: 0.5, y: 0.92, weakness: -2, correctFix: null }
        ]
      }
    },

    certification: {
      modelName: 'SolChef SC-3',
      materialLabel: 'Declared reflector material',
      critCorrectCost: 2200,
      toleranceCheck: {
        id: 'temp-rating', doc: 'Form 7-T', field: 'Stated peak temperature',
        fileValue: '148 °C', formValue: '150 °C', correctCost: 150,
        note: 'File measures 148 °C; the box says 150 °C. Real mismatch, or fair rounding?'
      },
      deskIntro: `No electronics, but a food-safety file, a burn-hazard assessment, and — the hard one — a green-claims dossier the FTC reviewer treats as advertising law. Sort the genuine errors from the rounding.`,
      emails: [
        { id: 'skc1', from: 'FTC Green Guides Desk', subject: 'the word "eco-friendly"',
          body: "\"Eco-friendly\" is an unqualified general environmental benefit claim, which we essentially never permit. Tell us specifically what is better and prove it, or remove the phrase." }
      ],
      letter: {
        body: `RE: Application SC-3/ENV/2026. The authority observes that the unqualified environmental benefit claim borne upon the packaging is not substantiated to the standard required for such representations, and conditions market placement upon either substantiation or qualification of the said claim.`,
        translation: `Plain English (via Dr. Okeke): "Your box says 'eco-friendly' with no proof. Either back it with specific evidence, or change it to a specific, provable claim."`,
        responses: [
          { id: 'qualify', text: 'Replace "eco-friendly" with a specific, substantiated claim (e.g. "100% recyclable reflector").', correct: true },
          { id: 'argue', text: 'Argue that the sun is free, so it\'s obviously eco-friendly.', correct: false,
            outcome: 'Free fuel doesn\'t substantiate a materials/lifecycle claim. Rejected. (Reputation −.)' },
          { id: 'ignore', text: 'Keep "eco-friendly"; it\'s the whole brand.', correct: false,
            outcome: 'Unsubstantiated green claims are deceptive advertising — and the worst look for an eco brand. (Reputation −.)' }
        ]
      }
    },

    manufacturing: {
      intro: `Final gate of the whole line. Food-contact sampling, burn-hazard labelling, and a green-claims check all happen at the border. Pick a partner, inspect, and label it honestly.`,
      emails: [
        { id: 'skm1', from: 'Factory Floor', subject: 'shinier + cheaper!',
          body: "We switched the reflector to a cheaper film that's even shinier at first. Hazes up after a few months but looks amazing in the box! Also slapped \"eco\" stickers everywhere. Already in 4,000 units!" }
      ],
      factories: [
        { id: 'shenzhen', name: 'Shenzhen MegaFab', quality: 3, speed: 5, cost: 1, compliance: 2, setup: 9000, perUnit: 1.50,
          note: 'Fast and cheap. Loves an unearned "eco" sticker.' },
        { id: 'vietnam', name: 'Hanoi Precision', quality: 4, speed: 3, cost: 3, compliance: 4, setup: 14000, perUnit: 2.60,
          note: 'Holds your reflector spec and your honest labelling.' },
        { id: 'brno', name: 'Brno Assembly (EU)', quality: 5, speed: 2, cost: 5, compliance: 5, setup: 22000, perUnit: 4.80,
          note: 'Audited, food-safe, and won\'t greenwash your box.' }
      ],
      firstArticle: [
        { id: 'tone',  finding: 'Frame powder-coat a shade darker than spec', real: false, reworkCost: 400,
          note: 'Within tolerance. Cosmetic.' },
        { id: 'film',  finding: 'Reflector film swapped for a non-UV-stable type', real: true, reworkCost: 1200,
          fromFactories: ['shenzhen', 'vietnam'],
          note: 'A non-UV-stable reflector hazes within months — it breaks the cooking and the eco claim.' },
        { id: 'burn',  finding: 'Burn-hazard warning label missing from cartons', real: true, reworkCost: 600,
          fromFactories: ['shenzhen'],
          note: 'A device that reaches cooking temperature must carry the burn-hazard warning.' }
      ],
      availableMarks: [
        { id: 'foodeu',  label: 'Food-safe ⌖', market: 'eu' },
        { id: 'ceu',     label: 'EU 1935',     market: 'eu' },
        { id: 'ecoeu',   label: 'Verified-eco', market: 'eu' },
        { id: 'fda',     label: 'FDA',         market: 'usa' },
        { id: 'prop65',  label: 'Prop 65',     market: 'california' },
        { id: 'gbfc',    label: 'GB 4806',     market: 'china' },
        { id: 'recycle', label: 'Recycle ♺',   market: null }
      ]
    },

    launch: {
      intro: `Launch day for the product Samira always wanted. Off-grid reviewers cook real meals with it, sustainability watchdogs audit every green word, and someone tests exactly how badly it burns a finger. Your honesty is the product now.`,
      baseUnits: 9000,
      critBurnText: 'The cooker reaches genuinely dangerous surface temperatures with no clear warning, and someone posted a burn injury. A safety recall is being openly discussed.'
    }
  }
};
