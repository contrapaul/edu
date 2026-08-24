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
   carries its own verdict so the feedback is specific. */
(function () {
  'use strict';
  var briefEl = document.getElementById('autopsy-brief');
  if (!briefEl) return;

  var TARGET = 3;
  var SENTENCES = [
    { text: 'Our client group is the Grade 6 students who use the courtyard at lunch recess.',
      weak: false,
      why: 'Fine. It identifies the audience specifically, and identifying is not the same as claiming.' },
    { text: 'Everyone knows that Grade 6 students get bored during recess.',
      weak: true, fault: 'Appeals to what everyone knows',
      why: 'Everyone knows is not evidence, it is a way of skipping evidence. Who is bored, how many, and how would you know? Rescue it by replacing the phrase with a count from an actual observation.' },
    { text: 'We watched the courtyard on Tuesday and counted fourteen students, nine of whom sat without an activity for the whole recess.',
      weak: false,
      why: 'Fine, and the strongest sentence here. It says when, how many, and what was seen, so a reader can judge it.' },
    { text: 'A tabletop game is obviously the best solution for this problem.',
      weak: true, fault: 'States a conclusion, considers no alternative',
      why: 'Obviously is doing all the work, and no alternative is mentioned. A club, a sports rota and doing nothing are all cheaper. Rescue it by naming two alternatives and saying why a game beats them for this group.' },
    { text: 'Recess is 25 minutes long, so any game we design has to be playable inside that time.',
      weak: false,
      why: 'Fine. A fact leads to a constraint, and the link between them is stated rather than assumed.' },
    { text: 'They will love our game because we would have loved it at their age.',
      weak: true, fault: 'Assumes the designer is the user',
      why: 'The most common failure in Ai. Your own preferences at eleven are not evidence about these students now. Rescue it by asking them, or by dropping the claim entirely.' }
  ];

  var checkBtn   = document.getElementById('autopsy-check');
  var resetBtn   = document.getElementById('autopsy-reset');
  var statusEl   = document.getElementById('autopsy-status');
  var verdictsEl = document.getElementById('autopsy-verdicts');
  var buttons = [];
  var checked = false;

  function selectedCount() {
    return buttons.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
  }

  function updateStatus() {
    if (checked) return;
    var n = selectedCount();
    statusEl.textContent = n === 0
      ? 'Click the sentences that make a claim without supporting it.'
      : n + ' of ' + TARGET + ' selected.' + (n > TARGET ? ' That is more than three; unselect one.' : '');
  }

  function build() {
    briefEl.innerHTML = '';
    buttons = [];
    checked = false;
    verdictsEl.innerHTML = '';
    SENTENCES.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'g9-claim';
      b.textContent = s.text;
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        if (checked) return;
        b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        updateStatus();
      });
      briefEl.appendChild(b);
      briefEl.appendChild(document.createTextNode(' '));
      buttons.push(b);
    });
    updateStatus();
  }

  function check() {
    if (checked) return;
    if (selectedCount() !== TARGET) { updateStatus(); return; }
    checked = true;
    var found = 0;
    buttons.forEach(function (b, i) {
      var s = SENTENCES[i];
      var picked = b.getAttribute('aria-pressed') === 'true';
      b.classList.remove('is-correct', 'is-wrong', 'is-missed');
      b.classList.add('is-marked');
      if (picked && s.weak)        { b.classList.add('is-correct'); found++; }
      else if (picked && !s.weak)  { b.classList.add('is-wrong'); }
      else if (!picked && s.weak)  { b.classList.add('is-missed'); }
      b.setAttribute('aria-pressed', 'false');
    });

    statusEl.textContent = found === TARGET
      ? 'All three found. Every one of them would have survived a read-through.'
      : found + ' of 3 found. Read the verdicts below for the ones you missed.';

    verdictsEl.innerHTML = '';
    SENTENCES.forEach(function (s) {
      var d = document.createElement('div');
      d.className = 'g9-verdict' + (s.weak ? ' ok' : '');
      var n = document.createElement('span');
      n.className = 'g9-verdict-name';
      n.textContent = s.weak ? 'Unjustified: ' + s.fault : 'Justified';
      d.appendChild(n);
      d.appendChild(document.createTextNode(s.why));
      verdictsEl.appendChild(d);
    });
  }

  checkBtn.addEventListener('click', check);
  resetBtn.addEventListener('click', function () { build(); statusEl.textContent = 'Click the sentences that make a claim without supporting it.'; });
  build();
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
