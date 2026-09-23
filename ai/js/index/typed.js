/* ============================================================
   Typed text: an element's text appears one character at a
   time with a cursor, the way the transcript player writes.
   Fires "typed:done" on the element when finished. Under reduced
   motion the text is simply shown.
   ============================================================ */

export function typeInto(el, { cps = 22, delay = 250, reducedMotion = false } = {}) {
  const full = el.getAttribute('data-typed') || el.textContent;
  el.setAttribute('data-typed', full);
  const done = () => el.dispatchEvent(new CustomEvent('typed:done', { bubbles: true }));
  if (reducedMotion) { el.textContent = full; done(); return; }

  el.textContent = '';
  const text = document.createTextNode('');
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  el.append(text, cursor);
  el.setAttribute('aria-label', full);

  let start = null;
  let shown = 0;
  const tick = (t) => {
    if (start === null) start = t + delay;
    const target = Math.min(full.length, Math.floor(Math.max(0, t - start) / 1000 * cps));
    if (target !== shown) { shown = target; text.nodeValue = full.slice(0, shown); }
    if (shown < full.length) requestAnimationFrame(tick);
    else setTimeout(() => { cursor.remove(); done(); }, 700);
  };
  requestAnimationFrame(tick);
}
