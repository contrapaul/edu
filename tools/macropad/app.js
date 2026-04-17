// – State –––––––––––––––––––––––––––––

const state = {

placed: [],         // placed component instances

nextId: 1,

selectedId: null,

chipPos: { x: 0, y: 0 },

dragging: null,     // { type: ‘component’|‘chip’, id, offX, offY }

};

// – DOM refs —————————————————––

const canvas      = document.getElementById(‘canvas’);

const wireLayer   = document.getElementById(‘wire-layer’);

const canvasWrap  = document.getElementById(‘canvas-wrap’);

const canvasHint  = document.getElementById(‘canvas-hint’);

const shelfItems  = document.getElementById(‘shelf-items’);

const ctxMenu     = document.getElementById(‘ctx-menu’);

const tooltip     = document.getElementById(‘tooltip’);

const panelForm   = document.getElementById(‘panel-form’);

const panelEmpty  = document.getElementById(‘panel-empty’);

const notesList   = document.getElementById(‘notes-list’);

const libList     = document.getElementById(‘lib-list’);

const statComponents = document.getElementById(‘stat-components’);

const statPins       = document.getElementById(‘stat-pins’);

const statLibs       = document.getElementById(‘stat-libs’);

let ctxTargetId = null;

let chipEl = null;

// – Init ———————————————————–

function init() {

buildShelf();

buildChip();

placeChipCenter();

bindHeader();

bindPanelTabs();

bindContextMenu();

bindCanvas();

updateStats();

}

// – Shelf –––––––––––––––––––––––––––––

function buildShelf() {

shelfItems.innerHTML = ‘’;

Object.values(COMPONENT_LIBRARY).forEach(comp => {

const count = state.placed.filter(p => p.compId === comp.id).length;

const atMax = count >= comp.maxInstances;

const el = document.createElement(‘div’);

el.className = ‘shelf-item’ + (atMax ? ’ disabled’ : ‘’);

el.dataset.compId = comp.id;

el.innerHTML = `<span class="shelf-item-count">${count}/${comp.maxInstances}</span> <span class="shelf-item-icon">${comp.icon}</span> <span class="shelf-item-name">${comp.shortName}</span>`;

el.title = comp.description;

if (!atMax) {

el.addEventListener(‘mousedown’, onShelfMouseDown);

el.addEventListener(‘click’, () => addComponent(comp.id));

}

shelfItems.appendChild(el);

});

}

// – ESP32-S3 chip –––––––––––––––––––––––––

function buildChip() {

chipEl = document.createElement(‘div’);

chipEl.className = ‘esp32-chip’;
chipEl.id = ‘esp32-chip’;

const leftPins  = ESP32S3_PINS.filter(p => p.side === ‘left’);

const rightPins = ESP32S3_PINS.filter(p => p.side === ‘right’);

const rows = Math.max(leftPins.length, rightPins.length);

let leftHTML = ‘’, rightHTML = ‘’;

leftPins.forEach(pin => {

const cls = pinClass(pin);

leftHTML += ` <div class="pin-item ${cls}" data-pin="${pin.id}" title="${pin.label}: ${pin.note}"> <div class="pin-dot"></div> <div class="pin-stub"></div> <div class="pin-label">${pin.label}</div> </div>`;

});

rightPins.forEach(pin => {

const cls = pinClass(pin);

rightHTML += ` <div class="pin-item ${cls}" data-pin="${pin.id}" title="${pin.label}: ${pin.note}"> <div class="pin-label">${pin.label}</div> <div class="pin-stub"></div> <div class="pin-dot"></div> </div>`;

});

chipEl.innerHTML = `<div class="chip-top-bar"> <div class="chip-name">ESP32-S3 N16R8</div> </div> <div class="chip-body"> <div class="pin-col left">${leftHTML}</div> <div class="chip-center"> <div class="chip-notch"></div> <div class="chip-logo">ESP32<br>S3</div> <div class="chip-model">N16R8<br>240MHz</div> </div> <div class="pin-col right">${rightHTML}</div> </div>`;

canvas.appendChild(chipEl);

// Chip drag

chipEl.addEventListener(‘mousedown’, e => {

if (e.button !== 0) return;

const rect = chipEl.getBoundingClientRect();

const cRect = canvasWrap.getBoundingClientRect();

state.dragging = {

type: ‘chip’,

offX: e.clientX - rect.left,

offY: e.clientY - rect.top,

};

e.preventDefault();

});

}

function pinClass(pin) {

if (pin.types.includes(‘power’)) return ‘power’;

if (pin.types.includes(‘gnd’))   return ‘gnd’;

return ‘’;

}

function placeChipCenter() {

const wrap = canvasWrap.getBoundingClientRect();

const cx = Math.max(40, wrap.width  / 2 - 100);

const cy = Math.max(40, wrap.height / 2 - 160);

state.chipPos = { x: cx, y: cy };

chipEl.style.left = cx + ‘px’;

chipEl.style.top  = cy + ‘px’;

}

// – Pin position helper ––––––––––––––––––––––

