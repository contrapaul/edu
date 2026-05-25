// -- State ----------------------------------------------------------
const state = {
  placed: [],         // placed component instances
  nextId: 1,
  selectedId: null,
  chipPos: { x: 0, y: 0 },
  dragging: null,     // { type: 'component'|'chip', id, offX, offY }
  device: 'esp32s3_n16r8',  // selected microcontroller
};

// -- DOM refs -------------------------------------------------------
const canvas      = document.getElementById('canvas');
const wireLayer   = document.getElementById('wire-layer');
const nodeLayer   = document.getElementById('node-layer');
const canvasWrap  = document.getElementById('canvas-wrap');
const canvasHint  = document.getElementById('canvas-hint');
const shelfItems  = document.getElementById('shelf-items');
const ctxMenu     = document.getElementById('ctx-menu');
const tooltip     = document.getElementById('tooltip');
const panelForm   = document.getElementById('panel-form');
const panelEmpty  = document.getElementById('panel-empty');
const notesList   = document.getElementById('notes-list');
const libList     = document.getElementById('lib-list');
const statComponents = document.getElementById('stat-components');
const statPins       = document.getElementById('stat-pins');
const statLibs       = document.getElementById('stat-libs');
const simFeedback    = document.getElementById('sim-feedback');
const simFeedbackCanvas = document.getElementById('sim-feedback-canvas');
const simFeedbackText   = document.getElementById('sim-feedback-text');
const simFeedbackSub    = document.getElementById('sim-feedback-sub');

let ctxTargetId = null;
let chipEl = null;

// -- Simulation state (interactive component previews) ---------------
const simState = {
  buttons:  {},   // instId → { pressed: false }
  encoders: {},   // instId → rotation angle in degrees
  sliders:  {},   // instId → value 0–100
  joysticks:{},   // instId → { x: 0, y: 0 }  (-1..1 normalized)
};

// Shared sim display — updated by any interaction, read by all OLED renderers
// and the virtual sim-feedback widget.
const simDisplay = {
  mode:      'idle',   // 'idle' | 'button' | 'encoder' | 'slider' | 'joystick' | 'mode_toggle'
  label:     '',       // short component label
  text:      '',       // main display line
  value:     0,        // numeric (0–100 for slider, deg for encoder, -1..1 for joy axes)
  value2:    0,        // secondary numeric (y-axis for joystick)
  timestamp: 0,        // Date.now() when last updated
};
let simDisplayTimer = null;

function triggerDisplay(mode, label, text, value, value2 = 0) {
  simDisplay.mode      = mode;
  simDisplay.label     = label;
  simDisplay.text      = text;
  simDisplay.value     = value;
  simDisplay.value2    = value2;
  simDisplay.timestamp = Date.now();
  renderAllDisplays();
  // Auto-reset to idle after 2.5 s of inactivity
  if (simDisplayTimer) clearTimeout(simDisplayTimer);
  simDisplayTimer = setTimeout(() => {
    simDisplay.mode = 'idle';
    renderAllDisplays();
  }, 2500);
}

function renderAllDisplays() {
  // Re-render every OLED on canvas
  state.placed.forEach(inst => {
    if (['ssd1306_i2c','ssd1306_spi','sh1106','ssd1309'].includes(inst.compId)) {
      renderOledCanvas(inst.id);
    }
  });
  // Always update the virtual feedback widget
  renderSimFeedback();
}

// -- Init -----------------------------------------------------------
function init() {
  buildDeviceSelector();
  buildShelf();
  buildChip();
  placeChipCenter();
  bindHeader();
  buildPresetUI();
  bindModal();
  bindPanelTabs();
  bindContextMenu();
  bindCanvas();
  updateStats();
}

// -- Device selector ------------------------------------------------
const DEVICES = {
  esp32s3_n16r8: {
    label: 'ESP32-S3 N16R8',
    logo: 'ESP32-S3',
    model: 'N16R8',
    pinset: 'ESP32S3_PINS',
    chipWidth: 220,
    chipColor: '#1a2a1a',
    chipBorder: '#3a6a30',
    logoColor: '#4aaa40',
    maxGpio: 22,
    unsupported: [],
    warnings: { 'GPIO0': 'Boot mode pin -- avoid if possible.' },
    note: 'Full-featured. Supports all components. 22 GPIO per side. Dual USB-C.',
    maxInstances: { button: 12, ky040: 2, hw040: 2, ssd1306_i2c: 2, ssd1309: 1, sh1106: 2, ps2_joystick: 2, hw371: 4, slide_pot_long: 4 },
  },
  esp32c3_super_mini: {
    label: 'ESP32-C3 Super Mini',
    logo: 'ESP32-C3',
    model: 'Super Mini',
    pinset: 'ESP32C3_SUPERMINI_PINS',
    chipWidth: 160,
    chipColor: '#1a1a2a',
    chipBorder: '#3a3a7a',
    logoColor: '#5a5aee',
    maxGpio: 13,
    unsupported: ['ssd1306_spi','ssd1309','sh1106'],
    warnings: {
      'GPIO8': 'Onboard blue LED (active LOW) -- LED will flicker when used as SDA.',
      'GPIO9': 'BOOT button -- may cause issues as SCL.',
      'GPIO2': 'Strapping pin -- add 10k pull resistor.',
    },
    note: '13 usable GPIO. Compact USB-C. Good for buttons, encoders, I2C OLED.',
    maxInstances: { button: 8, ky040: 1, hw040: 1, ssd1306_i2c: 1, ps2_joystick: 1, hw371: 2, slide_pot_long: 2 },
  },
  esp32c3_devkit: {
    label: 'ESP32-C3 Dev Board',
    logo: 'ESP32-C3',
    model: 'Dev Board',
    pinset: 'ESP32C3_DEVKIT_PINS',
    chipWidth: 190,
    chipColor: '#1a1a2a',
    chipBorder: '#3a3a7a',
    logoColor: '#5a5aee',
    maxGpio: 12,
    unsupported: ['ssd1306_spi'],
    warnings: {
      'GPIO9':  'BOOT button pin.',
      'GPIO18': 'USB D- -- only available when USB CDC not active.',
      'GPIO19': 'USB D+ -- only available when USB CDC not active.',
    },
    note: '12 usable GPIO. Dual USB-C. Many GND pins for breadboard use.',
    maxInstances: { button: 8, ky040: 1, hw040: 1, ssd1306_i2c: 1, ssd1309: 1, ps2_joystick: 1, hw371: 2, slide_pot_long: 2 },
  },
  xiao_samd21: {
    label: 'Seeed XIAO SAMD21',
    logo: 'XIAO',
    model: 'SAMD21',
    pinset: 'XIAO_SAMD21_PINS',
    chipWidth: 140,
    chipColor: '#1a2a2a',
    chipBorder: '#2a7a6a',
    logoColor: '#3aeecc',
    maxGpio: 11,
    unsupported: ['ssd1306_spi','ps2_joystick'],
    warnings: {},
    note: '11 GPIO. No WiFi. Native USB HID. 3.3V logic only -- do NOT apply 5V to pins.',
    maxInstances: { button: 7, ky040: 1, hw040: 1, ssd1306_i2c: 1, sh1106: 1, hw371: 2, slide_pot_long: 2 },
  },
};

function getCurrentPins() {
  const PIN_SETS = {
    'ESP32S3_PINS':           ESP32S3_PINS,
    'ESP32C3_SUPERMINI_PINS': ESP32C3_SUPERMINI_PINS,
    'ESP32C3_DEVKIT_PINS':    ESP32C3_DEVKIT_PINS,
    'XIAO_SAMD21_PINS':       XIAO_SAMD21_PINS,
  };
  const dev = DEVICES[state.device];
  return PIN_SETS[dev.pinset] || ESP32S3_PINS;
}

// -- Shelf ----------------------------------------------------------
function buildShelf() {
  shelfItems.innerHTML = '';
  const dev = DEVICES[state.device];
  Object.values(COMPONENT_LIBRARY).forEach(comp => {
    const maxInst = (dev.maxInstances && dev.maxInstances[comp.id]) || comp.maxInstances;
    const count = state.placed.filter(p => p.compId === comp.id).length;
    const atMax = count >= maxInst;
    const el = document.createElement('div');
    el.className = 'shelf-item' + (atMax ? ' disabled' : '');
    el.dataset.compId = comp.id;
    el.innerHTML = `
      <span class="shelf-item-count">${count}/${maxInst}</span>
      <span class="shelf-item-icon">${comp.icon}</span>
      <span class="shelf-item-name">${comp.shortName}</span>
    `;
    el.title = comp.description;
    if (!atMax) {
      el.addEventListener('mousedown', onShelfMouseDown);
      el.addEventListener('click', () => addComponent(comp.id));
    }
    shelfItems.appendChild(el);
  });
}

function buildDeviceSelector() {
  // Remove existing selector if any
  const existing = document.getElementById('device-selector-wrap');
  if (existing) existing.remove();

  const wrap = document.createElement('div');
  wrap.id = 'device-selector-wrap';
  wrap.className = 'device-selector-wrap';
  wrap.innerHTML = '<span class="device-label">DEVICE:</span>';

  Object.entries(DEVICES).forEach(([id, dev]) => {
    const btn = document.createElement('button');
    btn.className = 'device-btn' + (state.device === id ? ' active' : '');
    btn.textContent = dev.label;
    btn.title = dev.note;
    btn.addEventListener('click', () => {
      state.device = id;
      const old = document.getElementById('esp32-chip');
      if (old) old.remove();
      buildChip();
      placeChipCenter();

      // Auto-remap pin assignments to new device's pin set
      const newPins    = getCurrentPins();
      const validPinIds = new Set(newPins.map(p => p.id));

      state.placed.forEach(inst => {
        const comp = COMPONENT_LIBRARY[inst.compId];
        // Build a set of already-taken pins for this remap pass
        const taken = new Set();
        Object.entries(inst.pinAssign).forEach(([pgId, pinId]) => {
          if (pinId && validPinIds.has(pinId)) taken.add(pinId);
        });

        comp.pinGroups.forEach(pg => {
          const cur = inst.pinAssign[pg.id];
          if (!cur) return; // already unassigned
          if (validPinIds.has(cur)) return; // still valid on new device
          if (pg.fixed) {
            // Fixed pins: try the same fixedPin; if missing, leave blank
            inst.pinAssign[pg.id] = validPinIds.has(pg.fixedPin) ? pg.fixedPin : '';
            return;
          }
          // Find next compatible unused pin on new device
          const compat = newPins.filter(p =>
            !['GND_L','GND_R1','GND_R2','GND_R3','3V3_A','3V3_B','5VIN','RST',
              'XIAO_VCC','XIAO_GND','XIAO_3V3','XIAO_BGND','XIAO_VIN',
              'C3SM_5V','C3SM_GND','C3SM_3V3',
              'C3D_GND1','C3D_GND2','C3D_GND3','C3D_GND4','C3D_GND5',
              'C3D_GND6','C3D_GND7','C3D_GND8','C3D_GND9','C3D_GND10',
              'C3D_3V3A','C3D_3V3B','C3D_5VA','C3D_5VB',
              'C3D_RST','C3D_RST2','C3D_PWR'].includes(p.id) &&
            p.types.some(t => t === pg.type || (pg.type === 'gpio' && t === 'gpio') ||
              (pg.type === 'analog' && t === 'analog'))
          );
          let chosen = '';
          for (const p of compat) {
            if (!taken.has(p.id)) { chosen = p.id; taken.add(p.id); break; }
          }
          inst.pinAssign[pg.id] = chosen;
        });
        renderComponent(inst);
      });

      updateWires();
      wrap.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      buildShelf();
      updateStats();
      updateNotes();
    });
    wrap.appendChild(btn);
  });

  // Insert after shelf
  const shelf = document.getElementById('shelf');
  shelf.parentNode.insertBefore(wrap, shelf.nextSibling);
}

// -- Chip rendering -------------------------------------------------
function buildChip() {
  chipEl = document.createElement('div');
  chipEl.className = 'esp32-chip';
  chipEl.id = 'esp32-chip';

  const dev = DEVICES[state.device];
  chipEl.style.width       = (dev.chipWidth || 200) + 'px';
  chipEl.style.background  = dev.chipColor  || 'var(--chip-bg)';
  chipEl.style.borderColor = dev.chipBorder || 'var(--chip-border)';

  const allPins    = getCurrentPins();
  const leftPins   = allPins.filter(p => p.side === 'left');
  const rightPins  = allPins.filter(p => p.side === 'right');
  const bottomPins = allPins.filter(p => p.side === 'bottom');

  let leftHTML = '', rightHTML = '', bottomHTML = '';

  // Left pins: dot → stub → label (label is to the right, inside board)
  leftPins.forEach(pin => {
    const cls = pinClass(pin);
    leftHTML += `<div class="pin-item ${cls}" data-pin="${pin.id}" title="${pin.label}: ${pin.note}">
        <div class="pin-dot"></div><div class="pin-stub"></div>
        <div class="pin-label">${pin.label}</div></div>`;
  });
  // Right pins: label → stub → dot (label is to the left, inside board)
  rightPins.forEach(pin => {
    const cls = pinClass(pin);
    rightHTML += `<div class="pin-item ${cls}" data-pin="${pin.id}" title="${pin.label}: ${pin.note}">
        <div class="pin-label">${pin.label}</div><div class="pin-stub"></div>
        <div class="pin-dot"></div></div>`;
  });
  bottomPins.forEach(pin => {
    const cls = pinClass(pin);
    bottomHTML += `<div class="pin-item pin-item-bottom ${cls}" data-pin="${pin.id}" title="${pin.label}: ${pin.note}">
        <div class="pin-label">${pin.label}</div><div class="pin-stub-bottom"></div>
        <div class="pin-dot"></div></div>`;
  });

  let centerContent = '';
  if (state.device === 'esp32s3_n16r8') {
    // S3: logo text centered, dual USB-C at bottom
    centerContent = `
      <div class="chip-logo-text" style="color:${dev.logoColor}">${dev.logo}</div>
      <div class="chip-model-text">${dev.model}</div>
      <div class="chip-usb-labels-bottom">
        <div class="chip-usb-label" style="color:${dev.logoColor}">USB-C</div>
        <div class="chip-usb-label" style="color:${dev.logoColor}">USB-C</div>
      </div>`;
  } else if (state.device.startsWith('esp32c3')) {
    // C3: single USB-C at top, logo centered
    centerContent = `
      <div class="chip-usb-label chip-usb-label-top" style="color:${dev.logoColor}">USB-C</div>
      <div class="chip-logo-text" style="color:${dev.logoColor}">${dev.logo}</div>
      <div class="chip-model-text">${dev.model}</div>`;
  } else if (state.device === 'xiao_samd21') {
    // XIAO: USB-C at top, bare chip label, bottom pads
    centerContent = `
      <div class="chip-usb-label chip-usb-label-top" style="color:${dev.logoColor}">USB-C</div>
      <div class="xiao-view-label">▲ Top view</div>
      <div class="chip-logo-text" style="color:${dev.logoColor}">${dev.logo}</div>
      <div class="chip-model-text">${dev.model}</div>
      ${bottomPins.length ? `<div class="chip-bottom-pins">${bottomHTML}</div>` : ''}`;
  }

  chipEl.innerHTML = `
    <div class="chip-top-bar chip-drag-handle" style="background:${dev.chipBorder}">
      <div class="chip-name" style="color:${dev.logoColor}">${dev.label}</div>
    </div>
    <div class="chip-body">
      <div class="pin-col left">${leftHTML}</div>
      <div class="chip-center">${centerContent}</div>
      <div class="pin-col right">${rightHTML}</div>
    </div>
  `;

  canvas.appendChild(chipEl);

  // Chip drag ONLY from the top bar / drag handle — not the entire chip body
  const dragHandle = chipEl.querySelector('.chip-drag-handle');
  dragHandle.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    const rect = chipEl.getBoundingClientRect();
    state.dragging = {
      type: 'chip',
      offX: e.clientX - rect.left,
      offY: e.clientY - rect.top,
    };
    e.preventDefault();
    e.stopPropagation();
  });
}

