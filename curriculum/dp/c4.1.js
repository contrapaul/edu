/* c4.1.js — interactive widgets for C4.1 Design for Manufacture Strategies.
   Case-study modals and the .case-photo lightbox are handled globally
   by curriculum.js. */

/* ── EXPLODED-DIAGRAM TEARDOWN CHALLENGE (4.1.3) ─────────────────
   REAL below is illustrative, not sourced from an actual teardown yet —
   see expandedplans.md C4.1.3 for the sourcing task this is meant to be
   replaced with (pull real numbers from an iFixit teardown once a
   product is confirmed). */
(function () {
  'use strict';
  var revealBtn = document.getElementById('teardown-c41-reveal');
  if (!revealBtn || !window.LiveCalc) return;
  var LC = window.LiveCalc;

  var fastenersInput = document.getElementById('teardown-c41-fasteners');
  var difficultyInput = document.getElementById('teardown-c41-difficulty');
  var resultEl = document.getElementById('teardown-c41-result');

  var REAL = { fasteners: 2, difficulty: 1 };

  revealBtn.addEventListener('click', function () {
    var guessF = parseFloat(fastenersInput.value);
    var guessD = parseFloat(difficultyInput.value);
    var lines = [];

    lines.push('Real fastener count: ' + REAL.fasteners + ' screws — the rest of the case is held together with glue.');
    if (!isNaN(guessF)) {
      var fComparison = guessF > REAL.fasteners
        ? ' — more than the real teardown; most of this case isn’t held together with fasteners at all'
        : guessF < REAL.fasteners ? ' — fewer than the real teardown' : ' — exactly right';
      lines.push('Your guess: ' + guessF + fComparison + '.');
    }

    lines.push('Real repairability score: ' + REAL.difficulty + '/10 — opening it at all usually means cutting or prying the glued seam, often damaging the battery in the process.');
    if (!isNaN(guessD)) {
      lines.push('Your guess: ' + guessD + '/10.');
    }

    lines.push('This is DFA/DFD thinking in reverse: standardised fasteners and snap-fits (the advice above) would make this easy to open, but a sealed, glued case is deliberately chosen here for water resistance and a slimmer housing. Easy to assemble and easy to disassemble aren’t always the same design goal.');

    LC.renderWorking(resultEl, lines, lines.length - 1);
  });
})();
