/* glossary.js — search, topic filter and A–Z rendering for the glossary page. */
(function () {
  'use strict';

  var G = window.DP_GLOSSARY;
  var listEl = document.getElementById('gl-list');
  var searchEl = document.getElementById('gl-search');
  var countEl = document.getElementById('gl-count');
  var topicsEl = document.getElementById('gl-topics');
  var alphaEl = document.getElementById('gl-alpha');
  var clearEl = document.getElementById('gl-clear');

  var active = new Set();
  var query = '';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function mark(text, q) {
    var safe = esc(text);
    if (!q) { return safe; }
    var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
    return safe.replace(re, '<mark class="gl-hit">$1</mark>');
  }

  function letterOf(term) {
    var c = term.charAt(0).toUpperCase();
    return /[A-Z]/.test(c) ? c : '#';
  }

  function matches(t) {
    if (active.size && !t.topics.some(function (x) { return active.has(x[0]); })) { return false; }
    if (!query) { return true; }
    return (t.term + ' ' + t.def).toLowerCase().indexOf(query) !== -1;
  }

  function render() {
    var hits = G.terms.filter(matches);
    countEl.textContent = hits.length + (hits.length === 1 ? ' term' : ' terms');

    if (!hits.length) {
      listEl.innerHTML = '<p class="gl-empty">No terms match that search.</p>';
      renderAlpha({});
      return;
    }

    var groups = {}, order = [];
    hits.forEach(function (t) {
      var L = letterOf(t.term);
      if (!groups[L]) { groups[L] = []; order.push(L); }
      groups[L].push(t);
    });

    listEl.innerHTML = order.map(function (L) {
      return '<h2 class="gl-letter" id="letter-' + L.replace('#', 'num') + '">' + L + '</h2>' +
        '<div class="gl-list">' + groups[L].map(entryHTML).join('') + '</div>';
    }).join('');

    renderAlpha(groups);
  }

  function entryHTML(t) {
    var chips = t.topics.map(function (x) {
      return '<a class="gl-chip" href="../' + x[2] + '" title="' + esc(x[1]) + '">' + x[0] + '</a>';
    }).join('');
    var notes = t.notes.map(function (n) {
      return '<p class="gl-note">' + esc(n) + '</p>';
    }).join('');
    return '<article class="gl-entry" id="' + t.id + '">' +
      '<h3 class="gl-term">' + mark(t.term, query) + '</h3>' +
      '<p class="gl-def">' + mark(t.def, query) + '</p>' +
      notes +
      '<div class="gl-chips">' + chips + '</div>' +
      '</article>';
  }

  function renderAlpha(groups) {
    var letters = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    alphaEl.innerHTML = letters.map(function (L) {
      var id = 'letter-' + L.replace('#', 'num');
      return groups[L]
        ? '<a href="#' + id + '">' + L + '</a>'
        : '<span>' + L + '</span>';
    }).join('');
  }

  /* ---- controls --------------------------------------------------- */

  topicsEl.innerHTML = G.topics.map(function (t) {
    return '<button class="gl-topic" data-code="' + t.code + '" title="' + esc(t.title) + '">' + t.code + '</button>';
  }).join('');

  topicsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.gl-topic');
    if (!btn) { return; }
    var code = btn.dataset.code;
    if (active.has(code)) { active.delete(code); } else { active.add(code); }
    btn.classList.toggle('is-on', active.has(code));
    render();
  });

  var debounce;
  searchEl.addEventListener('input', function () {
    clearTimeout(debounce);
    debounce = setTimeout(function () {
      query = searchEl.value.trim().toLowerCase();
      render();
    }, 120);
  });

  clearEl.addEventListener('click', function () {
    searchEl.value = '';
    query = '';
    active.clear();
    topicsEl.querySelectorAll('.is-on').forEach(function (b) { b.classList.remove('is-on'); });
    render();
    searchEl.focus();
  });

  render();

  /* Deep links (/glossary/#anthropometrics) only resolve once the list exists,
     and have to outlast the browser's own scroll restoration. */
  if (location.hash.length > 1) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) {
      var restore = history.scrollRestoration;
      if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
      requestAnimationFrame(function () {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        if ('scrollRestoration' in history) { history.scrollRestoration = restore; }
      });
    }
  }
})();
