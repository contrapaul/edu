/* b3.2.js — interactive widgets for B3.2 Structural Systems Application.
   Case-study modals and the .case-photo lightbox are handled globally
   by curriculum.js. */

/* ── NUMERIC LOAD SIMULATOR (3.2.4) — the most complex of the three
   diagram widgets: real (if simplified) statics for a simply-supported
   beam under a point load or full-span UDL. Verified against the
   page's own worked example (L=6, P=10 at a=2 → R_A=6.67, R_B=3.33). */
(function () {
  'use strict';
  var root = document.getElementById('simulator-b324');
  if (!root || !window.DiagramUtils || !window.LiveCalc) return;
  var LC = window.LiveCalc;

  var spanInput = document.getElementById('sim-b324-span');
  var spanField = spanInput.closest('.live-calc-field');
  var loadTypeSelect = document.getElementById('sim-b324-loadtype');
  var pointFieldsWrap = document.getElementById('sim-b324-point-fields');
  var udlFieldsWrap = document.getElementById('sim-b324-udl-fields');
  var pointMagInput = document.getElementById('sim-b324-point-mag');
  var pointMagField = pointMagInput.closest('.live-calc-field');
  var pointPosInput = document.getElementById('sim-b324-point-pos');
  var pointPosField = pointPosInput.closest('.live-calc-field');
  var udlMagInput = document.getElementById('sim-b324-udl-mag');
  var udlMagField = udlMagInput.closest('.live-calc-field');

  var fbdSvg = document.getElementById('sim-b324-fbd');
  var sfdSvg = document.getElementById('sim-b324-sfd');
  var bmdSvg = document.getElementById('sim-b324-bmd');
  var readout = document.getElementById('sim-b324-readout');

  var MARGIN = 50, WIDTH = 600;

  function svgEl(tag, attrs, text) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function xMap(x, L) { return MARGIN + (x / L) * (WIDTH - 2 * MARGIN); }

  function svgLabel(x, y, text) {
    return svgEl('text', { x: x, y: y, 'text-anchor': 'middle', fill: 'var(--muted)', 'font-size': '11', 'font-family': 'var(--font-mono)' }, text);
  }

  loadTypeSelect.addEventListener('change', function () {
    var isPoint = loadTypeSelect.value === 'point';
    pointFieldsWrap.hidden = !isPoint;
    udlFieldsWrap.hidden = isPoint;
    update();
  });

  function computeBeam(L, type, mag, pos) {
    if (type === 'point') {
      var a = pos;
      var RB = mag * a / L;
      var RA = mag - RB;
      return {
        RA: RA, RB: RB,
        shearPts: [{ x: 0, y: RA }, { x: a, y: RA }, { x: a, y: -RB }, { x: L, y: -RB }],
        momentPts: [{ x: 0, y: 0 }, { x: a, y: RA * a }, { x: L, y: 0 }],
        maxMoment: RA * a,
        maxMomentX: a
      };
    }
    var RA2 = mag * L / 2, RB2 = mag * L / 2;
    var n = 30, momentPts = [];
    for (var i = 0; i <= n; i++) {
      var x = (i / n) * L;
      momentPts.push({ x: x, y: (mag * x / 2) * (L - x) });
    }
    return {
      RA: RA2, RB: RB2,
      shearPts: [{ x: 0, y: RA2 }, { x: L, y: -RB2 }],
      momentPts: momentPts,
      maxMoment: mag * L * L / 8,
      maxMomentX: L / 2
    };
  }

  function drawFBD(L, type, mag, pos) {
    fbdSvg.innerHTML = '';
    var y = 75;
    var ax = xMap(0, L), bx = xMap(L, L);

    fbdSvg.appendChild(svgEl('line', { x1: ax, y1: y, x2: bx, y2: y, stroke: 'var(--text)', 'stroke-width': 3 }));

    fbdSvg.appendChild(svgEl('polygon', { points: (ax - 12) + ',' + (y + 22) + ' ' + (ax + 12) + ',' + (y + 22) + ' ' + ax + ',' + y, fill: 'var(--surface)', stroke: 'var(--text)', 'stroke-width': 2 }));
    fbdSvg.appendChild(svgLabel(ax, y + 38, 'A — pinned'));

    fbdSvg.appendChild(svgEl('polygon', { points: (bx - 12) + ',' + (y + 18) + ' ' + (bx + 12) + ',' + (y + 18) + ' ' + bx + ',' + y, fill: 'var(--surface)', stroke: 'var(--text)', 'stroke-width': 2 }));
    fbdSvg.appendChild(svgEl('circle', { cx: bx - 6, cy: y + 23, r: 4, fill: 'var(--surface)', stroke: 'var(--text)', 'stroke-width': 1.5 }));
    fbdSvg.appendChild(svgEl('circle', { cx: bx + 6, cy: y + 23, r: 4, fill: 'var(--surface)', stroke: 'var(--text)', 'stroke-width': 1.5 }));
    fbdSvg.appendChild(svgLabel(bx, y + 42, 'B — roller'));

    function upArrow(x) {
      fbdSvg.appendChild(svgEl('line', { x1: x, y1: y + 20, x2: x, y2: y + 3, stroke: '#166534', 'stroke-width': 2.5 }));
      fbdSvg.appendChild(svgEl('polygon', { points: (x - 4) + ',' + (y + 7) + ' ' + (x + 4) + ',' + (y + 7) + ' ' + x + ',' + y, fill: '#166534' }));
    }
    upArrow(ax);
    upArrow(bx);

    if (type === 'point') {
      var lx = xMap(pos, L);
      fbdSvg.appendChild(svgEl('line', { x1: lx, y1: y - 42, x2: lx, y2: y - 3, stroke: '#dc2626', 'stroke-width': 2.5 }));
      fbdSvg.appendChild(svgEl('polygon', { points: (lx - 5) + ',' + (y - 9) + ' ' + (lx + 5) + ',' + (y - 9) + ' ' + lx + ',' + y, fill: '#dc2626' }));
      fbdSvg.appendChild(svgLabel(lx, y - 48, mag + ' kN'));
    } else {
      for (var i = 0; i <= 8; i++) {
        var x = xMap((i / 8) * L, L);
        fbdSvg.appendChild(svgEl('line', { x1: x, y1: y - 26, x2: x, y2: y - 3, stroke: '#dc2626', 'stroke-width': 1.5 }));
        fbdSvg.appendChild(svgEl('polygon', { points: (x - 3) + ',' + (y - 7) + ' ' + (x + 3) + ',' + (y - 7) + ' ' + x + ',' + y, fill: '#dc2626' }));
      }
      fbdSvg.appendChild(svgLabel(xMap(L / 2, L), y - 32, mag + ' kN/m'));
    }
  }

  function drawDiagram(svg, pts, L, color) {
    svg.innerHTML = '';
    var height = 130;
    var midY = height / 2;
    var maxAbs = Math.max.apply(null, pts.map(function (p) { return Math.abs(p.y); }).concat([0.001]));
    var scale = (midY - 20) / maxAbs;

    function svgY(y) { return midY - y * scale; }

    svg.appendChild(svgEl('line', { x1: MARGIN, y1: midY, x2: WIDTH - MARGIN, y2: midY, stroke: 'var(--border-strong)', 'stroke-width': 1 }));

    var d = 'M ' + xMap(pts[0].x, L) + ' ' + svgY(pts[0].y);
    for (var i = 1; i < pts.length; i++) {
      d += ' L ' + xMap(pts[i].x, L) + ' ' + svgY(pts[i].y);
    }
    var areaD = d + ' L ' + xMap(pts[pts.length - 1].x, L) + ' ' + midY + ' L ' + xMap(pts[0].x, L) + ' ' + midY + ' Z';
    svg.appendChild(svgEl('path', { d: areaD, fill: color, 'fill-opacity': '0.15', stroke: 'none' }));
    svg.appendChild(svgEl('path', { d: d, fill: 'none', stroke: color, 'stroke-width': 2.5 }));
    svg.appendChild(svgLabel(MARGIN - 15, svgY(0) + 4, '0'));
  }

  function update() {
    var L = parseFloat(spanInput.value);
    LC.clearFieldError(spanField);
    if (isNaN(L) || L <= 0) { LC.setFieldError(spanField, 'Must be greater than 0'); return; }

    var type = loadTypeSelect.value;
    var mag, pos;

    if (type === 'point') {
      mag = parseFloat(pointMagInput.value);
      pos = parseFloat(pointPosInput.value);
      LC.clearFieldError(pointMagField);
      LC.clearFieldError(pointPosField);
      if (isNaN(mag) || mag <= 0) { LC.setFieldError(pointMagField, 'Must be greater than 0'); return; }
      if (isNaN(pos) || pos <= 0 || pos >= L) { LC.setFieldError(pointPosField, 'Must be between 0 and L'); return; }
    } else {
      mag = parseFloat(udlMagInput.value);
      LC.clearFieldError(udlMagField);
      if (isNaN(mag) || mag <= 0) { LC.setFieldError(udlMagField, 'Must be greater than 0'); return; }
    }

    var result = computeBeam(L, type, mag, pos);

    drawFBD(L, type, mag, pos);
    drawDiagram(sfdSvg, result.shearPts, L, '#1a5cb8');
    drawDiagram(bmdSvg, result.momentPts, L, '#8b6520');

    var lines = [];
    lines.push('Taking moments about A: ΣM_A = 0 → R_B = ' + LC.fmt(result.RB) + ' kN');
    lines.push('ΣF vertical = 0 → R_A = ' + LC.fmt(result.RA) + ' kN');
    lines.push('Maximum bending moment = ' + LC.fmt(result.maxMoment) + ' kN·m, at x = ' + LC.fmt(result.maxMomentX) + ' m (where shear force crosses zero)');
    LC.renderWorking(readout, lines, lines.length - 1);
  }

  LC.wireLiveInputs([spanInput, loadTypeSelect, pointMagInput, pointPosInput, udlMagInput], update);

  update();
})();
