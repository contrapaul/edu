/* ============================================================
   presentation.js — "Present" mode for curriculum topic pages.
   ------------------------------------------------------------
   Builds one slide deck per topic page from the Course Notes
   already on the page (verbatim), with a cover, an intro, a
   divider slide per learning objective, and the linking
   questions at the end. Requires presentation.css. Include
   after curriculum.js on any topic page:

     <link rel="stylesheet" href="../presentation.css">
     <script src="../presentation.js"></script>

   Content is never shrunk to fit. A unit that overflows is split
   (a paragraph at a sentence, a list at an item, a table at a row)
   and only an unsplittable block (a box, a widget) is scaled down.

   Authoring hints — attributes on the page HTML that change the
   deck only, never the page:

     data-ps="skip"      leave this element out of the deck
     data-ps="break"     start a new slide before this element
     data-ps="solo"      give this element a slide of its own
     data-ps="feature"   on a figure: large centred image, caption as
                         the description
     data-ps="live"      move the real element into the deck for the
                         duration (interactive widgets keep working);
                         .drag-sort gets this automatically
     data-ps="trailer"   a short note allowed to follow a list or table on
                         the same slide (used for markscheme award lines)
     data-ps-title="…"   heading shown above this element on its slide
     data-ps-side="left" on a figure: image on the left of the text
                         (default is right)

   A figure is paired with the text that follows it, textbook
   style. Two figures in a row share the media column when they fit.
   A standalone "Label:" paragraph, or a paragraph opening with
   <strong>Label:</strong>, becomes the slide heading.

   The Quiz section becomes one slide per question: the first press
   of → or Space reveals the answer, the next one advances. Clicking
   an option (or pressing A to D) commits that choice and reveals.

   The Paper 2 section becomes, per question: the case study
   (stimulus) slides, then one slide per part with the example answer
   hidden until → or Space reveals it, then the markscheme for that
   part. An answer too long to share the part's slide follows on its
   own slides instead.

   Deep links:  #present            open the deck at the cover
                #present/3.3.6      open at objective 3.3.6
                #present/3.3.6/4    open at slide 4 of that objective
   ============================================================ */

