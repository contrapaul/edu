/* a1.1.js — product spotlight modals for A1.1 Ergonomics */
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
    /* Return focus to the trigger button */
    var caseId = modal.id.replace('modal-', '');
    var trigger = document.querySelector('[data-modal="modal-' + caseId + '"]');
    if (trigger) trigger.focus();
  }

  openButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(btn.dataset.modal); });
    /* Cards are not native buttons, so handle keyboard activation */
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

  /* Image lightbox — enlarge spotlight photos in-page instead of a new tab */
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
      /* Restore scroll lock only if no spotlight modal is still open */
      var modalOpen = Array.prototype.some.call(modals, function (m) {
        return m.classList.contains('open');
      });
      document.body.style.overflow = modalOpen ? 'hidden' : '';
    }

    /* Click anywhere in the lightbox (image or backdrop) closes it */
    lightbox.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        e.stopPropagation();
        closeLightbox();
      }
    }, true);
  }

  /* Basic focus trapping */
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
