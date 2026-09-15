/* g9-game-design.js: formative materials for the tabletop unit.
   Case modals and the drag-sort engine are handled globally by
   curriculum.js and drag-sort.js. This file only supplies content. */

/* ── NEED OR WANT SORT (Ai formative) ─────────────────────────
   Twelve observations about one client group. Four are evidenced
   needs, four are stated preferences, four are beliefs nobody has
   checked. The assumption pile is the teaching point. */
(function () {
  'use strict';
  var bankEl = document.getElementById('sort-needwant-bank');
  if (!bankEl || !window.DragSort) return;

  window.DragSort.init({
    enableDrag: true,
    bankEl: bankEl,
    zonesEl: document.getElementById('sort-needwant-zones'),
    statusEl: document.getElementById('sort-needwant-status'),
    resetBtn: document.getElementById('sort-needwant-reset'),
    zones: [
      { id: 'need',       label: 'Need' },
      { id: 'want',       label: 'Want' },
      { id: 'assumption', label: 'Assumption' }
    ],
    items: [
      { id: 'n1', correctZone: 'need',
        label: 'We watched the courtyard on Tuesday. Nine of the fourteen students there had nothing to do and walked laps until the bell.',
        explanation: 'Gathered by watching, not by asking, and it describes something the group actually lacks. This is the kind of line that can justify a project.' },
      { id: 'n2', correctZone: 'need',
        label: 'Recess is 25 minutes, and the group loses about 8 of those minutes queueing for lunch.',
        explanation: 'A measured constraint. It sets a hard limit on the design and it came from counting rather than guessing.' },
      { id: 'n3', correctZone: 'need',
        label: 'Three students in the group arrived this year and speak little English. We saw all three playing alone.',
        explanation: 'An observed gap with a real effect on those students. It also points straight at a design constraint about how much reading the game can require.' },
      { id: 'n4', correctZone: 'need',
        label: 'Only two of the fourteen courtyard tables have shade, so most of the group stands during recess.',
        explanation: 'Observed, specific, and it affects whether a table based game is usable at all. Evidence like this changes the design rather than decorating the brief.' },

      { id: 'w1', correctZone: 'want',
        label: 'The group told us they would like a game with dragons in it.',
        explanation: 'A stated preference. Cheap to satisfy and worth knowing, but it is not a reason to build anything. No dragon shortage is causing a problem at recess.' },
      { id: 'w2', correctZone: 'want',
        label: 'Two students said they would prefer a game that had a phone app to go with it.',
        explanation: 'A preference, and one that two students happened to voice. It tells you what would please them, not what they lack.' },
      { id: 'w3', correctZone: 'want',
        label: 'The group said the box should be black and gold.',
        explanation: 'A preference about appearance. Useful in Biv when the graphics are decided, useless as a justification in Ai.' },
      { id: 'w4', correctZone: 'want',
        label: 'One student asked whether their own name could be printed on a card.',
        explanation: 'One person, one wish. Worth remembering, but a single voiced want is the weakest thing you can build an argument on.' },

      { id: 'a1', correctZone: 'assumption',
        label: 'Grade 6 students get bored easily, so the game has to be fast.',
        explanation: 'Nobody checked this. It might be true, but as written it is a belief about an entire year group carried straight into a design rule.' },
      { id: 'a2', correctZone: 'assumption',
        label: 'Students that age love anything with a timer in it.',
        explanation: 'A guess dressed as a fact. Notice the word anything. Claims about what a whole group loves are almost always assumptions.' },
      { id: 'a3', correctZone: 'assumption',
        label: 'They will not read a rulebook, so all the rules need to be pictures.',
        explanation: 'Two assumptions stacked: that they will not read, and that pictures are therefore the answer. Both are testable in about ten minutes, and neither has been tested.' },
      { id: 'a4', correctZone: 'assumption',
        label: 'Younger students prefer luck to strategy because they cannot plan ahead.',
        explanation: 'A belief about ability, stated as a reason. It is also the assumption most likely to produce a game with no meaningful choices in it.' }
    ]
  });
})();

/* ── WEAK BRIEF AUTOPSY (Ai formative) ────────────────────────
   Six sentences, three of which assert something they never
   support. Students select three, then check. Each sentence
   carries its own verdict so the feedback is specific.
   Behaviour lives in the shared claim-hunt.js. */
