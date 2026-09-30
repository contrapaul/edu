/* a1.1.js — interactive widgets for A1.1 Ergonomics.
   Product-spotlight modals and the .case-photo lightbox are handled
   globally by curriculum.js. */

/* ── PERCENTILE LOOKUP TOOL (1.1.3) ──────────────────────────────
   Values below are clearly-labelled ILLUSTRATIVE placeholders, not a
   cited dataset — see expandedplans.md A1.1.3 for the sourcing task
   (mean + SD per cell) this table is meant to be replaced with. */
(function () {
  'use strict';
  var root = document.getElementById('calc-percentile');
  if (!root || !window.LiveCalc) return;
  var LC = window.LiveCalc;

  var DATA = {
    stature:             { label: 'Standing height (stature)', unit: 'cm',
      male: { mean: 175, sd: 7 }, female: { mean: 162, sd: 6.5 }, child: { mean: 140, sd: 10 }, elderly: { mean: 166, sd: 8 } },
    eyeHeightSeated:      { label: 'Seated eye height', unit: 'cm',
      male: { mean: 118, sd: 5 }, female: { mean: 109, sd: 4.5 }, child: { mean: 95, sd: 7 }, elderly: { mean: 112, sd: 6 } },
    elbowHeightSeated:    { label: 'Seated elbow height', unit: 'cm',
      male: { mean: 24, sd: 3 }, female: { mean: 23, sd: 3 }, child: { mean: 18, sd: 3 }, elderly: { mean: 23, sd: 3.5 } },
    elbowHeightStanding:  { label: 'Standing elbow height', unit: 'cm',
      male: { mean: 110, sd: 5 }, female: { mean: 102, sd: 4.5 }, child: { mean: 88, sd: 7 }, elderly: { mean: 104, sd: 6 } },
    handLength:           { label: 'Hand length', unit: 'cm',
      male: { mean: 19, sd: 1.2 }, female: { mean: 17.5, sd: 1 }, child: { mean: 15, sd: 1.5 }, elderly: { mean: 18, sd: 1.3 } },
    handBreadth:          { label: 'Hand breadth', unit: 'cm',
      male: { mean: 8.7, sd: 0.6 }, female: { mean: 7.6, sd: 0.5 }, child: { mean: 6.5, sd: 0.7 }, elderly: { mean: 8, sd: 0.6 } }
  };
  var POPULATION_LABELS = { male: 'adult male', female: 'adult female', child: 'child (8–12)', elderly: 'older adult (65+)' };
  var Z = { 5: -1.645, 50: 0, 95: 1.645 };

  var dimensionSelect = document.getElementById('pct-dimension');
  var populationSelect = document.getElementById('pct-population');
  var percentileSelect = document.getElementById('pct-percentile');
  var working = document.getElementById('pct-working');

  Object.keys(DATA).forEach(function (key) {
    var opt = document.createElement('option');
    opt.value = key;
    opt.textContent = DATA[key].label;
    dimensionSelect.appendChild(opt);
  });

  function update() {
    var dim = DATA[dimensionSelect.value];
    var pop = dim[populationSelect.value];
    var pctKey = percentileSelect.value;
    var z = Z[pctKey];
    var value = pop.mean + z * pop.sd;

    var lines = [];
    lines.push(pctKey + 'th percentile ' + dim.label.toLowerCase() + ', ' + POPULATION_LABELS[populationSelect.value] + ':');
    if (z === 0) {
      lines.push('50th percentile = mean = ' + pop.mean + ' ' + dim.unit);
    } else {
      lines.push((pctKey === '5' ? '5th' : '95th') + ' ≈ mean ' + (z < 0 ? '−' : '+') + ' 1.645 × SD = ' +
        pop.mean + ' ' + (z < 0 ? '−' : '+') + ' 1.645 × ' + pop.sd + ' = ' + LC.fmt(value, 1) + ' ' + dim.unit);
    }
    lines.push('≈ ' + LC.fmt(value, 1) + ' ' + dim.unit);

    LC.renderWorking(working, lines, lines.length - 1);
  }

  LC.wireLiveInputs([dimensionSelect, populationSelect, percentileSelect], update);
  update();
})();

