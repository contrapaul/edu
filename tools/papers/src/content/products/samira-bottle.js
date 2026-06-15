// EverFlask Reusable Water Bottle — Samira's second product.
// Focus: FDA / EU food-contact, BPA-free leaching, insulation performance
// CLAIMS, and Prop 65. Non-electronic — no EMC. Uses the drop test plus bespoke
// leaching and insulation tests.

import { getMaterial, getPart } from '../materials.js';

export default {
  id: 'samira-bottle',
  name: 'EverFlask Reusable Bottle',
  category: 'food-contact',
  categories: ['food-contact'],
  difficulty: 2,
  startBudget: 170000,

  availableMarkets: ['usa', 'california', 'eu', 'china', 'japan', 'australia'],

  // Buyers expect a genuinely leakproof lid; the rival's is. Skip it and lose sales.
  market: { valuedCaps: { leakproof: 0.18 } },
  competitor: { name: 'AquaRival Flask', caps: { leakproof: true } },

  defaultBudgetAllocation: {
    testing:       40000,
    materials:     35000,
    manufacturing: 35000,
    consulting:    15000
  },
  priceRange: { min: 14.99, max: 59.99, default: 29.99 },

  components: [
    { id: 'body', name: 'Bottle Body', kind: 'material', materialSet: 'enclosure' },

    { id: 'coating', name: 'Interior Coating', kind: 'supplier', critical: true,
      note: 'The interior lining is what your drink actually touches. A cheap coating is where BPA and leaching problems live.',
      options: [
        { id: 'ceramic-line', name: 'Inert ceramic lining', mfr: 'Whitford', unitCost: 1.60,
          rating: 5, docsComplete: true, caps: {}, riskChance: 0.04,
          note: 'Fully documented, inert, genuinely BPA-free.' },
        { id: 'fg-epoxy', name: 'Food-grade epoxy', mfr: 'PPG', unitCost: 0.90,
          rating: 4, docsComplete: true, caps: {}, riskChance: 0.06,
          note: 'Certified food-grade lining; solid choice.' },
        { id: 'cheap-epoxy', name: 'Epoxy ("food ok")', mfr: 'Unbranded', unitCost: 0.35,
          rating: 2, docsComplete: false, caps: {}, riskChance: 0.20,
          risk: { text: 'An independent lab livestreams a BPA test of your bottle — and it fails. The clip goes viral.' },
          note: 'One-line datasheet. Cheap epoxies are where BPA hides.' }
      ] },

    { id: 'seal', name: 'Lid Seal', kind: 'supplier', options: [
      { id: 'silicone-leak', name: 'Silicone leakproof gasket', mfr: 'Trelleborg', unitCost: 0.80,
        rating: 5, docsComplete: true, caps: { leakproof: true }, riskChance: 0.04,
        note: 'Seals fully even shaken in a bag.' },
      { id: 'std-gasket', name: 'Standard gasket', mfr: 'Trelleborg', unitCost: 0.40,
        rating: 4, docsComplete: true, caps: { leakproof: false }, riskChance: 0.05,
        note: 'Fine upright; can weep if tipped.' },
      { id: 'thin-gasket', name: 'Thin gasket', mfr: 'Unbranded', unitCost: 0.15,
        rating: 3, docsComplete: true, caps: { leakproof: false }, riskChance: 0.08,
        note: 'Leaks readily; cheapest.' }
    ] },

    { id: 'cap', name: 'Cap Assembly', kind: 'supplier', options: [
      { id: 'machined-cap', name: 'Machined cap, tight thread', mfr: 'Camelbak-grade', unitCost: 1.20,
        rating: 5, docsComplete: true, caps: {}, riskChance: 0.04,
        note: 'Precise threads, durable.' },
      { id: 'std-cap', name: 'Standard moulded cap', mfr: 'Generic', unitCost: 0.60,
        rating: 4, docsComplete: true, caps: {}, riskChance: 0.06,
        note: 'Works well enough.' },
      { id: 'cheap-cap', name: 'Cheap cap', mfr: 'Unbranded', unitCost: 0.25,
        rating: 3, docsComplete: true, caps: {}, riskChance: 0.10,
        note: 'Loose threads; cross-threads easily.' }
    ] }
  ],

  phases: {
    brief: {
      from: 'Samira',
      memo: `A reusable bottle is the simplest thing we'll make and the easiest to get quietly wrong. It holds something people drink all day, so every surface is food-contact. And the moment Marketing prints "keeps drinks cold for 24 hours", that becomes a performance claim we have to actually prove. Pick markets and budget — no electronics this time, just materials and honesty.`,
      marketingClaim: '"EverFlask: keeps drinks cold for 24 HOURS, hot for 12, and may grant ETERNAL HYDRATION."',
      legalNote: 'Cannot promise eternal hydration; thermal claims require substantiation. — REMOVED',
      internNote: 'Kevin tested "24 hours cold" by leaving a bottle in the sun and checking after ten minutes. He has declared the claim "basically true". It is not.',
      hint: 'Insulation numbers on the label are claims you must substantiate, and every interior surface is food-contact.',
      emails: [
        { id: 'sbb1', from: 'Anya · Sustainability', subject: 'reusable means reusable',
          body: "If we call it reusable and BPA-free, it has to survive years of use and actually be BPA-free. I'd rather a quieter claim we can defend than a loud one we can't." }
      ]
    },

    design: {
      intro: `It looks simple: a body, a lining, a seal, a cap. But the lining decides whether it leaches, the body decides whether it insulates, and the seal decides whether it survives the dishwasher and the floor.`,
      steveNote: 'Steve: "Carlos found a lining that\'s way cheaper. The datasheet is one sentence: \'food ok\'. That\'s basically a certificate, right?"',
      emails: [
        { id: 'sbd1', from: 'Dr. Okeke · Materials', subject: 'the lining',
          body: "Whatever you do, vet the interior coating. \"Food ok\" on a one-line datasheet is not a compliance document. Cheap epoxies are exactly where BPA shows up." }
      ]
    },

    testing: {
      intro: `It gets dropped, dishwashed, and drunk from daily. Pre-test the impact survival, what the lining leaches, and whether the insulation claim is even true — before a food-safety lab does.`,
      emails: [
        { id: 'sbt1', from: 'Materials Lab', subject: 'drop + leach',
          body: "Results attached. We also filled one with coffee and dropped it down a stairwell to test both at once. The lid held. The stairwell did not enjoy the experiment. Insulation data is good though." }
      ],
      tests: [
        { id: 'droptest', name: 'Drop / Dent Test', cost: 1800, days: 2, interactive: true, minigame: 'droptest',
          certRequired: true, certReworkCost: 1400, certMissingCost: 2000,
          desc: 'Drop the filled bottle onto hard floors; find what dents, cracks, or leaks.' },
        { id: 'leaching', name: 'Leaching / BPA Test', cost: 3000, days: 3,
          certRequired: true, certReworkCost: 2200, certMissingCost: 3000,
          desc: 'Measure what the interior coating releases into the drink over time.',
          resolve: (p, def) => {
            const coat = getPart(def.components.find(c => c.id === 'coating'), p.selectedSuppliers.coating);
            if (coat && coat.rating <= 2)
              return { status: 'fail', details: `${coat.name} lining leaches BPA above the food-contact limit — fails outright and kills any "BPA-free" claim.` };
            if (coat && coat.rating === 3)
              return { status: 'conditional', details: 'Leaching is within limits but the supplier can\'t fully document it; passable with batch testing.' };
            return { status: 'pass', details: 'Inert, fully-documented food-grade lining. BPA-free claim substantiated.' };
          } },
        { id: 'insulation', name: 'Insulation Performance', cost: 1600, days: 2,
          desc: 'Verify the "keeps cold 24h" claim before you print it on the box.',
          resolve: (p) => {
            const mat = getMaterial(p.selectedMaterials.body);
            if (!mat) return { status: 'fail', details: 'No body material selected.' };
            if (mat.id === 'aluminum')
              return { status: 'pass', details: 'Double-wall metal construction holds temperature for the full claimed period.' };
            if (mat.id === 'bamboo')
              return { status: 'fail', details: 'Single-wall composite barely insulates — the 24-hour claim is unsupportable.' };
            return { status: 'conditional', details: `${mat.name} insulates modestly; the claim must be softened to a defensible number.` };
          } },
        { id: 'chemical', name: 'Chemical / Prop 65', cost: 2400, days: 3,
          desc: 'Screen the body, seal, and coating for Prop 65 substances.' }
      ],
      droptest: {
        surfaceNote: 'filled bottle dropped onto tile',
        maxReinforcements: 4,
        points: [
          { id: 'thread', label: 'Cap thread', source: 'Thread strips and the lid leaks after impact', x: 0.5, y: 0.05, weakness: 6, correctFix: 'rib' },
          { id: 'base',   label: 'Base seam', source: 'Base dents and unseats the inner wall', x: 0.5, y: 0.92, weakness: 7, correctFix: 'thicker' },
          { id: 'wall',   label: 'Body wall', source: 'Wall buckles and creases', x: 0.12, y: 0.5, weakness: 5, correctFix: 'material' },
          { id: 'seal',   label: 'Lid seal', source: 'Captive seal is already protected', x: 0.88, y: 0.5, weakness: -2, correctFix: null }
        ]
      }
    },

    certification: {
      modelName: 'EverFlask EF-2',
      materialLabel: 'Declared body material',
      critCorrectCost: 2000,
      toleranceCheck: {
        id: 'capacity-rating', doc: 'Form 7-V', field: 'Stated capacity',
        fileValue: '498 ml', formValue: '500 ml', correctCost: 150,
        note: 'File measures 498 ml; the label says 500 ml. Real mismatch, or fair rounding?'
      },
      deskIntro: `No electronics file this time — but a thick food-contact file and a claims file for that insulation number. The reviewer drinks from a competitor's bottle while reading yours. Sort genuine errors from tolerance.`,
      emails: [
        { id: 'sbc1', from: 'Advertising Standards', subject: '"24 hours"',
          body: "Your packaging states \"cold for 24 hours\". Please supply the test that supports it, or amend the figure. \"It felt cold to Kevin\" is, again, not a test report." }
      ],
      letter: {
        body: `RE: Application EF-2/FCM/2026. The authority observes a divergence between the thermal-retention performance asserted upon the packaging and the value substantiated within the test report appended hereto, and requires that the marketed claim be reconciled with the demonstrated performance.`,
        translation: `Plain English (via Dr. Okeke): "The insulation number on the box is better than what your test actually showed. Lower the claim to the tested figure, or improve the bottle."`,
        responses: [
          { id: 'amend', text: 'Amend the packaging to the tested insulation figure.', correct: true },
          { id: 'argue', text: 'Argue "24 hours" is "more of a vibe than a measurement".', correct: false,
            outcome: 'Performance claims are measurements, not vibes. Rejected. (Reputation −.)' },
          { id: 'ignore', text: 'Keep the big number; the bottle looks premium.', correct: false,
            outcome: 'An unsubstantiated performance claim is deceptive advertising. (Reputation −.)' }
        ]
      }
    },

    manufacturing: {
      intro: `Final gate. Food-contact goods are sampled for leaching and labelling, and a missing food-safe mark stops the load. Pick a partner, inspect, and label it right.`,
      emails: [
        { id: 'sbm1', from: 'Factory Floor', subject: 'shinier lining!',
          body: "We upgraded the interior lining to a shinier, cheaper epoxy. Looks premium! Probably has some BPA but it's a tiny amount, surely. Already in 5,000 units. Cheers!" }
      ],
      factories: [
        { id: 'shenzhen', name: 'Shenzhen MegaFab', quality: 3, speed: 5, cost: 1, compliance: 2, setup: 7000, perUnit: 0.60,
          note: 'Fast and cheap. Swaps linings without telling you.' },
        { id: 'vietnam', name: 'Hanoi Precision', quality: 4, speed: 3, cost: 3, compliance: 4, setup: 11000, perUnit: 1.10,
          note: 'Holds your documented food-grade lining.' },
        { id: 'brno', name: 'Brno Assembly (EU)', quality: 5, speed: 2, cost: 5, compliance: 5, setup: 17000, perUnit: 2.00,
          note: 'Food-contact certified, audited, pricey.' }
      ],
      firstArticle: [
        { id: 'print', finding: 'Exterior print slightly misaligned', real: false, reworkCost: 300,
          note: 'Within tolerance. Cosmetic.' },
        { id: 'lining', finding: 'Interior lining swapped for an undocumented epoxy', real: true, reworkCost: 1100,
          fromFactories: ['shenzhen', 'vietnam'],
          note: 'An unvetted lining voids your leaching test and BPA-free claim.' },
        { id: 'thread', finding: 'Cap thread tolerance loose; some lids weep', real: true, reworkCost: 600,
          fromFactories: ['shenzhen'],
          note: 'A leaking lid is a returns nightmare and a food-safety question.' }
      ],
      availableMarks: [
        { id: 'foodeu',  label: 'Food-safe ⌖', market: 'eu' },
        { id: 'ceu',     label: 'EU 1935',     market: 'eu' },
        { id: 'fda',     label: 'FDA',         market: 'usa' },
        { id: 'bpafree', label: 'BPA-free',    market: 'usa' },
        { id: 'prop65',  label: 'Prop 65',     market: 'california' },
        { id: 'gbfc',    label: 'GB 4806',     market: 'china' },
        { id: 'recycle', label: 'Recycle ♺',   market: null }
      ]
    },

    launch: {
      intro: `Launch day. Reviewers fill it with ice and time it, lab channels test it for BPA, and someone drops it off a balcony on camera. Every claim you made is now being checked in public.`,
      baseUnits: 16000,
      critBurnText: 'An independent lab livestreamed a BPA test of your bottle and it failed. "Is your "BPA-free" bottle lying to you?" is now a viral video with your product in the thumbnail.'
    }
  }
};
