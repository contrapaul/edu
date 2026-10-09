/* b2.1.js — the SCAMPER and Six Thinking Hats examples in 2.1.10.
   Case-study modals and the .case-photo image lightbox are handled
   globally by curriculum.js. */
(function () {
  'use strict';

  /* Both widgets are tab lists: click or arrow keys switch the panel
     below, and every panel is in the HTML, so the first one shows even
     without this. The hats also switch on hover, and the last hat
     pointed at stays chosen. */
  function tabs(box, tabSel, onHover) {
    var list = Array.prototype.slice.call(box.querySelectorAll(tabSel));

    function select(tab, focus) {
      list.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).classList.toggle('is-active', on);
      });
      if (focus) tab.focus();
    }

    list.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      if (onHover) tab.addEventListener('mouseenter', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        /* in presentation mode the arrow keys belong to the deck */
        if (box.closest('.ps-overlay')) return;
        var n = list.length, next = null;
        if (e.key === 'ArrowRight') next = list[(i + 1) % n];
        else if (e.key === 'ArrowLeft') next = list[(i - 1 + n) % n];
        else if (e.key === 'Home') next = list[0];
        else if (e.key === 'End') next = list[n - 1];
        if (next) { e.preventDefault(); e.stopPropagation(); select(next, true); }
      });
    });
  }

  document.querySelectorAll('.scamper').forEach(function (box) { tabs(box, '.scamper-tab', false); });
  document.querySelectorAll('.hats').forEach(function (box) { tabs(box, '.hat-tab', true); });
})();
