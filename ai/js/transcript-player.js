/* ============================================================
   Transcript player
   ------------------------------------------------------------
   Plays a recorded AI conversation from a JSON file, one
   character at a time, so the page can react as the text
   arrives. Every AI interaction on the site goes through this:
   there are no live calls, only recorded and simulated ones.

   Data shape (data/transcripts/<id>.json):

     {
       "id": "hadrians-wall-2023",
       "title": "Asking for sources, 2023",
       "model": { "name": "ChatGPT (GPT-3.5)", "vendor": "OpenAI",
                  "date": "March 2023", "search": false },
       "source": "Where the transcript came from",
       "placeholder": false,       // true = not a real capture, say so
       "pace": { "cps": 70 },      // characters per second when streaming
       "messages": [
         { "role": "user",      "text": "..." },
         { "role": "assistant", "text": "...",
           "annotations": [ { "match": "exact text in the reply",
                              "kind": "fabricated", "note": "..." } ] },
         { "role": "note",      "text": "An aside from the site, not the chat." },
         { "role": "choice",    "prompt": "What would you ask next?",
           "options": [ { "label": "...", "messages": [ ... ] },
                        { "label": "...", "next": "other-transcript-id" } ] }
       ]
     }

   A message may carry "delayMs" (pause before it starts) and
   "cps" (its own pace). Real per-token timing can be added later
   as "timing": [ms, ms, ...] per character without changing
   anything else here.

   Text is a small markdown subset: paragraphs, "1." and "-"
   lists, **bold**, `code`. Nothing else, on purpose.

   Events, dispatched on the root element (bubble, so a page can
   listen once on document):
     tp:load        { transcript }
     tp:start
     tp:message     { index, message, el }
     tp:annotation  { annotation, el }     when the stream reaches it
     tp:messageend  { index, message, el }
     tp:choice      { choice, el }         waiting on the reader
     tp:choose      { option }
     tp:done

   The pure functions (parseBlocks, parseInline, applyAnnotations,
   plainLength) touch no DOM and are unit tested in test/.
   ============================================================ */

const STRINGS = {
  you: 'You',
  ai: 'AI',
  note: 'Note',
  play: 'Play',
  pause: 'Pause',
  replay: 'Replay',
  skip: 'Show all',
  speed: 'Speed',
  searchOn: 'search on',
  searchOff: 'no search',
  placeholder: 'Placeholder. Not a real transcript.',
  source: 'Source',
  thinking: 'Writing',
};

const SPEEDS = [
  { label: '1x', factor: 1 },
  { label: '2x', factor: 2 },
  { label: 'Instant', factor: Infinity },
];

const DEFAULT_CPS = 70;

/* ---------- pure: text parsing ------------------------------- */

const A_OPEN = '\u0001';   // annotation start: \u0001<index>\u0002
const A_SEP = '\u0002';
const A_CLOSE = '\u0003';

/** Wrap each annotation match in private markers so parseInline can
 *  turn it into a span. First occurrence only. Returns the new text and
 *  the list of annotations that were actually found. */
export function applyAnnotations(text, annotations = []) {
  let out = String(text);
  const found = [];
  annotations.forEach((a) => {
    if (!a || !a.match) return;
    const i = out.indexOf(a.match);
    if (i < 0) return;
    const idx = found.length;
    found.push(a);
    out = out.slice(0, i) + A_OPEN + idx + A_SEP + a.match + A_CLOSE + out.slice(i + a.match.length);
  });
  return { text: out, found };
}

/** Split text into blocks: { type: 'p' | 'ol' | 'ul', lines|items }. */
export function parseBlocks(text) {
  const blocks = [];
  const lines = String(text).replace(/\r\n?/g, '\n').split('\n');
  let cur = null;
  const flush = () => { if (cur) { blocks.push(cur); cur = null; } };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    const ol = /^(\d+)[.)]\s+(.*)$/.exec(line);
    const ul = /^[-*•]\s+(.*)$/.exec(line);
    if (ol) {
      if (!cur || cur.type !== 'ol') { flush(); cur = { type: 'ol', items: [] }; }
      cur.items.push(ol[2]);
    } else if (ul) {
      if (!cur || cur.type !== 'ul') { flush(); cur = { type: 'ul', items: [] }; }
      cur.items.push(ul[1]);
    } else if (cur && (cur.type === 'ol' || cur.type === 'ul') && /^\s/.test(raw)) {
      // indented continuation of a list item
      cur.items[cur.items.length - 1] += ' ' + line;
    } else {
      if (!cur || cur.type !== 'p') { flush(); cur = { type: 'p', text: '' }; }
      cur.text += (cur.text ? ' ' : '') + line;
    }
  }
  flush();
  return blocks;
}

