(function () {
'use strict';

/* ═══════════════════════════════════════════════════════════
   FIELD RESEARCH GENERATOR
═══════════════════════════════════════════════════════════ */

var FR_TASKS = [
  {
    setting: 'School canteen during lunch (observe for 15 minutes)',
    observe: 'How students navigate queues, where congestion forms, and how long they spend deciding what to eat.',
    collect: [
      'Sketch a rough floor plan and mark where people slow down or stop',
      'Count how many students abandon the queue before reaching the front',
      'Note signage: can you tell what\'s on the menu before joining the queue?'
    ],
    tip: 'Stand near the exit, not the entrance — you\'ll see the full flow without blocking it.'
  },
  {
    setting: 'Bus stop or train platform during peak hours',
    observe: 'How people interact with ticket machines, departure boards and physical barriers.',
    collect: [
      'Time how long a typical transaction takes at a ticket machine',
      'Note how many people ask for help from staff or other passengers',
      'Record what information people look for first when they arrive'
    ],
    tip: 'Count under-five: how many interactions take under 5 seconds? How many take over 30?'
  },
  {
    setting: 'Supermarket self-checkout area',
    observe: 'Where errors occur, where staff intervention is needed, and how users respond to on-screen prompts.',
    collect: [
      'Tally how many transactions require staff assistance',
      'Note which steps cause hesitation (bagging area, payment, weighing items)',
      'Observe whether users read on-screen instructions or ignore them'
    ],
    tip: 'Watch for the "unexpected item in bagging area" moment — note the user\'s body language.'
  },
  {
    setting: 'Public library entrance or reception area',
    observe: 'How first-time visitors navigate to find what they need without prior knowledge of the space.',
    collect: [
      'Track the first three things a new visitor looks at',
      'Note which directional signs, if any, are consulted',
      'Count how many people ask staff for directions vs. navigate independently'
    ],
    tip: 'Focus on people who pause and look around — these are moments of navigational uncertainty.'
  },
  {
    setting: 'Gym or fitness centre, free weights or machine area',
    observe: 'How users interact with adjustable equipment and how they determine correct settings.',
    collect: [
      'Note how users figure out how to adjust seat height, weight or resistance',
      'Count how many read the instruction sticker vs. just guess',
      'Observe whether users re-rack weights — and if not, where they leave them'
    ],
    tip: 'Equipment that is regularly misadjusted is a design problem, not a user problem.'
  },
  {
    setting: 'School corridor near lockers between classes',
    observe: 'Traffic flow, bottlenecks and how students navigate high-density transitions.',
    collect: [
      'Map the most congested points in the corridor',
      'Time how long it takes a student to access their locker and move on',
      'Note whether any students skip their locker entirely — and why'
    ],
    tip: 'Arrive 2 minutes before a class ends so you observe the full wave of movement.'
  },
  {
    setting: 'Coffee shop during peak morning hours',
    observe: 'Order flow, wait behaviour and how customers interact with menus and pickup points.',
    collect: [
      'Time the average wait between ordering and receiving a drink',
      'Note where customers position themselves while waiting and whether this causes confusion',
      'Record how customers know their order is ready — name called, number, app notification?'
    ],
    tip: 'Watch the handoff moment: how confident is the customer that the drink they pick up is theirs?'
  },
  {
    setting: 'Hospital or clinic waiting area',
    observe: 'How patients find information, manage check-in, and understand their status in the queue.',
    collect: [
      'Note how patients discover where to sit after arriving',
      'Track how patients know when it\'s their turn — screen, staff call, pager?',
      'Observe how long patients wait before approaching reception to ask about their status'
    ],
    tip: 'Focus on patients who appear uncertain — they reveal exactly where the communication system breaks down.'
  }
];

function initFieldResearch() {
  var btn = document.getElementById('fr-generate');
  var card = document.getElementById('fr-card');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var task = FR_TASKS[Math.floor(Math.random() * FR_TASKS.length)];
    document.getElementById('fr-setting').textContent = task.setting;
    document.getElementById('fr-observe').textContent = task.observe;
    var list = document.getElementById('fr-collect');
    list.innerHTML = '';
    task.collect.forEach(function (c) {
      var li = document.createElement('li');
      li.textContent = c;
      list.appendChild(li);
    });
    document.getElementById('fr-tip-text').textContent = task.tip;
    card.style.display = 'block';
  });
}