(function () {
  'use strict';
  var briefEl = document.getElementById('autopsy-brief');
  if (!briefEl || !window.ClaimHunt) return;

  /* Eight sentences, three of them unjustified. Two of the five that pass
     sit immediately after the weak sentence they resemble, so the choice
     is not a yes or no on tone. Each near miss is the correct version of
     its neighbour, which is the point of the activity. */
  var SENTENCES = [
    { text: 'Our client group is the Grade 6 students who use the courtyard at lunch recess.',
      weak: false,
      why: 'Fine. It identifies the audience specifically, and identifying is not the same as claiming.' },
    { text: 'Everyone knows that Grade 6 students get bored during recess.',
      weak: true, fault: 'Appeals to what everyone knows',
      why: 'Everyone knows is not evidence, it is a way of skipping evidence. Who is bored, how many, and how would you know? Rescue it by replacing the phrase with a count from an actual observation.' },
    { text: 'Two teachers on duty told us they want more indoor activities that do not involve laptops.',
      weak: false,
      why: 'Fine, and worth comparing with the sentence before it. This one says who spoke and how many of them. Everyone knows says neither.' },
    { text: 'We watched the courtyard on Tuesday and counted fourteen students, nine of whom sat without an activity for the whole recess.',
      weak: false,
      why: 'Fine, and the strongest sentence here. It says when, how many, and what was seen, so a reader can judge it.' },
    { text: 'A tabletop game is obviously the best solution for this problem.',
      weak: true, fault: 'States a conclusion, considers no alternative',
      why: 'Obviously is doing all the work, and no alternative is mentioned. A club, a sports rota and doing nothing are all cheaper. Rescue it by naming two alternatives and saying why a game beats them for this group.' },
    { text: 'Tabletop games suit this slot because they need no screen, no setup space and no adult to run them.',
      weak: false,
      why: 'Fine, and the sentence above is the same claim done badly. This one gives three reasons you could go and check. Obviously gives none.' },
    { text: 'Recess is 25 minutes long, so any game we design has to be playable inside that time.',
      weak: false,
      why: 'Fine. A fact leads to a constraint, and the link between them is stated rather than assumed.' },
    { text: 'They will love our game because we would have loved it at their age.',
      weak: true, fault: 'Assumes the designer is the user',
      why: 'The most common failure in Ai. Your own preferences at eleven are not evidence about these students now. Rescue it by asking them, or by dropping the claim entirely.' }
  ];

  window.ClaimHunt.init({
    briefEl: briefEl,
    checkBtn: document.getElementById('autopsy-check'),
    resetBtn: document.getElementById('autopsy-reset'),
    statusEl: document.getElementById('autopsy-status'),
    verdictsEl: document.getElementById('autopsy-verdicts'),
    target: 3,
    sentences: SENTENCES,
    allFound: 'All three found. Every one of them would have survived a read-through.'
  });
})();

/* ── MEANINGFUL CHOICE CHECKER (rules section, feeds Bii) ─────
   One decision from the student's own game, run through the four
   criteria on the page. Each answer is yes, no or not sure. A no
   comes back with the fix, a not sure comes back with which of the
   four tests to run, and only four yeses let the choice through. */
