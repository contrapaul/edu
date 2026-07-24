/* diagram-utils.js — tiny shared helper for the Phase 5 interactive-diagram
   widgets (B2.2.4, A3.2.7, B3.2.4). Each of these draws its own bespoke SVG
   with real (if simplified) physics behind it, so there's no shared engine
   the way the drag-sort/live-calc widgets have — this only factors out the
   one piece of boilerplate all three genuinely share: converting a click's
   screen coordinates into the SVG's own viewBox coordinate space. */
window.DiagramUtils = (function () {
  'use strict';

  function svgPoint(svg, evt) {
    var pt = svg.createSVGPoint();
    var clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    var clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  return { svgPoint: svgPoint, clamp: clamp };
})();