/** Inline parse: returns a list of nodes
 *  { t: 'text', s } | { t: 'strong'|'code'|'ann', children|s, index } */
export function parseInline(text) {
  const nodes = [];
  let i = 0;
  let buf = '';
  const s = String(text);
  const pushText = () => { if (buf) { nodes.push({ t: 'text', s: buf }); buf = ''; } };

  while (i < s.length) {
    const ch = s[i];
    if (ch === A_OPEN) {
      const sep = s.indexOf(A_SEP, i);
      const close = s.indexOf(A_CLOSE, sep);
      if (sep > 0 && close > 0) {
        pushText();
        nodes.push({ t: 'ann', index: Number(s.slice(i + 1, sep)), children: parseInline(s.slice(sep + 1, close)) });
        i = close + 1;
        continue;
      }
    }
    if (s.startsWith('**', i)) {
      const end = s.indexOf('**', i + 2);
      if (end > 0) {
        pushText();
        nodes.push({ t: 'strong', children: parseInline(s.slice(i + 2, end)) });
        i = end + 2;
        continue;
      }
    }
    if (ch === '`') {
      const end = s.indexOf('`', i + 1);
      if (end > 0) {
        pushText();
        nodes.push({ t: 'code', s: s.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    buf += ch;
    i += 1;
  }
  pushText();
  return nodes;
}

/** Number of visible characters in a message's text (markers and
 *  markdown syntax excluded), which is what the pace is measured in. */
export function plainLength(text) {
  let n = 0;
  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.t === 'text' || node.t === 'code') n += node.s.length;
      else walk(node.children);
    }
  };
  for (const b of parseBlocks(text)) {
    if (b.type === 'p') walk(parseInline(b.text));
    else b.items.forEach((it) => walk(parseInline(it)));
  }
  return n;
}

/* ---------- DOM rendering ------------------------------------ */

function el(doc, tag, cls, text) {
  const e = doc.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/** Render inline nodes into `parent`. Every text run becomes its own
 *  text node so the streamer can fill them one by one. Annotation
 *  spans are collected into `anns` with the annotation they carry. */
function renderInline(doc, parent, nodes, found, anns) {
  for (const node of nodes) {
    if (node.t === 'text') {
      parent.appendChild(doc.createTextNode(node.s));
    } else if (node.t === 'code') {
      const c = el(doc, 'code');
      c.appendChild(doc.createTextNode(node.s));
      parent.appendChild(c);
    } else if (node.t === 'strong') {
      const b = el(doc, 'strong');
      renderInline(doc, b, node.children, found, anns);
      parent.appendChild(b);
    } else if (node.t === 'ann') {
      const a = found[node.index];
      const span = el(doc, 'mark', 'tp-ann tp-ann--' + (a.kind || 'note'));
      span.setAttribute('data-kind', a.kind || 'note');
      if (a.note) { span.setAttribute('data-note', a.note); span.setAttribute('tabindex', '0'); }
      renderInline(doc, span, node.children, found, anns);
      parent.appendChild(span);
      anns.push({ el: span, annotation: a });
    }
  }
}

function renderBody(doc, text, annotations) {
  const { text: marked, found } = applyAnnotations(text, annotations);
  const body = el(doc, 'div', 'tp-body');
  const anns = [];
  for (const b of parseBlocks(marked)) {
    if (b.type === 'p') {
      const p = el(doc, 'p');
      renderInline(doc, p, parseInline(b.text), found, anns);
      body.appendChild(p);
    } else {
      const list = el(doc, b.type);
      for (const item of b.items) {
        const li = el(doc, 'li');
        renderInline(doc, li, parseInline(item), found, anns);
        list.appendChild(li);
      }
      body.appendChild(list);
    }
  }
  return { body, anns };
}

/** Collect the text nodes under `root` in document order. */
function textNodes(root) {
  const out = [];
  const walk = (n) => {
    if (n.nodeType === 3) out.push(n);
    else for (const c of n.childNodes) walk(c);
  };
  walk(root);
  return out;
}

function modelLabel(model = {}) {
  const parts = [];
  if (model.name) parts.push(model.name);
  if (model.date) parts.push(model.date);
  if (typeof model.search === 'boolean') parts.push(model.search ? STRINGS.searchOn : STRINGS.searchOff);
  return parts.join(' · ');
}

/* ---------- the player --------------------------------------- */

export class TranscriptPlayer {
  /**
   * @param {HTMLElement} root   the element to render into
   * @param {object} opts        { baseUrl, autoplay, reducedMotion, doc, raf, now }
   */
  constructor(root, opts = {}) {
    this.root = root;
    this.doc = opts.doc || root.ownerDocument;
    this.baseUrl = opts.baseUrl || './data/transcripts/';
    this.autoplay = opts.autoplay !== false;
    this.raf = opts.raf || ((fn) => requestAnimationFrame(fn));
    this.now = opts.now || (() => performance.now());
    this.reducedMotion = opts.reducedMotion ?? (
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    this.speed = this.reducedMotion ? Infinity : 1;
    this.transcript = null;
    this.queue = [];        // messages still to play
    this.index = -1;        // index of the message being played
    this.playing = false;
    this.done = false;
    this.frame = null;
    this.stream = null;     // state for the message currently streaming
    this._build();
  }

  /* ----- public ----- */

  async load(idOrTranscript) {
    const t = typeof idOrTranscript === 'string'
      ? await (await fetch(this.baseUrl + idOrTranscript + '.json')).json()
      : idOrTranscript;
    this.transcript = t;
    this.reset();
    this._emit('tp:load', { transcript: t });
    return t;
  }

  reset() {
    this._cancelFrame();
    this.stream = null;
    this.queue = (this.transcript?.messages || []).slice();
    this.index = -1;
    this.playing = false;
    this.done = false;
    this.log.innerHTML = '';
    this._renderHeader();
    this._syncControls();
  }

  play() {
    if (!this.transcript || this.done) return;
    if (this.playing) return;
    this.playing = true;
    if (this.index < 0) this._emit('tp:start');
    this._syncControls();
    if (this.stream) this._resumeStream();
    else this._next();
  }

  pause() {
    if (!this.playing) return;
    this.playing = false;
    this._cancelFrame();
    if (this.stream) this.stream.pausedAt = this.now();
    this._syncControls();
  }

  toggle() { this.playing ? this.pause() : this.play(); }

  /** Finish the current message and everything after it, instantly,
   *  up to the next choice or the end. */
  skip() {
    if (!this.transcript || this.done || this._waitingOnChoice) return;
    const prev = this.speed;
    this.speed = Infinity;
    if (!this.playing) this.play();
    if (this.stream) { this._cancelFrame(); this._tick(); }
    this.speed = prev;
    this._syncControls();
  }

  replay() { this.reset(); this.play(); }

  setSpeed(factor) {
    this.speed = factor;
    if (this.stream && this.playing) {
      // re-base the clock so a speed change applies from now
      const s = this.stream;
      s.startedAt = this.now() - (s.shown / (s.cps * this._factor())) * 1000;
    }
    this._syncControls();
  }

  /* ----- build ----- */

  _build() {
    const d = this.doc;
    this.root.classList.add('tp');
    this.root.innerHTML = '';

    this.header = el(d, 'div', 'tp-header');
    this.titleEl = el(d, 'div', 'tp-title');
    this.labelEl = el(d, 'div', 'tp-label');
    this.header.append(this.titleEl, this.labelEl);

    this.log = el(d, 'div', 'tp-log');
    this.log.setAttribute('aria-live', 'off');
    // Notes open on hover, and also on tap or Enter for touch and keyboard.
    const toggleNote = (target) => {
      const ann = target.closest && target.closest('.tp-ann.is-revealed[data-note]');
      if (!ann) return false;
      for (const other of this.log.querySelectorAll('.tp-ann.is-open')) if (other !== ann) other.classList.remove('is-open');
      ann.classList.toggle('is-open');
      return true;
    };
    this.log.addEventListener('click', (e) => { toggleNote(e.target); });
    this.log.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && toggleNote(e.target)) e.preventDefault();
    });

    this.controls = el(d, 'div', 'tp-controls');
    this.btnPlay = el(d, 'button', 'tp-btn tp-btn--play', STRINGS.play);
    this.btnPlay.type = 'button';
    this.btnPlay.addEventListener('click', () => this.toggle());
    this.btnSkip = el(d, 'button', 'tp-btn', STRINGS.skip);
    this.btnSkip.type = 'button';
    this.btnSkip.addEventListener('click', () => this.skip());
    this.btnReplay = el(d, 'button', 'tp-btn', STRINGS.replay);
    this.btnReplay.type = 'button';
    this.btnReplay.addEventListener('click', () => this.replay());

    this.speedGroup = el(d, 'div', 'tp-speed');
    this.speedGroup.setAttribute('role', 'group');
    this.speedGroup.setAttribute('aria-label', STRINGS.speed);
    this.speedBtns = SPEEDS.map((s) => {
      const b = el(d, 'button', 'tp-btn tp-btn--speed', s.label);
      b.type = 'button';
      b.setAttribute('data-factor', String(s.factor));
      b.addEventListener('click', () => this.setSpeed(s.factor));
      this.speedGroup.appendChild(b);
      return b;
    });

    this.controls.append(this.btnPlay, this.btnSkip, this.btnReplay, this.speedGroup);
    this.footer = el(d, 'div', 'tp-footer');
    this.root.append(this.header, this.log, this.controls, this.footer);

    if (this.autoplay && typeof IntersectionObserver === 'function') {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting && this.transcript && this.index < 0) {
            this.play();
            io.disconnect();
          }
        }
      }, { threshold: 0.4 });
      io.observe(this.root);
      this._io = io;
    }
  }

  _renderHeader() {
    const t = this.transcript || {};
    this.titleEl.textContent = t.title || '';
    this.labelEl.textContent = modelLabel(t.model);
    this.root.classList.toggle('tp--placeholder', !!t.placeholder);
    this.footer.innerHTML = '';
    if (t.placeholder) this.footer.appendChild(el(this.doc, 'div', 'tp-placeholder', STRINGS.placeholder));
    if (t.source) this.footer.appendChild(el(this.doc, 'div', 'tp-source', STRINGS.source + ': ' + t.source));
  }

  _syncControls() {
    this.btnPlay.textContent = this.playing ? STRINGS.pause : STRINGS.play;
    this.btnPlay.disabled = this.done || this._waitingOnChoice;
    this.btnSkip.disabled = this.done || this._waitingOnChoice;
    this.btnReplay.disabled = this.index < 0;
    for (const b of this.speedBtns) {
      b.classList.toggle('is-active', Number(b.getAttribute('data-factor')) === this.speed);
    }
    this.root.classList.toggle('is-playing', this.playing);
    this.root.classList.toggle('is-done', this.done);
  }

  _factor() { return this.speed; }

  _emit(name, detail = {}) {
    this.root.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  }

  /* ----- playback ----- */

  _next() {
    if (!this.playing) return;
    if (this.queue.length === 0) return this._finish();
    const message = this.queue.shift();
    this.index += 1;

    if (message.role === 'choice') return this._renderChoice(message);
    if (message.role === 'note') return this._renderNote(message);

    const wrap = el(this.doc, 'div', 'tp-msg tp-msg--' + message.role);
    const who = el(this.doc, 'div', 'tp-who', message.role === 'user' ? STRINGS.you : STRINGS.ai);
    const { body, anns } = renderBody(this.doc, message.text || '', message.annotations || []);
    wrap.append(who, body);
    this.log.appendChild(wrap);
    this._emit('tp:message', { index: this.index, message, el: wrap });

    const nodes = textNodes(body).map((n) => ({ node: n, full: n.nodeValue }));
    const total = nodes.reduce((s, n) => s + n.full.length, 0);
    const factor = this._factor();

    // The user's turn appears whole; a person typed it, we are not
    // simulating their typing. The AI's turn streams.
    if (message.role === 'user' || factor === Infinity) {
      for (const a of anns) this._revealAnn(a);
      this._endMessage(message, wrap);
      return;
    }

    for (const n of nodes) n.node.nodeValue = '';
    // Blocks stay hidden until the stream reaches them, so a list does
    // not show seven empty numbers while the first item is being written.
    const blocks = Array.from(body.querySelectorAll('p, li, ol, ul'));
    for (const b of blocks) b.setAttribute('data-empty', '');
    const cursor = el(this.doc, 'span', 'tp-cursor');
    cursor.setAttribute('aria-hidden', 'true');
    const delay = (message.delayMs ?? (message.role === 'assistant' ? 500 : 0)) / factor;
    wrap.classList.add('is-streaming');
    this.stream = {
      message, wrap, nodes, anns, blocks, cursor, total, shown: 0,
      cps: message.cps || this.transcript.pace?.cps || DEFAULT_CPS,
      startedAt: this.now() + delay,
    };
    this._scheduleFrame();
  }

  _resumeStream() {
    const s = this.stream;
    if (s.pausedAt) {
      s.startedAt += this.now() - s.pausedAt;
      s.pausedAt = null;
    }
    this._scheduleFrame();
  }

  _scheduleFrame() {
    this._cancelFrame();
    this.frame = this.raf(() => { this.frame = null; this._tick(); });
  }

  _cancelFrame() {
    if (this.frame != null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  _tick() {
    const s = this.stream;
    if (!s) return;
    const factor = this._factor();
    const elapsed = Math.max(0, this.now() - s.startedAt) / 1000;
    const target = factor === Infinity ? s.total : Math.min(s.total, Math.floor(elapsed * s.cps * factor));

    if (target > s.shown) {
      let remaining = target;
      let last = null;
      for (const n of s.nodes) {
        const take = Math.min(n.full.length, remaining);
        n.node.nodeValue = n.full.slice(0, take);
        remaining -= take;
        if (take > 0) last = n.node;
        if (remaining <= 0) break;
      }
      s.shown = target;
      for (const b of s.blocks) {
        if (b.hasAttribute('data-empty') && b.textContent.length > 0) b.removeAttribute('data-empty');
      }
      if (last && last.parentNode) last.parentNode.insertBefore(s.cursor, last.nextSibling);
      // reveal any annotation whose span now has text in it
      for (const a of s.anns) {
        if (!a.revealed && a.el.textContent.length > 0) this._revealAnn(a);
      }
    }

    if (s.shown >= s.total) {
      const { message, wrap } = s;
      this.stream = null;
      s.cursor.remove();
      for (const b of s.blocks) b.removeAttribute('data-empty');
      wrap.classList.remove('is-streaming');
      this._endMessage(message, wrap);
    } else if (this.playing) {
      this._scheduleFrame();
    }
  }

  _revealAnn(a) {
    a.revealed = true;
    a.el.classList.add('is-revealed');
    this._emit('tp:annotation', { annotation: a.annotation, el: a.el });
  }

  _endMessage(message, wrap) {
    this._emit('tp:messageend', { index: this.index, message, el: wrap });
    if (!this.playing) return;
    const gap = (message.gapMs ?? 350) / this._factor();
    if (gap === 0 || this._factor() === Infinity) return this._next();
    const t0 = this.now();
    const wait = () => {
      if (!this.playing) return;
      if (this.now() - t0 >= gap) this._next();
      else this.frame = this.raf(wait);
    };
    this.frame = this.raf(wait);
  }

  _renderNote(message) {
    const wrap = el(this.doc, 'div', 'tp-msg tp-msg--note');
    const who = el(this.doc, 'div', 'tp-who', STRINGS.note);
    const { body } = renderBody(this.doc, message.text || '', []);
    wrap.append(who, body);
    this.log.appendChild(wrap);
    this._emit('tp:message', { index: this.index, message, el: wrap });
    this._endMessage(message, wrap);
  }

  _renderChoice(choice) {
    const wrap = el(this.doc, 'div', 'tp-choice');
    const prompt = el(this.doc, 'div', 'tp-choice-prompt', choice.prompt || '');
    const list = el(this.doc, 'div', 'tp-choice-options');
    for (const option of choice.options || []) {
      const b = el(this.doc, 'button', 'tp-btn tp-btn--option', option.label);
      b.type = 'button';
      b.addEventListener('click', () => this._choose(choice, option, wrap, b));
      list.appendChild(b);
    }
    wrap.append(prompt, list);
    this.log.appendChild(wrap);
    this._waitingOnChoice = true;
    this.playing = false;
    this._syncControls();
    this._emit('tp:choice', { choice, el: wrap });
  }

  async _choose(choice, option, wrap, btn) {
    if (!this._waitingOnChoice) return;
    this._waitingOnChoice = false;
    wrap.classList.add('is-chosen');
    for (const b of wrap.querySelectorAll('button')) {
      b.disabled = true;
      b.classList.toggle('is-picked', b === btn);
    }
    this._emit('tp:choose', { option });

    let messages = option.messages || [];
    if (option.next) {
      const t = await (await fetch(this.baseUrl + option.next + '.json')).json();
      messages = t.messages || [];
    }
    // The chosen branch replaces whatever followed the choice.
    this.queue = messages.slice();
    this.playing = true;
    this._syncControls();
    this._next();
  }

  _finish() {
    this.playing = false;
    this.done = true;
    this.stream = null;
    this.log.setAttribute('aria-live', 'off');
    this._syncControls();
    this._emit('tp:done');
  }
}

/** Convenience: mount every [data-transcript] element on the page. */
export function mountAll(root = document, opts = {}) {
  const players = [];
  for (const node of root.querySelectorAll('[data-transcript]')) {
    const p = new TranscriptPlayer(node, {
      autoplay: node.getAttribute('data-autoplay') !== 'false',
      ...opts,
    });
    p.load(node.getAttribute('data-transcript'));
    players.push(p);
  }
  return players;
}