function getPinPos(pinId) {

const pinEl = chipEl.querySelector(`[data-pin="${pinId}"]`);

if (!pinEl) return null;

const dot = pinEl.querySelector(’.pin-dot’);

if (!dot) return null;

const dRect = dot.getBoundingClientRect();

const cRect = canvasWrap.getBoundingClientRect();

// Account for any scrolling inside canvasWrap

return {

x: dRect.left - cRect.left + dRect.width  / 2 + canvasWrap.scrollLeft,

y: dRect.top  - cRect.top  + dRect.height / 2 + canvasWrap.scrollTop,

};

}

// – Add component –––––––––––––––––––––––––

function addComponent(compId, x, y) {

const comp = COMPONENT_LIBRARY[compId];

if (!comp) return;

const count = state.placed.filter(p => p.compId === compId).length;

if (count >= comp.maxInstances) return;

const wrap = canvasWrap.getBoundingClientRect();

const px = x !== undefined ? x : 80 + Math.random() * (wrap.width  - 280);

const py = y !== undefined ? y : 80 + Math.random() * (wrap.height - 200);

// Default pin assignments  –  prefer recommended pins, auto-assign next available

const pinAssign = {};

// Build set of globally used GPIO pins before this component

const usedGPIO = new Set();

state.placed.forEach(existing => {

Object.values(existing.pinAssign).forEach(pid => {

if (pid && ![‘GND’,‘3V3’,‘GND_R’,‘5V’].includes(pid)) usedGPIO.add(pid);

});

});

comp.pinGroups.forEach(pg => {

if (pg.fixed) {

pinAssign[pg.id] = pg.fixedPin;

} else if (pg.conditional) {

// Conditional pins (e.g. LED)  –  leave unassigned until enabled

pinAssign[pg.id] = ‘’;

} else {

// Try preferred first, then walk the pin list for next available compatible pin

const compat = ESP32S3_PINS.filter(p =>

![‘GND’,‘3V3’,‘GND_R’,‘5V’].includes(p.id) &&

p.types.some(t => pg.type === t || t === ‘gpio’)

);

let chosen = ‘’;

if (pg.preferred && !usedGPIO.has(pg.preferred)) {

chosen = pg.preferred;

} else {

for (const p of compat) {

if (!usedGPIO.has(p.id)) { chosen = p.id; break; }

}

}

pinAssign[pg.id] = chosen;

if (chosen) usedGPIO.add(chosen); // reserve it for subsequent pins of same component

}

});

// Default config values

const config = {};

if (comp.configSchema) {

Object.entries(comp.configSchema).forEach(([key, schema]) => {

config[key] = schema.default;

});

}

const instance = {

id: state.nextId++,

compId,

x: px,

y: py,

pinAssign,

config,

label: comp.shortName + ’ ’ + (count + 1),

};

state.placed.push(instance);

renderComponent(instance);

selectComponent(instance.id);

buildShelf();

updateWires();

updateStats();

updateNotes();

updateLibs();

canvasHint.classList.add(‘hidden’);

}

// – Render a placed component –––––––––––––––––––

function renderComponent(inst) {

const comp = COMPONENT_LIBRARY[inst.compId];

const existing = document.getElementById(‘comp-’ + inst.id);

if (existing) existing.remove();

const el = document.createElement(‘div’);

el.className = ‘placed-component’;
el.id = ‘comp-’ + inst.id;

el.style.left = inst.x + ‘px’;

el.style.top  = inst.y + ‘px’;

el.style.borderColor = comp.color + ‘55’;

// Check config completeness

const unconfigured = isUnconfigured(inst);

if (unconfigured) el.classList.add(‘unconfigured’);

// Pin badges

const assignablePins = comp.pinGroups.filter(pg => !pg.fixed);

const pinBadgesHTML = assignablePins.map(pg => {

const assigned = inst.pinAssign[pg.id];

const cls = assigned ? ‘assigned’ : ‘’;

return `<span class="comp-pin-badge ${cls}" data-pg="${pg.id}" title="Click to reassign ${pg.label}">${pg.label}: ${assigned || ' -- '}</span>`;

}).join(’’);

el.innerHTML = `<div class="comp-header"> <span class="comp-icon">${comp.icon}</span> <span class="comp-title">${comp.shortName}</span> <span class="comp-id">#${inst.id}</span> </div> <div class="comp-pins">${pinBadgesHTML}</div> <div class="comp-status ${unconfigured ? 'warn' : 'ok'}">${unconfigured ? '&#9888; needs config' : '&#10003; ready'}</div>`;

// Drag

el.addEventListener(‘mousedown’, e => {

if (e.button !== 0) return;

if (e.target.closest(’.comp-pin-badge’)) return;

const rect = el.getBoundingClientRect();

state.dragging = { type: ‘component’, id: inst.id, offX: e.clientX - rect.left, offY: e.clientY - rect.top };

selectComponent(inst.id);

e.stopPropagation();

e.preventDefault();

});

// Click to select

el.addEventListener(‘click’, e => {

if (!e.target.closest(’.comp-pin-badge’)) selectComponent(inst.id);

e.stopPropagation();

});

// Right-click context menu

el.addEventListener(‘contextmenu’, e => {

e.preventDefault();

ctxTargetId = inst.id;

showCtxMenu(e.clientX, e.clientY);

});

// Pin badge click  –  quick reassign popover

el.querySelectorAll(’.comp-pin-badge’).forEach(badge => {

badge.addEventListener(‘click’, e => {

e.stopPropagation();

openPinReassign(inst.id, badge.dataset.pg, badge);

});

});

canvas.appendChild(el);

// Highlight if selected

if (state.selectedId === inst.id) el.classList.add(‘selected’);

}

