/* ============================================================
   Learn mode and teacher mode, via [data-mode] on <html>.
   Learn is the default and the whole site. Teacher mode makes
   type larger and (later) turns activities into something a
   teacher can drive from the front of a room. Stored in
   localStorage("ai-mode").
   ============================================================ */

export const MODE_KEY = 'ai-mode';

function read() { try { return localStorage.getItem(MODE_KEY); } catch { return null; } }
function write(v) { try { localStorage.setItem(MODE_KEY, v); } catch { /* private mode */ } }

export function currentMode() {
  return document.documentElement.getAttribute('data-mode') === 'teacher' ? 'teacher' : 'learn';
}

export function setMode(mode) {
  document.documentElement.setAttribute('data-mode', mode);
  write(mode);
  document.dispatchEvent(new CustomEvent('ai:mode', { detail: { mode } }));
}

export function initMode() {
  if (read() === 'teacher') document.documentElement.setAttribute('data-mode', 'teacher');
}

export function bindModeToggle(btn) {
  if (!btn) return;
  const sync = () => btn.setAttribute('aria-pressed', String(currentMode() === 'teacher'));
  btn.addEventListener('click', () => setMode(currentMode() === 'teacher' ? 'learn' : 'teacher'));
  document.addEventListener('ai:mode', sync);
  sync();
}
