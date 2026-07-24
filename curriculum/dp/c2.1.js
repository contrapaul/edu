/* c2.1.js — case study modals for C2.1 Design for Sustainability */
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

/* ── TRIPLE BOTTOM LINE SCORING TOOL (2.1.3) ─────────────────── */
(function () {
  'use strict';
  var root = document.getElementById('tbl-c21');
  if (!root) return;

  var sliders = {
    people: document.getElementById('tbl-c21-people'),
    planet: document.getElementById('tbl-c21-planet'),
    profit: document.getElementById('tbl-c21-profit')
  };
  var valueEls = {
    people: document.getElementById('tbl-c21-people-val'),
    planet: document.getElementById('tbl-c21-planet-val'),
    profit: document.getElementById('tbl-c21-profit-val')
  };
  var circles = {
    people: document.getElementById('tbl-c21-circle-people'),
    planet: document.getElementById('tbl-c21-circle-planet'),
    profit: document.getElementById('tbl-c21-circle-profit')
  };
  var hue = { people: 215, planet: 145, profit: 40 };
  var verdictEl = document.getElementById('tbl-c21-verdict');
  var presetBtns = root.querySelectorAll('.tbl-preset-btn');

  var PRESETS = {
    fastfashion: { people: 3, planet: 2, profit: 9 },
    repair: { people: 8, planet: 9, profit: 5 },
    artisan: { people: 9, planet: 6, profit: 3 }
  };

  var CONFLICT_TEXT = {
    people: 'a design that’s profitable and environmentally sound but relies on exploited or underpaid labour, satisfying Profit + Planet but failing People, exactly the first conflict named above.',
    planet: 'a design that’s profitable and socially fair but creates significant pollution, satisfying Profit + People but failing Planet.',
    profit: 'a design that’s environmentally sound and socially responsible but can’t be sold at a viable price, satisfying Planet + People but failing Profit.'
  };

  function updateCircle(key) {
    var score = parseInt(sliders[key].value, 10);
    valueEls[key].textContent = String(score);
    var lightness = 95 - (score / 10) * 40;
    circles[key].style.fill = 'hsl(' + hue[key] + ', 65%, ' + lightness + '%)';
    circles[key].style.stroke = 'hsl(' + hue[key] + ', 55%, 45%)';
  }

  function updateVerdict() {
    var scores = {
      people: parseInt(sliders.people.value, 10),
      planet: parseInt(sliders.planet.value, 10),
      profit: parseInt(sliders.profit.value, 10)
    };
    var min = Math.min(scores.people, scores.planet, scores.profit);
    var weakest = Object.keys(scores).filter(function (k) { return scores[k] === min; });

    if (min >= 7) {
      verdictEl.textContent = 'All three are strong here (lowest is ' + min + '/10), sitting close to the zone of genuine sustainability where all three circles overlap.';
    } else if (weakest.length > 1) {
      verdictEl.textContent = 'More than one dimension is weak here, tied at ' + min + '/10 — a long way from the zone where all three circles overlap.';
    } else {
      var key = weakest[0];
      var label = key.charAt(0).toUpperCase() + key.slice(1);
      verdictEl.textContent = label + ' is the dimension this trades away, scoring ' + min + '/10. That’s ' + CONFLICT_TEXT[key];
    }
  }

  function update() {
    Object.keys(sliders).forEach(updateCircle);
    updateVerdict();
  }

  Object.keys(sliders).forEach(function (key) {
    sliders[key].addEventListener('input', function () {
      presetBtns.forEach(function (btn) { btn.classList.remove('active'); });
      update();
    });
  });

  presetBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var preset = PRESETS[btn.dataset.preset];
      Object.keys(sliders).forEach(function (key) { sliders[key].value = preset[key]; });
      presetBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      update();
    });
  });

  update();
})();