/* ═══════════════════════════════════════════════════════════
   FOCUS GROUP GENERATOR
═══════════════════════════════════════════════════════════ */

/* Bank of 15 questions — each drawn set shows its bank number,
   inviting users to discover how many there are. */
var FG_QUESTIONS = [
  'What words come to mind when you first think about {topic}?',                                             // 1
  'When was the last time you used or encountered {topic}? Walk us through what that experience was like.', // 2
  'What is the single most frustrating thing about {topic} as it currently exists?',                        // 3
  'If you could change one thing about {topic}, what would it be — and why that one thing in particular?',  // 4
  'How does {topic} compare to alternatives you\'ve tried? What does it do better or worse?',               // 5
  'Who do you think {topic} is designed for? Does that match your own experience using it?',                // 6
  'What would need to be true for you to trust {topic} more than you currently do?',                        // 7
  'Imagine you\'re describing {topic} to a friend who has never heard of it. What would you say?',          // 8
  'What would need to be true for {topic} to become something you used — or relied on — every day?',        // 9
  'Think about the last time {topic} let you down. What happened, and what did you do next?',               // 10
  'Is there anything about {topic} that you\'ve simply given up trying to figure out?',                     // 11
  'If you could redesign {topic} from scratch, what would be the very first thing you\'d change?',          // 12
  'How do you feel when {topic} doesn\'t work as expected? What do you do next?',                           // 13
  'If a friend was about to use {topic} for the first time, what would you tell them to expect?',           // 14
  'What three words would you use to describe your ideal version of {topic}?'                               // 15
];

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function initFocusGroup() {
  var btn       = document.getElementById('fg-generate');
  var newBtn    = document.getElementById('fg-new');
  var topicEl   = document.getElementById('fg-topic-input');
  var output    = document.getElementById('fg-output');
  var list      = document.getElementById('fg-list');
  if (!btn) return;

  function generate() {
    var topic = (topicEl.value || '').trim() || 'the product';

    /* Shuffle the index array so each question keeps its bank number */
    var indices = FG_QUESTIONS.map(function (_, i) { return i; });
    var picked  = shuffle(indices).slice(0, 6);

    list.innerHTML = '';
    picked.forEach(function (idx) {
      var q  = FG_QUESTIONS[idx];
      var li = document.createElement('li');

      var num = document.createElement('span');
      num.className   = 'fg-q-num';
      num.textContent = (idx + 1) + '.';
      li.appendChild(num);

      var body  = document.createElement('span');
      var parts = q.split('{topic}');
      if (parts.length > 1) {
        body.appendChild(document.createTextNode(parts[0]));
        var hl = document.createElement('span');
        hl.className   = 'fg-topic-highlight';
        hl.textContent = topic;
        body.appendChild(hl);
        body.appendChild(document.createTextNode(parts[1] || ''));
      } else {
        body.textContent = q;
      }
      li.appendChild(body);
      list.appendChild(li);
    });
    output.style.display = 'block';
  }

  btn.addEventListener('click', generate);
  newBtn.addEventListener('click', generate);

  /* Enter / Return inside the topic field triggers generation */
  topicEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); generate(); }
  });
}

/* ═══════════════════════════════════════════════════════════
   LIKERT SIMULATOR
═══════════════════════════════════════════════════════════ */

/* Questions use {product} as a placeholder that the subject input fills.
   Each rendered question is also a fully-editable text field. */
var LIKERT_TEMPLATES = [
  '{product} is easy to use the first time, without instructions.',
  'I can complete tasks quickly once I know how {product} works.',
  'After not using {product} for a while, I could pick it up again without difficulty.',
  'When I make a mistake with {product}, I can recover quickly.',
  'Using {product} is a satisfying experience overall.'
];

var LIKERT_LABELS = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];

