/* aiii-teardowns.js: builds the four sides, then prints or paints them.
   The three teardown pages come from one template so they cannot drift
   apart. The PNG is painted from the live sheets, so what is downloaded
   is what the student sees. */
(function () {
  'use strict';

  var FAMILIES = ['Turn order','Movement','Chance','Cards','Resources',
                  'Combat','Hidden info','Fairness','Progress','Goals'];

  /* The required range. One game per slot, and the client group slot was
     removed, so three teardowns cover it. */
  var SLOTS = [
    { tag: 'Played in class',   note: 'A game we played together this unit.' },
    { tag: 'A family new to me', note: 'Uses a mechanic family you have not designed with before.' },
    { tag: 'Free choice',        note: 'Any game. A video game counts if the mechanic transfers to a table.' }
  ];

  var CRITERIA = [
    'Who it suits', 'Time to play', 'Rules clarity',
    'Meaningful choice', 'Components and cost', 'Reason to replay'
  ];

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (ch) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[ch]; }); };

  function famBoxes(prefix) {
    return FAMILIES.map(function (f, i) {
      var id = prefix + '-fam' + i;
      return '<label class="cb" for="' + id + '"><input type="checkbox" id="' + id +
             '" data-fam="' + esc(f) + '"><span>' + esc(f) + '</span></label>';
    }).join('');
  }
  function lines(prefix, n) {
    var out = '';
    for (var i = 1; i <= n; i++) out += '<input type="text" id="' + prefix + i + '">';
    return '<div class="lines">' + out + '</div>';
  }

  /* ── a teardown page ── */
  function teardown(n) {
    var p = 't' + n, slot = SLOTS[n - 1];
    return '' +
    '<div class="sheet" data-page="' + n + '">' +
      '<div class="sheet-head">' +
        '<p class="sheet-title">Game Teardown</p>' +
        '<p class="sheet-sub">Criterion Aiii / analysing existing games</p>' +
        '<p class="pagenum">Page ' + n + ' of 4</p>' +
      '</div>' +

      '<div class="row-game">' +
        '<div class="f"><label for="' + p + '-game">Game</label><input type="text" id="' + p + '-game"></div>' +
        '<span class="tag">' + esc(slot.tag) + '</span>' +
      '</div>' +
      '<div class="row3" style="margin-top:10px">' +
        '<div class="f"><label for="' + p + '-name">Name</label><input type="text" id="' + p + '-name"></div>' +
        '<div class="f"><label for="' + p + '-team">Team</label><input type="text" id="' + p + '-team"></div>' +
        '<div class="f"><label for="' + p + '-date">Date</label><input type="text" id="' + p + '-date"></div>' +
      '</div>' +

      '<h2>The facts <span class="sec-note">' + esc(slot.note) + '</span></h2>' +
      '<div class="facts">' +
        fact(p + '-aud',   'Made for<br>whom') +
        fact(p + '-plr',   'Players') +
        fact(p + '-box',   'Box says<br>min') +
        fact(p + '-real',  'We took<br>min') +
        fact(p + '-comp',  'Main<br>components') +
      '</div>' +

      '<h2>Mechanics it uses <span class="sec-note">Tick the families, then name the mechanics.</span></h2>' +
      '<div class="fams">' + famBoxes(p) + '</div>' +
      '<div style="margin-top:11px">' + lines(p + '-mech', 2) + '</div>' +

      '<h2>Where the choices are <span class="sec-note">And where the game just tells you what to do.</span></h2>' +
      '<div class="cols2">' +
        '<div><p class="collabel">Real decisions the player makes</p>' + lines(p + '-choice', 4) + '</div>' +
        '<div><p class="collabel">Moments with no decision in them</p>' + lines(p + '-nochoice', 4) + '</div>' +
      '</div>' +

      '<h2>What works, and for whom</h2>' + lines(p + '-works', 5) +
      '<h2>What fails, and for whom</h2>' + lines(p + '-fails', 5) +

      '<h2>Take and leave <span class="sec-note">One sentence each.</span></h2>' +
      '<div class="cols2">' +
        '<div><p class="collabel">I would take</p>' + lines(p + '-take', 2) + '</div>' +
        '<div><p class="collabel">I would leave</p>' + lines(p + '-leave', 2) + '</div>' +
      '</div>' +

      foot('Teardown ' + n + ' of 3') +
    '</div>';
  }

  function fact(id, label) {
    return '<div class="fact"><label for="' + id + '">' + label + '</label>' +
           '<input type="text" id="' + id + '"></div>';
  }
  function foot(right) {
    return '<div class="sheet-foot"><span>edu.contrapaul.com / G9 tabletop</span><span>' + esc(right) + '</span></div>';
  }

  /* ── the synthesis page ── */
  function synthesis() {
    var head = '<thead><tr><th>Compare on</th>' +
      [1,2,3].map(function (i) {
        return '<th><input type="text" id="s-game' + i + '" placeholder=""></th>';
      }).join('') + '</tr></thead>';

    var rows = CRITERIA.map(function (crit, r) {
      return '<tr><th>' + esc(crit) + '</th>' +
        [1,2,3].map(function (col) {
          return '<td><input type="text" id="m-' + r + '-' + col + '"></td>';
        }).join('') + '</tr>';
    }).join('');

    var impls = '';
    for (var i = 1; i <= 5; i++) {
      impls += '<div class="impl-row"><span class="impl-n">' + i + '</span>' +
               '<div class="lines"><input type="text" id="impl' + i + 'a">' +
               '<input type="text" id="impl' + i + 'b"></div></div>';
    }

    return '' +
    '<div class="sheet" data-page="4">' +
      '<div class="sheet-head">' +
        '<p class="sheet-title">Synthesis</p>' +
        '<p class="sheet-sub">Criterion Aiii / what the three games tell me</p>' +
        '<p class="pagenum">Page 4 of 4</p>' +
      '</div>' +

      '<h2>Compare the three <span class="sec-note">Same question asked of every game.</span></h2>' +
      '<table class="matrix">' + head + '<tbody>' + rows + '</tbody></table>' +

      '<h2>Design implications <span class="sec-note">This is the part that is marked hardest.</span></h2>' +
      '<p class="rules">Each one starts <b>Because</b> and ends with what <b>your</b> game will do. ' +
      'An implication that names no game and changes no decision is just an observation.</p>' +
      '<div class="impl" style="margin-top:11px">' + impls + '</div>' +

      '<h2>Team coverage <span class="sec-note">Check before you start, not after.</span></h2>' +
      '<p class="rules">No more than <b>one</b> of your three games may be a game a teammate is also doing. ' +
      'List your teammates and what they are covering.</p>' +
      '<div style="margin-top:10px">' + lines('team', 4) + '</div>' +

      foot('Synthesis') +
    '</div>';
  }

  $('sheets').innerHTML = teardown(1) + teardown(2) + teardown(3) + synthesis();

  /* Keep the synthesis column heads in step with the game names. */
  [1,2,3].forEach(function (i) {
    var src = $('t' + i + '-game'), dst = $('s-game' + i);
    src.addEventListener('input', function () { dst.value = src.value; });
  });

  /* ── clear ── */
  $('btn-clear').addEventListener('click', function () {
    if (!confirm('Clear all four pages?')) return;
    document.querySelectorAll('#sheets input[type=text]').forEach(function (i) { i.value = ''; });
    document.querySelectorAll('#sheets input[type=checkbox]').forEach(function (i) { i.checked = false; });
  });

  $('btn-print').addEventListener('click', function () { window.print(); });

  /* ── PNG: all four sides stacked into one file ── */
  var ACC = '#1a5cb8', LINE = '#c8cdd6', GAP = 24;

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

      /* Ticks are drawn as shapes, so their own border must not also be
         painted as a rule across the bottom. */
      var isTick = el.tagName === 'INPUT' && el.type === 'checkbox';

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

      /* cell shading, used by the matrix row headers */
      var bg = cs.backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && el.tagName !== 'INPUT' && !el.classList.contains('sheet')) {
        c.fillStyle = bg;
        c.fillRect(X(r.left), Y(r.top), r.width, r.height);
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
          c.moveTo(X(r.left) + r.width*0.26, Y(r.top) + r.height*0.52);
          c.lineTo(X(r.left) + r.width*0.44, Y(r.top) + r.height*0.72);
          c.lineTo(X(r.left) + r.width*0.76, Y(r.top) + r.height*0.28);
          c.stroke();
        }
      } else if (el.value) {
        c.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        c.fillStyle = cs.color;
        var fs = parseFloat(cs.fontSize);
        /* A browser centres text inside an input's content box, so a tall
           cell in the matrix and a short writing line both land right. */
        var padT = parseFloat(cs.paddingTop) || 0, padB = parseFloat(cs.paddingBottom) || 0;
        var bdT = parseFloat(cs.borderTopWidth) || 0, bdB = parseFloat(cs.borderBottomWidth) || 0;
        var contentH = r.height - bdT - bdB - padT - padB;
        var baseline = Y(r.top) + bdT + padT + contentH / 2 + fs * 0.35;
        var centred = cs.textAlign === 'center';
        c.textAlign = centred ? 'center' : 'left';
        c.fillText(el.value,
          centred ? X(r.left) + r.width/2 : X(r.left) + (parseFloat(cs.paddingLeft) || 0),
          baseline);
        c.textAlign = 'left';
      }
    });

    /* Glyphs, drawn where the browser already put them. */
    var walker = document.createTreeWalker(sheet, NodeFilter.SHOW_TEXT, null);
    var range = document.createRange(), node;
    while ((node = walker.nextNode())) {
      var text = node.textContent;
      if (!text.trim()) continue;
      var pcs = getComputedStyle(node.parentElement);
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

    var who = $('t1-name').value.trim();
    var a = document.createElement('a');
    a.download = 'Aiii game teardowns' + (who ? ' - ' + who.replace(/[\\/:*?"<>|]/g, '') : '') + '.png';
    a.href = cv.toDataURL('image/png');
    a.click();
  }

  $('btn-png').addEventListener('click', png);
})();
