/* a2.1.js — case study modals for A2.1 User-centred Research Methods */
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

/* ── MATCH THE METHOD TO THE QUESTION (2.1.4) ────────────────── */
(function () {
  'use strict';
  var bankEl = document.getElementById('sort-methods-bank');
  if (!bankEl || !window.DragSort) return;

  window.DragSort.init({
    bankEl: bankEl,
    zonesEl: document.getElementById('sort-methods-zones'),
    statusEl: document.getElementById('sort-methods-status'),
    resetBtn: document.getElementById('sort-methods-reset'),
    zones: [
      { id: 'field-research', label: 'Field research' },
      { id: 'task-analysis', label: 'Task analysis' },
      { id: 'observation', label: 'User observation' },
      { id: 'interviews', label: 'Interviews' },
      { id: 'surveys', label: 'Surveys / Likert' },
      { id: 'focus-groups', label: 'Focus groups' }
    ],
    items: [
      {
        id: 'q1',
        label: 'A design team wants to understand why factory workers wear their safety gloves differently than the manual describes.',
        correctZone: 'field-research',
        explanation: 'Their workaround is shaped by their real environment and habits — something they might not think to mention if you just asked them. You have to watch it happen in the actual factory.'
      },
      {
        id: 'q2',
        label: 'An online checkout has 5 steps. The team needs to know exactly which step causes the most drop-offs.',
        correctZone: 'task-analysis',
        explanation: 'This breaks a multi-step process into its parts to find precisely where the friction is — built for mapping a task, not for capturing opinions.'
      },
      {
        id: 'q3',
        label: "A team is testing a redesigned 'Add to cart' button and wants to see exactly where people hesitate or misclick.",
        correctZone: 'observation',
        explanation: "Watching a specific, structured interaction catches hesitation and errors a user wouldn't think to self-report afterwards."
      },
      {
        id: 'q4',
        label: 'A company wants to understand, in depth, why several long-time customers switched to a competitor.',
        correctZone: 'interviews',
        explanation: 'A small number of people, deep motivations, room to follow up on their answers — a direct conversation, not a form or a crowd.'
      },
      {
        id: 'q5',
        label: 'A team wants a quick satisfaction score from 10,000 app users right after an update ships.',
        correctZone: 'surveys',
        explanation: 'Large sample, quantitative, fast to distribute — exactly the trade-off a survey makes: breadth over depth.'
      },
      {
        id: 'q6',
        label: "A brand wants to see how a small group's opinions on a new logo shift as they discuss it with each other.",
        correctZone: 'focus-groups',
        explanation: "The whole point here is capturing how perspectives change through interaction between participants — something you can't get by asking people alone."
      }
    ]
  });
})();
