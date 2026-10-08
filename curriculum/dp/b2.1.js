/* b2.1.js — the SCAMPER example in 2.1.10.
   Case-study modals and the .case-photo image lightbox are handled
   globally by curriculum.js. */
(function () {
  'use strict';

  /* SCAMPER letters: a tab list. Click or arrow keys switch the example
     below; every panel is in the HTML, so S shows even without this. */
  document.querySelectorAll('.scamper').forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('.scamper-tab'));

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).classList.toggle('is-active', on);
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        /* in presentation mode the arrow keys belong to the deck */
        if (box.closest('.ps-overlay')) return;
        var n = tabs.length, next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % n];
        else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + n) % n];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[n - 1];
        if (next) { e.preventDefault(); e.stopPropagation(); select(next, true); }
      });
    });
  });
})();