function pinClass(pin) {
  if (pin.types.includes('power')) return 'power';
  if (pin.types.includes('gnd'))   return 'gnd';
  return '';
}

function placeChipCenter() {
  // Place chip in center of the visible canvas viewport area
  const cx = canvasWrap.scrollLeft + Math.max(40, canvasWrap.clientWidth  / 2 - 100);
  const cy = canvasWrap.scrollTop  + Math.max(40, canvasWrap.clientHeight / 2 - 160);
  state.chipPos = { x: cx, y: cy };
  chipEl.style.left = cx + 'px';
  chipEl.style.top  = cy + 'px';
}

// -- Pin position helper --------------------------------------------
// Returns canvas-absolute coordinates of a pin dot.
// We read the chip's canvas position from state.chipPos and add the pin's
// position within the chip element. This is scroll-independent and works
// at any distance — no getBoundingClientRect() math that breaks when
// elements scroll out of the visible viewport.
function getPinPos(pinId) {
  const pinEl = chipEl.querySelector(`[data-pin="${pinId}"]`);
  if (!pinEl) return null;
  const dot = pinEl.querySelector('.pin-dot');
  if (!dot) return null;

  // Use offset* properties relative to the chip element itself (no scroll/viewport dependency)
  // offsetParent chain: dot → pin-item → pin-col → chip-body → chip-el
  let ox = 0, oy = 0;
  let el = dot;
  while (el && el !== chipEl) {
    ox += el.offsetLeft;
    oy += el.offsetTop;
    el = el.offsetParent;
  }
  // Add chip's canvas position
  return {
    x: state.chipPos.x + ox + dot.offsetWidth  / 2,
    y: state.chipPos.y + oy + dot.offsetHeight / 2,
  };
}

// -- Utility helpers ------------------------------------------------
// Count all non-power/non-gnd pin groups across all placed components.
// Used to assign each new component's baseColorIdx so every signal wire
// gets a unique sequential palette slot (red=power, black=GND are reserved).
function countSignalPins() {
  let count = 0;
  state.placed.forEach(inst => {
    const comp = COMPONENT_LIBRARY[inst.compId];
    count += comp.pinGroups.filter(pg =>
      pg.wireClass !== 'wire-power' && pg.wireClass !== 'wire-gnd'
    ).length;
  });
  return count;
}

function isSignalPin(pg) {
  return pg.wireClass !== 'wire-power' && pg.wireClass !== 'wire-gnd';
}

function htmlEscape(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// -- Undo / Redo ----------------------------------------------------
const undoStack = [];
const redoStack = [];
const MAX_UNDO  = 30;

function snapshotState() {
  return JSON.stringify({ placed: state.placed, nextId: state.nextId });
}

function pushUndo() {
  undoStack.push(snapshotState());
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  redoStack.length = 0;
}

function restoreSnapshot(snap) {
  const s = JSON.parse(snap);
  state.placed.forEach(p => { const e = document.getElementById('comp-' + p.id); if (e) e.remove(); });
  state.placed  = s.placed;
  state.nextId  = s.nextId;
  // Backfill baseColorIdx for instances saved before this field was added
  let runningIdx = 0;
  state.placed.forEach(inst => {
    if (inst.baseColorIdx === undefined) {
      inst.baseColorIdx = runningIdx;
      inst.wireColor = WIRE_SEQ[runningIdx % WIRE_SEQ.length];
    }
    const comp = COMPONENT_LIBRARY[inst.compId];
    if (comp) {
      runningIdx += comp.pinGroups.filter(pg =>
        pg.wireClass !== 'wire-power' && pg.wireClass !== 'wire-gnd'
      ).length;
    }
  });
  state.selectedId = null;
  closeCompConfig();
  state.placed.forEach(inst => renderComponent(inst));
  buildShelf();
  updateWires();
  updateStats();
  updateNotes();
  updateLibs();
  deselectAll();
  // Re-render OLED canvases after DOM settles
  requestAnimationFrame(() => {
    state.placed.forEach(inst => {
      if (['ssd1306_i2c','ssd1306_spi','sh1106','ssd1309'].includes(inst.compId)) {
        renderOledCanvas(inst.id);
      }
    });
  });
  if (state.placed.length === 0) canvasHint.classList.remove('hidden');
  else canvasHint.classList.add('hidden');
}

function undo() {
  if (undoStack.length === 0) return;
  redoStack.push(snapshotState());
  restoreSnapshot(undoStack.pop());
}

function redo() {
  if (redoStack.length === 0) return;
  undoStack.push(snapshotState());
  restoreSnapshot(redoStack.pop());
}

// -- Add component --------------------------------------------------
function addComponent(compId, x, y) {
  const comp = COMPONENT_LIBRARY[compId];
  if (!comp) return;
  pushUndo();
  const count = state.placed.filter(p => p.compId === compId).length;

  // Per-device max instances
  const dev = DEVICES[state.device];
  const maxInst = (dev.maxInstances && dev.maxInstances[compId]) || comp.maxInstances;
  if (count >= maxInst) return;

  // x/y are already canvas-absolute when passed from drop handler
  // When clicking shelf button, pick a visible spot relative to current scroll
  const px = x !== undefined ? x : canvasWrap.scrollLeft + 80 + Math.random() * (canvasWrap.clientWidth  - 280);
  const py = y !== undefined ? y : canvasWrap.scrollTop  + 80 + Math.random() * (canvasWrap.clientHeight - 200);

  // Default pin assignments  --  prefer recommended pins, auto-assign next available
  const pinAssign = {};

  // Build set of globally used GPIO pins before this component
  const usedGPIO = new Set();
  state.placed.forEach(existing => {
    Object.values(existing.pinAssign).forEach(pid => {
      if (pid && !['GND_L','GND_R1','GND_R2','GND_R3','3V3_A','3V3_B','5VIN','RST'].includes(pid)) usedGPIO.add(pid);
    });
  });

  comp.pinGroups.forEach(pg => {
    if (pg.fixed) {
      pinAssign[pg.id] = pg.fixedPin;
    } else if (pg.conditional) {
      // Conditional pins (e.g. LED)  --  leave unassigned until enabled
      pinAssign[pg.id] = '';
    } else {
      // Try preferred first, then walk the pin list for next available compatible pin
      const compat = getCurrentPins().filter(p =>
        !['GND_L','GND_R1','GND_R2','GND_R3','3V3_A','3V3_B','5VIN','RST'].includes(p.id) &&
        p.types.some(t => pg.type === t || t === 'gpio')
      );
      let chosen = '';
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

  // Count signal pins across all already-placed components so each new component
  // starts at the next palette slot. baseColorIdx is stored on the instance so
  // getWireColor() can compute per-pin colors without re-counting the world each time.
  const baseColorIdx = countSignalPins();

  const instance = {
    id: state.nextId++,
    compId,
    x: px,
    y: py,
    pinAssign,
    config,
    label: comp.shortName + ' ' + (count + 1),
    wireColor: WIRE_SEQ[baseColorIdx % WIRE_SEQ.length],
    baseColorIdx,
    // nodes: per-pg canvas positions for the wire-end circles
    // Initialized below after instance is created
    nodes: {},
  };

  // Place each node near the chip by default (offset from placement position)
  // They'll snap to assigned pins automatically in updateWires
  comp.pinGroups.forEach((pg, i) => {
    // Default node position: offset to the right of the component, spread vertically
    const chipOffX = state.chipPos.x - px;
    const dirX = chipOffX > 0 ? 80 : -80;
    instance.nodes[pg.id] = {
      x: px + (instance.x < state.chipPos.x ? 60 : -60) + dirX * 0.4,
      y: py + (i - (comp.pinGroups.length - 1) / 2) * 22,
      snapped: pinAssign[pg.id] || null,
    };
  });
  // Snap nodes to their auto-assigned pins
  syncNodesToPins(instance);

  state.placed.push(instance);
  renderComponent(instance);
  selectComponent(instance.id);
  buildShelf();
  updateWires();
  updateStats();
  updateNotes();
  updateLibs();
  canvasHint.classList.add('hidden');
}

// -- Component body helpers -----------------------------------------
function getButtonActionLabel(inst) {
  const c = inst.config;
  const type = c.action_type;
  if (type === 'hotkey') {
    const keys = [c.key1, c.key2, c.key3].filter(Boolean);
    return keys.length ? keys.join('+') : '(no keys)';
  }
  if (type === 'actions') return c.consumer_action || 'Media Key';
  if (type === 'launch')  return 'Launch: ' + (c.program || '?');
  if (type === 'type')    return '"' + (c.type_text || '…') + '"';
  if (type === 'mode_toggle')   return 'Mode Toggle';
  if (type === 'config_toggle') return 'Config Toggle';
  return '';
}

function buildButtonBody(inst) {
  const label = inst.config.label || 'Button';
  const action = getButtonActionLabel(inst);
  return `<div class="comp-body comp-body-button">
    <div class="btn-visual">
      <div class="btn-keycap" id="btnface-${inst.id}">
        <div class="btn-keycap-top">
          <div class="btn-keycap-label">${htmlEscape(label)}</div>
        </div>
      </div>
    </div>
    <div class="comp-action-label">${htmlEscape(action)}</div>
  </div>`;
}

function buildEncoderBody(inst) {
  const modeName = inst.config.mode_name || 'Encoder';
  const angle = simState.encoders[inst.id] || 0;
  return `<div class="comp-body comp-body-encoder">
    <div class="enc-visual">
      <div class="enc-shaft-ring">
        <div class="enc-knob" id="encknob-${inst.id}" style="transform:rotate(${angle}deg)">
          <div class="enc-indicator"></div>
        </div>
      </div>
    </div>
    <div class="comp-action-label">${htmlEscape(modeName)}</div>
  </div>`;
}

function buildOledBody(inst) {
  const rot = parseInt(inst.config.rotation || '0', 10);
  const isPortrait = (rot === 90 || rot === 270);
  const cw = isPortrait ? 64 : 128;
  const ch = isPortrait ? 128 : 64;
  const scale = isPortrait ? 0.7 : 0.62;
  const dw = Math.round(cw * scale);
  const dh = Math.round(ch * scale);
  return `<div class="comp-body comp-body-oled">
    <div class="oled-bezel" style="width:${dw + 14}px;height:${dh + 14}px">
      <canvas class="oled-canvas" id="oled-${inst.id}"
        width="${cw}" height="${ch}"
        style="width:${dw}px;height:${dh}px"></canvas>
    </div>
  </div>`;
}

function buildSliderBody(inst) {
  const label = inst.config.label || 'Slider';
  const func  = inst.config.function || 'volume';
  const raw = simState.sliders[inst.id] !== undefined ? simState.sliders[inst.id] : 50;
  const pct = inst.config.inverted ? (100 - raw) : raw;
  return `<div class="comp-body comp-body-slider">
    <div class="slider-visual">
      <div class="slider-track-wrap">
        <div class="slider-track" id="slidertrack-${inst.id}">
          <div class="slider-fill" style="width:${pct}%"></div>
          <div class="slider-thumb" id="sliderthumb-${inst.id}" style="left:${pct}%"></div>
        </div>
      </div>
    </div>
    <div class="comp-action-label">${htmlEscape(label)} · ${htmlEscape(func)}</div>
  </div>`;
}

function buildJoystickBody(inst) {
  const label = inst.config.label || 'Joystick';
  const mode  = inst.config.mode  || 'mouse';
  const js    = simState.joysticks[inst.id] || { x: 0, y: 0 };
  const maxOff = 14;
  const dx = js.x * maxOff;
  const dy = js.y * maxOff;
  return `<div class="comp-body comp-body-joystick">
    <div class="joy-visual">
      <div class="joy-gate"></div>
      <div class="joy-base">
        <div class="joy-stick" id="joystick-${inst.id}" style="transform:translate(${dx}px,${dy}px)">
          <div class="joy-stick-top"></div>
        </div>
      </div>
    </div>
    <div class="comp-action-label">${htmlEscape(label)} · ${htmlEscape(mode)}</div>
  </div>`;
}

function buildCompBody(inst, comp) {
  switch (inst.compId) {
    case 'button':       return buildButtonBody(inst);
    case 'ky040':
    case 'hw040':        return buildEncoderBody(inst);
    case 'ssd1306_i2c':
    case 'ssd1306_spi':
    case 'sh1106':
    case 'ssd1309':      return buildOledBody(inst);
    case 'hw371':
    case 'slide_pot_long': return buildSliderBody(inst);
    case 'ps2_joystick': return buildJoystickBody(inst);
    default: return '';
  }
}

// -- OLED canvas rendering ------------------------------------------

// Draw interaction feedback (sim state) or a configured idle screen onto ctx.
// W/H are the canvas dimensions. inst is optional — if null, draws generic idle.
function drawDisplayContent(ctx, W, H, inst) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  // If there's active sim feedback, override the configured mode
  if (simDisplay.mode !== 'idle') {
    drawSimFeedbackOnCanvas(ctx, W, H);
    return;
  }

  // --- Idle / configured display mode ---
  const mode = inst ? (inst.config.display_mode || 'idle_status') : 'idle_status';
  ctx.fillStyle = '#ddeeff';

  if (mode === 'custom_text') {
    const text = (inst && inst.config.custom_text) || 'MacroPad';
    const fs = Math.min(14, Math.floor(W / (text.length * 0.65 + 1)));
    ctx.font = `bold ${fs}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, W / 2, H / 2);

  } else if (mode === 'volume_bar') {
    const barW = Math.round(W * 0.78), barH = 10;
    const barX = Math.round((W - barW) / 2), barY = Math.round(H / 2);
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ddeeff';
    ctx.fillText('VOLUME', W / 2, barY - 5);
    ctx.strokeStyle = '#aaccee';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);
    ctx.fillStyle = '#6699cc';
    ctx.fillRect(barX + 1, barY + 1, Math.round(barW * 0.55), barH - 2);

  } else if (mode === 'macro_label') {
    const btn = state.placed.find(p => p.compId === 'button');
    const label = btn ? (btn.config.label || 'Button') : 'Macro';
    const fs = Math.min(13, Math.floor(W / (label.length * 0.7 + 1)));
    ctx.font = `${fs}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ddeeff';
    ctx.fillText(label, W / 2, H / 2);

  } else {
    // idle_status
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ddeeff';
    ctx.fillText('MacroPad', W / 2, Math.round(H * 0.38));
    ctx.fillStyle = '#445566';
    ctx.fillRect(Math.round(W * 0.1), Math.round(H * 0.48), Math.round(W * 0.8), 1);
    ctx.fillStyle = '#778899';
    ctx.font = '8px monospace';
    const cnt = state.placed.length;
    ctx.fillText(cnt + ' component' + (cnt !== 1 ? 's' : ''), W / 2, Math.round(H * 0.72));
  }
}

// Draw simDisplay feedback onto a canvas 2d context (shared by OLED and virtual widget)
function drawSimFeedbackOnCanvas(ctx, W, H) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  const m = simDisplay.mode;

  if (m === 'button') {
    // Large label + PRESSED indicator
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(simDisplay.label.toUpperCase(), W / 2, Math.round(H * 0.32));
    ctx.fillStyle = '#3eed8a';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('PRESSED', W / 2, Math.round(H * 0.58));
    ctx.fillStyle = '#224422';
    ctx.beginPath();
    ctx.arc(W / 2, Math.round(H * 0.82), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3eed8a';
    ctx.beginPath();
    ctx.arc(W / 2, Math.round(H * 0.82), 3, 0, Math.PI * 2);
    ctx.fill();

  } else if (m === 'encoder') {
    const deg = Math.round(simDisplay.value);
    const dir = simDisplay.value2 > 0 ? '▶ CW' : '◀ CCW';
    ctx.fillStyle = '#ddeeff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(simDisplay.label.toUpperCase(), W / 2, Math.round(H * 0.28));
    ctx.fillStyle = '#ffcc44';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(dir, W / 2, Math.round(H * 0.56));
    ctx.fillStyle = '#8899aa';
    ctx.font = '8px monospace';
    ctx.fillText(deg + '°', W / 2, Math.round(H * 0.8));

  } else if (m === 'slider') {
    const pct = Math.round(simDisplay.value);
    const barW = Math.round(W * 0.80), barH = 9;
    const barX = Math.round((W - barW) / 2);
    const barY = Math.round(H * 0.48);
    ctx.fillStyle = '#ddeeff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(simDisplay.label.toUpperCase(), W / 2, Math.round(H * 0.3));
    ctx.strokeStyle = '#4488aa';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);
    ctx.fillStyle = '#22aaee';
    ctx.fillRect(barX + 1, barY + 1, Math.round(barW * pct / 100), barH - 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = '9px monospace';
    ctx.fillText(pct + '%', W / 2, Math.round(H * 0.82));

  } else if (m === 'joystick') {
    const jx = simDisplay.value;
    const jy = simDisplay.value2;
    const cx2 = W / 2, cy2 = H / 2 + 4;
    const r = Math.round(Math.min(W, H) * 0.28);
    ctx.fillStyle = '#ddeeff';
    ctx.font = 'bold 8px monospace';
    ctx.fillText(simDisplay.label.toUpperCase(), W / 2, Math.round(H * 0.16));
    // Crosshair circle
    ctx.strokeStyle = '#334455';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx2, cy2, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#223344';
    ctx.beginPath();
    ctx.moveTo(cx2 - r, cy2); ctx.lineTo(cx2 + r, cy2);
    ctx.moveTo(cx2, cy2 - r); ctx.lineTo(cx2, cy2 + r);
    ctx.stroke();
    // Position dot
    const dotX = cx2 + Math.round(jx * r);
    const dotY = cy2 + Math.round(jy * r);
    ctx.fillStyle = '#33ccff';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
    ctx.fill();

  } else if (m === 'mode_toggle') {
    ctx.fillStyle = '#ffcc44';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('MODE SWITCH', W / 2, Math.round(H * 0.38));
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(simDisplay.text, W / 2, Math.round(H * 0.65));

  } else {
    // generic
    ctx.fillStyle = '#ddeeff';
    ctx.font = '9px monospace';
    ctx.fillText(simDisplay.text || simDisplay.label, W / 2, H / 2);
  }
}

function renderOledCanvas(instId) {
  const inst = state.placed.find(p => p.id === instId);
  if (!inst) return;
  const cv = document.getElementById('oled-' + instId);
  if (!cv) return;
  const ctx = cv.getContext('2d');
  drawDisplayContent(ctx, cv.width, cv.height, inst);
}

// Virtual sim-feedback widget — shown when no OLED is on canvas,
// or always shown briefly when an interaction fires.
function renderSimFeedback() {
  if (!simFeedback || !simFeedbackCanvas) return;
  const hasOled = state.placed.some(inst =>
    ['ssd1306_i2c','ssd1306_spi','sh1106','ssd1309'].includes(inst.compId));

  if (simDisplay.mode === 'idle' && hasOled) {
    simFeedback.classList.add('hidden');
    return;
  }
  simFeedback.classList.remove('hidden');

  // Draw on virtual canvas
  const ctx = simFeedbackCanvas.getContext('2d');
  drawDisplayContent(ctx, simFeedbackCanvas.width, simFeedbackCanvas.height, null);

  // Update text labels
  if (simDisplay.mode === 'idle') {
    simFeedbackText.textContent = 'Interact with a component…';
    simFeedbackSub.textContent  = '';
  } else {
    simFeedbackText.textContent = simDisplay.text  || simDisplay.label;
    simFeedbackSub.textContent  = simDisplay.label || '';
  }
}

// -- Interactive component simulation -------------------------------
function bindCompInteractions(el, inst) {
  const compLabel = inst.label || inst.compId;

  // Button — click to press; shows action on display
  if (inst.compId === 'button') {
    const face = el.querySelector('.btn-keycap');
    if (!face) return;
    face.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      e.stopPropagation();
      face.classList.add('pressed');
      simState.buttons[inst.id] = { pressed: true };
      const action = inst.config.action || 'key';
      const lbl    = inst.config.label  || inst.config.key || inst.config.macro || 'button';
      // Detect config toggle
      if (action === 'config_toggle') {
        triggerDisplay('mode_toggle', compLabel, 'CONFIG 2', 0);
      } else {
        triggerDisplay('button', compLabel, lbl.toUpperCase(), 1);
      }
    });
    const release = () => {
      face.classList.remove('pressed');
      if (simState.buttons[inst.id]) simState.buttons[inst.id].pressed = false;
    };
    face.addEventListener('mouseup', release);
    face.addEventListener('mouseleave', release);
  }

  // Encoder — scroll wheel or drag to rotate; shows direction + volume bar
  if (inst.compId === 'ky040' || inst.compId === 'hw040') {
    const knob = el.querySelector('.enc-knob');
    if (!knob) return;
    const doEncTrigger = (delta) => {
      const angle = ((simState.encoders[inst.id] || 0) + delta + 3600) % 360;
      simState.encoders[inst.id] = angle;
      knob.style.transform = `rotate(${angle}deg)`;
      triggerDisplay('encoder', compLabel,
        delta > 0 ? '▶ CW' : '◀ CCW', angle, delta);
    };
    knob.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();
      doEncTrigger(e.deltaY > 0 ? 20 : -20);
    }, { passive: false });
    let encDrag = false, encStartY = 0, encStartAngle = 0, encLastDelta = 0;
    knob.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      e.stopPropagation();
      encDrag = true; encStartY = e.clientY;
      encStartAngle = simState.encoders[inst.id] || 0;
      document.body.style.cursor = 'ns-resize';
    });
    document.addEventListener('mousemove', e => {
      if (!encDrag) return;
      const rawDelta = (e.clientY - encStartY) * 2;
      const a = (encStartAngle + rawDelta + 3600) % 360;
      simState.encoders[inst.id] = a;
      knob.style.transform = `rotate(${a}deg)`;
      encLastDelta = rawDelta;
      triggerDisplay('encoder', compLabel, rawDelta > 0 ? '▶ CW' : '◀ CCW', a, rawDelta);
    });
    document.addEventListener('mouseup', () => {
      if (encDrag) { encDrag = false; document.body.style.cursor = ''; }
    });
  }

  // Slider — drag thumb; shows fill bar + percentage
  if (inst.compId === 'hw371' || inst.compId === 'slide_pot_long') {
    const track = el.querySelector('.slider-track');
    const thumb = el.querySelector('.slider-thumb');
    const fill  = el.querySelector('.slider-fill');
    if (!track || !thumb) return;
    let slDrag = false;

    const doSlide = (clientX) => {
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, (clientX - rect.left) / rect.width * 100));
      simState.sliders[inst.id] = pct;
      const dp = inst.config.inverted ? (100 - pct) : pct;
      thumb.style.left = dp + '%';
      if (fill) fill.style.width = dp + '%';
      triggerDisplay('slider', compLabel, Math.round(pct) + '%', pct);
    };

    thumb.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      e.stopPropagation();
      slDrag = true;
      document.body.style.cursor = 'ew-resize';
    });
    track.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      e.stopPropagation();
      slDrag = true;
      document.body.style.cursor = 'ew-resize';
      doSlide(e.clientX);
    });
    document.addEventListener('mousemove', e => {
      if (slDrag) doSlide(e.clientX);
    });
    document.addEventListener('mouseup', () => {
      if (slDrag) { slDrag = false; document.body.style.cursor = ''; }
    });
  }

  // Joystick — drag stick, spring back on release; shows crosshair position
  if (inst.compId === 'ps2_joystick') {
    const stick = el.querySelector('.joy-stick');
    const base  = el.querySelector('.joy-base');
    if (!stick || !base) return;
    let jsDrag = false;
    stick.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      e.stopPropagation();
      jsDrag = true;
      stick.style.transition = '';
      document.body.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
      if (!jsDrag) return;
      const rect = base.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const maxR = rect.width * 0.38;
      let dx = e.clientX - cx, dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > maxR) { dx = dx / dist * maxR; dy = dy / dist * maxR; }
      const nx = dx / maxR, ny = dy / maxR;
      simState.joysticks[inst.id] = { x: nx, y: ny };
      stick.style.transform = `translate(${dx}px,${dy}px)`;
      triggerDisplay('joystick', compLabel,
        `X:${nx >= 0 ? '+' : ''}${nx.toFixed(2)}  Y:${ny >= 0 ? '+' : ''}${ny.toFixed(2)}`,
        nx, ny);
    });
    document.addEventListener('mouseup', () => {
      if (!jsDrag) return;
      jsDrag = false;
      document.body.style.cursor = '';
      simState.joysticks[inst.id] = { x: 0, y: 0 };
      stick.style.transition = 'transform 0.18s cubic-bezier(.18,.89,.32,1.28)';
      stick.style.transform = 'translate(0,0)';
      triggerDisplay('joystick', compLabel, 'X:+0.00  Y:+0.00', 0, 0);
      setTimeout(() => { if (stick) stick.style.transition = ''; }, 200);
    });
  }
}

