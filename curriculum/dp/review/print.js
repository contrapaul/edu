/* print.js — renders the built quiz as two documents: the sheet students sit,
   and the guide the teacher marks from. Both are readable on screen; the print
   rules in print.css strip the site around them. */
(function () {
  'use strict';

  var LETTERS = ['A', 'B', 'C', 'D'];

  var docQuiz = document.getElementById('doc-quiz');
  var docKey  = document.getElementById('doc-key');
  var hint    = document.getElementById('pr-hint');

  var saved;
  try { saved = JSON.parse(sessionStorage.getItem('dp-review-quiz')); } catch (e) { saved = null; }

  if (!saved || !saved.ids || !saved.ids.length) {
    docQuiz.innerHTML = '<p class="rv-pool-empty">No quiz has been built yet. ' +
      '<a href="./">Go back to the builder</a> and choose your topics.</p>';
    return;
  }

  document.title = saved.title + ' | contrapaul edu';

  fetch('questions.json')
    .then(function (r) { return r.json(); })
    .then(function (bank) {
      var byId = {};
      bank.questions.forEach(function (q) { byId[q.id] = q; });
      var questions = saved.ids.map(function (id) { return byId[id]; }).filter(Boolean);
      if (!questions.length) {
        docQuiz.innerHTML = '<p class="rv-pool-empty">Those questions are no longer in the bank. ' +
          '<a href="./">Build the quiz again</a>.</p>';
        return;
      }
      buildSheet(questions);
      buildKey(questions);
    })
    .catch(function () {
      docQuiz.innerHTML = '<p class="rv-pool-empty">The question bank could not be loaded. Try reloading the page.</p>';
    });

  function head(target, sub) {
    var h = document.createElement('header');
    h.className = 'pr-head';

    var title = document.createElement('h1');
    title.className = 'pr-title';
    title.textContent = saved.title;
    h.appendChild(title);

    if (sub) {
      var s = document.createElement('p');
      s.className = 'pr-subtitle';
      s.textContent = sub;
      h.appendChild(s);
    }
    target.appendChild(h);
  }

  /* Student sheet: no topic, no sub-topic, no answers. */
  function buildSheet(questions) {
    head(docQuiz, null);
    var count = document.createElement('p');
    count.className = 'pr-count';
    count.textContent = questions.length + ' questions. Choose one answer for each.';
    docQuiz.appendChild(count);

    questions.forEach(function (q, i) {
      var block = document.createElement('section');
      block.className = 'pr-q';

      var text = document.createElement('p');
      text.className = 'pr-q-text';
      var n = document.createElement('span');
      n.className = 'pr-q-num';
      n.textContent = (i + 1) + '.';
      text.appendChild(n);
      text.appendChild(document.createTextNode(' ' + q.text));
      block.appendChild(text);

      var list = document.createElement('ol');
      list.className = 'pr-options';
      LETTERS.forEach(function (L) {
        var li = document.createElement('li');
        var letter = document.createElement('span');
        letter.className = 'pr-opt-letter';
        letter.textContent = L;
        li.appendChild(letter);
        li.appendChild(document.createTextNode(q.options[L]));
        list.appendChild(li);
      });
      block.appendChild(list);
      docQuiz.appendChild(block);
    });
  }

  /* Teacher guide: number, correct letter, where it comes from, why. */
  function buildKey(questions) {
    head(docKey, 'Answer guide');

    questions.forEach(function (q, i) {
      var row = document.createElement('section');
      row.className = 'pr-a';

      var line = document.createElement('p');
      line.className = 'pr-a-line';

      var n = document.createElement('span');
      n.className = 'pr-q-num';
      n.textContent = (i + 1) + '.';

      var letter = document.createElement('span');
      letter.className = 'pr-a-letter';
      letter.textContent = q.answer;

      var ref = document.createElement('span');
      ref.className = 'pr-a-ref';
      ref.textContent = q.sub + (q.subTitle ? ' ' + q.subTitle : '');

      line.appendChild(n);
      line.appendChild(letter);
      line.appendChild(ref);
      row.appendChild(line);

      var why = document.createElement('p');
      why.className = 'pr-a-why';
      why.textContent = q.commentary;
      row.appendChild(why);

      docKey.appendChild(row);
    });
  }

  /* ── Switching and printing ─────────────────────────────── */
  document.querySelector('.pr-tabs').addEventListener('click', function (e) {
    var tab = e.target.closest('.pr-tab');
    if (!tab) return;
    var wantKey = tab.dataset.doc === 'key';
    document.querySelectorAll('.pr-tab').forEach(function (t) { t.classList.toggle('active', t === tab); });
    docQuiz.hidden = wantKey;
    docKey.hidden = !wantKey;
    hint.textContent = wantKey
      ? 'This guide is for you, not the students. Its numbering matches the quiz sheet exactly.'
      : 'Print this for students. The answer guide is behind the other tab.';
    window.scrollTo(0, 0);
  });

  document.getElementById('print-btn').addEventListener('click', function () { window.print(); });
})();
