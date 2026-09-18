/* ============================================================
   Colour: each screen owns a hue (--hue on the section). As the
   reader scrolls, the page's own hue (--page-hue on <html>) moves
   from one screen's hue to the next, so the background washes
   rather than jumps. Each screen's stripe (the skewed band at
   its top) drifts a little with scroll for depth.
   Needs window.gsap and window.ScrollTrigger (vendored).
   ============================================================ */

/** Pure: interpolate between hues along the short way round. */
export function mixHue(a, b, t) {
  let d = ((b - a + 540) % 360) - 180;
  return (a + d * t + 360) % 360;
}

export function initColour(screens, { reducedMotion = false } = {}) {
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  const root = document.documentElement;
  const hues = screens.map((s) => Number(s.style.getPropertyValue('--hue')) || 0);
  root.style.setProperty('--page-hue', String(hues[0]));

  if (!gsap || !ST) return;
  gsap.registerPlugin(ST);

  screens.forEach((screen, i) => {
    if (i === 0) return;
    const from = hues[i - 1];
    const to = hues[i];
    ST.create({
      trigger: screen,
      start: 'top 85%',
      end: 'top 25%',
      scrub: reducedMotion ? false : 0.4,
      onUpdate: (self) => root.style.setProperty('--page-hue', mixHue(from, to, self.progress).toFixed(1)),
      onLeaveBack: () => root.style.setProperty('--page-hue', String(from)),
      onLeave: () => root.style.setProperty('--page-hue', String(to)),
    });
  });

  if (reducedMotion) return;
  for (const screen of screens) {
    const stripe = screen.querySelector('.stripe');
    if (!stripe) continue;
    gsap.fromTo(stripe, { yPercent: 25 }, {
      yPercent: -25,
      ease: 'none',
      scrollTrigger: { trigger: screen, start: 'top bottom', end: 'top 20%', scrub: 0.6 },
    });
  }
}
