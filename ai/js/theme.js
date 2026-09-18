/* ============================================================
   Theme: light or dark via [data-theme] on <html>.
   The default follows the system. A manual choice is stored in
   localStorage("ai-theme"). The pre-paint snippet in each page's
   <head> mirrors resolveTheme() so there is no flash on load.
   ============================================================ */

export const THEME_KEY = 'ai-theme';

export function resolveTheme({ stored = null, system = 'light' } = {}) {
  if (stored === 'light' || stored === 'dark') return stored;
  return system === 'dark' ? 'dark' : 'light';
}

function read() { try { return localStorage.getItem(THEME_KEY); } catch { return null; } }
function write(v) { try { localStorage.setItem(THEME_KEY, v); } catch { /* private mode */ } }

export function currentTheme() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr) return attr;
  return resolveTheme({ stored: read(), system: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' });
}

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  write(theme);
  document.dispatchEvent(new CustomEvent('ai:theme', { detail: { theme } }));
}

/** Wire a button: click toggles, label and aria-pressed follow the state. */
export function bindThemeToggle(btn) {
  if (!btn) return;
  const sync = () => {
    const dark = currentTheme() === 'dark';
    btn.setAttribute('aria-pressed', String(dark));
    const label = btn.querySelector('.tool-label');
    if (label) label.textContent = dark ? 'Dark' : 'Light';
  };
  btn.addEventListener('click', () => setTheme(currentTheme() === 'dark' ? 'light' : 'dark'));
  document.addEventListener('ai:theme', sync);
  sync();
}
