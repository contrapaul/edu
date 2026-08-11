// ═══════════════════════════════════════════════════════════════════
//  Ashby Chart Challenge: pointer-driven placement game
//  Drag materials onto a log-log strength/temperature chart; score by
//  how close each drop lands to the material's real properties.
// ═══════════════════════════════════════════════════════════════════

const MAX_ATTEMPTS = 2;      // drops allowed per material
const TEMP_MIN = 10, TEMP_MAX = 10000;   // °C, log scale
const STR_MIN = 0.01, STR_MAX = 1000;    // MPa, log scale
const FULL_DIST = 0.03;      // normalized distance for a perfect 100
const ZERO_DIST = 0.40;      // normalized distance at which points hit 0
const HINT_DELTA = 0.05;     // min offset before a directional hint fires
const DRAG_THRESHOLD = 5;    // px of movement before a press counts as a drag
const MARKER_R = 9, HIT_R = 18;

const CLASSES = [
    { id: 'metal',     label: 'Metals',     emoji: '\u{1F529}' },
    { id: 'polymer',   label: 'Polymers',   emoji: '\u{1F9F4}' },
    { id: 'ceramic',   label: 'Ceramics',   emoji: '\u{1F3FA}' },
    { id: 'composite', label: 'Composites', emoji: '\u{1F9EC}' },
    { id: 'natural',   label: 'Natural',    emoji: '\u{1F33F}' },
];
const classInfo = Object.fromEntries(CLASSES.map((c) => [c.id, c]));

