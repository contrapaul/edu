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

        // Build lookup maps
        discoveryMap = Object.fromEntries(DISCOVERIES_DATA.map(d => [d.id, d]));
        recipeMap = {};
        RECIPES.forEach(r => {
            const key = [...r.ingredients].sort().join('|');
            if (!recipeMap[key]) recipeMap[key] = [];
            recipeMap[key].push(r.id);
        });

        // Ensure base elements exist in data
        BASE_IDS.forEach(id => {
            if (!discoveryMap[id]) {
                console.warn(`Base element "${id}" not found in discoveries.json`);
            }
        });

        // Start game
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
let slots = [null, null];
let dragData = null;

// ═══════════════════════════════════════════════════════════════════
// 3.  DOM REFS
// ═══════════════════════════════════════════════════════════════════

const invList = document.getElementById('inventoryList');
const dropZone = document.getElementById('dropZone');
const placeholder = document.getElementById('placeholder');
const slotsContainer = document.getElementById('slotsContainer');
const combineBtn = document.getElementById('combineBtn');
const clearSlotsBtn = document.getElementById('clearSlots');
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
            <span class="craft-badge-tier">T${d.tier}</span>
        `;
        div.addEventListener('dragstart', (e) => {
            dragData = d.id;
            e.dataTransfer.setData('text/plain', d.id);
            e.dataTransfer.effectAllowed = 'copy';
        });
        div.addEventListener('click', () => {
            const idx = slots.indexOf(null);
            if (idx !== -1) {
                slots[idx] = d.id;
                renderSlots();
            } else {
                slots[1] = d.id;
                renderSlots();
            }
        });
        invList.appendChild(div);
    });
    updateStats();
}

function renderSlots() {
    const hasAny = slots.some(s => s !== null);
    if (!hasAny) {
        slotsContainer.style.display = 'none';
        placeholder.style.display = 'block';
        combineBtn.disabled = true;
        return;
    }
    placeholder.style.display = 'none';
    slotsContainer.style.display = 'flex';

    slotsContainer.innerHTML = '';
    slots.forEach((id, idx) => {
        const div = document.createElement('div');
        div.className = 'craft-slot' + (id ? ' filled' : '');
        if (id) {
            const d = getDiscovery(id);
            div.innerHTML = `
                <span class="emoji">${d.emoji}</span>
                <span>${d.name}</span>
            `;
            div.addEventListener('click', () => {
                slots[idx] = null;
                renderSlots();
            });
        } else {
            div.innerHTML = `<span class="label">drop here</span>`;
        }
        div.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            div.classList.add('drag-hover');
        });
        div.addEventListener('dragleave', () => {
            div.classList.remove('drag-hover');
        });
        div.addEventListener('drop', (e) => {
            e.preventDefault();
            div.classList.remove('drag-hover');
            const data = e.dataTransfer.getData('text/plain');
            if (data && discovered.has(data)) {
                slots[idx] = data;
                renderSlots();
            }
        });
        slotsContainer.appendChild(div);

        if (idx === 0) {
            const plus = document.createElement('span');
            plus.className = 'craft-plus';
            plus.textContent = '+';
            slotsContainer.appendChild(plus);
        }
    });

    const bothFilled = slots[0] !== null && slots[1] !== null;
    combineBtn.disabled = !bothFilled;
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

function combine() {
    const a = slots[0];
    const b = slots[1];
    if (!a || !b) return;

    const ingredients = [a, b].sort();
    const key = ingredients.join('|');

    let matchIds = recipeMap[key] || [];

    // Superset match (3+ ingredient recipes)
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
        showToast('🧪', 'No new combination found. Try different materials!');
        slots = [null, null];
        renderSlots();
        return;
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
    slots = [null, null];
    renderSlots();
    renderInventory();
    updateStats();

    if (discoveredItems.length > 1) {
        showToast('🎉', `Discovered ${discoveredItems.length} new materials!`);
    }
}

function clearSlots() {
    slots = [null, null];
    renderSlots();
}

function resetGame() {
    if (confirm('Reset all progress? You will lose all discovered materials.')) {
        localStorage.removeItem('compositeCraft');
        discovered = new Set();
        BASE_IDS.forEach(id => discovered.add(id));
        slots = [null, null];
        renderSlots();
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
    e.dataTransfer.dropEffect = 'copy';
    dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const data = e.dataTransfer.getData('text/plain');
    if (data && discovered.has(data)) {
        const idx = slots.indexOf(null);
        if (idx !== -1) {
            slots[idx] = data;
            renderSlots();
        } else {
            slots[1] = data;
            renderSlots();
        }
    }
});

// ═══════════════════════════════════════════════════════════════════
// 6.  EVENT BINDINGS
// ═══════════════════════════════════════════════════════════════════

combineBtn.addEventListener('click', combine);
clearSlotsBtn.addEventListener('click', clearSlots);
document.getElementById('resetBtn').addEventListener('click', resetGame);

// ═══════════════════════════════════════════════════════════════════
// 7.  INIT
// ═══════════════════════════════════════════════════════════════════

function initGame() {
    loadState();
    renderInventory();
    renderSlots();
    updateStats();

    setTimeout(() => {
        showToast('🧪', 'Welcome to Composite Craft! Drag materials to the workbench and combine them.');
    }, 400);
}

// Start everything
loadData();