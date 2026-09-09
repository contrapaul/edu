/* ═══════════════════════════════════════════════════════════════════
   BLACK BOX ANALYZER
   Builds the four Black Box Cards and the summary for Aiii. Parts come
   from the catalog's data.js, so there is exactly one list of parts in
   this repo and this tool cannot drift from it.

   Everything lives in localStorage. There is no server, and no build
   step: this file is served as it is written.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var KEY = 'bb-analyzer-v1';

/* The four products are fixed by the task, so they are code, not data
   the student can edit. */
var SLOTS = [
  { brief: 'Something you can pick up and hold',
    why: 'In this room, in your bag, or at home. Being able to press the buttons and watch what happens is worth more than any product page.' },
  { brief: 'Something made for your client group',
    why: 'Or something they could use. This is the card that most often turns into a design implication you actually keep.' },
  { brief: 'Something with no screen',
    why: 'With no screen it has to talk to you with light, sound, movement or vibration. That is the same problem your device has.' },
  { brief: 'Something badly designed, chosen on purpose',
    why: 'Pick something genuinely irritating to use, then find exactly where it fails: the sensing, the deciding, the feedback, or the controls. Complaining is easy. Naming the part that is wrong is analysis.' }
];

var POWER = ['Mains', 'Disposable batteries', 'Rechargeable battery', 'USB', 'Solar or harvested'];

/* Which catalog categories can plausibly be an input, and which an
   output. Boards are the decision, so they are in neither list. */
var IN_CATS  = ['sensors', 'controls'];
var OUT_CATS = ['outputs', 'displays'];

/* ── STATE ────────────────────────────────────────────────────────── */

function blankCard() {
  return {
    name: '', who: '', cost: '', lives: '',
    sensing: '', evidence: '', inParts: [], ruledOut: [],
    deciding: '',
    doesBack: '', outParts: [],
    powerSource: '', powerForced: '',
    photo: null, photoCaption: '',
    fileName: '',
    controls: [],
    copyThis: '', leaveThis: '',
    checkUrl: '', checkRight: '', checkWrong: ''
  };
}

function blankState() {
  return {
    student: '', client: '',
    cards: [blankCard(), blankCard(), blankCard(), blankCard()],
    implications: [
      { because: '', should: '' }, { because: '', should: '' }, { because: '', should: '' }
    ]
  };
}

var state = load();
var view = 0;               // 0-3 are cards, 4 is the summary
var saveTimer = null;

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return blankState();
    var got = JSON.parse(raw);
    var fresh = blankState();
    // Merge field by field so a saved copy from an older version still opens.
    fresh.student = got.student || '';
    fresh.client = got.client || '';
    (got.cards || []).forEach(function (c, i) {
      if (i > 3 || !c) return;
      Object.keys(fresh.cards[i]).forEach(function (k) {
        if (c[k] != null) fresh.cards[i][k] = c[k];
      });
    });
    if (Array.isArray(got.implications) && got.implications.length) {
      fresh.implications = got.implications.map(function (im) {
        return { because: (im && im.because) || '', should: (im && im.should) || '' };
      });
    }
    return fresh;
  } catch (e) {
    return blankState();
  }
}

function writeNow() {
  clearTimeout(saveTimer);
  saveTimer = null;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    /* Nearly always the quota, and nearly always a photo that filled
       it. Say which one, because the fix is to replace that photo. */
    note(hasPhotos()
      ? 'Out of room in this browser. Remove a photo, or use "Save a copy" to keep your work in a file.'
      : 'This browser will not save. Use "Save a copy" before you close the tab.');
    return false;
  }
}

function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(function () {
    if (writeNow()) note('Saved in this browser.');
  }, 300);
}

/* Typing debounces, so a student who closes the tab mid-sentence would
   lose the last few keystrokes. Write straight out instead whenever the
   page is being hidden or torn down. pagehide is the one that fires
   reliably on iOS, where a tab is often never formally closed. */
function flush() {
  if (saveTimer) writeNow();
}
window.addEventListener('pagehide', flush);
window.addEventListener('beforeunload', flush);
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') flush();
});

function note(msg) {
  document.getElementById('saveState').textContent = msg;
}

function hasPhotos() {
  return state.cards.some(function (c) { return !!c.photo; });
}

