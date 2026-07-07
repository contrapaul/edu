// ═══════════════════════════════════════════════════════════════════
//  Ashby Chart Challenge — pointer-driven placement game
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
      use: 'Mild steel (low carbon steel) is widely used in construction (beams, reinforcement), automobile bodies, and pipelines due to its good formability, weldability, and moderate strength.' },
    { key: 'm2', name: 'Stainless 304', strength: 550, temp: 870, class: 'metal',
      use: 'Stainless steel 304 (18/8 chromium-nickel) offers excellent corrosion resistance. Used in kitchen equipment, chemical containers, and architectural trim.' },
    { key: 'm3', name: 'Aluminium 6061', strength: 310, temp: 350, class: 'metal',
      use: 'Aluminium 6061 is a precipitation-hardened alloy with good mechanical properties and weldability. Common in bicycle frames, aircraft fittings, and marine components.' },
    { key: 'm4', name: 'Copper', strength: 220, temp: 400, class: 'metal',
      use: 'Copper is prized for electrical conductivity (wiring, motors) and thermal conductivity (heat exchangers, cookware). Also used in roofing and plumbing.' },
    { key: 'm5', name: 'Titanium Ti-6Al-4V', strength: 950, temp: 600, class: 'metal',
      use: 'Ti-6Al-4V (alpha-beta alloy) has exceptional strength-to-weight ratio and biocompatibility. Aerospace structural parts, surgical implants, and high-performance automotive.' },
    { key: 'm6', name: 'Magnesium alloy', strength: 230, temp: 350, class: 'metal',
      use: 'Magnesium alloys are the lightest structural metals. Used in lightweight casings for electronics, power tools, and automotive parts where weight saving is critical.' },
    { key: 'm7', name: 'Cast iron', strength: 250, temp: 800, class: 'metal',
      use: 'Cast iron (grey or ductile) has good castability, vibration damping, and wear resistance. Engine blocks, machine tool bases, and brake discs.' },
    { key: 'm8', name: 'Nickel superalloy', strength: 1100, temp: 1050, class: 'metal',
      use: 'Nickel-based superalloys (e.g., Inconel) retain strength at high temperatures. Used in gas turbine blades, rocket engines, and nuclear reactors.' },

    // polymers
    { key: 'p1', name: 'HDPE', strength: 30, temp: 80, class: 'polymer',
      use: 'High-density polyethylene (HDPE) – strong, chemical resistant. Used for blow-moulded bottles, fuel tanks, cutting boards, and corrosion-resistant piping.' },
    { key: 'p2', name: 'Polypropylene (PP)', strength: 35, temp: 100, class: 'polymer',
      use: 'Polypropylene (PP) is a semi-rigid polymer with good fatigue resistance. Food containers, hinges (living hinges), automotive interior trim, and medical syringes.' },
    { key: 'p3', name: 'Nylon 6,6', strength: 85, temp: 150, class: 'polymer',
      use: 'Nylon 6,6 (polyamide) has high strength, abrasion resistance, and low friction. Gears, bearings, textile fibres, and zip ties.' },
    { key: 'p4', name: 'PMMA (acrylic)', strength: 70, temp: 90, class: 'polymer',
      use: 'Polymethyl methacrylate (PMMA / acrylic) is a transparent, shatter-resistant glass substitute. Used for lenses, aquariums, signage, and automotive tail lights.' },
    { key: 'p5', name: 'PTFE (Teflon™)', strength: 25, temp: 260, class: 'polymer',
      use: 'Polytetrafluoroethylene (PTFE) has extremely low friction and high chemical resistance. Non-stick coatings, seals, gaskets, and electrical insulation.' },
    { key: 'p6', name: 'Epoxy', strength: 90, temp: 180, class: 'polymer',
      use: 'Epoxy resins are thermosetting polymers with high adhesion and mechanical strength. Used as adhesives, coatings, and matrix for fibre-reinforced composites.' },
    { key: 'p7', name: 'Silicone elastomer', strength: 7, temp: 230, class: 'polymer',
      use: 'Silicone rubber remains flexible over a wide temperature range. Medical tubing, baking moulds, seals, and electrical insulation.' },
    { key: 'c2', name: 'PETG', strength: 50, temp: 75, class: 'polymer',
      use: 'Polyethylene terephthalate glycol (PETG) is a clear, impact-resistant thermoplastic. Easily thermoformed or 3D printed. Used for food containers, displays, and protective guards.' },
    { key: 'c6', name: 'ABS', strength: 40, temp: 100, class: 'polymer',
      use: 'Acrylonitrile butadiene styrene (ABS) is a tough, impact-resistant thermoplastic. Used for LEGO bricks, automotive dashboards, power tool housings, and 3D printing filaments.' },

    // ceramics
    { key: 'c1', name: 'Alumina (Al₂O₃)', strength: 350, temp: 1750, class: 'ceramic',
      use: 'Alumina (aluminium oxide) is a hard, wear-resistant ceramic with high electrical insulation. Used in spark plugs, grinding media, electronic substrates, and biomedical implants.' },
    { key: 'c3', name: 'Silicon carbide (SiC)', strength: 400, temp: 2600, class: 'ceramic',
      use: 'Silicon carbide is an ultra-hard ceramic with high thermal conductivity. Used in abrasives, brake discs, armour, and high-temperature semiconductor components.' },
    { key: 'c4', name: 'Porcelain', strength: 60, temp: 1400, class: 'ceramic',
      use: 'Porcelain (a vitrified ceramic) has high electrical resistivity and low porosity. Electrical insulators, tableware, and bathroom fixtures.' },
    { key: 'c5', name: 'Glass (soda-lime)', strength: 50, temp: 550, class: 'ceramic',
      use: 'Soda-lime glass is the most common glass. Windows, bottles, and light bulbs. It is transparent, low-cost, but has moderate thermal shock resistance.' },
    { key: 'c7', name: 'Boron carbide (B₄C)', strength: 500, temp: 800, class: 'ceramic',
      use: 'Boron carbide is one of the hardest materials, with low density. Used in ballistic armour, nozzle liners, and as a neutron absorber in nuclear applications.' },

    // composites
    { key: 'cmp1', name: 'CFRP', strength: 800, temp: 180, class: 'composite',
      use: 'Carbon fibre reinforced polymer (CFRP) – carbon fibres in an epoxy matrix. Ultra-high strength-to-weight ratio. Aerospace structures, sports equipment (bikes, tennis rackets), and high-end automotive.' },
    { key: 'cmp2', name: 'GFRP', strength: 300, temp: 200, class: 'composite',
      use: 'Glass fibre reinforced polymer (GFRP / fibreglass) – glass fibres in polyester or epoxy. Boat hulls, wind turbine blades, storage tanks, and automotive body panels.' },
    { key: 'cmp3', name: 'Kevlar/epoxy', strength: 400, temp: 180, class: 'composite',
      use: 'Kevlar (aramid) fibre reinforced epoxy. High tensile strength and impact resistance. Ballistic vests, ropes, helmets, and sporting goods.' },

    // natural materials
    { key: 'cmp4', name: 'Plywood', strength: 40, temp: 150, class: 'natural',
      use: 'Plywood is an engineered wood composite made from thin veneers cross‑laminated. Furniture, subflooring, and structural sheathing.' },
    { key: 'n1', name: 'Bamboo', strength: 70, temp: 150, class: 'natural',
      use: 'Bamboo is a fast-growing grass with high strength-to-weight ratio. Used for flooring, scaffolding (in Asia), furniture, and textile fibres.' },
    { key: 'n2', name: 'Cork', strength: 2, temp: 100, class: 'natural',
      use: 'Cork is harvested from cork oak bark. It is lightweight, compressible, and insulating. Wine stoppers, bulletin boards, flooring underlayment, and gaskets.' },
    { key: 'n3', name: 'Leather', strength: 15, temp: 150, class: 'natural',
      use: 'Leather (treated animal hide) is flexible and durable. Upholstery, footwear, belts, and protective clothing (welding aprons).' },
    { key: 'n4', name: 'Oak wood', strength: 50, temp: 150, class: 'natural',
      use: 'Oak is a dense hardwood with good strength and attractive grain. Timber framing, furniture, flooring, and whiskey barrels.' },
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
    return parts.length ? parts.join(' and ') : 'you’re extremely close — tiny nudge!';
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
            ? 'Game over — open the score card from the toolbar.'
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

// Transient feedback bubble at the drop point — the def panel may be
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
            '<span class="warn">Hint: ' + hintFor(mat, fx, fy) + '.</span> Drag the marker for your final attempt — or leave it.');
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
    return '\u{1F9F1} Rookie — study the chart and go again!';
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
    defText.innerHTML = 'Drag a material from the pool onto the chart — the closer you land to its real strength and service temperature, the more points you earn (up to 100 each). You get <strong>' + MAX_ATTEMPTS + ' attempts</strong> per material: after the first drop you’ll get a hint, and you can drag the marker once more. When every material is placed, hit <em>Finish</em> for your score card.';
    defMeta.textContent = '';
}

// ═══════════════════════════════════════════════════════════════════
//  POINTER INPUT — works with mouse, touch, and pen
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
        inspect(key, '<span class="warn">\u{1F512} ' + materialMap[key].name + ' is locked — no attempts left.</span>');
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

// Hover tooltip on markers (mouse only — touch has tap-to-inspect)
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
