/* b3.3.js — interactive widgets for B3.3 Mechanical Systems Application and Selection.
   Case-study modals and the .case-photo lightbox are handled globally
   by curriculum.js. */

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
