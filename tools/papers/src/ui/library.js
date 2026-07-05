// Regulatory Library: a reference of every standard the player has encountered.
// Populated from state.unlockedRegulations; entries come from content/regulations.js.

import { state } from '../state.js';
import { getRegulation } from '../content/regulations.js';

export function unlockedCount() {
  return state.unlockedRegulations.length;
}

export function openLibrary(onClose) {
  const entries = state.unlockedRegulations
    .map(getRegulation)
    .filter(Boolean);

  const overlay = document.createElement('div');
  overlay.className = 'pp-overlay';
  overlay.innerHTML = `
    <div class="pp-modal-box library-box">
      <header class="pp-modal-head">
        <h2>📋 Regulatory Library</h2>
        <button class="pp-close" aria-label="Close">✕</button>
      </header>
      <p class="library-sub">Standards you've encountered so far. They'll keep accumulating as you play.</p>
      <div class="library-list">
        ${entries.length === 0
          ? '<p class="pp-empty">Nothing unlocked yet. Pick some target markets in the brief.</p>'
          : entries.map(r => `
            <article class="reg">
              <div class="reg-head">
                <span class="reg-title">${r.title}</span>
                <span class="reg-market">${r.market}</span>
              </div>
              <span class="reg-number">${r.number}</span>
              <p class="reg-plain">${r.plain}</p>
              ${r.realWorld ? `<p class="reg-real"><b>🌍 Real world:</b> ${r.realWorld}</p>` : ''}
            </article>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const onKey = (e) => { if (e.key === 'Escape') close(); };
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); onClose && onClose(); };
  overlay.querySelector('.pp-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', onKey);
  overlay.querySelector('.pp-close').focus();
}