function boxMuller() {
  var u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function clamp(val, lo, hi) { return Math.max(lo, Math.min(hi, val)); }

function initLikert() {
  var qContainer  = document.getElementById('likert-questions');
  var submitBtn   = document.getElementById('likert-submit');
  var resetBtn    = document.getElementById('likert-reset');
  var resultsBody = document.getElementById('likert-results-body');
  var rightPanel  = document.getElementById('likert-right');
  var leftPanel   = document.getElementById('likert-left');
  var subjectEl   = document.getElementById('likert-subject');
  if (!qContainer) return;

  var answers   = [0, 0, 0, 0, 0];
  var qInputEls = []; // references to the editable question inputs

  /* Fill all question inputs from templates using the current subject */
  function fillFromSubject() {
    var s = (subjectEl ? subjectEl.value : '').trim() || 'this product';
    qInputEls.forEach(function (inp, qi) {
      inp.value = LIKERT_TEMPLATES[qi].replace(/\{product\}/g, s);
    });
  }

  /* Build question rows as editable inputs */
  LIKERT_TEMPLATES.forEach(function (template, qi) {
    var row  = document.createElement('div');
    row.className = 'likert-q';

    var text = document.createElement('input');
    text.type      = 'text';
    text.className = 'likert-q-text';
    text.value     = template.replace(/\{product\}/g, 'this product');
    qInputEls.push(text);
    row.appendChild(text);

    var opts = document.createElement('div');
    opts.className = 'likert-opts';
    for (var i = 1; i <= 5; i++) {
      (function (val) {
        var opt = document.createElement('button');
        opt.className = 'likert-opt';
        opt.type = 'button';
        var num = document.createElement('span');
        num.className   = 'likert-opt-n';
        num.textContent = val;
        var lbl = document.createElement('span');
        lbl.className   = 'likert-opt-l';
        lbl.textContent = LIKERT_LABELS[val - 1];
        opt.appendChild(num);
        opt.appendChild(lbl);
        opt.addEventListener('click', function () {
          answers[qi] = val;
          opts.querySelectorAll('.likert-opt').forEach(function (o) { o.classList.remove('selected'); });
          opt.classList.add('selected');
        });
        opts.appendChild(opt);
      })(i);
    }
    row.appendChild(opts);
    qContainer.appendChild(row);
  });

  /* Subject input: live-fill {product} into all question inputs */
  if (subjectEl) {
    subjectEl.addEventListener('input', fillFromSubject);
    subjectEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') e.preventDefault();
    });
  }

  submitBtn.addEventListener('click', function () {
    for (var i = 0; i < answers.length; i++) {
      if (answers[i] === 0) {
        alert('Please answer all five questions before getting results.');
        return;
      }
    }
    resultsBody.innerHTML = '';
    LIKERT_TEMPLATES.forEach(function (_, qi) {
      var mean        = answers[qi];
      var qLabel      = qInputEls[qi] ? qInputEls[qi].value : LIKERT_TEMPLATES[qi];
      var counts      = [0, 0, 0, 0, 0];
      for (var n = 0; n < 1000; n++) {
        var v = Math.round(mean + boxMuller() * 1.1);
        counts[clamp(v, 1, 5) - 1]++;
      }
      var block = document.createElement('div');
      block.className = 'likert-result-q';
      var qText = document.createElement('div');
      qText.className   = 'likert-result-q-text';
      qText.textContent = (qi + 1) + '. ' + qLabel;
      block.appendChild(qText);

      var barFills = [];
      counts.forEach(function (count, ci) {
        var pct    = count / 10;
        var barRow = document.createElement('div');
        barRow.className = 'likert-bar-row';
        var lbl = document.createElement('span');
        lbl.className   = 'likert-bar-label';
        lbl.textContent = LIKERT_LABELS[ci];
        var track = document.createElement('div');
        track.className = 'likert-bar-track';
        var fill = document.createElement('div');
        fill.className    = 'likert-bar-fill';
        fill.style.width  = '0%';
        track.appendChild(fill);
        var cnt = document.createElement('span');
        cnt.className = 'likert-bar-count';
        cnt.innerHTML = count + ' <span class="likert-bar-pct">(' + pct.toFixed(1) + '%)</span>';
        barRow.appendChild(lbl);
        barRow.appendChild(track);
        barRow.appendChild(cnt);
        block.appendChild(barRow);
        barFills.push({ fill: fill, pct: pct });
      });

      resultsBody.appendChild(block);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          barFills.forEach(function (bf) { bf.fill.style.width = bf.pct.toFixed(1) + '%'; });
        });
      });
    });

    leftPanel.style.display  = 'none';
    rightPanel.style.display = 'block';
  });

  resetBtn.addEventListener('click', function () {
    answers = [0, 0, 0, 0, 0];
    qContainer.querySelectorAll('.likert-opt').forEach(function (o) { o.classList.remove('selected'); });
    rightPanel.style.display = '';
    leftPanel.style.display  = '';
    /* Leave question text as-is — user may want to run again with same questions */
  });
}

