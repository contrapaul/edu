/* glossary-tip.js — hover / tap definitions for glossary-tagged words.
   Requires glossary-data.js to be loaded first.

   Topic pages get their words tagged automatically by glossary-link.js,
   which wraps each match in <a class="gloss" data-term="…" href="…">.
   Hover or keyboard focus shows the definition; click follows the link to
   the glossary entry. On touch devices (no hover) a tap opens the popover
   instead, and the popover carries its own "Open in glossary" link.

   TAGGING A WORD BY HAND
   ----------------------
   For wording the matcher does not know, wrap the word yourself. The
   simplest form matches on the text itself:

     <span class="gloss">anthropometrics</span>

   When the visible wording differs from the glossary term, name the term:

     <span class="gloss" data-term="anthropometrics">body measurement data</span>

   data-term takes either a term id (lowercase, hyphenated: "young-s-modulus")
   or the term as written ("Young's Modulus") — both resolve. Common
   abbreviations and plurals resolve too, so data-term="CAD" and
   <span class="gloss">prototypes</span> both find their entry.

   A tag that matches nothing gets data-gloss="missing" and is reported in the
   console, so typos show up rather than failing silently.

   For a demonstration that is not a term (the key on the DP hub), give the
   element its own text instead of a term:

     <span class="gloss" data-gloss-title="Glossary" data-gloss-note="Like this.">this colour</span>
*/
(function () {
  'use strict';

  var G = window.DP_GLOSSARY;
  if (!G) { return; }

  var GLOSSARY_URL = document.documentElement.getAttribute('data-glossary-url') || '/curriculum/dp/glossary/';
  var TOUCH = window.matchMedia && window.matchMedia('(hover: none)').matches;

  var byId = {};
  G.terms.forEach(function (t) { byId[t.id] = t; });

  function slug(s) {
    return String(s)
      .normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/[‘’]/g, "'")
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function lookup(raw) {
    var k = slug(raw);
    return byId[k] || byId[G.aliases[k]] || null;
  }

  /* ---- popover ---------------------------------------------------- */

  var pop = null, current = null, hideTimer = null;

  function buildPop() {
    pop = document.createElement('div');
    pop.className = 'gloss-pop';
    pop.id = 'gloss-pop';
    pop.setAttribute('role', 'tooltip');
    pop.hidden = true;
    pop.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    pop.addEventListener('mouseleave', scheduleHide);
    document.body.appendChild(pop);
    return pop;
  }

  function render(entry) {
    var chips = entry.topics.map(function (t) {
      return '<a class="gloss-pop-chip" href="' + GLOSSARY_URL + '#' + entry.id + '">' + t[0] + '</a>';
    }).join('');
    var open = entry.id
      ? '<a class="gloss-pop-open" href="' + GLOSSARY_URL + '#' + entry.id + '">Open in glossary \u2192</a>'
      : '<a class="gloss-pop-open" href="' + GLOSSARY_URL + '">Open the glossary \u2192</a>';
    pop.innerHTML =
      '<span class="gloss-pop-term">' + esc(entry.term) + '</span>' +
      '<span class="gloss-pop-def">' + esc(entry.def) + '</span>' +
      '<span class="gloss-pop-foot">' + chips + open + '</span>';
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function place(el) {
    var r = el.getBoundingClientRect();
    var sx = window.pageXOffset, sy = window.pageYOffset;
    var margin = 10;

    pop.style.left = '0px';
    pop.style.top = '0px';
    pop.hidden = false;
    var pw = pop.offsetWidth, ph = pop.offsetHeight;

    var left = r.left + sx + r.width / 2 - pw / 2;
    left = Math.max(sx + margin, Math.min(left, sx + document.documentElement.clientWidth - pw - margin));

    var above = r.top > ph + margin;
    var top = above ? r.top + sy - ph - 8 : r.bottom + sy + 8;

    pop.classList.toggle('is-below', !above);
    pop.style.left = Math.round(left) + 'px';
    pop.style.top = Math.round(top) + 'px';
  }

  function show(el) {
    var entry = el._glossEntry;
    if (!entry) { return; }
    clearTimeout(hideTimer);
    if (current && current !== el) { current.removeAttribute('aria-describedby'); }
    current = el;
    if (!pop) { buildPop(); }
    render(entry);
    place(el);
    el.setAttribute('aria-describedby', 'gloss-pop');
    el.classList.add('is-open');
  }

  function hide() {
    if (!current) { return; }
    current.removeAttribute('aria-describedby');
    current.classList.remove('is-open');
    current = null;
    if (pop) { pop.hidden = true; }
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 160);
  }

  /* ---- wiring ----------------------------------------------------- */

  function upgrade(el) {
    if (el._glossReady) { return; }
    el._glossReady = true;

    var note = el.getAttribute('data-gloss-note');
    var entry = note
      ? { id: '', term: el.getAttribute('data-gloss-title') || 'Glossary', def: note, topics: [] }
      : lookup(el.getAttribute('data-term') || el.textContent);
    if (!entry) {
      el.setAttribute('data-gloss', 'missing');
      if (window.console) { console.warn('[glossary] no entry for:', el.getAttribute('data-term') || el.textContent.trim()); }
      return;
    }

    el._glossEntry = entry;
    el.setAttribute('data-gloss', entry.id || 'note');
    var isLink = el.tagName === 'A';
    if (isLink) {
      if (!el.getAttribute('href')) { el.setAttribute('href', GLOSSARY_URL + '#' + entry.id); }
    } else {
      if (!el.hasAttribute('tabindex')) { el.setAttribute('tabindex', '0'); }
      el.setAttribute('role', 'button');
    }
    el.setAttribute('aria-label', entry.term + ': show definition');

    if (!TOUCH) {
      /* On touch browsers a tap fires mouseenter, focus and then click, so
         the popover would open and close in one go. Hover and focus
         listeners are desktop-only; touch uses click alone. */
      el.addEventListener('mouseenter', function () { clearTimeout(hideTimer); show(el); });
      el.addEventListener('mouseleave', scheduleHide);
      el.addEventListener('focus', function () { show(el); });
      el.addEventListener('blur', scheduleHide);
    }
    el.addEventListener('click', function (e) {
      if (isLink && !TOUCH) { return; }          /* a real link: let it navigate */
      e.preventDefault();
      if (current === el) { hide(); } else { show(el); }
    });
  }

  function scan(root) {
    (root || document).querySelectorAll('.gloss').forEach(upgrade);
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { hide(); } });
  document.addEventListener('click', function (e) {
    if (current && !current.contains(e.target) && pop && !pop.contains(e.target)) { hide(); }
  });
  /* Capture phase so scrolling inside a modal repositions the popover too. */
  document.addEventListener('scroll', function () { if (current) { place(current); } }, { passive: true, capture: true });
  window.addEventListener('resize', hide);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { scan(); });
  } else {
    scan();
  }

  /* Re-scan after injecting markup dynamically. */
  window.glossaryScan = scan;
})();