function isUnconfigured(inst) {

const comp = COMPONENT_LIBRARY[inst.compId];

// Check required non-fixed pins are assigned

for (const pg of comp.pinGroups) {

if (!pg.fixed && pg.required && !inst.pinAssign[pg.id]) return true;

}

// Check label exists for buttons

if (inst.compId === ‘button’ && !inst.config.label) return true;

return false;

}

// – Selection ——————————————————

function selectComponent(id) {

state.selectedId = id;

document.querySelectorAll(’.placed-component’).forEach(el => el.classList.remove(‘selected’));

const el = document.getElementById(‘comp-’ + id);

if (el) el.classList.add(‘selected’);

renderPanel(id);

// Switch to config tab

document.querySelectorAll(’.ptab’).forEach(t => t.classList.toggle(‘active’, t.dataset.tab === ‘config’));

document.querySelectorAll(’.panel-body’).forEach(b => b.classList.add(‘hidden’));

document.getElementById(‘panel-config’).classList.remove(‘hidden’);

}

function deselectAll() {

state.selectedId = null;

document.querySelectorAll(’.placed-component’).forEach(el => el.classList.remove(‘selected’));

panelEmpty.style.display = ‘’;

panelForm.style.display = ‘none’;

}

// – Config panel —————————————————

function renderPanel(id) {

const inst = state.placed.find(p => p.id === id);

if (!inst) { deselectAll(); return; }

const comp = COMPONENT_LIBRARY[inst.compId];

panelEmpty.style.display = ‘none’;

panelForm.style.display  = ‘’;

let html = ` <div class="form-section"> <div class="form-section-title">${comp.icon} ${comp.name}</div> <p style="font-size:0.72rem;color:var(--text2);line-height:1.5;margin-bottom:0.6rem">${comp.description}</p> </div>`;

const assignable = comp.pinGroups.filter(pg => !pg.fixed);

if (assignable.length) {

html += `<div class="form-section"><div class="form-section-title">Pin assignments</div> <table class="pin-assign-table">`;

assignable.forEach(pg => {

// Skip conditional pin rows when the condition is false

if (pg.conditional && !inst.config[pg.conditional]) return;

const usedPins = getUsedPins(id, pg.id);

// Filter to only pins whose type list matches what this pin group needs

const compatPins = ESP32S3_PINS.filter(p => {

if ([‘GND’,‘3V3’,‘GND_R’,‘5V’].includes(p.id)) return false;

return p.types.some(t => t === pg.type || (pg.type === ‘gpio’ && t === ‘gpio’));

});

// All GPIO-capable pins (for analog we still show GPIO but mark them)

const allPins = ESP32S3_PINS.filter(p => ![‘GND’,‘3V3’,‘GND_R’,‘5V’].includes(p.id));

html += `<tr> <td>${pg.label}</td> <td><select data-pg="${pg.id}" onchange="onPinChange(${id},'${pg.id}',this.value)"> <option value=""> --  select  -- </option> ${allPins.map(p => { const isCompat = p.types.some(t => t === pg.type || (pg.type === 'gpio' && t === 'gpio')); const taken    = usedPins.includes(p.id); const sel      = inst.pinAssign[pg.id] === p.id ? 'selected' : ''; const style    = !isCompat ? 'style="color:var(--text3)"' : taken ? 'style="color:var(--yellow)"' : ''; const suffix   = !isCompat ? ' (incompatible)' : taken ? ' (in use)' : ''; return `<option value=”${p.id}” ${sel} ${style}>${p.label}${suffix}</option>`; }).join('')} </select></td> </tr>`;

});

html += `</table></div>`;

}

// Config schema fields

if (comp.configSchema && Object.keys(comp.configSchema).length) {

html += `<div class="form-section"><div class="form-section-title">Configuration</div>`;

Object.entries(comp.configSchema).forEach(([key, schema]) => {

// Check dependency

if (schema.dependsOn) {

const [depKey, depVals] = Object.entries(schema.dependsOn)[0];

if (!depVals.includes(inst.config[depKey])) return;

}

html += renderField(id, key, schema, inst.config[key]);

});

html += `</div>`;

}

// Passives info

if (comp.passives && comp.passives.length) {

html += `<div class="form-section"><div class="form-section-title">Passive components needed</div>`;

comp.passives.forEach(p => {

html += `<div style="font-size:0.72rem;padding:6px 8px;background:var(--bg3);border-radius:4px;border-left:3px solid var(--yellow);margin-bottom:6px;line-height:1.5;color:var(--text2)"> <strong style="color:var(--yellow)">${p.value} ${p.type}</strong> on ${p.on.join(', ')} line(s)<br>${p.note} </div>`;

});

html += `</div>`;

}

html += `<button class="btn-form danger" onclick="removeComponent(${id})">Remove component</button>`;

panelForm.innerHTML = html;

}

