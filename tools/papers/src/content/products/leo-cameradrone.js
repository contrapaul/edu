// SkyView Camera Drone — Leo's third product, completing the AeroCube line.
// Focus: FAA Remote ID, CE class identification, GDPR/camera privacy,
// geo-fencing, and lithium battery air transport (IATA). Uses EMC + drop test
// plus a bespoke data-privacy test.

import { getSupplier } from '../materials.js';

export default {
  id: 'leo-cameradrone',
  name: 'SkyView Camera Drone',
  category: 'wireless',
  categories: ['electronics', 'wireless', 'battery'],
  difficulty: 3,
  startBudget: 220000,

  availableMarkets: ['usa', 'california', 'eu', 'china', 'japan', 'australia'],

  defaultBudgetAllocation: {
    testing:       65000,
    materials:     50000,
    manufacturing: 60000,
    consulting:    40000
  },
  priceRange: { min: 99.99, max: 499.99, default: 299.99 },

  components: [
    { id: 'shell', name: 'Body Shell & Arms', kind: 'material', materialSet: 'enclosure' },
    { id: 'battery', name: 'Flight Battery', kind: 'supplier', critical: true,
      note: 'A large lithium pack that must fly by air (IATA) and survive a crash from altitude.' },
    { id: 'camera', name: 'Camera Module', kind: 'supplier' },
    { id: 'gps', name: 'GPS / Remote-ID Module', kind: 'supplier' }
  ],

  phases: {
    brief: {
      from: 'Jake (Firmware)',
      memo: `The big one: a real camera drone. This is where the regulations get serious — FAA Remote ID so it can be tracked, CE class identification in Europe, GDPR because it has a camera that films people, geo-fencing to keep it out of airports, and a fat lithium pack that has to clear IATA to fly anywhere. Pick markets and budget. This is not a toy and the regulators know it.`,
      marketingClaim: '"SkyView: see EVERYTHING. Your neighbours. Their gardens. Their SECRETS. The SKY IS YOURS."',
      legalNote: 'Cannot encourage surveillance of neighbours or imply a right to airspace. GDPR. — REMOVED',
      internNote: 'Kevin flew it over the car park "to test the camera" and filmed the CEO\'s parking space. This is now a data-protection incident with its own meeting.',
      hint: 'A camera means GDPR; flight means FAA Remote ID and geo-fencing; the big battery means IATA air-transport testing.',
      emails: [
        { id: 'lcb1', from: 'Jake · Firmware', subject: 'remote ID',
          body: "I can do Remote ID and geo-fencing in firmware, no problem. Documenting it for the regulators, however, is my personal hell. Budget me some time or it won't get written down, and if it's not written down it doesn't exist." }
      ]
    },

    design: {
      intro: `A flying camera is a privacy device, an aviation device, and a lithium hazard at once. The shell has to survive a fall from altitude, the battery has to be airworthy, the camera has to handle data lawfully, and the GPS module is what keeps the whole thing legal to fly.`,
      steveNote: 'Steve: "Elena found camera modules with no privacy documentation but an amazing sensor. The seller says GDPR is \'a European thing, not our problem\'. Reassuring?"',
      emails: [
        { id: 'lcd1', from: 'Sarah · Mechanical', subject: 'falls from the sky',
          body: "Reminder that this one doesn't bump into walls — it falls out of the sky onto pavement, cars, and occasionally people. The shell and the battery containment are not where we save money." }
      ]
    },

    testing: {
      intro: `It flies high, films people, and carries a serious battery. Pre-test the emissions, the crash survival, the cells, and the data handling before any aviation or privacy regulator gets involved.`,
      emails: [
        { id: 'lct1', from: 'Flight Test Lab', subject: 'altitude drop',
          body: "Drop-from-altitude results attached. We also flew it past the building's windows and three people waved, one hid. The privacy question answers itself, really." }
      ],
      tests: [
        { id: 'emc', name: 'EMC Pre-Scan', cost: 3200, days: 2, interactive: true, minigame: 'emc',
          certRequired: true, certReworkCost: 2200, certMissingCost: 3000,
          desc: 'Sweep the control link, video downlink, and GPS against FCC & CE limits.' },
        { id: 'droptest', name: 'Crash / Drop Test', cost: 2600, days: 2, interactive: true, minigame: 'droptest',
          certRequired: true, certReworkCost: 1800, certMissingCost: 2600,
          desc: 'Drop it from altitude onto concrete; find what breaks or frees the battery.' },
        { id: 'battery', name: 'Battery Safety (UN 38.3 / IATA)', cost: 4500, days: 4, certReworkCost: 3500,
          desc: 'Thermal, altitude, and crush testing for air transport of the flight pack.' },
        { id: 'privacy', name: 'Data Privacy (GDPR) Review', cost: 3000, days: 3,
          certRequired: true, certReworkCost: 2400, certMissingCost: 3000,
          desc: 'Assess how the camera stores, transmits, and protects captured footage.',
          resolve: (p) => {
            const cam = getSupplier(p.selectedSuppliers.camera);
            if (cam && cam.rating <= 2)
              return { status: 'fail', details: `${cam.name} ships unencrypted footage to an undisclosed server with no privacy documentation — a clear GDPR failure.` };
            if (cam && cam.rating === 3)
              return { status: 'conditional', details: 'Footage is local-only but the privacy notice is thin; passable with a documented data policy.' };
            return { status: 'pass', details: 'Encrypted local storage with a clear, compliant privacy policy. GDPR-ready.' };
          } }
      ],
      emc: {
        standardLabel: 'FCC §15 / CE RED',
        maxApplications: 5,
        peaks: [
          { id: 'video', freq: '5.8 GHz', label: '5.8 GHz video downlink', source: 'Analogue/digital video transmitter', excess: 7, correctFix: 'shield' },
          { id: 'esc',   freq: '600 kHz', label: '600 kHz ESC switching', source: 'Motor speed controllers', excess: 6, correctFix: 'ferrite', psuSensitive: true },
          { id: 'ctrl',  freq: '2.4 GHz', label: '2.4 GHz control spur', source: 'Control-link transceiver', excess: 5, correctFix: 'filter' },
          { id: 'gps',   freq: '1.575 GHz', label: 'GPS L1 (receive only)', source: 'GPS receiver (passive)', excess: -3, correctFix: null }
        ]
      },
      droptest: {
        surfaceNote: 'dropped from 30 m onto concrete',
        maxReinforcements: 4,
        points: [
          { id: 'arm',   label: 'Folding arm', source: 'Folding-arm latch fails and the arm detaches', x: 0.12, y: 0.2, weakness: 7, correctFix: 'rib' },
          { id: 'shell', label: 'Body shell', source: 'Shell cracks and exposes the electronics', x: 0.5, y: 0.5, weakness: 6, correctFix: 'thicker' },
          { id: 'bay',   label: 'Battery bay', source: 'Bay deforms and ejects the lithium pack', x: 0.88, y: 0.5, weakness: 6, correctFix: 'material' },
          { id: 'gimbal',label: 'Gimbal guard', source: 'Already sacrificial by design', x: 0.5, y: 0.92, weakness: -2, correctFix: null }
        ]
      }
    },

    certification: {
      modelName: 'SkyView SV-3',
      materialLabel: 'Declared shell material',
      critCorrectCost: 2600,
      toleranceCheck: {
        id: 'mtow-rating', doc: 'Form 9-A', field: 'Max take-off weight',
        fileValue: '249 g', formValue: '250 g', correctCost: 150,
        note: 'File says 249 g, the spec sheet says 250 g — and 250 g is the registration threshold. Rounding, or a real classification problem?'
      },
      deskIntro: `Aviation files are the thickest you've handled: Remote ID, geo-fencing evidence, the IATA battery summary, and a GDPR data-protection assessment. The reviewer is an aviation authority and they do not round. Sort genuine errors from tolerance.`,
      emails: [
        { id: 'lcc1', from: 'Aviation Authority', subject: 'Remote ID',
          body: "Your Remote ID broadcast must be active on power-up and tamper-evident. \"Jake said it works\" is, regrettably, not an acceptable form of evidence. Please submit the test log." }
      ],
      letter: {
        body: `RE: Application SV-3/UAS/2026. The competent authority observes that the declared maximum take-off mass situates the apparatus within a classification whose obligations — including mandatory registration and remote identification — are not fully evidenced within the technical documentation, and requires substantiation prior to issuance.`,
        translation: `Plain English (via Sarah): "At your stated weight the drone falls in a class that legally requires registration and Remote ID — and you haven't proven your Remote ID actually works. Submit the evidence (or get the weight properly under the threshold)."`,
        responses: [
          { id: 'evidence', text: 'Submit Jake\'s Remote ID test log and the registration evidence.', correct: true },
          { id: 'argue', text: 'Argue Remote ID is "basically standard" and shouldn\'t need proof.', correct: false,
            outcome: 'Aviation safety functions require documented evidence, not vibes. Rejected. (Reputation −.)' },
          { id: 'ignore', text: 'Ship it and hope nobody checks the broadcast.', correct: false,
            outcome: 'Flying an unregistered, non-broadcasting drone is an enforcement action waiting to happen. (Reputation −.)' }
        ]
      }
    },

    manufacturing: {
      intro: `The line's flagship and your last gate. Drones get scrutinised at customs for battery labelling and Remote ID conformity. Pick a partner, inspect the first run, and label it for every market.`,
      emails: [
        { id: 'lcm1', from: 'Factory Floor', subject: 'efficiency!',
          body: "We found a cheaper camera with a bigger sensor and disabled that slow encryption step to speed up boot. Footage uploads faster now too! To a server. Somewhere. Already in 4,000 units." }
      ],
      factories: [
        { id: 'shenzhen', name: 'Shenzhen MegaFab', quality: 3, speed: 5, cost: 1, compliance: 2, setup: 11000,
          note: 'Fast and cheap. Has opinions about which firmware to flash.' },
        { id: 'vietnam', name: 'Hanoi Precision', quality: 4, speed: 3, cost: 3, compliance: 4, setup: 16000,
          note: 'Flashes your exact Remote ID firmware and holds the battery spec.' },
        { id: 'brno', name: 'Brno Assembly (EU)', quality: 5, speed: 2, cost: 5, compliance: 5, setup: 26000,
          note: 'Aviation-grade, audited, and priced accordingly.' }
      ],
      firstArticle: [
        { id: 'finish', finding: 'Shell finish slightly glossier than spec', real: false, reworkCost: 450,
          note: 'Within tolerance. Cosmetic.' },
        { id: 'firmware', finding: 'Remote ID firmware build differs from the certified one', real: true, reworkCost: 1400,
          note: 'An uncertified Remote ID build voids your aviation approval.' },
        { id: 'batlabel', finding: 'Lithium-battery handling label missing on cartons', real: true, reworkCost: 800,
          note: 'Air freight will reject lithium shipments without the correct hazard label.' }
      ],
      availableMarks: [
        { id: 'ce',      label: 'CE',          market: 'eu' },
        { id: 'ceclass', label: 'C-class',     market: 'eu' },
        { id: 'weee',    label: 'WEEE bin',    market: 'eu' },
        { id: 'fcc',     label: 'FCC',         market: 'usa' },
        { id: 'remoteid',label: 'Remote ID',   market: 'usa' },
        { id: 'prop65',  label: 'Prop 65',     market: 'california' },
        { id: 'ccc',     label: 'CCC',         market: 'china' },
        { id: 'pse',     label: 'PSE',         market: 'japan' },
        { id: 'rcm',     label: 'RCM',         market: 'australia' },
        { id: 'recycle', label: 'Recycle ♺',   market: null }
      ]
    },

    launch: {
      intro: `Launch day for the flagship. Pilots review the range, regulators check the Remote ID broadcast, and privacy advocates test exactly where your footage goes. Every serious decision you made is now under a microscope.`,
      baseUnits: 7000,
      critBurnText: 'The flight battery is swelling after hard landings and one caught fire on a charger. A drone-fire video is trending and aviation forums are calling for a recall.'
    }
  }
};
