// Email inbox: a running stream of (mostly absurd) office emails. Each phase's
// emails are enqueued once on entry; the HUD shows an unread badge; opening the
// inbox marks everything read.

import { state, save } from '../state.js';

// Enqueue the current phase's emails (deduped by id) into state.inbox.
export function enqueuePhaseEmails(def) {
  const emails = def.phases[state.phase]?.emails;
  if (!emails) return;
  let added = false;
  for (const e of emails) {
    if (!state.inbox.some(x => x.id === e.id)) {
      state.inbox.push({ ...e, read: false });
      added = true;
    }
  }
  if (added) save();
}

export function unreadCount() {
  return state.inbox.filter(e => !e.read).length;
}

// Opens the inbox overlay. Marks all read. Calls onClose() when dismissed.
export function openInbox(onClose) {
  const overlay = document.createElement('div');
  overlay.className = 'pp-overlay';
  overlay.innerHTML = `
    <div class="pp-modal-box inbox-box">
      <header class="pp-modal-head">
        <h2>✉ Inbox</h2>
        <button class="pp-close" aria-label="Close">✕</button>
      </header>
      <div class="inbox-list">
        ${state.inbox.length === 0
          ? '<p class="pp-empty">No mail yet. Enjoy it while it lasts.</p>'
          : [...state.inbox].reverse().map(e => `
            <article class="email${e.read ? '' : ' unread'}">
              <div class="email-head"><span class="email-from">${e.from}</span><span class="email-subj">${e.subject}</span></div>
              <p class="email-body">${e.body}</p>
            </article>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(overlay);

  // Mark read.
  state.inbox.forEach(e => { e.read = true; });
  save();

  const onKey = (e) => { if (e.key === 'Escape') close(); };
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); onClose && onClose(); };
  overlay.querySelector('.pp-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', onKey);
  overlay.querySelector('.pp-close').focus();
}