/* ── WHERE DO YOU FIT ON THE CURVE? (1.1.2) ──────────────────────
   Height means (cm) come from the national survey rows in Wikipedia's
   "Human height by country" table (measured adults):
   - China: Lu et al. 2022, adults 18+, average age 48.
   - United States: NHANES 2015-2018 (Fryar et al. 2021), adults 20+.
   - Europe: Albania, Belarus, England, France, Germany, Moldova,
     Poland and Ukraine, weighted by population.
   - Global: the table gives no world figure, so this is the 15 most
     populous countries it covers (about 4.8 billion people), weighted
     by population.
   Population weights are rounded 2023 estimates. The table reports
   few standard deviations; the SD used here (men 6.9, women 6.4) is
   the median of those it does list. Foot and hand length are
   estimated from stature with fixed body proportions, so they are
   less reliable than height. */
(function () {
  'use strict';
  var svg = document.getElementById('curve-svg');
  if (!svg) return;

  var SD = { men: 6.9, women: 6.4 };
  var HEIGHT = {
    global:   { men: 168.3, women: 156.4 },
    usa:      { men: 175.3, women: 161.3 },
    europe:   { men: 174.6, women: 162.2 },
    china:    { men: 169.6, women: 158.9 }
  };
  /* Proportion of stature and SD (cm) for the estimated measures. */
  var FROM_STATURE = {
    foot: { label: 'foot length', men: [0.152, 1.3], women: [0.149, 1.1] },
    hand: { label: 'hand length', men: [0.109, 0.9], women: [0.1085, 0.85] }
  };

  var DATA = { height: { label: 'height' } };
  Object.keys(HEIGHT).forEach(function (r) {
    DATA.height[r] = { men: [HEIGHT[r].men, SD.men], women: [HEIGHT[r].women, SD.women] };
  });
  Object.keys(FROM_STATURE).forEach(function (key) {
    var f = FROM_STATURE[key];
    DATA[key] = { label: f.label };
    Object.keys(HEIGHT).forEach(function (r) {
      DATA[key][r] = {
        men: [Math.round(HEIGHT[r].men * f.men[0] * 10) / 10, f.men[1]],
        women: [Math.round(HEIGHT[r].women * f.women[0] * 10) / 10, f.women[1]]
      };
    });
  });
  var REGION_NAMES = { global: 'the global population', usa: 'the United States', europe: 'Europe', china: 'China' };
  var Z95 = 1.645;
  var NS = 'http://www.w3.org/2000/svg';
  var X0 = 30, X1 = 580, BASE = 225, TOP = 30;

  var measureSel = document.getElementById('curve-measure');
  var regionSel = document.getElementById('curve-region');
  var valueIn = document.getElementById('curve-value');
  var groupSel = document.getElementById('curve-group');
  var bandBox = document.getElementById('curve-band');
  var readout = document.getElementById('curve-readout');

  function mk(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n);
    return n;
  }
  function pdf(x, m, sd) { var z = (x - m) / sd; return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI)); }
  /* Normal cumulative distribution, via the Abramowitz and Stegun erf approximation. */
  function cdf(x, m, sd) {
    var z = (x - m) / (sd * Math.SQRT2), t = 1 / (1 + 0.3275911 * Math.abs(z));
    var e = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
    return 0.5 * (1 + (z < 0 ? -e : e));
  }
  function ordinal(n) {
    var s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  function r1(n) { return Math.round(n * 10) / 10; }

  function draw() {
    var measure = DATA[measureSel.value], set = measure[regionSel.value];
    /* The axis and vertical scale cover every region, so a region change visibly moves the curves. */
    var all = ['global', 'usa', 'europe', 'china'].map(function (r) { return measure[r]; });
    var lo = Math.floor(Math.min.apply(null, all.map(function (s) { return Math.min(s.men[0] - 3.5 * s.men[1], s.women[0] - 3.5 * s.women[1]); })));
    var hi = Math.ceil(Math.max.apply(null, all.map(function (s) { return Math.max(s.men[0] + 3.5 * s.men[1], s.women[0] + 3.5 * s.women[1]); })));
    var peak = Math.max.apply(null, all.map(function (s) { return Math.max(pdf(s.men[0], s.men[0], s.men[1]), pdf(s.women[0], s.women[0], s.women[1])); }));
    function sx(v) { return X0 + (v - lo) / (hi - lo) * (X1 - X0); }
    function sy(p) { return BASE - p / peak * (BASE - TOP); }

    svg.innerHTML = '';
    /* Axis and ticks */
    mk('line', { x1: X0, y1: BASE, x2: X1, y2: BASE, 'class': 'curve-axis' }, svg);
    var span = hi - lo, step = span > 40 ? 10 : span > 8 ? 1 : 0.5;
    for (var t = Math.ceil(lo / step) * step; t <= hi; t += step) {
      mk('line', { x1: sx(t), y1: BASE, x2: sx(t), y2: BASE + 5, 'class': 'curve-axis' }, svg);
      mk('text', { x: sx(t), y: BASE + 18, 'class': 'curve-tick' }, svg).textContent = r1(t);
    }
    mk('text', { x: X1, y: BASE + 36, 'class': 'curve-tick curve-unit' }, svg).textContent = measure.label + ' (cm)';

    ['men', 'women'].forEach(function (g) {
      var m = set[g][0], sd = set[g][1];
      var d = '', a = m - 3.5 * sd, b = m + 3.5 * sd;
      for (var i = 0; i <= 120; i++) {
        var x = a + (b - a) * i / 120;
        d += (i ? ' L' : 'M') + sx(x).toFixed(1) + ',' + sy(pdf(x, m, sd)).toFixed(1);
      }
      if (bandBox.checked) {
        var p5 = m - Z95 * sd, p95 = m + Z95 * sd, band = 'M' + sx(p5) + ',' + BASE;
        for (var j = 0; j <= 60; j++) {
          var xb = p5 + (p95 - p5) * j / 60;
          band += ' L' + sx(xb).toFixed(1) + ',' + sy(pdf(xb, m, sd)).toFixed(1);
        }
        band += ' L' + sx(p95) + ',' + BASE + ' Z';
        mk('path', { d: band, 'class': 'curve-band curve-band--' + g }, svg);
        [p5, p95].forEach(function (v) {
          mk('line', { x1: sx(v), y1: BASE, x2: sx(v), y2: sy(pdf(v, m, sd)), 'class': 'curve-pline curve-pline--' + g }, svg);
        });
      }
      mk('path', { d: d, 'class': 'curve-line curve-line--' + g }, svg);
      mk('line', { x1: sx(m), y1: BASE, x2: sx(m), y2: sy(pdf(m, m, sd)), 'class': 'curve-mean curve-mean--' + g }, svg);
    });

    var v = parseFloat(valueIn.value);
    if (isFinite(v) && v >= lo && v <= hi) {
      var mx = sx(v);
      mk('line', { x1: mx, y1: TOP - 12, x2: mx, y2: BASE, 'class': 'curve-marker' }, svg);
      mk('text', { x: mx, y: TOP - 16, 'class': 'curve-marker-label' }, svg).textContent = 'You: ' + v;
    }
    report(measure, set, v, lo, hi);
  }

  function line(text, cls) {
    var p = document.createElement('p');
    p.className = 'diagram-readout-line' + (cls ? ' ' + cls : '');
    p.textContent = text;
    readout.appendChild(p);
  }

  function report(measure, set, v, lo, hi) {
    readout.innerHTML = '';
    var where = REGION_NAMES[regionSel.value];
    line('Average ' + measure.label + ' in ' + where + ': men ' + set.men[0] + ' cm, women ' + set.women[0] + ' cm.');
    if (bandBox.checked) {
      line('5th to 95th percentile: men ' + r1(set.men[0] - Z95 * set.men[1]) + ' to ' + r1(set.men[0] + Z95 * set.men[1]) +
        ' cm, women ' + r1(set.women[0] - Z95 * set.women[1]) + ' to ' + r1(set.women[0] + Z95 * set.women[1]) + ' cm. Each shaded band holds 90% of its group.');
    }
    if (valueIn.value === '') return;
    if (!isFinite(v) || v < lo || v > hi) {
      line('That value is outside the range this data covers (' + r1(lo) + ' to ' + r1(hi) + ' cm). Check that it is in centimetres.', 'curve-warn');
      return;
    }
    var g = groupSel.value, other = g === 'men' ? 'women' : 'men';
    var pct = Math.round(cdf(v, set[g][0], set[g][1]) * 100);
    var pctOther = Math.round(cdf(v, set[other][0], set[other][1]) * 100);
    pct = Math.min(99, Math.max(1, pct));
    pctOther = Math.min(99, Math.max(1, pctOther));
    line(v + ' cm is at about the ' + ordinal(pct) + ' percentile for ' + g + ' in ' + where +
      ', so it is the same as or more than about ' + pct + '% of them. Among ' + other + ' it would be the ' + ordinal(pctOther) + ' percentile.', 'curve-result');
    if (pct < 5) {
      line('This is below the 5th percentile. A product designed for the 5th to 95th percentile range of ' + g + ' would leave you out, so you would find reach-critical dimensions too far away.');
    } else if (pct > 95) {
      line('This is above the 95th percentile. A product designed for the 5th to 95th percentile range of ' + g + ' would leave you out, so you would find clearance-critical dimensions too tight.');
    } else {
      line('This is inside the 5th to 95th percentile range, the 90% of users that most products are designed to fit.');
    }
  }

  [measureSel, regionSel, groupSel, bandBox].forEach(function (el) { el.addEventListener('change', draw); });
  valueIn.addEventListener('input', draw);
  draw();
})();

