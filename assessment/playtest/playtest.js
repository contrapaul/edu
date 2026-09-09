/* playtest.js: fills in the sheet, prints it, and draws it to a PNG.
   The PNG is drawn by hand rather than screenshotted, so it stays sharp
   at any size and needs nothing loaded from outside this repo. */
(function () {
  'use strict';

  var FAMILIES = [
    'Turn order', 'Movement', 'Chance', 'Cards', 'Resources',
    'Combat', 'Hidden info', 'Fairness', 'Progress', 'Goals'
  ];

  var TESTS = [
    { id: 't-coin',   q: '<b>Coin flip.</b> Would picking at random have done as well?', hint: 'If yes, the choice was fake' },
    { id: 't-dom',    q: '<b>Same move.</b> Did everyone pick the same option?',          hint: 'Which option, and when' },
    { id: 't-why',    q: '<b>Explain back.</b> Could you say why you chose?',             hint: 'Your reason, in a few words' },
    { id: 't-regret', q: '<b>Regret.</b> Did you wish you had played differently?',       hint: 'The moment' }
  ];

  var $ = function (id) { return document.getElementById(id); };

  /* ── build the repeated bits ── */
  var famsEl = $('fams');
  FAMILIES.forEach(function (name, i) {
    var id = 'fam-' + i;
    var l = document.createElement('label');
    l.className = 'cb';
    l.setAttribute('for', id);
    l.innerHTML = '<input type="checkbox" id="' + id + '" data-fam="' + name + '"><span>' + name + '</span>';
    famsEl.appendChild(l);
  });

  var testsEl = $('tests');
  TESTS.forEach(function (t) {
    var row = document.createElement('div');
    row.className = 'test';
    row.innerHTML =
      '<span class="test-q">' + t.q + '</span>' +
      '<span class="yn">' +
        '<label><input type="radio" name="' + t.id + '" value="yes">Y</label>' +
        '<label><input type="radio" name="' + t.id + '" value="no">N</label>' +
      '</span>' +
      '<input type="text" id="' + t.id + '-note">';
    testsEl.appendChild(row);
  });

  /* ── reading the sheet ── */
  function val(id) { var e = $(id); return e ? e.value.trim() : ''; }
  /* Keep the footer showing the game name, so a printed stack is sortable. */
  function syncFoot() { $('foot-game').textContent = val('f-game'); }
  $('f-game').addEventListener('input', syncFoot);

  /* ── clear ── */
  $('btn-clear').addEventListener('click', function () {
    if (!confirm('Clear the whole sheet?')) return;
    document.querySelectorAll('#sheet input[type=text]').forEach(function (i) { i.value = ''; });
    document.querySelectorAll('#sheet input[type=checkbox]').forEach(function (i) { i.checked = false; });
    document.querySelectorAll('#sheet input[type=radio]').forEach(function (i) { i.checked = false; });
    syncFoot();
    $('f-game').focus();
  });

  $('btn-print').addEventListener('click', function () { window.print(); });

  /* ── PNG ──────────────────────────────────────────────────────
     Painted from the live sheet rather than from a second copy of the
     layout. Every glyph is drawn at the position the browser already
     worked out, so the PNG cannot drift away from what the student sees
     and nothing external is loaded. */
  var ACC = '#1a5cb8', LINE = '#c8cdd6';

  function png() {
    var sheet = $('sheet');
    var base = sheet.getBoundingClientRect();
    var W = Math.round(base.width), H = Math.round(base.height), S = 3;

    var cv = document.createElement('canvas');
    cv.width = W * S; cv.height = H * S;
    var c = cv.getContext('2d');
    c.scale(S, S);
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, W, H);

    var X = function (v) { return v - base.left; };
    var Y = function (v) { return v - base.top; };

    /* 1. Rules, boxes and field values, taken from what the CSS drew. */
    Array.prototype.forEach.call(sheet.querySelectorAll('*'), function (el) {
      var cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      var r = el.getBoundingClientRect();
      if (!r.width) return;

      /* Ticks and dials get drawn as shapes below, so their own border
         must not also be painted as a rule across the bottom. */
      var isControl = el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio');
      var bw = isControl ? 0 : (parseFloat(cs.borderBottomWidth) || 0);
      if (bw > 0 && cs.borderBottomStyle !== 'none') {
        c.strokeStyle = cs.borderBottomColor;
        c.lineWidth = bw;
        c.beginPath();
        c.moveTo(X(r.left), Y(r.bottom) - bw / 2);
        c.lineTo(X(r.right), Y(r.bottom) - bw / 2);
        c.stroke();
      }

      if (el.tagName !== 'INPUT') return;

      if (el.type === 'checkbox') {
        var on = el.checked;
        c.lineWidth = 1.4;
        c.strokeStyle = on ? ACC : LINE;
        c.fillStyle = on ? ACC : '#ffffff';
        c.beginPath(); c.roundRect(X(r.left), Y(r.top), r.width, r.height, 2.5);
        c.fill(); c.stroke();
        if (on) {
          c.strokeStyle = '#ffffff'; c.lineWidth = 1.7;
          c.beginPath();
          c.moveTo(X(r.left) + r.width * 0.26, Y(r.top) + r.height * 0.52);
          c.lineTo(X(r.left) + r.width * 0.44, Y(r.top) + r.height * 0.72);
          c.lineTo(X(r.left) + r.width * 0.76, Y(r.top) + r.height * 0.28);
          c.stroke();
        }
      } else if (el.type === 'radio') {
        var sel = el.checked;
        c.strokeStyle = sel ? ACC : LINE;
        c.lineWidth = sel ? 3 : 1.4;
        c.beginPath();
        c.arc(X(r.left) + r.width / 2, Y(r.top) + r.height / 2, r.width / 2 - (sel ? 1.5 : 0.7), 0, Math.PI * 2);
        c.stroke();
      } else if (el.value) {
        c.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        c.fillStyle = cs.color;
        var fs = parseFloat(cs.fontSize);
        /* A browser centres text inside an input's content box. */
        var padT = parseFloat(cs.paddingTop) || 0, padB = parseFloat(cs.paddingBottom) || 0;
        var bdT = parseFloat(cs.borderTopWidth) || 0, bdB = parseFloat(cs.borderBottomWidth) || 0;
        var contentH = r.height - bdT - bdB - padT - padB;
        var baseline = Y(r.top) + bdT + padT + contentH / 2 + fs * 0.35;
        var centred = cs.textAlign === 'center';
        c.textAlign = centred ? 'center' : 'left';
        c.fillText(el.value,
                   centred ? X(r.left) + r.width / 2 : X(r.left) + (parseFloat(cs.paddingLeft) || 0),
                   baseline);
        c.textAlign = 'left';
      }
    });

    /* 2. Every glyph, drawn where the browser put it. This carries
          wrapping, letter spacing and uppercasing for free. */
    var walker = document.createTreeWalker(sheet, NodeFilter.SHOW_TEXT, null);
    var range = document.createRange();
    var node;
    while ((node = walker.nextNode())) {
      var text = node.textContent;
      if (!text.trim()) continue;
      var pcs = getComputedStyle(node.parentElement);
      if (pcs.display === 'none' || pcs.visibility === 'hidden') continue;

      c.font = pcs.fontWeight + ' ' + pcs.fontSize + ' ' + pcs.fontFamily;
      c.fillStyle = pcs.color;
      var upper = pcs.textTransform === 'uppercase';
      var descent = parseFloat(pcs.fontSize) * 0.22;

      for (var i = 0; i < text.length; i++) {
        if (text[i] === ' ') continue;
        range.setStart(node, i); range.setEnd(node, i + 1);
        var cr = range.getBoundingClientRect();
        if (!cr.width) continue;
        c.fillText(upper ? text[i].toUpperCase() : text[i], X(cr.left), Y(cr.bottom) - descent);
      }
    }

    var game = val('f-game');
    var a = document.createElement('a');
    a.download = 'Playtest sheet' + (game ? ' - ' + game.replace(/[\\/:*?"<>|]/g, '') : '') + '.png';
    a.href = cv.toDataURL('image/png');
    a.click();
  }

  $('btn-png').addEventListener('click', png);
  syncFoot();
})();
