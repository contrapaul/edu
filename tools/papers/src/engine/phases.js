// Generic six-phase controller + persistent HUD.
// The engine never hardcodes a product: it reads the product definition and
// mounts the UI module registered for the current phase.

import { state, PHASES, initProduct, nextPhase, save } from '../state.js';
import { getCharacter } from '../content/characters.js';
import { getProductDef } from '../content/products/index.js';
import { renderBrief } from '../ui/brief.js';
import { renderDesign } from '../ui/design.js';
import { renderTesting } from '../ui/testing.js';
import { renderCertification } from '../ui/certification.js';
import { renderProduction } from '../ui/production.js';
import { renderMarketing } from '../ui/marketing.js';
import { renderLaunch } from '../ui/launch.js';
import { enqueuePhaseEmails, unreadCount, openInbox } from '../ui/inbox.js';
import { unlockedCount, openLibrary } from '../ui/library.js';
import { openSandbox } from '../ui/sandbox.js';

const PHASE_LABELS = {
  brief: 'Brief', design: 'Design', testing: 'Testing',
  certification: 'Certify', production: 'Produce', marketing: 'Market', launch: 'Launch'
};

// Phase id -> mount function. Phases not yet built fall back to a stub.
const PHASE_MODULES = {
  brief: renderBrief,
  design: renderDesign,
  testing: renderTesting,
  certification: renderCertification,
  production: renderProduction,
  marketing: renderMarketing,
  launch: renderLaunch
};

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

function hudHTML(character, def) {
  const stepper = PHASES.map(p => {
    const cur = p === state.phase ? ' cur' : '';
    const done = PHASES.indexOf(p) < PHASES.indexOf(state.phase) ? ' done' : '';
    return `<li class="step${cur}${done}"><span class="step-dot"></span>${PHASE_LABELS[p]}</li>`;
  }).join('');

  const morale = character.staff.map(s => {
    const m = state.staffMorale[s.id] ?? 50;
    const perk = s.translator ? ' A happy specialist translates regulatory letters for free.' : '';
    return `<li class="staff-row" title="${s.name}'s morale: ${m}%. It shifts when you lock in cheap vs. premium sourcing.${perk}">
      <span class="staff-name">${s.name}</span>
      <span class="staff-role">${s.role}</span>
      <span class="morale-bar"><span class="morale-fill" style="width:${m}%"></span></span>
    </li>`;
  }).join('');

  return `
    <header class="hud-top">
      <div class="hud-co">
        <strong>${character.company}</strong>
        <span class="hud-product">${state.product?.name ?? def.name}</span>
      </div>
      <ol class="stepper">${stepper}</ol>
      <div class="hud-tools">
        <button class="hud-tool" data-tool="library" title="Regulatory Library" aria-label="Regulatory Library, ${unlockedCount()} unlocked"><span aria-hidden="true">📋</span><span class="hud-badge">${unlockedCount()}</span></button>
        <button class="hud-tool" data-tool="inbox" title="Inbox" aria-label="Inbox, ${unreadCount()} unread"><span aria-hidden="true">✉</span>${unreadCount() ? `<span class="hud-badge unread">${unreadCount()}</span>` : ''}</button>
        <button class="hud-tool" data-tool="sandbox" title="Operations (sandbox)" aria-label="Operations panel"><span aria-hidden="true">🌐</span>${state.worldEvents.length ? `<span class="hud-badge unread">!</span>` : ''}</button>
      </div>
      <div class="hud-budget">
        <span class="hud-budget-n">${money(state.budget)}</span>
        <span class="hud-budget-l">Cash</span>
      </div>
      ${state.product?.unitCost > 0 ? `<div class="hud-unitcost" title="Bill-of-materials cost per device, from your component choices.">
        <span class="hud-unitcost-n">$${state.product.unitCost.toFixed(2)}</span>
        <span class="hud-unitcost-l">/ device</span>
      </div>` : ''}
    </header>
    <aside class="hud-side">
      <section class="staff-panel" title="Team morale. Locking in cheap parts pleases your pragmatist and worries your compliance lead (and vice-versa). A happy translator handles regulatory letters for free.">
        <h3>Team morale</h3>
        <ul class="staff-list">${morale}</ul>
      </section>
      <section class="competitor" title="Every phase you spend lets GloboCorp catch up. If they reach market first you lose sales — keep delays (corrections, slow factories, re-tests) down.">
        <h3>GloboCorp${state.competitorProgress >= 70 ? ' ⚠' : ''}</h3>
        <div class="comp-bar"><span class="comp-fill" style="width:${state.competitorProgress}%"></span></div>
        <p class="comp-note">${state.competitorProgress >= 70 ? 'Closing in — they may beat you to market!' : 'Rival racing you to market'}</p>
      </section>
    </aside>`;
}

