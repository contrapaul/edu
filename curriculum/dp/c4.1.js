/* c4.1.js — case study modals for C4.1 Design for Manufacture Strategies */
(function () {
  'use strict';

  var openButtons = document.querySelectorAll('[data-modal]');
  var modals = document.querySelectorAll('.case-modal');
  var closeButtons = document.querySelectorAll('.case-modal-close');
  var overlays = document.querySelectorAll('.case-modal-overlay');

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    var closeBtn = modal.querySelector('.case-modal-close');
    setTimeout(function () { if (closeBtn) closeBtn.focus(); }, 50);
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    var caseId = modal.id.replace('modal-', '');
    var trigger = document.querySelector('[data-modal="modal-' + caseId + '"]');
    if (trigger) trigger.focus();
  }

  openButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(btn.dataset.modal); });
    if (btn.tagName !== 'BUTTON') {
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(btn.dataset.modal);
        }
      });
    }
  });

  closeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { closeModal(btn.closest('.case-modal')); });
  });

  overlays.forEach(function (overlay) {
    overlay.addEventListener('click', function () { closeModal(overlay.closest('.case-modal')); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      modals.forEach(function (m) {
        if (m.classList.contains('open')) closeModal(m);
      });
    }
  });

  var lightbox = document.getElementById('case-lightbox');
  if (lightbox) {
    var lightboxImg = lightbox.querySelector('img');

    document.querySelectorAll('.case-photo > a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var img = link.querySelector('img');
        lightboxImg.src = link.getAttribute('href');
        lightboxImg.alt = img ? img.alt : '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightboxImg.src = '';
      var modalOpen = Array.prototype.some.call(modals, function (m) {
        return m.classList.contains('open');
      });
      document.body.style.overflow = modalOpen ? 'hidden' : '';
    }

    lightbox.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        e.stopPropagation();
        closeLightbox();
      }
    }, true);
  }

  modals.forEach(function (modal) {
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        var focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  });
})();

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
