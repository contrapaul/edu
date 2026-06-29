// ═══════════════════════════════════════════════════════════════════
//  Composite Craft — pointer-driven Infinite-Craft-style engine
// ═══════════════════════════════════════════════════════════════════

const BASE_IDS = ['metal', 'carbon', 'ceramic', 'polymer'];
const STORAGE_KEY = 'compositeCraft';
const DRAG_THRESHOLD = 5; // px of movement before a press counts as a drag

// ── Data ──────────────────────────────────────────────────────────
let DISCOVERIES = [];
let discoveryMap = {};     // id -> discovery
let recipeMap = {};        // "a|b" (sorted) -> product id  (forward)
let reverseMap = {};       // "product|ingredient" -> other ingredient  (decompose)

// ── State ─────────────────────────────────────────────────────────
let discovered = new Set();
let placed = [];           // [{ instanceId, id, x, y }]
let instanceSeq = 1;
let lastSelectedId = null;  // most-recently inspected item (for the recipe book)

// ── DOM ───────────────────────────────────────────────────────────
const invList = document.getElementById('inventoryList');
const searchInput = document.getElementById('searchInput');
const dropZone = document.getElementById('dropZone');
const discoveryCountEl = document.getElementById('discoveryCount');
const defEmoji = document.getElementById('defEmoji');
const defName = document.getElementById('defName');
const defText = document.getElementById('defText');
const defMeta = document.getElementById('defMeta');
const recipesModal = document.getElementById('recipesModal');
const recipeItemsEl = document.getElementById('recipeItems');
const recipeDetailEl = document.getElementById('recipeDetail');
const recipeSearch = document.getElementById('recipeSearch');

// ═══════════════════════════════════════════════════════════════════
//  LOAD
// ═══════════════════════════════════════════════════════════════════
async function loadData() {
    try {
        const [discRes, recipeRes] = await Promise.all([
            fetch('discoveries.json'),
            fetch('recipes.json'),
        ]);
        const discData = await discRes.json();
        const recipeData = await recipeRes.json();
        DISCOVERIES = discData.discoveries || discData;
        const recipes = recipeData.recipes || recipeData;

        discoveryMap = Object.fromEntries(DISCOVERIES.map((d) => [d.id, d]));
        recipeMap = {};
        recipes.forEach((r) => {
            recipeMap[[...r.ingredients].sort().join('|')] = r.id;
        });

        // Decomposition: A + B -> C also lets C + A -> B (and C + B -> A).
        // Forward recipes win, so this only fills pairs nothing already covers.
        reverseMap = {};
        recipes.forEach((r) => {
            const [a, b] = r.ingredients;
            addReverse(r.id, a, b);
            addReverse(r.id, b, a);
        });

        initGame();
    } catch (err) {
        console.error('Failed to load data:', err);
        dropZone.innerHTML =
            `<div class="craft-placeholder"><span class="craft-big-emoji">&#x26A0;&#xFE0F;</span>` +
            `Failed to load game data.<br>${err.message}</div>`;
    }
}

// Register one decomposition: using `used` on `product` yields `returned`.
// Forward recipes take precedence; among ambiguous reverses, first wins.
function addReverse(product, used, returned) {
    const key = [product, used].sort().join('|');
    if (recipeMap[key] !== undefined) return;
    if (reverseMap[key] !== undefined) return;
    reverseMap[key] = returned;
}

// ═══════════════════════════════════════════════════════════════════
//  PERSISTENCE
// ═══════════════════════════════════════════════════════════════════
function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...discovered]));
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) JSON.parse(raw).forEach((id) => discovered.add(id));
    } catch (_) {}
    BASE_IDS.forEach((id) => discovered.add(id));
}

// ═══════════════════════════════════════════════════════════════════
//  STATS + DEFINITION PANEL
// ═══════════════════════════════════════════════════════════════════
function updateStats() {
    discoveryCountEl.textContent = discovered.size;
}

// Persistent panel: keeps the last selection until a new one is shown.
function showDefinition(id) {
    const d = discoveryMap[id];
    if (!d) return;
    lastSelectedId = id;
    defEmoji.textContent = d.emoji;
    defName.textContent = d.name;
    defText.textContent = d.definition;
    defMeta.textContent = d.category;
}

