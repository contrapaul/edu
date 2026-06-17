// ═══════════════════════════════════════════════════════════════════
// 1.  LOAD DATA
// ═══════════════════════════════════════════════════════════════════

let DISCOVERIES_DATA = [];
let RECIPES = [];
let discoveryMap = {};
let recipeMap = {};

const BASE_IDS = ['metal', 'carbon', 'ceramic', 'polymer'];

async function loadData() {
    try {
        const [discRes, recipeRes] = await Promise.all([
            fetch('discoveries.json'),
            fetch('recipes.json')
        ]);
        const discData = await discRes.json();
        const recipeData = await recipeRes.json();
        DISCOVERIES_DATA = discData.discoveries || discData;
        RECIPES = recipeData.recipes || recipeData;

        discoveryMap = Object.fromEntries(DISCOVERIES_DATA.map(d => [d.id, d]));
        recipeMap = {};
        RECIPES.forEach(r => {
            const key = [...r.ingredients].sort().join('|');
            if (!recipeMap[key]) recipeMap[key] = [];
            recipeMap[key].push(r.id);
        });

        BASE_IDS.forEach(id => {
            if (!discoveryMap[id]) {
                console.warn(`Base element "${id}" not found in discoveries.json`);
            }
        });

        initGame();
    } catch (err) {
        console.error('Failed to load data:', err);
        document.body.innerHTML = `
            <div style="padding:40px;text-align:center;font-family:sans-serif;">
                <h2>⚠️ Failed to load data</h2>
                <p>Make sure discoveries.json and recipes.json are in the same folder.</p>
                <pre style="background:#1a1d26;color:#e8edf5;padding:20px;border-radius:8px;max-width:600px;margin:20px auto;text-align:left;">${err.message}</pre>
            </div>
        `;
    }
}

// ═══════════════════════════════════════════════════════════════════
// 2.  GAME STATE
// ═══════════════════════════════════════════════════════════════════

let discovered = new Set();
let placed = [];           // [{ id, x, y }]

// Track what's being dragged: { id, isCanvasCard:bool, canvasIdx:number }
let dragPayload = null;

// ═══════════════════════════════════════════════════════════════════
// 3.  DOM REFS
// ═══════════════════════════════════════════════════════════════════

const invList = document.getElementById('inventoryList');
const dropZone = document.getElementById('dropZone');
const discoveryCountEl = document.getElementById('discoveryCount');
const maxTierEl = document.getElementById('maxTier');
const toastContainer = document.getElementById('toastContainer');

// ═══════════════════════════════════════════════════════════════════
// 4.  CORE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function saveState() {
    localStorage.setItem('compositeCraft', JSON.stringify([...discovered]));
}

function loadState() {
    const raw = localStorage.getItem('compositeCraft');
    if (raw) {
        try {
            const arr = JSON.parse(raw);
            arr.forEach(id => discovered.add(id));
        } catch (_) {}
    }
    if (discovered.size === 0) {
        BASE_IDS.forEach(id => discovered.add(id));
    }
    BASE_IDS.forEach(id => discovered.add(id));
}

function getDiscovery(id) { return discoveryMap[id]; }

function isDiscovered(id) { return discovered.has(id); }

function getAllDiscovered() {
    return DISCOVERIES_DATA.filter(d => discovered.has(d.id));
}

function getMaxTier() {
    let max = 0;
    for (const id of discovered) {
        const d = discoveryMap[id];
        if (d && d.tier > max) max = d.tier;
    }
    return max;
}

function getCardAtPoint(x, y) {
    const cards = dropZone.querySelectorAll('.craft-card');
    for (let i = cards.length - 1; i >= 0; i--) {
        const r = cards[i].getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
            return cards[i];
        }
    }
    return null;
}