function renderField(instId, key, schema, value) {

const id = `cfg-${instId}-${key}`;

const onChange = `onConfigChange(${instId},'${key}',this.${schema.type === 'checkbox' ? 'checked' : 'value'})`;

if (schema.type === ‘text’) {

return `<div class="form-row"><label class="form-label" for="${id}">${schema.label}</label> <input class="form-input" id="${id}" type="text" value="${value || ''}" onchange="${onChange}"></div>`;

}

if (schema.type === ‘select’) {

const opts = schema.options.map(o => `<option value="${o}" ${value===o?'selected':''}>${o}</option>`).join(’’);

return `<div class="form-row"><label class="form-label" for="${id}">${schema.label}</label> <select class="form-select" id="${id}" onchange="${onChange}">${opts}</select></div>`;

}

if (schema.type === ‘keyselect’) {

const opts = KEY_OPTIONS.map(o => `<option value="${o}" ${value===o?'selected':''}>${o||' -- '}</option>`).join(’’);

return `<div class="form-row"><label class="form-label" for="${id}">${schema.label}</label> <select class="form-select" id="${id}" onchange="${onChange}">${opts}</select></div>`;

}

if (schema.type === ‘checkbox’) {

return `<div class="form-check-row"> <input type="checkbox" id="${id}" ${value?'checked':''} onchange="${onChange}"> <label for="${id}">${schema.label}</label></div>`;

}

if (schema.type === ‘range’) {

return `<div class="form-row"><label class="form-label" for="${id}">${schema.label} <span id="${id}-val">${value}</span></label> <input class="form-input" type="range" id="${id}" min="${schema.min}" max="${schema.max}" step="${schema.step}" value="${value}" oninput="document.getElementById('${id}-val').textContent=this.value" onchange="${onChange}"></div>`;

}

return ‘’;

}

function onConfigChange(instId, key, value) {

const inst = state.placed.find(p => p.id === instId);

if (!inst) return;

inst.config[key] = value;

renderPanel(instId);

renderComponent(inst);

updateNotes();

}

function onPinChange(instId, pgId, pinId) {

const inst = state.placed.find(p => p.id === instId);

if (!inst) return;

inst.pinAssign[pgId] = pinId;

renderComponent(inst);

updateWires();

updateStats();

renderPanel(instId);

updateNotes();

}

// Get all pins used by other instances (excluding this instance’s same pg)

function getUsedPins(exceptInstId, exceptPgId) {

const used = [];

state.placed.forEach(inst => {

Object.entries(inst.pinAssign).forEach(([pgId, pinId]) => {

if ((inst.id !== exceptInstId || pgId !== exceptPgId) && pinId && ![‘GND’,‘3V3’,‘GND_R’,‘5V’].includes(pinId)) {

used.push(pinId);

}

});

});

return used;

}

// – Pin reassign popover —————————————––

let pinPopover = null;

function openPinReassign(instId, pgId, anchorEl) {

closePinPopover();

const inst = state.placed.find(p => p.id === instId);

const comp = COMPONENT_LIBRARY[inst.compId];

const pg   = comp.pinGroups.find(p => p.id === pgId);

const usedPins  = getUsedPins(instId, pgId);

const allPins   = ESP32S3_PINS.filter(p => ![‘GND’,‘3V3’,‘GND_R’,‘5V’].includes(p.id));

const pop = document.createElement(‘div’);
pop.id = ‘pin-popover’;

pop.style.cssText = `position:fixed;z-index:2000;background:var(--bg2);border:1px solid var(--border2);border-radius:6px;padding:8px;min-width:180px;max-height:280px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,0.5)`;

const rect = anchorEl.getBoundingClientRect();

pop.style.left = rect.left + ‘px’;

pop.style.top  = (rect.bottom + 4) + ‘px’;

pop.innerHTML = `<div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text3);margin-bottom:6px;letter-spacing:0.1em">ASSIGN ${pg.label}</div>` +

allPins.map(p => {

const isCompat = p.types.some(t => t === pg.type || (pg.type === ‘gpio’ && t === ‘gpio’));

const taken    = usedPins.includes(p.id);

const sel      = inst.pinAssign[pgId] === p.id;

const color    = !isCompat ? ‘var(–text3)’ : taken ? ‘var(–yellow)’ : sel ? ‘var(–green)’ : ‘var(–text)’;

const suffix   = !isCompat ? ’ ✗’ : taken ? ’ ⚠’ : sel ? ’ ✓’ : ‘’;

return `<div style="padding:5px 8px;border-radius:4px;cursor:pointer;font-family:var(--font-mono);font-size:0.72rem;color:${color};background:${sel?'var(--bg3)':'transparent'}" onmouseenter="this.style.background='var(--bg3)'" onmouseleave="this.style.background='${sel?'var(--bg3)':'transparent'}'" onclick="onPinChange(${instId},'${pgId}','${p.id}');closePinPopover()"> ${p.label}${suffix} </div>`;

}).join(’’);

document.body.appendChild(pop);

pinPopover = pop;

setTimeout(() => document.addEventListener(‘click’, closePinPopover, { once: true }), 10);

}

function closePinPopover() {

if (pinPopover) { pinPopover.remove(); pinPopover = null; }

}

// – Remove component ———————————————–