const MATERIALS = [
    // metals
    { key: 'm1', name: 'Mild steel', strength: 400, temp: 600, class: 'metal',
      use: 'Mild steel is steel with very little carbon in it, which is what makes it easy to bend, cut and weld. It is not the strongest steel, but it is cheap, predictable and available everywhere, so it ends up in building beams, reinforcing bar, car bodies and pipelines. It rusts readily, so it almost always needs paint, galvanising or another coating.' },
    { key: 'm2', name: 'Stainless 304', strength: 550, temp: 870, class: 'metal',
      use: 'Stainless 304 is steel with roughly 18% chromium and 8% nickel added. The chromium reacts with air to form an invisible oxide layer that reseals itself whenever the surface is scratched, which is why stainless resists corrosion rather than merely delaying it. That makes it the default for kitchen equipment, chemical containers and architectural trim, at several times the cost of mild steel.' },
    { key: 'm3', name: 'Aluminium 6061', strength: 310, temp: 350, class: 'metal',
      use: 'Aluminium 6061 is roughly a third the density of steel, and it is precipitation hardened, meaning it is heated and then aged so that tiny particles form inside the metal and block the internal slipping that would otherwise let it deform. It welds and machines well, so it turns up in bicycle frames, aircraft fittings and marine parts. Note the low service temperature: it loses strength long before it melts.' },
    { key: 'm4', name: 'Copper', strength: 220, temp: 400, class: 'metal',
      use: 'Copper conducts electricity and heat better than almost any affordable metal, which is why it dominates wiring, motors, heat exchangers and cookware. It is soft and heavy, so it is rarely chosen to carry structural load. Exposed copper weathers to the green patina you see on roofs, and that layer protects the metal underneath.' },
    { key: 'm5', name: 'Titanium Ti-6Al-4V', strength: 950, temp: 600, class: 'metal',
      use: 'Ti-6Al-4V is titanium with 6% aluminium and 4% vanadium, the most used titanium alloy by far. It is roughly as strong as steel at a little over half the weight, and the body does not reject it, so it is used for aerospace structure and surgical implants. It is expensive and awkward to machine, which is what keeps it out of ordinary products.' },
    { key: 'm6', name: 'Magnesium alloy', strength: 230, temp: 350, class: 'metal',
      use: 'Magnesium alloys are the lightest structural metals in normal use, lighter than aluminium again by about a third. That buys weight savings in laptop casings, power tool bodies and car parts where every gram counts. The trade-off is that magnesium is expensive, corrodes easily and burns fiercely in fine chip or powder form.' },
    { key: 'm7', name: 'Cast iron', strength: 250, temp: 800, class: 'metal',
      use: 'Cast iron is iron with enough carbon in it to be poured into a mould rather than shaped by force, which makes complicated shapes cheap to produce. The carbon appears as flakes or nodules that absorb vibration, so it suits engine blocks, machine tool bases and brake discs. It is strong in compression but brittle in tension, so it cracks rather than bends when overloaded.' },
    { key: 'm8', name: 'Nickel superalloy', strength: 1100, temp: 1050, class: 'metal',
      use: 'Nickel superalloys such as Inconel are built to hold their strength when other metals have gone soft, staying useful at temperatures glowing red hot. That is why they appear in gas turbine blades, rocket engines and nuclear reactors. They are among the most expensive and most difficult to machine materials here, so nothing uses them unless the heat demands it.' },

    // polymers
    { key: 'p1', name: 'HDPE', strength: 30, temp: 80, class: 'polymer',
      use: 'High density polyethylene is the milk bottle and jerry can plastic. The polymer chains pack together tightly, which makes it stiffer and stronger than the low density version, and it shrugs off most chemicals. It is easy to blow mould, so it becomes bottles, fuel tanks, cutting boards and pipe. Cheap, recyclable and completely opaque unless coloured.' },
    { key: 'p2', name: 'Polypropylene (PP)', strength: 35, temp: 100, class: 'polymer',
      use: 'Polypropylene bends without breaking, again and again, which is why the lid on a shampoo bottle can flex thousands of times without the hinge failing. That property is called fatigue resistance, and a hinge moulded straight into the part is called a living hinge. It also handles boiling water, so it suits food containers, medical syringes and car interior trim.' },
    { key: 'p3', name: 'Nylon 6,6', strength: 85, temp: 150, class: 'polymer',
      use: 'Nylon 6,6 is strong, resists rubbing wear and slides against other surfaces with little friction, so it replaces metal in gears and bearings without needing oil. The same toughness makes it into rope, textile fibre and zip ties. Its weakness is water: nylon absorbs moisture from the air, which swells the part slightly and softens it.' },
    { key: 'p4', name: 'PMMA (acrylic)', strength: 70, temp: 90, class: 'polymer',
      use: 'PMMA, sold as acrylic, Perspex or Plexiglas, is the clear plastic used when glass would be too fragile or too heavy. It passes more light than glass does and will not shatter into sharp fragments, so it is used for lenses, aquarium walls, signage and tail lights. It scratches easily and cracks if you over-tighten a bolt through it.' },
    { key: 'p5', name: 'PTFE (Teflon™)', strength: 25, temp: 260, class: 'polymer',
      use: 'PTFE, better known as Teflon, has the lowest friction of any solid material in common use, which is why nothing sticks to a pan coated in it. It also ignores nearly every chemical and tolerates far more heat than most polymers. It is soft and creeps slowly under load, so it is used as coatings, seals, gaskets and insulation rather than as a structural part.' },
    { key: 'p6', name: 'Epoxy', strength: 90, temp: 180, class: 'polymer',
      use: 'Epoxy is a thermoset, meaning the liquid resin and hardener react into a permanent solid that cannot be melted back down. That is the opposite of a thermoplastic such as ABS, which softens with heat every time. Epoxy grips almost any surface, so it works as a strong adhesive and as the glue holding the fibres together in carbon fibre and fibreglass.' },
    { key: 'p7', name: 'Silicone elastomer', strength: 7, temp: 230, class: 'polymer',
      use: 'Silicone rubber stays flexible from freezer temperatures to oven temperatures, a range no other common elastomer manages. It is also inert enough for medical tubing and food moulds. It is not strong, so it is chosen for sealing, insulating and flexing, never for carrying a load.' },
    { key: 'c2', name: 'PETG', strength: 50, temp: 75, class: 'polymer',
      use: 'PETG is PET, the bottle plastic, with glycol added to stop it crystallising and going cloudy. The result stays clear, resists impact and forms easily at low temperatures, which makes it a favourite for 3D printing and vacuum forming. It is the sensible choice when you want the clarity of acrylic without the brittleness.' },
    { key: 'c6', name: 'ABS', strength: 40, temp: 100, class: 'polymer',
      use: 'ABS is three materials blended into one: acrylonitrile for chemical resistance, butadiene rubber for toughness, and styrene for stiffness and finish. That mix is why a LEGO brick survives being trodden on and still clicks together after decades. It is also used for dashboards, power tool housings and 3D printing filament, but it warps as it cools and needs a heated bed to print well.' },

    // ceramics
    { key: 'c1', name: 'Alumina (Al₂O₃)', strength: 350, temp: 1750, class: 'ceramic',
      use: 'Alumina is aluminium oxide, the ceramic left when aluminium fully reacts with oxygen. It is extremely hard and wear resistant, and it blocks electricity completely, which is the combination that puts it inside every spark plug. Also used for grinding media, circuit substrates and hip joint implants. Like all ceramics here it is brittle: it will take enormous pressure and then fail suddenly with no warning bend.' },
    { key: 'c3', name: 'Silicon carbide (SiC)', strength: 400, temp: 2600, class: 'ceramic',
      use: 'Silicon carbide is close to diamond in hardness and, unusually for a ceramic, conducts heat well. That combination suits abrasives, high performance brake discs, armour plate and semiconductors that run hot. Its service temperature is the highest on this chart by a wide margin.' },
    { key: 'c4', name: 'Porcelain', strength: 60, temp: 1400, class: 'ceramic',
      use: 'Porcelain is clay fired hot enough to vitrify, meaning part of it turns to glass and fills the pores, leaving a dense body that will not absorb water. It blocks electricity well even when wet, which is why the insulators on power lines are porcelain rather than plastic. The same material becomes tableware and bathroom fittings.' },
    { key: 'c5', name: 'Glass (soda-lime)', strength: 50, temp: 550, class: 'ceramic',
      use: 'Soda lime glass is the ordinary glass in windows, bottles and jars, made cheap by adding soda and lime to sand to lower the melting point. It is transparent and completely recyclable, but it cracks when one part of it is much hotter than another, so it cannot go from oven to cold water. Borosilicate, the ovenware glass, is the version that survives that.' },
    { key: 'c7', name: 'Boron carbide (B₄C)', strength: 500, temp: 800, class: 'ceramic',
      use: 'Boron carbide is one of the three hardest materials known, and it is remarkably light for a ceramic. Those two facts together are why it lines ballistic armour plate where weight matters. It also absorbs neutrons, giving it a second job as control rod material in nuclear reactors.' },

    // composites
    { key: 'cmp1', name: 'CFRP', strength: 800, temp: 180, class: 'composite',
      use: 'CFRP is carbon fibre held in an epoxy matrix. The fibres carry the load and the epoxy holds them in position and transfers force between them, so the properties depend entirely on which way the fibres run. Along the fibres it beats steel for strength at a fraction of the weight; across them it is comparatively weak. Used for aircraft structure, bike frames and racing cars, and limited mainly by cost.' },
    { key: 'cmp2', name: 'GFRP', strength: 300, temp: 200, class: 'composite',
      use: 'GFRP, better known as fibreglass, works exactly like carbon fibre but with glass fibres, which are heavier and less stiff but far cheaper. That trade lets it be used in quantity, so it becomes boat hulls, wind turbine blades, storage tanks and body panels. It is also easy to lay up by hand, which is why it is the composite most schools can actually work with.' },
    { key: 'cmp3', name: 'Kevlar/epoxy', strength: 400, temp: 180, class: 'composite',
      use: 'Kevlar is an aramid fibre with exceptional tensile strength, meaning it is very hard to pull apart, and it absorbs impact energy instead of shattering. Set in epoxy it becomes ballistic vests, helmets and ropes. It is poor in compression, so a Kevlar part is designed to be pulled and not pushed.' },

    // natural materials
    { key: 'cmp4', name: 'Plywood', strength: 40, temp: 150, class: 'natural',
      use: 'Plywood is thin veneers of wood glued in a stack with the grain of each layer turned across the one below. Wood is strong along its grain and weak across it, and this cross lamination cancels out that weakness, giving a sheet that is strong in both directions and resists splitting. Used for furniture, subfloors and structural sheathing.' },
    { key: 'n1', name: 'Bamboo', strength: 70, temp: 150, class: 'natural',
      use: 'Bamboo is a grass, not a tree, and it grows to full height in months rather than decades. Its hollow tube structure gives it a strength to weight ratio that compares with steel along the length of the stem, which is why it still serves as scaffolding on tall buildings across Asia. Also processed into flooring, furniture and textile fibre.' },
    { key: 'n2', name: 'Cork', strength: 2, temp: 100, class: 'natural',
      use: 'Cork is the bark of the cork oak, harvested without felling the tree, so the same tree is stripped every nine years or so for over a century. It is a foam of sealed gas filled cells, which makes it light, springy and insulating, and lets it spring back after being squeezed into a bottle neck. Also used for boards, flooring underlay and gaskets.' },
    { key: 'n3', name: 'Leather', strength: 15, temp: 150, class: 'natural',
      use: 'Leather is animal hide treated so it will not rot, a process called tanning. It is flexible, resists tearing and abrasion, and moulds to a shape with use, which is why it lasts in footwear, upholstery and belts. It also resists sparks well enough to make welding aprons.' },
    { key: 'n4', name: 'Oak wood', strength: 50, temp: 150, class: 'natural',
      use: 'Oak is a dense hardwood, strong enough for structural timber framing and attractive enough for furniture and flooring. Being a natural material, its properties vary between boards depending on how it grew, so figures on a chart are averages rather than guarantees. Its tight grain holds liquid, which is why whiskey and wine are aged in oak barrels.' },
];
const materialMap = Object.fromEntries(MATERIALS.map((m) => [m.key, m]));
const MAX_TOTAL = MATERIALS.length * 100;