/* Safe for a file name on every operating system the class uses. */
function slugify(t) {
  return String(t || '').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/* What the download is called when the student has not renamed it. */
function defaultFileName(c, i) {
  return [slugify(state.student), 'card-' + (i + 1), slugify(c.name)]
    .filter(Boolean).join('-') || 'black-box-card-' + (i + 1);
}

/* Phone photos are far too big for localStorage, so every image is
   shrunk and re-encoded before it is ever stored. */
var PHOTO_MAX = 1200, PHOTO_QUALITY = 0.82;

function readPhoto(file, cb) {
  var reader = new FileReader();
  reader.onload = function () {
    var img = new Image();
    img.onload = function () {
      var r = Math.min(1, PHOTO_MAX / Math.max(img.width, img.height));
      var cv = document.createElement('canvas');
      cv.width = Math.round(img.width * r);
      cv.height = Math.round(img.height * r);
      var ctx = cv.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
      cb(cv.toDataURL('image/jpeg', PHOTO_QUALITY));
    };
    img.onerror = function () { cb(null); };
    img.src = reader.result;
  };
  reader.onerror = function () { cb(null); };
  reader.readAsDataURL(file);
}

/* ── PARTS HELPERS ────────────────────────────────────────────────── */

function partsIn(cats) {
  return PARTS.filter(function (p) { return cats.indexOf(p.category) > -1; });
}
function partBySlug(slug) {
  for (var i = 0; i < PARTS.length; i++) if (PARTS[i].slug === slug) return PARTS[i];
  return null;
}
function partName(slug) {
  var p = partBySlug(slug);
  return p ? (p.shortName || p.name) : slug;
}
function partColor(slug) {
  var p = partBySlug(slug);
  return (p && CATEGORIES[p.category]) ? CATEGORIES[p.category].color : '#9aa8c2';
}

/* ── COMPLETENESS ─────────────────────────────────────────────────── */

/* One entry per thing the task sheet asks for. The meter is a checklist
   made visible, not a grade. */
function cardChecks(c) {
  return [
    ['What it is', !!c.name.trim()],
    ['Who it is for', !!c.who.trim()],
    ['What it costs', !!c.cost.trim()],
    ['What it must be sensing', !!c.sensing.trim()],
    ['Your evidence', !!c.evidence.trim()],
    ['Parts that could sense it', c.inParts.length > 0],
    ['A part ruled out, with a reason', c.ruledOut.some(function (r) { return r.why.trim(); })],
    ['What it must be deciding', !!c.deciding.trim()],
    ['What it does back', !!c.doesBack.trim()],
    ['Parts that could do it', c.outParts.length > 0],
    ['Where the power comes from', !!c.powerSource],
    ['What the power choice forced', !!c.powerForced.trim()],
    ['Controls and lights', c.controls.length > 0],
    ['What you would copy', !!c.copyThis.trim()],
    ['What you would leave behind', !!c.leaveThis.trim()]
  ];
}

function cardScore(c) {
  var ch = cardChecks(c), done = ch.filter(function (x) { return x[1]; }).length;
  return { done: done, total: ch.length };
}

function summaryScore() {
  var filled = state.implications.filter(function (im) {
    return im.because.trim() && im.should.trim();
  }).length;
  return { done: Math.min(filled, 3), total: 3, filled: filled };
}

/* ── DOM HELPERS ──────────────────────────────────────────────────── */

function el(tag, cls, text) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function field(label, value, placeholder, onInput, opts) {
  opts = opts || {};
  var wrap = el('div', 'bb-field');
  var id = 'f-' + Math.random().toString(36).slice(2, 9);
  var lab = el('label', 'bb-label', label);
  lab.setAttribute('for', id);
  var input;
  if (opts.type === 'area') {
    input = el('textarea', 'bb-area');
    if (opts.rows) input.rows = opts.rows;
  } else if (opts.type === 'select') {
    input = el('select', 'bb-select');
    input.appendChild(new Option(placeholder || 'Choose one', ''));
    (opts.options || []).forEach(function (o) { input.appendChild(new Option(o, o)); });
  } else {
    input = el('input', 'bb-input');
    input.type = opts.type || 'text';
  }
  input.id = id;
  input.value = value || '';
  if (placeholder && opts.type !== 'select') input.placeholder = placeholder;
  input.addEventListener('input', function () { onInput(input.value); });
  if (opts.type === 'select') input.addEventListener('change', function () { onInput(input.value); });
  wrap.appendChild(lab);
  wrap.appendChild(input);
  return wrap;
}

function block(n, title, hint) {
  var b = el('div', 'bb-block');
  var head = el('div', 'bb-block-head');
  head.appendChild(el('span', 'bb-block-n', n));
  head.appendChild(el('h2', 'bb-block-title', title));
  b.appendChild(head);
  if (hint) b.appendChild(el('p', 'bb-block-hint', hint));
  return b;
}

/* ── PART PICKER ──────────────────────────────────────────────────── */

var picker = {
  node: document.getElementById('picker'),
  list: document.getElementById('pickerList'),
  search: document.getElementById('pickerSearch'),
  title: document.getElementById('pickerTitle'),
  sub: document.getElementById('pickerSub'),
  cats: [], chosen: [], onPick: null
};

function openPicker(title, sub, cats, chosen, onPick) {
  picker.cats = cats;
  picker.chosen = chosen;
  picker.onPick = onPick;
  picker.title.textContent = title;
  picker.sub.textContent = sub;
  picker.search.value = '';
  picker.node.hidden = false;
  drawPicker();
  picker.search.focus();
}

function closePicker() { picker.node.hidden = true; }

function drawPicker() {
  var q = picker.search.value.trim().toLowerCase();
  var rows = partsIn(picker.cats).filter(function (p) {
    if (!q) return true;
    var hay = [p.name, p.shortName, p.blurb].concat(p.alsoCalled || []).join(' ').toLowerCase();
    return hay.indexOf(q) > -1;
  });
  picker.list.textContent = '';
  if (!rows.length) {
    picker.list.appendChild(el('p', 'bb-pick-empty', 'No part matches that. Try the name printed on the part.'));
    return;
  }
  rows.forEach(function (p) {
    var taken = picker.chosen.indexOf(p.slug) > -1;
    var b = el('button', 'bb-pick');
    b.type = 'button';
    if (taken) b.disabled = true;
    var sw = el('span', 'bb-pick-swatch');
    sw.style.background = (CATEGORIES[p.category] || {}).color || '#9aa8c2';
    var body = el('span');
    body.appendChild(el('span', 'bb-pick-name', (p.shortName || p.name) + (taken ? '  (already on this card)' : '')));
    body.appendChild(el('span', 'bb-pick-blurb', p.blurb || ''));
    b.appendChild(sw);
    b.appendChild(body);
    b.addEventListener('click', function () {
      picker.onPick(p.slug);
      closePicker();
    });
    picker.list.appendChild(b);
  });
}

picker.search.addEventListener('input', drawPicker);
picker.node.addEventListener('click', function (e) {
  /* The close button holds an svg, so a click lands on the icon rather
     than the button. Walk up to whatever carries the attribute. */
  if (e.target.closest('[data-close]')) closePicker();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !picker.node.hidden) closePicker();
});

