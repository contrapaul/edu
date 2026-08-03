/* c2.2.js: widget JS for C2.2 Design for a Circular Economy.
   Case-study modals and the .case-photo lightbox are handled globally
   by curriculum.js, so this file only covers the C2.2.1 orbit diagram. */

/* ── CIRCULAR ECONOMY ORBIT: side detail panel (2.2.1) ───────────────
   Each .ce-node sits inside two nested, continuously-rotating
   transforms (the orbit spin and its own counter-spin to stay
   upright). Those transforms each create their own CSS stacking
   context, and .obj-body/.curr-body need overflow-x:auto for wide
   content elsewhere on these pages, which the CSS overflow spec
   quietly turns into an effective overflow-y:auto too. Together
   that meant a tooltip nested inside the rotating nodes could get
   clipped by an ancestor's box or painted behind later content,
   depending on exactly where in the loop a node happened to be.
   Showing the detail in one static panel beside the ring, instead
   of floating a tooltip off each moving node, sidesteps both
   problems entirely: the panel isn't a descendant of anything that
   rotates or clips, so it can never end up behind or cut off. ──── */
(function () {
  'use strict';
  var nodes = document.querySelectorAll('.ce-node');
  var detail = document.getElementById('ce-detail');
  if (!nodes.length || !detail) return;

  var placeholder = detail.querySelector('.ce-detail-placeholder');
  var body = detail.querySelector('.ce-detail-body');
  var titleEl = detail.querySelector('.ce-detail-title');
  var textEl = detail.querySelector('.ce-detail-text');
  var active = null;

  function show(node) {
    if (active) active.classList.remove('is-active');
    active = node;
    node.classList.add('is-active');
    titleEl.textContent = node.dataset.title;
    textEl.textContent = node.dataset.desc;
    placeholder.hidden = true;
    body.hidden = false;
  }

  nodes.forEach(function (node) {
    node.addEventListener('mouseenter', function () { show(node); });
    node.addEventListener('focus', function () { show(node); });
    node.addEventListener('click', function () { show(node); });
    node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(node);
      }
    });
  });
})();
