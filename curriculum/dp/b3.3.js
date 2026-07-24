/* b3.3.js — case study modals for B3.3 Mechanical Systems Application and Selection */
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

/* ── GEAR / VELOCITY-RATIO CALCULATOR (3.3.1) ────────────────── */
(function () {
  'use strict';
  var root = document.getElementById('calc-gear');
  if (!root || !window.LiveCalc) return;
  var LC = window.LiveCalc;

  var STAGE_COUNT = 3;
  var stages = [1, 2, 3].map(function (n) {
    return {
      n: n,
      wrap: document.querySelector('.live-calc-stage[data-stage="' + n + '"]'),
      driverField: document.getElementById('gear-field-driver-' + n),
      drivenField: document.getElementById('gear-field-driven-' + n),
      driver: document.getElementById('gear-driver-' + n),
      driven: document.getElementById('gear-driven-' + n)
    };
  });
  var addStageBtn = document.getElementById('gear-add-stage');
  var fieldN1 = document.getElementById('gear-field-n1');
  var fieldT1 = document.getElementById('gear-field-t1');
  var inputN1 = document.getElementById('gear-n1');
  var inputT1 = document.getElementById('gear-t1');
  var working = document.getElementById('gear-working');
  var resetBtn = document.getElementById('gear-reset');

  var visibleCount = 1;

  function refreshAddButtonVisibility() {
    addStageBtn.style.display = visibleCount >= STAGE_COUNT ? 'none' : '';
  }

  addStageBtn.addEventListener('click', function () {
    if (visibleCount >= STAGE_COUNT) return;
    visibleCount++;
    stages[visibleCount - 1].wrap.hidden = false;
    refreshAddButtonVisibility();
    update();
  });

  root.querySelectorAll('[data-remove-stage]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var n = parseInt(btn.dataset.removeStage, 10);
      var stage = stages[n - 1];
      stage.driver.value = '';
      stage.driven.value = '';
      LC.clearFieldError(stage.driverField);
      LC.clearFieldError(stage.drivenField);
      stage.wrap.hidden = true;
      visibleCount = n - 1;
      refreshAddButtonVisibility();
      update();
    });
  });

  function readStageRatios() {
    // Returns { ratio, lines[] } across all visible, fully-filled stages.
    // A stage with only one of its two fields filled gets an inline error
    // and is skipped rather than silently ignored.
    var ratio = 1;
    var lines = [];
    var anyComplete = false;

    for (var i = 0; i < visibleCount; i++) {
      var stage = stages[i];
      LC.clearFieldError(stage.driverField);
      LC.clearFieldError(stage.drivenField);
      var driverRaw = stage.driver.value.trim();
      var drivenRaw = stage.driven.value.trim();
      if (driverRaw === '' && drivenRaw === '') continue;

      var driver = parseFloat(driverRaw);
      var driven = parseFloat(drivenRaw);
      var driverOk = driverRaw !== '' && !isNaN(driver) && driver > 0;
      var drivenOk = drivenRaw !== '' && !isNaN(driven) && driven > 0;

      if (!driverOk) LC.setFieldError(stage.driverField, driverRaw === '' ? 'Needs both driver and driven' : 'Must be greater than 0');
      if (!drivenOk) LC.setFieldError(stage.drivenField, drivenRaw === '' ? 'Needs both driver and driven' : 'Must be greater than 0');
      if (!driverOk || !drivenOk) continue;

      var stageRatio = driven / driver;
      ratio *= stageRatio;
      anyComplete = true;
      var label = visibleCount > 1 ? 'Stage ' + stage.n + ': ' : '';
      lines.push(label + 'MA = ' + driven + ' / ' + driver + ' = ' + LC.fmt(stageRatio));
    }

    return { ratio: ratio, lines: lines, anyComplete: anyComplete };
  }

  function update() {
    var stageResult = readStageRatios();
    LC.clearFieldError(fieldN1);
    LC.clearFieldError(fieldT1);

    if (!stageResult.anyComplete) {
      LC.renderWorking(working, []);
      return;
    }

    var lines = stageResult.lines.slice();
    var ma = stageResult.ratio;
    var maLine = (stageResult.lines.length > 1 ? 'Overall MA = VR = ' : 'MA = VR = ') + LC.fmt(ma) +
      ' (MA and VR are equal here — an idealised system with no slip or friction loss; see 3.3.3 for how real efficiency changes this)';
    lines.push(maLine);
    var resultIndex = lines.length - 1;

    var n1Raw = inputN1.value.trim();
    if (n1Raw !== '') {
      var n1 = parseFloat(n1Raw);
      if (isNaN(n1) || n1 <= 0) {
        LC.setFieldError(fieldN1, 'Must be greater than 0');
      } else {
        var n2 = n1 / ma;
        lines.push('Output speed N₂ = N₁ / MA = ' + n1 + ' / ' + LC.fmt(ma) + ' = ' + LC.fmt(n2) + ' rpm');
        resultIndex = lines.length - 1;
      }
    }

    var t1Raw = inputT1.value.trim();
    if (t1Raw !== '') {
      var t1 = parseFloat(t1Raw);
      if (isNaN(t1) || t1 <= 0) {
        LC.setFieldError(fieldT1, 'Must be greater than 0');
      } else {
        var t2 = t1 * ma;
        lines.push('Output torque T₂ = T₁ × MA = ' + t1 + ' × ' + LC.fmt(ma) + ' = ' + LC.fmt(t2) + ' N·m');
        resultIndex = lines.length - 1;
      }
    }

    LC.renderWorking(working, lines, resultIndex);
  }

  var allInputs = [];
  stages.forEach(function (s) { allInputs.push(s.driver, s.driven); });
  allInputs.push(inputN1, inputT1);
  LC.wireLiveInputs(allInputs, update);

  resetBtn.addEventListener('click', function () {
    allInputs.forEach(function (input) { input.value = ''; });
    for (var i = 1; i < visibleCount; i++) stages[i].wrap.hidden = true;
    visibleCount = 1;
    refreshAddButtonVisibility();
    update();
  });

  refreshAddButtonVisibility();
  update();
})();