(function () {
  'use strict';
  var root = document.getElementById('checker');
  if (!root) return;

  var CRITERIA = [
    { id: 'diff',
      title: 'The options are actually different.',
      ask:   'If the player picked the other option instead, would something different happen in the game?',
      yes:   'Yes, they lead to different places',
      no:    'No, it ends up about the same',
      fix:   'Make the options do different things. If red and blue lead to the same place, one of them is not an option and should go.',
      test:  'The coin flip test. Play the moment twice, once thinking and once at random, and see if the result changes.' },
    { id: 'dominant',
      title: 'No option is always best.',
      ask:   'Is there a situation where each option is the right one to pick?',
      yes:   'Yes, it depends on the situation',
      no:    'No, one option is nearly always right',
      fix:   'You have a dominant strategy. Give the losing option a moment where it wins, by changing what it costs, when it can be used, or what the other players can see.',
      test:  'The dominant strategy check. Put five players in the same spot and watch what they pick. Five of the same answer means there was no choice.' },
    { id: 'reason',
      title: 'The player can reason about it.',
      ask:   'Does the player know enough to weigh it up, without the answer being obvious?',
      yes:   'Yes, they can weigh it up',
      no:    'No, it is a guess, or it is obvious',
      fix:   'If it is a guess, show the player more. If it is obvious, hide something, or add a second thing they have to weigh against the first.',
      test:  'The explain back test. Ask a player why they chose that. "It was the only sensible option" and "I don\'t know" are both failures.' },
    { id: 'visible',
      title: 'The consequence is visible.',
      ask:   'Two turns later, can the player point to what their choice caused?',
      yes:   'Yes, they can see what it did',
      no:    'No, the result gets lost',
      fix:   'Shorten the gap between the choice and its result, or make the result something the player can see on the table rather than something that happens in the maths.',
      test:  'The regret test. After the game, ask whether there was a moment they wish they had played differently. No regret usually means no visible consequence.' }
  ];

  var listEl    = document.getElementById('checker-list');
  var verdictEl = document.getElementById('checker-verdict');
  var decEl     = document.getElementById('checker-decision');

  function render() {
    listEl.innerHTML = '';
    CRITERIA.forEach(function (c, i) {
      var li = document.createElement('li');
      li.className = 'g9-check';
      li.dataset.crit = c.id;

      var num = document.createElement('span');
      num.className = 'g9-check-num';
      num.textContent = i + 1;
      li.appendChild(num);

      var head = document.createElement('div');
      head.className = 'g9-check-head';
      var t = document.createElement('strong'); t.textContent = c.title;
      var q = document.createElement('span');   q.textContent = c.ask;
      head.appendChild(t); head.appendChild(q);
      li.appendChild(head);

      var opts = document.createElement('div');
      opts.className = 'g9-check-opts';
      opts.setAttribute('role', 'radiogroup');
      opts.setAttribute('aria-label', c.title);
      [['yes', c.yes], ['no', c.no], ['unsure', 'Not sure']].forEach(function (o) {
        var lab = document.createElement('label');
        lab.className = 'g9-check-opt';
        var inp = document.createElement('input');
        inp.type = 'radio'; inp.name = 'checker-' + c.id; inp.value = o[0];
        var sp = document.createElement('span'); sp.textContent = o[1];
        lab.appendChild(inp); lab.appendChild(sp);
        opts.appendChild(lab);
      });
      li.appendChild(opts);
      listEl.appendChild(li);
    });
  }

  function answer(c) {
    var on = root.querySelector('input[name="checker-' + c.id + '"]:checked');
    return on ? on.value : null;
  }

  function mark() {
    CRITERIA.forEach(function (c) {
      var li = listEl.querySelector('[data-crit="' + c.id + '"]');
      var a = answer(c);
      li.classList.toggle('is-yes',    a === 'yes');
      li.classList.toggle('is-no',     a === 'no');
      li.classList.toggle('is-unsure', a === 'unsure');
    });
  }

  function p(text, cls) {
    var el = document.createElement('p');
    if (cls) el.className = cls;
    el.textContent = text;
    return el;
  }
  function itemList(rows) {
    var ul = document.createElement('ul');
    rows.forEach(function (r) {
      var li = document.createElement('li');
      var b = document.createElement('strong'); b.textContent = r[0] + ' ';
      li.appendChild(b); li.appendChild(document.createTextNode(r[1]));
      ul.appendChild(li);
    });
    return ul;
  }

  function check() {
    mark();
    verdictEl.className = 'g9-checker-verdict';
    verdictEl.innerHTML = '';

    var missing = CRITERIA.filter(function (c) { return !answer(c); });
    if (!decEl.value.trim()) {
      verdictEl.appendChild(p('Write the decision down first. If it will not go in one sentence, that is already a finding.', 'warn'));
      return;
    }
    if (missing.length) {
      verdictEl.appendChild(p('Answer all four. ' + missing.length + (missing.length === 1 ? ' is' : ' are') + ' still blank.', 'warn'));
      return;
    }

    var nos     = CRITERIA.filter(function (c) { return answer(c) === 'no'; });
    var unsures = CRITERIA.filter(function (c) { return answer(c) === 'unsure'; });
    var dec = '“' + decEl.value.trim() + '”';

    if (nos.length) {
      verdictEl.classList.add('fail');
      verdictEl.appendChild(p('This choice does not survive yet.', 'v-head'));
      verdictEl.appendChild(p(dec + ' fails ' + (nos.length === 1 ? 'one criterion' : nos.length + ' criteria') + '. A choice has to pass all four at once, so fix these before it goes on a concept sheet.'));
      verdictEl.appendChild(itemList(nos.map(function (c) { return [c.title, c.fix]; })));
      if (unsures.length) {
        verdictEl.appendChild(p('Then test the ' + (unsures.length === 1 ? 'one' : unsures.length) + ' you were not sure about.'));
      }
      return;
    }
    if (unsures.length) {
      verdictEl.classList.add('unsure');
      verdictEl.appendChild(p('You cannot tell yet, and that is the honest answer.', 'v-head'));
      verdictEl.appendChild(p(dec + ' has no failures, but not sure is not a pass. Each one has a test on this page that settles it in a few minutes of play.'));
      verdictEl.appendChild(itemList(unsures.map(function (c) { return [c.title, c.test]; })));
      return;
    }
    verdictEl.classList.add('pass');
    verdictEl.appendChild(p('This choice survives.', 'v-head'));
    verdictEl.appendChild(p(dec + ' passes all four. Circle it on your Bii concept sheet and write these four answers next to it, because that annotation is what gets assessed. Then run the four tests on a real player, since your own answers are the easiest ones to be wrong about.'));
  }

  function reset() {
    decEl.value = '';
    Array.prototype.forEach.call(root.querySelectorAll('input[type=radio]'), function (r) { r.checked = false; });
    mark();
    verdictEl.className = 'g9-checker-verdict';
    verdictEl.innerHTML = '';
  }

  render();
  listEl.addEventListener('change', mark);
  document.getElementById('checker-check').addEventListener('click', check);
  document.getElementById('checker-reset').addEventListener('click', reset);
})();