// ═══════════════════════════════════════════════════════════════════
//  INVENTORY
// ═══════════════════════════════════════════════════════════════════
function renderInventory() {
    const query = (searchInput.value || '').trim().toLowerCase();
    const items = DISCOVERIES
        .filter((d) => discovered.has(d.id))
        .filter((d) => !query || d.name.toLowerCase().includes(query))
        .sort((a, b) => {
            const ra = a.tier === 0 ? 99 : a.tier;
            const rb = b.tier === 0 ? 99 : b.tier;
            return ra - rb || a.name.localeCompare(b.name);
        });

    invList.innerHTML = '';
    if (items.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'craft-inv-empty';
        empty.textContent = 'No matching materials.';
        invList.appendChild(empty);
        return;
    }
    items.forEach((d) => {
        const div = document.createElement('div');
        div.className = 'craft-inv-item';
        div.dataset.id = d.id;
        div.innerHTML = `<span class="emoji">${d.emoji}</span><span class="name">${d.name}</span>`;
        div.addEventListener('pointerdown', (e) => startInventoryDrag(e, d.id));
        invList.appendChild(div);
    });
}

// ═══════════════════════════════════════════════════════════════════
//  CANVAS RENDERING
// ═══════════════════════════════════════════════════════════════════
function renderWorkbench() {
    dropZone.querySelectorAll('.craft-card').forEach((c) => c.remove());
    placed.forEach((entry) => dropZone.appendChild(buildCard(entry)));
    togglePlaceholder();
}

function togglePlaceholder() {
    let ph = dropZone.querySelector('.craft-placeholder');
    if (placed.length === 0) {
        if (!ph) {
            ph = document.createElement('div');
            ph.className = 'craft-placeholder';
            ph.innerHTML =
                `<span class="craft-big-emoji">&#x1F6E0;&#xFE0F;</span>` +
                `Drag or click materials from your inventory,<br>then drop one onto another to combine.`;
            dropZone.appendChild(ph);
        }
    } else if (ph) {
        ph.remove();
    }
}

function buildCard(entry) {
    const d = discoveryMap[entry.id];
    const card = document.createElement('div');
    card.className = 'craft-card';
    card.style.left = entry.x + 'px';
    card.style.top = entry.y + 'px';
    card.dataset.instanceId = entry.instanceId;
    card.innerHTML =
        `<span class="craft-card-emoji">${d.emoji}</span>` +
        `<span class="craft-card-name">${d.name}</span>` +
        `<button class="craft-card-del" title="Remove">&times;</button>`;
    card.querySelector('.craft-card-del').addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        removeCard(entry.instanceId);
    });
    card.addEventListener('pointerdown', (e) => startCardDrag(e, entry, card));
    return card;
}

function removeCard(instanceId) {
    placed = placed.filter((p) => p.instanceId !== instanceId);
    renderWorkbench();
}

function spawnCard(id, x, y) {
    const entry = { instanceId: instanceSeq++, id, x, y };
    placed.push(entry);
    return entry;
}

// Faux-random spot in the middle ~60% of the canvas, so clicked cards scatter
// instead of stacking dead-centre but still stay comfortably in view.
function randomCardPos(zone) {
    const cardW = 110, cardH = 48;
    const x = zone.width * 0.2 + Math.random() * Math.max(0, zone.width * 0.6 - cardW);
    const y = zone.height * 0.2 + Math.random() * Math.max(0, zone.height * 0.6 - cardH);
    return { x: Math.round(x), y: Math.round(y) };
}

// ═══════════════════════════════════════════════════════════════════
//  DRAGGING — inventory → canvas (clone follows the pointer)
// ═══════════════════════════════════════════════════════════════════
function startInventoryDrag(e, id) {
    e.preventDefault();
    showDefinition(id);

    const startX = e.clientX;
    const startY = e.clientY;
    let ghost = null;
    let dragging = false;

    const onMove = (ev) => {
        if (!dragging) {
            if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < DRAG_THRESHOLD) return;
            dragging = true;
            ghost = makeGhost(id);
        }
        positionGhost(ghost, ev.clientX, ev.clientY);
    };

    const onUp = (ev) => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        if (ghost) ghost.remove();

        const zone = dropZone.getBoundingClientRect();
        const inside = ev.clientX >= zone.left && ev.clientX <= zone.right &&
                       ev.clientY >= zone.top && ev.clientY <= zone.bottom;

        if (!dragging) {
            // Treated as a click: scatter around the centre so cards don't stack.
            const pos = randomCardPos(zone);
            spawnCard(id, pos.x, pos.y);
            renderWorkbench();
            return;
        }
        if (!inside) return;

        const x = ev.clientX - zone.left - 45;
        const y = ev.clientY - zone.top - 22;
        const target = cardUnder(ev.clientX, ev.clientY, null);
        if (target) {
            combine(id, target.dataset.instanceId, x, y);
        } else {
            spawnCard(id, x, y);
            renderWorkbench();
        }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
}

