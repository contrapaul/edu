/* bi-specifications.js: builds the four sides, then prints or paints them.
   The twelve specification cards come from one template so they cannot
   drift apart. The coverage checklist on page 1 reads the category
   dropdowns, so a student can see which required category they have not
   written for yet without counting by hand. */
(function () {
  'use strict';

  var ROWS = 12, PER_PAGE = 4;

  /* The nine required categories from the unit page, in the order they
     are listed there. Meaningful choice and playtime carry the two
     non-negotiables, so they are marked required-by-rule and the
     checklist draws their box in the warning colour until they are met. */
  var CATEGORIES = [
    { id: 'audience',   label: 'Audience fit' },
    { id: 'choice',     label: 'Meaningful choice', rule: true },
    { id: 'playtime',   label: 'Playtime',          rule: true },
    { id: 'rules',      label: 'Rules clarity' },
    { id: 'components', label: 'Components and materials' },
    { id: 'balance',    label: 'Balance and fairness' },
    { id: 'aesthetics', label: 'Aesthetics' },
    { id: 'access',     label: 'Accessibility' },
    { id: 'cost',       label: 'Cost' }
  ];

  /* Test methods. The first group is what Di will actually build, the
     last two are the ones students forget are available. */
  var METHODS = [
    'Timed user trial, stopwatch',
    'Structured observation with a tally',
    'Cold read: watch a group learn it',
    'Explain back test during play',
    'Questionnaire after play',
    'Interview with the client',
    'Measure the components',
    'Count or weigh the parts',
    'Add up the bill of materials',
    'Simulate the draws or rolls',
    'Check against an accessibility list',
    'Teacher or peer inspection'
  ];

  /* Where a specification came from. "Given" covers the two rules that
     are handed to every team, so a student cannot claim those as
     research-driven findings. */
  var SOURCES = [
    'Given, Rule 1 meaningful choices',
    'Given, Rule 2 fits a recess',
    'Ai need statement',
    'Aii research finding',
    'Aiii design implication',
    'Client interview',
    'Audience observation',
    'Material or budget limit'
  ];

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (ch) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[ch]; }); };

  function options(list, placeholder) {
    return '<option value="">' + esc(placeholder) + '</option>' +
      list.map(function (o) {
        var v = typeof o === 'string' ? o : o.id;
        var t = typeof o === 'string' ? o : o.label;
        return '<option value="' + esc(v) + '">' + esc(t) + '</option>';
      }).join('');
  }

  function foot(right) {
    return '<div class="sheet-foot"><span>edu.contrapaul.com / G9 tabletop</span><span>' + esc(right) + '</span></div>';
  }

  /* ── a specification card ── */
  function card(n) {
    var p = 's' + n;
    return '' +
    '<div class="card" data-card="' + n + '">' +
      '<div class="card-top">' +
        '<span class="card-n">' + n + '</span>' +
        '<label class="fld"><span>Category</span>' +
          '<select id="' + p + '-cat" class="empty" data-cat>' + options(CATEGORIES, 'Choose a category') + '</select></label>' +
        '<label class="fld"><span>Where it came from</span>' +
          '<select id="' + p + '-src" class="empty">' + options(SOURCES, 'Choose a source') + '</select></label>' +
      '</div>' +
      '<label class="fld"><span>The specification</span>' +
        '<input type="text" id="' + p + '-spec"></label>' +
      '<div class="card-two">' +
        '<label class="fld"><span>Measurable success criterion</span>' +
          '<input type="text" id="' + p + '-crit"></label>' +
        '<label class="fld"><span>How it will be tested</span>' +
          '<select id="' + p + '-test" class="empty">' + options(METHODS, 'Choose a method') + '</select></label>' +
      '</div>' +
      '<label class="why"><span class="fld-lab">Why I chose this specification</span>' +
        '<textarea id="' + p + '-why" rows="2"></textarea></label>' +
    '</div>';
  }

  /* ── page 1, the brief and the coverage checklist ── */
  function coverPage() {
    var cov = CATEGORIES.map(function (c) {
      return '<div class="cov-item' + (c.rule ? ' req' : '') + '" data-cov="' + c.id + '">' +
             '<span class="cov-box"></span><span>' + esc(c.label) + '</span>' +
             '<span class="cov-n" data-covn="' + c.id + '"></span></div>';
    }).join('');

    return '' +
    '<div class="sheet" data-page="1">' +
      '<div class="sheet-head">' +
        '<p class="sheet-title">Design Specifications</p>' +
        '<p class="sheet-sub">Criterion Bi / success criteria for the game</p>' +
        '<p class="pagenum">Page 1 of 4</p>' +
      '</div>' +

      '<div class="row3">' +
        '<div class="f"><label for="id-name">Name</label><input type="text" id="id-name"></div>' +
        '<div class="f"><label for="id-team">Team</label><input type="text" id="id-team"></div>' +
        '<div class="f"><label for="id-date">Date</label><input type="text" id="id-date"></div>' +
      '</div>' +
      '<div class="row3" style="grid-template-columns:1fr">' +
        '<div class="f"><label for="id-aud">Target audience</label><input type="text" id="id-aud"></div>' +
      '</div>' +

      '<h2>What you have to do <span class="sec-note">Bi, one class.</span></h2>' +
      '<ol class="todo-list">' +
        '<li>Use this tool to build your specifications, then hand in the PNG or the printed pages.</li>' +
        '<li>Choose specifications that cover every required category and that suit <b>your</b> target audience, not games in general.</li>' +
        '<li>Every specification has to be testable.</li>' +
        '<li>Write a short reason for each one, naming the research it came from.</li>' +
      '</ol>' +

      '<h2>What makes a specification <span class="sec-note">All four parts, every time.</span></h2>' +
      '<p class="rules">A specification says what the game must do. A <b>success criterion</b> says the number that ' +
      'proves it. A <b>test</b> says how you will get that number. A <b>reason</b> says which piece of your own ' +
      'research put it there. Miss any one of the four and Dii has nothing to evaluate against.</p>' +
      '<table class="eg">' +
        '<thead><tr><th style="width:31%">Specification</th><th style="width:34%">Measurable success criterion</th><th>How it will be tested</th></tr></thead>' +
        '<tbody>' +
          '<tr><td>Plays inside one recess</td><td>Setup to pack away under 25 minutes</td><td>Timed user trial, 3 groups</td></tr>' +
          '<tr><td>Players make real decisions</td><td>Testers explain why they chose in 4 of 5 sampled turns</td><td>Explain back test during play</td></tr>' +
          '<tr><td class="bad">The game is fun</td><td class="bad">No number, so there is nothing to measure</td><td class="bad">Nothing can test this</td></tr>' +
        '</tbody>' +
      '</table>' +

      '<h2>Testable means you could actually run it <span class="sec-note">Simple or hard, both count.</span></h2>' +
      '<p class="rules">Testing can be as simple as putting a ruler against a box, and as complicated as simulating ' +
      'thousands of card draws or dice rolls to see whether one strategy always wins. Both are tests. What is not ' +
      'a test is an opinion you collect and cannot count.</p>' +

      '<h2>Category coverage <span class="sec-note">At least one specification in each.</span></h2>' +
      '<p class="rules">The two outlined boxes are the non-negotiables. A game that misses either one cannot reach ' +
      'the top band, so they are not optional however well the rest is written.</p>' +
      '<div class="cov">' + cov + '</div>' +
      '<p class="tally">Specifications written <b id="tally-n">0</b> ' +
        '<span id="tally-msg">Eight is the minimum, twelve is the most that fit.</span></p>' +

      foot('Coverage') +
    '</div>';
  }

  function specPage(page) {
    var first = (page - 2) * PER_PAGE + 1;
    var cards = '';
    for (var i = first; i < first + PER_PAGE; i++) cards += card(i);
    return '' +
    '<div class="sheet" data-page="' + page + '">' +
      '<div class="sheet-head">' +
        '<p class="sheet-title">Specifications ' + first + ' to ' + (first + PER_PAGE - 1) + '</p>' +
        '<p class="sheet-sub">Criterion Bi / success criteria for the game</p>' +
        '<p class="pagenum">Page ' + page + ' of 4</p>' +
      '</div>' +
      '<div class="cards">' + cards + '</div>' +
      foot('Specifications ' + first + ' to ' + (first + PER_PAGE - 1)) +
    '</div>';
  }

  $('sheets').innerHTML = coverPage() + specPage(2) + specPage(3) + specPage(4);

  /* ── coverage, recalculated from the cards ─────────────────────
     A card counts as written once it has a category and a specification
     on it. Counting a bare dropdown would let a student tick all nine
     categories without writing anything. */
  function cardWritten(n) {
    var cat = $('s' + n + '-cat').value;
    var spec = $('s' + n + '-spec').value.trim();
    return cat && spec ? cat : null;
  }

  function refresh() {
    var counts = {}, total = 0;
    for (var n = 1; n <= ROWS; n++) {
      var cat = cardWritten(n);
      var el = document.querySelector('[data-card="' + n + '"]');
      el.classList.toggle('filled', !!cat);
      if (!cat) continue;
      counts[cat] = (counts[cat] || 0) + 1;
      total++;
    }

    CATEGORIES.forEach(function (c) {
      var row = document.querySelector('[data-cov="' + c.id + '"]');
      var n = counts[c.id] || 0;
      row.classList.toggle('done', n > 0);
      document.querySelector('[data-covn="' + c.id + '"]').textContent = n ? '×' + n : '';
    });

    $('tally-n').textContent = total;
    var missing = CATEGORIES.filter(function (c) { return !counts[c.id]; });
    var msg = $('tally-msg');
    msg.classList.remove('short');
    if (total < 8) {
      msg.textContent = 'Eight is the minimum. ' + (8 - total) + ' to go.';
      msg.classList.add('short');
    } else if (missing.length) {
      msg.textContent = missing.length + ' categor' + (missing.length === 1 ? 'y' : 'ies') +
                        ' still empty: ' + missing.map(function (c) { return c.label; }).join(', ') + '.';
      msg.classList.add('short');
    } else {
      msg.textContent = 'Every category covered. Check each reason names your own research.';
    }

    /* A dropdown left on its placeholder stays grey, so an unfinished
       card reads as unfinished on paper as well as on screen. */
    Array.prototype.forEach.call(document.querySelectorAll('#sheets select'), function (s) {
      s.classList.toggle('empty', !s.value);
    });
  }

  /* ── saving ───────────────────────────────────────────────────────
     Four sides is more than one lesson's work, so nothing here may
     depend on the tab staying open. Every field has an id already, so
     the whole sheet stores as one id -> value map, written as the
     student types and read back before they see the page.
     ─────────────────────────────────────────────────────────────── */
  var KEY = 'bi-specifications-v1';
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

  /* One listener on the container, so fields added later still save. */
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

  /* ── clear ── */
  $('btn-clear').addEventListener('click', function () {
    if (!confirm('Clear all four pages? This cannot be undone.')) return;
    Array.prototype.forEach.call(fields(), function (i) { i.value = ''; });
    try { localStorage.removeItem(KEY); } catch (e) {}
    refresh();
    status('Cleared.');
  });

  $('btn-print').addEventListener('click', function () { window.print(); });

  /* ── PNG: all four sides stacked into one file ── */
  var ACC = '#7a2c4e', LINE = '#c8cdd6', GAP = 24;

  function paintSheet(c, sheet, offsetY) {
    var base = sheet.getBoundingClientRect();
    var X = function (v) { return v - base.left; };
    var Y = function (v) { return v - base.top + offsetY; };

    c.fillStyle = '#ffffff';
    c.fillRect(0, offsetY, Math.round(base.width), Math.round(base.height));

    Array.prototype.forEach.call(sheet.querySelectorAll('*'), function (el) {
      var cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      var r = el.getBoundingClientRect();
      if (!r.width) return;

      /* Coverage ticks are drawn as shapes below, so their own border
         must not also be painted as a box here. */
      var isTick = el.classList.contains('cov-box');

      ['Top','Right','Bottom','Left'].forEach(function (side) {
        if (isTick) return;
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

      /* cell shading, used by the example table head and the filled
         card numbers */
      var bg = cs.backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && !isTick &&
          el.tagName !== 'INPUT' && el.tagName !== 'SELECT' && el.tagName !== 'TEXTAREA' &&
          !el.classList.contains('sheet')) {
        c.fillStyle = bg;
        c.fillRect(X(r.left), Y(r.top), r.width, r.height);
      }

      if (isTick) {
        var on = el.parentElement.classList.contains('done');
        c.lineWidth = 1.4;
        c.strokeStyle = on ? ACC : LINE;
        c.fillStyle = on ? ACC : '#ffffff';
        c.beginPath(); c.roundRect(X(r.left), Y(r.top), r.width, r.height, 2.5);
        c.fill(); c.stroke();
        if (on) {
          c.strokeStyle = '#ffffff'; c.lineWidth = 1.7;
          c.beginPath();
          c.moveTo(X(r.left) + r.width*0.26, Y(r.top) + r.height*0.52);
          c.lineTo(X(r.left) + r.width*0.44, Y(r.top) + r.height*0.72);
          c.lineTo(X(r.left) + r.width*0.76, Y(r.top) + r.height*0.28);
          c.stroke();
        }
        return;
      }

      if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
        if (!el.value) return;
        var text = el.tagName === 'SELECT' ? el.options[el.selectedIndex].text : el.value;
        c.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        c.fillStyle = cs.color;
        var fs = parseFloat(cs.fontSize);
        /* A browser centres text inside an input's content box, so a
           tall cell and a short writing line both land right. */
        var padT = parseFloat(cs.paddingTop) || 0, padB = parseFloat(cs.paddingBottom) || 0;
        var bdT = parseFloat(cs.borderTopWidth) || 0, bdB = parseFloat(cs.borderBottomWidth) || 0;
        var contentH = r.height - bdT - bdB - padT - padB;
        c.fillText(text,
          X(r.left) + (parseFloat(cs.paddingLeft) || 0),
          Y(r.top) + bdT + padT + contentH / 2 + fs * 0.35);
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
        return;
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
    var sheets = Array.prototype.slice.call(document.querySelectorAll('.sheet'));
    var w = Math.round(sheets[0].getBoundingClientRect().width);
    var h = Math.round(sheets[0].getBoundingClientRect().height);
    var S = 2;                                  // 4 sides at ~192dpi keeps the file sane
    var total = h * sheets.length + GAP * (sheets.length - 1);

    var cv = document.createElement('canvas');
    cv.width = w * S; cv.height = total * S;
    var c = cv.getContext('2d');
    c.scale(S, S);
    c.fillStyle = '#dfe3e8';
    c.fillRect(0, 0, w, total);

    sheets.forEach(function (sheet, i) { paintSheet(c, sheet, i * (h + GAP)); });

    var who = $('id-name').value.trim();
    var a = document.createElement('a');
    a.download = 'Bi design specifications' + (who ? ' - ' + who.replace(/[\\/:*?"<>|]/g, '') : '') + '.png';
    a.href = cv.toDataURL('image/png');
    a.click();
  }

  $('btn-png').addEventListener('click', png);
})();
