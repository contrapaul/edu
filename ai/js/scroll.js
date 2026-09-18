/* ============================================================
   Scroll engine
   ------------------------------------------------------------
   - Reveals: every [data-reveal] element gains .in-view the first
     time it enters the viewport band, then is unobserved. One way,
     on purpose: an element parked at the trigger edge would
     otherwise flicker in and out as the reader scrolls a little.
     Siblings get --i for a CSS stagger.
   - Sections: every [data-section] element dispatches one
     "section:enter" event (bubbling) when 30% of it is visible, so
     a player or interactive inside can start itself.
   No DOM access at import time.
   ============================================================ */

export function staggerIndex(el) {
  const parent = el.parentElement;
  if (!parent) return 0;
  let i = 0;
  for (const child of parent.children) {
    if (child === el) break;
    if (child.hasAttribute('data-reveal')) i += 1;
  }
  return i;
}

export function initReveals(root = document) {
  const els = Array.from(root.querySelectorAll('[data-reveal]'));
  for (const el of els) el.style.setProperty('--i', String(staggerIndex(el)));
  if (!('IntersectionObserver' in window)) {
    for (const el of els) el.classList.add('in-view');
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  for (const el of els) io.observe(el);

  // Whatever is on screen at load is revealed straight away, without
  // waiting for the observer's first callback. Anything else that is
  // still hidden after a moment (an observer that never fires, as in
  // some embedded browsers) is revealed on the next scroll or resize.
  const onScreen = (el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  };
  // A timeout rather than requestAnimationFrame: rAF does not run in a
  // hidden or embedded document, and the first paint must not wait on it.
  setTimeout(() => {
    for (const el of els) if (onScreen(el)) { el.classList.add('in-view'); io.unobserve(el); }
  }, 40);
  const sweep = () => {
    for (const el of els) if (!el.classList.contains('in-view') && onScreen(el)) { el.classList.add('in-view'); io.unobserve(el); }
  };
  window.addEventListener('scroll', sweep, { passive: true });
  window.addEventListener('resize', sweep);
}

export function initSections(root = document) {
  const els = Array.from(root.querySelectorAll('[data-section]'));
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.dispatchEvent(new CustomEvent('section:enter', { bubbles: true }));
      io.unobserve(e.target);
    }
  }, { threshold: 0.3 });
  for (const el of els) io.observe(el);
}

/** Call `cb` once when `el` is at least `ratio` visible. Uses the
 *  observer, with a scroll sweep behind it for documents where the
 *  observer never fires. */
export function whenInView(el, cb, { ratio = 0.35 } = {}) {
  let fired = false;
  const fire = () => { if (fired) return; fired = true; cleanup(); cb(); };
  const visible = () => {
    const r = el.getBoundingClientRect();
    const h = r.height || 1;
    const seen = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    return seen / Math.min(h, window.innerHeight) >= ratio;
  };
  const sweep = () => { if (visible()) fire(); };
  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) fire(); }, { threshold: ratio });
    io.observe(el);
  }
  window.addEventListener('scroll', sweep, { passive: true });
  window.addEventListener('resize', sweep);
  const cleanup = () => {
    if (io) io.disconnect();
    window.removeEventListener('scroll', sweep);
    window.removeEventListener('resize', sweep);
  };
  setTimeout(sweep, 60);
}
