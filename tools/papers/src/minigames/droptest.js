// Drop-test mini-game.
// A 2D cross-section of the product shows stress points. Points that fail the
// drop are cracked (red). The player selects a cracked point and applies a
// structural fix; matching the right fix to the failure mode clears it cheaply,
// the wrong one barely helps and wastes one of a limited number of reinforcements.
//
// Mirrors the EMC mini-game's select→apply→clear loop for consistency.
//
// renderDropTest(container, config, onComplete)
//   config: { surfaceNote, maxReinforcements, points:[{id,label,source,x,y,weakness,correctFix}] }
//   onComplete(result): { status:'pass'|'conditional'|'fail', score, details }

const FIXES = [
  { id: 'rib',      name: 'Add Rib',          hint: 'Stiffens thin spans and hinges',
    why: 'a rib turns a flexing span into a beam, so it stops bending far enough to snap' },
  { id: 'thicker',  name: 'Thicken Wall',     hint: 'More material to resist bending',
    why: 'a thicker section spreads the impact load over more material' },
  { id: 'material', name: 'Tougher Material',  hint: 'Higher-impact polymer',
    why: 'a tougher polymer absorbs the impact energy instead of fracturing' },
  { id: 'fillet',   name: 'Add Fillet',        hint: 'Relieves stress at sharp corners',
    why: 'a rounded corner spreads the stress that a sharp one concentrates' }
];
const CORRECT_RED = 12;
const WRONG_RED = 3;

const W = 600, H = 260;
const BOX = { x: 150, y: 50, w: 300, h: 150 };  // cross-section outline

