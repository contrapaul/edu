// Character select screen: three desks. Picking one starts a new game.

import { CHARACTERS } from '../content/characters.js';
import { newGame } from '../state.js';

const stars = (n) => '★★★'.slice(0, n).padEnd(3, '☆');
const money = (n) => '$' + n.toLocaleString('en-US');

function deskHTML(c) {
  const products = c.products.map(p => `<li>${p}</li>`).join('');
  const staff = c.staff.map(s => `<li><b>${s.name}</b> · ${s.role}</li>`).join('');
  return `
    <article class="desk" style="--desk-accent:${c.accent}">
      <div class="desk-portrait" aria-hidden="true">${c.name.split(' ').map(w => w[0]).join('')}</div>
      <h2 class="desk-name">${c.name}</h2>
      <p class="desk-company">${c.company}</p>
      <p class="desk-tagline">${c.tagline}</p>
      <p class="desk-blurb">${c.blurb}</p>

      <div class="desk-section">
        <span class="desk-label">Product Line</span>
        <ul class="desk-list">${products}</ul>
      </div>
      <div class="desk-section">
        <span class="desk-label">Your Team</span>
        <ul class="desk-list desk-staff">${staff}</ul>
      </div>

      <div class="desk-meta">
        <span title="Difficulty">${stars(c.difficulty)}</span>
        <span title="Starting budget">${money(c.startBudget)}</span>
      </div>
      <button class="desk-select" data-char="${c.id}">Select ${c.name.split(' ')[0]}</button>
    </article>`;
}

// Renders into `root`. Calls onSelect(characterId) after newGame() is set up.
export function renderCharSelect(root, onSelect) {
  root.innerHTML = `
    <div class="screen charselect">
      <header class="cs-header">
        <h1>Regulatory Papers, Please</h1>
        <p class="cs-sub">Choose your company &amp; product line</p>
      </header>
      <div class="desks">
        ${CHARACTERS.map(deskHTML).join('')}
      </div>
      <p class="cs-foot">A design-technology game about getting real products past real regulators.</p>
    </div>`;

  root.querySelectorAll('.desk-select').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.char;
      newGame(id);
      onSelect(id);
    });
  });
}
