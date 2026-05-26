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
        /* Scroll so the section header sits just below the sticky nav */
        var block = trigger.closest('.curr-section');
        if (block) {
          setTimeout(function () {
            block.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 30);
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
      var body   = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!body) return;

      /* Close all sibling objectives in the same section body */
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
        /* Scroll so the objective header is visible at the top — prevents
           content expanding downward while the trigger scrolls off-screen */
        var section = trigger.closest('.obj-section');
        if (section) {
          setTimeout(function () {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 30);
        }
      }
    });
  });

  /* ── QUIZ MCQ — BATCH SUBMIT ───────────────────────────────── */
  var quizBody   = document.querySelector('#body-quiz');
  var submitBtn  = document.getElementById('quiz-submit');
  var scoreEl    = document.getElementById('quiz-score');

  if (quizBody && submitBtn) {
    var questions  = Array.prototype.slice.call(
      quizBody.querySelectorAll('.quiz-q[data-answer]')
    );
    var submitted  = false;

    /* Option selection */
    questions.forEach(function (q) {
      var opts = q.querySelectorAll('.quiz-option');
      opts.forEach(function (opt) {
        opt.addEventListener('click', function () {
          if (submitted) return;
          opts.forEach(function (o) { o.classList.remove('selected'); });
          opt.classList.add('selected');
        });
      });
    });

    submitBtn.addEventListener('click', function () {
      /* Reset mode */
      if (submitted) {
        submitted = false;
        submitBtn.textContent = 'Check all answers';
        if (scoreEl) { scoreEl.style.display = 'none'; scoreEl.className = 'quiz-score'; }
        questions.forEach(function (q) {
          q.classList.remove('answered');
          q.querySelectorAll('.quiz-option').forEach(function (o) {
            o.disabled = false;
            o.classList.remove('selected', 'correct', 'incorrect');
          });
        });
        return;
      }

      /* Validate all answered */
      var unanswered = questions.filter(function (q) {
        return !q.querySelector('.quiz-option.selected');
      });
      if (unanswered.length) {
        alert('Please answer all ' + questions.length + ' questions before checking.');
        return;
      }

      /* Score */
      submitted = true;
      var score = 0;
      questions.forEach(function (q) {
        var key  = q.dataset.answer;
        var opts = q.querySelectorAll('.quiz-option');
        opts.forEach(function (o) {
          o.disabled = true;
          if (o.dataset.opt === key)              o.classList.add('correct');
          else if (o.classList.contains('selected')) o.classList.add('incorrect');
        });
        q.classList.add('answered');
        if (q.querySelector('.quiz-option.correct.selected')) score++;
      });

      if (scoreEl) {
        var pct = Math.round(score / questions.length * 100);
        scoreEl.textContent = score + ' / ' + questions.length + ' correct (' + pct + '%)';
        scoreEl.style.display = 'inline-block';
        scoreEl.className = 'quiz-score ' + (pct >= 70 ? 'score-good' : 'score-low');
      }
      submitBtn.textContent = 'Try again';
    });
  }

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

  /* ── CHINESE LANGUAGE TOGGLE ───────────────────────────────── */
  var zhToggle = document.getElementById('zh-toggle');
  if (zhToggle) {
    zhToggle.addEventListener('change', function () {
      document.body.classList.toggle('zh-on', this.checked);
    });
  }

  /* ── EXPAND ALL / COLLAPSE ALL ──────────────────────────────── */
  var currMain = document.querySelector('.curr-main');
  if (currMain && sectionTriggers.length) {
    var expandBtn = document.createElement('button');
    expandBtn.className = 'curr-expand-all-btn';
    expandBtn.textContent = 'Expand all sections';
    currMain.insertBefore(expandBtn, currMain.firstChild);

    var allExpanded = false;
    expandBtn.addEventListener('click', function () {
      allExpanded = !allExpanded;

      if (allExpanded) {
        sectionTriggers.forEach(openSection);
        document.querySelectorAll('.obj-trigger').forEach(function (t) {
          t.setAttribute('aria-expanded', 'true');
          var b = document.getElementById(t.getAttribute('aria-controls'));
          if (b) b.classList.add('open');
        });
        expandBtn.textContent = 'Collapse all sections';
        expandBtn.classList.add('is-expanded');
      } else {
        sectionTriggers.forEach(closeSection);
        document.querySelectorAll('.obj-trigger').forEach(function (t) {
          t.setAttribute('aria-expanded', 'false');
          var b = document.getElementById(t.getAttribute('aria-controls'));
          if (b) b.classList.remove('open');
        });
        expandBtn.textContent = 'Expand all sections';
        expandBtn.classList.remove('is-expanded');
      }
    });
  }

})();