// ── State ─────────────────────────────────────────────────────────
// key -> { fx, fy, attempts, points, locked }   (fx/fy are plot fractions,
// 0..1 with fy=0 at the bottom, so placements survive resizes)
let placements = {};
let finished = false;

// ── DOM ───────────────────────────────────────────────────────────
const mainEl = document.querySelector('.ashby-main');
const chartWrap = document.getElementById('chartWrap');
const canvas = document.getElementById('ashbyCanvas');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('chartTooltip');
const poolList = document.getElementById('poolList');
const poolCount = document.getElementById('poolCount');
const legendEl = document.getElementById('legend');
const scoreStat = document.getElementById('scoreStat');
const placedStat = document.getElementById('placedStat');
const totalStat = document.getElementById('totalStat');
const finishBtn = document.getElementById('finishBtn');
const resetBtn = document.getElementById('resetBtn');
const defEmoji = document.getElementById('defEmoji');
const defName = document.getElementById('defName');
const defText = document.getElementById('defText');
const defMeta = document.getElementById('defMeta');
const scoreModal = document.getElementById('scoreModal');
const scoreHero = document.getElementById('scoreHero');
const scoreRows = document.getElementById('scoreRows');

// ── Theme helpers (canvas repaints from the live CSS variables) ───
function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
function classColor(cls) {
    return getComputedStyle(mainEl).getPropertyValue('--mat-' + cls).trim();
}

