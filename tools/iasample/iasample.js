/* Sample IA: horizontal page track, quick links, and a fit-to-viewport zoom. */
(function () {
  'use strict';

  var scroller = document.getElementById('scroller');
  var track = document.getElementById('track');
  var pages = Array.prototype.slice.call(track.querySelectorAll('.ia-page'));
  var links = Array.prototype.slice.call(document.querySelectorAll('.ql'));
  var counter = document.getElementById('counter');
  var notesToggle = document.getElementById('notesToggle');
  var prevBtn = document.getElementById('prevPage');
  var nextBtn = document.getElementById('nextPage');

  var PAGE_H = 1123;
  var current = 0;

  /* ── Fit a whole A4 page into the space below the toolbar ─────── */
  function fit() {
    var available = scroller.clientHeight - 44; /* the track's vertical padding */
    var z = Math.min(1, available / PAGE_H);
    track.style.zoom = z > 0 ? z : 1;
  }

  /* ── Which page is nearest the centre of the viewport ─────────── */
  /* Measured from rectangles only. The track carries a zoom factor, so
     mixing scrollLeft with layout offsets would drift as pages go by. */
  function activePage() {
    var view = scroller.getBoundingClientRect();
    var centre = view.width / 2;
    var best = 0, bestGap = Infinity;
    for (var i = 0; i < pages.length; i++) {
      var box = pages[i].getBoundingClientRect();
      var gap = Math.abs(box.left + box.width / 2 - view.left - centre);
      if (gap < bestGap) { bestGap = gap; best = i; }
    }
    return best;
  }

  function syncUI() {
    var i = activePage();
    if (i === current && counter.dataset.set) return;
    current = i;

    var page = pages[i];
    counter.textContent = 'Page ' + page.dataset.page + ' / ' + pages.length;
    counter.dataset.set = '1';

    var strand = page.dataset.strand;
    for (var j = 0; j < links.length; j++) {
      var on = links[j].dataset.strand === strand;
      links[j].classList.toggle('is-active', on);
      if (on) keepChipVisible(links[j]);
    }
  }

  /* Nudge the quick link strip, without touching the page track. */
  function keepChipVisible(chip) {
    var strip = chip.parentNode;
    var left = chip.offsetLeft;
    var right = left + chip.offsetWidth;
    if (left < strip.scrollLeft) strip.scrollLeft = left - 12;
    else if (right > strip.scrollLeft + strip.clientWidth) {
      strip.scrollLeft = right - strip.clientWidth + 12;
    }
  }

  function goTo(index, smooth) {
    var i = Math.max(0, Math.min(pages.length - 1, index));
    pages[i].scrollIntoView({
      behavior: smooth === false ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }

  /* ── Wiring ───────────────────────────────────────────────────── */
  var ticking = false;
  scroller.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { syncUI(); ticking = false; });
  }, { passive: true });

  window.addEventListener('resize', function () {
    fit();
    goTo(current, false);
  });

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var first = track.querySelector('[data-strand="' + link.dataset.strand + '"]');
      /* Jumping across the whole report animates for several seconds, so a
         quick link lands on its page at once and only stepping is smooth. */
      if (first) goTo(pages.indexOf(first), false);
    });
  });

  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });

  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); goTo(current + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goTo(current - 1); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(pages.length - 1); }
  });

  /* A trackpad's vertical wheel should move sideways through the pages. */
  scroller.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    scroller.scrollLeft += e.deltaY;
  }, { passive: false });

  notesToggle.addEventListener('click', function () {
    var on = document.body.classList.toggle('show-notes');
    notesToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  fit();
  syncUI();
})();