/* A row of chosen parts, plus the button that opens the picker. */
function partChips(slugs, cats, addLabel, pickTitle, pickSub, onChange, onRuleOut) {
  var wrap = el('div', 'bb-parts');
  slugs.forEach(function (slug) {
    var chip = el('span', 'bb-chip');
    var sw = el('span', 'bb-chip-cat');
    sw.style.background = partColor(slug);
    chip.appendChild(sw);
    chip.appendChild(el('span', 'bb-chip-name', partName(slug)));
    if (onRuleOut) {
      var ro = el('button', 'bb-chip-btn', 'Rule out');
      ro.type = 'button';
      ro.title = 'Move this part to the ruled out list';
      ro.addEventListener('click', function () { onRuleOut(slug); });
      chip.appendChild(ro);
    }
    var x = el('button', 'bb-chip-btn is-x', '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Remove ' + partName(slug));
    x.addEventListener('click', function () {
      onChange(slugs.filter(function (s) { return s !== slug; }));
    });
    chip.appendChild(x);
    wrap.appendChild(chip);
  });
  var add = el('button', 'bb-chip-add', addLabel);
  add.type = 'button';
  add.addEventListener('click', function () {
    openPicker(pickTitle, pickSub, cats, slugs, function (slug) {
      onChange(slugs.concat([slug]));
    });
  });
  wrap.appendChild(add);
  return wrap;
}

/* ── BLOCK DIAGRAM ────────────────────────────────────────────────── */

/* Hand-wrapped, because SVG will not wrap text for us. */
function wrap(text, perLine, maxLines) {
  var words = String(text || '').split(/\s+/).filter(Boolean);
  var lines = [], line = '';
  words.forEach(function (w) {
    if (!line) { line = w; }
    else if ((line + ' ' + w).length <= perLine) { line += ' ' + w; }
    else { lines.push(line); line = w; }
  });
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = lines[maxLines - 1].replace(/[,.;]?$/, '') + '…';
  }
  return lines;
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

/* Returns SVG markup for one card, or '' when there is nothing to draw.
   Screen and paper share one palette, because the page is paper
   coloured too. */
function diagramSVG(c) {
  if (!c.inParts.length && !c.outParts.length) return '';

  var ink   = '#16181c';
  var dim   = '#5c636e';
  var line  = '#c8cdd6';
  var fill  = '#f7f8fa';
  var midBg = '#eef1f5';

  var W = 760, BOX = 200, BH = 46, GAP = 12;
  var colX = [10, 280, 550];
  var rows = Math.max(c.inParts.length, c.outParts.length, 1);
  var body = rows * BH + (rows - 1) * GAP;
  var TOP = 34;
  var H = TOP + Math.max(body, 108) + 16;

  function colTop(n) { return TOP + (Math.max(body, 108) - (n * BH + (n - 1) * GAP)) / 2; }

  var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
          'font-family="Lexend, Helvetica, Arial, sans-serif" role="img" ' +
          'aria-label="Block diagram: what goes in, what happens in the middle, what comes out">';

  ['Senses', 'Decides', 'Acts'].forEach(function (t, i) {
    s += '<text x="' + (colX[i] + BOX / 2) + '" y="18" text-anchor="middle" font-size="11" ' +
         'font-family="JetBrains Mono, monospace" letter-spacing="2" fill="' + dim + '">' +
         t.toUpperCase() + '</text>';
  });

  function partBox(x, y, slug) {
    var p = partBySlug(slug);
    var cat = p && CATEGORIES[p.category] ? CATEGORIES[p.category] : { color: dim, short: '' };
    var out = '<rect x="' + x + '" y="' + y + '" width="' + BOX + '" height="' + BH + '" rx="7" ' +
              'fill="' + fill + '" stroke="' + line + '"/>';
    out += '<rect x="' + x + '" y="' + y + '" width="4" height="' + BH + '" rx="2" fill="' + cat.color + '"/>';
    out += '<text x="' + (x + 14) + '" y="' + (y + 20) + '" font-size="13" font-weight="600" fill="' + ink + '">' +
           esc(partName(slug)) + '</text>';
    out += '<text x="' + (x + 14) + '" y="' + (y + 36) + '" font-size="10.5" fill="' + dim + '">' +
           esc(cat.short || '') + '</text>';
    return out;
  }

  function arrow(x1, y1, x2) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + (x2 - 7) + '" y2="' + y1 + '" ' +
           'stroke="' + line + '" stroke-width="2"/>' +
           '<path d="M' + (x2 - 8) + ' ' + (y1 - 4.5) + ' L' + x2 + ' ' + y1 + ' L' + (x2 - 8) + ' ' + (y1 + 4.5) + 'Z" fill="' + line + '"/>';
  }

  var midY = TOP, midH = Math.max(body, 108);

  var yIn = colTop(c.inParts.length || 1);
  c.inParts.forEach(function (slug, i) {
    var y = yIn + i * (BH + GAP);
    s += partBox(colX[0], y, slug);
    s += arrow(colX[0] + BOX, y + BH / 2, colX[1]);
  });
  if (!c.inParts.length) {
    s += '<rect x="' + colX[0] + '" y="' + (TOP + midH / 2 - BH / 2) + '" width="' + BOX + '" height="' + BH +
         '" rx="7" fill="none" stroke="' + line + '" stroke-dasharray="5 4"/>';
    s += '<text x="' + (colX[0] + BOX / 2) + '" y="' + (TOP + midH / 2 + 5) + '" text-anchor="middle" font-size="12" fill="' + dim + '">No input part named yet</text>';
  }

  s += '<rect x="' + colX[1] + '" y="' + midY + '" width="' + BOX + '" height="' + midH + '" rx="7" ' +
       'fill="' + midBg + '" stroke="' + line + '" stroke-width="2"/>';
  var dec = wrap(c.deciding || 'What must it be deciding?', 26, 5);
  var startY = midY + midH / 2 - (dec.length - 1) * 8;
  dec.forEach(function (ln, i) {
    s += '<text x="' + (colX[1] + BOX / 2) + '" y="' + (startY + i * 16) + '" text-anchor="middle" font-size="12" fill="' +
         (c.deciding ? ink : dim) + '">' + esc(ln) + '</text>';
  });

  var yOut = colTop(c.outParts.length || 1);
  c.outParts.forEach(function (slug, i) {
    var y = yOut + i * (BH + GAP);
    s += arrow(colX[1] + BOX, y + BH / 2, colX[2]);
    s += partBox(colX[2], y, slug);
  });
  if (!c.outParts.length) {
    s += arrow(colX[1] + BOX, TOP + midH / 2, colX[2]);
    s += '<rect x="' + colX[2] + '" y="' + (TOP + midH / 2 - BH / 2) + '" width="' + BOX + '" height="' + BH +
         '" rx="7" fill="none" stroke="' + line + '" stroke-dasharray="5 4"/>';
    s += '<text x="' + (colX[2] + BOX / 2) + '" y="' + (TOP + midH / 2 + 5) + '" text-anchor="middle" font-size="12" fill="' + dim + '">No output part named yet</text>';
  }

  return s + '</svg>';
}