/* ── RESEARCH BUDGET PLANNER (Aii formative) ──────────────────
   Twelve tokens, six activities, ten ordered slots. Dragging uses
   pointer events so a finger works as well as a mouse; clicking a
   chip or pressing Enter on it does the same job for anyone not
   using a pointer at all. Overspending is blocked rather than
   warned about, because the scarcity is the whole exercise. */
(function () {
  'use strict';
  var root = document.getElementById('planner');
  if (!root) return;

  var BUDGET = 12, SLOTS = 10;

  var ACTIVITIES = [
    { id: 'secondary',   label: 'Read a secondary source',  cost: 1, kind: 'Secondary' },
    { id: 'teardown',    label: 'Analyse an existing game', cost: 2, kind: 'Secondary' },
    { id: 'survey',      label: 'Questionnaire',            cost: 2, kind: 'Primary' },
    { id: 'observation', label: 'Structured observation',   cost: 3, kind: 'Primary' },
    { id: 'interview',   label: 'Interview',                cost: 3, kind: 'Primary' },
    { id: 'focus',       label: 'Focus group',              cost: 4, kind: 'Primary' }
  ];
  function byId(id) { for (var i = 0; i < ACTIVITIES.length; i++) if (ACTIVITIES[i].id === id) return ACTIVITIES[i]; return null; }

  var plan = new Array(SLOTS).fill(null);   // slot index -> activity id

  var bankEl  = document.getElementById('planner-bank');
  var slotsEl = document.getElementById('planner-slots');
  var pipsEl  = document.getElementById('planner-pips');
  var spentEl = document.getElementById('planner-spent');
  var leftEl  = document.getElementById('planner-left');
  var msgEl   = document.getElementById('planner-msg');

  function spent() {
    return plan.reduce(function (t, id) { return id ? t + byId(id).cost : t; }, 0);
  }
  function firstEmpty() { return plan.indexOf(null); }

  function say(text, warn) {
    msgEl.textContent = text || '';
    msgEl.classList.toggle('warn', !!warn);
  }

  /* ── rendering ── */
  function renderBudget() {
    var s = spent(), left = BUDGET - s;
    spentEl.textContent = s;
    leftEl.textContent = left === 0 ? 'Nothing left to spend' : left + ' left';
    root.classList.toggle('is-full', left === 0);
    pipsEl.innerHTML = '';
    for (var i = 0; i < BUDGET; i++) {
      var pip = document.createElement('span');
      pip.className = 'g9-planner-pip' + (i < s ? ' spent' : '');
      pipsEl.appendChild(pip);
    }
    /* A chip nobody can afford says so rather than failing silently. */
    Array.prototype.forEach.call(bankEl.children, function (chip) {
      var a = byId(chip.dataset.act);
      var blocked = a.cost > left || firstEmpty() === -1;
      chip.classList.toggle('too-dear', blocked);
      chip.setAttribute('aria-disabled', blocked ? 'true' : 'false');
    });
  }

  function renderSlots() {
    slotsEl.innerHTML = '';
    plan.forEach(function (id, i) {
      var li = document.createElement('li');
      li.className = 'g9-slot' + (id ? ' filled' : '');
      li.dataset.slot = i;

      var num = document.createElement('span');
      num.className = 'g9-slot-num';
      num.textContent = i + 1;
      li.appendChild(num);

      if (id) {
        var a = byId(id);
        var t = document.createElement('span');
        t.className = 'g9-slot-text';
        t.textContent = a.label;
        var k = document.createElement('span');
        k.className = 'g9-slot-kind';
        k.textContent = a.kind;
        var c = document.createElement('span');
        c.className = 'g9-slot-cost';
        c.textContent = a.cost + (a.cost === 1 ? ' token' : ' tokens');
        var x = document.createElement('button');
        x.type = 'button';
        x.className = 'g9-slot-x';
        x.innerHTML = '&times;';
        x.setAttribute('aria-label', 'Remove ' + a.label + ' from step ' + (i + 1));
        x.addEventListener('click', function () { removeAt(i); });
        li.appendChild(t); li.appendChild(k); li.appendChild(c); li.appendChild(x);
      } else {
        var e = document.createElement('span');
        e.className = 'g9-slot-empty-text';
        e.textContent = 'Empty';
        li.appendChild(e);
      }
      slotsEl.appendChild(li);
    });
  }

  function render() { renderSlots(); renderBudget(); }

  /* ── placing and removing ── */
  function place(actId, slotIndex) {
    var a = byId(actId);
    if (!a) return false;
    if (slotIndex == null || slotIndex < 0) slotIndex = firstEmpty();
    if (slotIndex === -1) { say('All ten steps are full. Remove one first.', true); return false; }
    if (plan[slotIndex]) { say('That step is taken. Drop it on an empty one.', true); return false; }
    if (spent() + a.cost > BUDGET) {
      say('That would cost ' + a.cost + ' and you only have ' + (BUDGET - spent()) + ' left. Something has to go.', true);
      return false;
    }
    plan[slotIndex] = actId;
    render();
    say('Added ' + a.label + ' as step ' + (slotIndex + 1) + '.');
    return true;
  }

  function removeAt(i) {
    if (!plan[i]) return;
    var a = byId(plan[i]);
    plan[i] = null;
    render();
    say('Removed ' + a.label + '. You have ' + (BUDGET - spent()) + ' tokens back.');
  }

  /* ── bank chips, with pointer drag and a click fallback ── */
  var drag = null;

  function startDrag(chip, ev) {
    if (chip.classList.contains('too-dear')) return;
    drag = { act: chip.dataset.act, chip: chip, moved: false, ghost: null, target: null };
    chip.setPointerCapture(ev.pointerId);
  }

  function makeGhost(chip, x, y) {
    var g = chip.cloneNode(true);
    g.classList.add('g9-chip-ghost');
    g.style.left = x + 'px';
    g.style.top = y + 'px';
    document.body.appendChild(g);
    chip.classList.add('is-dragging');
    return g;
  }

  function slotUnder(x, y) {
    var el = document.elementFromPoint(x, y);
    return el ? el.closest('.g9-slot') : null;
  }

  function onMove(ev) {
    if (!drag) return;
    if (!drag.moved) {
      /* A few pixels of slop so a plain click is not read as a drag. */
      drag.moved = true;
      drag.ghost = makeGhost(drag.chip, ev.clientX, ev.clientY);
    }
    drag.ghost.style.left = ev.clientX + 'px';
    drag.ghost.style.top = ev.clientY + 'px';
    var slot = slotUnder(ev.clientX, ev.clientY);
    if (drag.target && drag.target !== slot) drag.target.classList.remove('drop-target');
    if (slot && !plan[+slot.dataset.slot]) { slot.classList.add('drop-target'); drag.target = slot; }
    else drag.target = null;
  }

  var suppressClick = false;

  function endDrag(ev) {
    if (!drag) return;
    var d = drag; drag = null;
    if (d.ghost) d.ghost.remove();
    d.chip.classList.remove('is-dragging');
    if (d.target) d.target.classList.remove('drop-target');
    if (!d.moved) return;               // a plain click; the click handler deals with it
    suppressClick = true;               // a real drag happened, so ignore the click that follows
    var slot = slotUnder(ev.clientX, ev.clientY);
    if (slot) place(d.act, +slot.dataset.slot);
    else say('Dropped outside the plan, so nothing was added.');
  }

  ACTIVITIES.forEach(function (a) {
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'g9-chip';
    chip.dataset.act = a.id;
    var label = document.createElement('span');
    label.textContent = a.label;
    var cost = document.createElement('span');
    cost.className = 'g9-chip-cost';
    cost.textContent = a.cost;
    chip.appendChild(label); chip.appendChild(cost);
    chip.addEventListener('pointerdown', function (e) { startDrag(chip, e); });
    chip.addEventListener('pointermove', onMove);
    chip.addEventListener('pointerup', endDrag);
    chip.addEventListener('pointercancel', function () {
      if (drag && drag.ghost) drag.ghost.remove();
      if (drag) drag.chip.classList.remove('is-dragging');
      drag = null;
    });
    /* Click covers a mouse click, a touch tap, and Enter or Space on the
       button, so the widget never depends on pointer events alone. */
    chip.addEventListener('click', function () {
      if (suppressClick) { suppressClick = false; return; }
      place(a.id, null);
    });
    bankEl.appendChild(chip);
  });

  document.getElementById('planner-clear').addEventListener('click', function () {
    plan = new Array(SLOTS).fill(null);
    render();
    say('Cleared. All 12 tokens are back.');
  });

  /* ── PNG export, drawn by hand so nothing external is needed ── */
  function downloadPNG() {
    var rows = plan.map(function (id, i) { return id ? { n: i + 1, a: byId(id) } : null; })
                   .filter(Boolean);
    if (!rows.length) { say('Add at least one activity before downloading.', true); return; }

    var S = 2, W = 900, PAD = 40, ROW = 54;
    var H = PAD + 96 + rows.length * ROW + 92;
    var cv = document.createElement('canvas');
    cv.width = W * S; cv.height = H * S;
    var g = cv.getContext('2d');
    g.scale(S, S);

    var INK = '#111418', MUTED = '#64748b', LINE = '#dde1e6', ACCENT = '#1a5cb8';
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);

    g.fillStyle = INK;
    g.font = '600 30px Lexend, Helvetica, Arial, sans-serif';
    g.fillText('My design research plan', PAD, PAD + 26);

    g.fillStyle = MUTED;
    g.font = '15px Lexend, Helvetica, Arial, sans-serif';
    g.fillText('Name: ' + '.'.repeat(46), PAD, PAD + 56);

    g.strokeStyle = LINE; g.lineWidth = 1;
    g.beginPath(); g.moveTo(PAD, PAD + 76); g.lineTo(W - PAD, PAD + 76); g.stroke();

    var y = PAD + 96;
    rows.forEach(function (r) {
      g.fillStyle = ACCENT;
      g.beginPath(); g.roundRect(PAD, y + 10, 30, 30, 7); g.fill();
      g.fillStyle = '#ffffff';
      g.font = '700 14px ui-monospace, Menlo, monospace';
      g.textAlign = 'center';
      g.fillText(String(r.n), PAD + 15, y + 30);
      g.textAlign = 'left';

      g.fillStyle = INK;
      g.font = '17px Lexend, Helvetica, Arial, sans-serif';
      g.fillText(r.a.label, PAD + 46, y + 30);

      g.fillStyle = MUTED;
      g.font = '13px ui-monospace, Menlo, monospace';
      g.textAlign = 'right';
      g.fillText(r.a.kind.toUpperCase(), W - PAD - 92, y + 30);
      g.fillText(r.a.cost + (r.a.cost === 1 ? ' token' : ' tokens'), W - PAD, y + 30);
      g.textAlign = 'left';

      g.strokeStyle = LINE;
      g.beginPath(); g.moveTo(PAD, y + ROW - 2); g.lineTo(W - PAD, y + ROW - 2); g.stroke();
      y += ROW;
    });

    var total = spent();
    g.fillStyle = INK;
    g.font = '600 19px Lexend, Helvetica, Arial, sans-serif';
    g.fillText(total + ' of ' + BUDGET + ' tokens spent', PAD, y + 34);

    g.fillStyle = MUTED;
    g.font = '14px Lexend, Helvetica, Arial, sans-serif';
    var unspent = BUDGET - total;
    g.fillText(unspent === 0 ? 'Every token spent. What did you give up to do it?'
                             : unspent + ' unspent. What would you buy with them?', PAD, y + 58);

    var a = document.createElement('a');
    a.download = 'My design research plan.png';
    a.href = cv.toDataURL('image/png');
    a.click();
    say('Downloaded as "My design research plan.png".');
  }

  document.getElementById('planner-png').addEventListener('click', downloadPNG);

  render();
  say('Drag an activity into a step, or click it to add it to the next empty one.');
})();


