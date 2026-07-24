/* c3.2.js — case study modals for C3.2 Life-Cycle Analysis */
(function () {
  'use strict';

  var openButtons = document.querySelectorAll('[data-modal]');
  var modals = document.querySelectorAll('.case-modal');
  var closeButtons = document.querySelectorAll('.case-modal-close');
  var overlays = document.querySelectorAll('.case-modal-overlay');

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    var closeBtn = modal.querySelector('.case-modal-close');
    setTimeout(function () { if (closeBtn) closeBtn.focus(); }, 50);
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    var caseId = modal.id.replace('modal-', '');
    var trigger = document.querySelector('[data-modal="modal-' + caseId + '"]');
    if (trigger) trigger.focus();
  }

  openButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(btn.dataset.modal); });
    if (btn.tagName !== 'BUTTON') {
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(btn.dataset.modal);
        }
      });
    }
  });

  closeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { closeModal(btn.closest('.case-modal')); });
  });

  overlays.forEach(function (overlay) {
    overlay.addEventListener('click', function () { closeModal(overlay.closest('.case-modal')); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      modals.forEach(function (m) {
        if (m.classList.contains('open')) closeModal(m);
      });
    }
  });

  var lightbox = document.getElementById('case-lightbox');
  if (lightbox) {
    var lightboxImg = lightbox.querySelector('img');

    document.querySelectorAll('.case-photo > a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var img = link.querySelector('img');
        lightboxImg.src = link.getAttribute('href');
        lightboxImg.alt = img ? img.alt : '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightboxImg.src = '';
      var modalOpen = Array.prototype.some.call(modals, function (m) {
        return m.classList.contains('open');
      });
      document.body.style.overflow = modalOpen ? 'hidden' : '';
    }

    lightbox.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        e.stopPropagation();
        closeLightbox();
      }
    }, true);
  }

  modals.forEach(function (modal) {
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        var focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  });
})();

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
