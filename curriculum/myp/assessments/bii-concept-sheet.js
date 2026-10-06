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

  /* ── PNG: the sheet painted from the live page ────────────────────
     Same approach as the other assessment sheets. The two grid fields
     are drawn as real lines here rather than read off a background,
     which is also why the sheet prints cleanly. ─────────────────── */
  var GRID = '#e3e7ed';

  function paintSheet(c, sheet) {
    var base = sheet.getBoundingClientRect();
    var X = function (v) { return v - base.left; };
    var Y = function (v) { return v - base.top; };

    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, Math.round(base.width), Math.round(base.height));

    Array.prototype.forEach.call(sheet.querySelectorAll('*'), function (el) {
      if (el.tagName === 'svg' || el.closest('svg')) return;   // grids drawn below
      var cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      var r = el.getBoundingClientRect();
      if (!r.width) return;

      ['Top','Right','Bottom','Left'].forEach(function (side) {
        var w = parseFloat(cs['border' + side + 'Width']) || 0;
        if (!w || cs['border' + side + 'Style'] === 'none') return;
        c.strokeStyle = cs['border' + side + 'Color'];
        c.lineWidth = w;
        c.beginPath();
        if (side === 'Bottom')      { c.moveTo(X(r.left), Y(r.bottom) - w/2); c.lineTo(X(r.right), Y(r.bottom) - w/2); }
        else if (side === 'Top')    { c.moveTo(X(r.left), Y(r.top) + w/2);    c.lineTo(X(r.right), Y(r.top) + w/2); }
        else if (side === 'Left')   { c.moveTo(X(r.left) + w/2, Y(r.top));    c.lineTo(X(r.left) + w/2, Y(r.bottom)); }
        else                        { c.moveTo(X(r.right) - w/2, Y(r.top));   c.lineTo(X(r.right) - w/2, Y(r.bottom)); }
        c.stroke();
      });

      /* The ruled lines inside a text box, drawn where the CSS tile
         puts them so a typed answer sits on a line either way. */
      if (el.tagName === 'TEXTAREA') {
        var lh = parseFloat(cs.lineHeight) || 17;
        c.strokeStyle = '#e4e7ec';
        c.lineWidth = 1;
        for (var y = r.top + 3 + lh; y < r.bottom; y += lh) {
          c.beginPath();
          c.moveTo(X(r.left), Math.round(Y(y)) + 0.5);
          c.lineTo(X(r.right), Math.round(Y(y)) + 0.5);
          c.stroke();
        }
      }

      if (el.tagName === 'INPUT') {
        if (!el.value) return;
        c.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        c.fillStyle = cs.color;
        var fs = parseFloat(cs.fontSize);
        var padT = parseFloat(cs.paddingTop) || 0, padB = parseFloat(cs.paddingBottom) || 0;
        var bdT = parseFloat(cs.borderTopWidth) || 0, bdB = parseFloat(cs.borderBottomWidth) || 0;
        var contentH = r.height - bdT - bdB - padT - padB;
        var centred = cs.textAlign === 'center';
        c.textAlign = centred ? 'center' : 'left';
        c.fillText(el.value,
          centred ? X(r.left) + r.width / 2 : X(r.left) + (parseFloat(cs.paddingLeft) || 0),
          Y(r.top) + bdT + padT + contentH / 2 + fs * 0.35);
        c.textAlign = 'left';
        return;
      }

      if (el.tagName === 'TEXTAREA' && el.value) {
        c.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        c.fillStyle = cs.color;
        var tlh = parseFloat(cs.lineHeight) || 17;
        var padL = parseFloat(cs.paddingLeft) || 0, padR = parseFloat(cs.paddingRight) || 0;
        var pT = parseFloat(cs.paddingTop) || 0;
        var maxW = r.width - padL - padR;
        /* Wrap by hand, because canvas has no textarea reflow. */
        var words = el.value.split(/\s+/), line = '', lines = [];
        words.forEach(function (w) {
          var test = line ? line + ' ' + w : w;
          if (c.measureText(test).width > maxW && line) { lines.push(line); line = w; }
          else line = test;
        });
        if (line) lines.push(line);
        lines.forEach(function (ln, i) {
          c.fillText(ln, X(r.left) + padL, Y(r.top) + pT + tlh * (i + 0.78));
        });
      }
    });

    /* The sketch and core loop grids. */
    Array.prototype.forEach.call(sheet.querySelectorAll('.field'), function (f) {
      var r = f.getBoundingClientRect();
      c.save();
      c.beginPath();
      c.rect(X(r.left), Y(r.top), r.width, r.height);
      c.clip();
      c.strokeStyle = GRID;
      c.lineWidth = 1;
      for (var x = 0; x <= r.width; x += 16) {
        c.beginPath();
        c.moveTo(Math.round(X(r.left) + x) + 0.5, Y(r.top));
        c.lineTo(Math.round(X(r.left) + x) + 0.5, Y(r.bottom));
        c.stroke();
      }
      for (var y = 0; y <= r.height; y += 16) {
        c.beginPath();
        c.moveTo(X(r.left), Math.round(Y(r.top) + y) + 0.5);
        c.lineTo(X(r.right), Math.round(Y(r.top) + y) + 0.5);
        c.stroke();
      }
      c.restore();
    });

    /* Glyphs, drawn where the browser already put them. */
    var walker = document.createTreeWalker(sheet, NodeFilter.SHOW_TEXT, null);
    var range = document.createRange(), node;
    while ((node = walker.nextNode())) {
      var text = node.textContent;
      if (!text.trim()) continue;
      var parent = node.parentElement;
      if (parent.tagName === 'TEXTAREA' || parent.closest('svg')) continue;
      var pcs = getComputedStyle(parent);
      if (pcs.display === 'none' || pcs.visibility === 'hidden') continue;
      c.font = pcs.fontWeight + ' ' + pcs.fontSize + ' ' + pcs.fontFamily;
      c.fillStyle = pcs.color;
      var upper = pcs.textTransform === 'uppercase';
      var desc = parseFloat(pcs.fontSize) * 0.22;
      for (var i = 0; i < text.length; i++) {
        if (text[i] === ' ') continue;
        range.setStart(node, i); range.setEnd(node, i + 1);
        var cr = range.getBoundingClientRect();
        if (!cr.width) continue;
        c.fillText(upper ? text[i].toUpperCase() : text[i], X(cr.left), Y(cr.bottom) - desc);
      }
    }
  }

  $('btn-png').addEventListener('click', function () {
    var el = document.querySelector('.sheet');
    var w = Math.round(el.getBoundingClientRect().width);
    var h = Math.round(el.getBoundingClientRect().height);
    var S = 2;                                  // ~192dpi on A3 keeps the file sane

    var cv = document.createElement('canvas');
    cv.width = w * S; cv.height = h * S;
    var c = cv.getContext('2d');
    c.scale(S, S);
    paintSheet(c, el);

    var who = $('tb-name').value.trim();
    var no = $('tb-no').value.trim();
    var a = document.createElement('a');
    a.download = 'Bii concept sheet' + (no ? ' ' + no : '') +
                 (who ? ' - ' + who.replace(/[\\/:*?"<>|]/g, '') : '') + '.png';
    a.href = cv.toDataURL('image/png');
    a.click();
  });
})();
