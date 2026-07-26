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
