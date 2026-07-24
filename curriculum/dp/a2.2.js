/* a2.2.js — case study modals for A2.2 Prototyping Techniques */
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

/* ── FIDELITY LADDER SORTER (2.2.1) ──────────────────────────── */
(function () {
  'use strict';
  var bankEl = document.getElementById('sort-fidelity-bank');
  if (!bankEl || !window.DragSort) return;

  window.DragSort.init({
    bankEl: bankEl,
    zonesEl: document.getElementById('sort-fidelity-zones'),
    statusEl: document.getElementById('sort-fidelity-status'),
    resetBtn: document.getElementById('sort-fidelity-reset'),
    zones: [
      { id: 'pos1', label: '1st — lowest fidelity' },
      { id: 'pos2', label: '2nd' },
      { id: 'pos3', label: '3rd' },
      { id: 'pos4', label: '4th — highest fidelity' }
    ],
    items: [
      {
        id: 'f1',
        label: 'A pencil sketch of the concept.',
        correctZone: 'pos1',
        explanation: 'No physical form at all yet, just a 2D representation of an idea — as low-fidelity as a prototype gets.'
      },
      {
        id: 'f2',
        label: 'A rough cardboard mock-up of the shape.',
        correctZone: 'pos2',
        explanation: 'A physical, 3D object now, but still cheap and crude — form and proportion only, no real materials or function.'
      },
      {
        id: 'f3',
        label: 'A 3D-printed shell with the final proportions.',
        correctZone: 'pos3',
        explanation: 'Mid-fidelity: accurate form in a substitute material, per the table above — a step closer, but not yet working or in final materials.'
      },
      {
        id: 'f4',
        label: 'A working electronic prototype in the final housing.',
        correctZone: 'pos4',
        explanation: 'High-fidelity: real materials and real function together — the point where user testing and stakeholder demos actually mean something.'
      }
    ]
  });
})();

/* ── PHYSICAL VS. CAD COMPARE SLIDER (2.2.3) ─────────────────── */
(function () {
  'use strict';
  var slider = document.getElementById('compare-a22-slider');
  if (!slider) return;
  var before = document.getElementById('compare-a22-before');
  var handle = document.getElementById('compare-a22-handle');
  var dragging = false;

  function setPosition(pct) {
    pct = Math.max(0, Math.min(100, pct));
    before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    handle.style.left = pct + '%';
    handle.setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  function pctFromClientX(clientX) {
    var rect = slider.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  handle.addEventListener('pointerdown', function (e) {
    e.stopPropagation();
    dragging = true;
    handle.setPointerCapture(e.pointerId);
  });
  slider.addEventListener('pointerdown', function (e) {
    dragging = true;
    setPosition(pctFromClientX(e.clientX));
  });
  window.addEventListener('pointermove', function (e) {
    if (dragging) setPosition(pctFromClientX(e.clientX));
  });
  window.addEventListener('pointerup', function () { dragging = false; });

  handle.addEventListener('keydown', function (e) {
    var current = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
    if (e.key === 'ArrowLeft') { setPosition(current - 5); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { setPosition(current + 5); e.preventDefault(); }
    else if (e.key === 'Home') { setPosition(0); e.preventDefault(); }
    else if (e.key === 'End') { setPosition(100); e.preventDefault(); }
  });

  setPosition(50);
})();