/* ── CARD VIEW ────────────────────────────────────────────────────── */

function renderCard(i) {
  var c = state.cards[i], slot = SLOTS[i];
  var stage = document.getElementById('stage');
  stage.textContent = '';

  var head = el('div', 'bb-slot');
  head.appendChild(el('span', 'bb-slot-num', String(i + 1)));
  head.appendChild(el('h2', 'bb-slot-brief', slot.brief));
  stage.appendChild(head);
  stage.appendChild(el('p', 'bb-slot-why', slot.why));

  var sc = cardScore(c);
  var meter = el('div', 'bb-meter');
  var track = el('div', 'bb-meter-track');
  var fillBar = el('div', 'bb-meter-fill');
  fillBar.style.width = Math.round(sc.done / sc.total * 100) + '%';
  track.appendChild(fillBar);
  meter.appendChild(track);
  meter.appendChild(el('span', 'bb-meter-text', sc.done + ' of ' + sc.total + ' things this card needs'));
  stage.appendChild(meter);

  function set(key) {
    return function (v) { c[key] = v; save(); refreshMeter(); };
  }
  function refreshMeter() {
    var s2 = cardScore(c);
    fillBar.style.width = Math.round(s2.done / s2.total * 100) + '%';
    meter.lastChild.textContent = s2.done + ' of ' + s2.total + ' things this card needs';
    drawTabs();
  }

  /* 1 — what it is */
  var b1 = block('01', 'What it is', 'Enough for somebody who has never seen it to picture the thing you are holding.');
  var g1 = el('div', 'bb-fields is-two');
  g1.appendChild(field('Product', c.name, 'Bosch dishwasher, model SMS4', set('name')));
  g1.appendChild(field('Who it is for', c.who, 'Whoever loads it, once a day', set('who')));
  g1.appendChild(field('What it costs', c.cost, 'About RMB 3,200 new', set('cost')));
  g1.appendChild(field('Where it lives', c.lives, 'Under a kitchen counter, plumbed in', set('lives')));
  b1.appendChild(g1);

  b1.appendChild(el('span', 'bb-label', 'A photo of it'));
  var photoWrap = el('div', 'bb-photo');
  if (c.photo) {
    var fig = el('div', 'bb-photo-has');
    var im = el('img', 'bb-photo-img');
    im.src = c.photo;
    im.alt = 'Your photo of ' + (c.name.trim() || 'this product');
    fig.appendChild(im);
    var side = el('div', 'bb-photo-side');
    side.appendChild(field('What the photo shows', c.photoCaption,
      'The control panel, with the half load button top right', set('photoCaption')));
    var drop = el('button', 'bb-chip-add', 'Remove this photo');
    drop.type = 'button';
    drop.addEventListener('click', function () {
      c.photo = null; c.photoCaption = ''; save(); render();
    });
    side.appendChild(drop);
    fig.appendChild(side);
    photoWrap.appendChild(fig);
  } else {
    var pick = el('button', 'bb-photo-drop');
    pick.type = 'button';
    pick.appendChild(el('span', 'bb-photo-drop-t', 'Add a photo of the product'));
    pick.appendChild(el('span', 'bb-photo-drop-s',
      'Take one on your phone, or choose a file. It is shrunk and kept in this browser, and it prints on the card.'));
    pick.addEventListener('click', function () { photoInput.click(); });
    photoWrap.appendChild(pick);
  }
  var photoInput = el('input');
  photoInput.type = 'file';
  photoInput.accept = 'image/*';
  photoInput.hidden = true;
  photoInput.addEventListener('change', function () {
    var f = photoInput.files[0];
    if (!f) return;
    note('Shrinking the photo…');
    readPhoto(f, function (dataUrl) {
      photoInput.value = '';
      if (!dataUrl) { note('That file did not open as an image.'); return; }
      c.photo = dataUrl;
      save();
      render();
    });
  });
  photoWrap.appendChild(photoInput);
  b1.appendChild(photoWrap);

  stage.appendChild(b1);

  /* 2 — sensing */
  var b2 = block('02', 'What it must be sensing',
    'If it wakes up when you walk towards it, it is sensing something. Say what, say how you know, then name the catalog parts that could do it. Ruling a part out with a reason is worth as much as picking one.');
  var g2 = el('div', 'bb-fields');
  g2.appendChild(field('What it must be sensing', c.sensing,
    'That the door has been shut, and how dirty the water is', set('sensing'), { type: 'area' }));
  g2.appendChild(field('Your evidence', c.evidence,
    'It refuses to start with the door open, and a heavy load runs longer than a light one', set('evidence'), { type: 'area' }));
  b2.appendChild(g2);

  b2.appendChild(el('span', 'bb-label', 'Parts that could sense it'));
  b2.appendChild(partChips(c.inParts, IN_CATS, '+ Add a part',
    'Which part could sense that?',
    'Sensors and controls from the class catalog. Pick every one that could plausibly do the job, then rule out the ones that could not.',
    function (next) { c.inParts = next; save(); render(); },
    function (slug) {
      c.inParts = c.inParts.filter(function (s) { return s !== slug; });
      if (!c.ruledOut.some(function (r) { return r.slug === slug; })) {
        c.ruledOut.push({ slug: slug, why: '' });
      }
      save(); render();
    }));

  if (c.ruledOut.length) {
    var ruled = el('div', 'bb-ruled');
    ruled.appendChild(el('span', 'bb-label', 'Ruled out, and how you know'));
    c.ruledOut.forEach(function (r, ri) {
      var row = el('div', 'bb-ruled-row');
      var sw = el('span', 'bb-chip-cat');
      sw.style.background = partColor(r.slug);
      row.appendChild(sw);
      row.appendChild(el('span', 'bb-ruled-name', partName(r.slug)));
      var why = el('input', 'bb-input');
      why.type = 'text';
      why.value = r.why;
      why.placeholder = 'It works in the dark, so it cannot be this';
      why.setAttribute('aria-label', 'Why ' + partName(r.slug) + ' is ruled out');
      why.addEventListener('input', function () { r.why = why.value; save(); refreshMeter(); });
      row.appendChild(why);
      var back = el('button', 'bb-chip-btn', 'Put back');
      back.type = 'button';
      back.addEventListener('click', function () {
        c.ruledOut.splice(ri, 1);
        if (c.inParts.indexOf(r.slug) < 0) c.inParts.push(r.slug);
        save(); render();
      });
      row.appendChild(back);
      ruled.appendChild(row);
    });
    b2.appendChild(ruled);
  }
  stage.appendChild(b2);

  /* 3 — deciding */
  var b3 = block('03', 'What it must be deciding',
    'Look for behaviour that a direct wire from input to output could not explain. A lamp on a switch decides nothing. A lamp that stays on for thirty seconds after you leave the room is deciding.');
  var g3 = el('div', 'bb-fields');
  g3.appendChild(field('What it must be deciding', c.deciding,
    'It waits until the water is hot enough before it starts the wash, and stops if the door opens mid cycle',
    set('deciding'), { type: 'area' }));
  b3.appendChild(g3);
  stage.appendChild(b3);

  /* 4 — acting */
  var b4 = block('04', 'What it does back',
    'What the product does so a person notices. Then name the catalog part that could produce it.');
  var g4 = el('div', 'bb-fields');
  g4.appendChild(field('What it does back', c.doesBack,
    'A red dot on the floor while it runs, and one long beep when it finishes', set('doesBack'), { type: 'area' }));
  b4.appendChild(g4);
  b4.appendChild(el('span', 'bb-label', 'Parts that could do it'));
  b4.appendChild(partChips(c.outParts, OUT_CATS, '+ Add a part',
    'Which part could do that?',
    'Outputs and displays from the class catalog.',
    function (next) { c.outParts = next; save(); render(); }));
  stage.appendChild(b4);

  /* 5 — diagram */
  var b5 = block('05', 'Your block diagram',
    'Drawn from the parts you named above. What goes in, what happens in the middle, what comes out. Named parts make your guess specific enough to be wrong, which is the point.');
  var dia = el('div', 'bb-diagram');
  var svg = diagramSVG(c);
  if (svg) dia.innerHTML = svg;
  else dia.appendChild(el('p', 'bb-diagram-empty', 'Name a part in 02 or 04 and your diagram draws itself here.'));
  b5.appendChild(dia);
  stage.appendChild(b5);

  /* 6 — power */
  var b6 = block('06', 'Power',
    'Every power choice costs the designer something else: size, weight, where it can live, how often somebody has to think about it.');
  var g6 = el('div', 'bb-fields is-two');
  g6.appendChild(field('Where the power comes from', c.powerSource, 'Choose one', set('powerSource'),
    { type: 'select', options: POWER }));
  g6.appendChild(field('What that choice forced the designer to do', c.powerForced,
    'Mains means it cannot move, so the controls all had to face the front', set('powerForced'), { type: 'area' }));
  b6.appendChild(g6);
  stage.appendChild(b6);

  /* 7 — controls and lights */
  var b7 = block('07', 'Controls and lights',
    'Every button and every indicator, and what a user has to already know before it makes sense to them.');
  var rows = el('div', 'bb-rows');
  c.controls.forEach(function (ctrl, ci) {
    var row = el('div', 'bb-row');
    var name = el('input', 'bb-input');
    name.type = 'text'; name.value = ctrl.label; name.placeholder = 'Half load button';
    name.setAttribute('aria-label', 'Control or indicator name');
    name.addEventListener('input', function () { ctrl.label = name.value; save(); refreshMeter(); });
    var kind = el('select', 'bb-select');
    ['Control', 'Indicator'].forEach(function (k) { kind.appendChild(new Option(k, k)); });
    kind.value = ctrl.kind || 'Control';
    kind.setAttribute('aria-label', 'Control or indicator');
    kind.addEventListener('change', function () { ctrl.kind = kind.value; save(); });
    var know = el('input', 'bb-input');
    know.type = 'text'; know.value = ctrl.mustKnow;
    know.placeholder = 'That half load means the top basket only';
    know.setAttribute('aria-label', 'What a user must already know');
    know.addEventListener('input', function () { ctrl.mustKnow = know.value; save(); });
    var del = el('button', 'bb-chip-btn is-x', '×');
    del.type = 'button';
    del.setAttribute('aria-label', 'Remove this row');
    del.addEventListener('click', function () { c.controls.splice(ci, 1); save(); render(); });
    row.appendChild(name); row.appendChild(kind); row.appendChild(know); row.appendChild(del);
    rows.appendChild(row);
  });
  b7.appendChild(rows);
  var addCtrl = el('button', 'bb-chip-add', '+ Add a button or a light');
  addCtrl.type = 'button';
  addCtrl.addEventListener('click', function () {
    c.controls.push({ label: '', kind: 'Control', mustKnow: '' });
    save(); render();
  });
  b7.appendChild(addCtrl);
  stage.appendChild(b7);

  /* 8 — copy and leave */
  var b8 = block('08', 'What you would copy, what you would leave behind',
    'One sentence each. These are the lines you will lift into your summary.');
  var g8 = el('div', 'bb-fields is-two');
  g8.appendChild(field('What you would copy', c.copyThis,
    'One light that means one thing, visible from across the room', set('copyThis'), { type: 'area' }));
  g8.appendChild(field('What you would leave behind', c.leaveThis,
    'Three buttons that each do something different when held down', set('leaveThis'), { type: 'area' }));
  b8.appendChild(g8);
  stage.appendChild(b8);

  /* 9 — check the guess */
  var b9 = block('09', 'Check your guess',
    'Many products have a repair video, or a page on iFixit where somebody has taken one apart and photographed the inside. Find one if it exists, then record where you were right and where you were wrong.');
  var g9 = el('div', 'bb-fields');
  g9.appendChild(field('Where you looked', c.checkUrl, 'A link, or the title of the video', set('checkUrl')));
  var g9b = el('div', 'bb-fields is-two');
  g9b.appendChild(field('Where you were right', c.checkRight,
    'There is a float switch, exactly where I guessed', set('checkRight'), { type: 'area' }));
  g9b.appendChild(field('Where you were wrong', c.checkWrong,
    'I said thermistor. It is a thermostat, which cannot report a number', set('checkWrong'), { type: 'area' }));
  b9.appendChild(g9);
  b9.appendChild(g9b);
  var n = el('p', 'bb-note');
  n.innerHTML = '<strong>Being wrong and saying so scores better than a vague card nobody can check.</strong> ' +
    'Do not keep your guesses vague to stay safe. Choose an answer, then go and find out.';
  b9.appendChild(n);
  stage.appendChild(b9);

  /* 10 — hand it in */
  var b10 = block('10', 'Download this card',
    'Saves the whole card as one PNG image, photo and diagram included. Name it something your teacher can find, then upload it.');
  var g10 = el('div', 'bb-fields');
  var nameRow = el('div', 'bb-download');
  var nameField = field('File name', c.fileName || defaultFileName(c, i),
    defaultFileName(c, i), function (v) { c.fileName = v; save(); });
  nameRow.appendChild(nameField);
  var suffix = el('span', 'bb-download-ext', '.png');
  nameRow.appendChild(suffix);
  var dl = el('button', 'bb-btn bb-btn-go', 'Download PNG');
  dl.type = 'button';
  dl.addEventListener('click', function () { downloadCard(i, dl); });
  nameRow.appendChild(dl);
  g10.appendChild(nameRow);
  b10.appendChild(g10);
  stage.appendChild(b10);
}

