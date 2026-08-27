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
        (dg ? '<div class="dgm-band"><div class="dgm">' + dg + '</div></div>' : '') +
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
  liftCaptions();

  /* The explainer is drawn inside the SVG so the catalogue can scale it along
     with the art. On paper it belongs to the page: lifted out into a paragraph
     under the drawing, it keeps its size whatever the diagram is scaled to. */
  function liftCaptions() {
    host.querySelectorAll('.dgm').forEach(function (box) {
      var cap = box.querySelector('svg text[data-cap]');
      if (!cap) return;
      cap.remove();
      var p = document.createElement('p');
      p.className = 'dgm-cap';
      p.textContent = cap.textContent;
      box.appendChild(p);
    });
  }

  /* Diagrams are laid out in a narrower column here than on the web, so the
     viewBox is grown to fit anything the browser measures wider. The height is
     set outright rather than grown, so the space the caption used to take is
     given back to the drawing. */
  function fitDiagrams() {
    host.querySelectorAll('.dgm svg').forEach(function (svg) {
      var box;
      try { box = svg.getBBox(); } catch (e) { return; }
      if (!box || !box.width || !box.height) return;
      var vb = svg.viewBox.baseVal;
      var w = Math.max(vb.width, Math.ceil(box.x + box.width) + 2);
      var h = Math.ceil(box.y + box.height) + 2;
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
    scaleInput.value = 100;
    autoInput.checked = false;
    applyAuto();
    applyScale();
  });

  /* ── diagram scale ─────────────────────────────────────────────
     Scaling up can only use room the sheet already has: the drawing is
     capped at the width of its box, so a wide diagram stops growing while
     a tall one keeps going. The note says when a sheet has run out. */
  var SCALE_STORE = 'mechanics-print-diagram-scale';
  var scaleInput = document.getElementById('dgm-scale');
  var scaleOut = document.getElementById('dgm-scale-out');
  var fitNote = document.getElementById('dgm-fit');

  var storedScale = parseInt(localStorage.getItem(SCALE_STORE), 10);
  if (storedScale >= 60 && storedScale <= 140) scaleInput.value = storedScale;

  function applyScale() {
    var pct = parseInt(scaleInput.value, 10);
    document.documentElement.style.setProperty('--dgm-scale', pct / 100);
    scaleOut.textContent = pct + '%';
    try { localStorage.setItem(SCALE_STORE, pct); } catch (e) { /* private mode */ }
    reportFit();
  }

  function reportFit() {
    var sheet = host.querySelector('.sheet.is-current');
    if (!sheet) return;
    var page = sheet.querySelector('.page');
    var over = page.scrollHeight - page.clientHeight;
    if (autoInput.checked) {
      var own = Math.round((parseFloat(sheet.style.getPropertyValue('--dgm-scale')) || 1) * 100);
      fitNote.textContent = 'This sheet fitted at ' + own + '%';
    } else {
      fitNote.textContent = over > 0 ? 'This sheet overflows by ' + over + 'px' : 'This sheet fits';
    }
    fitNote.classList.toggle('over', over > 0);
  }

  scaleInput.addEventListener('input', function () {
    if (autoInput.checked) { autoInput.checked = false; applyAuto(); }
    applyScale();
  });

  /* ── auto fit ──────────────────────────────────────────────────
     Overflow only grows with the scale, so the largest scale a sheet can
     take is found by halving the range rather than trying every step. Each
     sheet keeps its own answer, on the sheet itself, which beats the shared
     slider underneath it. */
  var AUTO_STORE = 'mechanics-print-autofit';
  var autoInput = document.getElementById('dgm-auto');
  var STEPS = [];
  for (var v = 60; v <= 140; v += 5) STEPS.push(v);

  function largestFitting(sheet) {
    var page = sheet.querySelector('.page');
    var lo = 0, hi = STEPS.length - 1, best = 0;
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      sheet.style.setProperty('--dgm-scale', STEPS[mid] / 100);
      if (page.scrollHeight <= page.clientHeight) { best = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    return STEPS[best];
  }

  function applyAuto() {
    var on = autoInput.checked;
    var showing = host.querySelector('.sheet.is-current');
    if (!showing) return;
    scaleInput.disabled = on;
    try { localStorage.setItem(AUTO_STORE, on ? '1' : '0'); } catch (e) { /* private mode */ }

    host.querySelectorAll('.sheet').forEach(function (sheet) {
      sheet.style.removeProperty('--dgm-scale');
      if (!on || !sheet.querySelector('.dgm svg')) return;
      /* A sheet can only be measured while it is the one on screen. */
      sheet.classList.add('is-current');
      if (sheet !== showing) showing.classList.remove('is-current');
      fitDiagrams();
      sheet.style.setProperty('--dgm-scale', largestFitting(sheet) / 100);
      if (sheet !== showing) { sheet.classList.remove('is-current'); showing.classList.add('is-current'); }
    });
    reportFit();
  }

  autoInput.addEventListener('change', applyAuto);

  applyScale();
  autoInput.checked = localStorage.getItem(AUTO_STORE) === '1';
  scaleInput.disabled = autoInput.checked;

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
    reportFit();
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
    if (autoInput.checked) applyAuto();
    window.print();
  });

  /* Printing all leaves the class on, which would confuse the next print. */
  window.addEventListener('afterprint', function () { document.body.classList.remove('all'); });

  var start = location.hash.slice(1);
  show(MECHANICS.some(function (m) { return m.slug === start; }) ? start : MECHANICS[0].slug);
  if (autoInput.checked) applyAuto();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
    fitDiagrams();
    if (autoInput.checked) applyAuto(); else reportFit();
  });
})();
