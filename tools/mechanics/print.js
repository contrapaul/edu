/* print.js: builds one A4 side per mechanic from the same data the web
   catalogue uses. Find out more, photo slots and the tag row are dropped
   on purpose, so everything else fits on a single side. */
(function () {
  'use strict';

  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  };

  function sheet(m) {
    var fam = FAMILIES[m.family];
    var dg = m.media.diagram && DIAGRAMS[m.media.diagram] ? DIAGRAMS[m.media.diagram]() : '';

    return '<div class="sheet ' + fam.cls.replace('fam-', 'fam-') + '" data-slug="' + m.slug + '">' +

      '<div class="band">' +
        '<p class="band-fam">' + esc(fam.name) + '</p>' +
        '<h2>' + esc(m.name) + '</h2>' +
        (m.alsoCalled.length ? '<p class="band-aka">Also called: ' + esc(m.alsoCalled.join(', ')) + '</p>' : '') +
      '</div>' +

      '<div class="page">' +
        /* Description first, full width and unheaded, then the diagram. */
        '<div class="lede">' +
          m.whatItIs.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
        '</div>' +
        (dg ? '<div class="dgm">' + dg + '</div>' : '') +
        '<div class="cols">' +
          '<div class="block"><h3>How it works in play</h3><ol class="steps">' +
            m.howItWorks.map(function (st) { return '<li>' + esc(st) + '</li>'; }).join('') +
          '</ol></div>' +
          '<div class="block"><h3>Watch out for</h3><ul class="warn">' +
            m.watchOut.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') +
          '</ul></div>' +
        '</div>' +
        /* Games run across the foot of the page, one row. */
        '<div class="block games"><h3>Games that use it</h3><div class="games-row">' +
          m.games.map(function (g) {
            return '<div class="game"><b>' + esc(g.title) + '</b><span>' + esc(g.note) + '</span></div>';
          }).join('') +
        '</div></div>' +
      '</div>' +

      '<div class="sheet-foot">' +
        '<span><span class="swatch"></span>' + esc(fam.short) + '</span>' +
        '<span>edu.contrapaul.com / tools / mechanics</span>' +
      '</div>' +
    '</div>';
  }

  var host = document.getElementById('sheets');
  host.innerHTML = MECHANICS.map(sheet).join('');

  /* Diagrams are laid out in a narrower column here than on the web, so the
     viewBox still has to be grown to fit anything the browser measures wider. */
  function fitDiagrams() {
    host.querySelectorAll('.dgm svg').forEach(function (svg) {
      var box;
      try { box = svg.getBBox(); } catch (e) { return; }
      if (!box || !box.width) return;
      var vb = svg.viewBox.baseVal;
      var w = Math.max(vb.width, Math.ceil(box.x + box.width) + 2);
      var h = Math.max(vb.height, Math.ceil(box.y + box.height) + 2);
      if (w !== vb.width || h !== vb.height) svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    });
  }

  /* Selector, grouped by family so it reads like the catalogue. */
  var pick = document.getElementById('pick');
  Object.keys(FAMILIES).forEach(function (key) {
    var group = document.createElement('optgroup');
    group.label = FAMILIES[key].name;
    MECHANICS.filter(function (m) { return m.family === key; }).forEach(function (m) {
      var o = document.createElement('option');
      o.value = m.slug;
      o.textContent = m.name;
      group.appendChild(o);
    });
    pick.appendChild(group);
  });

  function show(slug) {
    host.querySelectorAll('.sheet').forEach(function (s) {
      s.classList.toggle('is-current', s.dataset.slug === slug);
    });
    pick.value = slug;
    history.replaceState(null, '', '#' + slug);
    fitDiagrams();
  }

  pick.addEventListener('change', function () { show(pick.value); });

  document.getElementById('one').addEventListener('click', function () {
    document.body.classList.remove('all');
    window.print();
  });

  document.getElementById('all').addEventListener('click', function () {
    if (!confirm('Print all ' + MECHANICS.length + ' sheets? That is ' + MECHANICS.length + ' sides of paper.')) return;
    document.body.classList.add('all');
    fitDiagrams();
    window.print();
  });

  /* Printing all leaves the class on, which would confuse the next print. */
  window.addEventListener('afterprint', function () { document.body.classList.remove('all'); });

  var start = location.hash.slice(1);
  show(MECHANICS.some(function (m) { return m.slug === start; }) ? start : MECHANICS[0].slug);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitDiagrams);
})();
