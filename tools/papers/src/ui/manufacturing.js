// Phase 5 — Manufacturing & Quality Control.
// Pick a factory, judge the first-article inspection findings, and place the
// correct certification marks for the chosen markets. All three gate shipment.

import { state, save } from '../state.js';
import { getMarket } from '../content/markets.js';
import { applyModifiers } from '../engine/events.js';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const dots  = (n) => '●●●●●'.slice(0, n).padEnd(5, '○');

export function renderManufacturing(container, ctx) {
  const { def } = ctx;
  const cfg = def.phases.manufacturing;
  const p = state.product;

  if (!p.manufacturing) p.manufacturing = { factory: null, inspection: {}, marks: [] };
  const m = p.manufacturing;

  // Marks required = those whose market the player is actually selling into.
  const requiredMarks = cfg.availableMarks.filter(mk => mk.market && p.selectedMarkets.includes(mk.market));
  const isFalseMark = (mk) => mk.market && !p.selectedMarkets.includes(mk.market);

  function render() {
    const factories = cfg.factories.map(f => {
      const on = m.factory === f.id ? ' on' : '';
      const setup = applyModifiers('factory-setup', f.setup);
      const tag = setup < f.setup ? ' <span class="cost-down">▼</span>' : setup > f.setup ? ' <span class="cost-up">▲</span>' : '';
      return `<button class="opt factory-opt${on}" data-factory="${f.id}">
        <span class="opt-name">${f.name}</span>
        <span class="opt-props">
          <span>Quality ${dots(f.quality)}</span>
          <span>Speed ${dots(f.speed)}</span>
          <span>Compliance ${dots(f.compliance)}</span>
          <span>Setup ${money(setup)}${tag}</span>
        </span>
        <span class="opt-note">${f.note}</span>
      </button>`;
    }).join('');

    const inspections = cfg.firstArticle.map(item => {
      const decision = m.inspection[item.id];
      return `<div class="fa-item">
        <div class="fa-finding"><b>${item.finding}</b><span class="fa-note">${item.note}</span></div>
        <div class="fa-actions">
          <button class="fa-btn${decision === 'accept' ? ' chosen' : ''}" data-fa="${item.id}" data-decision="accept">Accept</button>
          <button class="fa-btn${decision === 'reject' ? ' chosen' : ''}" data-fa="${item.id}" data-decision="reject">Reject · ${money(item.reworkCost)}</button>
        </div>
      </div>`;
    }).join('');

    const marks = cfg.availableMarks.map(mk => {
      const on = m.marks.includes(mk.id) ? ' on' : '';
      const req = requiredMarks.some(r => r.id === mk.id);
      return `<button class="mark${on}${req ? ' required' : ''}" data-mark="${mk.id}">
        ${mk.label}${req ? '<span class="mark-req">required</span>' : ''}
      </button>`;
    }).join('');

    container.innerHTML = `
      <div class="phase phase-mfg">
        <p class="phase-intro">${cfg.intro}</p>

        <h2>1 · Factory</h2>
        <div class="opt-grid">${factories}</div>

        <h2>2 · First-article inspection</h2>
        <p class="panel-hint">Reject real defects (they cost rework now); accept cosmetic ones within tolerance. Shipping a real defect haunts you at launch.</p>
        <div class="fa-list">${inspections}</div>

        <h2>3 · Label — certification marks</h2>
        <p class="panel-hint">Place exactly the marks your markets require. A missing mark fails customs; a mark for a market you don't sell into is a false compliance claim.</p>
        <div class="marks">${marks}</div>

        <div class="phase-actions">
          <button class="btn-primary" id="ship" disabled>Ship it →</button>
          <span class="confirm-msg" id="mfg-msg"></span>
        </div>
      </div>`;

    bind();
    refresh();
  }

  function bind() {
    container.querySelectorAll('[data-factory]').forEach(b =>
      b.addEventListener('click', () => { m.factory = b.dataset.factory;
        container.querySelectorAll('[data-factory]').forEach(x => x.classList.toggle('on', x === b)); save(); refresh(); }));

    container.querySelectorAll('[data-fa]').forEach(b =>
      b.addEventListener('click', () => {
        m.inspection[b.dataset.fa] = b.dataset.decision;
        const group = container.querySelectorAll(`[data-fa="${b.dataset.fa}"]`);
        group.forEach(x => x.classList.toggle('chosen', x === b));
        save(); refresh();
      }));

    container.querySelectorAll('[data-mark]').forEach(b =>
      b.addEventListener('click', () => {
        const id = b.dataset.mark;
        const i = m.marks.indexOf(id);
        if (i >= 0) { m.marks.splice(i, 1); b.classList.remove('on'); }
        else { m.marks.push(id); b.classList.add('on'); }
        save(); refresh();
      }));

    container.querySelector('#ship').addEventListener('click', ship);
  }

  function marksValid() {
    const missing = requiredMarks.filter(r => !m.marks.includes(r.id));
    const falseMarks = m.marks
      .map(id => cfg.availableMarks.find(mk => mk.id === id))
      .filter(isFalseMark);
    return { ok: missing.length === 0 && falseMarks.length === 0, missing, falseMarks };
  }

  function refresh() {
    const allInspected = cfg.firstArticle.every(i => m.inspection[i.id]);
    const mv = marksValid();
    const ready = m.factory && allInspected && mv.ok;

    const btn = container.querySelector('#ship');
    const msg = container.querySelector('#mfg-msg');
    btn.disabled = !ready;
    msg.textContent = !m.factory ? 'Choose a factory.'
      : !allInspected ? 'Decide on every inspection finding.'
      : mv.missing.length ? `Missing required mark: ${mv.missing.map(x => x.label).join(', ')}.`
      : mv.falseMarks.length ? `Remove false mark: ${mv.falseMarks.map(x => x.label).join(', ')}.`
      : '';
  }

  function ship() {
    const factory = cfg.factories.find(f => f.id === m.factory);

    // Charge factory setup (modifier-adjusted) + rework for everything rejected.
    let cost = applyModifiers('factory-setup', factory.setup);
    cfg.firstArticle.forEach(i => { if (m.inspection[i.id] === 'reject') cost += i.reworkCost; });
    state.budget -= cost;

    // Slow factories let the competitor catch up.
    state.competitorProgress = Math.min(100, state.competitorProgress + (5 - factory.speed) * 4);

    // Inspection score: correct = reject real defects, accept cosmetic ones.
    const total = cfg.firstArticle.length;
    const correct = cfg.firstArticle.filter(i =>
      (i.real && m.inspection[i.id] === 'reject') || (!i.real && m.inspection[i.id] === 'accept')).length;
    m.inspectionScore = Math.round(correct / total * 100);
    m.shippedDefects = cfg.firstArticle.filter(i => i.real && m.inspection[i.id] === 'accept').map(i => i.id);

    save();
    ctx.refreshHud();
    ctx.advance();
  }

  render();
}