function renderInventory() {
    const items = getAllDiscovered();
    items.sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
    invList.innerHTML = '';
    items.forEach(d => {
        const div = document.createElement('div');
        div.className = 'craft-inv-item';
        div.draggable = true;
        div.dataset.id = d.id;
        div.innerHTML = `
            <span class="emoji">${d.emoji}</span>
            <span class="name">${d.name}</span>
        `;
        div.addEventListener('dragstart', (e) => {
            dragPayload = { id: d.id, isCanvasCard: false };
            e.dataTransfer.setData('text/plain', d.id);
            e.dataTransfer.effectAllowed = 'copy';
        });
        div.addEventListener('dragend', () => {
            dragPayload = null;
        });
        div.addEventListener('click', () => {
            const offset = placed.length * 20;
            placed.push({ id: d.id, x: 20 + offset, y: 20 + offset });
            renderWorkbench();
        });
        invList.appendChild(div);
    });
    updateStats();
}

function renderWorkbench() {
    if (placed.length === 0) {
        dropZone.innerHTML = `
            <div class="craft-placeholder">
                <span class="craft-big-emoji">🛠️</span>
                Drag materials here to begin
            </div>
        `;
        return;
    }

    dropZone.innerHTML = '';

    placed.forEach((entry, idx) => {
        const d = getDiscovery(entry.id);
        if (!d) return;
        const card = document.createElement('div');
        card.className = 'craft-card';
        card.style.left = entry.x + 'px';
        card.style.top = entry.y + 'px';
        card.draggable = true;
        card.dataset.id = entry.id;
        card.dataset.idx = idx;

        card.innerHTML = `
            <span class="craft-card-emoji">${d.emoji}</span>
            <span class="craft-card-name">${d.name}</span>
        `;

        card.addEventListener('dragstart', (e) => {
            const rect = card.getBoundingClientRect();
            dragPayload = {
                id: entry.id,
                isCanvasCard: true,
                canvasIdx: idx,
                offX: e.clientX - rect.left,
                offY: e.clientY - rect.top
            };
            e.dataTransfer.setData('text/plain', entry.id);
            e.dataTransfer.effectAllowed = 'move';
            card.style.opacity = '0.4';
        });
        card.addEventListener('dragend', () => {
            card.style.opacity = '';
            dragPayload = null;
        });

        card.addEventListener('click', () => {
            placed.splice(idx, 1);
            renderWorkbench();
        });

        dropZone.appendChild(card);
    });
}

function updateStats() {
    discoveryCountEl.textContent = discovered.size;
    maxTierEl.textContent = getMaxTier();
}