// -- Render a placed component --------------------------------------
function renderComponent(inst) {
  const comp = COMPONENT_LIBRARY[inst.compId];
  const existing = document.getElementById('comp-' + inst.id);
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = 'placed-component';
  el.id = 'comp-' + inst.id;
  el.style.left = inst.x + 'px';
  el.style.top  = inst.y + 'px';

  const firstSigPg = comp.pinGroups.find(pg => isSignalPin(pg));
  const accentColor = firstSigPg
    ? getWireColor(firstSigPg, inst, 0)
    : (inst.wireColor || comp.color || '#c87941');
  el.style.borderColor = accentColor;
  el.style.setProperty('--comp-accent', accentColor);
  el.style.boxShadow = `0 4px 18px rgba(0,0,0,0.7), 0 0 0 1px ${accentColor}44`;

  const unconfigured = isUnconfigured(inst);
  if (unconfigured) el.classList.add('unconfigured');

  // Pin rows — show wire color on connected pins, subdued on unconnected
  let sigIdx = 0;
  const pinRowsHTML = comp.pinGroups.map((pg) => {
    if (pg.conditional && !inst.config[pg.conditional]) return '';
    const assigned  = inst.pinAssign[pg.id];
    const isSig     = isSignalPin(pg);
    const wireCol   = getWireColor(pg, inst, sigIdx);
    if (isSig) sigIdx++;
    const connected  = assigned && inst.nodes && inst.nodes[pg.id] && inst.nodes[pg.id].snapped;
    const labelColor = connected ? wireCol : 'var(--text2)';
    return `<div class="comp-pin-row">
      <span class="comp-pin-label" style="color:${labelColor}">${pg.label}</span>
      <span class="comp-pin-assigned ${assigned ? 'ok' : 'miss'}" data-pg="${pg.id}">${assigned || '—'}</span>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="comp-header">
      <div class="comp-color-swatch" style="background:${accentColor}" title="Change wire color" onclick="openColorPicker(${inst.id}, this)"></div>
      <span class="comp-icon">${comp.icon}</span>
      <span class="comp-title">${comp.shortName}</span>
      <span class="comp-id">#${inst.id}</span>
      <button class="comp-cog" onclick="openCompConfig(${inst.id}, this)" title="Configure">⚙</button>
    </div>
    ${buildCompBody(inst, comp)}
    <div class="comp-pins">${pinRowsHTML}</div>
    <div class="comp-status ${unconfigured ? 'warn' : 'ok'}">${unconfigured ? '⚠ config' : '✓ ready'}</div>
  `;

  // Drag (exclude interactive elements)
  el.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    if (e.target.closest('.comp-color-swatch')) return;
    if (e.target.closest('.comp-pin-assigned')) return;
    if (e.target.closest('.comp-cog')) return;
    if (e.target.closest('.btn-keycap')) return;
    if (e.target.closest('.enc-knob')) return;
    if (e.target.closest('.slider-thumb')) return;
    if (e.target.closest('.slider-track')) return;
    if (e.target.closest('.joy-stick')) return;
    const rect = el.getBoundingClientRect();
    state.dragging = { type: 'component', id: inst.id, offX: e.clientX - rect.left, offY: e.clientY - rect.top };
    selectComponent(inst.id);
    e.stopPropagation();
    e.preventDefault();
  });

  el.addEventListener('click', e => {
    if (!e.target.closest('.comp-color-swatch') &&
        !e.target.closest('.comp-pin-assigned') &&
        !e.target.closest('.comp-cog')) selectComponent(inst.id);
    e.stopPropagation();
  });

  el.addEventListener('contextmenu', e => {
    e.preventDefault();
    ctxTargetId = inst.id;
    showCtxMenu(e.clientX, e.clientY);
  });

  el.querySelectorAll('.comp-pin-assigned').forEach(badge => {
    badge.addEventListener('click', e => {
      e.stopPropagation();
      openPinReassign(inst.id, badge.dataset.pg, badge);
    });
  });

  canvas.appendChild(el);
  if (state.selectedId === inst.id) el.classList.add('selected');

  // Bind interactive sim & render OLED after DOM mount
  bindCompInteractions(el, inst);
  if (['ssd1306_i2c','ssd1306_spi','sh1106','ssd1309'].includes(inst.compId)) {
    requestAnimationFrame(() => renderOledCanvas(inst.id));
  }
}

