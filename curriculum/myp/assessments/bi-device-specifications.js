/* bi-device-specifications.js: builds the one landscape side, then
   prints or paints it. The six cards come from one template so they
   cannot drift apart. No teaching text lives here: the categories, the
   worked examples and the instructions are on the unit page and the
   task sheet, so this stays a worksheet. */
(function () {
  'use strict';

  var ROWS = 6;

  /* How far a field's text may be shrunk to make it fit before the
     rest is clipped. Below this it stops being readable on paper. */
  var MIN_FIT = 0.72;

  /* The nine categories, in the order the unit page lists them. The
     table there says what each one covers, so the labels here are kept
     short enough to read inside a dropdown. */
  var CATEGORIES = [
    'What it does',
    'Power',
    'Suits the client',
    'Talking to the user',
    'Size and shape',
    'Reliability',
    'Safety',
    'Cost',
    'Can you build it'
  ];

  /* Test methods. The first group is what Di will actually build, the
     last few are the ones students forget are available. */
  var METHODS = [
    'Timed trial, stopwatch',
    'Cold start test, no instructions given',
    'Measure the current, then run it flat',
    'Multimeter reading',
    'Log the sensor and count the misses',
    'Repeat the action and tally the failures',
    'Structured observation with a tally',
    'Questionnaire after use',
    'Interview with the client',
    'Measure it with a ruler or calipers',
    'Weigh it',
    'Add up the bill of materials',
    'Check against the catalog page',
    'Teacher or peer inspection'
  ];

  /* Where a specification came from. "Given" covers the two rules handed
     to every student, so a student cannot pass those off as their own
     research findings. */
  var SOURCES = [
    'Given, Rule 1 it decides on its own',
    'Given, Rule 2 runs on its own power',
    'Ai need statement',
    'Aii research finding',
    'Aiii design implication',
    'Client interview',
    'User observation',
    'Catalog part limit',
    'Material or budget limit'
  ];

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (ch) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[ch]; }); };

  function options(list, placeholder) {
    return '<option value="">' + esc(placeholder) + '</option>' +
      list.map(function (o) {
        return '<option value="' + esc(o) + '">' + esc(o) + '</option>';
      }).join('');
  }

  function card(n) {
    var p = 's' + n;
    return '' +
    '<div class="card" data-card="' + n + '">' +
      '<div class="card-top">' +
        '<span class="card-n">' + n + '</span>' +
        '<label class="fld"><span>Category</span>' +
          '<select id="' + p + '-cat" class="empty">' + options(CATEGORIES, 'Choose a category') + '</select></label>' +
        '<label class="fld"><span>Where it came from</span>' +
          '<select id="' + p + '-src" class="empty">' + options(SOURCES, 'Choose a source') + '</select></label>' +
      '</div>' +
      '<label class="fld"><span>The rule</span>' +
        '<input type="text" id="' + p + '-spec"></label>' +
      '<div class="card-two">' +
        '<label class="fld"><span>How I will know it passed</span>' +
          '<input type="text" id="' + p + '-crit"></label>' +
        '<label class="fld"><span>How I will test it</span>' +
          '<select id="' + p + '-test" class="empty">' + options(METHODS, 'Choose a method') + '</select></label>' +
      '</div>' +
      '<label class="why"><span>Why I chose this specification</span>' +
        '<textarea id="' + p + '-why" rows="2"></textarea></label>' +
    '</div>';
  }

  function sheet() {
    var cards = '';
    for (var i = 1; i <= ROWS; i++) cards += card(i);
    return '' +
    '<div class="sheet">' +
      '<div class="sheet-head">' +
        '<p class="sheet-title"><span class="sheet-code">Bi</span> Design Specifications</p>' +
        '<div class="ident">' +
          '<div class="f f-name"><label for="id-name">Name</label><input type="text" id="id-name"></div>' +
          '<div class="f f-date"><label for="id-date">Date</label><input type="text" id="id-date"></div>' +
          '<div class="f f-aud"><label for="id-aud">Client</label><input type="text" id="id-aud"></div>' +
        '</div>' +
      '</div>' +
      '<div class="cards">' + cards + '</div>' +
      '<div class="sheet-foot">' +
        '<span>edu.contrapaul.com / G10 electronics unit</span>' +
        '<span>Criteria Bi Assessment Worksheet</span>' +
      '</div>' +
    '</div>';
  }

  $('sheets').innerHTML = sheet();

  /* A card reads as written once it has a category and a specification,
     which is what colours its number and its left edge. */
  function refresh() {
    for (var n = 1; n <= ROWS; n++) {
      var done = $('s' + n + '-cat').value && $('s' + n + '-spec').value.trim();
      document.querySelector('[data-card="' + n + '"]').classList.toggle('filled', !!done);
    }
    /* A dropdown left on its placeholder stays grey, so an unfinished
       card reads as unfinished on paper as well as on screen. */
    Array.prototype.forEach.call(document.querySelectorAll('#sheets select'), function (s) {
      s.classList.toggle('empty', !s.value);
    });
    /* The download can only show what fits inside the box, so a field
       holding more than that is marked while there is still time to
       shorten it. */
    Array.prototype.forEach.call(document.querySelectorAll('#sheets input[type=text]'), function (i) {
      i.classList.toggle('over', i.scrollWidth > i.clientWidth + 1);
    });
  }

  /* ── saving ───────────────────────────────────────────────────────
     A lesson's work must not depend on the tab staying open. Every
     field has an id already, so the whole sheet stores as one
     id -> value map, written as the student types and read back before
     they see the page.
     ─────────────────────────────────────────────────────────────── */
  var KEY = 'bi-device-specifications-v1';
  var saveTimer = null;

  function fields() {
    return document.querySelectorAll('#sheets input, #sheets select, #sheets textarea');
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
      status('This browser will not save your work. Download the PNG before you close the tab.');
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

  function status(msg) {
    var n = $('savestate');
    if (n) n.textContent = msg;
  }

  restore();
  refresh();

  $('sheets').addEventListener('input', function () { refresh(); save(); });
  $('sheets').addEventListener('change', function () { refresh(); save(); });

  /* Typing debounces, so write straight out when the page goes away.
     pagehide is the one that fires reliably on iOS. */
  function flush() { if (saveTimer) writeNow(); }
  window.addEventListener('pagehide', flush);
  window.addEventListener('beforeunload', flush);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flush();
  });

  $('btn-clear').addEventListener('click', function () {
    if (!confirm('Clear the whole sheet? This cannot be undone.')) return;
    Array.prototype.forEach.call(fields(), function (i) { i.value = ''; });
    try { localStorage.removeItem(KEY); } catch (e) {}
    refresh();
    status('Cleared.');
  });

  $('btn-print').addEventListener('click', function () { window.print(); });

  /* ── PNG: the side painted from the live sheet ── */
  function paintSheet(c, sheet) {
    var base = sheet.getBoundingClientRect();
    var X = function (v) { return v - base.left; };
    var Y = function (v) { return v - base.top; };

    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, Math.round(base.width), Math.round(base.height));

    Array.prototype.forEach.call(sheet.querySelectorAll('*'), function (el) {
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

      var bg = cs.backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' &&
          el.tagName !== 'INPUT' && el.tagName !== 'SELECT' && el.tagName !== 'TEXTAREA' &&
          !el.classList.contains('sheet')) {
        c.fillStyle = bg;
        c.fillRect(X(r.left), Y(r.top), r.width, r.height);
      }

      if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
        if (!el.value) return;
        var text = el.tagName === 'SELECT' ? el.options[el.selectedIndex].text : el.value;
        c.fillStyle = cs.color;
        var fs = parseFloat(cs.fontSize);
        var padL = parseFloat(cs.paddingLeft) || 0, padR = parseFloat(cs.paddingRight) || 0;
        var padT = parseFloat(cs.paddingTop) || 0, padB = parseFloat(cs.paddingBottom) || 0;
        var bdT = parseFloat(cs.borderTopWidth) || 0, bdB = parseFloat(cs.borderBottomWidth) || 0;
        var maxW = r.width - padL - padR;

        /* A browser clips whatever overflows an input and lets the field
           scroll. Canvas does neither, so a long entry used to paint
           straight across the sheet and over the card beside it. Shrink
           a little first, which rescues anything close to fitting, then
           clip, so nothing can be drawn outside the field whatever the
           student typed. */
        var scale = 1;
        c.font = cs.fontWeight + ' ' + fs + 'px ' + cs.fontFamily;
        if (c.measureText(text).width > maxW) {
          while (scale > MIN_FIT) {
            scale -= 0.02;
            c.font = cs.fontWeight + ' ' + (fs * scale) + 'px ' + cs.fontFamily;
            if (c.measureText(text).width <= maxW) break;
          }
        }

        /* A browser centres text inside an input's content box, so a
           tall cell and a short writing line both land right. */
        var contentH = r.height - bdT - bdB - padT - padB;
        c.save();
        c.beginPath();
        c.rect(X(r.left) + padL, Y(r.top), maxW, r.height);
        c.clip();
        c.fillText(text,
          X(r.left) + padL,
          Y(r.top) + bdT + padT + contentH / 2 + (fs * scale) * 0.35);
        c.restore();
        return;
      }

      if (el.tagName === 'TEXTAREA' && el.value) {
        c.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        c.fillStyle = cs.color;
        var size = parseFloat(cs.fontSize);
        var lh = parseFloat(cs.lineHeight) || size * 1.5;
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
          c.fillText(ln, X(r.left) + padL, Y(r.top) + pT + lh * (i + 0.78));
        });
      }
    });

    /* Glyphs, drawn where the browser already put them. */
    var walker = document.createTreeWalker(sheet, NodeFilter.SHOW_TEXT, null);
    var range = document.createRange(), node;
    while ((node = walker.nextNode())) {
      var text = node.textContent;
      if (!text.trim()) continue;
      var parent = node.parentElement;
      if (parent.tagName === 'OPTION' || parent.tagName === 'TEXTAREA') continue;
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

  function png() {
    var el = document.querySelector('.sheet');
    var w = Math.round(el.getBoundingClientRect().width);
    var h = Math.round(el.getBoundingClientRect().height);
    var S = 2;                                  // ~192dpi keeps the file sane

    var cv = document.createElement('canvas');
    cv.width = w * S; cv.height = h * S;
    var c = cv.getContext('2d');
    c.scale(S, S);
    paintSheet(c, el);

    var who = $('id-name').value.trim();
    var a = document.createElement('a');
    a.download = 'Bi design specifications' + (who ? ' - ' + who.replace(/[\\/:*?"<>|]/g, '') : '') + '.png';
    a.href = cv.toDataURL('image/png');
    a.click();
  }

  $('btn-png').addEventListener('click', png);
})();
