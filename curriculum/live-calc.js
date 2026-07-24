/* live-calc.js — shared helpers for live-calculator interactive widgets.
   Page-specific formulas and data live in each page's own <page>.js file;
   this only provides the common wiring: formatting, inline field errors,
   and working-steps rendering, so every calculator behaves consistently. */
window.LiveCalc = (function () {
  'use strict';

  function fmt(n, digits) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    if (digits === undefined) digits = 3;
    var factor = Math.pow(10, digits);
    var r = Math.round(n * factor) / factor;
    return String(r);
  }

  function setFieldError(fieldEl, message) {
    fieldEl.classList.add('live-calc-field--error');
    var err = fieldEl.querySelector('.live-calc-field-error');
    if (err) err.textContent = message;
  }

  function clearFieldError(fieldEl) {
    fieldEl.classList.remove('live-calc-field--error');
    var err = fieldEl.querySelector('.live-calc-field-error');
    if (err) err.textContent = '';
  }

  function renderWorking(container, lines, resultIndex) {
    container.innerHTML = '';
    if (!lines || !lines.length) {
      var p = document.createElement('p');
      p.className = 'live-calc-working-line live-calc-placeholder';
      p.textContent = 'Fill in the fields above to see the working.';
      container.appendChild(p);
      return;
    }
    lines.forEach(function (line, i) {
      var el = document.createElement('p');
      el.className = 'live-calc-working-line' + (i === resultIndex ? ' live-calc-result' : '');
      el.textContent = line;
      container.appendChild(el);
    });
  }

  function wireLiveInputs(inputs, onChange) {
    inputs.forEach(function (input) {
      input.addEventListener('input', onChange);
      if (input.tagName === 'SELECT') input.addEventListener('change', onChange);
    });
  }

  return {
    fmt: fmt,
    setFieldError: setFieldError,
    clearFieldError: clearFieldError,
    renderWorking: renderWorking,
    wireLiveInputs: wireLiveInputs
  };
})();