/* ── DOWNLOAD ONE CARD AS A PNG ───────────────────────────────────── */

function downloadCard(i, btn) {
  var c = state.cards[i];
  var was = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = 'Drawing…'; }

  BBCardPNG.render(c, i, {
    slotBrief: SLOTS[i].brief,
    student: state.student,
    partName: partName,
    partColor: partColor,
    partCat: function (slug) {
      var p = partBySlug(slug);
      return (p && CATEGORIES[p.category]) ? CATEGORIES[p.category].short : '';
    }
  }, function (canvas) {
    canvas.toBlob(function (blob) {
      var name = slugify(c.fileName) || defaultFileName(c, i);
      var a = el('a');
      a.href = URL.createObjectURL(blob);
      a.download = name + '.png';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      if (btn) { btn.disabled = false; btn.textContent = was; }
      note('Downloaded ' + name + '.png');
    }, 'image/png');
  });
}

/* ── SUMMARY VIEW ─────────────────────────────────────────────────── */

var SUM_ROWS = [
  ['Who for', function (c) { return c.who; }],
  ['Senses', function (c) { return c.sensing; }],
  ['Sensed with', function (c) { return c.inParts.map(partName).join(', '); }],
  ['Decides', function (c) { return c.deciding; }],
  ['Acts', function (c) { return c.doesBack; }],
  ['Acts with', function (c) { return c.outParts.map(partName).join(', '); }],
  ['Power', function (c) { return c.powerSource; }],
  ['Copy', function (c) { return c.copyThis; }],
  ['Leave behind', function (c) { return c.leaveThis; }]
];

