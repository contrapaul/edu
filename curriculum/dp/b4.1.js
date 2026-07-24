/* b4.1.js — activity scripts for B4.1 Production Systems */

/* ── PRODUCTION-SYSTEM MATCHER (4.1.3) ───────────────────────── */
(function () {
  'use strict';
  var bankEl = document.getElementById('sort-production-bank');
  if (!bankEl || !window.DragSort) return;

  window.DragSort.init({
    bankEl: bankEl,
    zonesEl: document.getElementById('sort-production-zones'),
    statusEl: document.getElementById('sort-production-status'),
    resetBtn: document.getElementById('sort-production-reset'),
    zones: [
      { id: 'one-off', label: 'One-off (jobbing)' },
      { id: 'batch', label: 'Batch production' },
      { id: 'mass', label: 'Mass production' },
      { id: 'mass-custom', label: 'Mass customisation' },
      { id: 'continuous', label: 'Continuous (process) production' }
    ],
    items: [
      {
        id: 'p1',
        label: 'A one-of-a-kind wedding dress, made to one bride’s exact measurements.',
        correctZone: 'one-off',
        explanation: 'A single unit with no repeat run ahead of it is exactly what craft/manual production is for — there’s no volume to spread tooling costs over, so it doesn’t make sense to automate.'
      },
      {
        id: 'p2',
        label: 'A limited sneaker drop: 500 pairs, then never made again.',
        correctZone: 'batch',
        explanation: 'Tens to thousands of units, produced once as a run rather than continuously — the textbook case for mechanised/semi-automated batch production.'
      },
      {
        id: 'p3',
        label: 'A standard family car, built by the thousands on an assembly line.',
        correctZone: 'mass',
        explanation: 'Thousands to millions of an identical product justifies the capital investment in a dedicated assembly line, where high volume drives the cost-per-unit down.'
      },
      {
        id: 'p4',
        label: 'A laptop configured to your exact spec when you order it online.',
        correctZone: 'mass-custom',
        explanation: 'Millions of units, but each one individually configured — this needs flexible automation (CIM) that can vary the build without stopping the line, not fixed mass-production tooling.'
      },
      {
        id: 'p5',
        label: 'Crude oil, refined into fuel non-stop, 24 hours a day.',
        correctZone: 'continuous',
        explanation: 'A continuous material flow with no discrete "units" and no stopping point is what fully automated continuous/process production is built for.'
      }
    ]
  });
})();