/* ═══════════════════════════════════════════════════════════
   PERSONA BUILDER
═══════════════════════════════════════════════════════════ */

var PB_COLORS = {
  elevator: '#2c6e8a',
  social:   '#1a5cb8',
  drink:    '#6b3d9a',
  drill:    '#7a4520'
};

var PB_NAMES = {
  elevator: 'Elevator at an international school',
  social:   'Social media app redesign',
  drink:    'New isotonic sports drink',
  drill:    'Battery-powered drill'
};

function initPersonaBuilder() {
  var btn    = document.getElementById('pb-finish');
  var output = document.getElementById('pb-output');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var name         = (document.getElementById('pb-name').value || '').trim();
    var age          = (document.getElementById('pb-age').value || '').trim();
    var role         = (document.getElementById('pb-role').value || '').trim();
    var goals        = (document.getElementById('pb-goals').value || '').trim();
    var frustrations = (document.getElementById('pb-frustrations').value || '').trim();
    var scenario     = (document.getElementById('pb-scenario').value || '').trim();
    var product      = document.getElementById('pb-product').value;

    if (!name || !role) {
      alert('Please fill in at least a name and role before finishing.');
      return;
    }

    var color       = PB_COLORS[product] || '#1a5cb8';
    var productName = PB_NAMES[product]  || product;
    var tagline     = age ? age + (role ? ' · ' + role : '') : role;

    function section(title, text) {
      if (!text) return '';
      return '<div>' +
        '<div class="persona-card-section-title">' + title + '</div>' +
        '<div class="persona-card-row"><span>' + escHtml(text) + '</span></div>' +
        '</div>';
    }

    var card = document.createElement('div');
    card.className = 'persona-card';
    card.innerHTML =
      '<div class="persona-card-header" style="background:' + color + ';">' +
        '<div class="persona-card-product">Primary persona · ' + escHtml(productName) + '</div>' +
        '<div class="persona-card-name">' + escHtml(name) + '</div>' +
        '<div class="persona-card-tagline">' + escHtml(tagline) + '</div>' +
      '</div>' +
      '<div class="persona-card-body">' +
        section('Goals', goals) +
        section('Pain points', frustrations) +
        section('Typical scenario', scenario) +
      '</div>';

    output.innerHTML = '';
    output.appendChild(card);
    output.style.display = 'block';
  });
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ═══════════════════════════════════════════════════════════
   TASK ANALYSIS GENERATOR
═══════════════════════════════════════════════════════════ */