/* ── QUESTION QUALITY LADDER (Aii formative) ──────────────────
   Six research questions about one audience, each sitting on a
   different rung. The rungs are named after what is missing
   rather than numbered, so a question is placed by diagnosing it
   and not by guessing an order. Only the top rung has all three
   of number, method and decision. */
(function () {
  'use strict';
  var bankEl = document.getElementById('sort-qladder-bank');
  if (!bankEl || !window.DragSort) return;

  window.DragSort.init({
    enableDrag: true,
    bankEl: bankEl,
    zonesEl: document.getElementById('sort-qladder-zones'),
    statusEl: document.getElementById('sort-qladder-status'),
    resetBtn: document.getElementById('sort-qladder-reset'),
    zones: [
      { id: 'sharp',    label: 'Sharp · a number that changes the game' },
      { id: 'idle',     label: 'Measurable · but decides nothing' },
      { id: 'cant',     label: 'Unanswerable · not by you, not now' },
      { id: 'vague',    label: 'Vague · no number, no time' },
      { id: 'yesno',    label: 'Yes or no · a one word answer' },
      { id: 'opinion',  label: 'Opinion · about everybody' }
    ],
    items: [
      { id: 'q1', correctZone: 'sharp',
        label: 'How long does a group of Grade 6 students stay at one table before they get up, timed over five lunches?',
        explanation: 'A number, a method, and a decision waiting on it. Whatever that number turns out to be is the longest your game can run, and that single figure shapes the round length, the win condition and the box size. This is what a token buys.' },
      { id: 'q2', correctZone: 'idle',
        label: 'How many Grade 6 students are there in the school?',
        explanation: 'You can answer this in one email, and the answer is a clean number, which is why it looks like research. Ask what you would do differently if it were 60 rather than 90. Nothing. A question that cannot change the game does not belong on a plan with 12 tokens.' },
      { id: 'q3', correctZone: 'cant',
        label: 'Will Grade 6 students still want to play our game in six months?',
        explanation: 'A good thing to wonder about and impossible to research, because the answer lives in the future. No interview, questionnaire or observation reaches it. Questions like this quietly turn into assumptions, because the plan says they were answered.' },
      { id: 'q4', correctZone: 'vague',
        label: 'Is there enough time at lunch for a game?',
        explanation: 'Enough time compared with what? Two people could research this honestly and come back disagreeing, because nothing here says what is being measured. Put a unit and a limit in it and it climbs two rungs: how many minutes are free, and how many does your game need?' },
      { id: 'q5', correctZone: 'yesno',
        label: 'Do Grade 6 students play games at lunch?',
        explanation: 'Answerable, about the right group, and worth almost nothing, because the answer is one word. Yes tells you nothing about what they play, how long for, or how many at a table. Yes or no questions are worth asking only as the first half of a longer one.' },
      { id: 'q6', correctZone: 'opinion',
        label: 'Do people like games?',
        explanation: 'The bottom rung, and the most commonly written question in the unit. There is no audience in it, no place, no number and no answer you could act on. Everybody already knows the answer is roughly yes, which is how you can tell nothing was found out.' }
    ]
  });
})();
