/* Hardware capability against what software asked for, on a log scale.
 *
 * A linear axis is useless across six orders of magnitude, so the vertical
 * axis is powers of ten and each gridline is ten times the one below it.
 *
 * Points carry the name of the part they represent. Hovering, focusing or
 * tapping one lights it and opens a small box naming the part and its value;
 * tapping pins the box open so it survives a finger leaving the screen. */

const W = 900;
const H = 420;
const PAD = { top: 24, right: 40, bottom: 40, left: 62 };

export default function mountDemandChart(host, block) {
  const series = block.series.map(s => ({ ...s, ...splitUnit(s.label) }));
  const years = series.flatMap(s => s.points.map(p => p[0]));
  const values = series.flatMap(s => s.points.map(p => p[1]));

  const x0 = Math.min(...years), x1 = Math.max(...years);
  const lo = Math.floor(Math.log10(Math.min(...values)));
  const hi = Math.ceil(Math.log10(Math.max(...values)));

  const px = y => PAD.left + ((y - x0) / (x1 - x0)) * (W - PAD.left - PAD.right);
  const py = v => {
    const t = (Math.log10(v) - lo) / (hi - lo);
    return H - PAD.bottom - t * (H - PAD.top - PAD.bottom);
  };

  const decades = [];
  for (let d = lo; d <= hi; d++) decades.push(d);

  const ticks = [];
  for (let y = Math.ceil(x0 / 5) * 5; y <= x1; y += 5) ticks.push(y);

  host.innerHTML = `
    <div class="tool">
      <div class="chart-legend">
        ${series.map((s, i) => `
          <button type="button" class="legend-item" data-series="${i}" aria-pressed="true">
            <span class="legend-swatch" style="background:${s.color}"></span>${s.label}
          </button>`).join('')}
      </div>
      <div class="chart-wrap">
        <div class="chart-box">
          <svg viewBox="0 0 ${W} ${H}" class="chart" role="img"
               aria-label="${block.alt || 'Hardware capability against software demand over time'}">
            <g class="grid">
              ${decades.map(d => `
                <line x1="${PAD.left}" x2="${W - PAD.right}" y1="${py(10 ** d)}" y2="${py(10 ** d)}"/>
                <text x="${PAD.left - 10}" y="${py(10 ** d) + 4}" text-anchor="end">${fmtValue(10 ** d, block.unit)}</text>
              `).join('')}
              ${ticks.map(y => `
                <text x="${px(y)}" y="${H - PAD.bottom + 20}" text-anchor="middle">${y}</text>
              `).join('')}
            </g>
            ${series.map((s, i) => `
              <g class="series" data-line="${i}">
                <path d="${path(s.points, px, py)}" fill="none" stroke="${s.color}" stroke-width="2"/>
                ${s.points.map((p, j) => `
                  <g class="pt" data-series="${i}" data-point="${j}" style="--pt-color:${s.color}">
                    <circle class="pt-halo" cx="${px(p[0])}" cy="${py(p[1])}" r="7" fill="${s.color}"/>
                    <circle class="pt-dot"  cx="${px(p[0])}" cy="${py(p[1])}" r="3" fill="${s.color}"/>
                    <circle class="pt-hit"  cx="${px(p[0])}" cy="${py(p[1])}" r="13"
                            tabindex="0" role="button"
                            aria-label="${esc(p[2] || s.name)}, ${esc(fmtValue(p[1], s.unit || block.unit))}, ${p[0]}"/>
                  </g>`).join('')}
              </g>`).join('')}
          </svg>
          <div class="chart-tip" id="tip" hidden>
            <span class="tip-name"></span>
            <span class="tip-value"></span>
            <span class="tip-meta"></span>
          </div>
        </div>
      </div>
      ${block.caption ? `<p class="tool-note">${esc(block.caption)}</p>` : ''}
    </div>`;

  const boxEl = host.querySelector('.chart-box');
  const tip = host.querySelector('.chart-tip');
  let pinned = null;

  function show(group) {
    const s = series[+group.dataset.series];
    const p = s.points[+group.dataset.point];

    tip.querySelector('.tip-name').textContent = p[2] || s.name;
    tip.querySelector('.tip-value').textContent = fmtValue(p[1], s.unit || block.unit);
    tip.querySelector('.tip-meta').textContent = `${p[0]} · ${s.name}`;
    tip.style.setProperty('--tip-accent', s.color);

    const leftPct = (px(p[0]) / W) * 100;
    const topPct = (py(p[1]) / H) * 100;
    tip.style.left = `${leftPct}%`;
    tip.style.top = `${topPct}%`;
    // Keep the box inside the plot at the extremes rather than letting it
    // hang off the edge.
    tip.dataset.align = leftPct < 18 ? 'left' : leftPct > 82 ? 'right' : 'center';
    tip.hidden = false;

    host.querySelectorAll('.pt.is-active').forEach(g => g.classList.remove('is-active'));
    group.classList.add('is-active');
  }

  function hide() {
    // Hovering away from a point while another is pinned should fall back to
    // the pinned one, not leave the hovered reading on screen.
    if (pinned) return show(pinned);
    tip.hidden = true;
    host.querySelectorAll('.pt.is-active').forEach(g => g.classList.remove('is-active'));
  }

  function clear() {
    pinned = null;
    delete tip.dataset.pinned;
    tip.hidden = true;
    host.querySelectorAll('.pt.is-active').forEach(g => g.classList.remove('is-active'));
  }

  boxEl.addEventListener('pointerover', e => {
    const g = e.target.closest('.pt');
    if (g && g !== pinned) show(g);
  });

  boxEl.addEventListener('pointerout', e => {
    if (e.target.closest('.pt')) hide();
  });

  boxEl.addEventListener('focusin', e => {
    const g = e.target.closest('.pt');
    if (g) show(g);
  });

  boxEl.addEventListener('focusout', hide);

  boxEl.addEventListener('click', e => {
    const g = e.target.closest('.pt');
    if (!g) return clear();
    if (pinned === g) return clear();
    pinned = null;
    show(g);
    pinned = g;
    tip.dataset.pinned = 'true';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && pinned) clear();
  });

  host.querySelectorAll('.legend-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!on));
      host.querySelector(`[data-line="${btn.dataset.series}"]`).style.display = on ? 'none' : '';
      clear();
    });
  });
}

function path(points, px, py) {
  return points
    .slice()
    .sort((a, b) => a[0] - b[0])
    .map((p, i) => `${i ? 'L' : 'M'}${px(p[0]).toFixed(1)} ${py(p[1]).toFixed(1)}`)
    .join(' ');
}

/* "Processor (W)" carries its own unit, so use it for that series and keep
   the chart-wide unit as the fallback. */
function splitUnit(label) {
  const m = label.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  return m ? { name: m[1], unit: m[2] } : { name: label, unit: null };
}

function fmtValue(v, unit) {
  if (unit === 'MB') return fmtBytes(v);
  const n = v >= 1000 ? v.toLocaleString('en-GB')
    : v >= 1 ? String(+v.toFixed(2))
    : String(+v.toPrecision(2));
  return unit ? `${n} ${unit}` : n;
}

/* Values arrive in megabytes. Showing "100k MB" helps nobody. */
function fmtBytes(mb) {
  if (mb < 1) return `${+(mb * 1024).toPrecision(3)} KB`;
  if (mb < 1024) return `${+mb.toPrecision(3)} MB`;
  if (mb < 1048576) return `${+(mb / 1024).toPrecision(3)} GB`;
  return `${+(mb / 1048576).toPrecision(3)} TB`;
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
