/* curr-toc.js — In-page TOC: scroll tracking, accordion sync, 3-level nesting
   ──────────────────────────────────────────────────────────────────────────
   Level 1 — top-level curr-sections  (Introduction, Study Guide, Quiz…)
   Level 2 — obj-sections             (1.1.1, 1.1.2 … shown when Study Guide open)
   Level 3 — activity blocks          (shown when the parent obj-section is open)
   ──────────────────────────────────────────────────────────────────────────*/
(function () {
  'use strict';

  // Full ordered list of tracked IDs — determines which item is "active" on scroll.
  // Order matters: we walk backwards to find the deepest section above the scroll offset.
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

    /* ── Level 2: show/hide obj sub-list with Study Guide accordion ── */
    var tocSub = document.getElementById('toc-sub-study');
    var studySection = document.getElementById('study-guide');

    function syncStudySub() {
      if (!tocSub || !studySection) return;
      var trigger = studySection.querySelector('.curr-trigger');
      var isOpen = trigger && trigger.getAttribute('aria-expanded') === 'true';
      tocSub.classList.toggle('open', isOpen);
    }

    if (studySection) {
      var studyTrigger = studySection.querySelector('.curr-trigger');
      if (studyTrigger) {
        studyTrigger.addEventListener('click', function () {
          requestAnimationFrame(syncStudySub);
        });
      }
    }

    /* ── Level 3: show/hide activity lists with each obj-section accordion ── */
    document.querySelectorAll('.obj-section[id]').forEach(function (section) {
      var objId = section.id; // e.g. "obj-1.1.2"
      // The activity list for this obj is the .curr-toc-acts inside the matching TOC item
      var tocItem = toc.querySelector('[data-section="' + objId + '"]');
      if (!tocItem) return;
      var actsEl = tocItem.querySelector('.curr-toc-acts');
      if (!actsEl) return;

      var trigger = section.querySelector('.obj-trigger');
      if (!trigger) return;

      function syncActs() {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        actsEl.classList.toggle('open', isOpen);
      }

      trigger.addEventListener('click', function () {
        requestAnimationFrame(syncActs);
      });

      syncActs(); // apply initial state
    });

    /* ── Active-item scroll tracking ── */
    function isVisible(el) {
      // Elements inside a closed accordion (display:none) have offsetParent === null.
      // Top-level .curr-section elements are always in flow even when their body is closed.
      if (el.classList.contains('curr-section')) return true;
      return el.offsetParent !== null;
    }

    function getActiveId() {
      var OFFSET = 90; // px below top of viewport to treat as "entered"
      var scrollY = window.scrollY + OFFSET;
      for (var i = SECTION_IDS.length - 1; i >= 0; i--) {
        var id = SECTION_IDS[i];
        var el = document.getElementById(id);
        if (!el || !isVisible(el)) continue;
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

    // Initial state
    syncStudySub();
    updateActive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
