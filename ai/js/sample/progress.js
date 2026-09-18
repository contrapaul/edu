/* ============================================================
   Progress: what the reader has seen and done on this page.
   One localStorage key, "ai-progress". Pure helpers are exported
   for tests; the store functions guard against storage failing.
   ============================================================ */

export const KEY = 'ai-progress';

export function emptyProgress() { return { seen: {}, done: {}, answers: {} }; }

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    const p = raw ? JSON.parse(raw) : null;
    return p && typeof p === 'object' ? { ...emptyProgress(), ...p } : emptyProgress();
  } catch { return emptyProgress(); }
}

function save(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* private mode */ }
  document.dispatchEvent(new CustomEvent('ai:progress', { detail: p }));
}

export function markSeen(id) {
  const p = load();
  if (p.seen[id]) return p;
  p.seen[id] = Date.now();
  save(p);
  return p;
}

export function markDone(id, answer) {
  const p = load();
  p.done[id] = Date.now();
  if (answer !== undefined) p.answers[id] = answer;
  save(p);
  return p;
}

/** Record an answer without marking anything done. */
export function setAnswer(key, value) {
  const p = load();
  p.answers[key] = value;
  save(p);
  return p;
}

export function reset() { save(emptyProgress()); }

/** Pure: how many of `ids` are seen and done. */
export function tally(p, ids) {
  return {
    seen: ids.filter((id) => p.seen[id]).length,
    done: ids.filter((id) => p.done[id]).length,
    total: ids.length,
  };
}
