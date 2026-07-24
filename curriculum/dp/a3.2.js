/* a3.2.js — case study modals for A3.2 Introduction to Structural Systems */
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

/* ── LOAD AND EQUILIBRIUM CLICKER (3.2.7) — a beam on a single
   pivot, so ΣF=0 is always satisfied by the support reaction and the
   only thing worth testing interactively is ΣM (does it stay level or
   tip). Reuses the click-on-SVG pattern from B2.2.4. ──────────────── */
(function () {
  'use strict';
  var svg = document.getElementById('equilibrium-a327-svg');
  if (!svg || !window.DiagramUtils) return;
  var DU = window.DiagramUtils;

  var PIVOT_SVG_X = 250;
  var BEAM_LEFT = 60, BEAM_RIGHT = 440;
  var PIXELS_PER_UNIT = (BEAM_RIGHT - PIVOT_SVG_X) / 10;
  var MAX_ROTATION_DEG = 14;
  var STABLE_THRESHOLD = 1.5;

  var beam = document.getElementById('equilibrium-a327-beam');
  var beamGroup = document.getElementById('equilibrium-a327-beamgroup');
  var loadsGroup = document.getElementById('equilibrium-a327-loads');
  var listLabel = document.getElementById('equilibrium-a327-list-label');
  var listEl = document.getElementById('equilibrium-a327-list');
  var readout = document.getElementById('equilibrium-a327-readout');
  var resetBtn = document.getElementById('equilibrium-a327-reset');

  beamGroup.style.transformOrigin = PIVOT_SVG_X + 'px 98px';
  beamGroup.style.transition = 'transform 0.3s ease';

  var loads = [];
  var nextId = 1;

  function unitsToSvgX(units) { return PIVOT_SVG_X + units * PIXELS_PER_UNIT; }

  function stepper(label, onClick) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'live-calc-reset-btn';
    btn.style.marginTop = '0';
    btn.style.marginLeft = '0.4rem';
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function render() {
    loadsGroup.innerHTML = '';
    loads.forEach(function (load) {
      var x = unitsToSvgX(load.units);
      var len = 20 + load.magnitude * 3;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x); line.setAttribute('y1', 90 - len);
      line.setAttribute('x2', x); line.setAttribute('y2', 88);
      line.setAttribute('stroke', '#dc2626');
      line.setAttribute('stroke-width', '3');
      var head = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      head.setAttribute('points', (x - 5) + ',82 ' + (x + 5) + ',82 ' + x + ',92');
      head.setAttribute('fill', '#dc2626');
      loadsGroup.appendChild(line);
      loadsGroup.appendChild(head);
    });

    var momentSum = loads.reduce(function (sum, l) { return sum + l.units * l.magnitude; }, 0);
    var angle = DU.clamp(momentSum * 0.6, -MAX_ROTATION_DEG, MAX_ROTATION_DEG);
    beamGroup.style.transform = 'rotate(' + angle + 'deg)';

    listLabel.style.display = loads.length ? '' : 'none';
    listEl.innerHTML = '';
    loads.forEach(function (load) {
      var row = document.createElement('div');
      row.className = 'live-calc-field-input-wrap';
      row.style.marginBottom = '0.5rem';

      var label = document.createElement('span');
      label.style.fontSize = '0.82rem';
      var side = load.units >= 0 ? Math.abs(load.units).toFixed(1) + ' right of pivot' : Math.abs(load.units).toFixed(1) + ' left of pivot';
      label.textContent = side + ', magnitude ' + load.magnitude;
      row.appendChild(label);

      row.appendChild(stepper('−', function () { load.magnitude = Math.max(1, load.magnitude - 1); render(); }));
      row.appendChild(stepper('+', function () { load.magnitude += 1; render(); }));
      row.appendChild(stepper('× remove', function () { loads = loads.filter(function (l) { return l.id !== load.id; }); render(); }));

      listEl.appendChild(row);
    });

    readout.innerHTML = '';
    var lines = [];
    if (!loads.length) {
      lines.push({ text: 'No loads placed yet — click the beam to add one.' });
    } else {
      lines.push({ text: 'ΣF = 0 (satisfied automatically — the pivot supplies whatever vertical reaction is needed).' });
      var stable = Math.abs(momentSum) < STABLE_THRESHOLD;
      lines.push({
        text: 'ΣM about the pivot ≈ ' + momentSum.toFixed(1) + ' — ' +
          (stable ? 'balanced, the beam stays level.' : 'unbalanced, the beam rotates ' +
            (momentSum > 0 ? 'clockwise (right side down).' : 'anticlockwise (left side down).')),
        cls: stable ? 'diagram-stable' : 'diagram-unstable'
      });
    }
    lines.forEach(function (l) {
      var p = document.createElement('p');
      p.className = 'diagram-readout-line' + (l.cls ? ' ' + l.cls : '');
      p.textContent = l.text;
      readout.appendChild(p);
    });
  }

  beam.addEventListener('click', function (evt) {
    var p = DU.svgPoint(svg, evt);
    var svgX = DU.clamp(p.x, BEAM_LEFT, BEAM_RIGHT);
    var units = Math.round(((svgX - PIVOT_SVG_X) / PIXELS_PER_UNIT) * 2) / 2;
    loads.push({ id: nextId++, units: units, magnitude: 5 });
    render();
  });

  resetBtn.addEventListener('click', function () { loads = []; render(); });

  render();
})();
