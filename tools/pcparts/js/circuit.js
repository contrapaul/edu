/* Circuit traces behind the machine.
 *
 * Routed the way a board is: horizontal, vertical and 45 degree runs only,
 * turning by one eighth at a time, ending in a via. A dim trace carries a
 * short bright dash that travels along it, which is the pulse.
 *
 * Density and animation are separated on purpose. Animating stroke-dashoffset
 * cannot be handed to the compositor, so every animated path repaints its
 * bounds on every frame and those bounds are large. Static traces are painted
 * once and cost nothing after that. An early version ran sixty animations and
 * dropped frames on a 120 Hz display; raising PULSING is the change that costs,
 * not raising TRACES.
 *
 * Every path carries pathLength="100", so the dash pattern and the animation
 * can be written in percentages and no path has to be measured.
 *
 * Colour comes from three custom properties set on the layer. Because the
 * strokes read those through var(), changing them re-computes `stroke` and the
 * declared transition fades between the two, with no need for @property.
 */

const W = 1600;
const H = 1000;
const TRACES = 26;    // drawn once, then painted once: density is cheap
const PULSING = 10;   // animated every frame: this is the number that costs

/* Blue, teal, green, lime, yellow, amber, orange, red, magenta, violet, and
   round again. Each click moves on one step. */
const HUES = [205, 180, 150, 110, 80, 50, 28, 5, 330, 290, 260, 232];

function build(host) {
  const layer = document.createElement('div');
  layer.className = 'circuit';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = draw();
  host.prepend(layer);

  let step = 0;
  paint(layer, HUES[0]);

  // Any click on the machine advances the colour. Which colour comes next is
  // not tied to what was clicked; it just moves along the sequence.
  host.addEventListener('click', () => {
    step = (step + 1) % HUES.length;
    paint(layer, HUES[step]);
  });
}

function paint(layer, hue) {
  layer.style.setProperty('--trace', `hsl(${hue} 65% 42% / 0.34)`);
  layer.style.setProperty('--pulse', `hsl(${hue} 92% 68%)`);
  layer.style.setProperty('--via', `hsl(${hue} 70% 50% / 0.55)`);
}

/* ── the drawing ─────────────────────────────────────── */

function draw() {
  const rand = seeded(20250815);
  const parts = [];

  for (let i = 0; i < TRACES; i++) {
    const pts = route(rand);
    const d = pts.map((p, j) => `${j ? 'L' : 'M'}${p[0].toFixed(0)} ${p[1].toFixed(0)}`).join(' ');
    const dur = (7 + rand() * 9).toFixed(1);
    const delay = (rand() * 12).toFixed(1);
    const width = rand() < 0.25 ? 3 : 2;

    parts.push(`<path class="t-base" d="${d}" pathLength="100" stroke-width="${width}"/>`);

    // Only some traces carry a pulse. The rest are static and free.
    if (i % Math.ceil(TRACES / PULSING) === 0) {
      parts.push(`<path class="t-pulse" d="${d}" pathLength="100" stroke-width="${width}"
             style="--dur:${dur}s;--delay:-${delay}s"/>`);
    }

    const [ex, ey] = pts[pts.length - 1];
    parts.push(`<circle class="t-via" cx="${ex.toFixed(0)}" cy="${ey.toFixed(0)}" r="${width * 2.4}"/>`);
    if (rand() < 0.5) {
      const [sx, sy] = pts[0];
      parts.push(`<circle class="t-via" cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="${width * 2}"/>`);
    }
  }

  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"
               xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`;
}

/* Eight compass directions. Turning by one step keeps corners at 45 degrees,
   which is how traces are actually routed. */
const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

function route(rand) {
  const edge = Math.floor(rand() * 4);
  let x, y, dir;
  if (edge === 0) { x = -40; y = rand() * H; dir = 0; }
  else if (edge === 1) { x = W + 40; y = rand() * H; dir = 4; }
  else if (edge === 2) { x = rand() * W; y = -40; dir = 2; }
  else { x = rand() * W; y = H + 40; dir = 6; }

  const pts = [[x, y]];
  const legs = 3 + Math.floor(rand() * 4);

  for (let i = 0; i < legs; i++) {
    const [dx, dy] = DIRS[dir];
    // a diagonal leg covers more ground per unit, so shorten it
    const len = (70 + rand() * 230) * (dx && dy ? 0.72 : 1);
    x += dx * len;
    y += dy * len;
    pts.push([x, y]);
    dir = (dir + (rand() < 0.5 ? 1 : 7) + 8) % 8;
  }
  return pts;
}

/* Fixed seed, so the board looks the same on every visit rather than
   rearranging itself under the reader. */
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Started from the foot of the module: the routing tables below are `const`,
   so calling this any earlier reaches them before they are initialised. */
const stage = document.getElementById('stage');
if (stage) build(stage);