export function renderGame(root, onQuit) {
  const character = getCharacter(state.character);
  const def = getProductDef(state.character, state.productIndex);

  if (!def) {
    root.innerHTML = `<div class="screen placeholder">
      <h1>${character.company}</h1>
      <p class="ph-note">No more products built for this company yet (coming in Chunk 8).</p>
      <button class="title-btn" data-action="quit">← Back to title</button>
    </div>`;
    root.querySelector('[data-action="quit"]').addEventListener('click', onQuit);
    return;
  }

  initProduct(def);

  function paint() {
    enqueuePhaseEmails(def);

    root.innerHTML = `
      <div class="game">
        ${hudHTML(character, def)}
        <main class="phase-content" id="phase-content"></main>
      </div>`;

    const container = root.querySelector('#phase-content');
    const ctx = {
      def, character,
      refreshHud: () => repaintHud(root, character, def, paint),
      advance: () => {
        // Time passes each phase, so the rival closes in — this is the baseline
        // pressure; corrections, slow factories and re-tests add to it.
        if (state.phase !== 'launch') state.competitorProgress = Math.min(100, state.competitorProgress + 8);
        nextPhase();
        paint();
      },
      hasNextProduct: !!getProductDef(state.character, state.productIndex + 1),
      completeProduct: () => {
        const profit = state.product?.launch?.sales?.profit ?? 0;
        const nextDef = getProductDef(state.character, state.productIndex + 1);
        if (!nextDef) return;
        // Carry reputation + morale; reinvest a slice of profit into the next budget.
        const reinvest = Math.min(50000, Math.max(0, Math.round(profit * 0.1)));
        state.productIndex += 1;
        state.phase = 'brief';
        state.product = null;
        state.budget = nextDef.startBudget + reinvest;
        state.competitorProgress = 0;   // a fresh competitor for the new product
        save();
        renderGame(root, onQuit);   // re-enter with the new product
      },
      quit: onQuit
    };

    bindTools(root, character, def, paint);

    const mount = PHASE_MODULES[state.phase];
    if (mount) {
      mount(container, ctx);
    } else {
      stubPhase(container, ctx);
    }
  }

  paint();
}

// Repaint just the HUD chrome (budget / morale / badges) without rebuilding the
// phase body, then re-bind the toolbar buttons on the new nodes. `rerender` is
// the full-phase repaint, threaded through so the sandbox can apply changes that
// affect phase content (e.g. costs).
function repaintHud(root, character, def, rerender) {
  const game = root.querySelector('.game');
  if (!game) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = hudHTML(character, def);
  game.querySelector('.hud-top').replaceWith(tmp.querySelector('.hud-top'));
  game.querySelector('.hud-side').replaceWith(tmp.querySelector('.hud-side'));
  bindTools(root, character, def, rerender);
}

// Wire the toolbar buttons. Re-bound after every HUD repaint.
function bindTools(root, character, def, rerender) {
  const lib = root.querySelector('[data-tool="library"]');
  const inbox = root.querySelector('[data-tool="inbox"]');
  const sandbox = root.querySelector('[data-tool="sandbox"]');
  const hudRefresh = () => repaintHud(root, character, def, rerender);
  if (lib) lib.addEventListener('click', () => openLibrary(hudRefresh));
  if (inbox) inbox.addEventListener('click', () => openInbox(hudRefresh));
  // Sandbox changes can alter phase costs, so closing it re-renders the phase.
  if (sandbox) sandbox.addEventListener('click', () => openSandbox({ def, refreshHud: hudRefresh }, rerender));
}

// Fallback for phases not yet implemented — keeps navigation working.
function stubPhase(container, ctx) {
  container.innerHTML = `
    <div class="phase-stub">
      <h2>${PHASE_LABELS[state.phase]} phase</h2>
      <p>This phase arrives in a later chunk. The loop still advances so you can walk the whole structure.</p>
      <div class="phase-actions">
        <button class="btn-secondary" data-action="quit">Save &amp; quit</button>
        ${state.phase === 'launch'
          ? '<button class="btn-primary" data-action="quit">Finish</button>'
          : '<button class="btn-primary" data-action="advance">Continue →</button>'}
      </div>
    </div>`;
  container.querySelector('[data-action="quit"]').addEventListener('click', () => { save(); ctx.quit(); });
  const adv = container.querySelector('[data-action="advance"]');
  if (adv) adv.addEventListener('click', ctx.advance);
}
