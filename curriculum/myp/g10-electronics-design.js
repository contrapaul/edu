/* g10-electronics-design.js: interactive activities for the electronics unit.
   The modal shell and the drag-sort engine are handled globally by
   curriculum.js and drag-sort.js. This file only supplies content. */

/* ── THE STICKY NOTE TEST (Ai activity) ───────────────────────
   Ten real situations from around a school. Four genuinely need
   electronics, four are solved better by a label or a piece of
   paper, and two accept either answer because the honest answer
   depends on something the student has to name. Those two are
   where the discussion lives, so they are marked as arguable in
   their explanations rather than hidden. */
(function () {
  'use strict';
  var bankEl = document.getElementById('sort-stickynote-bank');
  if (!bankEl || !window.DragSort) return;

  window.DragSort.init({
    enableDrag: true,
    bankEl: bankEl,
    zonesEl: document.getElementById('sort-stickynote-zones'),
    statusEl: document.getElementById('sort-stickynote-status'),
    resetBtn: document.getElementById('sort-stickynote-reset'),
    zones: [
      { id: 'electronics', label: 'Needs electronics' },
      { id: 'paper',       label: 'A sticky note would do' }
    ],
    items: [
      /* ── Genuinely electronic ── */
      { id: 'e1', correctZone: 'electronics',
        label: 'The art room kiln has to stay above 900°C for six hours. It runs overnight, when nobody is in the building.',
        explanation: 'Something has to be measured at a moment when no person is there to measure it. That is the clearest reason electronics can exist. A sign cannot watch a temperature at 2am.' },
      { id: 'e2', correctZone: 'electronics',
        label: 'The library has 40 study seats. Students coming in from the corridor cannot tell if any are free without walking a full lap.',
        explanation: 'The answer changes minute by minute, so no printed thing can hold it. Counting something that keeps changing, and showing it somewhere else, is exactly what a device is for.' },
      { id: 'e3', correctZone: 'electronics',
        label: 'Fire doors get propped open on hot days. Nobody notices until the safety walk on Friday.',
        explanation: 'The problem is not that people do not know the rule. They know it. The problem is that nobody is watching at the moment it gets broken. Noticing at that moment is a sensing job.' },
      { id: 'e4', correctZone: 'electronics',
        label: 'The front office needs to know when the delivery van reaches the back gate, which no window looks out onto.',
        explanation: 'Something happens in one place and has to be known in another. A person could stand there all day, but that is a person doing a job a sensor does for a few dollars.' },

      /* ── A sticky note would do ── */
      { id: 'p1', correctZone: 'paper',
        label: 'Students keep putting paper in the plastic bin and plastic in the paper bin.',
        explanation: 'Nothing here is being sensed, timed, counted or remembered. People just cannot tell which bin is which. Two clear labels solve it today, for nothing. A bin that beeps is a gadget looking for a reason.' },
      { id: 'p2', correctZone: 'paper',
        label: 'Nobody can ever remember the password for the guest wifi.',
        explanation: 'The information never changes, so it does not need a device to hold it. Print it on a card and put the card where people ask. If the answer is a fixed piece of text, paper wins.' },
      { id: 'p3', correctZone: 'paper',
        label: 'Grade 12 students argue about whose turn it is to tidy the common room.',
        explanation: 'A rota on the wall does this. The real problem is that people ignore the rota, and a screen showing the same rota gets ignored in exactly the same way. Electronics cannot fix not wanting to.' },
      { id: 'p4', correctZone: 'paper',
        label: 'The front office wants every visitor to sign in when they arrive.',
        explanation: 'A book and a pen already work, and they keep working in a power cut. Before you replace paper, ask what the electronic version does that the paper version does not. Here, nothing.' },

      /* ── Either answer accepted, and this is the interesting part ── */
      { id: 'b1', correctZone: ['electronics', 'paper'],
        label: 'The Grade 6 class shares 15 laptops. Nobody knows which ones are charged until they open each one.',
        explanation: 'Both answers are defensible, so say which one you picked and why. A charging checklist taped to the trolley costs nothing, and works while people fill it in. But there are 15 laptops, the state changes every day, and checklists like this get abandoned in a week. If you argue for electronics, your evidence has to be that the paper version was tried and failed.' },
      { id: 'b2', correctZone: ['electronics', 'paper'],
        label: 'The library wants students to keep the noise down in the quiet corner.',
        explanation: 'This is the classic trap, and both answers can be argued. A sign is free, and a noise meter is a very popular student project. Ask the harder question: does knowing they are loud actually make a group quieter? If it does, the meter earns its place. If they already know and do not care, you have built a decoration.' }
    ]
  });
})();

