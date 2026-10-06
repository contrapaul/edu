/* bii-concept-sheet.js: saving, clearing and printing for the A3
   concept sheet. The sheet itself is static markup, because there is
   only one of it and the important parts are drawn by hand. All this
   does is make sure a concept started on a laptop is still there after
   the tab closes, and that printing gives a clean sheet. */
(function () {
  'use strict';

  var KEY = 'bii-concept-sheet-v1';
  var $ = function (id) { return document.getElementById(id); };
  var saveTimer = null;

  function fields() {
    return document.querySelectorAll('.sheet input, .sheet textarea');
  }

  function status(msg) {
    var n = $('savestate');
    if (n) n.textContent = msg;
  }

  function writeNow() {
    clearTimeout(saveTimer);
    saveTimer = null;
    var out = {};
    Array.prototype.forEach.call(fields(), function (i) {
      if (i.value) out[i.id] = i.value;
    });
    try {
      localStorage.setItem(KEY, JSON.stringify(out));
      return true;
    } catch (e) {
      status('This browser will not save your work. Print the sheet before you close the tab.');
      return false;
    }
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      if (writeNow()) status('Saved in this browser.');
    }, 300);
  }

  function restore() {
    var raw;
    try { raw = localStorage.getItem(KEY); } catch (e) { return; }
    if (!raw) return;
    var got;
    try { got = JSON.parse(raw); } catch (e) { return; }
    Array.prototype.forEach.call(fields(), function (i) {
      if (i.id in got) i.value = got[i.id];
    });
    status('Picked up where you left off.');
  }

  restore();

  document.querySelector('.sheet').addEventListener('input', save);
  document.querySelector('.sheet').addEventListener('change', save);

  /* Typing debounces, so write straight out when the page goes away.
     pagehide is the one that fires reliably on iOS. */
  function flush() { if (saveTimer) writeNow(); }
  window.addEventListener('pagehide', flush);
  window.addEventListener('beforeunload', flush);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flush();
  });

  /* One sheet per concept, so the stored copy is cleared between
     concepts rather than carried from one to the next by accident. */
  $('btn-clear').addEventListener('click', function () {
    if (!confirm('Clear this sheet? Do this between concepts, once the last one is printed.')) return;
    Array.prototype.forEach.call(fields(), function (i) { i.value = ''; });
    try { localStorage.removeItem(KEY); } catch (e) {}
    status('Cleared.');
  });

  $('btn-print').addEventListener('click', function () { window.print(); });
})();
