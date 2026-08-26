/* research-planner.js — shared engine for the research budget planner.
   A token budget forces students to choose between research activities, but
   choosing is only half of the task. Every chosen activity opens three text
   fields, and two paragraphs sit under the table, because the assessed part
   of a research plan is the reasoning and not the shopping list.

   The export deliberately carries the writing. A student who clicks chips and
   exports gets a page of empty ruled lines with their name at the top, which
   is a truthful picture of an unfinished plan rather than a tidy one.

   Content (activities, costs, rules, labels) is passed in by each page's own
   JS file, the same split drag-sort.js and claim-hunt.js use. */
window.ResearchPlanner = (function () {
  'use strict';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* Wrap `text` to `maxW` using the canvas' current font. */
  function wrap(g, text, maxW) {
    var words = String(text).split(/\s+/), lines = [], line = '';
    words.forEach(function (w) {
      var test = line ? line + ' ' + w : w;
      if (g.measureText(test).width > maxW && line) { lines.push(line); line = w; }
      else { line = test; }
    });
    if (line) lines.push(line);
    return lines;
  }

  function init(config) {
    var root = document.getElementById(config.rootId);
    if (!root) return;

    var BUDGET = config.budget;
    var ACTS = config.activities;
    var RULES = config.rules || [];
    var STORE = 'rplan:' + config.rootId;

    function act(id) {
      for (var i = 0; i < ACTS.length; i++) if (ACTS[i].id === id) return ACTS[i];
      return null;
    }

    /* rows: [{ id, question, decision, when }] */
    var rows = [];
    var notes = { order: '', gave: '' };

    /* ── persistence, so a class-length task survives a reload ── */
    function save() {
      try {
        localStorage.setItem(STORE, JSON.stringify({ rows: rows, notes: notes }));
      } catch (e) { /* private window, or storage off. Not worth telling them. */ }
    }
    function load() {
      try {
        var raw = localStorage.getItem(STORE);
        if (!raw) return;
        var d = JSON.parse(raw);
        if (d && Array.isArray(d.rows)) {
          rows = d.rows.filter(function (r) { return act(r.id); });
          notes = d.notes || notes;
        }
      } catch (e) { /* ignore corrupt or unreadable state */ }
    }

    function spent() {
      return rows.reduce(function (t, r) { return t + act(r.id).cost; }, 0);
    }
    function spentWhere(tag) {
      return rows.reduce(function (t, r) {
        var a = act(r.id);
        return (a.tags || []).indexOf(tag) !== -1 ? t + a.cost : t;
      }, 0);
    }

    /* ── DOM handles ── */
    var bankEl   = root.querySelector('[data-rp="bank"]');
    var rowsEl   = root.querySelector('[data-rp="rows"]');
    var pipsEl   = root.querySelector('[data-rp="pips"]');
    var spentEl  = root.querySelector('[data-rp="spent"]');
    var leftEl   = root.querySelector('[data-rp="left"]');
    var msgEl    = root.querySelector('[data-rp="msg"]');
    var checkEl  = root.querySelector('[data-rp="check"]');
    var orderEl  = root.querySelector('[data-rp="order"]');
    var gaveEl   = root.querySelector('[data-rp="gave"]');

    function say(text, warn) {
      msgEl.textContent = text || '';
      msgEl.classList.toggle('warn', !!warn);
    }

    function renderBudget() {
      var s = spent(), left = BUDGET - s;
      spentEl.textContent = s;
      leftEl.textContent = left === 0
        ? 'Every token spent.'
        : left + (left === 1 ? ' token left.' : ' tokens left.');
      root.classList.toggle('is-full', left === 0);

      pipsEl.innerHTML = '';
      for (var i = 0; i < BUDGET; i++) {
        pipsEl.appendChild(el('span', 'rplan-pip' + (i < s ? ' spent' : '')));
      }
      Array.prototype.forEach.call(bankEl.children, function (chip) {
        var a = act(chip.dataset.act);
        chip.classList.toggle('too-dear', a.cost > left);
        chip.disabled = a.cost > left;
      });
    }

    function field(row, key, label, placeholder, multiline) {
      var wrapEl = el('div', 'rplan-field');
      var id = config.rootId + '-' + key + '-' + rows.indexOf(row);
      var lab = el('label', 'rplan-field-label', label);
      lab.setAttribute('for', id);
      var input = document.createElement(multiline ? 'textarea' : 'input');
      input.className = 'rplan-input';
      input.id = id;
      if (multiline) input.rows = 2; else input.type = 'text';
      input.placeholder = placeholder;
      input.value = row[key] || '';
      input.addEventListener('input', function () {
        row[key] = input.value;
        save();
        renderCheck();
      });
      wrapEl.appendChild(lab);
      wrapEl.appendChild(input);
      return wrapEl;
    }

    function renderRows() {
      rowsEl.innerHTML = '';
      if (!rows.length) {
        rowsEl.appendChild(el('p', 'rplan-empty',
          'No activities yet. Pick one above, then write what you want it to tell you.'));
        return;
      }
      rows.forEach(function (row, i) {
        var a = act(row.id);
        var card = el('div', 'rplan-row');

        var head = el('div', 'rplan-row-head');
        head.appendChild(el('span', 'rplan-row-num', String(i + 1)));
        head.appendChild(el('span', 'rplan-row-name', a.label));
        head.appendChild(el('span', 'rplan-row-kind', a.kind));
        head.appendChild(el('span', 'rplan-row-cost', a.cost + (a.cost === 1 ? ' token' : ' tokens')));
        var x = el('button', 'rplan-row-x', '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Remove ' + a.label);
        x.addEventListener('click', function () {
          rows.splice(i, 1);
          save(); render();
          say('Removed. Those tokens are back in your budget.');
        });
        head.appendChild(x);
        card.appendChild(head);

        var body = el('div', 'rplan-row-body');
        body.appendChild(field(row, 'question', 'What do I need to find out?',
          'A sharp question. Not "do people like gadgets" but something you could actually answer.', true));
        body.appendChild(field(row, 'decision', 'What will this let me decide?',
          'The design decision this unlocks. If it unlocks nothing, take the row off your plan.', true));
        body.appendChild(field(row, 'when', 'When?',
          'Before Aiii, in class 6, at lunch on Thursday...', false));
        card.appendChild(body);

        rowsEl.appendChild(card);
      });
    }

    /* ── what is still missing ── */
    function missing() {
      var out = [];
      if (!rows.length) out.push('You have not chosen any activities yet.');
      rows.forEach(function (r, i) {
        var a = act(r.id), n = i + 1;
        if (!(r.question || '').trim()) out.push('Row ' + n + ' (' + a.label + ') has no question.');
        if (!(r.decision || '').trim()) out.push('Row ' + n + ' (' + a.label + ') does not say what it lets you decide.');
        if (!(r.when || '').trim())     out.push('Row ' + n + ' (' + a.label + ') has no "when".');
      });
      RULES.forEach(function (rule) {
        if (spentWhere(rule.tag) < rule.min) {
          out.push(rule.message.replace('{n}', spentWhere(rule.tag)));
        }
      });
      if (notes.order.trim().length < 120) out.push('"Why this order?" is not written yet, or is very short.');
      if (notes.gave.trim().length < 120) out.push('"What did you give up?" is not written yet, or is very short.');
      return out;
    }

    function renderCheck() {
      var miss = missing();
      checkEl.innerHTML = '';
      var h = el('p', 'rplan-check-title',
        miss.length ? 'Still missing (' + miss.length + ')' : 'Nothing missing');
      checkEl.appendChild(h);
      if (miss.length) {
        var ul = el('ul', 'rplan-check-list');
        miss.forEach(function (m) { ul.appendChild(el('li', null, m)); });
        checkEl.appendChild(ul);
      } else {
        checkEl.appendChild(el('p', 'rplan-check-done',
          'Every box has something in it. That is not the same as being good: the marks come from how sharp your questions are and how honestly you answer the two paragraphs. Read it back as if somebody else wrote it.'));
      }
      checkEl.classList.toggle('is-done', !miss.length);
    }

    function render() { renderBudget(); renderRows(); renderCheck(); }

    /* ── bank ── */
    ACTS.forEach(function (a) {
      var chip = el('button', 'rplan-chip');
      chip.type = 'button';
      chip.dataset.act = a.id;
      chip.appendChild(el('span', null, a.label));
      chip.appendChild(el('span', 'rplan-chip-cost', String(a.cost)));
      chip.addEventListener('click', function () {
        if (a.cost > BUDGET - spent()) {
          say('Not enough tokens left for ' + a.label + '. Remove something first.', true);
          return;
        }
        rows.push({ id: a.id, question: '', decision: '', when: '' });
        save(); render();
        say('Added. Now write what you want it to tell you.');
        var last = rowsEl.querySelector('.rplan-row:last-child .rplan-input');
        if (last) last.focus();
      });
      bankEl.appendChild(chip);
    });

    [['order', orderEl], ['gave', gaveEl]].forEach(function (pair) {
      pair[1].value = notes[pair[0]] || '';
      pair[1].addEventListener('input', function () {
        notes[pair[0]] = pair[1].value;
        save(); renderCheck();
      });
    });

    root.querySelector('[data-rp="clear"]').addEventListener('click', function () {
      if (!rows.length && !notes.order && !notes.gave) return;
      rows = [];
      notes = { order: '', gave: '' };
      orderEl.value = ''; gaveEl.value = '';
      save(); render();
      say('Cleared.');
    });

    /* ── export ─────────────────────────────────────────────────
       Everything the student wrote, plus ruled lines wherever they
       wrote nothing, so an unfinished plan exports as visibly
       unfinished. */
    function downloadPNG() {
      if (!rows.length) { say('Add at least one activity before you download.', true); return; }

      var S = 2, W = 1000, PAD = 44, COL = W - PAD * 2;
      var INK = '#111418', MUTED = '#64748b', LINE = '#dde1e6', ACCENT = config.accent || '#1a5cb8';

      var cv = document.createElement('canvas');
      var g = cv.getContext('2d');

      var FT = {
        h1:   '600 30px Lexend, Helvetica, Arial, sans-serif',
        meta: '15px Lexend, Helvetica, Arial, sans-serif',
        name: '600 18px Lexend, Helvetica, Arial, sans-serif',
        lab:  '700 11px ui-monospace, Menlo, monospace',
        body: '15px Lexend, Helvetica, Arial, sans-serif',
        mono: '13px ui-monospace, Menlo, monospace',
        h2:   '600 19px Lexend, Helvetica, Arial, sans-serif'
      };

      /* Measuring pass, so the canvas is exactly tall enough. */
      function blocksFor(row) {
        var b = [];
        [['WHAT I NEED TO FIND OUT', row.question],
         ['WHAT THIS LETS ME DECIDE', row.decision],
         ['WHEN', row.when]].forEach(function (pair) {
          g.font = FT.body;
          var txt = (pair[1] || '').trim();
          b.push({ label: pair[0], lines: txt ? wrap(g, txt, COL - 24) : null });
        });
        return b;
      }

      var LH = 21, y = 0;
      y += PAD + 34 + 30 + 26;                       // title, name line, rule
      var rowBlocks = rows.map(function (r) {
        var b = blocksFor(r);
        var h = 30;                                   // header strip
        b.forEach(function (blk) { h += 16 + (blk.lines ? blk.lines.length * LH : LH) + 8; });
        return { row: r, blocks: b, h: h + 14 };
      });
      rowBlocks.forEach(function (rb) { y += rb.h; });
      y += 34;                                        // totals

      g.font = FT.body;
      var paras = [
        { title: 'Why these, in this order?', text: notes.order },
        { title: 'What did I give up, and what could go wrong because of it?', text: notes.gave }
      ].map(function (p) {
        var t = (p.text || '').trim();
        return { title: p.title, lines: t ? wrap(g, t, COL) : null };
      });
      paras.forEach(function (p) { y += 26 + (p.lines ? p.lines.length * LH : LH * 3) + 18; });

      var miss = missing();
      if (miss.length) {
        g.font = FT.mono;
        y += 26;
        miss.forEach(function (m) { y += wrap(g, '• ' + m, COL).length * 18; });
        y += 14;
      }
      var H = y + PAD;

      cv.width = W * S; cv.height = H * S;
      g = cv.getContext('2d');
      g.scale(S, S);
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);

      function rule(yy) {
        g.strokeStyle = LINE; g.lineWidth = 1;
        g.beginPath(); g.moveTo(PAD, yy); g.lineTo(W - PAD, yy); g.stroke();
      }
      function dashRule(yy, x0, x1) {
        g.strokeStyle = LINE; g.lineWidth = 1;
        g.setLineDash([3, 4]);
        g.beginPath(); g.moveTo(x0, yy); g.lineTo(x1, yy); g.stroke();
        g.setLineDash([]);
      }

      y = PAD;
      g.fillStyle = INK; g.font = FT.h1;
      g.fillText(config.exportTitle || 'My research plan', PAD, y + 26);
      y += 34;
      g.fillStyle = MUTED; g.font = FT.meta;
      g.fillText('Name:', PAD, y + 20);
      dashRule(y + 24, PAD + 46, PAD + 320);
      g.fillText('Client:', PAD + 360, y + 20);
      dashRule(y + 24, PAD + 412, W - PAD);
      y += 30;
      rule(y); y += 26;

      rowBlocks.forEach(function (rb) {
        var a = act(rb.row.id);
        g.fillStyle = ACCENT;
        g.beginPath(); g.roundRect(PAD, y, 26, 26, 7); g.fill();
        g.fillStyle = '#ffffff'; g.font = '700 13px ui-monospace, Menlo, monospace';
        g.textAlign = 'center';
        g.fillText(String(rows.indexOf(rb.row) + 1), PAD + 13, y + 18);
        g.textAlign = 'left';

        g.fillStyle = INK; g.font = FT.name;
        g.fillText(a.label, PAD + 38, y + 18);
        g.fillStyle = MUTED; g.font = FT.mono;
        g.textAlign = 'right';
        g.fillText(a.kind.toUpperCase() + '   ' + a.cost + (a.cost === 1 ? ' token' : ' tokens'), W - PAD, y + 18);
        g.textAlign = 'left';
        y += 30;

        rb.blocks.forEach(function (blk) {
          g.fillStyle = MUTED; g.font = FT.lab;
          g.fillText(blk.label, PAD + 24, y + 11);
          y += 16;
          if (blk.lines) {
            g.fillStyle = INK; g.font = FT.body;
            blk.lines.forEach(function (ln) { g.fillText(ln, PAD + 24, y + 15); y += LH; });
          } else {
            dashRule(y + 15, PAD + 24, W - PAD);
            y += LH;
          }
          y += 8;
        });
        y += 6;
        rule(y); y += 8;
      });

      var total = spent();
      g.fillStyle = INK; g.font = FT.h2;
      g.fillText(total + ' of ' + BUDGET + ' tokens spent', PAD, y + 20);
      y += 34;

      paras.forEach(function (p) {
        g.fillStyle = INK; g.font = FT.h2;
        g.fillText(p.title, PAD, y + 18);
        y += 26;
        if (p.lines) {
          g.fillStyle = INK; g.font = FT.body;
          p.lines.forEach(function (ln) { g.fillText(ln, PAD, y + 15); y += LH; });
        } else {
          for (var i = 0; i < 3; i++) { dashRule(y + 15, PAD, W - PAD); y += LH; }
        }
        y += 18;
      });

      if (miss.length) {
        g.fillStyle = '#b8341a'; g.font = FT.lab;
        g.fillText('NOT FINISHED YET', PAD, y + 11);
        y += 26;
        g.fillStyle = MUTED; g.font = FT.mono;
        miss.forEach(function (m) {
          wrap(g, '• ' + m, COL).forEach(function (ln) { g.fillText(ln, PAD, y + 12); y += 18; });
        });
      }

      var a2 = document.createElement('a');
      a2.download = (config.exportTitle || 'My research plan') + '.png';
      a2.href = cv.toDataURL('image/png');
      a2.click();
      say(miss.length
        ? 'Downloaded, with ' + miss.length + ' thing' + (miss.length === 1 ? '' : 's') + ' still marked as missing on it.'
        : 'Downloaded.');
    }

    root.querySelector('[data-rp="png"]').addEventListener('click', downloadPNG);

    load();
    if (orderEl) orderEl.value = notes.order || '';
    if (gaveEl) gaveEl.value = notes.gave || '';
    render();
  }

  return { init: init };
})();
