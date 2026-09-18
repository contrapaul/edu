/* ============================================================
   Progress rail: one dot per screen. A dot fills when the screen
   has been seen and turns solid when its activity is done.
   Desktop: a vertical rail on the right. Phone: a bar under the
   header (CSS decides). Tapping a dot scrolls to the screen.
   ============================================================ */

import { load, markSeen } from './progress.js';

export function mountRail(root, screens) {
  const doc = root.ownerDocument;
  root.classList.add('rail');
  root.setAttribute('aria-label', 'Progress through this page');
  const dots = screens.map((screen) => {
    const a = doc.createElement('a');
    a.className = 'rail-dot';
    a.href = '#' + screen.id;
    a.setAttribute('data-screen', screen.id);
    a.style.setProperty('--hue', screen.style.getPropertyValue('--hue'));
    const label = doc.createElement('span');
    label.className = 'rail-label';
    label.textContent = screen.getAttribute('data-title') || screen.id;
    a.appendChild(label);
    root.appendChild(a);
    return a;
  });

  const paint = (p = load()) => {
    dots.forEach((d) => {
      const id = d.getAttribute('data-screen');
      d.classList.toggle('is-seen', !!p.seen[id]);
      d.classList.toggle('is-done', !!p.done[id]);
    });
  };
  document.addEventListener('ai:progress', (e) => paint(e.detail));
  paint();

  // current screen highlight, and "seen" marking
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const id = e.target.id;
        dots.forEach((d) => d.classList.toggle('is-current', d.getAttribute('data-screen') === id));
        markSeen(id);
      }
    }, { threshold: 0.4 });
    screens.forEach((s) => io.observe(s));
  }
  return { paint };
}