function renderSummary() {
  var stage = document.getElementById('stage');
  stage.textContent = '';

  var head = el('div', 'bb-slot');
  head.appendChild(el('span', 'bb-slot-num', '∑'));
  head.appendChild(el('h2', 'bb-slot-brief', 'The summary page'));
  stage.appendChild(head);
  stage.appendChild(el('p', 'bb-slot-why',
    'Four good cards with no summary is a 5-6, because you gathered the analysis and then did nothing with it. The design implications are what lift it to 7-8.'));

  var b0 = block('00', 'Whose work this is', null);
  var g0 = el('div', 'bb-fields is-two');
  g0.appendChild(field('Your name', state.student, 'Printed on every sheet', function (v) { state.student = v; save(); }));
  g0.appendChild(field('Your client', state.client, 'Carried over from Ai', function (v) { state.client = v; save(); }));
  b0.appendChild(g0);
  stage.appendChild(b0);

  var b1 = block('01', 'All four against the same questions',
    'Built from your cards. If a cell is empty, go back to that card and fill it in.');
  var wrapT = el('div', 'bb-table-wrap');
  var t = el('table', 'bb-table');
  var thead = el('thead'), hr = el('tr');
  hr.appendChild(el('th', null, ''));
  state.cards.forEach(function (c, i) { hr.appendChild(el('th', null, c.name.trim() || 'Card ' + (i + 1))); });
  thead.appendChild(hr); t.appendChild(thead);
  var tb = el('tbody');
  SUM_ROWS.forEach(function (row) {
    var tr = el('tr');
    var th = el('th', null, row[0]);
    th.scope = 'row';
    tr.appendChild(th);
    state.cards.forEach(function (c) {
      var v = (row[1](c) || '').trim();
      tr.appendChild(el('td', v ? null : 'is-blank', v || 'not yet'));
    });
    tb.appendChild(tr);
  });
  t.appendChild(tb);
  wrapT.appendChild(t);
  b1.appendChild(wrapT);
  stage.appendChild(b1);

  var b2 = block('02', 'Design implications',
    'Three to five, each one in this shape: "Because …, my device should …". You will quote these again in Aiv and Bi, so write them properly now.');
  var list = el('div', 'bb-imp');
  state.implications.forEach(function (im, ii) {
    var row = el('div', 'bb-imp-row');
    row.appendChild(el('span', 'bb-imp-word', 'Because'));
    var a = el('input', 'bb-input');
    a.type = 'text'; a.value = im.because;
    a.placeholder = 'the kettle gives no sign it is still hot';
    a.setAttribute('aria-label', 'Because, implication ' + (ii + 1));
    a.addEventListener('input', function () { im.because = a.value; save(); drawTabs(); });
    row.appendChild(a);
    row.appendChild(el('span', 'bb-imp-word', 'my device should'));
    var bI = el('input', 'bb-input');
    bI.type = 'text'; bI.value = im.should;
    bI.placeholder = 'hold its warning light until the temperature is safe to touch';
    bI.setAttribute('aria-label', 'My device should, implication ' + (ii + 1));
    bI.addEventListener('input', function () { im.should = bI.value; save(); drawTabs(); });
    row.appendChild(bI);
    list.appendChild(row);
  });
  b2.appendChild(list);

  var btns = el('div', 'bb-parts');
  if (state.implications.length < 5) {
    var add = el('button', 'bb-chip-add', '+ Add another implication');
    add.type = 'button';
    add.addEventListener('click', function () {
      state.implications.push({ because: '', should: '' });
      save(); render();
    });
    btns.appendChild(add);
  }
  if (state.implications.length > 3) {
    var rm = el('button', 'bb-chip-add', '− Remove the last one');
    rm.type = 'button';
    rm.addEventListener('click', function () {
      state.implications.pop(); save(); render();
    });
    btns.appendChild(rm);
  }
  b2.appendChild(btns);

  var n = el('p', 'bb-note');
  n.innerHTML = 'Each implication has to come from something on a card above. ' +
    'If you cannot point at the card it came from, it is an opinion, and the summary is the part that gets marked.';
  b2.appendChild(n);
  stage.appendChild(b2);

  var b3 = block('03', 'Hand it in',
    'Download each card as its own PNG from the bottom of that card, then print this summary to PDF. That is the four images and the one PDF the task sheet asks for.');
  var row3 = el('div', 'bb-parts');
  state.cards.forEach(function (c, ci) {
    var one = el('button', 'bb-btn', 'Card ' + (ci + 1) + ' PNG');
    one.type = 'button';
    one.addEventListener('click', function () { downloadCard(ci, one); });
    row3.appendChild(one);
  });
  var go = el('button', 'bb-btn bb-btn-go', 'Print / PDF');
  go.type = 'button';
  go.addEventListener('click', doPrint);
  row3.appendChild(go);
  b3.appendChild(row3);
  stage.appendChild(b3);
}

