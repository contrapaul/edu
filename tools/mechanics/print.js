/* print.js: builds one A4 side per mechanic from the same data the web
   catalogue uses. Find out more, photo slots and the tag row are dropped
   on purpose, so everything else fits on a single side. */
(function () {
  'use strict';

  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  };

  function sheet(m) {
    var fam = FAMILIES[m.family];
    var dg = m.media.diagram && DIAGRAMS[m.media.diagram] ? DIAGRAMS[m.media.diagram]() : '';

    return '<div class="sheet ' + fam.cls.replace('fam-', 'fam-') + '" data-slug="' + m.slug + '">' +

      '<div class="band">' +
        '<p class="band-fam">' + esc(fam.name) + '</p>' +
        '<h2>' + esc(m.name) + '</h2>' +
        (m.alsoCalled.length ? '<p class="band-aka">Also called: ' + esc(m.alsoCalled.join(', ')) + '</p>' : '') +
      '</div>' +

      '<div class="page">' +
        /* Description first, full width and unheaded, then the diagram. */
        '<div class="lede">' +
          m.whatItIs.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
        '</div>' +
        (dg ? '<div class="dgm">' + dg + '</div>' : '') +
        '<div class="cols">' +
          '<div class="block"><h3>How it works in play</h3><ol class="steps">' +
            m.howItWorks.map(function (st) { return '<li>' + esc(st) + '</li>'; }).join('') +
          '</ol></div>' +
          '<div class="block"><h3>Watch out for</h3><ul class="warn">' +
            m.watchOut.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') +
          '</ul></div>' +
        '</div>' +
        /* Games run across the foot of the page, one row. */
        '<div class="block games"><h3>Games that use it</h3><div class="games-row">' +
          m.games.map(function (g) {
            return '<div class="game"><b>' + esc(g.title) + '</b><span>' + esc(g.note) + '</span></div>';
          }).join('') +
        '</div></div>' +
      '</div>' +

      '<div class="sheet-foot">' +
        '<span><span class="swatch"></span>' + esc(fam.short) + '</span>' +
        '<span>edu.contrapaul.com / tools / mechanics</span>' +
      '</div>' +
    '</div>';
  }

  var host = document.getElementById('sheets');
  host.innerHTML = MECHANICS.map(sheet).join('');

  /* Diagrams are laid out in a narrower column here than on the web, so the
     viewBox still has to be grown to fit anything the browser measures wider. */
  function fitDiagrams() {
    host.querySelectorAll('.dgm svg').forEach(function (svg) {
      var box;
      try { box = svg.getBBox(); } catch (e) { return; }
      if (!box || !box.width) return;
      var vb = svg.viewBox.baseVal;
      var w = Math.max(vb.width, Math.ceil(box.x + box.width) + 2);
      var h = Math.max(vb.height, Math.ceil(box.y + box.height) + 2);
      if (w !== vb.width || h !== vb.height) svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    });
  }

  /* ── colour customiser ─────────────────────────────────────────
     The defaults are read back out of the stylesheet, so the scheme
     lives in one place and this only ever writes overrides on top. */
  var PALETTE_STORE = 'mechanics-print-palette';
  var PARTS = [['band', 'Band'], ['tint', 'Tint']];

  var defaults = {};
  Object.keys(FAMILIES).forEach(function (key) {
    var probe = document.createElement('div');
    probe.className = FAMILIES[key].cls;
    probe.style.display = 'none';
    document.body.appendChild(probe);
    var cs = getComputedStyle(probe);
    defaults[key] = { band: cs.getPropertyValue('--band').trim(), tint: cs.getPropertyValue('--tint').trim() };
    probe.remove();
  });

  var custom = {};
  try { custom = JSON.parse(localStorage.getItem(PALETTE_STORE)) || {}; } catch (e) { custom = {}; }

  var paletteStyle = document.createElement('style');
  document.head.appendChild(paletteStyle);

  function colourOf(key, part) {
    return (custom[key] && custom[key][part]) || defaults[key][part];
  }

  function applyPalette() {
    paletteStyle.textContent = Object.keys(FAMILIES).map(function (key) {
      return '.' + FAMILIES[key].cls + '{--band:' + colourOf(key, 'band') +
        ';--tint:' + colourOf(key, 'tint') + ';}';
    }).join('\n');
  }

  function savePalette() {
    try { localStorage.setItem(PALETTE_STORE, JSON.stringify(custom)); } catch (e) { /* private mode */ }
  }

  var swatches = [];
  var grid = document.getElementById('palette-grid');
  Object.keys(FAMILIES).forEach(function (key) {
    var row = document.createElement('div');
    row.className = 'pal-row';
    var nm = document.createElement('span');
    nm.className = 'nm';
    nm.textContent = FAMILIES[key].short;
    row.appendChild(nm);
    PARTS.forEach(function (part) {
      var lab = document.createElement('label');
      lab.textContent = part[1];
      var inp = document.createElement('input');
      inp.type = 'color';
      inp.value = colourOf(key, part[0]);
      inp.id = 'pal-' + key + '-' + part[0];
      lab.htmlFor = inp.id;
      inp.addEventListener('input', function () {
        custom[key] = custom[key] || {};
        custom[key][part[0]] = inp.value;
        applyPalette();
        savePalette();
      });
      row.appendChild(lab);
      row.appendChild(inp);
      swatches.push({ key: key, part: part[0], input: inp });
    });
    grid.appendChild(row);
  });

  applyPalette();

  document.getElementById('palette-reset').addEventListener('click', function () {
    custom = {};
    savePalette();
    applyPalette();
    swatches.forEach(function (sw) { sw.input.value = defaults[sw.key][sw.part]; });
  });

  var paletteBtn = document.getElementById('colours');
  var palettePanel = document.getElementById('palette');
  paletteBtn.addEventListener('click', function () {
    var opening = palettePanel.hidden;
    palettePanel.hidden = !opening;
    paletteBtn.setAttribute('aria-expanded', String(opening));
  });

  /* Selector, grouped by family so it reads like the catalogue. */
  var pick = document.getElementById('pick');
  Object.keys(FAMILIES).forEach(function (key) {
    var group = document.createElement('optgroup');
    group.label = FAMILIES[key].name;
    MECHANICS.filter(function (m) { return m.family === key; }).forEach(function (m) {
      var o = document.createElement('option');
      o.value = m.slug;
      o.textContent = m.name;
      group.appendChild(o);
    });
    pick.appendChild(group);
  });

  function show(slug) {
    host.querySelectorAll('.sheet').forEach(function (s) {
      s.classList.toggle('is-current', s.dataset.slug === slug);
    });
    pick.value = slug;
    history.replaceState(null, '', '#' + slug);
    fitDiagrams();
  }

  pick.addEventListener('change', function () { show(pick.value); });

  document.getElementById('one').addEventListener('click', function () {
    document.body.classList.remove('all');
    window.print();
  });

  document.getElementById('all').addEventListener('click', function () {
    if (!confirm('Print all ' + MECHANICS.length + ' sheets? That is ' + MECHANICS.length + ' sides of paper.')) return;
    document.body.classList.add('all');
    fitDiagrams();
    window.print();
  });

  /* Printing all leaves the class on, which would confuse the next print. */
  window.addEventListener('afterprint', function () { document.body.classList.remove('all'); });

  var start = location.hash.slice(1);
  show(MECHANICS.some(function (m) { return m.slug === start; }) ? start : MECHANICS[0].slug);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitDiagrams);
})();
