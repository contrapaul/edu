/* a2.1.js — interactive widgets for A2.1 User-centred Research Methods.
   Case-study modals and the .case-photo lightbox are handled globally
   by curriculum.js. */

/* ── MATCH THE METHOD TO THE QUESTION (2.1.4) ────────────────── */
(function () {
  'use strict';
  var bankEl = document.getElementById('sort-methods-bank');
  if (!bankEl || !window.DragSort) return;

  window.DragSort.init({
    bankEl: bankEl,
    zonesEl: document.getElementById('sort-methods-zones'),
    statusEl: document.getElementById('sort-methods-status'),
    resetBtn: document.getElementById('sort-methods-reset'),
    zones: [
      { id: 'field-research', label: 'Field research' },
      { id: 'task-analysis', label: 'Task analysis' },
      { id: 'observation', label: 'User observation' },
      { id: 'interviews', label: 'Interviews' },
      { id: 'surveys', label: 'Surveys / Likert' },
      { id: 'focus-groups', label: 'Focus groups' }
    ],
    items: [
      {
        id: 'q1',
        label: 'A design team wants to understand why factory workers wear their safety gloves differently than the manual describes.',
        correctZone: 'field-research',
        explanation: 'Their workaround is shaped by their real environment and habits, and they might not think to mention it if you simply asked them. You have to watch it happen in the actual factory.'
      },
      {
        id: 'q2',
        label: 'An online checkout has 5 steps. The team needs to know exactly which step causes the most drop-offs.',
        correctZone: 'task-analysis',
        explanation: 'This breaks a multi-step process into its parts to find precisely where the friction is. It is built for mapping a task, not for capturing opinions.'
      },
      {
        id: 'q3',
        label: "A team is testing a redesigned 'Add to cart' button and wants to see exactly where people hesitate or misclick.",
        correctZone: 'observation',
        explanation: "Watching a specific, structured interaction catches hesitation and errors a user wouldn't think to self-report afterwards."
      },
      {
        id: 'q4',
        label: 'A company wants to understand, in depth, why several long-time customers switched to a competitor.',
        correctZone: 'interviews',
        explanation: 'A small number of people, deep motivations, and room to follow up on their answers. This calls for a direct conversation, not a form or a crowd.'
      },
      {
        id: 'q5',
        label: 'A team wants a quick satisfaction score from 10,000 app users right after an update ships.',
        correctZone: 'surveys',
        explanation: 'Large sample, quantitative and fast to distribute. That is exactly the trade-off a survey makes: breadth over depth.'
      },
      {
        id: 'q6',
        label: "A brand wants to see how a small group's opinions on a new logo shift as they discuss it with each other.",
        correctZone: 'focus-groups',
        explanation: "The whole point here is capturing how perspectives change through interaction between participants, which you cannot get by asking people separately."
      }
    ]
  });
})();

/* ── WHO DID WHAT? THE PILL DISPENSER TEAM (2.1.3) ───────────── */
(function () {
  'use strict';
  var bankEl = document.getElementById('sort-team-bank');
  if (!bankEl || !window.DragSort) return;

  window.DragSort.init({
    bankEl: bankEl,
    zonesEl: document.getElementById('sort-team-zones'),
    statusEl: document.getElementById('sort-team-status'),
    resetBtn: document.getElementById('sort-team-reset'),
    zones: [
      { id: 'psychologist', label: 'Psychologist' },
      { id: 'sociologist', label: 'Sociologist' },
      { id: 'anthropologist', label: 'Anthropologist' },
      { id: 'designer', label: 'Designer / visual artist' },
      { id: 'materials', label: 'Materials and manufacturing engineer' },
      { id: 'systems', label: 'Software, hardware and systems engineer' },
      { id: 'hfe', label: 'Human factors engineer' },
      { id: 'data', label: 'Data analyst' },
      { id: 'marketing', label: 'Marketing and business expert' },
      { id: 'environment', label: 'Environmental scientist' }
    ],
    items: [
      {
        id: 't1',
        label: 'Found that a loud alarm every few hours made users anxious, and that after a week many simply ignored it. Recommended a soft chime that grows louder only if the dose is not taken.',
        correctZone: 'psychologist',
        explanation: 'This is about perception and behaviour: how people react to a repeated warning and why they stop paying attention to it (often called alarm fatigue).'
      },
      {
        id: 't2',
        label: 'Pointed out that many older users feel a loss of independence when a relative is told about every missed dose, and proposed letting the user choose who is alerted and when.',
        correctZone: 'sociologist',
        explanation: 'The issue is the social relationship between the user and their family, and how the product changes it. That is the territory of social behaviour and group dynamics.'
      },
      {
        id: 't3',
        label: 'Spent time in twenty homes and noticed that most people keep their medicine in the kitchen next to the kettle, not in the bathroom as the team had assumed.',
        correctZone: 'anthropologist',
        explanation: 'Field research inside real homes revealed a habit the users would probably never have mentioned in a survey, because to them it is simply normal.'
      },
      {
        id: 't4',
        label: 'Gave the box a warm, rounded look with a fabric-textured lid, so it would sit on a kitchen counter without looking like hospital equipment.',
        correctZone: 'designer',
        explanation: 'Aesthetics and emotional response shape the first impression. A product that looks medical can make the user feel ill, which affects whether they keep using it.'
      },
      {
        id: 't5',
        label: 'Chose a polypropylene for the dose trays that survives thousands of openings and can be injection moulded cheaply in large numbers.',
        correctZone: 'materials',
        explanation: 'Selecting a material and a process together, and balancing durability against tooling and unit cost, is the core of this role.'
      },
      {
        id: 't6',
        label: 'Built a backup battery and an offline mode, so doses are still released on time during a power cut or when the home Wi-Fi drops.',
        correctZone: 'systems',
        explanation: 'Turning the concept into a dependable working system, including what happens when parts of it fail, is an engineering and systems problem.'
      },
      {
        id: 't7',
        label: 'Made the release button large and low-force, because many users have arthritis and cannot press a small stiff switch.',
        correctZone: 'hfe',
        explanation: 'Grip strength, finger dexterity and the force a hand can comfortably apply are ergonomic data. Designing the control around them reduces strain and exclusion.'
      },
      {
        id: 't8',
        label: 'Studied logs from 300 trial units and found that most missed doses happened at the 10 pm slot, which led the team to add an evening reminder on the TV remote.',
        correctZone: 'data',
        explanation: 'A pattern across hundreds of units is only visible when the data is analysed at scale. No single interview would have shown it.'
      },
      {
        id: 't9',
        label: 'Recommended selling the dispenser through pharmacies on a monthly plan rather than as a one-off purchase, so the price fits a pension budget.',
        correctZone: 'marketing',
        explanation: 'Pricing, distribution channel and the business model are commercial decisions that decide whether the product reaches its users at all.'
      },
      {
        id: 't10',
        label: 'Replaced the sealed battery with a standard replaceable one and designed the casing to separate into single-material parts for recycling.',
        correctZone: 'environment',
        explanation: 'This looks at the whole life cycle, especially end of life. A sealed battery would send the whole product to landfill when it wears out.'
      }
    ]
  });
})();