function removeComponent(id) {

state.placed = state.placed.filter(p => p.id !== id);

const el = document.getElementById(‘comp-’ + id);

if (el) el.remove();

if (state.selectedId === id) deselectAll();

buildShelf();

updateWires();

updateStats();

updateNotes();

updateLibs();

if (state.placed.length === 0) canvasHint.classList.remove(‘hidden’);

}

// – Wires –––––––––––––––––––––––––––––

function updateWires() {

wireLayer.innerHTML = ‘’;

updateChipPinHighlights();

const cRect    = canvasWrap.getBoundingClientRect();

const chipRect = chipEl.getBoundingClientRect();

const chipCx   = chipRect.left - cRect.left + chipRect.width / 2 + canvasWrap.scrollLeft;

state.placed.forEach(inst => {

const comp   = COMPONENT_LIBRARY[inst.compId];

const compEl = document.getElementById(‘comp-’ + inst.id);

if (!compEl) return;

const compRect = compEl.getBoundingClientRect();

```

// Component centre (with scroll offset so coords match SVG space)

const compCx = compRect.left - cRect.left + compRect.width  / 2 + canvasWrap.scrollLeft;

const compCy = compRect.top  - cRect.top  + compRect.height / 2 + canvasWrap.scrollTop;

comp.pinGroups.forEach((pg, idx) => {

  const pinId = inst.pinAssign[pg.id];

  if (!pinId) return;

  // Skip conditional pins (e.g. LED) when the condition is off

  if (pg.conditional && !inst.config[pg.conditional]) return;

  const pinPos = getPinPos(pinId);

  if (!pinPos) return;

  // Anchor from the near edge of the component toward the chip

  const anchorX = compCx < chipCx

    ? compRect.right - cRect.left + canvasWrap.scrollLeft   // component left of chip

    : compRect.left  - cRect.left + canvasWrap.scrollLeft;  // component right of chip

  // Per-pin y-offset  --  18px spacing so wires don't overlap

  const offset = (idx - (comp.pinGroups.length - 1) / 2) * 18;

  const startY = compCy + offset;

  const d = routeWire(anchorX, startY, pinPos.x, pinPos.y);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  path.setAttribute('d', d);

  path.setAttribute('class', `wire ${pg.wireClass} wire-new`);

  path.setAttribute('data-inst', inst.id);

  path.setAttribute('data-pg', pg.id);

  // Tooltip on hover

  path.addEventListener('mouseenter', e => {

    showTooltip(e.clientX, e.clientY,

      `${comp.shortName} #${inst.id}`,

      `${pg.label} -> ${pinId}`);

  });

  path.addEventListener('mousemove', e => moveTooltip(e.clientX, e.clientY));

  path.addEventListener('mouseleave', hideTooltip);

  wireLayer.appendChild(path);

  // Draw passive symbols on wire if applicable

  const passive = comp.passives.find(p => p.on.includes(pg.id) &&

    (!p.conditional || inst.config[p.conditional]));

  if (passive) {

    drawPassiveSymbol(anchorX, startY, pinPos, passive);

  }

});