/* ── NEED, WANT, OR ASSUMPTION (Ai activity) ──────────────────
   Twelve things a student wrote down about one client group,
   the four staff on the front office desk. Four are evidenced
   needs, four are stated preferences, four are beliefs nobody
   checked. The assumption pile is the teaching point.
   The office was chosen deliberately: it is a group students
   rarely think about, and being adults, it stops them writing
   about what they would want themselves. */
(function () {
  'use strict';
  var bankEl = document.getElementById('sort-needwant-bank');
  if (!bankEl || !window.DragSort) return;

  window.DragSort.init({
    enableDrag: true,
    bankEl: bankEl,
    zonesEl: document.getElementById('sort-needwant-zones'),
    statusEl: document.getElementById('sort-needwant-status'),
    resetBtn: document.getElementById('sort-needwant-reset'),
    zones: [
      { id: 'need',       label: 'Need' },
      { id: 'want',       label: 'Want' },
      { id: 'assumption', label: 'Assumption' }
    ],
    items: [
      /* ── Evidenced needs ── */
      { id: 'n1', correctZone: 'need',
        label: 'We watched the front desk for one hour on Tuesday. Staff were interrupted 23 times by people asking where a room was.',
        explanation: 'Gathered by watching, not by asking, and it counts something. A number from one hour is the kind of line that can justify a whole project.' },
      { id: 'n2', correctZone: 'need',
        label: 'Two of the four staff cannot see the back gate from any desk. Deliveries wait about 12 minutes before anyone notices.',
        explanation: 'Two things make this a need. It came from the people themselves, and it has a measured cost attached. Twelve minutes is something your device can be tested against later.' },
      { id: 'n3', correctZone: 'need',
        label: 'The office rule is that the phone must be answered within four rings. We timed nine calls and three of them took longer.',
        explanation: 'A real constraint, plus evidence that it is being missed. This one also limits your design: whatever you build cannot take a hand away from the phone.' },
      { id: 'n4', correctZone: 'need',
        label: 'On Monday morning we saw six people queue behind one person filling in the visitor book.',
        explanation: 'Observed, specific, and it affects people beyond the office. Notice that the fix might still be paper. A need being real does not yet prove electronics is the answer.' },

      /* ── Stated wants ── */
      { id: 'w1', correctZone: 'want',
        label: 'One staff member said it would be nice if the device had their name on it.',
        explanation: 'A preference, from one person. Cheap to do and worth remembering for later, but nobody is being harmed by the absence of their name.' },
      { id: 'w2', correctZone: 'want',
        label: 'The office said they would prefer it in the school colours.',
        explanation: 'A preference about appearance. Useful in Biv when you design the case. Useless as a reason for the project to exist.' },
      { id: 'w3', correctZone: 'want',
        label: 'A staff member said they would like it to play a little tune when it works.',
        explanation: 'A want, and one worth testing before you build it. In a room with a four ring phone rule, a tune may turn out to be the opposite of helpful.' },
      { id: 'w4', correctZone: 'want',
        label: 'Two people said it would be good if it could connect to their phones as well.',
        explanation: 'A preference that sounds like a requirement because it is technical. Two people saying "it would be good if" is not evidence that anything is missing.' },

      /* ── Unchecked assumptions ── */
      { id: 'a1', correctZone: 'assumption',
        label: 'Office staff are busy all the time, so whatever we make has to be instant.',
        explanation: 'Nobody checked this. It might be true, and it might even be right, but as written it is a belief turned straight into a design rule. Twenty minutes of watching would settle it.' },
      { id: 'a2', correctZone: 'assumption',
        label: 'Adults are not good with technology, so the buttons need to be very big.',
        explanation: 'A guess about a whole group, stated as a reason. It is also the kind of assumption that quietly insults your client, which is worth noticing before you say it to them.' },
      { id: 'a3', correctZone: 'assumption',
        label: 'They will not read any instructions, so it has to work with no explanation at all.',
        explanation: 'Two assumptions stacked together: that they will not read, and that no explanation is therefore the answer. Both are testable in about ten minutes, and neither has been tested.' },
      { id: 'a4', correctZone: 'assumption',
        label: 'The office is a quiet room, so a device that beeps would annoy everybody.',
        explanation: 'Sounds sensible, and it may well be right. But you have not been in that room at 8:30am. Assumptions that sound sensible are the hardest ones to catch in your own writing.' }
    ]
  });
})();

/* ── FIND THE WEAK CLAIMS (Ai activity) ───────────────────────
   Eight sentences from a need statement about the front office,
   three of which assert something they never support. Two of the
   five that pass sit immediately after the weak sentence they
   resemble. Each near miss is the same point made properly, so
   the choice cannot be made on tone alone.
   Behaviour lives in the shared claim-hunt.js. */