// ═══════════════════════════════════════════════════════════════════
//  DRAGGING — existing canvas card
// ═══════════════════════════════════════════════════════════════════
function startCardDrag(e, entry, card) {
    if (e.button !== 0) return;
    e.preventDefault();
    showDefinition(entry.id);

    const zone = dropZone.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const offX = e.clientX - card.getBoundingClientRect().left;
    const offY = e.clientY - card.getBoundingClientRect().top;
    let dragging = false;

    const onMove = (ev) => {
        if (!dragging) {
            if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < DRAG_THRESHOLD) return;
            dragging = true;
            card.classList.add('dragging');
        }
        entry.x = ev.clientX - zone.left - offX;
        entry.y = ev.clientY - zone.top - offY;
        card.style.left = entry.x + 'px';
        card.style.top = entry.y + 'px';

        const target = cardUnder(ev.clientX, ev.clientY, entry.instanceId);
        dropZone.querySelectorAll('.craft-card.combine-target')
            .forEach((c) => c.classList.remove('combine-target'));
        if (target) target.classList.add('combine-target');
    };

    const onUp = (ev) => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        card.classList.remove('dragging');
        dropZone.querySelectorAll('.craft-card.combine-target')
            .forEach((c) => c.classList.remove('combine-target'));
        if (!dragging) return; // a plain click just shows the definition

        const target = cardUnder(ev.clientX, ev.clientY, entry.instanceId);
        if (target) {
            const targetId = Number(target.dataset.instanceId);
            const t = placed.find((p) => p.instanceId === targetId);
            combine(entry.id, targetId, t.x, t.y, entry.instanceId);
        }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
}

