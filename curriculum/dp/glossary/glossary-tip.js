/* glossary-tip.js — hover / tap definitions for glossary-tagged words.
   Requires glossary-data.js to be loaded first.

   TAGGING A WORD ON A TOPIC PAGE
   ------------------------------
   Add these two lines before </body>, with the path adjusted for depth:

     <script src="glossary/glossary-data.js"></script>
     <script src="glossary/glossary-tip.js"></script>

   Then wrap the word. The simplest form matches on the text itself:

     <span class="gloss">anthropometrics</span>

   When the visible wording differs from the glossary term, name the term:

     <span class="gloss" data-term="anthropometrics">body measurement data</span>

   data-term takes either a term id (lowercase, hyphenated: "young-s-modulus")
   or the term as written ("Young's Modulus") — both resolve. Common
   abbreviations and plurals resolve too, so data-term="CAD" and
   <span class="gloss">prototypes</span> both find their entry.

   A tag that matches nothing gets data-gloss="missing" and is reported in the
   console, so typos show up rather than failing silently.
*/
(function () {
  'use strict';

  var G = window.DP_GLOSSARY;
  if (!G) { return; }

  var GLOSSARY_URL = document.documentElement.getAttribute('data-glossary-url') || '/curriculum/dp/glossary/';

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
    pop.innerHTML =
      '<span class="gloss-pop-term">' + esc(entry.term) + '</span>' +
      '<span class="gloss-pop-def">' + esc(entry.def) + '</span>' +
      '<span class="gloss-pop-foot">' + chips + '</span>';
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

    var entry = lookup(el.getAttribute('data-term') || el.textContent);
    if (!entry) {
      el.setAttribute('data-gloss', 'missing');
      if (window.console) { console.warn('[glossary] no entry for:', el.getAttribute('data-term') || el.textContent.trim()); }
      return;
    }

    el._glossEntry = entry;
    el.setAttribute('data-gloss', entry.id);
    if (!el.hasAttribute('tabindex')) { el.setAttribute('tabindex', '0'); }
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', entry.term + ' — show definition');

    el.addEventListener('mouseenter', function () { clearTimeout(hideTimer); show(el); });
    el.addEventListener('mouseleave', scheduleHide);
    el.addEventListener('focus', function () { show(el); });
    el.addEventListener('blur', hide);
    el.addEventListener('click', function (e) {
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
  window.addEventListener('scroll', function () { if (current) { place(current); } }, { passive: true });
  window.addEventListener('resize', hide);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { scan(); });
  } else {
    scan();
  }

  /* Re-scan after injecting markup dynamically. */
  window.glossaryScan = scan;
})();