function showDiscovery(d) {
    const toast = document.createElement('div');
    toast.className = 'craft-toast';
    toast.innerHTML = `
        <span class="emoji">${d.emoji}</span>
        <div class="content">
            <div class="name">✦ ${d.name}</div>
            <div class="def">${d.definition}</div>
            <div class="tier">Tier ${d.tier} · ${d.category}</div>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s';
        setTimeout(() => toast.remove(), 400);
    }, 6000);
}

function showToast(emoji, message) {
    const toast = document.createElement('div');
    toast.className = 'craft-toast';
    toast.innerHTML = `
        <span class="emoji">${emoji}</span>
        <div class="content">
            <div class="def">${message}</div>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function attemptCombine(a, b) {
    const ingredients = [a, b].sort();
    const key = ingredients.join('|');

    let matchIds = recipeMap[key] || [];

    if (matchIds.length === 0) {
        for (const r of RECIPES) {
            const sorted = [...r.ingredients].sort();
            if (sorted.length >= 2 && sorted.includes(a) && sorted.includes(b)) {
                const others = sorted.filter(x => x !== a && x !== b);
                const allDiscovered = others.every(id => discovered.has(id));
                if (allDiscovered) {
                    matchIds.push(r.id);
                }
            }
        }
    }

    matchIds = [...new Set(matchIds)];
    const newIds = matchIds.filter(id => !discovered.has(id));

    if (newIds.length === 0) {
        showToast('🧪', 'No new combination. Try different materials!');
        return [];
    }

    const discoveredItems = [];
    newIds.forEach(id => {
        discovered.add(id);
        const d = getDiscovery(id);
        if (d) {
            discoveredItems.push(d);
            showDiscovery(d);
        }
    });

    saveState();
    renderInventory();
    updateStats();

    if (discoveredItems.length > 1) {
        showToast('🎉', `Discovered ${discoveredItems.length} new materials!`);
    }

    return newIds;
}

function resetGame() {
    if (confirm('Reset all progress? You will lose all discovered materials.')) {
        localStorage.removeItem('compositeCraft');
        discovered = new Set();
        BASE_IDS.forEach(id => discovered.add(id));
        placed = [];
        renderWorkbench();
        renderInventory();
        updateStats();
        toastContainer.innerHTML = '';
        showToast('🔄', 'Game reset. Start combining!');
    }
}

// ═══════════════════════════════════════════════════════════════════
// 5.  DRAG & DROP ON DROPZONE
// ═══════════════════════════════════════════════════════════════════

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dropZone.classList.add('drag-over');

    // Highlight the card under the cursor
    const target = getCardAtPoint(e.clientX, e.clientY);
    dropZone.querySelectorAll('.craft-card.drag-hover').forEach(c => c.classList.remove('drag-hover'));
    if (target) target.classList.add('drag-hover');
});
dropZone.addEventListener('dragleave', (e) => {
    dropZone.classList.remove('drag-over');
    dropZone.querySelectorAll('.craft-card.drag-hover').forEach(c => c.classList.remove('drag-hover'));
});
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    dropZone.querySelectorAll('.craft-card.drag-hover').forEach(c => c.classList.remove('drag-hover'));

    const data = e.dataTransfer.getData('text/plain');
    if (!data || !isDiscovered(data)) return;

    const zoneRect = dropZone.getBoundingClientRect();
    const targetCard = getCardAtPoint(e.clientX, e.clientY);

    if (targetCard) {
        // Dropped on an existing card → attempt combine
        const targetId = targetCard.dataset.id;
        if (data === targetId) return; // same card

        const newIds = attemptCombine(data, targetId);
        if (newIds.length > 0) {
            const tr = targetCard.getBoundingClientRect();
            const baseX = tr.left - zoneRect.left;
            const baseY = tr.top - zoneRect.top;
            newIds.forEach((nid, i) => {
                placed.push({ id: nid, x: baseX + 30 + i * 40, y: baseY + 50 + i * 20 });
            });
        }

        // If dragging from inventory, also place the card on the canvas
        if (dragPayload && !dragPayload.isCanvasCard) {
            placed.push({
                id: data,
                x: e.clientX - zoneRect.left - 40,
                y: e.clientY - zoneRect.top - 20
            });
        }

        renderWorkbench();
        return;
    }

    // Dropped on empty canvas space
    if (dragPayload && dragPayload.isCanvasCard) {
        // Reposition existing canvas card
        const idx = dragPayload.canvasIdx;
        const offX = dragPayload.offX || 0;
        const offY = dragPayload.offY || 0;
        if (idx >= 0 && idx < placed.length) {
            placed[idx].x = e.clientX - zoneRect.left - offX;
            placed[idx].y = e.clientY - zoneRect.top - offY;
        }
    } else {
        // Add new card from inventory
        placed.push({
            id: data,
            x: e.clientX - zoneRect.left - 40,
            y: e.clientY - zoneRect.top - 20
        });
    }

    renderWorkbench();
});

// ═══════════════════════════════════════════════════════════════════
// 6.  EVENT BINDINGS
// ═══════════════════════════════════════════════════════════════════

document.getElementById('resetBtn').addEventListener('click', resetGame);

// ═══════════════════════════════════════════════════════════════════
// 7.  INIT
// ═══════════════════════════════════════════════════════════════════

function initGame() {
    loadState();
    renderInventory();
    renderWorkbench();
    updateStats();

    setTimeout(() => {
        showToast('🧪', 'Welcome! Drag materials from your inventory onto the canvas, then drop them on each other to discover new combinations.');
    }, 400);
}

loadData();
