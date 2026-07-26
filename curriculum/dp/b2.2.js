/* b2.2.js — interactive widgets for B2.2 Modelling and Prototyping.
   Case-study modals and the .case-photo lightbox are handled globally
   by curriculum.js. */

/* ── FEA INTERPRETATION (2.2.4) — the contour plot is pre-authored, not
   solved, so the numbers below are illustrative. What is not invented is
   the ordering: a fillet removes a stress concentration, a gusset moves
   it, and thickening only lowers the nominal stress underneath it.
   Establishes the click-on-SVG + live-redraw pattern the other two
   diagram widgets (A3.2.7, B3.2.4) reuse. ───────────────────────── */
(function () {
  'use strict';
  var root = document.getElementById('fea-b224');
  if (!root || !window.DiagramUtils) return;
  var DU = window.DiagramUtils;

  var svg = document.getElementById('fea-b224-svg');
  var part = document.getElementById('fea-b224-part');
  var clipShape = document.getElementById('fea-b224-clipshape');
  var outline = document.getElementById('fea-b224-outline');
  var hot = document.getElementById('fea-b224-hot');
  var marker = document.getElementById('fea-b224-marker');
  var actions = document.getElementById('fea-b224-actions');
  var readout = document.getElementById('fea-b224-readout');

  var CORNER = { x: 110, y: 95 };
  var PROMPT = 'Red is high stress, blue is low. Click the region you think fails first.';

  var STATES = {
    base: {
      d: 'M60,50 L400,50 L400,95 L110,95 L110,250 L60,250 Z',
      cx: 112, cy: 97, r: 95,
      note: 'Baseline: sharp inside corner. Pick a fix and watch what happens to the red.'
    },
    fillet: {
      d: 'M60,50 L400,50 L400,95 L140,95 A30,30 0 0 0 110,125 L110,250 L60,250 Z',
      cx: 119, cy: 104, r: 62,
      note: 'Fillet R30: peak stress 58% of baseline, mass +1%. This is the only fix that treats the cause. A sharp inside corner concentrates stress no matter how strong the material is, and rounding it spreads the same load over more of the part.'
    },
    rib: {
      d: 'M60,50 L400,50 L400,95 L190,95 L110,175 L110,250 L60,250 Z',
      cx: 190, cy: 97, r: 72,
      note: 'Gusset: peak stress 54% of baseline, mass +7%. It shortens the span the load bends. Notice the hot spot has moved to the end of the gusset though, because stiffening a part relocates a concentration at least as often as it removes one.'
    },
    thicker: {
      d: 'M60,50 L400,50 L400,112 L127,112 L127,250 L60,250 Z',
      cx: 129, cy: 114, r: 88,
      note: 'Thicker throughout: peak stress 61% of baseline, mass +33%. Stress drops everywhere, but the corner is still sharp and still concentrating it, so you spent a third of the part\'s weight treating a symptom.'
    }
  };

  function show(name) {
    var s = STATES[name];
    part.setAttribute('d', s.d);
    clipShape.setAttribute('d', s.d);
    outline.setAttribute('d', s.d);
    hot.setAttribute('cx', s.cx);
    hot.setAttribute('cy', s.cy);
    hot.setAttribute('r', s.r);
    return s.note;
  }

  function say(lines) {
    readout.innerHTML = '';
    lines.forEach(function (text) {
      var p = document.createElement('p');
      p.className = 'diagram-readout-line';
      p.textContent = text;
      readout.appendChild(p);
    });
  }

  /* Step 1: where does it fail? The wrong answers are worth more than the
     right one, so each gets its own correction. */
  function verdict(x, y) {
    var toCorner = Math.sqrt(Math.pow(x - CORNER.x, 2) + Math.pow(y - CORNER.y, 2));
    if (toCorner < 60) {
      return 'Correct. Two things stack up at the inside corner: the bending moment from the load is largest at the root of the arm, and the abrupt change in geometry concentrates that stress into a small area.';
    }
    if (x > 280 && y < 100) {
      return 'Not quite, and this is the most common answer. The load point is where the force goes in, but it is the least stressed part of the arm. Bending moment builds with distance from the load, so the peak sits at the far end of the arm, at the inside corner.';
    }
    if (x < 110) {
      return 'Close. The bolted edge does carry high stress, but the inside corner reads hotter because the sharp geometry squeezes the same load through a smaller area.';
    }
    return 'Not there. Follow the colours to the reddest point, at the sharp inside corner where the two arms meet.';
  }

  var answered = false;

  svg.addEventListener('click', function (evt) {
    var p = DU.svgPoint(svg, evt);
    var x = DU.clamp(p.x, 60, 400);
    var y = DU.clamp(p.y, 50, 250);

    marker.style.display = '';
    marker.setAttribute('transform', 'translate(' + x + ',' + y + ')');

    say([verdict(x, y), 'Now bring that peak down. All three fixes below work. They do not cost the same.']);

    if (!answered) {
      answered = true;
      actions.style.display = '';
    }
  });

  actions.addEventListener('click', function (evt) {
    var btn = evt.target.closest('[data-fix]');
    if (!btn) return;
    var name = btn.dataset.fix;
    marker.style.display = 'none';
    var note = show(name);
    say(name === 'base' ? [PROMPT] : [note]);
  });
})();
