// EMC pre-scan mini-game.
// A spectrum analyzer shows emission peaks against a regulatory limit line.
// The player selects a peak over the limit, then applies a mitigation. Matching
// the right mitigation to the source clears the peak cheaply; the wrong one
// barely helps and wastes one of a limited number of fixes.
//
// renderEmc(container, config, onComplete)
//   config: { standardLabel, peaks:[{id,freq,label,source,excess,correctFix}], maxApplications }
//   onComplete(result): result = { status:'pass'|'conditional'|'fail', score, details }

const MITIGATIONS = [
  { id: 'ferrite', name: 'Ferrite Bead',     hint: 'Low-frequency conducted / switching noise' },
  { id: 'shield',  name: 'Shield Can',        hint: 'High-frequency radiated emissions' },
  { id: 'filter',  name: 'Filter Capacitor',  hint: 'Amplifier / output-stage noise' }
];
const CORRECT_REDUCTION = 12;
const WRONG_REDUCTION = 2;

// plot geometry (SVG user units)
const X0 = 64, X1 = 580, Y_TOP = 40, Y_BASE = 224, Y_LIMIT = 120, DB = 6;

export function renderEmc(container, config, onComplete) {
  const peaks = config.peaks.map(p => ({ ...p, currentExcess: p.excess, fixes: [] }));
  const maxApps = config.maxApplications;
  let used = 0;
  let selected = null;

  const failingCount = () => peaks.filter(p => p.currentExcess > 0).length;

  function peakX(i) {
    return X0 + (i + 0.5) * ((X1 - X0) / peaks.length);
  }
  function peakTopY(p) {
    const y = Y_LIMIT - p.currentExcess * DB;
    return Math.max(Y_TOP, Math.min(Y_BASE - 4, y));
  }

  function svg() {
    const grid = [-6, -3, 0, 3, 6].map(db => {
      const y = Y_LIMIT - db * DB;
      return `<line class="emc-grid" x1="${X0}" y1="${y}" x2="${X1}" y2="${y}"/>`;
    }).join('');

    const bars = peaks.map((p, i) => {
      const x = peakX(i), w = (X1 - X0) / peaks.length * 0.5;
      const top = peakTopY(p);
      const over = p.currentExcess > 0;
      const sel = selected === p.id ? ' sel' : '';
      return `<g class="emc-peak${over ? ' over' : ' ok'}${sel}" data-peak="${p.id}" tabindex="0" role="button" aria-label="${p.label}: ${over ? p.currentExcess + ' dB over the limit' : 'within limit'}">
        <rect class="emc-hit" x="${x - w/2}" y="${Y_TOP}" width="${w}" height="${Y_BASE - Y_TOP}"/>
        <rect class="emc-bar" x="${x - w/2}" y="${top}" width="${w}" height="${Y_BASE - top}"/>
        <text class="emc-glyph" x="${x}" y="${top - 6}" text-anchor="middle" aria-hidden="true">${over ? '✕' : '✓'}</text>
        <text class="emc-flabel" x="${x}" y="${Y_BASE + 16}" text-anchor="middle">${p.freq}</text>
      </g>`;
    }).join('');

    return `<svg viewBox="0 0 600 260" class="emc-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="${X0}" y="${Y_TOP}" width="${X1 - X0}" height="${Y_BASE - Y_TOP}" class="emc-plot"/>
      ${grid}
      <line class="emc-limit" x1="${X0}" y1="${Y_LIMIT}" x2="${X1}" y2="${Y_LIMIT}"/>
      <text class="emc-limit-label" x="${X1}" y="${Y_LIMIT - 5}" text-anchor="end">LIMIT — ${config.standardLabel}</text>
      ${bars}
      <text class="emc-axis" x="${X0}" y="${Y_BASE + 34}">frequency →</text>
      <text class="emc-axis" x="6" y="${Y_TOP + 4}" transform="rotate(-90 6 ${Y_TOP + 4})">amplitude (dB) →</text>
    </svg>`;
  }

  function panel() {
    if (!selected) {
      return `<p class="emc-help">Click a <b>red</b> peak — one that breaks the limit line — to see its source and apply a fix.</p>`;
    }
    const p = peaks.find(x => x.id === selected);
    const cleared = p.currentExcess <= 0;
    const buttons = MITIGATIONS.map(m =>
      `<button class="emc-mit" data-mit="${m.id}" ${cleared || used >= maxApps ? 'disabled' : ''}>
        <b>${m.name}</b><span>${m.hint}</span>
      </button>`).join('');
    return `<div class="emc-detail">
      <div class="emc-detail-head">
        <span class="emc-detail-freq">${p.freq}</span>
        <span class="emc-detail-status ${cleared ? 'ok' : 'over'}">${cleared ? 'Within limit' : `+${p.currentExcess} dB over`}</span>
      </div>
      <p class="emc-source"><b>Likely source:</b> ${p.source}</p>
      ${cleared ? '<p class="emc-cleared">This peak is compliant. Nice.</p>' : `<div class="emc-mits">${buttons}</div>`}
    </div>`;
  }

  function render() {
    const over = failingCount();
    container.innerHTML = `
      <div class="emc">
        <div class="emc-head">
          <h2>EMC Pre-Scan</h2>
          <div class="emc-stat">
            <span class="${over ? 'over' : 'ok'}">Peaks over limit: ${over}</span>
            <span>Fixes left: ${maxApps - used}</span>
          </div>
        </div>
        <div class="emc-screen">${svg()}</div>
        <div class="emc-panel">${panel()}</div>
        <div class="emc-actions">
          <button class="btn-secondary" data-emc="cancel">Abort scan</button>
          <button class="btn-primary" data-emc="finish">Finish &amp; record result</button>
        </div>
      </div>`;

    container.querySelectorAll('[data-peak]').forEach(g => {
      const sel = () => { selected = g.dataset.peak; render(); };
      g.addEventListener('click', sel);
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel(); } });
    });

    container.querySelectorAll('[data-mit]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (used >= maxApps) return;
        const p = peaks.find(x => x.id === selected);
        if (!p || p.currentExcess <= 0) return;
        const correct = btn.dataset.mit === p.correctFix;
        p.currentExcess -= correct ? CORRECT_REDUCTION : WRONG_REDUCTION;
        p.fixes.push(btn.dataset.mit);
        used++;
        render();
      });
    });

    container.querySelector('[data-emc="finish"]').addEventListener('click', finish);
    container.querySelector('[data-emc="cancel"]').addEventListener('click', () => onComplete(null));
  }

  function finish() {
    const over = failingCount();
    const status = over === 0 ? 'pass' : over === 1 ? 'conditional' : 'fail';
    const details = over === 0
      ? `All emissions below the ${config.standardLabel} limit after ${used} fix${used === 1 ? '' : 'es'}.`
      : `${over} peak${over === 1 ? '' : 's'} still over the limit. ${status === 'conditional' ? 'Marginal — may pass with documented justification.' : 'Will fail formal EMC testing.'}`;
    const score = Math.max(0, 100 - over * 30 - Math.max(0, used - over) * 5);
    onComplete({ status, score, details });
  }

  render();
}
