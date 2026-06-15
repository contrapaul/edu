// Boot + routing. Chunk 1: title -> character select -> placeholder phase screen.
// Later chunks replace renderPhasePlaceholder with the real phase engine.

import { load, clearSave } from './state.js';
import { getCharacter } from './content/characters.js';
import { renderCharSelect } from './ui/charselect.js';
import { renderGame } from './engine/phases.js';

const root = document.getElementById('app');

function go(scene) {
  if (scene === 'title') return renderTitle();
  if (scene === 'charselect') return renderCharSelect(root, () => go('game'));
  if (scene === 'game') return renderGame(root, () => go('title'));
}

function renderTitle() {
  const saved = load();
  const continueBtn = saved
    ? `<button class="title-btn" data-action="continue">Continue — ${getCharacter(saved.character).company}</button>`
    : '';
  root.innerHTML = `
    <div class="screen title">
      <div class="stamp" aria-hidden="true">APPROVED</div>
      <h1>Regulatory<br>Papers, Please</h1>
      <p class="title-sub">Design a product. Survive the paperwork.</p>
      <div class="title-actions">
        ${continueBtn}
        <button class="title-btn" data-action="new">New Company</button>
      </div>
      <p class="title-foot">A Design Technology game · contrapaul.edu</p>
    </div>`;

  root.querySelector('[data-action="new"]').addEventListener('click', () => {
    if (load()) clearSave();
    go('charselect');
  });
  const cont = root.querySelector('[data-action="continue"]');
  if (cont) cont.addEventListener('click', () => go('game'));
}

go('title');