/* ── STATIC OR DYNAMIC? (1.1.2) ──────────────────────────────────
   A figure built from rounded shapes and drawn to scale from the chosen
   height and weight. Body proportions are rule-of-thumb fractions of
   stature; the shoulder range for each age group is a typical value.
   Static data depends only on body size, dynamic data also on age and
   mobility, so two people of the same height can give different
   dynamic results. Poses snap rather than animate. */
(function () {
  'use strict';
  var svg = document.getElementById('anthro-svg');
  if (!svg) return;

  var NS = 'http://www.w3.org/2000/svg';
  var S = 1.6, GY = 428, CX = 210;
  var SHOULDER_RANGE = { 20: 180, 45: 170, 75: 150 };
  var LIMITED_RANGE = 110;

  var heightIn = document.getElementById('anthro-height');
  var weightIn = document.getElementById('anthro-weight');
  var ageSel = document.getElementById('anthro-age');
  var mobSel = document.getElementById('anthro-mobility');
  var staticBtn = document.getElementById('anthro-static');
  var dynamicBtn = document.getElementById('anthro-dynamic');
  var readout = document.getElementById('anthro-readout');
  /* mode is the pose on screen; collected keeps each data set in the
     readout once taken, so both can be compared side by side. */
  var mode = null;
  var collected = { static: false, dynamic: false };

  function mk(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(n);
    return n;
  }
  function limb(x1, y1, x2, y2, w, cls) {
    mk('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'stroke-width': w, 'class': 'anthro-limb ' + (cls || '') });
  }
  function dim(x1, y1, x2, y2, label, lx, ly, anchor) {
    mk('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': 'anthro-dim' });
    var dx = y2 - y1, dy = x1 - x2, len = Math.sqrt(dx * dx + dy * dy) || 1;
    dx = dx / len * 5; dy = dy / len * 5;
    mk('line', { x1: x1 - dx, y1: y1 - dy, x2: x1 + dx, y2: y1 + dy, 'class': 'anthro-dim' });
    mk('line', { x1: x2 - dx, y1: y2 - dy, x2: x2 + dx, y2: y2 + dy, 'class': 'anthro-dim' });
    mk('text', { x: lx, y: ly, 'class': 'anthro-dim-label', 'text-anchor': anchor || 'middle' }).textContent = label;
  }

  function measure() {
    var H = +heightIn.value, W = +weightIn.value;
    var build = Math.min(1.7, Math.max(0.75, (W / Math.pow(H / 100, 2)) / 22));
    var range = SHOULDER_RANGE[ageSel.value];
    if (mobSel.value === 'limited') range = Math.min(range, LIMITED_RANGE);
    var arm = 0.44 * H, shoulderH = 0.818 * H;
    var rad = range * Math.PI / 180;
    return {
      H: H, W: W, build: build, arm: arm, shoulderH: shoulderH, range: range,
      breadth: 0.259 * H * (0.85 + 0.15 * build),
      reach: shoulderH + Math.max(0, -Math.cos(rad)) * arm
    };
  }

  function draw() {
    var m = measure(), H = m.H, b = m.build;
    document.getElementById('anthro-height-val').textContent = H;
    document.getElementById('anthro-weight-val').textContent = m.W;
    svg.innerHTML = '';
    mk('line', { x1: 10, y1: GY, x2: 410, y2: GY, 'class': 'anthro-ground' });

    var px = function (cm) { return cm * S; };
    var shY = GY - px(m.shoulderH), hipY = GY - px(0.53 * H);
    var shX = px(m.breadth) / 2 - px(0.02 * H) * b;
    var hipX = px(0.085 * H) * (0.7 + 0.3 * b);
    var armW = px(0.034 * H) * Math.pow(b, 0.7), legW = px(0.052 * H) * Math.pow(b, 0.7);
    var headR = px(0.062 * H), headY = GY - px(H) + headR;
    var armL = px(m.arm);

    /* Legs */
    [-1, 1].forEach(function (s) {
      limb(CX + s * hipX * 0.55, hipY, CX + s * hipX * 0.7, GY - legW / 2, legW, 'anthro-leg');
    });
    /* Torso: a rounded trapezoid from the shoulders to the hips */
    var tw = armW / 2;
    mk('path', { d: 'M' + (CX - shX) + ',' + (shY - tw * 0.3) + ' L' + (CX + shX) + ',' + (shY - tw * 0.3) +
      ' L' + (CX + hipX) + ',' + (hipY + legW * 0.3) + ' L' + (CX - hipX) + ',' + (hipY + legW * 0.3) + ' Z',
      'class': 'anthro-torso', 'stroke-width': armW });
    /* Arms: the left always hangs; the right is raised in dynamic mode */
    var hang = 10 * Math.PI / 180;
    limb(CX - shX, shY, CX - shX - Math.sin(hang) * armL, shY + Math.cos(hang) * armL, armW);
    var rAng = mode === 'dynamic' ? m.range * Math.PI / 180 : hang;
    var tipX = CX + shX + Math.sin(rAng) * armL, tipY = shY + Math.cos(rAng) * armL;
    limb(CX + shX, shY, tipX, tipY, armW, mode === 'dynamic' ? 'anthro-raised' : '');
    /* Neck and head */
    limb(CX, shY, CX, headY + headR, armW * 0.9);
    mk('circle', { cx: CX, cy: headY, r: headR, 'class': 'anthro-head' });

    if (mode === 'static') {
      dim(40, GY, 40, GY - px(H), 'Stature', 46, GY - px(H) / 2, 'start');
      var byY = shY - armW - 8;
      dim(CX - px(m.breadth) / 2, byY, CX + px(m.breadth) / 2, byY, 'Shoulder breadth', CX - px(m.breadth) / 2 - 8, byY + 4, 'end');
      var ox = -Math.cos(hang) * 16, oy = -Math.sin(hang) * 16;
      var lx1 = CX - shX + ox, ly1 = shY + oy, lx2 = CX - shX - Math.sin(hang) * armL + ox, ly2 = shY + Math.cos(hang) * armL + oy;
      dim(lx1, ly1, lx2, ly2, 'Arm length', lx2 - 6, ly2 + 16, 'middle');
    }
    if (mode === 'dynamic') {
      var r = armL, a0 = hang, a1 = rAng;
      var sx0 = CX + shX + Math.sin(a0) * r, sy0 = shY + Math.cos(a0) * r;
      mk('path', { d: 'M' + sx0 + ',' + sy0 + ' A' + r + ',' + r + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 0 ' + tipX + ',' + tipY, 'class': 'anthro-arc' });
      mk('text', { x: CX + shX + 14, y: shY + 28, 'class': 'anthro-dim-label', 'text-anchor': 'start' }).textContent = m.range + '°';
      var reachY = GY - px(m.reach);
      mk('line', { x1: tipX, y1: reachY, x2: 392, y2: reachY, 'class': 'anthro-guide' });
      dim(392, GY, 392, reachY, 'Overhead reach', 386, reachY - 8, 'end');
    }
    report(m);
  }

  function row(label, value) {
    var p = document.createElement('p');
    p.className = 'diagram-readout-line';
    if (label) {
      var s = document.createElement('span'); s.className = 'anthro-key'; s.textContent = label;
      p.appendChild(s);
    }
    p.appendChild(document.createTextNode(value));
    readout.appendChild(p);
  }
  function heading(text) {
    var h = document.createElement('p');
    h.className = 'diagram-readout-line anthro-head-line';
    h.textContent = text;
    readout.appendChild(h);
  }

  function report(m) {
    readout.innerHTML = '';
    var r = function (n) { return Math.round(n) + ' cm'; };
    heading('Static data');
    if (collected.static) {
      row('Stature', r(m.H));
      row('Shoulder breadth', r(m.breadth));
      row('Arm length', r(m.arm));
    } else {
      row('', 'Not collected yet.');
    }
    heading('Dynamic data');
    if (collected.dynamic) {
      row('Shoulder range', m.range + '°');
      row('Overhead reach', r(m.reach));
    } else {
      row('', 'Not collected yet.');
    }
    var note = document.createElement('p');
    note.className = 'diagram-readout-line anthro-note';
    note.textContent = mode === 'dynamic'
      ? 'Overhead reach depends on how far the shoulder can move as well as on arm length, so age or an injury changes it even when the body is the same size.'
      : mode === 'static'
        ? 'These are taken with the body still, so they depend only on its size. Change the age or mobility and collect again: nothing here changes.'
        : 'Choose which type of data to collect.';
    if (collected.static && collected.dynamic) {
      note.textContent = 'Now change the age or the shoulder mobility and watch the two sets of data: the static figures stay the same, the dynamic ones do not.';
    }
    readout.appendChild(note);
  }

  staticBtn.addEventListener('click', function () { mode = 'static'; collected.static = true; setActive(); draw(); });
  dynamicBtn.addEventListener('click', function () { mode = 'dynamic'; collected.dynamic = true; setActive(); draw(); });
  function setActive() {
    staticBtn.classList.toggle('is-active', mode === 'static');
    dynamicBtn.classList.toggle('is-active', mode === 'dynamic');
  }
  [heightIn, weightIn].forEach(function (el) { el.addEventListener('input', draw); });
  [ageSel, mobSel].forEach(function (el) { el.addEventListener('change', draw); });
  draw();
})();