/* ── TABS AND ROUTING ─────────────────────────────────────────────── */

function drawTabs() {
  var tabs = document.getElementById('tabs');
  tabs.textContent = '';
  for (var i = 0; i < 5; i++) {
    (function (i) {
      var isSum = i === 4;
      var sc = isSum ? summaryScore() : cardScore(state.cards[i]);
      var b = el('button', 'bb-tab');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(view === i));
      var dot = el('span', 'bb-tab-dot');
      if (sc.done >= sc.total) dot.className += ' is-done';
      else if (sc.done > 0) dot.className += ' is-part';
      b.appendChild(dot);
      b.appendChild(el('span', null, isSum ? 'Summary' : 'Card ' + (i + 1)));
      b.addEventListener('click', function () { view = i; render(); window.scrollTo(0, 0); });
      tabs.appendChild(b);
    })(i);
  }
}

function render() {
  drawTabs();
  if (view === 4) renderSummary(); else renderCard(view);
}

/* ── PRINT ────────────────────────────────────────────────────────── */

function pr(label, value, wide) {
  var v = String(value || '').trim();
  return '<div class="pr-b' + (wide ? ' is-wide' : '') + '">' +
    '<p class="pr-l">' + esc(label) + '</p>' +
    '<p class="pr-t' + (v ? '' : ' is-blank') + '">' + esc(v || 'Not filled in') + '</p></div>';
}