```

});

}

function routeWire(x1, y1, x2, y2) {

// L-shaped routing: horizontal from component edge, then vertical, then horizontal to pin dot

const mx = (x1 + x2) / 2;

return `M ${x1} ${y1} L ${mx} ${y1} L ${mx} ${y2} L ${x2} ${y2}`;

}

function drawPassiveSymbol(cx, cy, pinPos, passive) {

const mx = (cx + pinPos.x) / 2;

const my = (cy + pinPos.y) / 2;

if (passive.type === ‘resistor’) {

// Zigzag resistor symbol

const w = 18, h = 6;

const zz = `M ${mx-w/2} ${my} l 3 ${-h} l 3 ${h*2} l 3 ${-h*2} l 3 ${h*2} l 3 ${-h} l 3 0`;

const path = document.createElementNS(‘http://www.w3.org/2000/svg’, ‘path’);

path.setAttribute(‘d’, zz);

path.setAttribute(‘class’, ‘wire wire-data’);

path.setAttribute(‘stroke’, ‘var(–yellow)’);

path.setAttribute(‘stroke-width’, ‘1.5’);

path.setAttribute(‘fill’, ‘none’);

wireLayer.appendChild(path);

// Label

const t = document.createElementNS(‘http://www.w3.org/2000/svg’, ‘text’);

t.setAttribute(‘x’, mx); t.setAttribute(‘y’, my - 8);

t.setAttribute(‘class’, ‘wire-annotation’);

t.setAttribute(‘text-anchor’, ‘middle’);

t.textContent = passive.value;

t.addEventListener(‘mouseenter’, e => showTooltip(e.clientX, e.clientY, passive.value + ’ Resistor’, passive.note));

t.addEventListener(‘mousemove’, e => moveTooltip(e.clientX, e.clientY));

t.addEventListener(‘mouseleave’, hideTooltip);

wireLayer.appendChild(t);

} else if (passive.type === ‘capacitor’) {

// Capacitor symbol  –  two parallel lines

const rect1 = document.createElementNS(‘http://www.w3.org/2000/svg’, ‘rect’);

rect1.setAttribute(‘x’, mx-10); rect1.setAttribute(‘y’, my-8);

rect1.setAttribute(‘width’, 20); rect1.setAttribute(‘height’, 3);

rect1.setAttribute(‘fill’, ‘var(–yellow)’); rect1.setAttribute(‘opacity’, ‘0.7’);

const rect2 = document.createElementNS(‘http://www.w3.org/2000/svg’, ‘rect’);

rect2.setAttribute(‘x’, mx-10); rect2.setAttribute(‘y’, my+5);

rect2.setAttribute(‘width’, 20); rect2.setAttribute(‘height’, 3);

rect2.setAttribute(‘fill’, ‘var(–yellow)’); rect2.setAttribute(‘opacity’, ‘0.7’);

wireLayer.appendChild(rect1); wireLayer.appendChild(rect2);

const t = document.createElementNS(‘http://www.w3.org/2000/svg’, ‘text’);

t.setAttribute(‘x’, mx+14); t.setAttribute(‘y’, my+2);

t.setAttribute(‘class’, ‘wire-annotation’); t.setAttribute(‘text-anchor’, ‘start’);

t.textContent = passive.value;

t.addEventListener(‘mouseenter’, e => showTooltip(e.clientX, e.clientY, passive.value + ’ Capacitor’, passive.note));

t.addEventListener(‘mousemove’, e => moveTooltip(e.clientX, e.clientY));

t.addEventListener(‘mouseleave’, hideTooltip);

wireLayer.appendChild(t);

}

}

function updateChipPinHighlights() {

const usedPins = new Set();

state.placed.forEach(inst => {

Object.values(inst.pinAssign).forEach(p => { if (p) usedPins.add(p); });

});

chipEl.querySelectorAll(’.pin-item’).forEach(el => {

const pid = el.dataset.pin;

el.classList.toggle(‘used’, usedPins.has(pid));

});

}

// – Stats –––––––––––––––––––––––––––––

function updateStats() {

const usedPins = new Set();

state.placed.forEach(inst => {

Object.values(inst.pinAssign).forEach(p => {

if (p && ![‘GND’,‘3V3’,‘GND_R’,‘5V’].includes(p)) usedPins.add(p);

});

});

const libs = getRequiredLibs();

statComponents.textContent = state.placed.length;

statPins.textContent = `${usedPins.size} / 28`;

statLibs.textContent = libs.length;

}

function getRequiredLibs() {

const set = new Set([‘adafruit_hid’]);

state.placed.forEach(inst => {

const comp = COMPONENT_LIBRARY[inst.compId];

comp.libraries.forEach(l => set.add(l));

});

return […set];

}

// – Notes –––––––––––––––––––––––––––––

function updateNotes() {

const notes = [];

if (state.placed.length === 0) {

notes.push({ cls: ‘note-info’, text: ‘Add components from the shelf above to start building.’ });

}

state.placed.forEach(inst => {

const comp = COMPONENT_LIBRARY[inst.compId];

comp.pinGroups.forEach(pg => {

if (!pg.fixed && pg.required && !inst.pinAssign[pg.id]) {

notes.push({ cls: ‘note-error’, text: `${comp.shortName} #${inst.id}: ${pg.label} pin not assigned.` });

}

});

if (inst.compId === ‘button’ && (!inst.config.label || inst.config.label === `BTN ${inst.id}`)) {

notes.push({ cls: ‘note-warn’, text: `Button #${inst.id}: give it a meaningful label before downloading.` });

}

if ((inst.compId === ‘button’) && inst.config.action_type === ‘hotkey’) {

const keys = [inst.config.key1, inst.config.key2, inst.config.key3].filter(Boolean);

if (keys.length === 0) notes.push({ cls: ‘note-warn’, text: `Button #${inst.id}: no keys assigned for hotkey action.` });

}

});

// I2C address conflicts

const i2cAddresses = {};

state.placed.forEach(inst => {

if ([‘ssd1306_i2c’,‘sh1106’,‘ssd1309’].includes(inst.compId)) {

const addr = inst.config.i2c_address || ‘0x3C’;

if (i2cAddresses[addr]) {

notes.push({ cls: ‘note-error’, text: `I2C address conflict: two OLEDs both on ${addr}. Change one to 0x3D.` });

}

i2cAddresses[addr] = true;

}

});

// Pin conflicts

const pinCount = {};

state.placed.forEach(inst => {

Object.values(inst.pinAssign).forEach(p => {

if (p && ![‘GND’,‘3V3’,‘GND_R’,‘5V’].includes(p)) {

pinCount[p] = (pinCount[p] || 0) + 1;

}

});

});

Object.entries(pinCount).forEach(([pin, count]) => {

if (count > 1) notes.push({ cls: ‘note-error’, text: `Pin conflict: ${pin} assigned to ${count} components.` });

});

// Extra file reminders

const extraFiles = new Set();

state.placed.forEach(inst => {

const comp = COMPONENT_LIBRARY[inst.compId];

(comp.extraFiles || []).forEach(f => extraFiles.add(f));

});

extraFiles.forEach(f => {

notes.push({ cls: ‘note-info’, text: `Required file: place ${f} in CIRCUITPY root (download from Adafruit framebuf examples).` });

});

if (notes.length === 0) {

notes.push({ cls: ‘note-ok’, text: ‘All components configured  –  ready to download.’ });

}

notesList.innerHTML = notes.map(n => `<li class="${n.cls}">${n.text}</li>`).join(’’);

}

// – Libraries ——————————————————

