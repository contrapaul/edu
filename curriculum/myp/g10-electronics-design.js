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
