/* c3.2.js — interactive widgets for C3.2 Life-Cycle Analysis.
   Case-study modals and the .case-photo lightbox are handled globally
   by curriculum.js. */

/* ── CRADLE-TO-GRAVE STAGE SORTER (3.2.2) ────────────────────── */
(function () {
  'use strict';
  var bankEl = document.getElementById('sort-lca-bank');
  if (!bankEl || !window.DragSort) return;

  window.DragSort.init({
    bankEl: bankEl,
    zonesEl: document.getElementById('sort-lca-zones'),
    statusEl: document.getElementById('sort-lca-status'),
    resetBtn: document.getElementById('sort-lca-reset'),
    zones: [
      { id: 'pre-production', label: '1. Pre-production' },
      { id: 'production', label: '2. Production' },
      { id: 'distribution', label: '3. Distribution & packaging' },
      { id: 'utilisation', label: '4. Utilisation' },
      { id: 'disposal', label: '5. Disposal' }
    ],
    items: [
      {
        id: 'l1',
        label: 'Mining cobalt and lithium for the battery.',
        correctZone: 'pre-production',
        explanation: 'Raw material extraction — before the phone exists as a product at all.'
      },
      {
        id: 'l2',
        label: 'Assembling the circuit board and screen in a factory.',
        correctZone: 'production',
        explanation: 'Manufacturing: this is exactly the phase the hotspot table above flags as dominant for consumer electronics — chip and screen fabrication use a lot of energy before the phone ever ships.'
      },
      {
        id: 'l3',
        label: 'Shipping thousands of units by air freight to retail stores.',
        correctZone: 'distribution',
        explanation: 'Distribution and packaging: transport fuel and packaging waste, separate from making the product itself.'
      },
      {
        id: 'l4',
        label: 'Charging the battery every night for two years.',
        correctZone: 'utilisation',
        explanation: 'The use phase — but per the hotspot table, in-use energy for electronics has been shrinking (Moore’s Law, Energy Star), which is exactly why manufacturing now dominates instead.'
      },
      {
        id: 'l5',
        label: 'Sorting rare earth metals out at an e-waste recycling plant.',
        correctZone: 'disposal',
        explanation: 'End of life: recycling recovers some materials back toward stage 1, but e-waste toxics and recycling energy are real costs of their own.'
      }
    ]
  });
})();
