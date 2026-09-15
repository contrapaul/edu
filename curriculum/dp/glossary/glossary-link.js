/* glossary-link.js — turns glossary vocabulary in the course notes into
   definition links. Load after glossary-data.js, glossary-matches.js and
   glossary-tip.js:

     <script src="glossary/glossary-data.js"></script>
     <script src="glossary/glossary-matches.js"></script>
     <script src="glossary/glossary-tip.js"></script>
     <script src="glossary/glossary-link.js"></script>

   What it does
   ------------
   Reads every surface form in glossary-matches.js, builds one regex per
   matching mode, walks the text nodes inside #course-notes, and wraps the
   first occurrence of each term in each .obj-section as

     <a class="gloss" href="…/glossary/#term-id" data-term="term-id">word</a>

   then hands the new anchors to glossary-tip.js for the popover.

   Matching rules (the same ones check-matches.py enforces):
     - whole words only
     - "match" and "local" forms are case-insensitive; "exact" forms are not
     - a space or hyphen in a form matches a space, hyphen or en dash
     - straight and curly apostrophes are interchangeable
     - "local" forms only apply when the page's topic family (the digits of
       the code, so A3.4 and B3.4 are one family) is one of the term's
       topics or its "also" list
     - the longest form wins; forms never overlap

   Skipped: text inside links, buttons, headings, code, form controls, SVG,
   figure captions, existing .gloss tags, .obj-code labels and anything
   under [data-nogloss].

   Sections: each .obj-section is a section; anything in #course-notes
   outside one counts as a single intro section. Case-study modals are
   opened from the course notes but live outside them in the DOM, so each
   .case-modal-body is scanned as its own section.
*/
(function () {
  'use strict';

  var G = window.DP_GLOSSARY, M = window.DP_GLOSSARY_MATCHES;
  if (!G || !M) { return; }

  var ROOT_SEL = '#course-notes, .case-modal .case-modal-body';
  var SECTION_SEL = '.obj-section, .case-modal';
  var SKIP_SEL = 'a, button, h1, h2, h3, h4, code, pre, svg, figcaption, label, input, textarea, select, script, style, .gloss, .obj-code, [data-nogloss]';
  var GLOSSARY_URL = document.documentElement.getAttribute('data-glossary-url') || '/curriculum/dp/glossary/';

  var byId = {};
  G.terms.forEach(function (t) { byId[t.id] = t; });

  var page = (document.body.getAttribute('data-curr-page') || '').toUpperCase();   // 'A3.1'
  var family = page.replace(/^[A-Z]/, '');                                          // '3.1'

  function familyOf(code) { return String(code).replace(/^[A-Z]/i, ''); }

  function localAllowed(term, rules) {
    var i;
    for (i = 0; i < term.topics.length; i++) { if (familyOf(term.topics[i][0]) === family) { return true; } }
    var also = rules.also || [];
    for (i = 0; i < also.length; i++) { if (familyOf(also[i]) === family) { return true; } }
    return false;
  }

  /* Normalised key for a matched string: lower-case, separators collapsed,
     apostrophes straightened. Case-sensitive forms are keyed as written. */
  function key(s) {
    return s.replace(/’/g, "'").replace(/[\s\-–]+/g, ' ').toLowerCase();
  }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&'); }
  function pattern(form) {
    return form.replace(/’/g, "'").trim().split(/[\s\-]+/).map(function (part) {
      return esc(part).replace(/'/g, "['’]");
    }).join('[\\s\\-\\u2013]+');
  }

  /* ---- build the matchers ----------------------------------------- */

  var ci = [], cs = [], ciMap = {}, csMap = {};
  Object.keys(M).forEach(function (id) {
    var term = byId[id], rules = M[id];
    if (!term) { return; }
    var forms = (rules.match || []).slice();
    if (rules.local && localAllowed(term, rules)) { forms = forms.concat(rules.local); }
    forms.forEach(function (f) { ci.push(f); ciMap[key(f)] = id; });
    (rules.exact || []).forEach(function (f) { cs.push(f); csMap[f.trim()] = id; });
  });
  var byLen = function (a, b) { return b.length - a.length; };
  ci.sort(byLen); cs.sort(byLen);

  /* Word boundaries via a leading capture group rather than lookbehind, so
     older Safari builds the regex. \\w-ish boundary: letters, digits, _. */
  var LEAD = '(^|[^A-Za-z0-9_\\u00C0-\\u024F])';
  var TRAIL = '(?![A-Za-z0-9_\\u00C0-\\u024F])';
  var reCI = ci.length ? new RegExp(LEAD + '(' + ci.map(pattern).join('|') + ')' + TRAIL, 'gi') : null;
  var reCS = cs.length ? new RegExp(LEAD + '(' + cs.map(pattern).join('|') + ')' + TRAIL, 'g') : null;

  /* All matches in a string, longest-first and non-overlapping, as
     {start, end, id}. Exact forms run first so "LED" is not taken by a
     case-insensitive form; the overlap check then keeps the first claim. */
  function findAll(text) {
    var out = [], m;
    function claim(start, end, id) {
      for (var i = 0; i < out.length; i++) {
        if (start < out[i].end && end > out[i].start) { return; }
      }
      out.push({ start: start, end: end, id: id });
    }
    if (reCS) {
      reCS.lastIndex = 0;
      while ((m = reCS.exec(text))) {
        var s1 = m.index + m[1].length;
        var id1 = csMap[m[2]];
        if (id1) { claim(s1, s1 + m[2].length, id1); }
        reCS.lastIndex = s1 + 1;
      }
    }
    if (reCI) {
      reCI.lastIndex = 0;
      while ((m = reCI.exec(text))) {
        var s2 = m.index + m[1].length;
        var id2 = ciMap[key(m[2])];
        if (id2) { claim(s2, s2 + m[2].length, id2); }
        reCI.lastIndex = s2 + 1;
      }
    }
    return out.sort(function (a, b) { return a.start - b.start; });
  }

  /* ---- walk and wrap --------------------------------------------- */

  function link(root, seen) {
    var nodes = [], walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !/\S/.test(n.nodeValue)) { return NodeFilter.FILTER_REJECT; }
        var p = n.parentNode;
        if (!p || p.nodeType !== 1 || p.closest(SKIP_SEL)) { return NodeFilter.FILTER_REJECT; }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) { nodes.push(walker.currentNode); }

    var count = 0;
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var hits = findAll(text);
      if (!hits.length) { return; }
      var section = node.parentNode.closest(SECTION_SEL);
      var sk = section ? (section.id || 'section') : 'intro';
      var done = seen[sk] || (seen[sk] = {});

      var frag = null, last = 0;
      hits.forEach(function (h) {
        if (done[h.id]) { return; }
        done[h.id] = true;
        if (!frag) { frag = document.createDocumentFragment(); }
        if (h.start > last) { frag.appendChild(document.createTextNode(text.slice(last, h.start))); }
        var a = document.createElement('a');
        a.className = 'gloss';
        a.setAttribute('data-term', h.id);
        a.setAttribute('href', GLOSSARY_URL + '#' + h.id);
        a.textContent = text.slice(h.start, h.end);
        frag.appendChild(a);
        last = h.end;
        count++;
      });
      if (!frag) { return; }
      if (last < text.length) { frag.appendChild(document.createTextNode(text.slice(last))); }
      node.parentNode.replaceChild(frag, node);
    });
    return count;
  }

  function run() {
    var roots = document.querySelectorAll(ROOT_SEL);
    var notes = document.querySelector('#course-notes');
    if (!roots.length) { return; }
    var t0 = window.performance ? performance.now() : 0;
    var seen = {};   // section key -> { termId: true }
    var n = 0;
    roots.forEach(function (root) {
      n += link(root, seen);
      if (window.glossaryScan) { window.glossaryScan(root); }
    });
    var stamp = notes || roots[0];
    stamp.setAttribute('data-gloss-links', String(n));
    if (window.performance) { stamp.setAttribute('data-gloss-ms', String(Math.round(performance.now() - t0))); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