// ── Coordinates ───────────────────────────────────────────────────
let cssW = 0, cssH = 0;
const PAD = { left: 48, right: 14, top: 12, bottom: 36 };

function plotRect() {
    return { x: PAD.left, y: PAD.top, w: cssW - PAD.left - PAD.right, h: cssH - PAD.top - PAD.bottom };
}
function tempToFx(t) { return (Math.log10(t) - Math.log10(TEMP_MIN)) / (Math.log10(TEMP_MAX) - Math.log10(TEMP_MIN)); }
function strToFy(s)  { return (Math.log10(s) - Math.log10(STR_MIN))  / (Math.log10(STR_MAX)  - Math.log10(STR_MIN)); }
function fracToPx(fx, fy) {
    const p = plotRect();
    return { x: p.x + fx * p.w, y: p.y + (1 - fy) * p.h };
}
function pxToFrac(x, y) {
    const p = plotRect();
    return {
        fx: Math.min(1, Math.max(0, (x - p.x) / p.w)),
        fy: Math.min(1, Math.max(0, 1 - (y - p.y) / p.h)),
    };
}
function truePos(mat) { return { fx: tempToFx(mat.temp), fy: strToFy(mat.strength) }; }

// ── Scoring ───────────────────────────────────────────────────────
function computePoints(mat, fx, fy) {
    const t = truePos(mat);
    const dist = Math.hypot(fx - t.fx, fy - t.fy);
    if (dist <= FULL_DIST) return 100;
    if (dist >= ZERO_DIST) return 0;
    return Math.round(100 * (1 - (dist - FULL_DIST) / (ZERO_DIST - FULL_DIST)));
}
function tierLabel(pts) {
    if (pts >= 90) return '\u{1F3AF} Bullseye';
    if (pts >= 70) return '\u{1F525} Hot';
    if (pts >= 40) return '\u{1F324}️ Warm';
    if (pts > 0)  return '❄️ Cold';
    return '\u{1F9CA} Frozen';
}
function hintFor(mat, fx, fy) {
    const t = truePos(mat);
    const parts = [];
    if (t.fy - fy > HINT_DELTA) parts.push('it’s stronger than that ⬆️');
    else if (fy - t.fy > HINT_DELTA) parts.push('it’s weaker than that ⬇️');
    if (t.fx - fx > HINT_DELTA) parts.push('it handles more heat ➡️');
    else if (fx - t.fx > HINT_DELTA) parts.push('it handles less heat ⬅️');
    return parts.length ? parts.join(' and ') : 'you’re extremely close, tiny nudge!';
}