function updateLibs() {

const libs = getRequiredLibs();

libList.innerHTML = libs.map(l => {

const always = l === ‘adafruit_hid’;

return `<li class="${always ? 'lib-always' : ''}">${l} <span class="lib-tag">${always ? 'always' : 'required'}</span></li>`;

}).join(’’);

}

// – JSON export ––––––––––––––––––––––––––

function buildConfigJSON() {

const buttons = {};

const dial_modes = [];

const joystick = null;

const sliders = [];

let btnIdx = 1;

state.placed.forEach(inst => {

const comp = COMPONENT_LIBRARY[inst.compId];

const c = inst.config;

```

if (inst.compId === 'button') {

  let action = {};

  if (c.action_type === 'hotkey') {

    action = { type: 'hotkey', keys: [c.key1, c.key2, c.key3].filter(Boolean), auto_translate: c.auto_translate };

  } else if (c.action_type === 'consumer') {

    action = { type: 'consumer', action: c.consumer_action };

  } else if (c.action_type === 'launch') {

    action = { type: 'launch', program: c.program };

  } else if (c.action_type === 'type') {

    action = { type: 'type', text: c.type_text };

  } else if (c.action_type === 'mode_toggle') {

    action = { type: 'mode_toggle' };

  } else if (c.action_type === 'platform_toggle') {

    action = { type: 'platform_toggle' };

  }

  action.label = c.label || `BTN ${btnIdx}`;

  action.gpio  = inst.pinAssign.sig;

  buttons[String(btnIdx++)] = action;

} else if (['ky040','hw040'].includes(inst.compId)) {

  const buildSide = (type_key, cc_key, keys_key, dirVal) => {

    const t = c[type_key];

    if (t === 'consumer')    return { type: 'consumer',     action: c[cc_key] };

    if (t === 'hotkey')      return { type: 'hotkey',       keys: (c[keys_key]||'').split(',').map(s=>s.trim()).filter(Boolean) };

    if (t === 'mouse_scroll')return { type: 'mouse_scroll', direction: dirVal };

    return {};

  };

  const pressA = c.press_action === 'consumer' ? { type: 'consumer', action: c.press_consumer } :

                 c.press_action === 'hotkey'   ? { type: 'hotkey',   keys: (c.press_keys||'').split(',').map(s=>s.trim()) } :

                 null;

  const mode = {

    name:  c.mode_name || 'Encoder',

    cw:    buildSide('cw_type',  'cw_consumer',  'cw_keys',  1),

    ccw:   buildSide('ccw_type', 'ccw_consumer', 'ccw_keys', -1),

    gpio_clk: inst.pinAssign.clk,

    gpio_dt:  inst.pinAssign.dt,

    gpio_sw:  inst.pinAssign.sw,

  };

  if (pressA) mode.press = pressA;

  dial_modes.push(mode);

} else if (inst.compId === 'ps2_joystick') {

  // joystick block

} else if (['hw371','slide_pot_long'].includes(inst.compId)) {

  sliders.push({

    label:    c.label,

    function: c.function,

    inverted: c.inverted,

    gpio_out: inst.pinAssign.out,

  });

}

```

});

// OLED config

const oleds = state.placed

.filter(p => [‘ssd1306_i2c’,‘ssd1306_spi’,‘sh1106’,‘ssd1309’].includes(p.compId))

.map(inst => ({

driver:       inst.compId,

i2c_address:  inst.config.i2c_address || ‘0x3C’,

display_mode: inst.config.display_mode || ‘idle_status’,

gpio_sda:     inst.pinAssign.sda,

gpio_scl:     inst.pinAssign.scl,

}));

return JSON.stringify({ buttons, dial_modes, oleds, sliders }, null, 2);

}

// – Download —————————————————––

document.getElementById(‘btn-download’).addEventListener(‘click’, () => {

// Check for errors

const errors = document.querySelectorAll(’.note-error’);

if (errors.length) {

const proceed = confirm(‘There are configuration errors. Download anyway?’);

if (!proceed) {

document.querySelectorAll(’.ptab’)[1].click(); // switch to notes tab

return;

}

}

const json = buildConfigJSON();

const blob = new Blob([json], { type: ‘application/json’ });

const url  = URL.createObjectURL(blob);

const a    = document.createElement(‘a’);

a.href     = url;

a.download = ‘config.json’;

a.click();

URL.revokeObjectURL(url);

});

document.getElementById(‘btn-clear’).addEventListener(‘click’, () => {

if (state.placed.length && !confirm(‘Remove all components?’)) return;

state.placed.forEach(p => { const e = document.getElementById(‘comp-’+p.id); if(e) e.remove(); });

state.placed = [];

state.selectedId = null;

deselectAll();

buildShelf();

updateWires();

updateStats();

updateNotes();

updateLibs();

canvasHint.classList.remove(‘hidden’);

});

// – Drag & drop from shelf —————————————–

let shelfDrag = null;

const dragGhost = document.createElement(‘div’);

dragGhost.className = ‘drag-ghost’;

document.body.appendChild(dragGhost);

