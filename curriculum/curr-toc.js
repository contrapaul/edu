/* curr-toc.js — In-page TOC scroll tracking & accordion sync
   ─────────────────────────────────────────────────────────────
   • Highlights the current section in the TOC as user scrolls
   • Shows/hides sub-items for obj-sections (1.1.1–1.1.5) when
     the Study Guide accordion is open or closed
   ─────────────────────────────────────────────────────────────*/
(function () {
  'use strict';

  // Ordered list of all tracked section IDs (top-level first)
  var SECTION_IDS = [
    'introduction',
    'study-guide',
    'obj-1.1.1',
    'obj-1.1.2',
    'obj-1.1.3',
    'obj-1.1.4',
    'obj-1.1.5',
    'quiz',
    'paper2',
    'references'
  ];

  function init() {
    var toc = document.querySelector('.curr-toc');
    if (!toc) return;

    var tocSub = document.getElementById('toc-sub-study');
    var studySection = document.getElementById('study-guide');

    /* ── Sync sub-list with Study Guide accordion ── */
    function syncSub() {
      if (!tocSub || !studySection) return;
      var trigger = studySection.querySelector('.curr-trigger');
      var isOpen = trigger && trigger.getAttribute('aria-expanded') === 'true';
      tocSub.classList.toggle('open', isOpen);
    }

    if (studySection) {
      var studyTrigger = studySection.querySelector('.curr-trigger');
      if (studyTrigger) {
        studyTrigger.addEventListener('click', function () {
          requestAnimationFrame(syncSub);
        });
      }
    }

    /* ── Active section tracking via scroll ── */
    function getActiveId() {
      var OFFSET = 80; // px — how far below the top of viewport counts as "active"
      var scrollY = window.scrollY + OFFSET;
      var best = null;

      for (var i = SECTION_IDS.length - 1; i >= 0; i--) {
        var id = SECTION_IDS[i];
        var el = document.getElementById(id);
        if (!el) continue;

        // Skip elements hidden inside a closed accordion body
        // (display:none elements have offsetParent === null)
        var parent = el.offsetParent;
        if (parent === null && el.tagName !== 'MAIN' && !el.classList.contains('curr-section')) continue;

        var rect = el.getBoundingClientRect();
        var elTop = rect.top + window.scrollY;
        if (elTop <= scrollY) {
          best = id;
          break;
        }
      }
      return best;
    }

    function updateActive() {
      var id = getActiveId();
      // Clear all
      toc.querySelectorAll('li').forEach(function (li) {
        li.classList.remove('active');
      });
      if (!id) return;
      var item = toc.querySelector('[data-section="' + id + '"]');
      if (item) item.classList.add('active');
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateActive();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial state
    syncSub();
    updateActive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
