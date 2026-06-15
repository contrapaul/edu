// Phase 5 — Production (pricing, order size, assembly & QC).
// Pick an assembly partner (adds a per-unit cost on top of the bill of materials),
// judge the first-article inspection, place the correct certification marks, then
// — late, with the product actually in hand — commit a retail PRICE and an ORDER
// SIZE. The order spends real cash: qty × cost-per-device + setup. Order too many
// and unsold units are dead loss; too few and you cap your own sales.

import { state, save } from '../state.js';
import { applyModifiers } from '../engine/events.js';
import { unitCost } from '../engine/economy.js';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const money2 = (n) => '$' + n.toFixed(2);
const dots  = (n) => '●●●●●'.slice(0, n).padEnd(5, '○');

export function renderProduction(container, ctx) {
  const { def } = ctx;
  const cfg = def.phases.manufacturing;
  const p = state.product;

  if (!p.manufacturing) p.manufacturing = { factory: null, inspection: {}, marks: [], assemblyPerUnit: 0 };
  const m = p.manufacturing;
  if (p.orderQty == null) p.orderQty = def.phases.launch.baseUnits || 5000;

  const requiredMarks = cfg.availableMarks.filter(mk => mk.market && p.selectedMarkets.includes(mk.market));
  const isFalseMark = (mk) => mk.market && !p.selectedMarkets.includes(mk.market);
  const factoryOf = (id) => cfg.factories.find(f => f.id === id);
  const setupCost = () => (m.factory ? applyModifiers('factory-setup', factoryOf(m.factory).setup) : 0);
  // Total cash the order will spend: one-time setup + per-device cost across the run.
  const orderCost = () => setupCost() + (p.orderQty || 0) * unitCost(p, def);

  function render() {
    const factories = cfg.factories.map(f => {
      const on = m.factory === f.id ? ' on' : '';
      const setup = applyModifiers('factory-setup', f.setup);
      const tag = setup < f.setup ? ' <span class="cost-down">▼</span>' : setup > f.setup ? ' <span class="cost-up">▲</span>' : '';
      const per = typeof f.perUnit === 'number' ? f.perUnit : f.cost;
      return `<button class="opt factory-opt${on}" data-factory="${f.id}">
        <span class="opt-name">${f.name}<span class="opt-unitcost">+${money2(per)}/unit</span></span>
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

    const pr = def.priceRange;
    container.innerHTML = `
      <div class="phase phase-mfg">
        <p class="phase-intro">${cfg.intro}</p>

        <h2>1 · Assembly partner</h2>
        <p class="panel-hint">The partner adds a per-unit assembly cost on top of your bill of materials, plus a one-time setup fee. It rolls straight into cost-per-device.</p>
        <div class="opt-grid">${factories}</div>

        <h2>2 · First-article inspection</h2>
        <p class="panel-hint">Reject real defects (they cost rework now); accept cosmetic ones within tolerance. Shipping a real defect haunts you at launch.</p>
        <div class="fa-list">${inspections}</div>

        <h2>3 · Label — certification marks</h2>
        <p class="panel-hint">Place exactly the marks your markets require. A missing mark fails customs; a mark for a market you don't sell into is a false compliance claim.</p>
        <div class="marks">${marks}</div>

        <h2>4 · Price &amp; production order</h2>
        <p class="panel-hint">Now that the product exists and you know what it costs to build, set a retail price and decide how many to make. The order spends cash up front — unsold units are a loss.</p>
        <div class="order-grid">
          <label class="order-field">
            <span class="order-label">Retail price</span>
            <input type="range" id="price" min="${pr.min}" max="${pr.max}" step="1" value="${p.targetPrice}">
            <span class="order-val" id="price-val">$${Number(p.targetPrice).toFixed(2)}</span>
          </label>
          <label class="order-field">
            <span class="order-label">Order quantity</span>
            <input type="number" id="qty" min="0" step="500" value="${p.orderQty}">
          </label>
        </div>
        <div class="order-readout" id="order-readout"></div>

        <div class="phase-actions">
          <button class="btn-primary" id="ship" disabled>Place production order →</button>
          <span class="confirm-msg" id="mfg-msg"></span>
        </div>
      </div>`;

    bind();
    refresh();
  }

  function bind() {
    container.querySelectorAll('[data-factory]').forEach(b =>
      b.addEventListener('click', () => {
        m.factory = b.dataset.factory;
        const f = factoryOf(m.factory);
        m.assemblyPerUnit = typeof f.perUnit === 'number' ? f.perUnit : f.cost;
        container.querySelectorAll('[data-factory]').forEach(x => x.classList.toggle('on', x === b));
        p.unitCost = unitCost(p, def);
        save(); ctx.refreshHud(); refresh();
      }));

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

    const price = container.querySelector('#price');
    price.addEventListener('input', () => {
      p.targetPrice = Number(price.value);
      container.querySelector('#price-val').textContent = '$' + p.targetPrice.toFixed(2);
      save(); refresh();
    });

    const qty = container.querySelector('#qty');
    qty.addEventListener('input', () => {
      p.orderQty = Math.max(0, Math.floor(Number(qty.value) || 0));
      save(); refresh();
    });

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
    const uc = unitCost(p, def);
    const price = Number(p.targetPrice);
    const margin = price - uc;
    const cost = orderCost();
    const cashAfter = state.budget - cost;
    const marginClass = margin >= 0 ? 'pos' : 'neg';

    const readout = container.querySelector('#order-readout');
    if (readout) {
      readout.innerHTML = `
        <div class="order-row"><span>Cost per device</span><b>${money2(uc)}</b></div>
        <div class="order-row"><span>Margin per device</span><b class="${marginClass}">${money2(margin)}</b></div>
        <div class="order-row"><span>Setup (one-time)</span><b>${money(setupCost())}</b></div>
        <div class="order-row total"><span>Production order (${(p.orderQty||0).toLocaleString('en-US')} units)</span><b>${money(cost)}</b></div>
        <div class="order-row"><span>Cash after order</span><b class="${cashAfter < 0 ? 'neg' : 'pos'}">${money(cashAfter)}</b></div>`;
    }

    const allInspected = cfg.firstArticle.every(i => m.inspection[i.id]);
    const mv = marksValid();
    const affordable = cost <= state.budget;
    const qtyOk = (p.orderQty || 0) > 0;
    const ready = m.factory && allInspected && mv.ok && qtyOk && affordable;

    const btn = container.querySelector('#ship');
    const msg = container.querySelector('#mfg-msg');
    btn.disabled = !ready;
    msg.textContent = !m.factory ? 'Choose an assembly partner.'
      : !allInspected ? 'Decide on every inspection finding.'
      : mv.missing.length ? `Missing required mark: ${mv.missing.map(x => x.label).join(', ')}.`
      : mv.falseMarks.length ? `Remove false mark: ${mv.falseMarks.map(x => x.label).join(', ')}.`
      : !qtyOk ? 'Set an order quantity.'
      : !affordable ? `Order costs ${money(cost)} — more than your ${money(state.budget)} cash.`
      : '';
  }

  function ship() {
    const factory = factoryOf(m.factory);

    // Charge setup + rework for rejected findings + the production run itself.
    let cost = setupCost();
    cfg.firstArticle.forEach(i => { if (m.inspection[i.id] === 'reject') cost += i.reworkCost; });
    cost += (p.orderQty || 0) * unitCost(p, def);
    state.budget -= cost;

    // Lock in price and the committed unit cost for the launch maths.
    p.priceSet = true;
    p.unitCost = unitCost(p, def);

    // Slow partners let the competitor catch up.
    state.competitorProgress = Math.min(100, state.competitorProgress + (5 - factory.speed) * 4);

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
