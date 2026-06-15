// Sandbox panel — the late-game systems layered on top of the scripted game.
// Rename the product, trigger/observe global events, open facilities, and hire
// staff. Every purchase here registers a modifier that the existing phases pick
// up through applyModifiers — no phase code is aware of the sandbox.

import { state, save } from '../state.js';
import { WORLD_EVENTS, FACILITIES, HIRES } from '../content/sandbox.js';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

const eventActive  = (id) => state.worldEvents.some(e => e.id === id);
const facilityOwned = (id) => state.facilities.some(f => f.id === id);
const hireOwned     = (id) => state.staffRoster.some(h => h.id === id);

export function openSandbox(ctx, onClose) {
  const overlay = document.createElement('div');
  overlay.className = 'pp-overlay';
  document.body.appendChild(overlay);

  function effectsLine(item) {
    return Object.entries(item.effects || {})
      .map(([k, v]) => `${k.replace('-', ' ')} ×${v}`).join(' · ');
  }

  function draw() {
    overlay.innerHTML = `
      <div class="pp-modal-box sandbox-box">
        <header class="pp-modal-head">
          <h2>🌐 Operations</h2>
          <button class="pp-close" aria-label="Close">✕</button>
        </header>
        <div class="sandbox-body">
          <section class="sb-section">
            <h3>Product name</h3>
            <p class="sb-hint">Give this product a name of your own.</p>
            <input class="sb-name" id="sb-name" type="text" maxlength="40" value="${(state.product?.name ?? '').replace(/"/g, '&quot;')}">
          </section>

          <section class="sb-section">
            <h3>Global events</h3>
            <p class="sb-hint">World conditions that shift your costs. Toggle to simulate.</p>
            ${WORLD_EVENTS.map(e => `
              <label class="sb-item">
                <input type="checkbox" data-event="${e.id}" ${eventActive(e.id) ? 'checked' : ''}>
                <span class="sb-item-main"><b>${e.label}</b><span class="sb-desc">${e.desc}</span>
                  <span class="sb-effects">${effectsLine(e)}</span></span>
              </label>`).join('')}
          </section>

          <section class="sb-section">
            <h3>Facilities</h3>
            <p class="sb-hint">Open a facility for a permanent edge — local presence fast-tracks work.</p>
            ${FACILITIES.map(f => `
              <div class="sb-item">
                <span class="sb-item-main"><b>${f.label}</b><span class="sb-desc">${f.desc}</span>
                  <span class="sb-effects">${effectsLine(f)}</span></span>
                ${facilityOwned(f.id)
                  ? '<span class="sb-owned">Open</span>'
                  : `<button class="sb-buy" data-facility="${f.id}" ${state.budget < f.cost ? 'disabled' : ''}>${money(f.cost)}</button>`}
              </div>`).join('')}
          </section>

          <section class="sb-section">
            <h3>Hire staff</h3>
            <p class="sb-hint">Extra hands that speed up and cheapen specific work.</p>
            ${HIRES.map(h => `
              <div class="sb-item">
                <span class="sb-item-main"><b>${h.label}</b><span class="sb-desc">${h.desc}</span>
                  <span class="sb-effects">${effectsLine(h)}</span></span>
                ${hireOwned(h.id)
                  ? '<span class="sb-owned">Hired</span>'
                  : `<button class="sb-buy" data-hire="${h.id}" ${state.budget < h.cost ? 'disabled' : ''}>${money(h.cost)}</button>`}
              </div>`).join('')}
          </section>
        </div>
      </div>`;

    // name
    const nameInput = overlay.querySelector('#sb-name');
    nameInput.addEventListener('change', () => {
      const name = nameInput.value.trim();
      if (name && state.product) {
        state.product.name = name;
        state.namedProducts[state.product.id] = name;
        save(); ctx.refreshHud();
      }
    });

    // events (free toggles, simulate world conditions)
    overlay.querySelectorAll('[data-event]').forEach(cb => {
      cb.addEventListener('change', () => {
        const def = WORLD_EVENTS.find(e => e.id === cb.dataset.event);
        if (cb.checked) state.worldEvents.push({ ...def });
        else state.worldEvents = state.worldEvents.filter(e => e.id !== def.id);
        save(); ctx.refreshHud(); draw();
      });
    });

    // facilities (one-time purchase)
    overlay.querySelectorAll('[data-facility]').forEach(btn => {
      btn.addEventListener('click', () => {
        const def = FACILITIES.find(f => f.id === btn.dataset.facility);
        if (state.budget < def.cost || facilityOwned(def.id)) return;
        state.budget -= def.cost;
        state.facilities.push({ ...def });
        if (def.competitorRelief)
          state.competitorProgress = Math.max(0, state.competitorProgress - def.competitorRelief);
        save(); ctx.refreshHud(); draw();
      });
    });

    // hires (one-time purchase)
    overlay.querySelectorAll('[data-hire]').forEach(btn => {
      btn.addEventListener('click', () => {
        const def = HIRES.find(h => h.id === btn.dataset.hire);
        if (state.budget < def.cost || hireOwned(def.id)) return;
        state.budget -= def.cost;
        state.staffRoster.push({ ...def });
        save(); ctx.refreshHud(); draw();
      });
    });

    overlay.querySelector('.pp-close').addEventListener('click', close);
  }

  const onKey = (e) => { if (e.key === 'Escape') close(); };
  function close() { overlay.remove(); document.removeEventListener('keydown', onKey); onClose && onClose(); }
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', onKey);

  draw();
}
