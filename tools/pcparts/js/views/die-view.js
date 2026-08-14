/* Two views of one fact: the die barely changed size across fifty years while
 * the number of things inside it grew by a factor of seven million.
 *
 *   mode "area"        the die drawn at its real area, with a coin beside it
 *   mode "transistors" the die drawn at a constant size, one dot per
 *                      transistor until there are more transistors than there
 *                      are pixels to draw them in
 *
 * Dies are drawn square. Real ones are not, but the area is right and the
 * shape is not what is being taught here.
 */

const PX_PER_MM = 13;      // area mode
const COIN_MM = 20.3;      // a 1p coin, for something to compare against
const FIELD = 320;         // transistors mode: constant square, in px
const MIN_SPACING = 1.5;   // below this, one dot has to stand for several

export default function mountDieView(host, block) {
  const chips = block.chips.slice().sort((a, b) => a.year - b.year);
  const mode = block.mode === 'transistors' ? 'transistors' : 'area';

  host.innerHTML = `
    <div class="tool die-tool" data-mode="${mode}">
      <div class="die-stage">${mode === 'area' ? areaMarkup() : fieldMarkup()}</div>
      <p class="die-readout" aria-live="polite">
        <span class="die-name"></span>
        <span class="die-figures"></span>
      </p>
      <input class="die-slider" type="range" min="0" max="${chips.length - 1}"
             value="0" step="1" aria-label="Processor">
      <div class="die-ends"><span>${chips[0].year}</span><span>${chips.at(-1).year}</span></div>
      ${block.caption ? `<p class="tool-note">${esc(block.caption)}</p>` : ''}
    </div>`;

  const slider = host.querySelector('.die-slider');
  const nameEl = host.querySelector('.die-name');
  const figEl = host.querySelector('.die-figures');

  const draw = mode === 'area' ? areaDrawer(host, chips) : fieldDrawer(host);

  function show(i) {
    const c = chips[i];
    slider.setAttribute('aria-label', `${c.name}, ${c.year}`);
    nameEl.textContent = `${c.name}`;
    figEl.textContent = draw(c);
  }

  slider.addEventListener('input', () => show(+slider.value));
  show(0);
}

/* ── die at real area, with a coin ────────────────────── */

function areaMarkup() {
  return `
    <svg viewBox="0 0 600 340" class="die-svg" role="img"
         aria-label="Processor die area compared with a coin">
      <circle class="die-coin" cx="452" cy="${306 - COIN_MM / 2 * PX_PER_MM}"
              r="${COIN_MM / 2 * PX_PER_MM}"/>
      <text class="die-coin-label" x="452" y="${306 - COIN_MM / 2 * PX_PER_MM}"
            text-anchor="middle">1p coin</text>
      <text class="die-coin-label" x="452" y="${306 - COIN_MM / 2 * PX_PER_MM + 16}"
            text-anchor="middle">20.3 mm</text>
      <rect class="die-ghost" x="44" y="0" width="0" height="0" hidden/>
      <rect class="die-rect" x="44" y="0" width="0" height="0"/>
    </svg>`;
}

function areaDrawer(host, chips) {
  const rect = host.querySelector('.die-rect');
  const ghost = host.querySelector('.die-ghost');
  const svg = host.querySelector('.die-svg');
  let pinned = null;

  // Clicking the die leaves its outline behind, so two eras can be compared.
  svg.addEventListener('click', e => {
    if (!e.target.closest('.die-rect')) return;
    if (pinned === rect.dataset.chip) {
      pinned = null;
      ghost.hidden = true;
    } else {
      pinned = rect.dataset.chip;
      ghost.setAttribute('width', rect.getAttribute('width'));
      ghost.setAttribute('height', rect.getAttribute('height'));
      ghost.setAttribute('y', rect.getAttribute('y'));
      ghost.hidden = false;
    }
  });

  return chip => {
    const side = Math.sqrt(chip.area) * PX_PER_MM;
    rect.setAttribute('width', side);
    rect.setAttribute('height', side);
    rect.setAttribute('y', 306 - side);
    rect.dataset.chip = chip.name;
    return `${chip.year}  ·  ${chip.area} mm²  ·  ${fmtCount(chip.transistors)} transistors  ·  ${chip.node}`;
  };
}

/* ── one dot per transistor, until that stops working ── */

function fieldMarkup() {
  return `<canvas class="die-canvas" width="${FIELD}" height="${FIELD}"></canvas>`;
}

function fieldDrawer(host) {
  const canvas = host.querySelector('.die-canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = FIELD * dpr;
  canvas.height = FIELD * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  return chip => {
    ctx.clearRect(0, 0, FIELD, FIELD);

    // How many dots fit before they merge into each other.
    const maxPerSide = Math.floor(FIELD / MIN_SPACING);
    const capacity = maxPerSide * maxPerSide;
    const wanted = Math.ceil(Math.sqrt(chip.transistors));
    const perSide = Math.min(wanted, maxPerSide);
    const spacing = FIELD / perSide;
    const dot = Math.max(1, spacing - 1);

    ctx.fillStyle = '#38bdf8';
    for (let r = 0; r < perSide; r++) {
      for (let c = 0; c < perSide; c++) {
        ctx.fillRect(c * spacing, r * spacing, dot, dot);
      }
    }

    const each = chip.transistors / (perSide * perSide);
    const scale = chip.transistors <= capacity
      ? 'one dot is one transistor'
      : `one dot is ${fmtCount(Math.round(each))} transistors`;
    return `${chip.year}  ·  ${fmtCount(chip.transistors)} transistors  ·  ${chip.node}  ·  ${scale}`;
  };
}

/* ── helpers ─────────────────────────────────────────── */

function fmtCount(n) {
  if (n >= 1e9) return `${+(n / 1e9).toPrecision(3)} billion`;
  if (n >= 1e6) return `${+(n / 1e6).toPrecision(3)} million`;
  if (n >= 1e3) return n.toLocaleString('en-GB');
  return String(n);
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