function initTaskAnalysis() {
  var addBtn    = document.getElementById('ta-add-hta');
  var mapBtn    = document.getElementById('ta-complete');
  var stepsWrap = document.getElementById('ta-steps-container');
  var taMapEl   = document.getElementById('ta-map');
  var mapInner  = document.getElementById('ta-map-inner');
  var dragHint  = document.getElementById('ta-drag-hint');
  if (!addBtn) return;

  var steps       = [];
  var stepCounter = 0;
  var nodeData    = {};
  var activeDrag  = null;

  addBtn.addEventListener('click', function () {
    stepCounter++;
    steps.push({ id: 'hta' + stepCounter, text: '', ctas: [], ctaCounter: 0 });
    renderSteps();
  });

  function renderSteps() {
    stepsWrap.innerHTML = '';
    steps.forEach(function (step, si) {
      var stepDiv = document.createElement('div');
      stepDiv.className = 'ta-step';

      var num = document.createElement('span');
      num.className   = 'ta-step-num';
      num.textContent = (si + 1) + '.';

      var fields = document.createElement('div');
      fields.className = 'ta-step-fields';

      var htaRow = document.createElement('div');
      htaRow.style.cssText = 'display:flex;gap:0.4rem;align-items:center;';

      var htaInput = document.createElement('input');
      htaInput.type        = 'text';
      htaInput.className   = 'ta-hta-input';
      htaInput.placeholder = 'Main step (e.g. Open cart)';
      htaInput.value       = step.text;
      htaInput.addEventListener('input', function () { step.text = htaInput.value; });

      var addCtaBtn = document.createElement('button');
      addCtaBtn.type      = 'button';
      addCtaBtn.className = 'tool-btn-sm';
      addCtaBtn.textContent = '+ Cognitive Task';
      (function (s) {
        addCtaBtn.addEventListener('click', function () {
          s.ctaCounter++;
          s.ctas.push({ id: s.id + 'c' + s.ctaCounter, text: '' });
          renderSteps();
        });
      })(step);

      var removeBtn = document.createElement('button');
      removeBtn.type        = 'button';
      removeBtn.className   = 'ta-remove-btn';
      removeBtn.textContent = '×';
      (function (idx) {
        removeBtn.addEventListener('click', function () {
          steps.splice(idx, 1);
          renderSteps();
        });
      })(si);

      htaRow.appendChild(htaInput);
      htaRow.appendChild(addCtaBtn);
      htaRow.appendChild(removeBtn);
      fields.appendChild(htaRow);

      step.ctas.forEach(function (cta, ci) {
        var ctaRow = document.createElement('div');
        ctaRow.style.cssText = 'display:flex;gap:0.4rem;align-items:center;padding-left:0.75rem;margin-top:0.3rem;';

        var ctaInput = document.createElement('input');
        ctaInput.type        = 'text';
        ctaInput.className   = 'ta-cta-input';
        ctaInput.placeholder = 'Cognitive task (e.g. tap, recall pin, decide)';
        ctaInput.value       = cta.text;
        ctaInput.addEventListener('input', function () { cta.text = ctaInput.value; });

        var removeCta = document.createElement('button');
        removeCta.type        = 'button';
        removeCta.className   = 'ta-remove-btn';
        removeCta.textContent = '×';
        (function (s, idx) {
          removeCta.addEventListener('click', function () {
            s.ctas.splice(idx, 1);
            renderSteps();
          });
        })(step, ci);

        ctaRow.appendChild(ctaInput);
        ctaRow.appendChild(removeCta);
        fields.appendChild(ctaRow);
      });

      stepDiv.appendChild(num);
      stepDiv.appendChild(fields);
      stepsWrap.appendChild(stepDiv);
    });
  }

  mapBtn.addEventListener('click', function () {
    var goalText = (document.getElementById('ta-goal').value || '').trim() || 'User goal';
    if (steps.length === 0) {
      alert('Add at least one step before generating a map.');
      return;
    }
    buildMap(goalText);
    taMapEl.style.display = 'block';
    if (dragHint) dragHint.style.display = 'block';
    taMapEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  function buildMap(goalText) {
    activeDrag = null;
    nodeData   = {};
    mapInner.innerHTML = '';

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('style', 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:visible;');
    mapInner.appendChild(svg);

    var nodeW = 140, goalH = 56, hGap = 32, padX = 20, padY = 28;

    var htaHeights = steps.map(function (s) {
      return Math.max(80, 38 + s.ctas.length * 28 + 10);
    });

    var maxHtaH  = htaHeights.reduce(function (m, h) { return Math.max(m, h); }, goalH);
    var totalNodes = steps.length + 1;
    var mapW     = padX * 2 + totalNodes * nodeW + (totalNodes - 1) * hGap;
    var mapH     = padY * 2 + Math.max(maxHtaH, goalH);

    mapInner.style.width  = mapW + 'px';
    mapInner.style.height = mapH + 'px';

    /* Steps: left to right */
    steps.forEach(function (step, si) {
      var nx     = padX + si * (nodeW + hGap);
      var ny     = padY;
      var nodeEl = document.createElement('div');
      nodeEl.className   = 'ta-node';
      nodeEl.style.cssText = 'position:absolute;left:' + nx + 'px;top:' + ny + 'px;width:' + nodeW + 'px;';

      var htaDiv = document.createElement('div');
      htaDiv.className = 'ta-node-hta';
      htaDiv.innerHTML =
        '<span class="ta-node-num">' + (si + 1) + '</span>' +
        escHtml(step.text || 'Step ' + (si + 1));
      nodeEl.appendChild(htaDiv);

      step.ctas.forEach(function (cta, ci) {
        var ctaDiv = document.createElement('div');
        ctaDiv.className = 'ta-node-cta';
        ctaDiv.innerHTML =
          '<span class="ta-node-num">' + (si + 1) + '.' + (ci + 1) + '</span>' +
          escHtml(cta.text || 'Cognitive task ' + (ci + 1));
        nodeEl.appendChild(ctaDiv);
      });

      mapInner.appendChild(nodeEl);
      nodeData[step.id] = { el: nodeEl, x: nx, y: ny, w: nodeW, h: htaHeights[si] };
      makeDraggable(step.id, nodeEl, svg);
    });

    /* Goal: far right */
    var gx     = padX + steps.length * (nodeW + hGap);
    var gy     = padY;
    var goalEl = document.createElement('div');
    goalEl.className   = 'ta-goal-node';
    goalEl.style.cssText = 'position:absolute;left:' + gx + 'px;top:' + gy + 'px;width:' + nodeW + 'px;cursor:grab;user-select:none;';
    goalEl.innerHTML   =
      '<div class="ta-goal-label">Goal</div>' +
      '<div class="ta-goal-text">' + escHtml(goalText) + '</div>';
    mapInner.appendChild(goalEl);
    nodeData['goal'] = { el: goalEl, x: gx, y: gy, w: nodeW, h: goalH };
    makeDraggable('goal', goalEl, svg);

    /* Sequential connections: step[0]→step[1]→…→goal */
    steps.forEach(function (step, si) {
      var nextId = (si < steps.length - 1) ? steps[si + 1].id : 'goal';
      addLine(svg, step.id, nextId);
    });

    drawAllLines(svg);
  }

  function addLine(svg, fromId, toId) {
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('data-from', fromId);
    line.setAttribute('data-to', toId);
    line.setAttribute('stroke', '#94a3b8');
    line.setAttribute('stroke-width', '1.5');
    svg.appendChild(line);
  }

  function drawAllLines(svg) {
    svg.querySelectorAll('line').forEach(function (line) {
      var from = nodeData[line.getAttribute('data-from')];
      var to   = nodeData[line.getAttribute('data-to')];
      if (!from || !to) return;
      /* Connect right-centre → left-centre for horizontal flow */
      line.setAttribute('x1', from.x + from.w);
      line.setAttribute('y1', from.y + from.h / 2);
      line.setAttribute('x2', to.x);
      line.setAttribute('y2', to.y + to.h / 2);
    });
  }

  function makeDraggable(id, el, svg) {
    el.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      activeDrag = {
        id: id, svg: svg,
        startMouseX: e.clientX, startMouseY: e.clientY,
        startX: nodeData[id].x,  startY: nodeData[id].y
      };
      el.style.zIndex = '10';
      e.preventDefault();
    });
  }

  document.addEventListener('mousemove', function (e) {
    if (!activeDrag) return;
    var nd = nodeData[activeDrag.id];
    nd.x = activeDrag.startX + (e.clientX - activeDrag.startMouseX);
    nd.y = activeDrag.startY + (e.clientY - activeDrag.startMouseY);
    nd.el.style.left = nd.x + 'px';
    nd.el.style.top  = nd.y + 'px';
    drawAllLines(activeDrag.svg);
  });

  document.addEventListener('mouseup', function () {
    if (activeDrag) {
      nodeData[activeDrag.id].el.style.zIndex = '';
      activeDrag = null;
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  initFieldResearch();
  initFocusGroup();
  initLikert();
  initPersonaBuilder();
  initTaskAnalysis();
});

})();