(function () {
  'use strict';

  var overlay = null, stage = null, ovList = null;
  var slides = [];
  var sections = [];
  var index = 0;
  var opener = null;
  var liveNodes = [];
  var built = false;

  var HASH_KEY = 'present';
  var MAX_BODY_BLOCKS = 3;
  var LEAD_MAX = 90;

  var I = {
    prev:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>',
    next:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>',
    play:  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="8 5 19 12 8 19"/></svg>',
    list:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg>',
    full:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg>',
    help:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7"/><line x1="12" y1="17" x2="12" y2="17.2"/></svg>'
  };

  /* ---- helpers ------------------------------------------------------ */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function hint(node) { return node && node.getAttribute ? (node.getAttribute('data-ps') || '') : ''; }

  /* Interactive blocks are moved into the deck for real (listeners and
     ids intact) rather than cloned. Known widget classes, plus anything
     holding a form control or canvas. */
  var LIVE_SEL = '.drag-sort, .diagram-widget, .live-calc, .compare-slider-widget, .swot-build, .tbl-tool, .mclass-diagram';
  function isLive(node) {
    if (!node.matches) return false;
    if (hint(node) === 'live' || node.matches(LIVE_SEL)) return true;
    return !!node.querySelector('input, select, textarea, canvas');
  }
  function isOpen() { return overlay && overlay.classList.contains('is-open'); }
  function isBuilding() { return overlay && overlay.classList.contains('is-building'); }
  function textLen(node) { return node.textContent.trim().length; }
  function usableImg(node) {
    var img = node.querySelector ? node.querySelector('img') : null;
    return img && img.getAttribute('src') ? img : null;
  }

  /* ---- page → sections --------------------------------------------- */

  function topicMeta() {
    var titleEl = document.querySelector('.topic-title');
    var raw = titleEl ? titleEl.textContent.trim() : document.title;
    var code = '', title = raw;
    var m = raw.match(/^(.*?)\s*\|\s*([A-Za-z]?\d+(?:\.\d+)*)\s*$/);
    if (m) { title = m[1]; code = m[2]; }
    var gq = document.querySelector('.topic-guiding-q');
    var gqText = '';
    if (gq) {
      var c = gq.cloneNode(true);
      var lbl = c.querySelector('.gq-label');
      if (lbl) lbl.remove();
      gqText = c.textContent.trim();
    }
    return { code: code, title: title, gq: gqText };
  }

  function shortTitle(id, fallback) {
    var a = document.querySelector('.curr-toc [data-section="' + id + '"] a');
    var t = a ? a.textContent.trim().replace(/^[A-Za-z]?\d+(?:\.\d+)*\s+/, '') : '';
    return t || fallback;
  }

  function collectSections() {
    var out = [];
    var notes = document.querySelector('#course-notes .curr-body') || document.querySelector('.curr-body');
    if (!notes) return out;

    var intro = [];
    for (var n = notes.firstElementChild; n && !n.classList.contains('obj-list'); n = n.nextElementSibling) {
      if (n.matches('.ps-topic-btn, .curr-expand-all-btn')) continue;
      intro.push(n);
    }
    if (intro.length) out.push({ id: 'intro', code: 'intro', kicker: 'Introduction', title: 'Introduction', nodes: intro });

    Array.prototype.forEach.call(notes.querySelectorAll('.obj-section'), function (sec) {
      var body = sec.querySelector('.obj-body');
      if (!body) return;
      var codeEl = sec.querySelector('.obj-code');
      var h = sec.querySelector('.obj-trigger h3');
      var code = codeEl ? codeEl.textContent.trim() : sec.id;
      var title = h ? h.textContent.trim() : code;
      var nodes = Array.prototype.filter.call(body.children, function (k) {
        return !k.matches('.obj-outcome, .ps-obj-btn');
      });
      out.push({ id: sec.id, code: code, title: title, kicker: shortTitle(sec.id, title),
                 outcome: body.querySelector('.obj-outcome'), nodes: nodes });
    });

    var quiz = document.querySelectorAll('#quiz .quiz-q[data-answer]');
    if (quiz.length) {
      out.push({ id: 'quiz', code: 'quiz', kicker: 'Quiz', title: 'Quiz',
                 quiz: Array.prototype.slice.call(quiz), nodes: [] });
    }

    var p2 = document.querySelectorAll('#paper2 .p2-question');
    if (p2.length) {
      out.push({ id: 'paper2', code: 'paper2', kicker: 'Paper 2', title: 'Paper 2',
                 p2: Array.prototype.slice.call(p2), nodes: [] });
    }

    var lq = document.querySelector('.curr-main .linking-qs');
    if (lq) {
      var lqNodes = Array.prototype.filter.call(lq.children, function (k) { return !k.matches('.linking-qs-label'); });
      if (lqNodes.length) out.push({ id: 'linking', code: 'linking', kicker: 'Linking questions', title: 'Linking questions', nodes: lqNodes });
    }
    return out;
  }

  /* ---- page nodes → units --------------------------------------------
     A unit is one piece of content headed for a slide:
       { kind: 'text'|'data'|'figure'|'box'|'live'|'hero'|'break',
         node, title, cont, hard, side }                                 */

  function unit(node, kind, opts) {
    var u = { node: node, kind: kind, title: null, cont: false, hard: false, side: 'right' };
    if (opts) for (var k in opts) u[k] = opts[k];
    return u;
  }

  function prepareClone(node) {
    var c = node.cloneNode(true);
    Array.prototype.forEach.call(c.querySelectorAll('img'), function (im) {
      im.loading = 'eager';
      im.setAttribute('draggable', 'false');
    });
    /* Links to other pages open in a new tab so the deck survives. */
    Array.prototype.forEach.call(c.querySelectorAll('a[href]'), function (a) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '#') { a.target = '_blank'; a.rel = 'noopener'; }
    });
    if (c.tagName === 'A' && (c.getAttribute('href') || '').charAt(0) !== '#') { c.target = '_blank'; c.rel = 'noopener'; }
    return c;
  }

  /* A paragraph opening "<strong>Label:</strong> body" gives up its label
     as the slide heading. Mutates the paragraph. */
  function extractLead(p) {
    var first = p.firstChild;
    while (first && first.nodeType === 3 && !first.nodeValue.trim()) first = first.nextSibling;
    if (!first || first.nodeType !== 1 || first.tagName !== 'STRONG') return null;
    var label = first.textContent.trim();
    if (!label || label.length > LEAD_MAX) return null;
    var after = first.nextSibling;
    var afterText = after && after.nodeType === 3 ? after.nodeValue : '';
    if (!/[:：]$/.test(label) && !/^\s*[:：]/.test(afterText)) return null;
    if (after && after.nodeType === 3) after.nodeValue = afterText.replace(/^\s*[:：]?\s*/, '');
    first.parentNode.removeChild(first);
    if (!p.textContent.trim()) return null;
    return label.replace(/[:：]\s*$/, '');
  }

  /* A short paragraph ending in a colon ("DFD design guidelines:") heads
     whatever follows it rather than taking a slide of its own. */
  function leadOnly(node) {
    if (node.tagName !== 'P' || node.querySelector('img')) return null;
    var t = node.textContent.trim();
    if (!t || t.length > LEAD_MAX || !/[:：]$/.test(t)) return null;
    return t.replace(/[:：]\s*$/, '');
  }

  function figureUnit(node, title) {
    var img = usableImg(node);
    if (!img) return null;
    var fig;
    if (node.tagName === 'FIGURE') {
      fig = node;
    } else {
      fig = el('figure', 'ps-media');
      fig.appendChild(node);
    }
    /* The page wraps photos in a link to the file (for its lightbox); in
       the deck the image itself opens the lightbox, so the link goes. */
    Array.prototype.forEach.call(fig.querySelectorAll('a'), function (a) {
      if (a.querySelector('img')) {
        while (a.firstChild) a.parentNode.insertBefore(a.firstChild, a);
        a.parentNode.removeChild(a);
      }
    });
    var h = hint(node);
    var u = unit(fig, 'figure', { title: title });
    if (h === 'feature') { u.feature = true; u.hard = true; }
    if (h === 'solo') u.hard = true;
    if ((node.getAttribute('data-ps-side') || '') === 'left') u.side = 'left';
    return u;
  }

  /* A list whose items are interleaved with figures (the page puts a photo
     above the item it illustrates) becomes one figure + one item per unit,
     so each photo lands beside its own item. */
  function listUnits(list, title) {
    var out = [];
    var kids = Array.prototype.slice.call(list.children);
    var hasFig = kids.some(function (k) { return k.tagName !== 'LI'; });
    if (!hasFig) { out.push(unit(list, 'data', { title: title })); return out; }
    var n = 0, firstItem = null;
    kids.forEach(function (k) {
      if (k.tagName === 'LI') {
        n++;
        var l = list.cloneNode(false);
        l.removeAttribute('id');
        if (list.tagName === 'OL') l.start = n;
        l.appendChild(k);
        var u = unit(l, 'data', { title: title });
        /* Later items repeat the list's heading as "continued", unless
           they land on the same slide as the first item. */
        if (firstItem) { u.cont = true; u.carriedFrom = firstItem; }
        else firstItem = u;
        out.push(u);
      } else if (usableImg(k)) {
        var f = figureUnit(k, null);
        if (f) out.push(f);
      }
    });
    return out;
  }

  /* A case-study card is a teaser that opens a modal. In the deck it becomes
     a title slide followed by the modal's own content. */
  function caseUnits(card, out) {
    var modal = card.dataset && card.dataset.modal ? document.getElementById(card.dataset.modal) : null;
    var titleEl = modal ? modal.querySelector('.case-modal-header h2') : null;
    var cardTitle = card.querySelector('h4, h3');
    var title = (titleEl ? titleEl.textContent : (cardTitle ? cardTitle.textContent : 'Case study'))
      .replace(/^\s*(case study|product spotlight):\s*/i, '').trim();
    var kicker = /spotlight/i.test(titleEl ? titleEl.textContent : '') ? 'Product spotlight' : 'Case study';
    var teaser = card.querySelector('.case-study-content p');
    var cover = usableImg(card);

    var hero = el('div', 'ps-case-hero');
    if (cover) {
      var im = cover.cloneNode(true);
      im.loading = 'eager';
      im.setAttribute('draggable', 'false');
      hero.appendChild(im);
    } else {
      hero.classList.add('ps-case-hero--noimg');
    }
    var text = el('div', 'ps-case-hero-text');
    text.appendChild(el('div', 'ps-case-kicker', kicker));
    text.appendChild(el('h2', 'ps-case-title', title));
    if (teaser) text.appendChild(el('p', 'ps-case-teaser', teaser.textContent.trim()));
    hero.appendChild(text);
    out.push(unit(hero, 'hero', { hard: true }));

    var body = modal ? modal.querySelector('.case-modal-body') : null;
    if (!body) return;
    var coverSrc = cover ? cover.getAttribute('src') : null;
    var nodes = [];
    Array.prototype.forEach.call(body.children, function (kid) {
      if (kid.classList.contains('case-phase')) Array.prototype.push.apply(nodes, kid.children);
      else nodes.push(kid);
    });
    /* The modal usually opens with the same cover art the title slide
       just showed. */
    nodes = nodes.filter(function (n) {
      var im = usableImg(n);
      if (im && coverSrc && im.getAttribute('src') === coverSrc) { coverSrc = null; return false; }
      return true;
    });
    collectUnits(nodes, out);
  }

  /* A list or table without a heading of its own borrows the heading of
     the paragraph before it, shown only if they end up on different slides. */
  function carry(u, out) {
    if (u.title) return;
    var prev = out[out.length - 1];
    if (prev && prev.kind === 'text' && prev.title) {
      u.title = prev.title;
      u.cont = true;
      u.carriedFrom = prev;
    }
  }

  function collectUnits(nodes, out) {
    var pendingLead = null;
    nodes.forEach(function (node) {
      var h = hint(node);
      if (h === 'skip') return;
      if (node.matches('.hub-group-label, .obj-outcome, .ps-obj-btn, .ps-topic-btn, script, style')) return;
      if (node.tagName === 'HR') { out.push(unit(null, 'break')); return; }
      if (h === 'break') out.push(unit(null, 'break'));

      var title = node.getAttribute('data-ps-title') || pendingLead;
      pendingLead = null;

      if (node.classList.contains('case-study-grid')) {
        Array.prototype.forEach.call(node.children, function (card) { caseUnits(card, out); });
        return;
      }
      if (isLive(node)) {
        var ph = document.createComment('ps-live');
        liveNodes.push({ node: node, placeholder: ph });
        out.push(unit(node, 'live', { title: title, hard: true }));
        return;
      }
      if (node.matches('[data-modal], .case-study-card')) {
        caseUnits(node, out);
        return;
      }

      var standalone = leadOnly(node);
      if (standalone && !node.getAttribute('data-ps-title')) { pendingLead = standalone; return; }

      var clone = prepareClone(node);
      var solo = h === 'solo';

      if (clone.matches('ul, ol')) {
        var lu = listUnits(clone, title);
        if (solo) lu.forEach(function (u) { u.hard = true; });
        var items = lu.filter(function (u) { return u.kind === 'data'; });
        if (items.length) {
          carry(items[0], out);
          if (items[0].carriedFrom) items.forEach(function (u) { u.title = items[0].title; u.carriedFrom = items[0].carriedFrom; });
        }
        Array.prototype.push.apply(out, lu);
        return;
      }
      if (clone.matches('.content-table-wrap, .p2-table-wrap, table')) {
        var du = unit(clone, 'data', { title: title, hard: solo });
        carry(du, out);
        out.push(du);
        return;
      }
      if (clone.matches('figure') || clone.querySelector('img')) {
        if (!usableImg(clone)) return;
        if (!clone.matches('.tool-promo-card')) {
          var f = figureUnit(clone, title);
          if (f) { if (solo) f.hard = true; out.push(f); }
          return;
        }
      }
      if (clone.matches('.discussion-box, .topic-link-blurb, .tool-promo-card, .concept-box, .activity-block') ||
          /^(DIV|SECTION|ASIDE|ARTICLE)$/.test(clone.tagName)) {
        out.push(unit(clone, 'box', { title: title, hard: true }));
        return;
      }
      if (clone.tagName === 'P') {
        var own = title || extractLead(clone);
        var txt = clone.textContent.trim();
        /* A colon-ended paragraph, or a "Table 1:" caption, opens the slide
           its list or table then joins. */
        var leadIn = /[:：]\s*$/.test(txt) || /^(Table|Figure)\s+\d/i.test(txt);
        out.push(unit(clone, 'text', { title: own, hard: solo, leadIn: leadIn, trailer: h === 'trailer' }));
        return;
      }
      out.push(unit(clone, 'text', { title: title, hard: solo }));
    });
  }

  /* ---- splitting an overflowing unit -------------------------------------- */

  function sentenceCut(text, target) {
    var re = /[.!?]["'’)\]]?\s+/g;
    var m, best = -1;
    while ((m = re.exec(text))) {
      var pos = m.index + m[0].length;
      if (pos < 40 || pos > text.length - 40) continue;
      if (best < 0 || Math.abs(pos - target) < Math.abs(best - target)) best = pos;
    }
    return best;
  }

  /* Removes the first `offset` characters of text from `node` and returns
     them as a clone of the same element, inline tags intact. */
  function cutAt(node, offset) {
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    var acc = 0, t, target = null, local = 0;
    while ((t = walker.nextNode())) {
      if (acc + t.length >= offset) { target = t; local = offset - acc; break; }
      acc += t.length;
    }
    if (!target) return null;
    var range = document.createRange();
    range.setStart(node, 0);
    range.setEnd(target, local);
    var head = node.cloneNode(false);
    head.appendChild(range.extractContents());
    return head;
  }

  function splitUnit(u) {
    var n = u.node;
    if (u.kind === 'box' && n.tagName !== 'A') {
      /* Unwrap: the box's label and title become the slide heading and
         its children go through the normal pipeline. */
      var label = n.querySelector('[class$="-label"]'), ttl = n.querySelector('[class$="-title"]');
      var kids = Array.prototype.filter.call(n.children, function (k) { return k !== label && k !== ttl; });
      if (!kids.length) return null;
      var heading = (ttl ? ttl.textContent.trim() : '') || (label ? label.textContent.trim() : '') || u.title;
      var parts = [];
      collectUnits(kids, parts);
      if (!parts.length) return null;
      parts.forEach(function (x, i) {
        if (!x.title) { x.title = heading; if (i) { x.cont = true; x.carriedFrom = parts[0]; } }
      });
      return parts;
    }
    if (u.kind === 'text' && n.tagName === 'P') {
      var text = n.textContent;
      var cut = sentenceCut(text, Math.round(text.length / 2));
      if (cut <= 0) return null;
      var head = cutAt(n, cut);
      if (!head || !head.textContent.trim() || !n.textContent.trim()) return null;
      return [unit(head, 'text', { title: u.title, cont: u.cont }),
              unit(n, 'text', { title: u.title, cont: true })];
    }
    if (u.kind === 'data' && n.matches('ul, ol')) {
      var items = Array.prototype.slice.call(n.children);
      if (items.length < 2) return null;
      var half = Math.ceil(items.length / 2);
      var a = n.cloneNode(false), b = n.cloneNode(false);
      var start = parseInt(n.getAttribute('start') || '1', 10);
      if (n.tagName === 'OL') { a.start = start; b.start = start + half; }
      items.slice(0, half).forEach(function (li) { a.appendChild(li); });
      items.slice(half).forEach(function (li) { b.appendChild(li); });
      return [unit(a, 'data', { title: u.title, cont: u.cont }),
              unit(b, 'data', { title: u.title, cont: true })];
    }
    if (u.kind === 'data') {
      var table = n.matches('table') ? n : n.querySelector('table');
      var tbody = table ? table.querySelector('tbody') : null;
      if (!tbody) return null;
      var rows = Array.prototype.slice.call(tbody.children);
      if (rows.length < 2) return null;
      var h2 = Math.ceil(rows.length / 2);
      var thead = table.querySelector('thead');
      function part(rowSet) {
        var wrap = n === table ? null : n.cloneNode(false);
        var t = table.cloneNode(false);
        if (thead) t.appendChild(thead.cloneNode(true));
        var tb = document.createElement('tbody');
        rowSet.forEach(function (r) { tb.appendChild(r); });
        t.appendChild(tb);
        if (wrap) { wrap.appendChild(t); return wrap; }
        return t;
      }
      return [unit(part(rows.slice(0, h2)), 'data', { title: u.title, cont: u.cont }),
              unit(part(rows.slice(h2)), 'data', { title: u.title, cont: true })];
    }
    return null;
  }

  /* ---- slides --------------------------------------------------------- */

  function newSlide(sec) {
    var s = el('section', 'ps-slide');
    s.dataset.sec = sec.id;
    if (sec.kicker) {
      var k = el('div', 'ps-slide-kicker');
      if (sec.code && sec.code !== sec.id) k.appendChild(el('span', 'ps-kicker-code', sec.code));
      k.appendChild(document.createTextNode(sec.kicker));
      s.appendChild(k);
    }
    var inner = el('div', 'ps-slide-inner');
    var body = el('div', 'obj-body open ps-slide-body');
    var media = el('aside', 'ps-media-col');
    inner.appendChild(body);
    inner.appendChild(media);
    s.appendChild(inner);
    s.ps = { inner: inner, body: body, media: media, units: [], closed: false, hard: false };
    return s;
  }

  function render(u, s) {
    if (u.el) return u.el;
    var node = u.node;
    if (u.carriedFrom && s && s.ps.units.indexOf(u.carriedFrom) >= 0) {
      u.el = node;
      return node;
    }
    if (u.kind === 'live') {
      /* Move the real element (listeners intact) into the deck, leaving a
         placeholder so closeDeck() can put it back where it was. */
      var entry = liveNodes.filter(function (e) { return e.node === node; })[0];
      if (entry && !entry.placeholder.parentNode) node.parentNode.insertBefore(entry.placeholder, node);
      var slot = el('div', 'ps-live-slot');
      slot.appendChild(node);
      node = slot;
    }
    if (!u.title) { u.el = node; return node; }
    var block = el('div', 'ps-block');
    var h = el('h2', 'ps-lead' + (u.cont ? ' ps-lead--cont' : ''));
    h.textContent = u.title;
    if (u.cont) h.appendChild(el('span', 'ps-cont', 'continued'));
    block.appendChild(h);
    block.appendChild(node);
    u.el = block;
    return block;
  }

  function accepts(s, u) {
    var p = s.ps;
    if (p.closed && u.trailer) return true;
    if (p.hard || p.closed || u.hard) return p.units.length === 0;
    var bodyN = p.body.children.length, mediaN = p.media.children.length;
    if (u.kind === 'figure') return bodyN === 0 && mediaN < 2;
    if (u.kind === 'data') {
      return bodyN === 0 || (bodyN === 1 && !p.body.querySelector('table, ul, ol'));
    }
    if (u.kind === 'text') {
      if (mediaN && bodyN >= 2) return false;
      return bodyN < MAX_BODY_BLOCKS;
    }
    return p.units.length === 0;
  }

  function place(s, u) {
    var node = render(u, s);
    if (u.kind === 'figure') s.ps.media.appendChild(node);
    else s.ps.body.appendChild(node);
    s.ps.units.push(u);
    syncMode(s);
  }

  function unplace(s, u) {
    var node = u.el;
    if (node && node.parentNode) node.parentNode.removeChild(node);
    if (u.carriedFrom) { u.el = null; if (u.title && node !== u.node && node.contains(u.node)) node.removeChild(u.node); }
    s.ps.units.pop();
    syncMode(s);
  }

  function syncMode(s) {
    var p = s.ps;
    var hasBody = p.body.children.length > 0, hasMedia = p.media.children.length > 0;
    var feature = p.units.some(function (u) { return u.feature; });
    var left = p.units.some(function (u) { return u.kind === 'figure' && u.side === 'left'; });
    var live = p.units.some(function (u) { return u.kind === 'live'; });
    var hero = p.units.some(function (u) { return u.kind === 'hero'; });
    s.classList.toggle('ps-slide--split', hasBody && hasMedia);
    s.classList.toggle('ps-slide--imgonly', !hasBody && hasMedia && !feature);
    s.classList.toggle('ps-slide--feature', feature);
    s.classList.toggle('ps-slide--media-left', left);
    s.classList.toggle('ps-slide--text', hasBody && !hasMedia && !live && !hero);
    s.classList.toggle('ps-slide--live', live);
    s.classList.toggle('ps-slide--hero', hero);
  }

  function overflows(s) {
    var inner = s.ps.inner;
    return inner.scrollHeight > inner.clientHeight + 2 || inner.scrollWidth > inner.clientWidth + 2;
  }

  /* Last resort for a block that cannot be split. */
  function shrinkToFit(s, floor) {
    var inner = s.ps.inner, zoom = 1;
    floor = floor || 0.55;
    while (overflows(s) && zoom > floor) {
      zoom = Math.round((zoom - 0.05) * 100) / 100;
      inner.style.zoom = zoom;
    }
    /* A widget taller than the stage scrolls rather than becoming
       unreadable. */
    if (overflows(s) && s.ps.units.some(function (u) { return u.kind === 'live'; })) s.classList.add('ps-slide--scroll');
  }

  function packSection(sec, units, out) {
    var queue = units.slice();
    var cur = null;
    while (queue.length) {
      var u = queue.shift();
      if (u.kind === 'break') { cur = null; continue; }
      if (u.leadIn && cur && cur.ps.units.length) cur = null;
      if (!cur || !accepts(cur, u)) {
        cur = newSlide(sec);
        stage.appendChild(cur);
        out.push(cur);
      }
      place(cur, u);
      if (overflows(cur)) {
        if (cur.ps.units.length === 1) {
          var parts = splitUnit(u);
          if (parts) {
            unplace(cur, u);
            stage.removeChild(cur);
            out.pop();
            cur = null;
            queue.unshift.apply(queue, parts);
            continue;
          }
          shrinkToFit(cur, u.kind === 'live' ? 0.7 : 0.55);
        } else {
          unplace(cur, u);
          u.el = null;
          cur = null;
          queue.unshift(u);
          continue;
        }
      }
      if (u.hard) cur.ps.hard = true;
      if (u.kind === 'data') cur.ps.closed = true;
      if (u.hard) cur = null;
    }
  }

  function coverSlide(meta) {
    var s = el('section', 'ps-slide ps-slide--cover');
    s.dataset.sec = 'cover';
    var inner = el('div', 'ps-slide-inner');
    var c = el('div', 'ps-cover-inner');
    if (meta.code) c.appendChild(el('div', 'ps-cover-code', meta.code));
    c.appendChild(el('h1', 'ps-cover-title', meta.title));
    if (meta.gq) {
      var gq = el('p', 'ps-cover-gq');
      gq.appendChild(el('span', 'ps-gq-label', 'Guiding question'));
      gq.appendChild(document.createTextNode(meta.gq));
      c.appendChild(gq);
    }
    c.appendChild(el('div', 'ps-cover-hint', '→ or space to advance · O contents · F fullscreen · ? help'));
    inner.appendChild(c);
    s.appendChild(inner);
    return s;
  }

  function dividerSlide(sec) {
    var s = el('section', 'ps-slide ps-slide--divider');
    s.dataset.sec = sec.id;
    var inner = el('div', 'ps-slide-inner');
    var d = el('div', 'ps-divider-inner');
    if (sec.code && sec.code !== sec.id) d.appendChild(el('div', 'ps-divider-code', sec.code));
    d.appendChild(el('h2', 'ps-divider-title', sec.title));
    if (sec.outcome) {
      var o = el('div', 'ps-divider-outcome');
      var oc = sec.outcome.cloneNode(true);
      var lbl = oc.querySelector('.obj-outcome-label');
      if (lbl) { o.appendChild(lbl); }
      o.appendChild(document.createTextNode(oc.textContent.trim()));
      d.appendChild(o);
    }
    inner.appendChild(d);
    s.appendChild(inner);
    return s;
  }

  /* ---- quiz slides -------------------------------------------------------- */

  function quizDividerSlide(sec) {
    var s = el('section', 'ps-slide ps-slide--divider');
    s.dataset.sec = sec.id;
    var inner = el('div', 'ps-slide-inner');
    var d = el('div', 'ps-divider-inner');
    d.appendChild(el('div', 'ps-divider-code', 'Quiz'));
    d.appendChild(el('h2', 'ps-divider-title', 'Paper 1 practice'));
    var o = el('div', 'ps-divider-outcome');
    o.appendChild(el('span', 'obj-outcome-label', 'How it works'));
    o.appendChild(document.createTextNode(sec.quiz.length + ' multiple-choice questions, one per slide. Choose an answer by clicking it or pressing A to D, or press \u2192 to reveal the answer straight away.'));
    d.appendChild(o);
    inner.appendChild(d);
    s.appendChild(inner);
    return s;
  }

  function quizSlide(sec, q, n) {
    var s = newSlide(sec);
    s.classList.add('ps-slide--quiz', 'ps-slide--text');
    var k = s.querySelector('.ps-slide-kicker');
    if (k) k.appendChild(document.createTextNode(' \u00b7 question ' + n + ' of ' + sec.quiz.length));
    var c = q.cloneNode(true);
    c.removeAttribute('id');
    c.classList.remove('answered');
    Array.prototype.forEach.call(c.querySelectorAll('.quiz-option'), function (o) {
      o.disabled = false;
      o.classList.remove('selected', 'correct', 'incorrect');
      if (o.textContent.trim().length > 60) c.classList.add('ps-quiz--long');
    });
    var btn = el('button', 'ps-tb-btn ps-quiz-reveal', 'Reveal answer');
    btn.type = 'button';
    c.appendChild(btn);
    s.ps.body.appendChild(c);
    s.ps.hard = true;
    s.ps.quiz = c;
    stage.appendChild(s);
    if (overflows(s)) shrinkToFit(s);
    return s;
  }

  /* Marks the chosen option (if any), shows the correct one and the
     explanation. Returns false when the question was already revealed. */
  function revealQuiz(s, chosen) {
    if (s && s.ps && s.ps.p2) {
      if (!s.ps.p2.answer.hidden) return false;
      s.ps.p2.answer.hidden = false;
      s.ps.p2.btn.hidden = true;
      return true;
    }
    var q = s && s.ps ? s.ps.quiz : null;
    if (!q || q.classList.contains('answered')) return false;
    var key = q.dataset.answer;
    Array.prototype.forEach.call(q.querySelectorAll('.quiz-option'), function (o) {
      if (chosen && o.dataset.opt === chosen) o.classList.add('selected');
      o.disabled = true;
      if (o.dataset.opt === key) o.classList.add('correct');
      else if (o.classList.contains('selected')) o.classList.add('incorrect');
    });
    q.classList.add('answered');
    return true;
  }

  /* ---- paper 2 slides ------------------------------------------------------ */

  function p2DividerSlide(sec) {
    var s = el('section', 'ps-slide ps-slide--divider');
    s.dataset.sec = sec.id;
    var inner = el('div', 'ps-slide-inner');
    var d = el('div', 'ps-divider-inner');
    d.appendChild(el('div', 'ps-divider-code', 'Paper 2'));
    d.appendChild(el('h2', 'ps-divider-title', 'Written answer practice'));
    var o = el('div', 'ps-divider-outcome');
    o.appendChild(el('span', 'obj-outcome-label', 'How it works'));
    o.appendChild(document.createTextNode(sec.p2.length + (sec.p2.length === 1 ? ' structured question' : ' structured questions') + '. Each opens with its case study. Every part gets a slide: answer it first, then press \u2192 to reveal the example answer, and the markscheme follows.'));
    d.appendChild(o);
    inner.appendChild(d);
    s.appendChild(inner);
    return s;
  }

  /* Splits an answer or markscheme panel into parts keyed by their "(a)"
     label; paragraphs without a label continue the part before them. */
  function p2Parts(panel) {
    var parts = {}, order = [], key = '';
    if (!panel) return { parts: parts, order: order };
    Array.prototype.forEach.call(panel.children, function (n) {
      if (n.classList.contains('p2-panel-label')) return;
      var m = n.textContent.match(/^\s*\(([a-z])\)/i);
      if (m) key = m[1].toLowerCase();
      if (!parts[key]) { parts[key] = []; order.push(key); }
      parts[key].push(n);
    });
    return { parts: parts, order: order };
  }

  function stripPartLabel(node) {
    var first = node.firstElementChild;
    if (first && first.tagName === 'STRONG' && /^\s*\([a-z]\)\s*$/i.test(first.textContent)) {
      node.removeChild(first);
      if (node.firstChild && node.firstChild.nodeType === 3) node.firstChild.nodeValue = node.firstChild.nodeValue.replace(/^\s+/, '');
    }
    return node;
  }

  /* A markscheme paragraph is one <p> of <br>-separated lines: a syllabus
     statement, then bullet lines, sometimes with "Gains:" style group
     headings between them. It becomes paragraphs and lists so the packer
     can split it by point. */
  function markschemeNodes(pNode, out) {
    var c = stripPartLabel(prepareClone(pNode));
    var lines = [], cur = document.createElement('span');
    Array.prototype.slice.call(c.childNodes).forEach(function (n) {
      if (n.nodeType === 1 && n.tagName === 'BR') { lines.push(cur); cur = document.createElement('span'); }
      else cur.appendChild(n);
    });
    lines.push(cur);
    var list = null;
    lines.forEach(function (ln) {
      var t = ln.textContent.trim();
      if (!t) return;
      if (/^[\u2022\u00b7•]/.test(t)) {
        if (!list) { list = document.createElement('ul'); list.className = 'ps-ms-list'; out.push(list); }
        var li = document.createElement('li');
        while (ln.firstChild) li.appendChild(ln.firstChild);
        var tn = li.firstChild;
        while (tn && tn.nodeType === 3 && !tn.nodeValue.trim()) tn = tn.nextSibling;
        if (tn && tn.nodeType === 3) tn.nodeValue = tn.nodeValue.replace(/^\s*[\u2022\u00b7•]\s*/, '');
        list.appendChild(li);
      } else {
        list = null;
        var p = document.createElement('p');
        while (ln.firstChild) p.appendChild(ln.firstChild);
        out.push(p);
      }
    });
  }

  function p2PartSlide(secQ, qp, letter, answerNodes) {
    var s = newSlide(secQ);
    s.classList.add('ps-slide--p2part', 'ps-slide--text');
    var k = s.querySelector('.ps-slide-kicker');
    if (k && letter) k.appendChild(document.createTextNode(' (' + letter + ')'));
    var wrap = el('div', 'ps-p2-part');
    var qc = prepareClone(qp);
    qc.className = 'ps-p2-q';
    wrap.appendChild(qc);
    var ans = el('div', 'ps-p2-answer');
    ans.appendChild(el('span', 'ps-p2-label', 'Example answer'));
    answerNodes.forEach(function (n) { ans.appendChild(stripPartLabel(prepareClone(n))); });
    var btn = el('button', 'ps-tb-btn ps-p2-reveal', 'Reveal example answer');
    btn.type = 'button';
    wrap.appendChild(ans);
    wrap.appendChild(btn);
    s.ps.body.appendChild(wrap);
    s.ps.hard = true;
    stage.appendChild(s);
    /* Measure with the answer showing: if it cannot share the slide, it
       goes on its own slides after this one instead. */
    var inline = answerNodes.length > 0 && !overflows(s);
    if (!inline) { wrap.removeChild(ans); wrap.removeChild(btn); }
    else { ans.hidden = true; s.ps.p2 = { answer: ans, btn: btn }; }
    return { slide: s, inline: inline };
  }

  function p2QuestionSlides(sec, q, n, out) {
    var meta = q.querySelector('.p2-q-meta');
    var num = meta && meta.querySelector('.p2-q-num') ? meta.querySelector('.p2-q-num').textContent.trim() : 'Question ' + n;
    var marks = meta && meta.querySelector('.p2-marks') ? meta.querySelector('.p2-marks').textContent.trim() : '';
    var secQ = { id: sec.id, code: sec.code, kicker: 'Paper 2 \u00b7 ' + num + (marks ? ' \u00b7 ' + marks : '') };
    var answers = p2Parts(q.querySelector('.p2-answer'));
    var scheme = p2Parts(q.querySelector('.p2-markscheme'));
    var header = q.querySelector('.p2-q-header') || q;

    Array.prototype.forEach.call(header.children, function (block) {
      if (block.classList.contains('p2-q-meta')) return;
      if (block.classList.contains('p2-stimulus')) {
        var lbl = block.querySelector('.p2-stimulus-label');
        var nodes = Array.prototype.filter.call(block.children, function (k) { return k !== lbl; });
        var units = [];
        collectUnits(nodes, units);
        if (units.length && lbl && !units[0].title) units[0].title = lbl.textContent.trim();
        units.forEach(function (u, i) { if (i && !u.title && lbl) { u.title = lbl.textContent.trim(); u.cont = true; u.carriedFrom = units[0]; } });
        packSection(secQ, units, out);
        return;
      }
      var qps = block.classList.contains('p2-q-text') ? Array.prototype.slice.call(block.querySelectorAll('p')) : [];
      if (block.matches('p.p2-q-text')) qps = [block];
      qps.forEach(function (qp) {
        var m = qp.textContent.match(/^\s*\(([a-z])\)/i);
        var letter = m ? m[1].toLowerCase() : '';
        var aNodes = answers.parts[letter] || (letter ? [] : [].concat.apply([], answers.order.map(function (k) { return answers.parts[k]; })));
        var part = p2PartSlide(secQ, qp, letter, aNodes);
        out.push(part.slide);
        var suffix = letter ? ' (' + letter + ')' : '';
        if (!part.inline && aNodes.length) {
          var au = [];
          collectUnits(aNodes.map(function (x) { return stripPartLabel(prepareClone(x)); }), au);
          au.forEach(function (u, i) { u.title = 'Example answer' + suffix; if (i) { u.cont = true; u.carriedFrom = au[0]; } });
          packSection(secQ, au, out);
        }
        var mNodes = scheme.parts[letter] || (letter ? [] : [].concat.apply([], scheme.order.map(function (k) { return scheme.parts[k]; })));
        if (mNodes.length) {
          var nodes = [];
          mNodes.forEach(function (x) {
            if (x.classList.contains('p2-award')) { var a = prepareClone(x); a.classList.add('ps-p2-award'); a.setAttribute('data-ps', 'trailer'); nodes.push(a); }
            else markschemeNodes(x, nodes);
          });
          var mu = [];
          collectUnits(nodes, mu);
          mu.forEach(function (u, i) {
            if (!u.title) { u.title = 'Markscheme' + suffix; if (i) { u.cont = true; u.carriedFrom = mu[0]; } }
          });
          packSection(secQ, mu, out);
        }
      });
    });
  }

  /* ---- deck assembly ------------------------------------------------------ */

  function preloadImages(secs, done) {
    var srcs = {}, pending = 0, finished = false;
    secs.forEach(function (sec) {
      sec.nodes.forEach(function (n) {
        var imgs = n.querySelectorAll ? n.querySelectorAll('img[src]') : [];
        Array.prototype.forEach.call(imgs, function (im) { if (im.getAttribute('src')) srcs[im.getAttribute('src')] = 1; });
        var modalId = n.querySelector && n.querySelector('[data-modal]') ? n.querySelector('[data-modal]').dataset.modal : null;
        var modal = modalId ? document.getElementById(modalId) : null;
        if (modal) Array.prototype.forEach.call(modal.querySelectorAll('img[src]'), function (im) { if (im.getAttribute('src')) srcs[im.getAttribute('src')] = 1; });
      });
    });
    function finish() { if (finished) return; finished = true; done(); }
    Object.keys(srcs).forEach(function (src) {
      pending++;
      var im = new Image();
      im.onload = im.onerror = function () { if (--pending === 0) finish(); };
      im.src = src;
    });
    if (!pending) finish();
    else setTimeout(finish, 3000);
  }

  function buildDeck() {
    var meta = topicMeta();
    sections = collectSections();
    slides = [];
    stage.innerHTML = '';
    liveNodes = [];

    var cover = coverSlide(meta);
    stage.appendChild(cover);
    slides.push(cover);

    sections.forEach(function (sec) {
      sec.first = slides.length;
      if (sec.p2) {
        var pd = p2DividerSlide(sec);
        stage.appendChild(pd);
        slides.push(pd);
        sec.p2.forEach(function (q, i) { p2QuestionSlides(sec, q, i + 1, slides); });
        sec.count = slides.length - sec.first;
        return;
      }
      if (sec.quiz) {
        var qd = quizDividerSlide(sec);
        stage.appendChild(qd);
        slides.push(qd);
        sec.quiz.forEach(function (q, i) { slides.push(quizSlide(sec, q, i + 1)); });
        sec.count = slides.length - sec.first;
        return;
      }
      if (sec.code !== 'intro' && sec.code !== 'linking') {
        var d = dividerSlide(sec);
        stage.appendChild(d);
        slides.push(d);
      }
      var units = [];
      collectUnits(sec.nodes, units);
      packSection(sec, units, slides);
      sec.count = slides.length - sec.first;
    });

    buildOverview(meta);
    built = true;
  }

  function buildOverview(meta) {
    ovList.innerHTML = '';
    function item(code, title, count, target) {
      var li = document.createElement('li');
      var b = el('button', 'ps-overview-item');
      b.type = 'button';
      b.dataset.target = target;
      if (code) b.appendChild(el('span', 'ps-ov-code', code));
      b.appendChild(el('span', 'ps-ov-title', title));
      b.appendChild(el('span', 'ps-ov-count', count + (count === 1 ? ' slide' : ' slides')));
      b.addEventListener('click', function () { show(target); toggleOverview(false); });
      li.appendChild(b);
      ovList.appendChild(li);
    }
    item(meta.code, meta.title, 1, 0);
    sections.forEach(function (sec) {
      var plain = sec.code === sec.id || /^(intro|linking|quiz|paper2)$/.test(sec.code);
      item(plain ? '' : sec.code, sec.kicker, sec.count, sec.first);
    });
  }

  /* ---- overlay chrome ------------------------------------------------------ */

  function buildOverlay() {
    overlay = el('div', 'ps-overlay');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    var canFull = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
    overlay.innerHTML =
      '<div class="ps-topbar">' +
        '<button type="button" class="ps-tb-btn ps-tb-overview" aria-label="Contents" title="Contents (O)">' + I.list + '<span>Contents</span></button>' +
        '<div class="ps-deck-title"></div>' +
        (canFull ? '<button type="button" class="ps-tb-btn ps-tb-full" title="Fullscreen (F)">' + I.full + '<span>Fullscreen</span></button>' : '') +
        '<button type="button" class="ps-tb-btn ps-tb-print" title="Save as PDF (P)">' + I.print + '<span>PDF</span></button>' +
        '<button type="button" class="ps-tb-btn ps-tb-help" title="Keyboard shortcuts (?)">' + I.help + '<span>Keys</span></button>' +
        '<button type="button" class="ps-tb-btn ps-tb-btn--close ps-return">&#8592; <span>Return to page</span></button>' +
      '</div>' +
      '<div class="ps-progress"><span class="ps-progress-bar"></span></div>' +
      '<div class="ps-stage"></div>' +
      '<aside class="ps-overview" aria-label="Contents">' +
        '<div class="ps-overview-head"><span>Contents</span><button type="button" class="ps-tb-btn ps-ov-close">Close</button></div>' +
        '<ul class="ps-overview-list"></ul>' +
      '</aside>' +
      '<div class="ps-help" role="dialog" aria-label="Keyboard shortcuts">' +
        '<div class="ps-help-card"><h2>Keyboard shortcuts</h2><table>' +
          '<tr><td><kbd>→</kbd> <kbd>Space</kbd> <kbd>PgDn</kbd></td><td>Next slide</td></tr>' +
          '<tr><td><kbd>←</kbd> <kbd>PgUp</kbd></td><td>Previous slide</td></tr>' +
          '<tr><td><kbd>Home</kbd> <kbd>End</kbd></td><td>First / last slide</td></tr>' +
          '<tr><td><kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd></td><td>Quiz: choose an option and reveal the answer (→ reveals without choosing)</td></tr>' +
          '<tr><td><kbd>→</kbd> on a Paper 2 part</td><td>Reveals the example answer, then advances</td></tr>' +
          '<tr><td><kbd>O</kbd></td><td>Contents panel</td></tr>' +
          '<tr><td><kbd>F</kbd></td><td>Fullscreen</td></tr>' +
          '<tr><td><kbd>P</kbd></td><td>Save as PDF (print)</td></tr>' +
          '<tr><td><kbd>?</kbd></td><td>This help</td></tr>' +
          '<tr><td><kbd>Esc</kbd></td><td>Close panel, leave fullscreen, or return to the page</td></tr>' +
          '<tr><td>Swipe</td><td>Next / previous slide on touch screens</td></tr>' +
        '</table><button type="button" class="ps-tb-btn ps-help-close">Close</button></div>' +
      '</div>' +
      '<div class="ps-footer">' +
        '<button type="button" class="ps-nav ps-nav-prev" aria-label="Previous slide">' + I.prev + '</button>' +
        '<span class="ps-counter" aria-live="polite">1 / 1</span>' +
        '<button type="button" class="ps-nav ps-nav-next" aria-label="Next slide">' + I.next + '</button>' +
      '</div>';
    document.body.appendChild(overlay);
    stage = overlay.querySelector('.ps-stage');
    stage.tabIndex = -1;
    ovList = overlay.querySelector('.ps-overview-list');

    overlay.querySelector('.ps-return').addEventListener('click', closeDeck);
    overlay.querySelector('.ps-nav-prev').addEventListener('click', function () { show(index - 1); });
    overlay.querySelector('.ps-nav-next').addEventListener('click', function () { show(index + 1); });
    overlay.querySelector('.ps-tb-overview').addEventListener('click', function () { toggleOverview(); });
    overlay.querySelector('.ps-ov-close').addEventListener('click', function () { toggleOverview(false); });
    overlay.querySelector('.ps-tb-help').addEventListener('click', function () { toggleHelp(); });
    overlay.querySelector('.ps-help-close').addEventListener('click', function () { toggleHelp(false); });
    overlay.querySelector('.ps-help').addEventListener('click', function (e) { if (e.target === this) toggleHelp(false); });
    overlay.querySelector('.ps-tb-print').addEventListener('click', printDeck);
    var fullBtn = overlay.querySelector('.ps-tb-full');
    if (fullBtn) fullBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', syncFullscreen);
    document.addEventListener('webkitfullscreenchange', syncFullscreen);

    /* In-deck clicks: photos open the page lightbox, same-page anchors jump
       within the deck, modal openers use the page's modal. */
    stage.addEventListener('click', function (e) {
      var img = e.target.closest('.ps-media-col img');
      if (img) { openLightbox(img); return; }
      var opt = e.target.closest('.ps-slide--quiz .quiz-option');
      if (opt) { revealQuiz(slides[index], opt.dataset.opt); focusStage(); return; }
      if (e.target.closest('.ps-quiz-reveal, .ps-p2-reveal')) { revealQuiz(slides[index]); focusStage(); return; }
      var a = e.target.closest('a[href^="#"]');
      if (a) {
        var id = a.getAttribute('href').slice(1);
        var i = firstSlideOf(id);
        if (i >= 0) { e.preventDefault(); show(i); }
        return;
      }
      var trig = e.target.closest('[data-modal]');
      if (trig) {
        var modal = document.getElementById(trig.dataset.modal);
        if (modal) { modal.classList.add('open'); var cb = modal.querySelector('.case-modal-close'); if (cb) cb.focus(); }
      }
    });

    /* Swipe */
    var tx = null, ty = null;
    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { tx = null; return; }
      tx = e.touches[0].clientX; ty = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      tx = null;
      if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
      if (e.target.closest('.drag-sort, .ps-live-slot')) return;
      if (dx < 0 && revealQuiz(slides[index])) return;
      show(dx < 0 ? index + 1 : index - 1);
    }, { passive: true });

    overlay.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = overlay.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusable = Array.prototype.filter.call(focusable, function (f) { return f.offsetParent !== null; });
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  function firstSlideOf(id) {
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].id === id || sections[i].code === id) return sections[i].first;
    }
    return -1;
  }

  function sectionAt(i) {
    var id = slides[i] ? slides[i].dataset.sec : null;
    for (var k = 0; k < sections.length; k++) if (sections[k].id === id) return sections[k];
    return null;
  }

  function show(i) {
    var n = slides.length;
    if (!n) return;
    index = Math.max(0, Math.min(i, n - 1));
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === index); });
    overlay.querySelector('.ps-counter').textContent = (index + 1) + ' / ' + n;
    overlay.querySelector('.ps-progress-bar').style.width = Math.round((index + 1) / n * 100) + '%';
    overlay.querySelector('.ps-nav-prev').disabled = index === 0;
    overlay.querySelector('.ps-nav-next').disabled = index === n - 1;
    var sec = sectionAt(index);
    Array.prototype.forEach.call(ovList.querySelectorAll('.ps-overview-item'), function (b) {
      var t = parseInt(b.dataset.target, 10);
      b.classList.toggle('is-current', sec ? t === sec.first : t === 0);
    });
    var hash = '#' + HASH_KEY;
    if (sec) hash += '/' + sec.code + (index > sec.first ? '/' + (index - sec.first + 1) : '');
    if (location.hash !== hash) history.replaceState(null, '', hash);
    focusStage();
  }

  /* Keyboard navigation reads the focused element: a focused toolbar
     button would swallow Space, so focus rests on the stage between
     interactions. */
  function focusStage() {
    if (overlay.querySelector('.ps-overview.is-open') || overlay.querySelector('.ps-help.is-open')) return;
    var a = document.activeElement;
    if (a && a.closest && a.closest('.ps-live-slot')) return;
    stage.focus({ preventScroll: true });
  }

  function toggleOverview(force) {
    var p = overlay.querySelector('.ps-overview');
    var on = typeof force === 'boolean' ? force : !p.classList.contains('is-open');
    p.classList.toggle('is-open', on);
    overlay.querySelector('.ps-tb-overview').classList.toggle('is-on', on);
    if (on) { var cur = p.querySelector('.is-current') || p.querySelector('.ps-overview-item'); if (cur) cur.focus(); }
    else focusStage();
  }
  function toggleHelp(force) {
    var p = overlay.querySelector('.ps-help');
    var on = typeof force === 'boolean' ? force : !p.classList.contains('is-open');
    p.classList.toggle('is-open', on);
    if (on) p.querySelector('.ps-help-close').focus();
    else focusStage();
  }

  function fullscreenEl() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function toggleFullscreen() {
    var root = document.documentElement;
    if (fullscreenEl()) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      var req = root.requestFullscreen || root.webkitRequestFullscreen;
      if (req) { try { var r = req.call(root); if (r && r.catch) r.catch(function () {}); } catch (err) {} }
    }
  }
  function syncFullscreen() {
    if (!overlay) return;
    overlay.classList.toggle('is-fullscreen', !!fullscreenEl() && isOpen());
  }

  function printDeck() {
    if (!isOpen()) return;
    window.print();
  }

  function openLightbox(img) {
    var lb = document.getElementById('case-lightbox');
    if (!lb) return;
    var lim = lb.querySelector('img');
    if (!lim) return;
    lim.src = img.currentSrc || img.src;
    lim.alt = img.alt || '';
    lb.classList.add('open');
    /* The page's own close handler restores body scrolling; the deck
       still wants it locked. */
    lb.addEventListener('click', function relock() {
      lb.removeEventListener('click', relock);
      setTimeout(function () { if (isOpen()) document.body.style.overflow = 'hidden'; }, 0);
    });
  }

  /* ---- open / close -------------------------------------------------------- */

  function openDeck(trigger, target) {
    if (!overlay) buildOverlay();
    opener = trigger || null;
    var meta = topicMeta();
    var section = document.querySelector('#course-notes') || document.querySelector('.curr-section');
    var color = section ? section.style.getPropertyValue('--curr-color') : '';
    if (color) { overlay.style.setProperty('--curr-color', color); overlay.style.setProperty('--topic-color', color); }
    var t = overlay.querySelector('.ps-deck-title');
    t.innerHTML = '';
    if (meta.code) t.appendChild(el('span', 'ps-deck-code', meta.code));
    t.appendChild(document.createTextNode(meta.title));
    overlay.setAttribute('aria-label', 'Presentation: ' + meta.title);

    overlay.classList.add('is-open', 'is-building');
    document.body.classList.add('ps-presenting');
    document.body.style.overflow = 'hidden';
    stage.innerHTML = '<div class="ps-building">Preparing slides…</div>';

    var secs = collectSections();
    preloadImages(secs, function () {
      if (!isOpen()) return;
      lastSize = innerWidth + 'x' + innerHeight;
      buildDeck();
      overlay.classList.remove('is-building');
      show(resolveTarget(target));
    });
  }

  /* target: undefined | { id } | { code, k } */
  function resolveTarget(target) {
    if (!target) return 0;
    var i = target.id ? firstSlideOf(target.id) : (target.code ? firstSlideOf(target.code) : -1);
    if (i < 0) return 0;
    if (target.k > 1) i += target.k - 1;
    return Math.min(i, slides.length - 1);
  }

  function restoreLive() {
    liveNodes.forEach(function (e) {
      if (e.placeholder.parentNode) {
        e.placeholder.parentNode.insertBefore(e.node, e.placeholder);
        e.placeholder.parentNode.removeChild(e.placeholder);
      }
    });
    liveNodes = [];
  }

  function closeDeck() {
    if (!isOpen()) return;
    var sec = sectionAt(index);
    if (fullscreenEl()) toggleFullscreen();
    toggleOverview(false);
    toggleHelp(false);
    overlay.classList.remove('is-open', 'is-building', 'is-fullscreen');
    document.body.classList.remove('ps-presenting');
    document.body.style.overflow = '';
    document.querySelectorAll('.case-modal.open').forEach(function (m) { m.classList.remove('open'); });
    var lb = document.getElementById('case-lightbox');
    if (lb) lb.classList.remove('open');
    restoreLive();
    stage.innerHTML = '';
    slides = [];
    built = false;
    var anchor = sec && sec.id !== 'intro' && sec.id !== 'linking' ? '#' + sec.id : '';
    history.replaceState(null, '', location.pathname + location.search + anchor);
    var target = anchor ? document.getElementById(sec.id) : null;
    if (target) target.scrollIntoView({ block: 'start' });
    if (opener) opener.focus();
  }

  /* ---- keyboard ----------------------------------------------------------- */

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    var typing = t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    if (typing) return;
    var lb = document.getElementById('case-lightbox');
    var modalOpen = document.querySelector('.case-modal.open') || (lb && lb.classList.contains('open'));

    if (e.key === 'Escape') {
      if (modalOpen) return;               /* curriculum.js closes it */
      if (overlay.querySelector('.ps-help').classList.contains('is-open')) { toggleHelp(false); return; }
      if (overlay.querySelector('.ps-overview').classList.contains('is-open')) { toggleOverview(false); return; }
      if (fullscreenEl()) return;          /* the browser leaves fullscreen */
      e.stopPropagation();
      closeDeck();
      return;
    }
    if (modalOpen || isBuilding()) return;
    var inButton = t && /^(BUTTON|A)$/.test(t.tagName);
    var cur = slides[index];
    if (cur && cur.ps && cur.ps.quiz && /^[a-dA-D]$/.test(e.key)) {
      if (revealQuiz(cur, e.key.toUpperCase())) return;
    }
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': e.preventDefault(); if (!revealQuiz(cur)) show(index + 1); break;
      case 'ArrowLeft':  case 'PageUp':   e.preventDefault(); show(index - 1); break;
      case ' ':
        if (inButton && t.classList.contains('quiz-option')) break;
        if (!inButton || t.classList.contains('ps-quiz-reveal') || t.classList.contains('ps-p2-reveal')) {
          e.preventDefault();
          if (e.shiftKey) show(index - 1);
          else if (!revealQuiz(cur)) show(index + 1);
        }
        break;
      case 'Home': e.preventDefault(); show(0); break;
      case 'End':  e.preventDefault(); show(slides.length - 1); break;
      case 'o': case 'O': toggleOverview(); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 'p': case 'P': printDeck(); break;
      case '?': toggleHelp(); break;
      case '/': if (e.shiftKey) toggleHelp(); break;
    }
  });

  /* The deck is packed for the stage it was built on. A resize (entering
     fullscreen, mirroring to a projector) changes that, so rebuild in
     place and land on the same slide. */
  var resizeTimer = null, lastSize = '';
  window.addEventListener('resize', function () {
    if (!isOpen() || !built) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!isOpen() || !built) return;
      var size = innerWidth + 'x' + innerHeight;
      if (size === lastSize) return;
      lastSize = size;
      var sec = sectionAt(index);
      var target = sec ? { code: sec.code, k: index - sec.first + 1 } : null;
      restoreLive();
      buildDeck();
      show(resolveTarget(target));
    }, 250);
  });

  /* ---- hash routing --------------------------------------------------------- */

  function parseHash() {
    var h = location.hash.replace(/^#/, '');
    if (h !== HASH_KEY && h.indexOf(HASH_KEY + '/') !== 0) return null;
    var parts = h.split('/');
    return { code: parts[1] || null, k: parseInt(parts[2] || '1', 10) || 1 };
  }

  window.addEventListener('hashchange', function () {
    var t = parseHash();
    if (t && !isOpen()) openDeck(null, t);
    else if (!t && isOpen()) closeDeck();
    else if (t && isOpen() && built) show(resolveTarget(t));
  });

  /* ---- entry buttons ------------------------------------------------------- */

  function init() {
    var main = document.querySelector('.curr-main');
    if (!main || !document.querySelector('.obj-section')) return;

    var topicBtn = el('button', 'ps-topic-btn');
    topicBtn.type = 'button';
    topicBtn.innerHTML = 'Present topic ' + I.play;
    topicBtn.addEventListener('click', function () { openDeck(topicBtn); });
    var expand = main.querySelector('.curr-expand-all-btn');
    if (expand) expand.after(topicBtn);
    else main.insertBefore(topicBtn, main.firstChild);

    document.querySelectorAll('.curr-main .obj-section').forEach(function (sec) {
      var body = sec.querySelector('.obj-body');
      if (!body) return;
      var btn = el('button', 'ps-obj-btn');
      btn.type = 'button';
      btn.innerHTML = 'Present from here ' + I.play;
      btn.addEventListener('click', function () { openDeck(btn, { id: sec.id }); });
      var anchor = body.querySelector('.obj-outcome');
      if (anchor) anchor.after(btn);
      else body.insertBefore(btn, body.firstChild);
    });

    var t = parseHash();
    if (t) openDeck(null, t);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