function onShelfMouseDown(e) {

if (e.button !== 0) return;

const item = e.currentTarget;

shelfDrag = item.dataset.compId;

const comp = COMPONENT_LIBRARY[shelfDrag];

dragGhost.textContent = comp.icon + ’ ’ + comp.shortName;

dragGhost.style.display = ‘block’;

dragGhost.style.left = (e.clientX - 40) + ‘px’;

dragGhost.style.top  = (e.clientY - 20) + ‘px’;

e.preventDefault();

}

// – Global mouse events ––––––––––––––––––––––

document.addEventListener(‘mousemove’, e => {

if (shelfDrag) {

dragGhost.style.left = (e.clientX - 40) + ‘px’;

dragGhost.style.top  = (e.clientY - 20) + ‘px’;

}

if (state.dragging) {

const cRect = canvasWrap.getBoundingClientRect();

if (state.dragging.type === ‘chip’) {

const nx = e.clientX - cRect.left - state.dragging.offX;

const ny = e.clientY - cRect.top  - state.dragging.offY;

state.chipPos = { x: Math.max(0, nx), y: Math.max(0, ny) };

chipEl.style.left = state.chipPos.x + ‘px’;

chipEl.style.top  = state.chipPos.y + ‘px’;

updateWires();

} else if (state.dragging.type === ‘component’) {

const inst = state.placed.find(p => p.id === state.dragging.id);

if (inst) {

const nx = e.clientX - cRect.left - state.dragging.offX;

const ny = e.clientY - cRect.top  - state.dragging.offY;

inst.x = Math.max(0, nx);

inst.y = Math.max(0, ny);

const el = document.getElementById(‘comp-’ + inst.id);

if (el) { el.style.left = inst.x + ‘px’; el.style.top = inst.y + ‘px’; }

updateWires();

}

}

}

});

document.addEventListener(‘mouseup’, e => {

if (shelfDrag) {

const cRect = canvasWrap.getBoundingClientRect();

if (e.clientX >= cRect.left && e.clientX <= cRect.right &&

e.clientY >= cRect.top  && e.clientY <= cRect.bottom) {

const x = e.clientX - cRect.left - 45;

const y = e.clientY - cRect.top  - 30;

addComponent(shelfDrag, x, y);

}

shelfDrag = null;

dragGhost.style.display = ‘none’;

}

if (state.dragging) state.dragging = null;

});

// – Canvas click to deselect —————————————

function bindCanvas() {

canvasWrap.addEventListener(‘click’, e => {

if (e.target === canvasWrap || e.target === canvas || e.target.classList.contains(‘canvas-grid’)) {

deselectAll();

hideCtxMenu();

}

});

document.addEventListener(‘keydown’, e => {

if (e.key === ‘Escape’) { deselectAll(); hideCtxMenu(); }

if ((e.key === ‘Delete’ || e.key === ‘Backspace’) && state.selectedId && document.activeElement === document.body) {

removeComponent(state.selectedId);

}

});

}

// – Context menu —————————————————

function showCtxMenu(x, y) {

ctxMenu.style.left = x + ‘px’;

ctxMenu.style.top  = y + ‘px’;

ctxMenu.classList.add(‘visible’);

}

function hideCtxMenu() { ctxMenu.classList.remove(‘visible’); }

function bindContextMenu() {

document.getElementById(‘ctx-config’).addEventListener(‘click’, () => {

if (ctxTargetId) selectComponent(ctxTargetId);

hideCtxMenu();

});

document.getElementById(‘ctx-duplicate’).addEventListener(‘click’, () => {

if (ctxTargetId) {

const src = state.placed.find(p => p.id === ctxTargetId);

if (src) addComponent(src.compId, src.x + 30, src.y + 30);

}

hideCtxMenu();

});

document.getElementById(‘ctx-delete’).addEventListener(‘click’, () => {

if (ctxTargetId) removeComponent(ctxTargetId);

hideCtxMenu();

});

document.addEventListener(‘click’, e => {

if (!ctxMenu.contains(e.target)) hideCtxMenu();

});

}

// – Panel tabs —————————————————–

function bindPanelTabs() {

document.querySelectorAll(’.ptab’).forEach(tab => {

tab.addEventListener(‘click’, () => {

document.querySelectorAll(’.ptab’).forEach(t => t.classList.remove(‘active’));

tab.classList.add(‘active’);

const target = tab.dataset.tab;

document.getElementById(‘panel-config’).classList.toggle(‘hidden’, target !== ‘config’);

document.getElementById(‘panel-notes’).classList.toggle(‘hidden’, target !== ‘notes’);

document.getElementById(‘panel-libs’).classList.toggle(‘hidden’, target !== ‘libs’);

});

});

}

// – Header ———————————————————

function bindHeader() { /* download and clear bound directly above */ }

// – Tooltip ––––––––––––––––––––––––––––

function showTooltip(x, y, title, body) {

tooltip.innerHTML = `<div class="tooltip-title">${title}</div><div class="tooltip-body">${body}</div>`;

tooltip.classList.add(‘visible’);

moveTooltip(x, y);

}

function moveTooltip(x, y) {

tooltip.style.left = (x + 12) + ‘px’;

tooltip.style.top  = (y + 12) + ‘px’;

}

function hideTooltip() { tooltip.classList.remove(‘visible’); }

// – Boot ———————————————————–

window.addEventListener(‘load’, init);

window.addEventListener(‘resize’, () => { updateWires(); });
 
