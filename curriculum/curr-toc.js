/* curr-toc.js — In-page TOC: scroll highlighting + accordion auto-open on link click
   ──────────────────────────────────────────────────────────────────────────────────
   The TOC is always fully visible — no show/hide based on accordion state.

   Two behaviours:
   1. Highlights the TOC item whose section is currently in view as you scroll.
   2. When a TOC link points to an element inside a closed accordion, clicks
      automatically open every ancestor accordion before scrolling to the target.
   ──────────────────────────────────────────────────────────────────────────────────*/
(function () {
  'use strict';

  // All tracked IDs in document order (deepest item wins when multiple are in view).
  var SECTION_IDS = [
    'introduction',
    'study-guide',
    'obj-1.1.1', 'act-1.1.1-a',
    'obj-1.1.2', 'act-1.1.2-a', 'act-1.1.2-b', 'act-1.1.2-c',
    'obj-1.1.3', 'act-1.1.3-a',
    'obj-1.1.4', 'act-1.1.4-a',
    'obj-1.1.5',
    'quiz',
    'paper2',
    'references'
  ];

  function init() {
    var toc = document.querySelector('.curr-toc');
    if (!toc) return;

    /* ── 1. Auto-open accordions when navigating to a buried anchor ── */
    toc.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href').slice(1);
        var target = document.getElementById(targetId);
        if (!target) return;

        // Walk up the DOM and collect any closed accordion bodies
        var toOpen = [];
        var el = target.parentElement;
        while (el && el !== document.body) {
          if ((el.classList.contains('curr-body') || el.classList.contains('obj-body'))
              && !el.classList.contains('open')) {
            var trigger = document.querySelector('[aria-controls="' + el.id + '"]');
            if (trigger) toOpen.push(trigger);
          }
          el = el.parentElement;
        }

        if (toOpen.length > 0) {
          e.preventDefault();
          // Open outermost accordion first, then inner ones
          toOpen.reverse().forEach(function (t) { t.click(); });
          // Brief delay lets the DOM repaint before scrolling
          setTimeout(function () {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }
        // If nothing is closed, the browser handles the anchor normally
      });
    });

    /* ── 2. Scroll-based active-item highlighting ── */
    function isReachable(el) {
      // Elements inside a closed accordion (display:none) have offsetParent === null.
      // Top-level .curr-section elements are always in the normal flow.
      if (el.classList.contains('curr-section')) return true;
      return el.offsetParent !== null;
    }

    function getActiveId() {
      var OFFSET = 90; // px — how far below viewport top counts as "entered"
      var scrollY = window.scrollY + OFFSET;
      for (var i = SECTION_IDS.length - 1; i >= 0; i--) {
        var id = SECTION_IDS[i];
        var el = document.getElementById(id);
        if (!el || !isReachable(el)) continue;
        var elTop = el.getBoundingClientRect().top + window.scrollY;
        if (elTop <= scrollY) return id;
      }
      return null;
    }

    function updateActive() {
      var id = getActiveId();
      toc.querySelectorAll('li').forEach(function (li) { li.classList.remove('active'); });
      if (!id) return;
      var item = toc.querySelector('[data-section="' + id + '"]');
      if (item) item.classList.add('active');
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () { updateActive(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });

    updateActive(); // set highlight on first paint
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