export function renderDropTest(container, config, onComplete) {
  const points = config.points.map(p => ({ ...p, currentWeak: p.weakness, fixes: [] }));
  const maxFixes = config.maxReinforcements;
  let used = 0;
  let selected = null;
  let feedback = null;   // { point, kind: 'good' | 'bad', text } for the last fix applied

  const cracking = () => points.filter(p => p.currentWeak > 0).length;
  const px = (p) => BOX.x + p.x * BOX.w;
  const py = (p) => BOX.y + p.y * BOX.h;

  function svg() {
    const markers = points.map(p => {
      const cracked = p.currentWeak > 0;
      const sel = selected === p.id ? ' sel' : '';
      return `<g class="dt-point${cracked ? ' cracked' : ' ok'}${sel}" data-point="${p.id}" tabindex="0" role="button" aria-label="${p.label}: ${cracked ? 'cracks on impact' : 'holds'}">
        <circle class="dt-hit" cx="${px(p)}" cy="${py(p)}" r="22"/>
        <circle class="dt-dot" cx="${px(p)}" cy="${py(p)}" r="9"/>
        <text class="dt-glyph" x="${px(p)}" y="${py(p) + 4}" text-anchor="middle" aria-hidden="true">${cracked ? '✕' : '✓'}</text>
        <text class="dt-plabel" x="${px(p)}" y="${py(p) - 16}" text-anchor="middle">${p.label}</text>
      </g>`;
    }).join('');

    return `<svg viewBox="0 0 ${W} ${H}" class="dt-svg" xmlns="http://www.w3.org/2000/svg">
      <line class="dt-ground" x1="40" y1="${BOX.y + BOX.h + 26}" x2="${W - 40}" y2="${BOX.y + BOX.h + 26}"/>
      <rect class="dt-box" x="${BOX.x}" y="${BOX.y}" width="${BOX.w}" height="${BOX.h}" rx="14"/>
      <text class="dt-axis" x="${BOX.x}" y="${BOX.y - 28}">cross-section · ${config.surfaceNote}</text>
      ${markers}
    </svg>`;
  }

  function panel() {
    if (!selected) {
      return `<p class="emc-help">Click a <b>red</b> stress point — one that cracked on impact — to see the failure mode and reinforce it.</p>`;
    }
    const p = points.find(x => x.id === selected);
    const cleared = p.currentWeak <= 0;
    const buttons = FIXES.map(f =>
      `<button class="emc-mit" data-fix="${f.id}" ${cleared || used >= maxFixes ? 'disabled' : ''}>
        <b>${f.name}</b><span>${f.hint}</span>
      </button>`).join('');
    const outOfFixes = !cleared && used >= maxFixes;
    return `<div class="emc-detail">
      <div class="emc-detail-head">
        <span class="emc-detail-freq">${p.label}</span>
        <span class="emc-detail-status ${cleared ? 'ok' : 'over'}">${cleared ? 'Holds' : `cracks · +${p.currentWeak}`}</span>
      </div>
      <p class="emc-source"><b>Failure mode:</b> ${p.source}</p>
      ${p.note ? `<p class="emc-design-note"><b>Design note:</b> ${p.note}</p>` : ''}
      ${feedback && feedback.point === p.id ? `<p class="emc-feedback ${feedback.kind}">${feedback.text}</p>` : ''}
      ${cleared
        ? '<p class="emc-cleared">Reinforced. It survives the drop.</p>'
        : outOfFixes
          ? '<p class="emc-feedback bad">No reinforcements left. Record the result as it stands, or abort (the fee is refunded) and come back with a plan.</p>'
          : `<div class="emc-mits">${buttons}</div>`}
    </div>`;
  }

  function render() {
    const cracks = cracking();
    container.innerHTML = `
      <div class="emc">
        <div class="emc-head">
          <h2>Drop Test</h2>
          <div class="emc-stat">
            <span class="${cracks ? 'over' : 'ok'}">Cracked points: ${cracks}</span>
            <span>Reinforcements left: ${maxFixes - used}</span>
          </div>
        </div>
        <div class="emc-screen dt-screen">${svg()}</div>
        <div class="emc-panel">${panel()}</div>
        <div class="emc-actions">
          <button class="btn-secondary" data-dt="cancel">Abort test</button>
          <button class="btn-primary" data-dt="finish">Finish &amp; record result</button>
        </div>
      </div>`;

    container.querySelectorAll('[data-point]').forEach(g => {
      const sel = () => { selected = g.dataset.point; render(); };
      g.addEventListener('click', sel);
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel(); } });
    });

    container.querySelectorAll('[data-fix]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (used >= maxFixes) return;
        const p = points.find(x => x.id === selected);
        if (!p || p.currentWeak <= 0) return;
        const correct = btn.dataset.fix === p.correctFix;
        const f = FIXES.find(x => x.id === btn.dataset.fix);
        p.currentWeak -= correct ? CORRECT_RED : WRONG_RED;
        p.fixes.push(btn.dataset.fix);
        used++;
        feedback = correct
          ? { point: p.id, kind: 'good', text: `${f.name}: −${CORRECT_RED}. Right call: ${f.why}.` }
          : { point: p.id, kind: 'bad', text: `${f.name}: only −${WRONG_RED}, and that reinforcement is spent. It ${f.hint.toLowerCase()}, but here the ${p.source.charAt(0).toLowerCase() + p.source.slice(1)}. Pick the fix that addresses that failure mode.` };
        render();
      });
    });

    container.querySelector('[data-dt="finish"]').addEventListener('click', finish);
    container.querySelector('[data-dt="cancel"]').addEventListener('click', () => onComplete(null));
  }

  function finish() {
    const cracks = cracking();
    const status = cracks === 0 ? 'pass' : cracks === 1 ? 'conditional' : 'fail';
    const wasted = points.reduce((n, p) => n + p.fixes.filter(f => f !== p.correctFix).length, 0);
    const wastedNote = wasted ? ` ${wasted} reinforcement${wasted === 1 ? ' was' : 's were'} the wrong fix for the failure mode.` : '';
    const details = cracks === 0
      ? `The housing survives the drop after ${used} reinforcement${used === 1 ? '' : 's'}.${wastedNote}`
      : `${cracks} stress point${cracks === 1 ? '' : 's'} still crack. ${status === 'conditional' ? 'Marginal — passable with a documented caveat.' : 'Will fail mechanical certification.'}${wastedNote}`;
    const score = Math.max(0, 100 - cracks * 30 - Math.max(0, used - cracks) * 5);
    onComplete({ status, score, details });
  }

  render();
}
