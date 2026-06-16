// Generic six-phase controller + persistent HUD.
// The engine never hardcodes a product: it reads the product definition and
// mounts the UI module registered for the current phase.

import { state, PHASES, initProduct, nextPhase, setPhase, save } from '../state.js';
import { getCharacter } from '../content/characters.js';
import { getProductDef } from '../content/products/index.js';
import { renderBrief } from '../ui/brief.js';
import { renderDesign } from '../ui/design.js';
import { renderTesting } from '../ui/testing.js';
import { renderCertification } from '../ui/certification.js';
import { renderProduction } from '../ui/production.js';
import { renderMarketing } from '../ui/marketing.js';
import { renderLaunch } from '../ui/launch.js';
import { advanceTime } from './events.js';
import { enqueuePhaseEmails, unreadCount, openInbox } from '../ui/inbox.js';
import { unlockedCount, openLibrary } from '../ui/library.js';
import { openPortfolio, activeMarketCount } from '../ui/portfolio.js';
import { openFinances } from '../ui/finances.js';
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
const clockLabel = (day) => {
  const wk = Math.floor(day / 7);
  return wk > 0 ? `Wk ${wk} · d${day % 7}` : `Day ${day}`;
};

function hudHTML(character, def) {
  const curIdx = PHASES.indexOf(state.phase);
  const stepper = PHASES.map(p => {
    const i = PHASES.indexOf(p);
    const cur = p === state.phase ? ' cur' : '';
    const done = i < curIdx ? ' done' : '';
    // Earlier phases are clickable so you can jump back and redesign.
    const nav = i < curIdx ? ' nav' : '';
    return `<li class="step${cur}${done}${nav}" ${nav ? `data-phase="${p}"` : ''}>
      <span class="step-dot"></span>${PHASE_LABELS[p]}</li>`;
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
        <button class="hud-tool" data-tool="finances" title="Finances — where the money went" aria-label="Finances"><span aria-hidden="true">💰</span>${state.budget < 0 ? '<span class="hud-badge unread">!</span>' : ''}</button>
        ${state.markets.length ? `<button class="hud-tool" data-tool="portfolio" title="Market Portfolio" aria-label="Market portfolio, ${activeMarketCount()} selling"><span aria-hidden="true">📈</span>${activeMarketCount() ? `<span class="hud-badge">${activeMarketCount()}</span>` : ''}</button>` : ''}
        <button class="hud-tool" data-tool="sandbox" title="Operations (sandbox)" aria-label="Operations panel"><span aria-hidden="true">🌐</span>${state.worldEvents.length ? `<span class="hud-badge unread">!</span>` : ''}</button>
      </div>
      <div class="hud-money">
        <div class="hud-clock" title="Company calendar. Time passes as you work — and payroll is due the whole time.">
          <span class="hud-clock-n">${clockLabel(state.clock.day)}</span>
          <span class="hud-clock-l">Timeline</span>
        </div>
        ${(() => {
          const cl = state.creditLimit || 0;
          const onCredit = state.budget < 0;
          const left = cl + state.budget;            // remaining credit when in the red
          const near = onCredit && left < cl * 0.25;
          const title = onCredit
            ? `Operating on your credit line: ${money(-state.budget)} borrowed of ${money(cl)}. Interest accrues monthly; exceed the limit and the company is insolvent.`
            : `Company cash. Credit line available: ${money(cl)}.`;
          return `<div class="hud-budget${onCredit ? ' on-credit' : ''}${near ? ' warn' : ''}" title="${title}">
            <span class="hud-budget-n">${money(state.budget)}</span>
            <span class="hud-budget-l">${onCredit ? `On credit · ${money(left)} left` : 'Cash'}</span>
          </div>`;
        })()}
        ${state.product ? `<div class="hud-unitcost" title="Bill-of-materials cost per device, from your component choices.">
          <span class="hud-unitcost-n">${state.product.unitCost > 0 ? '$' + state.product.unitCost.toFixed(2) : '—'}</span>
          <span class="hud-unitcost-l">/ device</span>
        </div>` : ''}
      </div>
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
    if (state.bankrupt) return renderBankrupt(root, character, onQuit);
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
        // Time passes each phase, so the rival closes in and payroll is due —
        // this is the baseline pressure; corrections, slow factories and re-tests
        // add to it.
        if (state.phase !== 'launch') {
          state.competitorProgress = Math.min(100, state.competitorProgress + 8);
          advanceTime(14, PHASE_LABELS[state.phase]);
        }
        nextPhase();
        paint();
      },
      // Jump back to an earlier phase (e.g. to redesign after a test failure).
      // No competitor penalty for navigating; the redesign itself charges time.
      goTo: (phase) => { setPhase(phase); paint(); },
      hasNextProduct: !!getProductDef(state.character, state.productIndex + 1),
      completeProduct: () => {
        const nextDef = getProductDef(state.character, state.productIndex + 1);
        if (!nextDef) return;
        // Company cash, reputation, morale, the clock AND the previous product's
        // market all carry forward — that market keeps selling in the background
        // (ticked by advanceTime) while you build the next product.
        state.productIndex += 1;
        state.phase = 'brief';
        state.product = null;
        state.competitorProgress = 0;   // a fresh competitor for the new product's dev race
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
  // A spend during the phase (test fee, production order…) can trip bankruptcy;
  // rerender so the game-over screen shows immediately.
  if (state.bankrupt) { rerender(); return; }
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
  const finances = root.querySelector('[data-tool="finances"]');
  const portfolio = root.querySelector('[data-tool="portfolio"]');
  const sandbox = root.querySelector('[data-tool="sandbox"]');
  const hudRefresh = () => repaintHud(root, character, def, rerender);
  if (lib) lib.addEventListener('click', () => openLibrary(hudRefresh));
  if (inbox) inbox.addEventListener('click', () => openInbox(hudRefresh));
  if (finances) finances.addEventListener('click', () => openFinances(hudRefresh));
  if (portfolio) portfolio.addEventListener('click', () => openPortfolio(hudRefresh));
  // Sandbox changes can alter phase costs, so closing it re-renders the phase.
  if (sandbox) sandbox.addEventListener('click', () => openSandbox({ def, refreshHud: hudRefresh }, rerender));
  // Clickable stepper: jump back to an earlier phase. `rerender` is the full
  // phase repaint (paint), so changing state.phase then calling it re-mounts.
  root.querySelectorAll('.step.nav[data-phase]').forEach(li =>
    li.addEventListener('click', () => { setPhase(li.dataset.phase); rerender(); }));
}

// Debt blew past the credit line — the bank has called the loan. Show the last
// transactions so the failure is never a mystery ("how did this happen?").
function renderBankrupt(root, character, onQuit) {
  const recent = (state.ledger || []).slice(-8).reverse().map(e =>
    `<tr><td>d${e.day}</td><td>${e.label}</td><td class="${e.amount < 0 ? 'neg' : 'pos'}">${money(e.amount)}</td></tr>`).join('');
  root.innerHTML = `
    <div class="screen placeholder bankrupt">
      <div class="stamp stamp-red" aria-hidden="true">INSOLVENT</div>
      <h1>${character.company} has defaulted.</h1>
      <p class="ph-note">Debt of ${money(-state.budget)} pushed past your ${money(state.creditLimit)} credit line and the bank has called the loan.
        In product development, time is money — every week of delay, redesign and re-testing is salary and interest you still owe.</p>
      <table class="market-table ledger-table">
        <thead><tr><th>Day</th><th>Where the money went</th><th>Amount</th></tr></thead>
        <tbody>${recent || '<tr><td colspan="3" class="market-empty">No transactions recorded.</td></tr>'}</tbody>
      </table>
      <button class="title-btn" data-action="quit">← Back to title</button>
    </div>`;
  root.querySelector('[data-action="quit"]').addEventListener('click', onQuit);
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