function printCard(c, i) {
  var h = '<section class="pr-card"><header class="pr-head">' +
    '<p class="pr-kicker"><span>Black Box Card ' + (i + 1) + ' of 4 &nbsp;/&nbsp; Aiii</span>' +
    '<span>' + esc(state.student || '') + '</span></p>' +
    '<h1 class="pr-title">' + esc(c.name.trim() || SLOTS[i].brief) + '</h1>' +
    '<p class="pr-sub">' + esc(SLOTS[i].brief) + '</p></header><div class="pr-grid">';

  if (c.photo) {
    h += '<div class="pr-b"><p class="pr-l">The product</p>' +
      '<img class="pr-photo" src="' + c.photo + '" alt="">' +
      (String(c.photoCaption || '').trim()
        ? '<p class="pr-cap">' + esc(c.photoCaption) + '</p>' : '') + '</div>';
  }
  h += pr('Who it is for', c.who);
  h += pr('What it costs', c.cost);
  h += pr('Where it lives', c.lives);
  h += pr('Power', c.powerSource);
  h += pr('What that power choice forced', c.powerForced);
  h += pr('What it must be sensing', c.sensing);
  h += pr('The evidence', c.evidence);

  h += '<div class="pr-b"><p class="pr-l">Parts that could sense it</p>' +
    (c.inParts.length
      ? '<ul class="pr-parts">' + c.inParts.map(function (s) {
          return '<li><b>' + esc(partName(s)) + '</b></li>'; }).join('') + '</ul>'
      : '<p class="pr-t is-blank">None named</p>') + '</div>';

  h += '<div class="pr-b"><p class="pr-l">Ruled out, and how I know</p>' +
    (c.ruledOut.length
      ? '<ul class="pr-parts">' + c.ruledOut.map(function (r) {
          return '<li><b>' + esc(partName(r.slug)) + '</b> &mdash; ' + esc(r.why || 'no reason given') + '</li>'; }).join('') + '</ul>'
      : '<p class="pr-t is-blank">Nothing ruled out</p>') + '</div>';

  h += pr('What it must be deciding', c.deciding, true);
  h += pr('What it does back', c.doesBack);

  h += '<div class="pr-b"><p class="pr-l">Parts that could do it</p>' +
    (c.outParts.length
      ? '<ul class="pr-parts">' + c.outParts.map(function (s) {
          return '<li><b>' + esc(partName(s)) + '</b></li>'; }).join('') + '</ul>'
      : '<p class="pr-t is-blank">None named</p>') + '</div>';

  var svg = diagramSVG(c);
  if (svg) {
    h += '<div class="pr-b is-wide"><p class="pr-l">Block diagram</p>' +
         svg.replace('<svg ', '<svg class="pr-dia" ') + '</div>';
  }

  h += '<div class="pr-b is-wide"><p class="pr-l">Controls and lights</p>' +
    (c.controls.length
      ? '<table class="pr-table"><thead><tr><th>What it is</th><th>Kind</th><th>What a user must already know</th></tr></thead><tbody>' +
        c.controls.map(function (x) {
          return '<tr><td>' + esc(x.label) + '</td><td>' + esc(x.kind) + '</td><td>' + esc(x.mustKnow) + '</td></tr>';
        }).join('') + '</tbody></table>'
      : '<p class="pr-t is-blank">None listed</p>') + '</div>';

  h += pr('What I would copy', c.copyThis);
  h += pr('What I would leave behind', c.leaveThis);

  if (c.checkUrl || c.checkRight || c.checkWrong) {
    h += pr('Where I checked', c.checkUrl, true);
    h += pr('Where I was right', c.checkRight);
    h += pr('Where I was wrong', c.checkWrong);
  }

  return h + '</div><footer class="pr-foot"><span>MYP Design / Grade 10 Electronics Design</span>' +
    '<span>Aiii / Black Box Card ' + (i + 1) + '</span></footer></section>';
}

function printSummary() {
  var h = '<section class="pr-card"><header class="pr-head">' +
    '<p class="pr-kicker"><span>Summary &nbsp;/&nbsp; Aiii</span><span>' + esc(state.student || '') + '</span></p>' +
    '<h1 class="pr-title">Four products, one set of questions</h1>' +
    '<p class="pr-sub">' + esc(state.client ? 'Client: ' + state.client : '') + '</p></header>';

  h += '<table class="pr-table"><thead><tr><th></th>' +
    state.cards.map(function (c, i) { return '<th>' + esc(c.name.trim() || 'Card ' + (i + 1)) + '</th>'; }).join('') +
    '</tr></thead><tbody>';
  SUM_ROWS.forEach(function (row) {
    h += '<tr><th>' + esc(row[0]) + '</th>' +
      state.cards.map(function (c) { return '<td>' + esc((row[1](c) || '').trim()) + '</td>'; }).join('') + '</tr>';
  });
  h += '</tbody></table>';

  h += '<div class="pr-b is-wide" style="margin-top:6mm"><p class="pr-l">Design implications</p><ol class="pr-imp">';
  var any = false;
  state.implications.forEach(function (im) {
    if (!im.because.trim() && !im.should.trim()) return;
    any = true;
    h += '<li>Because ' + esc(im.because.trim()) + ', my device should ' + esc(im.should.trim()) + '.</li>';
  });
  if (!any) h += '<li class="pr-t is-blank">No design implications written yet.</li>';
  h += '</ol></div>';

  return h + '<footer class="pr-foot"><span>MYP Design / Grade 10 Electronics Design</span>' +
    '<span>Aiii / Summary</span></footer></section>';
}

function doPrint() {
  var out = document.getElementById('printOut');
  if (!out) {
    out = el('div');
    out.id = 'printOut';
    document.body.appendChild(out);
  }
  out.innerHTML = state.cards.map(printCard).join('') + printSummary();
  window.print();
}

/* ── SAVE A COPY, OPEN A COPY, RESET ──────────────────────────────── */

document.getElementById('printBtn').addEventListener('click', doPrint);

document.getElementById('exportBtn').addEventListener('click', function () {
  var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  var a = el('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'black-box-cards' + (state.student ? '-' + state.student.trim().replace(/\s+/g, '-').toLowerCase() : '') + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
  note('Saved a copy to your downloads. Keep it, in case this browser forgets.');
});

var importFile = document.getElementById('importFile');
document.getElementById('importBtn').addEventListener('click', function () { importFile.click(); });
importFile.addEventListener('change', function () {
  var f = importFile.files[0];
  if (!f) return;
  var r = new FileReader();
  r.onload = function () {
    try {
      var got = JSON.parse(r.result);
      localStorage.setItem(KEY, JSON.stringify(got));
      state = load();
      render();
      note('Opened ' + f.name + '.');
    } catch (e) {
      note('That file did not open. It has to be one this tool saved.');
    }
    importFile.value = '';
  };
  r.readAsText(f);
});

document.getElementById('resetBtn').addEventListener('click', function () {
  if (!confirm('This erases all four cards and the summary. Save a copy first if you want to keep them. Carry on?')) return;
  localStorage.removeItem(KEY);
  state = blankState();
  view = 0;
  render();
  note('Cleared.');
});

render();

})();
