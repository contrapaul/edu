/* b2.2.js — case study modals for B2.2 Modelling and Prototyping */
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

  /* Image lightbox — enlarge captioned photos in-page instead of a new tab.
     Also powers the pre-existing 2.2.1 drawing-example photos. */
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

/* ── STRESS HEATMAP DEMO (2.2.4) — purely illustrative, no real FEA.
   Establishes the click-on-SVG + live-redraw pattern the other two
   diagram widgets (A3.2.7, B3.2.4) reuse. ───────────────────────── */
(function () {
  'use strict';
  var svg = document.getElementById('heatmap-b224-svg');
  if (!svg || !window.DiagramUtils) return;
  var DU = window.DiagramUtils;

  var PLATE = { x: 60, y: 60, width: 380, height: 180 };
  var HOLE = { cx: 100, cy: 150 };
  var MAX_DIST = 330; // roughly the plate's far corner, for scaling the readout %

  var gradient = document.getElementById('heatmap-b224-gradient');
  var fillRect = document.getElementById('heatmap-b224-fill');
  var marker = document.getElementById('heatmap-b224-marker');
  var readout = document.getElementById('heatmap-b224-readout');

  function placeLoad(evt) {
    var p = DU.svgPoint(svg, evt);
    var x = DU.clamp(p.x, PLATE.x + 8, PLATE.x + PLATE.width - 8);
    var y = DU.clamp(p.y, PLATE.y + 8, PLATE.y + PLATE.height - 8);

    gradient.setAttribute('cx', x);
    gradient.setAttribute('cy', y);
    fillRect.style.opacity = '0.85';

    marker.style.display = '';
    marker.setAttribute('transform', 'translate(' + x + ',' + y + ')');

    var dist = Math.sqrt(Math.pow(x - HOLE.cx, 2) + Math.pow(y - HOLE.cy, 2));
    var pct = Math.round(DU.clamp(dist / MAX_DIST, 0, 1) * 100);
    readout.innerHTML = '';
    var line = document.createElement('p');
    line.className = 'diagram-readout-line';
    line.textContent = 'Illustrative peak stress near the fixed hole: ' + pct + '% — the further the load is from the mounting point, the higher this reads, the same lever-arm intuition behind a real bending-moment calculation, just without the real numbers.';
    readout.appendChild(line);
  }

  svg.addEventListener('click', placeLoad);
})();
