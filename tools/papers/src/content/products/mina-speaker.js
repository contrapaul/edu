// Lumina Smart Speaker — product data across all six phases.
// Chunk 2 uses `category`, `availableMarkets`, and `phases.brief`.
// Later chunks consume `components`, `phases.testing`, etc.

export default {
  id: 'mina-speaker',
  name: 'Lumina Smart Speaker',
  category: 'wireless',        // wireless implies electronics + mains-power below
  categories: ['electronics', 'wireless', 'mains-power'],
  difficulty: 2,
  startBudget: 150000,

  availableMarkets: ['usa', 'california', 'eu', 'china', 'japan', 'australia'],

  // Sensible starting split of the budget across the four buckets.
  defaultBudgetAllocation: {
    testing:       45000,
    materials:     40000,
    manufacturing: 45000,
    consulting:    20000
  },
  priceRange: { min: 39.99, max: 149.99, default: 79.99 },

  phases: {
    brief: {
      from: 'Marcus (Industrial Design)',
      memo: `Team — meet the Lumina Smart Speaker. Voice assistant, room-filling audio, and a silhouette so clean it belongs in a museum. Marketing has already drafted the launch. Legal has already crossed half of it out. Your job: decide where we sell it, and how we spend the money, before any of us has built a single thing.`,
      marketingClaim: '"The Lumina Smart Speaker will CHANGE YOUR LIFE through the raw, untamed power of SOUND."',
      legalNote: 'Cannot claim life-changing properties without clinical trials. — REMOVED',
      internNote: 'Intern Kevin suggests we "just sell it everywhere, including North Korea." A mandatory compliance training module has been added to his calendar.',
      hint: 'Every market you tick adds certification work. The EU alone bundles four obligations. Spread your budget to match your ambitions.',
      emails: [
        { id: 'b1', from: 'Janet · Marketing', subject: 'RE: launch date',
          body: "I've already promised three influencers a launch in six weeks. Please make the regulations happen faster. Thanks!! 💕" },
        { id: 'b2', from: 'Kevin · Intern', subject: 'business idea',
          body: "what if we also sold it in north korea?? huge untapped market. anyway I have to go to a mandatory compliance training now for some reason" }
      ]
    },

    design: {
      intro: `Time to actually build the thing. Pick the enclosure material, source the electronics, and decide how it gets made. Every choice here echoes through testing and certification — cheap now often means expensive later.`,
      steveNote: 'Steve (intern): "I found a pallet of power supplies at a surplus auction. No box, no datasheet, but they\'re FINE. Probably. Want me to spec them in?"',
      emails: [
        { id: 'd1', from: 'Marcus · Design', subject: 'the BAMBOO one',
          body: "Mina. The bamboo composite. Think of the unboxing videos. Think of the *texture*. I will personally weep if we ship beige plastic again." },
        { id: 'd2', from: 'DEFINITELY CERTIFIED ELECTRONICS CO.', subject: 'Re: Re: CERTIFICATON',
          body: "Honoured customer! Our parts are 100% CE Cetrified and FFC approve. Documentation arriving soon (definitely). Please to send payment first." }
      ]
    },

    testing: {
      intro: `Before you hand anything to a certification body, run it past your own lab. Pre-testing costs money and days, but catching a failure now is far cheaper than a formal rejection later. Skip a test and you submit blind.`,
      emails: [
        { id: 't1', from: 'EMC Test Lab', subject: 'your prototype',
          body: "Scan complete. PS — we also tested it in a wind tunnel at 200 mph. It did not survive. We were curious. No charge for that part." }
      ],
      tests: [
        { id: 'emc', name: 'EMC Pre-Scan', cost: 2500, days: 2, interactive: true, minigame: 'emc',
          certRequired: true, certReworkCost: 1800, certMissingCost: 2500,
          desc: 'Sweep radiated/conducted emissions against the FCC & CE limits.' },
        { id: 'flammability', name: 'Flammability Test', cost: 800, days: 1, certReworkCost: 1200,
          desc: 'Apply a flame to the enclosure; does it self-extinguish in time?' },
        { id: 'mechanical', name: 'Mechanical Stress', cost: 1200, days: 1, certReworkCost: 800,
          desc: 'Drop and load testing of the housing and mounts.' },
        { id: 'chemical', name: 'Chemical Composition', cost: 3000, days: 3,
          desc: 'Screen materials for restricted and Prop 65 substances.' }
      ],
      emc: {
        standardLabel: 'FCC §15 / CE EMC',
        maxApplications: 5,
        peaks: [
          { id: 'wifi',   freq: '2.4 GHz', label: 'Wi-Fi 2.4 GHz harmonic', source: 'Wi-Fi / Bluetooth module radiated emission', excess: 7, correctFix: 'shield' },
          { id: 'switch', freq: '700 kHz', label: '700 kHz switching noise', source: 'Power-supply switching regulator', excess: 6, correctFix: 'ferrite', psuSensitive: true },
          { id: 'amp',    freq: '1.2 MHz', label: '1.2 MHz amplifier noise', source: 'Class-D amplifier output stage', excess: 5, correctFix: 'filter' },
          { id: 'clk',    freq: '80 MHz',  label: '80 MHz MCU clock', source: 'Microcontroller clock (already filtered)', excess: -3, correctFix: null }
        ]
      }
    },

    certification: {
      modelName: 'Lumina LS-1',
      materialLabel: 'Declared enclosure material',
      critCorrectCost: 2000,
      // The one genuinely-within-tolerance discrepancy (arguable).
      toleranceCheck: {
        id: 'psu-rating', doc: 'Form 12-A', field: 'Power supply rating',
        fileValue: '5 V / 2.1 A', formValue: '5 V / 2.0 A', correctCost: 150,
        note: 'A 0.1 A difference. Is this a real inconsistency, or rounding within tolerance?'
      },
      deskIntro: `Gunther has assembled the technical file. The certification body's clerk — a Mr. Zhang from the Ministry of Being Very Thorough — will cross-check every field against your submission form. Anything that doesn't line up comes back stamped. Decide what's a real error and what's genuinely within tolerance.`,
      emails: [
        { id: 'c1', from: 'Notified Body (auto-reply)', subject: 'We have received your enquiry',
          body: "Your enquiry is very important to us. Current response time: 47 business days. This mailbox is not monitored. Have a compliant day." }
      ],
      letter: {
        // Deliberately dense bureaucratic prose; Translate reveals the real ask.
        body: `RE: Application LS-1/EMC/2026. Pursuant to §4.2(c) of the applicable conformity framework and notwithstanding the foregoing, the undersigned authority observes a non-correspondence between the nomenclature affixed to the apparatus enclosure and the nomenclature recited within the accompanying instructional literature, the reconciliation of which is a precondition to the issuance of the instrument of conformity.`,
        translation: `Plain English (via Gunther): "The model number printed on the product doesn't match the model number in the user manual. Fix that and we'll grant the certificate."`,
        responses: [
          { id: 'relabel', text: 'Reprint the manual so the model number matches the product label.', correct: true },
          { id: 'argue',   text: 'Reply that the difference is immaterial and request a waiver.', correct: false,
            outcome: 'The authority does not grant waivers for labelling consistency. Resubmit. (Reputation −, another round.)' },
          { id: 'ignore',  text: 'Ignore the letter; it is probably automated.', correct: false,
            outcome: 'Auto-reply: "Current response time: 47 business days." Your launch slips. (Reputation −.)' }
        ]
      }
    },

    manufacturing: {
      intro: `The certificate is in hand. Now pick a factory, inspect the first production run, and get the labelling right before anything ships — customs is the last gate, and it is unforgiving.`,
      emails: [
        { id: 'm1', from: 'Factory Floor', subject: 'small improvement!! 😊',
          body: "We made a small improvement to your design — we added some extra LEDs that blink. Looks very premium. You are welcome. Shipping now?" },
        { id: 'm2', from: 'Warehouse', subject: 'pallets',
          body: "Good news, the pallets are ISPM 15 certified! ...wait. What's ISPM 15. Should I know that. Please advise." }
      ],
      factories: [
        { id: 'shenzhen', name: 'Shenzhen MegaFab', quality: 3, speed: 5, cost: 1, compliance: 2, setup: 8000,
          note: 'Fast and cheap. Their compliance history is… colourful.' },
        { id: 'vietnam', name: 'Hanoi Precision', quality: 4, speed: 3, cost: 3, compliance: 4, setup: 12000,
          note: 'Reliable mid-tier with a clean audit record.' },
        { id: 'brno', name: 'Brno Assembly (EU)', quality: 5, speed: 2, cost: 5, compliance: 5, setup: 20000,
          note: 'Premium build, spotless compliance, premium invoice.' }
      ],
      firstArticle: [
        { id: 'logo',  finding: 'Silk-screen logo sits 2 mm off-centre', real: false, reworkCost: 300,
          note: 'Cosmetic, and within the drawing tolerance. Accepting is fine.' },
        { id: 'screw', finding: 'Base plate uses a non-spec screw type', real: true, reworkCost: 600,
          note: 'Wrong fastener can back out under vibration. A real defect.' },
        { id: 'led',   finding: 'Factory added a "bonus" blinking status LED', real: true, reworkCost: 500,
          note: 'An undeclared design change voids the technical file you certified.' }
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
      intro: `Launch day. The numbers come in, the reviews land, and whatever you cut corners on tends to resurface in support tickets.`,
      baseUnits: 8200,
      critBurnText: 'Customers report a faint burning smell from the power brick under load. Support tickets are climbing and a tech reviewer just filmed it.',
      emails: [
        { id: 'l1', from: 'DefinitelyNotYourCompetitor', subject: '★☆☆☆☆ disappointed',
          body: "One star. The speaker works perfectly and looks great, which is exactly the kind of thing I'd expect from a company run by lizard people. Would not recommend." }
      ]
    }
  },

  // Enclosure = material choice; the electronics = supplier choice.
  components: [
    { id: 'enclosure', name: 'Enclosure', kind: 'material', materialSet: 'enclosure' },
    { id: 'amp',  name: 'Class-D Amplifier Module', kind: 'supplier' },
    { id: 'psu',  name: 'Power Supply', kind: 'supplier', critical: true,
      note: 'Mains-powered — a fake safety cert here sinks the whole certification.' },
    { id: 'wifi', name: 'Wi-Fi / Bluetooth Module', kind: 'supplier' }
  ]
};
