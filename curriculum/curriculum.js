(function () {
  'use strict';

  /* ── TOP-LEVEL SECTION ACCORDION ──────────────────────────── */
  var sectionTriggers = document.querySelectorAll('.curr-trigger');

  function openSection(trigger) {
    var body = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!body) return;
    trigger.setAttribute('aria-expanded', 'true');
    body.classList.add('open');
  }

  function closeSection(trigger) {
    var body = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!body) return;
    trigger.setAttribute('aria-expanded', 'false');
    body.classList.remove('open');
  }

  sectionTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        var savedY = trigger._savedScrollY;
        sectionTriggers.forEach(closeSection);
        if (savedY !== undefined) window.scrollTo({ top: savedY, behavior: 'smooth' });
      } else {
        trigger._savedScrollY = window.scrollY;
        sectionTriggers.forEach(closeSection);
        openSection(trigger);
        var block = trigger.closest('.curr-section');
        if (block) {
          setTimeout(function () {
            block.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }
      }
    });
  });

  /* ── TOPIC NAV PILL LINKS ──────────────────────────────────── */
  document.querySelectorAll('.topic-nav a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      var trigger = target.querySelector('.curr-trigger');
      if (trigger && trigger.getAttribute('aria-expanded') !== 'true') {
        sectionTriggers.forEach(closeSection);
        openSection(trigger);
      }
      setTimeout(function () {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    });
  });

  /* ── LEARNING OBJECTIVE ACCORDION ─────────────────────────── */
  document.querySelectorAll('.obj-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      var body = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!body) return;

      /* close all sibling objectives in the same curr-body */
      var parent = trigger.closest('.curr-body');
      if (parent) {
        parent.querySelectorAll('.obj-trigger').forEach(function (t) {
          t.setAttribute('aria-expanded', 'false');
          var b = document.getElementById(t.getAttribute('aria-controls'));
          if (b) b.classList.remove('open');
        });
      }
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
      }
    });
  });

  /* ── QUIZ MCQ ──────────────────────────────────────────────── */
  document.querySelectorAll('.quiz-question').forEach(function (q) {
    var options  = q.querySelectorAll('.quiz-option');
    var feedback = q.querySelector('.quiz-feedback');
    var resetBtn = q.querySelector('.quiz-reset');
    var answered = false;

    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (answered) return;
        answered = true;
        var correct = opt.dataset.correct === 'true';

        options.forEach(function (o) {
          o.disabled = true;
          if (o.dataset.correct === 'true') o.classList.add('correct');
          else if (o === opt) o.classList.add('incorrect');
        });

        if (feedback) {
          feedback.classList.add('show', correct ? 'fb-correct' : 'fb-incorrect');
          var lbl = feedback.querySelector('.quiz-feedback-label');
          if (lbl) lbl.textContent = correct ? 'Correct' : 'Incorrect';
        }
        if (resetBtn) resetBtn.style.display = 'inline-block';
      });
    });

    if (resetBtn) {
      resetBtn.style.display = 'none';
      resetBtn.addEventListener('click', function () {
        answered = false;
        options.forEach(function (o) {
          o.disabled = false;
          o.classList.remove('correct', 'incorrect');
        });
        if (feedback) feedback.classList.remove('show', 'fb-correct', 'fb-incorrect');
        resetBtn.style.display = 'none';
      });
    }
  });

  /* ── PAPER 2 REVEAL PANELS ─────────────────────────────────── */
  document.querySelectorAll('.p2-question').forEach(function (q) {
    q.querySelectorAll('.p2-reveal-btn').forEach(function (btn) {
      var targetId = btn.dataset.reveals;
      var panel    = q.querySelector('.' + targetId);
      if (!panel) return;

      var labelShow = btn.textContent.trim();
      var labelHide = labelShow.replace(/^Show/, 'Hide');

      btn.addEventListener('click', function () {
        var showing = panel.classList.contains('show');
        panel.classList.toggle('show', !showing);
        btn.classList.toggle('active', !showing);
        btn.textContent = showing ? labelShow : labelHide;
      });
    });
  });

})();