// Top-most card whose box contains the point, excluding `exceptInstanceId`.
function cardUnder(clientX, clientY, exceptInstanceId) {
    const cards = dropZone.querySelectorAll('.craft-card');
    for (let i = cards.length - 1; i >= 0; i--) {
        const c = cards[i];
        if (exceptInstanceId != null && Number(c.dataset.instanceId) === Number(exceptInstanceId)) continue;
        const r = c.getBoundingClientRect();
        if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) return c;
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════════
//  COMBINE — strictly two inputs, one deterministic output
// ═══════════════════════════════════════════════════════════════════
function combine(idA, targetInstanceId, x, y, sourceInstanceId) {
    targetInstanceId = Number(targetInstanceId);
    const targetEntry = placed.find((p) => p.instanceId === targetInstanceId);
    if (!targetEntry) return;

    const key = [idA, targetEntry.id].sort().join('|');
    let productId = recipeMap[key];
    let isReverse = false;
    if (!productId) {
        productId = reverseMap[key];   // decomposition: reclaim the other ingredient
        isReverse = true;
    }

    if (!productId) {
        flashNoReaction(targetInstanceId);
        return;
    }

    // Consume both inputs (the dragged source, if any, and the target).
    placed = placed.filter(
        (p) => p.instanceId !== targetInstanceId && p.instanceId !== sourceInstanceId,
    );

    const isNew = !discovered.has(productId);
    if (isNew) {
        discovered.add(productId);
        saveState();
        renderInventory();
    }
    const product = spawnCard(productId, x, y);
    showDefinition(productId);
    updateStats();
    renderWorkbench();

    const el = dropZone.querySelector(`.craft-card[data-instance-id="${product.instanceId}"]`);
    if (el) el.classList.add(isNew ? 'first-discovery' : isReverse ? 'decomposed' : 'combined');
}

function flashNoReaction(instanceId) {
    const el = dropZone.querySelector(`.craft-card[data-instance-id="${instanceId}"]`);
    if (el) {
        el.classList.add('no-reaction');
        setTimeout(() => el.classList.remove('no-reaction'), 400);
    }
}

// ═══════════════════════════════════════════════════════════════════
//  CONTROLS
// ═══════════════════════════════════════════════════════════════════
function clearCanvas() {
    placed = [];
    renderWorkbench();
}

function resetGame() {
    if (!confirm('Reset all progress? You will lose every discovered material.')) return;
    localStorage.removeItem(STORAGE_KEY);
    discovered = new Set(BASE_IDS);
    placed = [];
    renderInventory();
    renderWorkbench();
    updateStats();
}

// ═══════════════════════════════════════════════════════════════════
//  GHOST (drag preview)
// ═══════════════════════════════════════════════════════════════════
function makeGhost(id) {
    const d = discoveryMap[id];
    const g = document.createElement('div');
    g.className = 'craft-card craft-ghost';
    g.innerHTML =
        `<span class="craft-card-emoji">${d.emoji}</span>` +
        `<span class="craft-card-name">${d.name}</span>`;
    document.body.appendChild(g);
    return g;
}
function positionGhost(g, clientX, clientY) {
    if (!g) return;
    g.style.left = clientX - 45 + 'px';
    g.style.top = clientY - 22 + 'px';
}

// ═══════════════════════════════════════════════════════════════════
//  RECIPE BOOK — every revealed way to make an item
// ═══════════════════════════════════════════════════════════════════
// "Build"      = forward recipes  a + b  -> X
// "Deconstruct"= decompositions   P + y -> X   (because P = X + y)
// Only rows whose two ingredients are both discovered are shown ("revealed").
function recipeRowsFor(id, map) {
    const rows = [];
    for (const key in map) {
        if (map[key] !== id) continue;
        const [a, b] = key.split('|');
        if (discovered.has(a) && discovered.has(b)) rows.push([a, b]);
    }
    return rows.sort((p, q) => (discoveryMap[p[0]].tier - discoveryMap[q[0]].tier));
}

function chipHTML(id) {
    const d = discoveryMap[id];
    return `<button class="r-chip" data-id="${id}"><span class="emoji">${d.emoji}</span>${d.name}</button>`;
}

function renderRecipeItems() {
    const q = (recipeSearch.value || '').trim().toLowerCase();
    const items = DISCOVERIES
        .filter((d) => discovered.has(d.id))
        .filter((d) => !q || d.name.toLowerCase().includes(q))
        .sort((a, b) => (a.tier === 0 ? 99 : a.tier) - (b.tier === 0 ? 99 : b.tier) || a.name.localeCompare(b.name));
    recipeItemsEl.innerHTML = '';
    items.forEach((d) => {
        const el = document.createElement('div');
        el.className = 'craft-inv-item' + (d.id === lastSelectedId ? ' r-active' : '');
        el.dataset.id = d.id;
        el.innerHTML = `<span class="emoji">${d.emoji}</span><span class="name">${d.name}</span>`;
        el.addEventListener('click', () => selectRecipeItem(d.id));
        recipeItemsEl.appendChild(el);
    });
}

function selectRecipeItem(id) {
    if (!discovered.has(id)) return;
    lastSelectedId = id;
    const d = discoveryMap[id];
    const build = recipeRowsFor(id, recipeMap);
    const decon = recipeRowsFor(id, reverseMap);
    const row = ([a, b]) =>
        `<div class="r-row">${chipHTML(a)}<span class="r-op">+</span>${chipHTML(b)}` +
        `<span class="r-op">=</span>${chipHTML(id)}</div>`;
    const section = (title, rows, empty) =>
        `<div class="r-section-title">${title} <span class="r-count">${rows.length}</span></div>` +
        (rows.length ? rows.map(row).join('') : `<div class="r-empty">${empty}</div>`);

    recipeDetailEl.innerHTML =
        `<div class="r-detail-head"><span class="r-detail-emoji">${d.emoji}</span>` +
        `<div><div class="r-detail-name">${d.name}</div><div class="r-detail-def">${d.definition}</div></div></div>` +
        section('Build', build, 'No revealed build recipes yet.') +
        section('Deconstruct', decon, 'No revealed deconstruct recipes.');

    recipeItemsEl.querySelectorAll('.craft-inv-item')
        .forEach((e) => e.classList.toggle('r-active', e.dataset.id === id));
    recipeDetailEl.querySelectorAll('.r-chip')
        .forEach((c) => c.addEventListener('click', () => selectRecipeItem(c.dataset.id)));
    recipeDetailEl.scrollTop = 0;
}

function openRecipes() {
    recipesModal.hidden = false;
    renderRecipeItems();
    const start = (lastSelectedId && discovered.has(lastSelectedId))
        ? lastSelectedId
        : (DISCOVERIES.find((d) => discovered.has(d.id)) || {}).id;
    if (start) selectRecipeItem(start);
}

function closeRecipes() { recipesModal.hidden = true; }

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════
function initGame() {
    loadState();
    renderInventory();
    renderWorkbench();
    updateStats();

    searchInput.addEventListener('input', renderInventory);
    document.getElementById('clearBtn').addEventListener('click', clearCanvas);
    document.getElementById('resetBtn').addEventListener('click', resetGame);

    document.getElementById('recipesBtn').addEventListener('click', openRecipes);
    recipeSearch.addEventListener('input', renderRecipeItems);
    recipesModal.querySelectorAll('[data-recipe-close]')
        .forEach((el) => el.addEventListener('click', closeRecipes));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !recipesModal.hidden) closeRecipes();
    });
}

loadData();
