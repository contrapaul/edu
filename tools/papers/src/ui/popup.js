// Generic docked-portrait speech-bubble popup.
//
// This is the seam the student illustrator's art plugs into: `.popup-portrait`
// is a plain colored circle with an initial today, but it's the one place a
// character "pops up" to say something, so swapping in real portraits later
// is a CSS/asset change, not a UI rewrite. Reused by the notification system
// (engine/notify.js) for partner offers, fan requests, and shady asks.
//
// Every popup requires picking a choice to close — there's always a free
// "decline" option in the data, so this never traps the player, but it also
// never reads as a dismissible toast.

export function showPopup({ name, role, accent, text, choices }) {
  const overlay = document.createElement('div');
  overlay.className = 'pp-overlay popup-overlay';
  const initial = (name || '?').trim().charAt(0).toUpperCase();

  overlay.innerHTML = `
    <div class="popup-card">
      <div class="popup-portrait" style="${accent ? `--pc-accent:${accent}` : ''}"><span>${initial}</span></div>
      <div class="popup-bubble">
        <div class="popup-head"><b>${name}</b>${role ? `<span>${role}</span>` : ''}</div>
        <p class="popup-text">${text}</p>
        <div class="popup-choices">
          ${choices.map((c, i) => `
            <button class="popup-choice" data-i="${i}">
              <span class="popup-choice-label">${c.label}</span>
              ${c.hint ? `<span class="popup-choice-hint">${c.hint}</span>` : ''}
            </button>`).join('')}
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  overlay.querySelectorAll('.popup-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = choices[Number(btn.dataset.i)];
      overlay.remove();
      choice.onSelect && choice.onSelect();
    });
  });

  const firstChoice = overlay.querySelector('.popup-choice');
  if (firstChoice) firstChoice.focus();
}
