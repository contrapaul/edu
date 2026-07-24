/* a3.3.js — case study modals for A3.3 Introduction to Mechanical Systems */
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

/* ── MATCH THE MECHANISM (3.3.1) — dual-axis: mechanism type (per
   the reference table at 3.3.4) AND motion type (per this section,
   3.3.1) both need matching before an item counts as solved. ───── */
(function () {
  'use strict';
  var bankEl = document.getElementById('sort-mechanism-bank');
  if (!bankEl || !window.DragSort) return;

  window.DragSort.init({
    bankEl: bankEl,
    zonesEl: document.getElementById('sort-mechanism-zones-1'),
    zones: [
      { id: 'gear', label: 'Gear-driven' },
      { id: 'belt', label: 'Belt-driven' },
      { id: 'cam', label: 'Cam' },
      { id: 'lever', label: 'Lever' },
      { id: 'linkage', label: 'Linkage' }
    ],
    zonesEl2: document.getElementById('sort-mechanism-zones-2'),
    zones2: [
      { id: 'linear', label: 'Linear' },
      { id: 'rotary', label: 'Rotary' },
      { id: 'oscillating', label: 'Oscillating' },
      { id: 'reciprocating', label: 'Reciprocating' }
    ],
    statusEl: document.getElementById('sort-mechanism-status'),
    resetBtn: document.getElementById('sort-mechanism-reset'),
    items: [
      {
        id: 'm1',
        label: 'A bicycle derailleur, shifting between gears as you ride.',
        correctZone: 'gear',
        correctZone2: 'rotary',
        explanation: 'Gear-driven: it transmits rotary motion between shafts (the pedals and the wheel), just at a ratio you can change. Rotary in, rotary out — a gear system doesn’t change the motion type here, only the speed/torque trade-off.'
      },
      {
        id: 'm2',
        label: 'A conveyor belt moving boxes along a factory line.',
        correctZone: 'belt',
        correctZone2: 'rotary',
        explanation: 'Belt-driven: power is transmitted between separated pulleys by a flexible belt. Both pulleys rotate — rotary motion in, rotary motion out, same as a gear-driven system, just via a belt instead of meshing teeth.'
      },
      {
        id: 'm3',
        label: 'A car engine’s valve timing, opening and closing each valve at exactly the right moment.',
        correctZone: 'cam',
        correctZone2: 'reciprocating',
        explanation: 'This is the textbook cam application: a profiled surface on a rotating shaft converts rotary motion into controlled reciprocating motion, exactly the valve moving up and down.'
      },
      {
        id: 'm4',
        label: 'A pair of scissors, cutting through paper.',
        correctZone: 'lever',
        correctZone2: 'oscillating',
        explanation: 'A lever: a beam (the blade) amplifying force around a pivot. Each blade sweeps through an arc around that pivot, a back-and-forth arc around a fixed point is the definition of oscillating motion.'
      },
      {
        id: 'm5',
        label: 'A car’s windscreen wipers, sweeping back and forth.',
        correctZone: 'linkage',
        correctZone2: 'oscillating',
        explanation: 'A linkage transmits motion between moving parts via rigid links and pivots. The output here is the wiper arm sweeping through an arc, oscillating motion, driven by a linkage connected to a small rotary motor.'
      },
      {
        id: 'm6',
        label: 'A car’s manual steering rack, turning the wheel to move the wheels in a straight line.',
        correctZone: 'gear',
        correctZone2: 'linear',
        explanation: 'A rack and pinion is still a gear system, the pinion is a small gear, but here it meshes with a straight-toothed rack instead of another round gear, so rotary motion (the steering wheel) converts into linear motion (the rack sliding side to side). Same mechanism family as the derailleur, completely different motion result.'
      }
    ]
  });
})();