// -- Component config popover (cog button) --------------------------
let compConfigPopover = null;
let compConfigInstId  = null;

function buildCcpBody(instId) {
  const inst = state.placed.find(p => p.id === instId);
  if (!inst) return '';
  const comp = COMPONENT_LIBRARY[inst.compId];
  let html = '';

  // Pin assignments
  const assignable = comp.pinGroups.filter(pg => !pg.fixed);
  if (assignable.length) {
    html += `<div class="ccp-section-title">Pin assignments</div>
      <table class="pin-assign-table">`;
    assignable.forEach(pg => {
      if (pg.conditional && !inst.config[pg.conditional]) return;
      const usedPins = getUsedPins(instId, pg.id);
      const allPins = getCurrentPins().filter(p => ![
        'GND_L','GND_R1','GND_R2','GND_R3','3V3_A','3V3_B','5VIN','RST',
        'GND','3V3','5V','VUSB',
        'C3SM_5V','C3SM_GND','C3SM_3V3',
        'C3D_GND1','C3D_GND2','C3D_GND3','C3D_GND4','C3D_GND5','C3D_GND6',
        'C3D_GND7','C3D_GND8','C3D_GND9','C3D_GND10',
        'C3D_3V3A','C3D_3V3B','C3D_5VA','C3D_5VB','C3D_RST','C3D_RST2','C3D_PWR',
        'XIAO_VCC','XIAO_GND','XIAO_3V3','XIAO_BGND','XIAO_VIN'].includes(p.id));
      html += `<tr><td>${pg.label}</td>
        <td><select data-pg="${pg.id}" onchange="onPinChange(${instId},'${pg.id}',this.value)">
          <option value=""> -- select -- </option>
          ${allPins.map(p => {
            const compat = p.types.some(t => t === pg.type || (pg.type === 'gpio' && t === 'gpio'));
            const taken  = usedPins.includes(p.id);
            const sel    = inst.pinAssign[pg.id] === p.id ? 'selected' : '';
            const style  = !compat ? 'style="color:var(--text3)"' : taken ? 'style="color:var(--yellow)"' : '';
            const sfx    = !compat ? ' (incompat)' : taken ? ' (in use)' : '';
            return `<option value="${p.id}" ${sel} ${style}>${p.label}${sfx}</option>`;
          }).join('')}
        </select></td></tr>`;
    });
    html += '</table>';
  }

  // Config schema
  if (comp.configSchema && Object.keys(comp.configSchema).length) {
    html += `<div class="ccp-section-title">Configuration</div>`;
    Object.entries(comp.configSchema).forEach(([key, schema]) => {
      if (schema.dependsOn) {
        const [dk, dv] = Object.entries(schema.dependsOn)[0];
        if (!dv.includes(inst.config[dk])) return;
      }
      html += renderField(instId, key, schema, inst.config[key]);
    });
  }

  // Quick hotkey picks (buttons in Hotkey mode)
  if (inst.compId === 'button' && inst.config.action_type === 'hotkey') {
    html += `<div class="ccp-section-title">Quick picks</div>
      <div class="hotkey-chips">` +
      HOTKEY_PRESETS.map(p =>
        `<button class="hotkey-chip" onclick="applyHotkeyPreset(${instId},'${p.key1}','${p.key2}','${p.key3}')">${p.name}</button>`
      ).join('') +
      `</div>`;
  }

  // Config 2 for buttons
  if (inst.compId === 'button') {
    const has2 = inst.config.has_config2;
    html += `<div class="ccp-section-title" style="color:var(--blue)">CONFIG 2 (optional)</div>`;
    html += renderField(instId, 'has_config2', comp.configSchema.has_config2, inst.config.has_config2);
    if (has2) {
      ['action_type2','key1_2','key2_2','key3_2','consumer_action2','launch_os2','program2','type_text2'].forEach(key => {
        const schema = comp.configSchema[key];
        if (!schema) return;
        if (schema.dependsOn) {
          for (const [dk, dv] of Object.entries(schema.dependsOn)) {
            if (dk === 'has_config2') continue;
            if (!dv.includes(inst.config[dk])) return;
          }
        }
        html += renderField(instId, key, schema, inst.config[key]);
      });
    }
  }

  html += `<div style="margin-top:10px">
    <button class="btn-form danger" onclick="removeComponent(${instId});closeCompConfig()">Remove component</button>
  </div>`;
  return html;
}

function openCompConfig(instId, cogEl) {
  // If same popover is open, close it (toggle)
  if (compConfigPopover && compConfigInstId === instId) { closeCompConfig(); return; }
  closeCompConfig();

  compConfigInstId = instId;
  const inst = state.placed.find(p => p.id === instId);
  if (!inst) return;
  const comp = COMPONENT_LIBRARY[inst.compId];

  const pop = document.createElement('div');
  pop.className = 'comp-config-popover';
  pop.id = 'comp-config-popover';
  pop.dataset.instId = instId;

  pop.innerHTML = `
    <div class="ccp-header">
      <span class="ccp-title">${comp.icon} ${comp.shortName} #${instId}</span>
      <button class="ccp-close" onclick="closeCompConfig()">✕</button>
    </div>
    <div class="ccp-body" id="ccp-body">${buildCcpBody(instId)}</div>`;

  // Position: to the right of the component, or left if near edge
  const compEl = document.getElementById('comp-' + instId);
  const compRect = compEl.getBoundingClientRect();
  const pw = 295, ph = 420;
  let left = compRect.right + 10;
  if (left + pw > window.innerWidth - 12) left = compRect.left - pw - 10;
  left = Math.max(8, left);
  let top = Math.max(8, compRect.top);
  if (top + ph > window.innerHeight - 12) top = window.innerHeight - ph - 12;

  pop.style.left = left + 'px';
  pop.style.top  = top  + 'px';

  document.body.appendChild(pop);
  compConfigPopover = pop;

  // Close on outside click (deferred so this click doesn't immediately close it)
  setTimeout(() => document.addEventListener('mousedown', _ccpOutside), 80);
}

function _ccpOutside(e) {
  if (!compConfigPopover) return;
  if (compConfigPopover.contains(e.target)) return;
  if (e.target.closest('.comp-cog')) return;
  closeCompConfig();
}

function closeCompConfig() {
  if (compConfigPopover) { compConfigPopover.remove(); compConfigPopover = null; }
  compConfigInstId = null;
  document.removeEventListener('mousedown', _ccpOutside);
}

function refreshCompConfig(instId) {
  if (!compConfigPopover || compConfigInstId !== instId) return;
  const body = document.getElementById('ccp-body');
  if (body) body.innerHTML = buildCcpBody(instId);
}

// -- Color picker for component wire color --------------------------
function openColorPicker(instId, swatchEl) {
  // Create a hidden <input type="color"> and click it
  const inst = state.placed.find(p => p.id === instId);
  if (!inst) return;
  const input = document.createElement('input');
  input.type = 'color';
  input.value = inst.wireColor || COMPONENT_LIBRARY[inst.compId].color || '#c87941';
  input.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
  document.body.appendChild(input);
  input.addEventListener('input', () => {
    inst.wireColor = input.value;
    renderComponent(inst);
    updateWires();
  });
  input.addEventListener('change', () => {
    inst.wireColor = input.value;
    renderComponent(inst);
    updateWires();
    input.remove();
  });
  input.click();
}

function isUnconfigured(inst) {
  const comp = COMPONENT_LIBRARY[inst.compId];
  // Check required non-fixed pins are assigned
  for (const pg of comp.pinGroups) {
    if (!pg.fixed && pg.required && !inst.pinAssign[pg.id]) return true;
  }
  // Check label exists for buttons
  if (inst.compId === 'button' && !inst.config.label) return true;
  return false;
}

