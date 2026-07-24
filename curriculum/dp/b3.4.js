/* b3.4.js — case study modals for B3.4 Electronic Systems Application and Selection */
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

/* ── OHM'S LAW / POWER CALCULATOR (3.4.3) ────────────────────── */
(function () {
  'use strict';
  var root = document.getElementById('calc-ohm');
  if (!root || !window.LiveCalc) return;
  var LC = window.LiveCalc;

  var fieldV = document.getElementById('ohm-field-V');
  var fieldI = document.getElementById('ohm-field-I');
  var fieldR = document.getElementById('ohm-field-R');
  var fieldP = document.getElementById('ohm-field-P');
  var inputV = document.getElementById('ohm-V');
  var inputI = document.getElementById('ohm-I');
  var inputR = document.getElementById('ohm-R');
  var inputP = document.getElementById('ohm-P');
  var working = document.getElementById('ohm-working');
  var resetBtn = document.getElementById('ohm-reset');

  var FIELDS = [
    { key: 'V', el: fieldV, input: inputV, unit: 'V', name: 'Voltage' },
    { key: 'I', el: fieldI, input: inputI, unit: 'A', name: 'Current' },
    { key: 'R', el: fieldR, input: inputR, unit: 'Ω', name: 'Resistance' },
    { key: 'P', el: fieldP, input: inputP, unit: 'W', name: 'Power' }
  ];

  function readValues() {
    // Returns { V, I, R, P } with null for empty/invalid fields, and clears/sets
    // per-field errors for blank-but-non-numeric or non-positive entries.
    var values = {};
    FIELDS.forEach(function (f) {
      LC.clearFieldError(f.el);
      f.input.classList.remove('solved');
      var raw = f.input.value.trim();
      if (raw === '') { values[f.key] = null; return; }
      var n = parseFloat(raw);
      if (isNaN(n)) { LC.setFieldError(f.el, 'Not a number'); values[f.key] = null; return; }
      if (n <= 0) { LC.setFieldError(f.el, 'Must be greater than 0'); values[f.key] = null; return; }
      values[f.key] = n;
    });
    return values;
  }

  function solve(values) {
    var known = FIELDS.map(function (f) { return f.key; }).filter(function (k) { return values[k] !== null; });
    if (known.length < 2) {
      return { lines: known.length === 0
        ? []
        : ['Enter one more value — two of V, I, R (or one plus P) are needed to solve the rest.'] };
    }

    var basis = known.slice(0, 2).sort().join('');
    var V = values.V, I = values.I, R = values.R, P = values.P;
    var lines = [];
    var solvedKeys = [];

    if (basis === 'IV') {
      R = V / I; P = V * I;
      lines.push('R = V / I = ' + V + ' / ' + I + ' = ' + LC.fmt(R) + ' Ω');
      lines.push('P = V × I = ' + V + ' × ' + I + ' = ' + LC.fmt(P) + ' W');
      solvedKeys = ['R', 'P'];
    } else if (basis === 'RV') {
      I = V / R; P = (V * V) / R;
      lines.push('I = V / R = ' + V + ' / ' + R + ' = ' + LC.fmt(I) + ' A');
      lines.push('P = V² / R = ' + LC.fmt(V * V) + ' / ' + R + ' = ' + LC.fmt(P) + ' W');
      solvedKeys = ['I', 'P'];
    } else if (basis === 'PV') {
      I = P / V; R = (V * V) / P;
      lines.push('I = P / V = ' + P + ' / ' + V + ' = ' + LC.fmt(I) + ' A');
      lines.push('R = V² / P = ' + LC.fmt(V * V) + ' / ' + P + ' = ' + LC.fmt(R) + ' Ω');
      solvedKeys = ['I', 'R'];
    } else if (basis === 'IR') {
      V = I * R; P = I * I * R;
      lines.push('V = I × R = ' + I + ' × ' + R + ' = ' + LC.fmt(V) + ' V');
      lines.push('P = I² × R = ' + LC.fmt(I * I) + ' × ' + R + ' = ' + LC.fmt(P) + ' W');
      solvedKeys = ['V', 'P'];
    } else if (basis === 'IP') {
      V = P / I; R = P / (I * I);
      lines.push('V = P / I = ' + P + ' / ' + I + ' = ' + LC.fmt(V) + ' V');
      lines.push('R = P / I² = ' + P + ' / ' + LC.fmt(I * I) + ' = ' + LC.fmt(R) + ' Ω');
      solvedKeys = ['V', 'R'];
    } else if (basis === 'PR') {
      V = Math.sqrt(P * R); I = Math.sqrt(P / R);
      lines.push('V = √(P × R) = √(' + P + ' × ' + R + ') = ' + LC.fmt(V) + ' V');
      lines.push('I = √(P / R) = √(' + P + ' / ' + R + ') = ' + LC.fmt(I) + ' A');
      solvedKeys = ['V', 'I'];
    }

    // If more than 2 fields were filled in, the extras are redundant —
    // check they roughly agree with what the basis pair predicts.
    var computed = { V: V, I: I, R: R, P: P };
    known.slice(2).forEach(function (extraKey) {
      var entered = values[extraKey];
      var expected = computed[extraKey];
      var field = FIELDS.filter(function (f) { return f.key === extraKey; })[0];
      if (Math.abs(entered - expected) / expected > 0.02) {
        LC.setFieldError(field.el, 'Doesn’t match the other values (expected ≈ ' + LC.fmt(expected) + ')');
      }
    });

    solvedKeys.forEach(function (k) {
      var field = FIELDS.filter(function (f) { return f.key === k; })[0];
      field.input.classList.add('solved');
    });

    return { lines: lines, resultIndex: lines.length - 1 };
  }

  function update() {
    var values = readValues();
    var result = solve(values);
    LC.renderWorking(working, result.lines, result.resultIndex);
  }

  LC.wireLiveInputs([inputV, inputI, inputR, inputP], update);

  resetBtn.addEventListener('click', function () {
    [inputV, inputI, inputR, inputP].forEach(function (input) { input.value = ''; });
    update();
  });

  update();
})();
