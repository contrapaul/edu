/* c1.3.js — case study modals for C1.3 Beyond Usability */
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

/* ── FOUR-PLEASURE CARD SORT (1.3.1) ─────────────────────────── */
(function () {
  'use strict';
  var bankEl = document.getElementById('sort-pleasures-bank');
  if (!bankEl || !window.DragSort) return;

  window.DragSort.init({
    bankEl: bankEl,
    zonesEl: document.getElementById('sort-pleasures-zones'),
    statusEl: document.getElementById('sort-pleasures-status'),
    resetBtn: document.getElementById('sort-pleasures-reset'),
    zones: [
      { id: 'physio', label: 'Physio-pleasure' },
      { id: 'socio', label: 'Socio-pleasure' },
      { id: 'psycho', label: 'Psycho-pleasure' },
      { id: 'ideo', label: 'Ideo-pleasure' }
    ],
    items: [
      {
        id: 'pl1',
        label: 'The satisfying, weighted click of a mechanical keyboard switch.',
        correctZone: 'physio',
        explanation: 'A physical sensation, sound and feel, felt directly through the hand. Straight physio-pleasure.'
      },
      {
        id: 'pl2',
        label: 'The smooth, cool feel of a phone’s brushed-metal edge in your hand.',
        correctZone: 'physio',
        explanation: 'Another purely sensory response, texture and temperature. Physio-pleasure again.'
      },
      {
        id: 'pl3',
        label: 'A limited-edition trainer with a visible logo everyone recognises.',
        correctZone: 'socio',
        explanation: 'The point of a visible logo is what it signals to other people, status and belonging. Socio-pleasure.'
      },
      {
        id: 'pl4',
        label: 'An app that shows a clear progress bar so you always know what’s happening.',
        correctZone: 'psycho',
        explanation: 'This is about understanding and control, the cognitive sense of mastering the interface, not how it looks or feels physically. Psycho-pleasure.'
      },
      {
        id: 'pl5',
        label: 'A t-shirt made from recycled ocean plastic, with a tag explaining the impact.',
        correctZone: 'ideo',
        explanation: 'The pleasure here comes from the product aligning with a value the wearer holds, not from touch, status or usability. Ideo-pleasure.'
      },
      {
        id: 'pl6',
        label: 'A loyalty-app badge you unlock after your 10th purchase, visible to your friends.',
        correctZone: ['socio', 'psycho'],
        explanation: 'Genuinely both: visible to friends is social display (socio), but unlocking it is also a small sense of achievement and progress (psycho). Real products often trigger more than one pleasure at once.'
      },
      {
        id: 'pl7',
        label: 'Buying a specific trainer brand because you want people to know you care about ethical manufacturing.',
        correctZone: ['socio', 'ideo'],
        explanation: 'Also genuinely both: it signals something to other people (socio) precisely because it reflects a value you actually hold (ideo). Socio- and ideo-pleasure overlap a lot around identity and values.'
      }
    ]
  });
})();
