/* review.js — DP Review Quiz Builder.
   Loads the question bank written by scripts/extract-dp-questions.mjs, then
   filters it down to a quiz the user can take online or print. */
(function () {
  'use strict';

  var LETTERS = ['A', 'B', 'C', 'D'];
  var DEFAULT_TITLE = 'DP Design Technology Review';

  var bank = { topics: [], questions: [] };
  var state = {
    level: null,        // 'SL' | 'HL' | 'ALL'
    topics: new Set(),  // selected topic codes
    pool: [],           // question ids currently on screen, in topic order
    removed: new Set(), // ids struck out of the pool but still shown
    quick: null         // size of the quick set in use, if any
  };

  var el = {
    levelRow:   document.getElementById('level-row'),
    topicRow:   document.getElementById('topic-row'),
    topicPills: document.getElementById('topic-pills'),
    pool:       document.getElementById('pool'),
    poolNote:   document.getElementById('pool-note'),
    startCount: document.getElementById('start-count'),
    startBtn:   document.getElementById('start-quiz'),
    printBtn:   document.getElementById('make-print'),
    restoreBtn: document.getElementById('pool-restore'),
    dialog:     document.getElementById('title-dialog'),
    titleForm:  document.getElementById('title-form'),
    titleInput: document.getElementById('quiz-title')
  };

  function byId(id) { return bank.byId[id]; }
  function topicsForLevel() {
    return bank.topics.filter(function (t) { return state.level === 'ALL' || t.level === state.level; });
  }
  function questionsForTopics() {
    return bank.questions.filter(function (q) { return state.topics.has(q.topic); });
  }
  function included() {
    return state.pool.filter(function (id) { return !state.removed.has(id); });
  }
  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  /* ── Level ──────────────────────────────────────────────── */
  el.levelRow.addEventListener('click', function (e) {
    var btn = e.target.closest('.rv-pill');
    if (!btn || state.level === btn.dataset.level) return;
    state.level = btn.dataset.level;
    [].forEach.call(el.levelRow.children, function (b) { b.classList.toggle('on', b === btn); });
    state.topics.clear();
    renderTopicPills();
    el.topicRow.hidden = false;
    syncPool();
  });

  /* ── Topics ─────────────────────────────────────────────── */
  function renderTopicPills() {
    el.topicPills.textContent = '';
    topicsForLevel().forEach(function (t) {
      var pill = document.createElement('button');
      pill.className = 'rv-pill' + (t.level === 'HL' ? ' rv-pill-hl' : '');
      pill.dataset.topic = t.topic;
      pill.textContent = t.topic;
      pill.title = t.title + (t.level === 'HL' ? ' (HL)' : '') + ', ' + t.count + ' questions';
      pill.addEventListener('click', function () {
        var on = !state.topics.has(t.topic);
        if (on) state.topics.add(t.topic); else state.topics.delete(t.topic);
        pill.classList.toggle('on', on);
        syncPool();
      });
      el.topicPills.appendChild(pill);
    });
  }

  function setAllTopics(on) {
    state.topics.clear();
    if (on) topicsForLevel().forEach(function (t) { state.topics.add(t.topic); });
    el.topicPills.querySelectorAll('.rv-pill').forEach(function (p) { p.classList.toggle('on', on); });
    syncPool();
  }
  document.getElementById('topics-all').addEventListener('click', function () { setAllTopics(true); });
  document.getElementById('topics-none').addEventListener('click', function () { setAllTopics(false); });

  /* ── Question pool ──────────────────────────────────────── */
  /* Changing the topic selection rebuilds the pool from scratch, which also
     clears any quick set and any removals. */
  function syncPool() {
    state.quick = null;
    state.pool = questionsForTopics().map(function (q) { return q.id; });
    state.removed.clear();
    renderPool();
  }

  function renderPool() {
    el.pool.textContent = '';
    state.pool.forEach(function (id) { el.pool.appendChild(questionCard(byId(id))); });
    updateCounts();
  }

  function questionCard(q) {
    var card = document.createElement('div');
    card.className = 'quiz-q rv-card';
    card.dataset.id = q.id;
    if (state.removed.has(q.id)) card.classList.add('removed');

    var num = document.createElement('div');
    num.className = 'quiz-q-num';
    /* Some objectives carry the same name as their topic, so the label would
       otherwise read "A1.1 Ergonomics · A1.1.1 Ergonomics". */
    num.textContent = q.topic + ' ' + q.topicTitle + ' · ' + q.sub +
      (q.subTitle && q.subTitle !== q.topicTitle ? ' ' + q.subTitle : '');

    var remove = document.createElement('button');
    remove.className = 'rv-remove';
    remove.textContent = state.removed.has(q.id) ? 'Put back' : 'Remove';
    remove.addEventListener('click', function () {
      if (state.removed.has(q.id)) state.removed.delete(q.id); else state.removed.add(q.id);
      card.classList.toggle('removed');
      remove.textContent = state.removed.has(q.id) ? 'Put back' : 'Remove';
      updateCounts();
    });

    var text = document.createElement('div');
    text.className = 'quiz-q-text';
    text.textContent = q.text;

    var opts = document.createElement('div');
    opts.className = 'quiz-options';
    LETTERS.forEach(function (L) {
      var opt = document.createElement('div');
      opt.className = 'quiz-option';
      opt.textContent = L + ') ' + q.options[L];
      opts.appendChild(opt);
    });

    card.appendChild(num);
    card.appendChild(remove);
    card.appendChild(text);
    card.appendChild(opts);
    return card;
  }

  /* ── Quick sets ─────────────────────────────────────────── */
  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  document.querySelectorAll('[data-quick]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var n = parseInt(btn.dataset.quick, 10);
      var all = questionsForTopics().map(function (q) { return q.id; });
      var picked = new Set(shuffled(all).slice(0, n));
      state.pool = all.filter(function (id) { return picked.has(id); });
      state.removed.clear();
      state.quick = state.pool.length;
      renderPool();
    });
  });

  el.restoreBtn.addEventListener('click', syncPool);

  function updateCounts() {
    var n = included().length;
    var available = questionsForTopics().length;

    document.querySelectorAll('[data-quick]').forEach(function (btn) {
      btn.disabled = available < parseInt(btn.dataset.quick, 10);
    });
    el.restoreBtn.disabled = state.pool.length === available && state.removed.size === 0;

    el.startCount.textContent = n;
    el.startBtn.disabled = n === 0;
    el.printBtn.disabled = n === 0;

    var drawn = state.quick
      ? plural(state.quick, 'question') + ' drawn at random from ' + plural(state.topics.size, 'topic') + '.'
      : '';
    el.poolNote.textContent = !state.pool.length ? ''
      : state.removed.size
        ? (drawn ? drawn + ' ' : '') + plural(n, 'question') + ' left, ' + state.removed.size + ' removed.'
        : drawn;
  }

  /* ── Hand-off ───────────────────────────────────────────── */
  /* The order is shuffled once, here, so the quiz page and the printed sheet
     both work from the same numbering. */
  function handOff(page, title) {
    sessionStorage.setItem('dp-review-quiz', JSON.stringify({
      title: title || DEFAULT_TITLE,
      ids: shuffled(included())
    }));
    window.location.href = page;
  }

  el.startBtn.addEventListener('click', function () { handOff('quiz.html', DEFAULT_TITLE); });

  el.printBtn.addEventListener('click', function () {
    el.titleInput.value = '';
    el.dialog.showModal();
    el.titleInput.focus();
  });
  document.getElementById('title-cancel').addEventListener('click', function () { el.dialog.close(); });
  el.titleForm.addEventListener('submit', function (e) {
    e.preventDefault();
    handOff('print.html', el.titleInput.value.trim());
  });

  /* ── Load ───────────────────────────────────────────────── */
  fetch('questions.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      bank = data;
      bank.byId = {};
      bank.questions.forEach(function (q) { bank.byId[q.id] = q; });
      updateCounts();
    })
    .catch(function () {
      el.pool.innerHTML = '<p class="rv-pool-empty">The question bank could not be loaded. Try reloading the page.</p>';
    });
})();
