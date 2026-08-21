/* review.js — DP Review Builder.
   Loads the question bank written by scripts/extract-dp-questions.mjs, then
   filters it down to a quiz the user can take online or print. */
(function () {
  'use strict';

  var LETTERS = ['A', 'B', 'C', 'D'];

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
    stepTopics: document.getElementById('step-topics'),
    topicGroups:document.getElementById('topic-groups'),
    topicCount: document.getElementById('topic-count'),
    stepQs:     document.getElementById('step-questions'),
    pool:       document.getElementById('pool'),
    poolNote:   document.getElementById('pool-note'),
    bar:        document.getElementById('action-bar'),
    startCount: document.getElementById('start-count'),
    startBtn:   document.getElementById('start-quiz'),
    printBtn:   document.getElementById('make-print'),
    title:      document.getElementById('quiz-title')
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
    var btn = e.target.closest('.rv-level');
    if (!btn) return;
    if (state.level === btn.dataset.level) return;
    state.level = btn.dataset.level;
    [].forEach.call(el.levelRow.children, function (b) { b.classList.toggle('active', b === btn); });
    state.topics.clear();
    renderTopics();
    el.stepTopics.hidden = false;
    syncPool();
  });

  /* ── Topics ─────────────────────────────────────────────── */
  function renderTopics() {
    var list = topicsForLevel();
    var groups = [];
    list.forEach(function (t) {
      var key = t.topic[0];
      var group = groups[groups.length - 1];
      if (!group || group.key !== key) { group = { key: key, items: [] }; groups.push(group); }
      group.items.push(t);
    });

    el.topicGroups.textContent = '';
    groups.forEach(function (group) {
      var label = document.createElement('div');
      label.className = 'rv-group-label';
      label.textContent = 'Topic ' + group.key;
      el.topicGroups.appendChild(label);

      var grid = document.createElement('div');
      grid.className = 'rv-topic-grid';
      group.items.forEach(function (t) { grid.appendChild(topicCard(t)); });
      el.topicGroups.appendChild(grid);
    });
    updateTopicCount();
  }

  function topicCard(t) {
    var label = document.createElement('label');
    label.className = 'rv-topic';

    var box = document.createElement('input');
    box.type = 'checkbox';
    box.value = t.topic;
    box.addEventListener('change', function () {
      if (box.checked) state.topics.add(t.topic); else state.topics.delete(t.topic);
      label.classList.toggle('on', box.checked);
      updateTopicCount();
      syncPool();
    });

    var body = document.createElement('div');
    body.className = 'rv-topic-body';

    var code = document.createElement('span');
    code.className = 'rv-topic-code';
    code.textContent = t.topic;

    var name = document.createElement('span');
    name.className = 'rv-topic-name';
    name.textContent = t.title;

    var meta = document.createElement('span');
    meta.className = 'rv-topic-meta';
    meta.textContent = t.count + ' questions';
    if (t.level === 'HL') {
      var tag = document.createElement('span');
      tag.className = 'rv-hl-tag';
      tag.textContent = ' · HL';
      meta.appendChild(tag);
    }

    body.appendChild(code);
    body.appendChild(name);
    body.appendChild(meta);
    label.appendChild(box);
    label.appendChild(body);
    return label;
  }

  function setAllTopics(on) {
    state.topics.clear();
    if (on) topicsForLevel().forEach(function (t) { state.topics.add(t.topic); });
    el.topicGroups.querySelectorAll('.rv-topic').forEach(function (label) {
      var box = label.querySelector('input');
      box.checked = on;
      label.classList.toggle('on', on);
    });
    updateTopicCount();
    syncPool();
  }
  document.getElementById('topics-all').addEventListener('click', function () { setAllTopics(true); });
  document.getElementById('topics-none').addEventListener('click', function () { setAllTopics(false); });

  function updateTopicCount() {
    var n = state.topics.size;
    el.topicCount.textContent = n
      ? plural(n, 'topic') + ' selected, ' + plural(questionsForTopics().length, 'question')
      : 'No topics selected';
  }

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
    var hasTopics = state.topics.size > 0;
    el.stepQs.hidden = !hasTopics;
    if (!hasTopics) { el.bar.hidden = true; return; }

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

  document.getElementById('pool-restore').addEventListener('click', syncPool);

  function updateCounts() {
    var n = included().length;
    var available = questionsForTopics().length;

    document.querySelectorAll('[data-quick]').forEach(function (btn) {
      btn.disabled = available < parseInt(btn.dataset.quick, 10);
    });
    document.getElementById('pool-restore').disabled = state.pool.length === available && state.removed.size === 0;

    el.startCount.textContent = '(' + n + ')';
    el.startBtn.disabled = n === 0;
    el.printBtn.disabled = n === 0;
    el.bar.hidden = state.pool.length === 0;

    var drawn = state.quick
      ? plural(state.quick, 'question') + ' drawn at random from ' + plural(state.topics.size, 'topic') + '.'
      : '';
    el.poolNote.textContent = state.removed.size
      ? (drawn ? drawn + ' ' : '') + plural(n, 'question') + ' left, ' + state.removed.size + ' removed.'
      : drawn || plural(n, 'question') + ' in this quiz.';
  }

  /* ── Hand-off ───────────────────────────────────────────── */
  /* The order is shuffled once, here, so the quiz page and the printed sheet
     both work from the same numbering. */
  function handOff(page) {
    sessionStorage.setItem('dp-review-quiz', JSON.stringify({
      title: el.title.value.trim() || 'DP Design Technology Review',
      ids: shuffled(included())
    }));
    window.location.href = page;
  }
  el.startBtn.addEventListener('click', function () { handOff('quiz.html'); });
  el.printBtn.addEventListener('click', function () { handOff('print.html'); });

  /* ── Load ───────────────────────────────────────────────── */
  fetch('questions.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      bank = data;
      bank.byId = {};
      bank.questions.forEach(function (q) { bank.byId[q.id] = q; });
    })
    .catch(function () {
      el.levelRow.insertAdjacentHTML('afterend',
        '<p class="rv-pool-empty">The question bank could not be loaded. Try reloading the page.</p>');
    });
})();