(function () {
  'use strict';
  var briefEl = document.getElementById('claims-brief');
  if (!briefEl || !window.ClaimHunt) return;

  var SENTENCES = [
    { text: 'Our client is the four staff who work at the front office desk.',
      weak: false,
      why: 'Fine. It says who the client is, and naming somebody is not the same as claiming something about them.' },
    { text: 'Everyone knows the front office is the busiest place in the school.',
      weak: true, fault: 'Appeals to what everyone knows',
      why: '"Everyone knows" is a way of skipping the evidence rather than giving it. Busiest compared with what? Measured how? Fix it by replacing the phrase with something you counted.' },
    { text: 'We watched the desk for one hour on Tuesday and counted 23 interruptions asking for directions.',
      weak: false,
      why: 'Fine, and worth comparing with the sentence just above it. This one says when, how long, and how many. "Everyone knows" says none of those things.' },
    { text: 'Obviously an electronic device is the best way to fix this.',
      weak: true, fault: 'No alternative is considered',
      why: 'The word "obviously" is doing all the work here, and no other option is even mentioned. This is the sticky note failure in one sentence. Fix it by naming what else could work and saying why it does not.' },
    { text: 'A printed map by the door would help, but it cannot show which rooms are free right now, and that changes every period.',
      weak: false,
      why: 'Fine, and this is the sentence above done properly. It names the cheap alternative, then gives the exact reason electronics beats it. That reason is the third bullet of your Ai page.' },
    { text: 'The office rule is that the phone must be answered within four rings, so anything we build must not take a hand away from the phone.',
      weak: false,
      why: 'Fine. A fact leads to a limit on the design, and the link between them is written down instead of being left for the reader to guess.' },
    { text: 'The staff will find it easy to use because I found it easy to use.',
      weak: true, fault: 'Assumes the designer is the user',
      why: 'The most common failure in Ai. You built it, so of course you can use it. That tells you nothing about four adults who have never seen it. Fix it by testing with them, or by cutting the claim.' },
    { text: 'Two of the four staff told us they cannot see the back gate from any desk.',
      weak: false,
      why: 'Fine. It says how many people, and where the information came from, so a reader can judge how much weight to give it.' }
  ];

  window.ClaimHunt.init({
    briefEl: briefEl,
    checkBtn: document.getElementById('claims-check'),
    resetBtn: document.getElementById('claims-reset'),
    statusEl: document.getElementById('claims-status'),
    verdictsEl: document.getElementById('claims-verdicts'),
    target: 3,
    sentences: SENTENCES,
    prompt: 'Click the three sentences that claim something without supporting it.',
    allFound: 'All three found. Every one of them would have survived a spellcheck and a read-through.'
  });
})();

/* ── RESEARCH BUDGET PLANNER (Aii activity) ───────────────────
   Twelve tokens, seven activities. The chips are the quick part;
   the three text fields on every row and the two paragraphs
   underneath are where the marks actually are. The two spending
   rules from the unit are checked live, so a plan made entirely
   of reading, or entirely of opinions, says so about itself.
   Behaviour lives in the shared research-planner.js. */
(function () {
  'use strict';
  if (!window.ResearchPlanner) return;

  window.ResearchPlanner.init({
    rootId: 'rplan-electronics',
    budget: 12,
    accent: '#1a5cb8',
    exportTitle: 'My research plan',
    activities: [
      { id: 'catalog',   label: 'Read a catalog part page',      cost: 1, kind: 'Secondary', tags: ['feasibility'] },
      { id: 'secondary', label: 'Other reading: datasheet, video, guide', cost: 1, kind: 'Secondary', tags: [] },
      { id: 'survey',    label: 'Questionnaire',                 cost: 2, kind: 'Primary',   tags: ['people'] },
      { id: 'observe',   label: 'Watch your client, with a plan', cost: 3, kind: 'Primary',  tags: ['people'] },
      { id: 'interview', label: 'Interview',                     cost: 3, kind: 'Primary',   tags: ['people'] },
      { id: 'bench',     label: 'Bench test a part on a breadboard', cost: 3, kind: 'Primary', tags: ['feasibility'] },
      { id: 'focus',     label: 'Focus group',                   cost: 4, kind: 'Primary',   tags: ['people'] }
    ],
    rules: [
      { tag: 'people', min: 4,
        message: 'Spending rule: at least 4 tokens on people. You have {n}. Without that, your plan is all reading.' },
      { tag: 'feasibility', min: 3,
        message: 'Spending rule: at least 3 tokens on whether it will work, meaning a bench test or catalog part pages. You have {n}. Without that, your plan is all opinions.' }
    ]
  });
})();
