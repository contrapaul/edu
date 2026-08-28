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

  /* ── family title pages ────────────────────────────────────────
     Dividers for a printed set. Two half pages to an A4 side, each one a
     family in its own colour, so a wall or a folder can be split by family
     without hunting for where one group ends. */
  var FAMILY_BLURBS = {
    turn:   "Every game has to settle who acts and when. These mechanics set the order of play, and they decide how long anybody sits waiting for their turn to come round.",
    move:   "Where pieces go, how far they travel in one go, and what the shape of the board does to both of those answers.",
    chance: "Dice, draws and shuffles. These mechanics decide how much of a result the players earn and how much the game simply hands them.",
    cards:  "Hands, decks, and the ways players change what is inside them while the game is running.",
    econ:   "Getting things, spending them, and swapping them with the people across the table. Most of the real decisions in a game end up here.",
    combat: "Attacking, defending, and settling what happens when two pieces want the same square at the same time.",
    hidden: "What one player knows and another does not. These mechanics run on secrets, bluffing, and reading the room.",
    fair:   "Ways of keeping a losing player interested, and of stopping a winning player from running away with the whole game.",
    growth: "Getting stronger as the game goes on. Levels, upgrades and engines, and the patience of building something before it pays.",
    goals:  "How a game ends and how it is won. Scoring reaches backwards and shapes every decision made before it."
  };

  /* Flat and geometric, drawn the way the diagrams are, knocked out of the
     family colour behind them. */
  var ICON_ATTRS = 'viewBox="0 0 100 100" fill="none" stroke="currentColor" ' +
    'stroke-width="8" stroke-linecap="round" stroke-linejoin="round"';
  var FAMILY_ICONS = {
    turn: '<path d="M60 19 A34 34 0 1 1 48 16"/>' +
      '<path d="M44 6 L63 16 L44 26 Z" fill="currentColor" stroke="none"/>',
    move: [6, 36, 66].map(function (y) {
      return [6, 36, 66].map(function (x) {
        var mid = x === 36 && y === 36;
        return '<rect x="' + x + '" y="' + y + '" width="28" height="28" rx="4" stroke-width="6"' +
          (mid ? ' fill="currentColor"' : '') + '/>';
      }).join('');
    }).join(''),
    chance: '<rect x="10" y="10" width="80" height="80" rx="17"/>' +
      [[31, 31], [69, 31], [50, 50], [31, 69], [69, 69]].map(function (p) {
        return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" fill="currentColor" stroke="none"/>';
      }).join(''),
    cards: '<rect x="12" y="30" width="38" height="54" rx="6" stroke-width="7" transform="rotate(-15 31 57)"/>' +
      '<rect x="50" y="30" width="38" height="54" rx="6" stroke-width="7" transform="rotate(15 69 57)"/>' +
      '<rect x="31" y="22" width="38" height="54" rx="6" stroke-width="7" fill="var(--band)"/>',
    econ: '<rect x="10" y="54" width="34" height="34" rx="5"/><rect x="56" y="54" width="34" height="34" rx="5"/>' +
      '<rect x="33" y="12" width="34" height="34" rx="5"/>',
    combat: '<path d="M6 50 L38 50 M25 36 L39 50 L25 64"/><path d="M94 50 L62 50 M75 36 L61 50 L75 64"/>',
    hidden: '<path d="M8 52 C30 22 70 22 92 52 C70 82 30 82 8 52 Z"/>' +
      '<circle cx="50" cy="52" r="12" fill="currentColor" stroke="none"/><path d="M16 86 L84 18"/>',
    fair: '<path d="M16 30 L84 30 M50 30 L50 84 M26 84 L74 84 M16 30 L16 52 M84 30 L84 52"/>' +
      '<path d="M1 52 A16 16 0 0 0 31 52" stroke-width="7"/><path d="M69 52 A16 16 0 0 0 99 52" stroke-width="7"/>',
    growth: '<rect x="10" y="62" width="21" height="27" rx="4" fill="currentColor" stroke="none"/>' +
      '<rect x="39" y="42" width="21" height="47" rx="4" fill="currentColor" stroke="none"/>' +
      '<rect x="68" y="16" width="21" height="73" rx="4" fill="currentColor" stroke="none"/>',
    goals: '<circle cx="50" cy="50" r="37"/><circle cx="50" cy="50" r="19"/>' +
      '<circle cx="50" cy="50" r="7" fill="currentColor" stroke="none"/>'
  };

  function titleCard(key) {
    var fam = FAMILIES[key];
    var n = MECHANICS.filter(function (m) { return m.family === key; }).length;
    return '<div class="tcard ' + fam.cls + '">' +
      '<svg class="tcard-icon" ' + ICON_ATTRS + ' aria-hidden="true">' + FAMILY_ICONS[key] + '</svg>' +
      '<h2>' + esc(fam.name) + '</h2>' +
      '<p class="tcard-blurb">' + esc(FAMILY_BLURBS[key]) + '</p>' +
      '<p class="tcard-foot">' + n + ' mechanics <span>/</span> edu.contrapaul.com / tools / mechanics</p>' +
    '</div>';
  }

  var FAM_KEYS = Object.keys(FAMILIES);

  /* The poster that fronts the set. Landscape, and deliberately outside the
     family palette so no reader takes its grey for an eleventh family. */
  function poster() {
    return '<div class="poster" data-slug="poster"><div class="poster-inner">' +
      '<h2>Game Mechanics</h2>' +
      '<p class="poster-sub">' + MECHANICS.length + ' mechanics in ' + FAM_KEYS.length + ' families</p>' +
      '<div class="poster-row">' +
        FAM_KEYS.map(function (key) {
          return '<div class="poster-item">' +
            '<svg ' + ICON_ATTRS + ' aria-hidden="true">' + FAMILY_ICONS[key] + '</svg>' +
            '<span>' + esc(FAMILIES[key].short) + '</span>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<p class="poster-foot">edu.contrapaul.com / tools / mechanics</p>' +
    '</div></div>';
  }

  var titlePages = '';
  for (var t = 0; t < FAM_KEYS.length; t += 2) {
    titlePages += '<div class="tpage" data-slug="titles-' + (t / 2) + '">' +
      titleCard(FAM_KEYS[t]) + (FAM_KEYS[t + 1] ? titleCard(FAM_KEYS[t + 1]) : '') + '</div>';
  }


  /* ── criteria cards ────────────────────────────────────────────
     The sixteen assessed strands, four to an A4 side, one side per letter.
     Task names are the ones the unit page already uses, so a student reads
     the same words here as in the brief. */
  var CRIT_LETTERS = ['A', 'B', 'C', 'D'];
  var CRIT_NAMES = {
    A: 'Inquiring and analysing',
    B: 'Developing ideas',
    C: 'Creating the solution',
    D: 'Evaluating'
  };
  var CRITERIA = [
    { code: 'Ai', task: 'Justify the need',
      blurb: 'Students identify the client group their game is for and explain what that group needs. They argue the case for the game rather than describing the situation around it.' },
    { code: 'Aii', task: 'Plan and prioritise research',
      blurb: 'Students plan the research they need before designing anything. They decide which questions matter most and set out how each one will be answered.' },
    { code: 'Aiii', task: 'Analyse existing games',
      blurb: 'Students analyse three existing games against the same set of questions. They turn what they find into design implications they can carry into their own game.' },
    { code: 'Aiv', task: 'Write the design brief',
      blurb: 'Students write a design brief that pulls their research together into one document. It sets out what the game is for and who it is for, drawing on the analysis behind it.' },
    { code: 'Bi', task: 'Write the specification',
      blurb: 'Students write a specification of measurable success criteria for their game. Each one states how it will be tested and where it came from in the research.' },
    { code: 'Bii', task: 'Generate a range of ideas',
      blurb: 'Students develop a range of different game ideas and annotate them. The annotation has to be clear enough that another designer could build from the drawing alone.' },
    { code: 'Biii', task: 'Choose and justify critically',
      blurb: 'Students choose one design and justify that decision against the others. They also make the strongest case they can against their own choice.' },
    { code: 'Biv', task: 'Draw it for production',
      blurb: 'Students draw the chosen game accurately enough for it to be made. The drawings carry measurements, materials and the requirements for producing each component.' },
    { code: 'Ci', task: 'Plan the build',
      blurb: 'Students build a plan for making the game, with time and resources set against every step. Another student should be able to follow it without asking questions.' },
    { code: 'Cii', task: 'Demonstrate technical skill',
      blurb: 'Students demonstrate technical skill while making their components. They work at depth in at least three skills across two different production methods.' },
    { code: 'Ciii', task: 'Finish a working game',
      blurb: 'Students follow their plan and finish a game that works. It has to be playable by people who had no part in making it.' },
    { code: 'Civ', task: 'Justify every change',
      blurb: 'Students record the changes they make to the design while building it. They explain why each change was needed and keep the record as the work happens rather than afterwards.' },
    { code: 'Di', task: 'Design the testing methods',
      blurb: 'Students design testing methods that produce real data about their game. Each method sets out what is being measured and how it will be captured.' },
    { code: 'Dii', task: 'Evaluate against the spec',
      blurb: 'Students test the finished game and evaluate it against their own specification. Every success criterion is judged on the evidence the testing produced.' },
    { code: 'Diii', task: 'Explain the improvements',
      blurb: 'Students explain how the game could be improved. Each improvement traces back to something the testing actually found.' },
    { code: 'Div', task: 'Explain the impact',
      blurb: 'Students explain the impact of the finished game on the client group. They report what changed for the people who played it.' }
  ];

  function critCard(c) {
    var letter = c.code.charAt(0);
    return '<div class="ccard crit-' + letter + '">' +
      '<div class="ccard-head">' +
        '<p class="ccard-crit">Criterion ' + letter + ' <span>/</span> ' + esc(CRIT_NAMES[letter]) + '</p>' +
        '<h3 class="ccard-title">' + esc(c.code) + ': ' + esc(c.task) + '</h3>' +
      '</div>' +
      '<div class="ccard-body">' +
        '<p class="ccard-blurb">' + esc(c.blurb) + '</p>' +
        '<p class="ccard-foot">MYP Design <span>/</span> Grade 9 Tabletop Game Design</p>' +
      '</div>' +
    '</div>';
  }

  var critPages = CRIT_LETTERS.map(function (L) {
    return '<div class="cpage" data-slug="criteria-' + L + '">' +
      CRITERIA.filter(function (c) { return c.code.charAt(0) === L; }).map(critCard).join('') +
      '</div>';
  }).join('');

  host.innerHTML = poster() + titlePages + critPages + MECHANICS.map(sheet).join('');
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

  /* Every viewBox is cropped to what the diagram actually draws, rather than
     to the space it was authored in. A drawing that stops short of the
     declared 400 wide used to sit against the left edge with the slack on the
     right; cropped, it fills the box and is centred, and the space the lifted
     caption left behind goes back to the drawing too. */
  var DG_PAD = 3;
  function fitDiagrams() {
    host.querySelectorAll('.dgm svg').forEach(function (svg) {
      var box;
      try { box = svg.getBBox(); } catch (e) { return; }
      if (!box || !box.width || !box.height) return;
      svg.setAttribute('viewBox',
        (Math.floor(box.x) - DG_PAD) + ' ' + (Math.floor(box.y) - DG_PAD) + ' ' +
        (Math.ceil(box.width) + DG_PAD * 2) + ' ' + (Math.ceil(box.height) + DG_PAD * 2));
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

  CRIT_LETTERS.forEach(function (L) {
    var probe = document.createElement('div');
    probe.className = 'crit-' + L;
    probe.style.display = 'none';
    document.body.appendChild(probe);
    defaults['crit-' + L] = { band: getComputedStyle(probe).getPropertyValue('--crit').trim() };
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
    }).concat(CRIT_LETTERS.map(function (L) {
      return '.crit-' + L + '{--crit:' + colourOf('crit-' + L, 'band') + ';}';
    })).join('\n');
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

  var cgrid = document.getElementById('palette-crit');
  CRIT_LETTERS.forEach(function (L) {
    var row = document.createElement('div');
    row.className = 'pal-row';
    var nm = document.createElement('span');
    nm.className = 'nm';
    nm.textContent = 'Criterion ' + L;
    row.appendChild(nm);
    var lab = document.createElement('label');
    lab.textContent = 'Colour';
    var inp = document.createElement('input');
    inp.type = 'color';
    inp.value = colourOf('crit-' + L, 'band');
    inp.id = 'pal-crit-' + L;
    lab.htmlFor = inp.id;
    inp.addEventListener('input', function () {
      custom['crit-' + L] = { band: inp.value };
      applyPalette();
      savePalette();
    });
    row.appendChild(lab);
    row.appendChild(inp);
    cgrid.appendChild(row);
    swatches.push({ key: 'crit-' + L, part: 'band', input: inp });
  });

  applyPalette();

  document.getElementById('palette-reset').addEventListener('click', function () {
    custom = {};
    savePalette();
    applyPalette();
    swatches.forEach(function (sw) { sw.input.value = defaults[sw.key][sw.part]; });
    scaleInput.value = 100;
    autoInput.checked = true;
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
    if (!sheet) { fitNote.textContent = ''; fitNote.classList.remove('over'); return; }
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
    var showing = host.querySelector('.is-current');
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
  /* On by default: at one shared scale every sheet has to obey the tightest
     one, which leaves most of them with a diagram far smaller than their page
     could carry. */
  autoInput.checked = localStorage.getItem(AUTO_STORE) !== '0';
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
  var pgroup = document.createElement('optgroup');
  pgroup.label = 'Poster';
  var po = document.createElement('option');
  po.value = 'poster';
  po.textContent = 'Game Mechanics poster';
  pgroup.appendChild(po);
  pick.appendChild(pgroup);

  var cgroup = document.createElement('optgroup');
  cgroup.label = 'Criteria cards';
  CRIT_LETTERS.forEach(function (L) {
    var co = document.createElement('option');
    co.value = 'criteria-' + L;
    co.textContent = 'Criterion ' + L + ': ' + CRIT_NAMES[L];
    cgroup.appendChild(co);
  });
  pick.appendChild(cgroup);

  var tgroup = document.createElement('optgroup');
  tgroup.label = 'Family title pages';
  for (var tp = 0; tp < FAM_KEYS.length; tp += 2) {
    var to = document.createElement('option');
    to.value = 'titles-' + (tp / 2);
    to.textContent = FAMILIES[FAM_KEYS[tp]].short +
      (FAM_KEYS[tp + 1] ? ' and ' + FAMILIES[FAM_KEYS[tp + 1]].short : '');
    tgroup.appendChild(to);
  }
  pick.appendChild(tgroup);
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
    host.querySelectorAll('.sheet, .tpage, .poster, .cpage').forEach(function (s) {
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
    var pages = 1 + Math.ceil(FAM_KEYS.length / 2) + CRIT_LETTERS.length + MECHANICS.length;
    if (!confirm('Print the whole set? That is ' + pages + ' sides: the poster, ' +
      Math.ceil(FAM_KEYS.length / 2) + ' of family title pages two to a side, ' +
      CRIT_LETTERS.length + ' of criteria cards four to a side, then ' +
      MECHANICS.length + ' mechanics.')) return;
    document.body.classList.add('all');
    fitDiagrams();
    if (autoInput.checked) applyAuto();
    window.print();
  });

  /* Printing all leaves the class on, which would confuse the next print. */
  window.addEventListener('afterprint', function () { document.body.classList.remove('all'); });

  var start = location.hash.slice(1);
  var known = host.querySelector('[data-slug="' + (start || 'none').replace(/"/g, '') + '"]');
  show(known ? start : MECHANICS[0].slug);
  if (autoInput.checked) applyAuto();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
    fitDiagrams();
    if (autoInput.checked) applyAuto(); else reportFit();
  });
})();
