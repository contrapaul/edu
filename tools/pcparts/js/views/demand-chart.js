/* Hardware capability against what software asked for, on a log scale.
 *
 * A linear axis is useless across six orders of magnitude, so the vertical
 * axis is powers of ten and each gridline is ten times the one below it. */

const W = 900;
const H = 420;
const PAD = { top: 24, right: 40, bottom: 40, left: 62 };

export default function mountDemandChart(host, block) {
  const series = block.series;
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
        <svg viewBox="0 0 ${W} ${H}" class="chart" role="img"
             aria-label="${block.alt || 'Hardware capability against software demand over time'}">
          <g class="grid">
            ${decades.map(d => `
              <line x1="${PAD.left}" x2="${W - PAD.right}" y1="${py(10 ** d)}" y2="${py(10 ** d)}"/>
              <text x="${PAD.left - 10}" y="${py(10 ** d) + 4}" text-anchor="end">${fmtTick(10 ** d, block.unit)}</text>
            `).join('')}
            ${ticks.map(y => `
              <text x="${px(y)}" y="${H - PAD.bottom + 20}" text-anchor="middle">${y}</text>
            `).join('')}
          </g>
          ${series.map((s, i) => `
            <g class="series" data-line="${i}">
              <path d="${path(s.points, px, py)}" fill="none" stroke="${s.color}" stroke-width="2"/>
              ${s.points.map(p => `<circle cx="${px(p[0])}" cy="${py(p[1])}" r="3" fill="${s.color}"/>`).join('')}
            </g>`).join('')}
        </svg>
      </div>
      ${block.caption ? `<p class="tool-note">${block.caption}</p>` : ''}
    </div>`;

  host.querySelectorAll('.legend-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!on));
      host.querySelector(`[data-line="${btn.dataset.series}"]`).style.display = on ? 'none' : '';
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

function fmtTick(v, unit) {
  const suffix = unit || '';
  if (v >= 1e9) return `${v / 1e9}B${suffix}`;
  if (v >= 1e6) return `${v / 1e6}M${suffix}`;
  if (v >= 1e3) return `${v / 1e3}k${suffix}`;
  return `${v}${suffix}`;
}
