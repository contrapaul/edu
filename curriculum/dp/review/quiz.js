/* quiz.js — takes the question ids the builder left in sessionStorage and runs
   them as a quiz. The markup and the check-all-at-the-end behaviour match the
   quiz on every topic page, so students meet one interaction, not two. */
(function () {
  'use strict';

  var LETTERS = ['A', 'B', 'C', 'D'];

  var el = {
    heading: document.getElementById('quiz-heading'),
    meta:    document.getElementById('quiz-meta'),
    body:    document.getElementById('quiz-body'),
    footer:  document.getElementById('quiz-footer'),
    submit:  document.getElementById('quiz-submit'),
    score:   document.getElementById('quiz-score'),
    warn:    document.getElementById('quiz-warn')
  };

  var saved;
  try { saved = JSON.parse(sessionStorage.getItem('dp-review-quiz')); } catch (e) { saved = null; }

  if (!saved || !saved.ids || !saved.ids.length) {
    el.body.innerHTML = '<p class="rv-pool-empty">No quiz has been built yet. ' +
      '<a href="./">Go back to the builder</a> and choose your topics.</p>';
    return;
  }

  el.heading.textContent = saved.title;
  document.title = saved.title + ' | contrapaul edu';

  fetch('questions.json')
    .then(function (r) { return r.json(); })
    .then(function (bank) {
      var byId = {};
      bank.questions.forEach(function (q) { byId[q.id] = q; });
      var questions = saved.ids.map(function (id) { return byId[id]; }).filter(Boolean);
      if (!questions.length) {
        el.body.innerHTML = '<p class="rv-pool-empty">Those questions are no longer in the bank. ' +
          '<a href="./">Build the quiz again</a>.</p>';
        return;
      }
      render(questions);
    })
    .catch(function () {
      el.body.innerHTML = '<p class="rv-pool-empty">The question bank could not be loaded. Try reloading the page.</p>';
    });

  function render(questions) {
    el.meta.textContent = questions.length + ' questions, one answer each. ' +
      'Check all your answers at the end to see your score and the explanations.';

    questions.forEach(function (q, i) {
      el.body.appendChild(card(q, i + 1));
    });
    el.footer.hidden = false;
    wire(questions.length);
  }

  function card(q, n) {
    var wrap = document.createElement('div');
    wrap.className = 'quiz-q';
    wrap.dataset.answer = q.answer;

    var num = document.createElement('div');
    num.className = 'quiz-q-num';
    num.textContent = 'Q' + n + ' · ' + q.sub +
      (q.subTitle && q.subTitle !== q.topicTitle ? ' ' + q.subTitle : ' ' + q.topicTitle);

    var text = document.createElement('div');
    text.className = 'quiz-q-text';
    text.textContent = q.text;

    var opts = document.createElement('div');
    opts.className = 'quiz-options';
    LETTERS.forEach(function (L) {
      var b = document.createElement('button');
      b.className = 'quiz-option';
      b.dataset.opt = L;
      b.textContent = L + ') ' + q.options[L];
      opts.appendChild(b);
    });

    var answer = document.createElement('div');
    answer.className = 'quiz-answer';
    answer.textContent = q.commentary + ' ';
    var link = document.createElement('a');
    link.href = '../' + q.topicFile + '#quiz';
    link.className = 'rv-answer-link';
    link.textContent = 'Read ' + q.topic + ' ' + q.topicTitle;
    answer.appendChild(link);

    wrap.appendChild(num);
    wrap.appendChild(text);
    wrap.appendChild(opts);
    wrap.appendChild(answer);
    return wrap;
  }

  function wire(total) {
    var questions = [].slice.call(el.body.querySelectorAll('.quiz-q'));
    var submitted = false;

    questions.forEach(function (q) {
      var opts = q.querySelectorAll('.quiz-option');
      opts.forEach(function (opt) {
        opt.addEventListener('click', function () {
          if (submitted) return;
          opts.forEach(function (o) { o.classList.remove('selected'); });
          opt.classList.add('selected');
          el.warn.textContent = '';
        });
      });
    });

    el.submit.addEventListener('click', function () {
      if (submitted) {
        submitted = false;
        el.submit.textContent = 'Check all answers';
        el.score.style.display = 'none';
        el.score.className = 'quiz-score';
        questions.forEach(function (q) {
          q.classList.remove('answered');
          q.querySelectorAll('.quiz-option').forEach(function (o) {
            o.disabled = false;
            o.classList.remove('selected', 'correct', 'incorrect');
          });
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      var unanswered = questions.filter(function (q) {
        return !q.querySelector('.quiz-option.selected');
      });
      if (unanswered.length) {
        el.warn.textContent = unanswered.length + ' still unanswered.';
        unanswered[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      submitted = true;
      el.warn.textContent = '';
      var score = 0;
      questions.forEach(function (q) {
        var key = q.dataset.answer;
        q.querySelectorAll('.quiz-option').forEach(function (o) {
          o.disabled = true;
          if (o.dataset.opt === key) o.classList.add('correct');
          else if (o.classList.contains('selected')) o.classList.add('incorrect');
        });
        q.classList.add('answered');
        if (q.querySelector('.quiz-option.correct.selected')) score++;
      });

      var pct = Math.round(score / total * 100);
      el.score.textContent = score + ' / ' + total + ' correct (' + pct + '%)';
      el.score.style.display = 'inline-block';
      el.score.className = 'quiz-score ' + (pct >= 70 ? 'score-good' : 'score-low');
      el.submit.textContent = 'Try again';
    });
  }
})();