// ── Canvas sizing (crisp on any DPR, responsive on any screen) ────
function resizeCanvas() {
    const rect = chartWrap.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = window.devicePixelRatio || 1;
    cssW = rect.width;
    cssH = rect.height;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
}
new ResizeObserver(resizeCanvas).observe(chartWrap);

// Repaint when the site theme (skin) changes.
new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// ── Drawing ───────────────────────────────────────────────────────
const TEMP_TICKS = [10, 30, 100, 300, 1000, 3000, 10000];
const STR_TICKS = [0.01, 0.1, 1, 10, 100, 1000];

function draw() {
    if (!cssW) return;
    const p = plotRect();
    const mono = cssVar('--font-mono') || 'monospace';
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = cssVar('--surface') || '#fff';
    ctx.fillRect(0, 0, cssW, cssH);

    // recessive grid
    ctx.strokeStyle = cssVar('--border') || '#ddd';
    ctx.lineWidth = 1;
    ctx.font = '10px ' + mono;
    ctx.fillStyle = cssVar('--muted') || '#777';
    TEMP_TICKS.forEach((t) => {
        const x = fracToPx(tempToFx(t), 0).x;
        ctx.beginPath(); ctx.moveTo(x, p.y); ctx.lineTo(x, p.y + p.h); ctx.stroke();
        ctx.textAlign = 'center';
        ctx.fillText(String(t), x, p.y + p.h + 14);
    });
    STR_TICKS.forEach((s) => {
        const y = fracToPx(0, strToFy(s)).y;
        ctx.beginPath(); ctx.moveTo(p.x, y); ctx.lineTo(p.x + p.w, y); ctx.stroke();
        ctx.textAlign = 'right';
        ctx.fillText(String(s), p.x - 6, y + 3);
    });

    // axis titles
    ctx.fillStyle = cssVar('--text') || '#111';
    ctx.font = '600 11px ' + mono;
    ctx.textAlign = 'center';
    ctx.fillText('max service temperature (°C, log)', p.x + p.w / 2, cssH - 6);
    ctx.save();
    ctx.translate(12, p.y + p.h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('strength (MPa, log)', 0, 0);
    ctx.restore();

    const surface = cssVar('--surface') || '#fff';
    const mutedC = cssVar('--muted') || '#777';

    // reveal layer for locked materials: dashed connector + true-position ring
    Object.entries(placements).forEach(([key, pl]) => {
        if (!pl.locked) return;
        const mat = materialMap[key];
        const color = classColor(mat.class);
        const t = truePos(mat);
        const a = fracToPx(pl.fx, pl.fy);
        const b = fracToPx(t.fx, t.fy);
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = mutedC;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(b.x, b.y, MARKER_R - 2, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // student markers: filled dot, 2px surface ring; dashed halo = still movable
    Object.entries(placements).forEach(([key, pl]) => {
        const mat = materialMap[key];
        const color = classColor(mat.class);
        const a = fracToPx(pl.fx, pl.fy);
        if (!pl.locked) {
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(a.x, a.y, MARKER_R + 4, 0, 2 * Math.PI); ctx.stroke();
            ctx.setLineDash([]);
        }
        ctx.beginPath();
        ctx.arc(a.x, a.y, MARKER_R, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = surface;
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// ── Legend ────────────────────────────────────────────────────────
function buildLegend() {
    legendEl.innerHTML = '';
    CLASSES.forEach((c) => {
        const item = document.createElement('span');
        item.className = 'ashby-legend-item';
        const dot = document.createElement('span');
        dot.className = 'ashby-legend-dot';
        dot.style.background = 'var(--mat-' + c.id + ')';
        item.appendChild(dot);
        item.appendChild(document.createTextNode(c.emoji + ' ' + c.label));
        legendEl.appendChild(item);
    });
}

// ── Pool ──────────────────────────────────────────────────────────
function renderPool() {
    poolList.innerHTML = '';
    let remaining = 0;
    CLASSES.forEach((c) => {
        const mats = MATERIALS.filter((m) => m.class === c.id && !placements[m.key]);
        if (!mats.length) return;
        remaining += mats.length;
        const label = document.createElement('div');
        label.className = 'ashby-pool-group-label';
        label.textContent = c.label;
        poolList.appendChild(label);
        const group = document.createElement('div');
        group.className = 'ashby-pool-group';
        mats.forEach((mat) => {
            const chip = document.createElement('div');
            chip.className = 'mat-card';
            chip.dataset.key = mat.key;
            const dot = document.createElement('span');
            dot.className = 'mat-dot';
            dot.style.background = 'var(--mat-' + mat.class + ')';
            chip.appendChild(dot);
            chip.appendChild(document.createTextNode(mat.name));
            chip.addEventListener('pointerdown', (e) => startPoolDrag(e, mat.key, chip));
            group.appendChild(chip);
        });
        poolList.appendChild(group);
    });
    if (!remaining) {
        const done = document.createElement('div');
        done.className = 'ashby-pool-empty';
        done.textContent = finished
            ? 'Game over. Open the score card from the toolbar.'
            : 'All materials placed! Re-drag any unlocked marker, or hit Finish.';
        poolList.appendChild(done);
    }
    poolCount.textContent = remaining + ' left';
}

// ── Inspector / feedback panel ────────────────────────────────────
function inspect(key, feedbackHtml) {
    const mat = materialMap[key];
    const pl = placements[key];
    defEmoji.textContent = classInfo[mat.class].emoji;
    defName.textContent = mat.name;
    defText.textContent = mat.use;
    let meta = classInfo[mat.class].label.replace(/s$/, '').toLowerCase();
    if (pl && pl.locked) {
        meta += ' · \u{1F4AA} ' + mat.strength + ' MPa · \u{1F525} ' + mat.temp + ' °C · ' +
                tierLabel(pl.points) + ' · ' + pl.points + ' pts';
    } else if (pl) {
        meta += ' · ' + (MAX_ATTEMPTS - pl.attempts) + ' attempt' + (MAX_ATTEMPTS - pl.attempts === 1 ? '' : 's') +
                ' left · \u{1F512} real values revealed when locked';
    } else {
        meta += ' · not placed yet · \u{1F512} real values revealed when locked';
    }
    defMeta.innerHTML = feedbackHtml ? feedbackHtml + '<br>' + meta : meta;
}

// Transient feedback bubble at the drop point, since the def panel may be
// scrolled out of view on small screens.
let toastTimer = null;
function showToast(pt, text) {
    clearTimeout(toastTimer);
    tooltip.textContent = text;
    tooltip.hidden = false;
    const tx = Math.min(Math.max(4, pt.x + 14), cssW - tooltip.offsetWidth - 4);
    const ty = Math.min(Math.max(4, pt.y - tooltip.offsetHeight - 14), cssH - tooltip.offsetHeight - 4);
    tooltip.style.left = tx + 'px';
    tooltip.style.top = ty + 'px';
    toastTimer = setTimeout(() => { tooltip.hidden = true; }, 2000);
}

// ── HUD ───────────────────────────────────────────────────────────
function totalScore() {
    return Object.values(placements).reduce((s, p) => s + p.points, 0);
}
function updateHUD() {
    scoreStat.textContent = totalScore();
    placedStat.textContent = Object.keys(placements).length;
    totalStat.textContent = MATERIALS.length;
    if (finished) {
        finishBtn.disabled = false;
        finishBtn.innerHTML = '\u{1F4CB} Score card';
    } else {
        finishBtn.disabled = Object.keys(placements).length < MATERIALS.length;
        finishBtn.innerHTML = '\u{1F3C1} Finish';
    }
}

// ── Placement (one attempt) ───────────────────────────────────────
function placeAttempt(key, clientX, clientY) {
    const mat = materialMap[key];
    const rect = chartWrap.getBoundingClientRect();
    const { fx, fy } = pxToFrac(clientX - rect.left, clientY - rect.top);
    const pl = placements[key] || (placements[key] = { fx: 0, fy: 0, attempts: 0, points: 0, locked: false });
    pl.fx = fx;
    pl.fy = fy;
    pl.attempts += 1;
    pl.points = computePoints(mat, fx, fy);
    pl.locked = pl.attempts >= MAX_ATTEMPTS;

    const tier = tierLabel(pl.points);
    if (pl.locked) {
        inspect(key, '<span class="good">\u{1F512} Locked in: ' + tier + ', +' + pl.points +
            ' pts.</span> The ring shows where ' + mat.name + ' really belongs.');
    } else {
        inspect(key, '<span class="good">' + tier + ': ' + pl.points + ' pts.</span> ' +
            '<span class="warn">Hint: ' + hintFor(mat, fx, fy) + '.</span> Drag the marker for your final attempt, or leave it.');
    }

    renderPool();
    updateHUD();
    draw();
    showToast(fracToPx(fx, fy), '+' + pl.points + ' pts · ' + tier + (pl.locked ? ' \u{1F512}' : ''));

    if (!finished && Object.values(placements).length === MATERIALS.length &&
        Object.values(placements).every((p) => p.locked)) {
        finishGame();
    }
}

// ── Finish + score card ───────────────────────────────────────────
function finishGame() {
    finished = true;
    Object.values(placements).forEach((p) => { p.locked = true; });
    renderPool();
    updateHUD();
    draw();
    openScoreCard();
}

function rankFor(pct) {
    if (pct >= 90) return '\u{1F3C5} Materials Master';
    if (pct >= 75) return '⭐ Alloy Ace';
    if (pct >= 60) return '\u{1F44D} Solid Selector';
    if (pct >= 40) return '\u{1F331} Apprentice Engineer';
    return '\u{1F9F1} Rookie. Study the chart and go again!';
}

function openScoreCard() {
    const total = totalScore();
    const pct = Math.round((total / MAX_TOTAL) * 100);
    const stars = Math.max(0, Math.min(5, Math.round(pct / 20)));
    scoreHero.innerHTML =
        '<div class="ashby-score-total">' + total + ' <span style="font-size:1rem;color:var(--muted);">/ ' + MAX_TOTAL + '</span></div>' +
        '<div class="ashby-score-sub">' + pct + '% accuracy · ' + '⭐'.repeat(stars) + '☆'.repeat(5 - stars) + '</div>' +
        '<div class="ashby-score-rank">' + rankFor(pct) + '</div>';

    scoreRows.innerHTML = '';
    MATERIALS
        .map((mat) => ({ mat, pl: placements[mat.key] }))
        .sort((a, b) => (b.pl ? b.pl.points : 0) - (a.pl ? a.pl.points : 0))
        .forEach(({ mat, pl }) => {
            const tr = document.createElement('tr');
            const pts = pl ? pl.points : 0;
            const attempts = pl ? pl.attempts : 0;
            tr.innerHTML =
                '<td>' + mat.name + '</td>' +
                '<td><span class="ashby-score-class"><span class="ashby-legend-dot" style="background:var(--mat-' + mat.class + ')"></span>' +
                classInfo[mat.class].label + '</span></td>' +
                '<td>' + attempts + '/' + MAX_ATTEMPTS + '</td>' +
                '<td class="pts">' + pts + ' ' + tierLabel(pts).split(' ')[0] + '</td>';
            scoreRows.appendChild(tr);
        });
    scoreModal.hidden = false;
}

// ── Reset ─────────────────────────────────────────────────────────
function resetGame() {
    placements = {};
    finished = false;
    renderPool();
    updateHUD();
    draw();
    defEmoji.textContent = '\u{1F44B}';
    defName.textContent = 'Where does each material belong?';
    defText.innerHTML = 'Drag a material from the pool onto the chart. The closer you land to its real strength and service temperature, the more points you earn, up to 100 each. You get <strong>' + MAX_ATTEMPTS + ' attempts</strong> per material: after the first drop you’ll get a hint, and you can drag the marker once more. When every material is placed, hit <em>Finish</em> for your score card.';
    defMeta.textContent = '';
}

// ═══════════════════════════════════════════════════════════════════
//  POINTER INPUT: works with mouse, touch, and pen
// ═══════════════════════════════════════════════════════════════════

// Pool chip → chart (a ghost chip follows the pointer)
function startPoolDrag(e, key, chip) {
    if (finished) { inspect(key); return; }
    e.preventDefault();
    const startX = e.clientX, startY = e.clientY;
    let ghost = null;

    const onMove = (ev) => {
        if (!ghost && Math.hypot(ev.clientX - startX, ev.clientY - startY) < DRAG_THRESHOLD) return;
        if (!ghost) {
            ghost = chip.cloneNode(true);
            ghost.classList.add('mat-ghost');
            document.body.appendChild(ghost);
        }
        ghost.style.left = (ev.clientX - ghost.offsetWidth / 2) + 'px';
        ghost.style.top = (ev.clientY - ghost.offsetHeight / 2) + 'px';
    };
    const onUp = (ev) => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        if (ghost) ghost.remove();
        if (ev.type === 'pointercancel') return;
        if (!ghost) { inspect(key); return; }           // tap = inspect
        const r = chartWrap.getBoundingClientRect();
        if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) {
            placeAttempt(key, ev.clientX, ev.clientY);
        }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
}

// Hit-test placed markers (generous radius for fingers)
function markerAt(clientX, clientY) {
    const rect = chartWrap.getBoundingClientRect();
    const x = clientX - rect.left, y = clientY - rect.top;
    let best = null, bestDist = HIT_R;
    Object.entries(placements).forEach(([key, pl]) => {
        const a = fracToPx(pl.fx, pl.fy);
        const d = Math.hypot(a.x - x, a.y - y);
        if (d < bestDist) { best = key; bestDist = d; }
    });
    return best;
}

// Marker drag (second attempt) / tap to inspect
canvas.addEventListener('pointerdown', (e) => {
    const key = markerAt(e.clientX, e.clientY);
    if (!key) return;
    e.preventDefault();
    const pl = placements[key];
    if (pl.locked || finished) {
        inspect(key, '<span class="warn">\u{1F512} ' + materialMap[key].name + ' is locked. No attempts left.</span>');
        return;
    }
    const startX = e.clientX, startY = e.clientY;
    const origFx = pl.fx, origFy = pl.fy;
    let moved = false;

    const onMove = (ev) => {
        if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) < DRAG_THRESHOLD) return;
        moved = true;
        const rect = chartWrap.getBoundingClientRect();
        const f = pxToFrac(ev.clientX - rect.left, ev.clientY - rect.top);
        pl.fx = f.fx;
        pl.fy = f.fy;
        draw();
    };
    const onUp = (ev) => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        if (!moved || ev.type === 'pointercancel') {
            pl.fx = origFx;                              // tap or cancel = no attempt spent
            pl.fy = origFy;
            draw();
            if (!moved) inspect(key);
            return;
        }
        placeAttempt(key, ev.clientX, ev.clientY);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
});

// Hover tooltip on markers (mouse only, touch has tap-to-inspect)
canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || e.buttons) return;
    const key = markerAt(e.clientX, e.clientY);
    if (!key) {
        tooltip.hidden = true;
        canvas.style.cursor = 'crosshair';
        return;
    }
    const mat = materialMap[key];
    const pl = placements[key];
    tooltip.textContent = mat.name + (pl.locked
        ? ' · ' + pl.points + ' pts'
        : ' · ' + (MAX_ATTEMPTS - pl.attempts) + ' attempt' + (MAX_ATTEMPTS - pl.attempts === 1 ? '' : 's') + ' left');
    tooltip.hidden = false;
    const rect = chartWrap.getBoundingClientRect();
    const tx = Math.min(e.clientX - rect.left + 14, rect.width - tooltip.offsetWidth - 4);
    const ty = Math.max(4, e.clientY - rect.top - tooltip.offsetHeight - 10);
    tooltip.style.left = tx + 'px';
    tooltip.style.top = ty + 'px';
    canvas.style.cursor = pl.locked ? 'default' : 'grab';
});
canvas.addEventListener('pointerleave', () => { tooltip.hidden = true; });

// ── Toolbar + modal wiring ────────────────────────────────────────
finishBtn.addEventListener('click', () => {
    if (finished) openScoreCard();
    else finishGame();
});
resetBtn.addEventListener('click', () => {
    if (Object.keys(placements).length && !window.confirm('Reset the game and clear all placements?')) return;
    resetGame();
});
document.getElementById('playAgainBtn').addEventListener('click', () => {
    scoreModal.hidden = true;
    resetGame();
});
scoreModal.querySelectorAll('[data-score-close]').forEach((el) => {
    el.addEventListener('click', () => { scoreModal.hidden = true; });
});

// ── Init ──────────────────────────────────────────────────────────
buildLegend();
renderPool();
updateHUD();
resizeCanvas();