// -- Selection ------------------------------------------------------
function selectComponent(id) {
  state.selectedId = id;
  document.querySelectorAll('.placed-component').forEach(el => el.classList.remove('selected'));
  const el = document.getElementById('comp-' + id);
  if (el) el.classList.add('selected');
  renderPanel(id);

  // Switch to config tab
  document.querySelectorAll('.ptab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'config'));
  document.querySelectorAll('.panel-body').forEach(b => b.classList.add('hidden'));
  document.getElementById('panel-config').classList.remove('hidden');
}

function deselectAll() {
  state.selectedId = null;
  document.querySelectorAll('.placed-component').forEach(el => el.classList.remove('selected'));
  panelEmpty.style.display = '';
  panelForm.style.display = 'none';
}

// -- Config panel ---------------------------------------------------
function renderPanel(id) {
  const inst = state.placed.find(p => p.id === id);
  if (!inst) { deselectAll(); return; }
  const comp = COMPONENT_LIBRARY[inst.compId];

  panelEmpty.style.display = 'none';
  panelForm.style.display  = '';

  let html = `
    <div class="form-section">
      <div class="form-section-title">${comp.icon} ${comp.name}</div>
      <p style="font-size:0.72rem;color:var(--text2);line-height:1.5;margin-bottom:0.6rem">${comp.description}</p>
    </div>`;

  const assignable = comp.pinGroups.filter(pg => !pg.fixed);
  if (assignable.length) {
    html += `<div class="form-section"><div class="form-section-title">Pin assignments</div>
      <table class="pin-assign-table">`;
    assignable.forEach(pg => {
      // Skip conditional pin rows when the condition is false
      if (pg.conditional && !inst.config[pg.conditional]) return;
      const usedPins = getUsedPins(id, pg.id);
      // Filter to only pins whose type list matches what this pin group needs
      // All GPIO-capable pins for current device
      const allPins = getCurrentPins().filter(p => !['GND_L','GND_R1','GND_R2','GND_R3','3V3_A','3V3_B','5VIN','RST',
       'GND','3V3','5V','VUSB',
       'C3SM_5V','C3SM_GND','C3SM_3V3',
       'C3D_GND1','C3D_GND2','C3D_GND3','C3D_GND4','C3D_GND5','C3D_GND6',
       'C3D_GND7','C3D_GND8','C3D_GND9','C3D_GND10',
       'C3D_3V3A','C3D_3V3B','C3D_5VA','C3D_5VB','C3D_RST','C3D_RST2','C3D_PWR',
       'XIAO_VCC','XIAO_GND','XIAO_3V3','XIAO_BGND','XIAO_VIN'].includes(p.id));
      html += `<tr>
        <td>${pg.label}</td>
        <td><select data-pg="${pg.id}" onchange="onPinChange(${id},'${pg.id}',this.value)">
          <option value=""> --  select  -- </option>
          ${allPins.map(p => {
            const isCompat = p.types.some(t => t === pg.type || (pg.type === 'gpio' && t === 'gpio'));
            const taken    = usedPins.includes(p.id);
            const sel      = inst.pinAssign[pg.id] === p.id ? 'selected' : '';
            const style    = !isCompat
              ? 'style="color:var(--text3)"'
              : taken ? 'style="color:var(--yellow)"' : '';
            const suffix   = !isCompat ? ' (incompatible)' : taken ? ' (in use)' : '';
            return `<option value="${p.id}" ${sel} ${style}>${p.label}${suffix}</option>`;
          }).join('')}
        </select></td>
      </tr>`;
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
      html += `<div style="font-size:0.72rem;padding:6px 8px;background:var(--bg3);border-radius:4px;border-left:3px solid var(--yellow);margin-bottom:6px;line-height:1.5;color:var(--text2)">
        <strong style="color:var(--yellow)">${p.value} ${p.type}</strong> on ${p.on.join(', ')} line(s)<br>${p.note}
      </div>`;
    });
    html += `</div>`;
  }

  // Config 2 section
  if (inst.compId === 'button') {
    const has2 = inst.config.has_config2;
    html += `<div class="form-section config2-section">
      <div class="form-section-title config2-title">-- CONFIG 2 (optional second action set)</div>`;
    html += renderField(id, 'has_config2', comp.configSchema.has_config2, inst.config.has_config2);
    if (has2) {
      ['action_type2','key1_2','key2_2','key3_2','consumer_action2','launch_os2','program2','type_text2'].forEach(key => {
        const schema = comp.configSchema[key];
        if (!schema) return;
        if (schema.dependsOn) {
          const entries = Object.entries(schema.dependsOn);
          for (const [dk, dv] of entries) {
            if (dk === 'has_config2') continue;
            if (!dv.includes(inst.config[dk])) return;
          }
        }
        html += renderField(id, key, schema, inst.config[key]);
      });
    }
    html += '</div>';
  }
  html += `<button class="btn-form danger" onclick="removeComponent(${id})">Remove component</button>`;

  panelForm.innerHTML = html;
}

function renderField(instId, key, schema, value) {
  const id = `cfg-${instId}-${key}`;
  const onChange = `onConfigChange(${instId},'${key}',this.${schema.type === 'checkbox' ? 'checked' : 'value'})`;

  if (schema.type === 'text') {
    return `<div class="form-row"><label class="form-label" for="${id}">${schema.label}</label>
      <input class="form-input" id="${id}" type="text" value="${htmlEscape(value)}" onchange="${onChange}"></div>`;
  }
  if (schema.type === 'select') {
    const opts = schema.options.map((o,i) => { const lbl = schema.optionLabels ? schema.optionLabels[i] : o; return `<option value="${o}" ${value===o?'selected':''}>${lbl}</option>`; }).join('');
    return `<div class="form-row"><label class="form-label" for="${id}">${schema.label}</label>
      <select class="form-select" id="${id}" onchange="${onChange}">${opts}</select></div>`;
  }
  if (schema.type === 'keyselect') {
    const opts = KEY_OPTIONS.map(o => `<option value="${o}" ${value===o?'selected':''}>${o||' -- '}</option>`).join('');
    return `<div class="form-row"><label class="form-label" for="${id}">${schema.label}</label>
      <select class="form-select" id="${id}" onchange="${onChange}">${opts}</select></div>`;
  }
  if (schema.type === 'checkbox') {
    return `<div class="form-check-row">
      <input type="checkbox" id="${id}" ${value?'checked':''} onchange="${onChange}">
      <label for="${id}">${schema.label}</label></div>`;
  }
  if (schema.type === 'range') {
    return `<div class="form-row"><label class="form-label" for="${id}">${schema.label} <span id="${id}-val">${value}</span></label>
      <input class="form-input" type="range" id="${id}" min="${schema.min}" max="${schema.max}" step="${schema.step}" value="${value}"
        oninput="document.getElementById('${id}-val').textContent=this.value" onchange="${onChange}"></div>`;
  }
  if (schema.type === 'os_select') {
    const oses = ['windows','mac','linux'];
    const labels = ['Windows','Mac','Linux'];
    const btns = oses.map((os,i) => {
      const active = (value||'windows') === os ? 'os-btn-active' : '';
      return `<button type="button" class="os-btn ${active}" onclick="onConfigChange(${instId},'${key}','${os}');onConfigChange(${instId},'${key.replace('launch_os','program').replace('launch_os2','program2')}','')">${labels[i]}</button>`;
    }).join('');
    return `<div class="form-row"><label class="form-label">${schema.label}</label><div class="os-btn-group">${btns}</div></div>`;
  }
  if (schema.type === 'launch_app') {
    const osKey = key === 'program' ? 'launch_os' : 'launch_os2';
    const instObj = state.placed.find(p => p.id === instId);
    const os = (instObj && instObj.config[osKey]) || 'windows';
    const APP_PRESETS = {
      windows: ['notepad','calc','explorer','chrome','firefox','code','cmd','powershell','steam','spotify','vlc','obs64','discord','slack','mspaint','taskmgr','winword','excel','outlook'],
      mac:     ['TextEdit','Calculator','Finder','Google Chrome','Firefox','Visual Studio Code','Terminal','Preview','Safari','Steam','Spotify','VLC','OBS','Discord','Slack','Activity Monitor','Pages','Numbers','Mail'],
      linux:   ['gedit','gnome-calculator','nautilus','chromium','firefox','code','bash','steam','spotify','vlc','obs','discord','slack','gimp','libreoffice --writer','libreoffice --calc'],
    };
    const presets = APP_PRESETS[os] || APP_PRESETS.windows;
    const opts = ['', ...presets].map(p => `<option value="${p}" ${value===p?'selected':''}>${p||'-- select preset --'}</option>`).join('');
    return `<div class="form-row"><label class="form-label">${schema.label}</label>
      <select class="form-select" onchange="onConfigChange(${instId},'${key}',this.value)">${opts}</select></div>
      <div class="form-row"><label class="form-label">or type custom</label>
      <input class="form-input" type="text" value="${value||''}" placeholder="e.g. notepad or /usr/bin/app" onchange="onConfigChange(${instId},'${key}',this.value)"></div>
      <div class="launch-hint">On Windows use the exe name (e.g. <code>notepad</code>). On Mac use the app name as it appears in /Applications (e.g. <code>Safari</code>). On Linux use the terminal command (e.g. <code>gedit</code>).</div>`;
  }
  return '';
}

function onConfigChange(instId, key, value) {
  const inst = state.placed.find(p => p.id === instId);
  if (!inst) return;
  pushUndo();
  inst.config[key] = value;
  renderPanel(instId);
  renderComponent(inst);
  updateNotes();
  // Refresh open config popover (handles dependsOn visibility)
  refreshCompConfig(instId);
  // Re-render OLED canvas when display config changes
  if (['ssd1306_i2c','ssd1306_spi','sh1106','ssd1309'].includes(inst.compId)) {
    requestAnimationFrame(() => renderOledCanvas(instId));
  }
}

function onPinChange(instId, pgId, pinId) {
  const inst = state.placed.find(p => p.id === instId);
  if (!inst) return;
  pushUndo();
  inst.pinAssign[pgId] = pinId;
  // Sync node to new pin position
  if (pinId) {
    const pos = getPinPos(pinId);
    if (pos) {
      if (!inst.nodes[pgId]) inst.nodes[pgId] = {};
      inst.nodes[pgId].x = pos.x;
      inst.nodes[pgId].y = pos.y;
      inst.nodes[pgId].snapped = pinId;
    }
  } else {
    if (inst.nodes[pgId]) inst.nodes[pgId].snapped = null;
  }
  renderComponent(inst);
  updateWires();
  updateStats();
  renderPanel(instId);
  updateNotes();
  refreshCompConfig(instId);
}

// Get all pins used by other instances (excluding this instance's same pg)
function getUsedPins(exceptInstId, exceptPgId) {
  const used = [];
  state.placed.forEach(inst => {
    Object.entries(inst.pinAssign).forEach(([pgId, pinId]) => {
      if ((inst.id !== exceptInstId || pgId !== exceptPgId) && pinId && !['GND_L','GND_R1','GND_R2','GND_R3','3V3_A','3V3_B','5VIN','RST'].includes(pinId)) {
        used.push(pinId);
      }
    });
  });
  return used;
}

// -- Pin reassign popover -------------------------------------------
let pinPopover = null;
function openPinReassign(instId, pgId, anchorEl) {
  closePinPopover();
  const inst = state.placed.find(p => p.id === instId);
  const comp = COMPONENT_LIBRARY[inst.compId];
  const pg   = comp.pinGroups.find(p => p.id === pgId);
  const usedPins  = getUsedPins(instId, pgId);
  const allPins   = getCurrentPins().filter(p => !['GND_L','GND_R1','GND_R2','GND_R3','3V3_A','3V3_B','5VIN','RST',
       'GND','3V3','5V','VUSB',
       'C3SM_5V','C3SM_GND','C3SM_3V3',
       'C3D_GND1','C3D_GND2','C3D_GND3','C3D_GND4','C3D_GND5','C3D_GND6',
       'C3D_GND7','C3D_GND8','C3D_GND9','C3D_GND10',
       'C3D_3V3A','C3D_3V3B','C3D_5VA','C3D_5VB','C3D_RST','C3D_RST2','C3D_PWR',
       'XIAO_VCC','XIAO_GND','XIAO_3V3','XIAO_BGND','XIAO_VIN'].includes(p.id));

  const pop = document.createElement('div');
  pop.id = 'pin-popover';
  pop.style.cssText = `position:fixed;z-index:2000;background:var(--bg2);border:1px solid var(--border2);border-radius:6px;padding:8px;min-width:180px;max-height:280px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,0.5)`;
  const rect = anchorEl.getBoundingClientRect();
  pop.style.left = rect.left + 'px';
  pop.style.top  = (rect.bottom + 4) + 'px';

  pop.innerHTML = `<div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text3);margin-bottom:6px;letter-spacing:0.1em">ASSIGN ${pg.label}</div>` +
    allPins.map(p => {
      const isCompat = p.types.some(t => t === pg.type || (pg.type === 'gpio' && t === 'gpio'));
      const taken    = usedPins.includes(p.id);
      const sel      = inst.pinAssign[pgId] === p.id;
      const color    = !isCompat ? 'var(--text3)' : taken ? 'var(--yellow)' : sel ? 'var(--green)' : 'var(--text)';
      const suffix   = !isCompat ? ' &#10007;' : taken ? ' &#9888;' : sel ? ' &#10003;' : '';
      return `<div style="padding:5px 8px;border-radius:4px;cursor:pointer;font-family:var(--font-mono);font-size:0.72rem;color:${color};background:${sel?'var(--bg3)':'transparent'}"
        onmouseenter="this.style.background='var(--bg3)'"
        onmouseleave="this.style.background='${sel?'var(--bg3)':'transparent'}'"
        onclick="onPinChange(${instId},'${pgId}','${p.id}');closePinPopover()">
        ${p.label}${suffix}
      </div>`;
    }).join('');

  document.body.appendChild(pop);
  pinPopover = pop;
  setTimeout(() => document.addEventListener('click', closePinPopover, { once: true }), 10);
}
function closePinPopover() {
  if (pinPopover) { pinPopover.remove(); pinPopover = null; }
}

// -- Load preset build ----------------------------------------------
function loadPreset(presetId) {
  const preset = PRESET_CONFIGS[presetId];
  if (!preset) return;
  closePresetDropdown();
  if (state.placed.length && !confirm(`Load "${preset.name}"?\n\nThis will replace your current design. Make sure you've downloaded config.json if you want to keep it.`)) return;

  pushUndo();

  // Clear canvas
  state.placed.forEach(p => { const e = document.getElementById('comp-' + p.id); if (e) e.remove(); });
  state.placed = [];
  state.nextId = 1;
  state.selectedId = null;
  deselectAll();
  closeCompConfig();

  // Compute absolute positions relative to current chip placement
  const cx = state.chipPos.x;
  const cy = state.chipPos.y;
  const chipW = (DEVICES[state.device] && DEVICES[state.device].chipWidth) || 220;

  let colorIdx = 0;
  preset.components.forEach((def) => {
    const comp = COMPONENT_LIBRARY[def.compId];
    if (!comp) return;

    // Skip components unsupported by current device
    const dev = DEVICES[state.device];
    if (dev.unsupported && dev.unsupported.includes(def.compId)) return;

    // Build default config then merge preset overrides
    const config = {};
    if (comp.configSchema) {
      Object.entries(comp.configSchema).forEach(([key, schema]) => { config[key] = schema.default; });
    }
    Object.assign(config, def.config || {});

    // Absolute canvas position
    const px = cx + def.offX;
    const py = cy + def.offY;

    const baseColorIdx = colorIdx;
    const inst = {
      id: state.nextId++,
      compId: def.compId,
      x: px,
      y: py,
      pinAssign: Object.assign({}, def.pinAssign),
      config,
      label: def.label || (comp.shortName + ' ' + state.nextId),
      wireColor: WIRE_SEQ[baseColorIdx % WIRE_SEQ.length],
      baseColorIdx,
      nodes: {},
    };

    // Initialize placeholder node positions (will be snapped in rAF below)
    comp.pinGroups.forEach((pg, j) => {
      inst.nodes[pg.id] = { x: px, y: py + j * 22, snapped: inst.pinAssign[pg.id] || null };
    });

    // Advance color index by number of signal pins this component has
    colorIdx += comp.pinGroups.filter(pg => pg.wireClass !== 'wire-power' && pg.wireClass !== 'wire-gnd').length;

    state.placed.push(inst);
  });

  // Render component DOM elements
  state.placed.forEach(inst => renderComponent(inst));

  // After DOM settles: snap wires to pins, refresh everything
  requestAnimationFrame(() => {
    state.placed.forEach(inst => syncNodesToPins(inst));
    buildShelf();
    updateWires();
    updateStats();
    updateNotes();
    updateLibs();
    if (state.placed.length) canvasHint.classList.add('hidden');
    // Render any OLED displays
    state.placed.forEach(inst => {
      if (['ssd1306_i2c','ssd1306_spi','sh1106','ssd1309'].includes(inst.compId)) {
        renderOledCanvas(inst.id);
      }
    });
  });
}

// -- Apply quick hotkey preset to a button config -------------------
function applyHotkeyPreset(instId, key1, key2, key3) {
  const inst = state.placed.find(p => p.id === instId);
  if (!inst) return;
  pushUndo();
  inst.config.key1 = key1;
  inst.config.key2 = key2;
  inst.config.key3 = key3;
  inst.config.action_type = 'hotkey';
  renderPanel(instId);
  renderComponent(inst);
  updateNotes();
  refreshCompConfig(instId);
}

// -- Remove component -----------------------------------------------
function removeComponent(id) {
  pushUndo();
  state.placed = state.placed.filter(p => p.id !== id);
  const el = document.getElementById('comp-' + id);
  if (el) el.remove();
  if (state.selectedId === id) deselectAll();
  buildShelf();
  updateWires();
  updateStats();
  updateNotes();
  updateLibs();
  if (state.placed.length === 0) canvasHint.classList.remove('hidden');
}

// -- Wires ----------------------------------------------------------
// Signal wire palette — red and black are reserved for power/GND wires.
// These nine colors cycle through remaining typical wire-harness colors with
// no repeats. Multi-pin components consume consecutive entries so each physical
// wire gets a unique color.
const WIRE_SEQ = [
  '#e8e8e8', // 0 white
  '#888888', // 1 gray
  '#9b59b6', // 2 violet
  '#00bcd4', // 3 turquoise blue
  '#4caf50', // 4 bright green
  '#ffd600', // 5 yellow
  '#ff6f00', // 6 orange
  '#2980b9', // 7 steel blue
  '#8d5524', // 8 brown
];

// -- Quick-pick hotkey presets (used in the config popover) ----------
const HOTKEY_PRESETS = [
  { name: 'Copy',        key1: 'ctrl',  key2: 'c',      key3: '' },
  { name: 'Paste',       key1: 'ctrl',  key2: 'v',      key3: '' },
  { name: 'Cut',         key1: 'ctrl',  key2: 'x',      key3: '' },
  { name: 'Undo',        key1: 'ctrl',  key2: 'z',      key3: '' },
  { name: 'Redo',        key1: 'ctrl',  key2: 'y',      key3: '' },
  { name: 'Save',        key1: 'ctrl',  key2: 's',      key3: '' },
  { name: 'Select All',  key1: 'ctrl',  key2: 'a',      key3: '' },
  { name: 'Find',        key1: 'ctrl',  key2: 'f',      key3: '' },
  { name: 'New Tab',     key1: 'ctrl',  key2: 't',      key3: '' },
  { name: 'Close Tab',   key1: 'ctrl',  key2: 'w',      key3: '' },
  { name: 'Bold',        key1: 'ctrl',  key2: 'b',      key3: '' },
  { name: 'Print',       key1: 'ctrl',  key2: 'p',      key3: '' },
  { name: 'Zoom In',     key1: 'ctrl',  key2: '=',      key3: '' },
  { name: 'Zoom Out',    key1: 'ctrl',  key2: '-',      key3: '' },
  { name: 'Full Screen', key1: 'f11',   key2: '',       key3: '' },
  { name: 'Dev Tools',   key1: 'f12',   key2: '',       key3: '' },
  { name: 'Task Mgr',    key1: 'ctrl',  key2: 'shift',  key3: 'esc' },
  { name: 'Screenshot',  key1: 'win',   key2: 'shift',  key3: 's' },
  { name: 'Lock Screen', key1: 'win',   key2: 'l',      key3: '' },
  { name: 'New Window',  key1: 'ctrl',  key2: 'n',      key3: '' },
  { name: 'Switch App',  key1: 'alt',   key2: 'tab',    key3: '' },
  { name: 'Close Win',   key1: 'alt',   key2: 'f4',     key3: '' },
];

// -- Pre-built preset configurations ---------------------------------
// offX/offY are pixel offsets from state.chipPos (chip top-left corner).
// Negative offX = left of chip; offX > chipWidth = right of chip.
const PRESET_CONFIGS = {
  shortcuts: {
    name: 'Keyboard Shortcuts',
    icon: '⌨',
    desc: '4 buttons: Copy, Cut, Paste, Undo. Auto-translates Ctrl↔Cmd when config 2 is active.',
    components: [
      { compId: 'button', label: 'Copy', offX: -250, offY: 10,
        pinAssign: { sig: 'GPIO4', gnd: 'GND_L' },
        config: { label: 'Copy', action_type: 'hotkey', key1: 'ctrl', key2: 'c', key3: '', auto_translate: true,
                  has_config2: false } },
      { compId: 'button', label: 'Cut', offX: -250, offY: 90,
        pinAssign: { sig: 'GPIO5', gnd: 'GND_L' },
        config: { label: 'Cut', action_type: 'hotkey', key1: 'ctrl', key2: 'x', key3: '', auto_translate: true,
                  has_config2: false } },
      { compId: 'button', label: 'Paste', offX: -250, offY: 170,
        pinAssign: { sig: 'GPIO6', gnd: 'GND_L' },
        config: { label: 'Paste', action_type: 'hotkey', key1: 'ctrl', key2: 'v', key3: '', auto_translate: true,
                  has_config2: false } },
      { compId: 'button', label: 'Undo', offX: -250, offY: 250,
        pinAssign: { sig: 'GPIO7', gnd: 'GND_L' },
        config: { label: 'Undo', action_type: 'hotkey', key1: 'ctrl', key2: 'z', key3: '', auto_translate: true,
                  has_config2: false } },
    ]
  },

  control_hub: {
    name: 'Control Hub',
    icon: '🚀',
    desc: '5 app-launch buttons + volume encoder. Button 5 switches between Windows and Mac mode.',
    components: [
      { compId: 'button', label: 'Explorer', offX: -250, offY: 0,
        pinAssign: { sig: 'GPIO4', gnd: 'GND_L' },
        config: { label: 'Files', action_type: 'launch', launch_os: 'windows', program: 'explorer',
                  has_config2: true, action_type2: 'launch', launch_os2: 'mac', program2: 'Finder' } },
      { compId: 'button', label: 'Browser', offX: -250, offY: 80,
        pinAssign: { sig: 'GPIO5', gnd: 'GND_L' },
        config: { label: 'Browser', action_type: 'launch', launch_os: 'windows', program: 'chrome',
                  has_config2: true, action_type2: 'launch', launch_os2: 'mac', program2: 'Google Chrome' } },
      { compId: 'button', label: 'Calculator', offX: -250, offY: 160,
        pinAssign: { sig: 'GPIO6', gnd: 'GND_L' },
        config: { label: 'Calc', action_type: 'launch', launch_os: 'windows', program: 'calc',
                  has_config2: true, action_type2: 'launch', launch_os2: 'mac', program2: 'Calculator' } },
      { compId: 'button', label: 'Notes', offX: -250, offY: 240,
        pinAssign: { sig: 'GPIO7', gnd: 'GND_L' },
        config: { label: 'Notes', action_type: 'launch', launch_os: 'windows', program: 'notepad',
                  has_config2: true, action_type2: 'launch', launch_os2: 'mac', program2: 'TextEdit' } },
      { compId: 'button', label: 'Toggle OS', offX: -250, offY: 320,
        pinAssign: { sig: 'GPIO10', gnd: 'GND_L' },
        config: { label: 'Toggle OS', action_type: 'config_toggle', key1: '', key2: '', key3: '',
                  has_config2: false } },
      { compId: 'ky040', label: 'Volume', offX: 258, offY: 120,
        pinAssign: { clk: 'GPIO40', dt: 'GPIO41', sw: 'GPIO42', vcc: '3V3_A', gnd: 'GND_L' },
        config: { mode_name: 'Volume', cw_type: 'consumer', cw_consumer: 'VOLUME_INCREMENT',
                  ccw_type: 'consumer', ccw_consumer: 'VOLUME_DECREMENT',
                  press_action: 'consumer', press_consumer: 'MUTE' } },
    ]
  },

  command_center: {
    name: 'Command Center',
    icon: '🖥',
    desc: '8 buttons, OLED display, volume encoder, and a volume slider. Full-featured macropad.',
    components: [
      { compId: 'ssd1306_i2c', label: 'Display', offX: 30, offY: -100,
        pinAssign: { sda: 'GPIO8', scl: 'GPIO9', vcc: '3V3_A', gnd: 'GND_L' },
        config: { i2c_address: '0x3C', display_mode: 'macro_label', rotation: '0' } },
      { compId: 'button', label: 'Copy', offX: -270, offY: 0,
        pinAssign: { sig: 'GPIO5', gnd: 'GND_L' },
        config: { label: 'Copy', action_type: 'hotkey', key1: 'ctrl', key2: 'c', key3: '', auto_translate: true, has_config2: false } },
      { compId: 'button', label: 'Cut', offX: -270, offY: 80,
        pinAssign: { sig: 'GPIO6', gnd: 'GND_L' },
        config: { label: 'Cut', action_type: 'hotkey', key1: 'ctrl', key2: 'x', key3: '', auto_translate: true, has_config2: false } },
      { compId: 'button', label: 'Paste', offX: -270, offY: 160,
        pinAssign: { sig: 'GPIO7', gnd: 'GND_L' },
        config: { label: 'Paste', action_type: 'hotkey', key1: 'ctrl', key2: 'v', key3: '', auto_translate: true, has_config2: false } },
      { compId: 'button', label: 'Undo', offX: -270, offY: 240,
        pinAssign: { sig: 'GPIO15', gnd: 'GND_L' },
        config: { label: 'Undo', action_type: 'hotkey', key1: 'ctrl', key2: 'z', key3: '', auto_translate: true, has_config2: false } },
      { compId: 'hw371', label: 'Volume Slider', offX: -270, offY: 340,
        pinAssign: { out: 'GPIO4', vcc: '3V3_A', gnd: 'GND_L' },
        config: { label: 'Volume', function: 'volume', inverted: false } },
      { compId: 'button', label: 'Files', offX: 258, offY: 0,
        pinAssign: { sig: 'GPIO16', gnd: 'GND_L' },
        config: { label: 'Files', action_type: 'launch', launch_os: 'windows', program: 'explorer', has_config2: false } },
      { compId: 'button', label: 'Browser', offX: 258, offY: 80,
        pinAssign: { sig: 'GPIO17', gnd: 'GND_L' },
        config: { label: 'Browser', action_type: 'launch', launch_os: 'windows', program: 'chrome', has_config2: false } },
      { compId: 'button', label: 'Calculator', offX: 258, offY: 160,
        pinAssign: { sig: 'GPIO18', gnd: 'GND_L' },
        config: { label: 'Calc', action_type: 'launch', launch_os: 'windows', program: 'calc', has_config2: false } },
      { compId: 'button', label: 'Notes', offX: 258, offY: 240,
        pinAssign: { sig: 'GPIO3', gnd: 'GND_L' },
        config: { label: 'Notes', action_type: 'launch', launch_os: 'windows', program: 'notepad', has_config2: false } },
      { compId: 'ky040', label: 'Navigation', offX: 258, offY: 340,
        pinAssign: { clk: 'GPIO40', dt: 'GPIO41', sw: 'GPIO42', vcc: '3V3_A', gnd: 'GND_L' },
        config: { mode_name: 'Volume', cw_type: 'consumer', cw_consumer: 'VOLUME_INCREMENT',
                  ccw_type: 'consumer', ccw_consumer: 'VOLUME_DECREMENT',
                  press_action: 'consumer', press_consumer: 'MUTE' } },
    ]
  },

  audio_mixer: {
    name: 'Audio Mixer',
    icon: '🎚',
    desc: '2 faders, 2 dials, OLED with volume bar, and 5 media + shortcut buttons.',
    components: [
      { compId: 'ssd1306_i2c', label: 'Mixer Display', offX: 30, offY: -100,
        pinAssign: { sda: 'GPIO8', scl: 'GPIO9', vcc: '3V3_A', gnd: 'GND_L' },
        config: { i2c_address: '0x3C', display_mode: 'volume_bar', rotation: '0' } },
      { compId: 'hw371', label: 'Main Volume', offX: -290, offY: 50,
        pinAssign: { out: 'GPIO4', vcc: '3V3_A', gnd: 'GND_L' },
        config: { label: 'Main Vol', function: 'volume', inverted: false } },
      { compId: 'slide_pot_long', label: 'Track Fader', offX: -290, offY: 220,
        pinAssign: { out: 'GPIO5', vcc: '3V3_A', gnd: 'GND_L' },
        config: { label: 'Fader', function: 'volume', inverted: false } },
      { compId: 'button', label: 'Play/Pause', offX: -140, offY: 0,
        pinAssign: { sig: 'GPIO6', gnd: 'GND_L' },
        config: { label: 'Play', action_type: 'actions', consumer_action: 'PLAY_PAUSE', has_config2: false } },
      { compId: 'button', label: 'Skip Back', offX: -140, offY: 80,
        pinAssign: { sig: 'GPIO7', gnd: 'GND_L' },
        config: { label: '|◂◂', action_type: 'actions', consumer_action: 'SCAN_PREVIOUS_TRACK', has_config2: false } },
      { compId: 'button', label: 'Skip Fwd', offX: -140, offY: 160,
        pinAssign: { sig: 'GPIO15', gnd: 'GND_L' },
        config: { label: '▸▸|', action_type: 'actions', consumer_action: 'SCAN_NEXT_TRACK', has_config2: false } },
      { compId: 'button', label: 'Copy', offX: -140, offY: 240,
        pinAssign: { sig: 'GPIO16', gnd: 'GND_L' },
        config: { label: 'Copy', action_type: 'hotkey', key1: 'ctrl', key2: 'c', key3: '', auto_translate: true, has_config2: false } },
      { compId: 'button', label: 'Paste', offX: -140, offY: 320,
        pinAssign: { sig: 'GPIO17', gnd: 'GND_L' },
        config: { label: 'Paste', action_type: 'hotkey', key1: 'ctrl', key2: 'v', key3: '', auto_translate: true, has_config2: false } },
      { compId: 'ky040', label: 'Pan', offX: 258, offY: 50,
        pinAssign: { clk: 'GPIO40', dt: 'GPIO41', sw: 'GPIO42', vcc: '3V3_A', gnd: 'GND_L' },
        config: { mode_name: 'Pan', cw_type: 'hotkey', cw_keys: 'ctrl,shift,right',
                  ccw_type: 'hotkey', ccw_keys: 'ctrl,shift,left',
                  press_action: 'none' } },
      { compId: 'ky040', label: 'EQ / Zoom', offX: 258, offY: 250,
        pinAssign: { clk: 'GPIO38', dt: 'GPIO39', sw: 'GPIO1', vcc: '3V3_A', gnd: 'GND_L' },
        config: { mode_name: 'Zoom', cw_type: 'hotkey', cw_keys: 'ctrl,=',
                  ccw_type: 'hotkey', ccw_keys: 'ctrl,-',
                  press_action: 'hotkey', press_keys: 'ctrl,0' } },
    ]
  },

  gamepad: {
    name: 'Gamepad',
    icon: '🎮',
    desc: '2 analog joysticks and 14 buttons — D-pad, ABXY, triggers, bumpers, and menu buttons.',
    components: [
      { compId: 'ps2_joystick', label: 'Left Stick', offX: -290, offY: 160,
        pinAssign: { vrx: 'GPIO4', vry: 'GPIO5', sw: 'GPIO6', vcc: '3V3_A', gnd: 'GND_L' },
        config: { label: 'L-Stick', mode: 'mouse', deadzone: 3000, sensitivity: 5, invert_x: false, invert_y: false, sw_action: 'mouse_click' } },
      { compId: 'ps2_joystick', label: 'Right Stick', offX: 270, offY: 160,
        pinAssign: { vrx: 'GPIO7', vry: 'GPIO15', sw: 'GPIO16', vcc: '3V3_A', gnd: 'GND_L' },
        config: { label: 'R-Stick', mode: 'mouse', deadzone: 3000, sensitivity: 5, invert_x: false, invert_y: false, sw_action: 'mouse_click' } },
      { compId: 'button', label: 'LT', offX: -290, offY: 0,
        pinAssign: { sig: 'GPIO35', gnd: 'GND_L' },
        config: { label: 'LT', action_type: 'hotkey', key1: 'shift', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'RT', offX: 270, offY: 0,
        pinAssign: { sig: 'GPIO45', gnd: 'GND_L' },
        config: { label: 'RT', action_type: 'hotkey', key1: 'ctrl', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'LB', offX: -290, offY: 80,
        pinAssign: { sig: 'GPIO37', gnd: 'GND_L' },
        config: { label: 'LB', action_type: 'hotkey', key1: 'q', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'RB', offX: 270, offY: 80,
        pinAssign: { sig: 'GPIO36', gnd: 'GND_L' },
        config: { label: 'RB', action_type: 'hotkey', key1: 'e', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'D-Up', offX: -155, offY: 210,
        pinAssign: { sig: 'GPIO17', gnd: 'GND_L' },
        config: { label: '▲', action_type: 'hotkey', key1: 'up', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'D-Left', offX: -210, offY: 280,
        pinAssign: { sig: 'GPIO3', gnd: 'GND_L' },
        config: { label: '◀', action_type: 'hotkey', key1: 'left', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'D-Right', offX: -100, offY: 280,
        pinAssign: { sig: 'GPIO1', gnd: 'GND_L' },
        config: { label: '▶', action_type: 'hotkey', key1: 'right', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'D-Down', offX: -155, offY: 350,
        pinAssign: { sig: 'GPIO18', gnd: 'GND_L' },
        config: { label: '▼', action_type: 'hotkey', key1: 'down', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'Y', offX: 135, offY: 210,
        pinAssign: { sig: 'GPIO38', gnd: 'GND_L' },
        config: { label: 'Y', action_type: 'hotkey', key1: 'shift', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'X', offX: 80, offY: 280,
        pinAssign: { sig: 'GPIO39', gnd: 'GND_L' },
        config: { label: 'X', action_type: 'hotkey', key1: 'space', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'B', offX: 190, offY: 280,
        pinAssign: { sig: 'GPIO40', gnd: 'GND_L' },
        config: { label: 'B', action_type: 'hotkey', key1: 'esc', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'A', offX: 135, offY: 350,
        pinAssign: { sig: 'GPIO2', gnd: 'GND_L' },
        config: { label: 'A', action_type: 'hotkey', key1: 'enter', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'Select', offX: -60, offY: 370,
        pinAssign: { sig: 'GPIO48', gnd: 'GND_L' },
        config: { label: 'Select', action_type: 'hotkey', key1: 'tab', key2: '', key3: '', has_config2: false } },
      { compId: 'button', label: 'Start', offX: 50, offY: 370,
        pinAssign: { sig: 'GPIO47', gnd: 'GND_L' },
        config: { label: 'Start', action_type: 'hotkey', key1: 'esc', key2: '', key3: '', has_config2: false } },
    ]
  },
};

// -- Node (wire-end circle) system ----------------------------------
// Each pin group has a draggable circle node. When near a chip pin it snaps.
// The wire is always drawn from component center → node position.

const NODE_RADIUS  = 8;   // px, rendered size

// Sync node positions to their currently-assigned chip pins
function syncNodesToPins(inst) {
  const comp = COMPONENT_LIBRARY[inst.compId];
  comp.pinGroups.forEach(pg => {
    const pinId = inst.pinAssign[pg.id];
    if (pinId) {
      const pos = getPinPos(pinId);
      if (pos) {
        if (!inst.nodes[pg.id]) inst.nodes[pg.id] = {};
        inst.nodes[pg.id].x = pos.x;
        inst.nodes[pg.id].y = pos.y;
        inst.nodes[pg.id].snapped = pinId;
      }
    } else {
      if (inst.nodes[pg.id]) inst.nodes[pg.id].snapped = null;
    }
  });
}

// (Node drag removed — pin reassignment is done via the ⚙ cog menu)

// Draw all node circles onto the node layer (display-only; pin assignment via cog menu)
function drawNodes() {
  state.placed.forEach(inst => {
    const comp = COMPONENT_LIBRARY[inst.compId];
    let sigIdx = 0;

    comp.pinGroups.forEach((pg) => {
      if (pg.conditional && !inst.config[pg.conditional]) return;

      const isSig = isSignalPin(pg);
      const color  = getWireColor(pg, inst, sigIdx);
      if (isSig) sigIdx++;

      const node = inst.nodes[pg.id];
      if (!node) return;

      const snapped     = !!node.snapped;
      const glowColor   = snapped ? color : '#444444';
      const glowOpacity = snapped ? '0.6' : '0.3';

      // Outer glow
      const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      glow.setAttribute('cx', node.x);
      glow.setAttribute('cy', node.y);
      glow.setAttribute('r',  NODE_RADIUS + 4);
      glow.setAttribute('fill', glowColor);
      glow.setAttribute('opacity', glowOpacity);
      glow.setAttribute('pointer-events', 'none');
      nodeLayer.appendChild(glow);

      // Main circle — display-only, tooltip on hover
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r',  NODE_RADIUS);
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', needsWhiteOutline(color) ? '#ffffff' : '#000000');
      circle.setAttribute('stroke-width', '1.5');
      circle.setAttribute('class', 'wire-node');
      circle.setAttribute('data-inst', inst.id);
      circle.setAttribute('data-pg', pg.id);
      circle.style.cursor = 'default';
      circle.style.pointerEvents = 'all';

      circle.addEventListener('mouseenter', e => {
        showTooltip(e.clientX, e.clientY, `${comp.shortName} ${pg.label}`,
          node.snapped ? `Connected → ${node.snapped}` : 'Unconnected — use ⚙ to assign a pin');
      });
      circle.addEventListener('mousemove', e => moveTooltip(e.clientX, e.clientY));
      circle.addEventListener('mouseleave', hideTooltip);

      nodeLayer.appendChild(circle);
    });
  });
}

// sigIdx = index of this pin among all signal pins for this component (0-based)
// Power and GND pins always use fixed colors; every other wire type uses the
// sequential palette so each pin on every component gets a unique color.
function getWireColor(pg, inst, sigIdx) {
  if (pg.wireClass === 'wire-power') return '#cc1111';
  if (pg.wireClass === 'wire-gnd')   return '#000000';
  const base = (inst.baseColorIdx !== undefined) ? inst.baseColorIdx : 0;
  return WIRE_SEQ[(base + sigIdx) % WIRE_SEQ.length];
}

function needsWhiteOutline(color) {
  // Colors that need a white outline for legibility on dark backgrounds
  const dark = ['#000000','#888888','#8d5524'];
  return dark.includes(color.toLowerCase());
}

function updateWires() {
  wireLayer.innerHTML = '';
  nodeLayer.innerHTML = '';
  updateChipPinHighlights();

  state.placed.forEach(inst => {
    const comp   = COMPONENT_LIBRARY[inst.compId];
    const compEl = document.getElementById('comp-' + inst.id);
    if (!compEl) return;

    const compCx = inst.x + compEl.offsetWidth  / 2;
    const compCy = inst.y + compEl.offsetHeight / 2;
    const chipCx = state.chipPos.x + chipEl.offsetWidth / 2;

    // Track signal pins seen so far for sequential color assignment
    let sigIdx = 0;

    comp.pinGroups.forEach((pg, idx) => {
      // Always compute color index consistently with renderComponent (count all active signal pins)
      if (pg.conditional && !inst.config[pg.conditional]) return;

      const isSig = isSignalPin(pg);
      const strokeColor = getWireColor(pg, inst, sigIdx);
      if (isSig) sigIdx++;

      const pinId = inst.pinAssign[pg.id];
      if (!pinId) return;  // no wire to draw, but sigIdx was already advanced above

      const pinPos = getPinPos(pinId);
      if (!pinPos) return;

      let anchorX;
      if ((inst.x + compEl.offsetWidth) < chipCx) {
        anchorX = inst.x + compEl.offsetWidth;
      } else if (inst.x > chipCx) {
        anchorX = inst.x;
      } else {
        anchorX = pinPos.x < chipCx ? inst.x : inst.x + compEl.offsetWidth;
      }

      const spread  = (idx - (comp.pinGroups.length - 1) / 2) * 14;
      const stagger = (idx - (comp.pinGroups.length - 1) / 2) * 12;
      const startY  = compCy + spread;
      const d = routeWire(anchorX, startY, pinPos.x, pinPos.y, stagger);

      // Three-layer wire: shadow → body → highlight
      // All drawing paths: pointer-events none so they don't consume canvas clicks.
      const mkWirePath = (stroke, width, opacity) => {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', d);
        p.setAttribute('stroke', stroke);
        p.setAttribute('stroke-width', String(width));
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('stroke-linejoin', 'round');
        p.setAttribute('fill', 'none');
        if (opacity < 1) p.setAttribute('opacity', String(opacity));
        p.style.pointerEvents = 'none';
        return p;
      };
      wireLayer.appendChild(mkWirePath('rgba(0,0,0,0.5)', 6, 1));         // shadow
      wireLayer.appendChild(mkWirePath(strokeColor, 3.5, 1));              // body
      wireLayer.appendChild(mkWirePath('rgba(255,255,255,0.20)', 1.5, 1)); // highlight

      // Invisible hit zone: wide transparent stroke for tooltip hover only.
      const hit = mkWirePath('transparent', 14, 1);
      hit.style.pointerEvents = 'stroke';
      hit.setAttribute('data-inst', inst.id);
      hit.setAttribute('data-pg', pg.id);
      hit.addEventListener('mouseenter', e => {
        showTooltip(e.clientX, e.clientY, `${comp.shortName} #${inst.id}`, `${pg.label} → ${pinId}`);
      });
      hit.addEventListener('mousemove', e => moveTooltip(e.clientX, e.clientY));
      hit.addEventListener('mouseleave', hideTooltip);
      wireLayer.appendChild(hit);

      const passive = comp.passives.find(p => p.on.includes(pg.id) &&
        (!p.conditional || inst.config[p.conditional]));
      if (passive) drawPassiveSymbol(anchorX, startY, pinPos, passive);
    });
  });
  drawNodes();
}

function routeWire(x1, y1, x2, y2, stagger) {
  const base = (x1 + x2) / 2;
  const mx = base + (stagger || 0);
  const r = 8;

  if (Math.abs(y2 - y1) < 4) return `M ${x1} ${y1} L ${x2} ${y2}`;

  const dx1 = mx >= x1 ? 1 : -1;
  const dx2 = x2 >= mx ? 1 : -1;
  const dy  = y2 >= y1 ? 1 : -1;

  const hSeg1 = Math.abs(mx - x1);
  const hSeg2 = Math.abs(x2 - mx);
  const vSeg  = Math.abs(y2 - y1);
  const cr    = Math.min(r, hSeg1 / 2, hSeg2 / 2, vSeg / 2);

  if (cr < 2) return `M ${x1} ${y1} L ${mx} ${y1} L ${mx} ${y2} L ${x2} ${y2}`;

  const c1x = mx - dx1 * cr;
  const c2x = mx + dx2 * cr;
  const c1y = y1 + dy * cr;
  const c2y = y2 - dy * cr;

  return [
    `M ${x1} ${y1}`,
    `L ${c1x} ${y1}`,
    `Q ${mx} ${y1} ${mx} ${c1y}`,
    `L ${mx} ${c2y}`,
    `Q ${mx} ${y2} ${c2x} ${y2}`,
    `L ${x2} ${y2}`,
  ].join(' ');
}

function drawPassiveSymbol(cx, cy, pinPos, passive) {
  const mx = (cx + pinPos.x) / 2;
  const my = (cy + pinPos.y) / 2;

  if (passive.type === 'resistor') {
    // Zigzag resistor symbol
    const w = 18, h = 6;
    const zz = `M ${mx-w/2} ${my} l 3 ${-h} l 3 ${h*2} l 3 ${-h*2} l 3 ${h*2} l 3 ${-h} l 3 0`;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', zz);
    path.setAttribute('class', 'wire wire-data');
    path.setAttribute('stroke', 'var(--yellow)');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('fill', 'none');
    wireLayer.appendChild(path);
    // Label
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', mx); t.setAttribute('y', my - 8);
    t.setAttribute('class', 'wire-annotation');
    t.setAttribute('text-anchor', 'middle');
    t.textContent = passive.value;
    t.addEventListener('mouseenter', e => showTooltip(e.clientX, e.clientY, passive.value + ' Resistor', passive.note));
    t.addEventListener('mousemove', e => moveTooltip(e.clientX, e.clientY));
    t.addEventListener('mouseleave', hideTooltip);
    wireLayer.appendChild(t);
  } else if (passive.type === 'capacitor') {
    // Capacitor symbol  --  two parallel lines
    const rect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect1.setAttribute('x', mx-10); rect1.setAttribute('y', my-8);
    rect1.setAttribute('width', 20); rect1.setAttribute('height', 3);
    rect1.setAttribute('fill', 'var(--yellow)'); rect1.setAttribute('opacity', '0.7');
    const rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect2.setAttribute('x', mx-10); rect2.setAttribute('y', my+5);
    rect2.setAttribute('width', 20); rect2.setAttribute('height', 3);
    rect2.setAttribute('fill', 'var(--yellow)'); rect2.setAttribute('opacity', '0.7');
    wireLayer.appendChild(rect1); wireLayer.appendChild(rect2);
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', mx+14); t.setAttribute('y', my+2);
    t.setAttribute('class', 'wire-annotation'); t.setAttribute('text-anchor', 'start');
    t.textContent = passive.value;
    t.addEventListener('mouseenter', e => showTooltip(e.clientX, e.clientY, passive.value + ' Capacitor', passive.note));
    t.addEventListener('mousemove', e => moveTooltip(e.clientX, e.clientY));
    t.addEventListener('mouseleave', hideTooltip);
    wireLayer.appendChild(t);
  }
}

function updateChipPinHighlights() {
  const usedPins = new Set();
  state.placed.forEach(inst => {
    Object.values(inst.pinAssign).forEach(p => { if (p) usedPins.add(p); });
  });
  chipEl.querySelectorAll('.pin-item').forEach(el => {
    const pid = el.dataset.pin;
    el.classList.toggle('used', usedPins.has(pid));
  });
}

// -- Wire drag-and-drop -----------------------------------------
// (Wire drag removed — pin reassignment is done via the ⚙ cog menu)

// -- Stats ----------------------------------------------------------
function updateStats() {
  const usedPins = new Set();
  state.placed.forEach(inst => {
    Object.values(inst.pinAssign).forEach(p => {
      if (p && !['GND_L','GND_R1','GND_R2','GND_R3','3V3_A','3V3_B','5VIN','RST'].includes(p)) usedPins.add(p);
    });
  });
  const libs = getRequiredLibs();
  statComponents.textContent = state.placed.length;
  const totalGpio = getCurrentPins().filter(p => p.types.includes('gpio')).length;
  statPins.textContent = `${usedPins.size} / ${totalGpio}`;
  statLibs.textContent = libs.length;

  // Hover tooltip: component breakdown
  const compCounts = {};
  state.placed.forEach(inst => {
    const name = COMPONENT_LIBRARY[inst.compId].name;
    compCounts[name] = (compCounts[name] || 0) + 1;
  });
  const compTip = Object.keys(compCounts).length
    ? Object.entries(compCounts).map(([n,c]) => n + ' x' + c).join('&#10;')
    : 'No components placed yet';
  document.getElementById('stat-components').closest('.stat-chip').title = compTip;

  // Hover tooltip: libraries list
  const libTip = libs.length
    ? libs.join('&#10;')
    : 'No libraries required yet';
  document.getElementById('stat-libs').closest('.stat-chip').title = libTip;

  // Refresh virtual display visibility (show when no OLED is placed)
  renderSimFeedback();
}

function getRequiredLibs() {
  const set = new Set(['adafruit_hid']);
  state.placed.forEach(inst => {
    const comp = COMPONENT_LIBRARY[inst.compId];
    comp.libraries.forEach(l => set.add(l));
  });
  return [...set];
}

// -- Notes ----------------------------------------------------------
function updateNotes() {
  const notes = [];

  if (state.placed.length === 0) {
    notes.push({ cls: 'note-info', text: 'Add components from the shelf above to start building.' });
  }

  state.placed.forEach(inst => {
    const comp = COMPONENT_LIBRARY[inst.compId];
    comp.pinGroups.forEach(pg => {
      if (!pg.fixed && pg.required && !inst.pinAssign[pg.id]) {
        notes.push({ cls: 'note-error', text: `${comp.shortName} #${inst.id}: ${pg.label} pin not assigned.` });
      }
    });
    if (inst.compId === 'button' && (!inst.config.label || inst.config.label === `BTN ${inst.id}`)) {
      notes.push({ cls: 'note-warn', text: `Button #${inst.id}: give it a meaningful label before downloading.` });
    }
    if ((inst.compId === 'button') && inst.config.action_type === 'hotkey') {
      const keys = [inst.config.key1, inst.config.key2, inst.config.key3].filter(Boolean);
      if (keys.length === 0) notes.push({ cls: 'note-warn', text: `Button #${inst.id}: no keys assigned for hotkey action.` });
    }
  });

  // Config 2 used but no config_toggle button assigned
  const hasConfig2 = state.placed.some(inst =>
    inst.compId === 'button' && inst.config.has_config2
  );
  const hasToggle = state.placed.some(inst =>
    inst.compId === 'button' &&
    (inst.config.action_type === 'config_toggle' || inst.config.action_type2 === 'config_toggle')
  );
  if (hasConfig2 && !hasToggle) {
    notes.push({ cls: 'note-error', text: 'Config 2 is enabled on a button but no button is set to Config Toggle. Add a Config Toggle button before downloading.' });
  }

  // I2C address conflicts
  const i2cAddresses = {};
  state.placed.forEach(inst => {
    if (['ssd1306_i2c','sh1106','ssd1309'].includes(inst.compId)) {
      const addr = inst.config.i2c_address || '0x3C';
      if (i2cAddresses[addr]) {
        notes.push({ cls: 'note-error', text: `I2C address conflict: two OLEDs both on ${addr}. Change one to 0x3D.` });
      }
      i2cAddresses[addr] = true;
    }
  });

  // Pin conflicts
  const pinCount = {};
  state.placed.forEach(inst => {
    Object.values(inst.pinAssign).forEach(p => {
      if (p && !['GND_L','GND_R1','GND_R2','GND_R3','3V3_A','3V3_B','5VIN','RST'].includes(p)) {
        pinCount[p] = (pinCount[p] || 0) + 1;
      }
    });
  });
  Object.entries(pinCount).forEach(([pin, count]) => {
    if (count > 1) notes.push({ cls: 'note-error', text: `Pin conflict: ${pin} assigned to ${count} components.` });
  });

  // Extra file reminders
  const extraFiles = new Set();
  state.placed.forEach(inst => {
    const comp = COMPONENT_LIBRARY[inst.compId];
    (comp.extraFiles || []).forEach(f => extraFiles.add(f));
  });
  extraFiles.forEach(f => {
    notes.push({ cls: 'note-info', text: `Required file: place ${f} in CIRCUITPY root (download from Adafruit framebuf examples).` });
  });

  // Device capability warnings
  const dev = DEVICES[state.device];
  state.placed.forEach(inst => {
    if (dev.unsupported && dev.unsupported.includes(inst.compId)) {
      const comp = COMPONENT_LIBRARY[inst.compId];
      notes.push({ cls: 'note-error', text: `${comp.name} is not supported on the ${dev.label}. Remove it or switch device.` });
    }
    // Pin-specific warnings
    if (dev.warnings) {
      Object.values(inst.pinAssign).forEach(pinId => {
        if (!pinId) return;
        const warnKey = pinId.toLowerCase();
        if (dev.warnings[warnKey]) {
          notes.push({ cls: 'note-warn', text: `${dev.label} warning on ${pinId}: ${dev.warnings[warnKey]}` });
        }
      });
    }
  });

  // XIAO SAMD21: warn about 5V on pins
  if (state.device === 'xiao_samd21') {
    notes.push({ cls: 'note-info', text: 'XIAO SAMD21: logic is 3.3V only. Do not connect 5V components directly to GPIO pins.' });
  }

  if (notes.length === 0) {
    notes.push({ cls: 'note-ok', text: 'All components configured  --  ready to download.' });
  }

  notesList.innerHTML = notes.map(n => `<li class="${n.cls}">${n.text}</li>`).join('');
}

// -- Libraries ------------------------------------------------------
function updateLibs() {
  const libs = getRequiredLibs();
  libList.innerHTML = libs.map(l => {
    const always = l === 'adafruit_hid';
    return `<li class="${always ? 'lib-always' : ''}">${l} <span class="lib-tag">${always ? 'always' : 'required'}</span></li>`;
  }).join('');
}

// -- JSON export ----------------------------------------------------
function buildConfigJSON() {
  const buttons = {};
  const dial_modes = [];
  const joysticks = [];
  const sliders = [];
  let btnIdx = 1;

  state.placed.forEach(inst => {
    const comp = COMPONENT_LIBRARY[inst.compId];
    const c = inst.config;

    if (inst.compId === 'button') {
      let action = {};
      if (c.action_type === 'hotkey') {
        action = { type: 'hotkey', keys: [c.key1, c.key2, c.key3].filter(Boolean), auto_translate: c.auto_translate };
      } else if (c.action_type === 'actions') {
        action = { type: 'consumer', action: c.consumer_action };
      } else if (c.action_type === 'launch') {
        action = { type: 'launch', program: c.program };
      } else if (c.action_type === 'type') {
        action = { type: 'type', text: c.type_text };
      } else if (c.action_type === 'mode_toggle') {
        action = { type: 'mode_toggle' };
      } else if (c.action_type === 'config_toggle') {
        action = { type: 'config_toggle' };
      }
      action.label = c.label || `BTN ${btnIdx}`;
      action.gpio  = inst.pinAssign.sig;
      buttons[String(btnIdx++)] = action;

    } else if (['ky040','hw040'].includes(inst.compId)) {
      const buildSide = (type_key, cc_key, keys_key, dirVal) => {
        const t = c[type_key];
        if (t === 'consumer' || t === 'actions') return { type: 'consumer', action: c[cc_key] };
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
      const pressA = {};
      if (c.sw_action === 'hotkey') {
        pressA.type = 'hotkey';
        pressA.keys = (c.sw_keys || '').split(',').map(k => k.trim()).filter(Boolean);
      } else if (c.sw_action === 'consumer') {
        pressA.type   = 'consumer';
        pressA.action = c.sw_consumer || '';
      } else if (c.sw_action === 'mouse_click') {
        pressA.type = 'mouse_click';
      }
      joysticks.push({
        label:       c.label || 'Joystick',
        mode:        c.mode || 'mouse',
        deadzone:    c.deadzone ?? 3000,
        sensitivity: c.sensitivity ?? 5,
        invert_x:    !!c.invert_x,
        invert_y:    !!c.invert_y,
        sw_action:   pressA,
        gpio_vrx:    inst.pinAssign.vrx,
        gpio_vry:    inst.pinAssign.vry,
        gpio_sw:     inst.pinAssign.sw,
      });

    } else if (['hw371','slide_pot_long'].includes(inst.compId)) {
      sliders.push({
        label:    c.label,
        function: c.function,
        inverted: c.inverted,
        gpio_out: inst.pinAssign.out,
      });
    }
  });

  // OLED config
  const oleds = state.placed
    .filter(p => ['ssd1306_i2c','ssd1306_spi','sh1106','ssd1309'].includes(p.compId))
    .map(inst => {
      const base = {
        driver:       inst.compId,
        display_mode: inst.config.display_mode || 'idle_status',
        rotation:     parseInt(inst.config.rotation || '0', 10),
      };
      if (inst.compId === 'ssd1306_spi') {
        return { ...base,
          gpio_mosi: inst.pinAssign.mosi,
          gpio_sck:  inst.pinAssign.sck,
          gpio_cs:   inst.pinAssign.cs,
          gpio_dc:   inst.pinAssign.dc,
          gpio_rst:  inst.pinAssign.rst,
        };
      }
      return { ...base,
        i2c_address: inst.config.i2c_address || '0x3C',
        gpio_sda:    inst.pinAssign.sda,
        gpio_scl:    inst.pinAssign.scl,
      };
    });

  return JSON.stringify({ device: state.device, buttons, dial_modes, joysticks, oleds, sliders }, null, 2);
}

// -- Pin conflict check ---------------------------------------------
function hasPinConflicts() {
  const FIXED = new Set(['GND_L','GND_R1','GND_R2','GND_R3','3V3_A','3V3_B','5VIN','RST',
    'GND','3V3','5V','VUSB','C3SM_5V','C3SM_GND','C3SM_3V3',
    'C3D_GND1','C3D_GND2','C3D_GND3','C3D_GND4','C3D_GND5',
    'C3D_GND6','C3D_GND7','C3D_GND8','C3D_GND9','C3D_GND10',
    'C3D_3V3A','C3D_3V3B','C3D_5VA','C3D_5VB','C3D_RST','C3D_RST2','C3D_PWR',
    'XIAO_VCC','XIAO_GND','XIAO_3V3','XIAO_BGND','XIAO_VIN']);
  const counts = {};
  state.placed.forEach(inst => {
    Object.values(inst.pinAssign).forEach(p => {
      if (p && !FIXED.has(p)) counts[p] = (counts[p] || 0) + 1;
    });
  });
  return Object.values(counts).some(n => n > 1);
}

// -- Download -------------------------------------------------------
document.getElementById('btn-download').addEventListener('click', () => {
  // Pin conflicts are a hard block — the device will silently mis-fire.
  if (hasPinConflicts()) {
    alert('Pin conflicts detected — two or more components share a GPIO pin. Fix conflicts in the Notes tab before downloading.');
    document.querySelectorAll('.ptab')[1].click();
    return;
  }
  // Other errors get a confirmation prompt.
  const errors = document.querySelectorAll('.note-error');
  if (errors.length) {
    const proceed = confirm('There are configuration errors. Download anyway?');
    if (!proceed) {
      document.querySelectorAll('.ptab')[1].click();
      return;
    }
  }
  const json = buildConfigJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'config.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('btn-clear').addEventListener('click', () => {
  if (state.placed.length && !confirm('Remove all components?')) return;
  state.placed.forEach(p => { const e = document.getElementById('comp-'+p.id); if(e) e.remove(); });
  state.placed = [];
  state.selectedId = null;
  deselectAll();
  buildShelf();
  updateWires();
  updateStats();
  updateNotes();
  updateLibs();
  canvasHint.classList.remove('hidden');
});

// -- Drag & drop from shelf -----------------------------------------
let shelfDrag = null;
const dragGhost = document.createElement('div');
dragGhost.className = 'drag-ghost';
document.body.appendChild(dragGhost);

function onShelfMouseDown(e) {
  if (e.button !== 0) return;
  const item = e.currentTarget;
  shelfDrag = item.dataset.compId;
  const comp = COMPONENT_LIBRARY[shelfDrag];
  dragGhost.textContent = comp.icon + ' ' + comp.shortName;
  dragGhost.style.display = 'block';
  dragGhost.style.left = (e.clientX - 40) + 'px';
  dragGhost.style.top  = (e.clientY - 20) + 'px';
  e.preventDefault();
}

// -- Global mouse events --------------------------------------------
document.addEventListener('mousemove', e => {
  if (shelfDrag) {
    dragGhost.style.left = (e.clientX - 40) + 'px';
    dragGhost.style.top  = (e.clientY - 20) + 'px';
  }
  if (state.dragging) {
    const cRect = canvasWrap.getBoundingClientRect();
    if (state.dragging.type === 'chip') {
      const nx = e.clientX - cRect.left - state.dragging.offX + canvasWrap.scrollLeft;
      const ny = e.clientY - cRect.top  - state.dragging.offY + canvasWrap.scrollTop;
      state.chipPos = { x: Math.max(0, nx), y: Math.max(0, ny) };
      chipEl.style.left = state.chipPos.x + 'px';
      chipEl.style.top  = state.chipPos.y + 'px';
      updateWires();
    } else if (state.dragging.type === 'component') {
      const inst = state.placed.find(p => p.id === state.dragging.id);
      if (inst) {
        const cRect2 = canvasWrap.getBoundingClientRect();
        inst.x = Math.max(0, e.clientX - cRect2.left - state.dragging.offX + canvasWrap.scrollLeft);
        inst.y = Math.max(0, e.clientY - cRect2.top  - state.dragging.offY + canvasWrap.scrollTop);
        const el = document.getElementById('comp-' + inst.id);
        if (el) { el.style.left = inst.x + 'px'; el.style.top = inst.y + 'px'; }
        updateWires();
      }
    }
  }
});

document.addEventListener('mouseup', e => {
  if (shelfDrag) {
    const cRect = canvasWrap.getBoundingClientRect();
    if (e.clientX >= cRect.left && e.clientX <= cRect.right &&
        e.clientY >= cRect.top  && e.clientY <= cRect.bottom) {
      const x = e.clientX - cRect.left - 45 + canvasWrap.scrollLeft;
      const y = e.clientY - cRect.top  - 30 + canvasWrap.scrollTop;
      addComponent(shelfDrag, x, y);
    }
    shelfDrag = null;
    dragGhost.style.display = 'none';
  }
  if (state.dragging) state.dragging = null;
});

// -- Canvas click to deselect ---------------------------------------
function bindCanvas() {
  canvasWrap.addEventListener('click', e => {
    if (e.target === canvasWrap || e.target === canvas || e.target.classList.contains('canvas-grid')) {
      deselectAll();
      hideCtxMenu();
    }
  });
  document.addEventListener('keydown', e => {
    const onBody = document.activeElement === document.body ||
                   document.activeElement === document.documentElement;

    if (e.key === 'Escape') { deselectAll(); hideCtxMenu(); closeCompConfig(); }

    if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedId && onBody) {
      e.preventDefault();
      removeComponent(state.selectedId);
    }

    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
      if (e.key === 's') {
        e.preventDefault();
        document.getElementById('btn-download').click();
      }
      if (e.key === 'd' && state.selectedId) {
        e.preventDefault();
        const src = state.placed.find(p => p.id === state.selectedId);
        if (src) addComponent(src.compId, src.x + 30, src.y + 30);
      }
    }
  });
}

// -- Context menu ---------------------------------------------------
function showCtxMenu(x, y) {
  ctxMenu.style.left = x + 'px';
  ctxMenu.style.top  = y + 'px';
  ctxMenu.classList.add('visible');
}
function hideCtxMenu() { ctxMenu.classList.remove('visible'); }

function bindContextMenu() {
  document.getElementById('ctx-config').addEventListener('click', () => {
    if (ctxTargetId) selectComponent(ctxTargetId);
    hideCtxMenu();
  });
  document.getElementById('ctx-duplicate').addEventListener('click', () => {
    if (ctxTargetId) {
      const src = state.placed.find(p => p.id === ctxTargetId);
      if (src) addComponent(src.compId, src.x + 30, src.y + 30);
    }
    hideCtxMenu();
  });
  document.getElementById('ctx-delete').addEventListener('click', () => {
    if (ctxTargetId) removeComponent(ctxTargetId);
    hideCtxMenu();
  });
  document.addEventListener('click', e => {
    if (!ctxMenu.contains(e.target)) hideCtxMenu();
  });
}

// -- Panel tabs -----------------------------------------------------
function bindPanelTabs() {
  document.querySelectorAll('.ptab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById('panel-config').classList.toggle('hidden', target !== 'config');
      document.getElementById('panel-notes').classList.toggle('hidden', target !== 'notes');
      document.getElementById('panel-libs').classList.toggle('hidden', target !== 'libs');
    });
  });
}

// -- Header ---------------------------------------------------------
function bindHeader() { /* download and clear bound directly above */ }

// -- Preset dropdown ------------------------------------------------
function openPresetDropdown() {
  const dd = document.getElementById('preset-dropdown');
  if (!dd) return;
  dd.classList.toggle('open');
}
function closePresetDropdown() {
  const dd = document.getElementById('preset-dropdown');
  if (dd) dd.classList.remove('open');
}

// Build the preset dropdown content and bind the button
function buildPresetUI() {
  const btn = document.getElementById('btn-preset');
  if (!btn) return;

  const dd = document.getElementById('preset-dropdown');
  if (!dd) return;

  // Populate dropdown items
  dd.innerHTML = `<div class="preset-dropdown-header">LOAD A SAMPLE BUILD</div>` +
    Object.entries(PRESET_CONFIGS).map(([id, p]) =>
      `<div class="preset-item" onclick="loadPreset('${id}')">
        <div class="preset-item-name">${p.icon} ${p.name}</div>
        <div class="preset-item-desc">${p.desc}</div>
      </div>`
    ).join('');

  btn.addEventListener('click', e => { e.stopPropagation(); openPresetDropdown(); });
  document.addEventListener('click', e => {
    if (!btn.closest('.preset-dropdown-wrap').contains(e.target)) closePresetDropdown();
  });
}

// -- Instructions modal --------------------------------------------
function bindModal() {
  const overlay = document.getElementById('modal-overlay');
  const btn     = document.getElementById('btn-instructions');
  const closeBtn = document.getElementById('modal-close');
  if (!btn || !overlay) return;
  btn.addEventListener('click', () => overlay.classList.add('visible'));
  closeBtn.addEventListener('click', () => overlay.classList.remove('visible'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('visible');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('visible');
  });
}



// -- Tooltip --------------------------------------------------------
function showTooltip(x, y, title, body) {
  tooltip.innerHTML = `<div class="tooltip-title">${title}</div><div class="tooltip-body">${body}</div>`;
  tooltip.classList.add('visible');
  moveTooltip(x, y);
}
function moveTooltip(x, y) {
  tooltip.style.left = (x + 12) + 'px';
  tooltip.style.top  = (y + 12) + 'px';
}
function hideTooltip() { tooltip.classList.remove('visible'); }

// -- Boot -----------------------------------------------------------
window.addEventListener('load', init);
window.addEventListener('resize', () => { updateWires(); });
