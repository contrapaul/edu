// units.js — Unit and building definitions, stat tables, and helper functions

'use strict';

const PLAYER_COLORS = ['#ff4444', '#4488ff', '#44cc44', '#ffcc00'];
const PLAYER_COLOR_NAMES = ['Red', 'Blue', 'Green', 'Yellow'];
const MAX_SUPPLY = 200;
const HARVEST_AMOUNT = 10;
const HARVEST_DURATION = 3.0;   // seconds per harvest cycle
const ATTACK_PERIOD = 1.5;      // seconds between attacks (base)
const TICK_RATE = 20;           // simulation ticks per second
const TICK_MS = 1000 / TICK_RATE;

// ---- Unit definitions ----
const UNIT_DEFS = {
  worker: {
    kind: 'unit',
    name: 'Worker',
    icon: '⚒',
    hp: 50,
    cost: 50,
    buildTimeSec: 15,
    damage: 5,
    armor: 0,
    speed: 2.5,         // grid units per second
    range: 1.5,         // attack range in grid units
    visionRange: 5,
    supply: 1,
    radius: 0.35,       // collision radius in grid units
    canBuild: true,
    canHarvest: true,
    producedBy: 'hq',
  },
  lightInfantry: {
    kind: 'unit',
    name: 'Light Infantry',
    icon: '🪖',
    hp: 80,
    cost: 75,
    buildTimeSec: 12,
    damage: 10,
    armor: 0,
    speed: 3.5,
    range: 4,
    visionRange: 6,
    supply: 1,
    radius: 0.35,
    canBuild: false,
    canHarvest: false,
    producedBy: 'barracks',
  },
  heavyInfantry: {
    kind: 'unit',
    name: 'Heavy Infantry',
    icon: '🛡',
    hp: 200,
    cost: 150,
    buildTimeSec: 20,
    damage: 20,
    armor: 2,
    speed: 1.8,
    range: 5,
    visionRange: 6,
    supply: 2,
    radius: 0.4,
    canBuild: false,
    canHarvest: false,
    producedBy: 'barracks',
  },
  lightVehicle: {
    kind: 'unit',
    name: 'Light Vehicle',
    icon: '🚗',
    hp: 120,
    cost: 200,
    buildTimeSec: 25,
    damage: 15,
    armor: 1,
    speed: 4.5,
    range: 5,
    visionRange: 8,
    supply: 2,
    radius: 0.45,
    canBuild: false,
    canHarvest: false,
    producedBy: 'factory',
  },
  heavyVehicle: {
    kind: 'unit',
    name: 'Heavy Vehicle',
    icon: '🚛',
    hp: 400,
    cost: 350,
    buildTimeSec: 40,
    damage: 30,
    armor: 4,
    speed: 1.5,
    range: 8,
    visionRange: 8,
    supply: 4,
    radius: 0.55,
    canBuild: false,
    canHarvest: false,
    producedBy: 'factory',
  },
};

// ---- Building definitions ----
const BUILDING_DEFS = {
  hq: {
    kind: 'building',
    name: 'HQ',
    icon: '🏰',
    hp: 800,
    cost: 0,
    armor: 3,
    visionRange: 10,
    supplyProvided: 10,
    footprint: 3,       // occupies 3x3 grid cells
    buildTimeSec: 0,
    produces: ['worker'],
    canUpgrade: false,
  },
  barracks: {
    kind: 'building',
    name: 'Barracks',
    icon: '⚔',
    hp: 400,
    cost: 150,
    armor: 1,
    visionRange: 6,
    supplyProvided: 5,
    footprint: 2,
    buildTimeSec: 30,
    produces: ['lightInfantry', 'heavyInfantry'],
    canUpgrade: false,
  },
  factory: {
    kind: 'building',
    name: 'Factory',
    icon: '🏭',
    hp: 400,
    cost: 200,
    armor: 1,
    visionRange: 6,
    supplyProvided: 5,
    footprint: 3,
    buildTimeSec: 40,
    produces: ['lightVehicle', 'heavyVehicle'],
    canUpgrade: false,
  },
  armory: {
    kind: 'building',
    name: 'Armory',
    icon: '🔬',
    hp: 300,
    cost: 100,
    armor: 1,
    visionRange: 6,
    supplyProvided: 0,
    footprint: 2,
    buildTimeSec: 35,
    produces: [],
    canUpgrade: true,
    upgrades: {
      damage:    { cost: 100, maxLevel: 3, name: 'Damage +1',    icon: '⚔', desc: '+1 damage per level' },
      armor:     { cost: 100, maxLevel: 3, name: 'Armor +1',     icon: '🛡', desc: '+1 armor per level' },
      range:     { cost: 150, maxLevel: 3, name: 'Range +10%',   icon: '🎯', desc: '+10% range per level' },
      critChance:{ cost: 200, maxLevel: 3, name: 'Crit +5%',     icon: '💥', desc: '+5% crit chance per level' },
    },
  },
};

// ---- Helpers ----

function getUnitDef(type) {
  return UNIT_DEFS[type] || null;
}

function getBuildingDef(type) {
  return BUILDING_DEFS[type] || null;
}

// Compute effective damage after upgrades and crit roll
function computeDamage(baseDmg, attackerUpgrades) {
  const dmg = baseDmg + (attackerUpgrades.damage || 0);
  const crit = attackerUpgrades.critChance || 0;
  // crit is a probability (0–0.15 per level, up to 3 levels = 0.45)
  if (crit > 0 && Math.random() < crit) return dmg * 2;
  return dmg;
}

// Compute effective armor after upgrades
function computeArmor(baseArmor, defenderUpgrades) {
  return baseArmor + (defenderUpgrades.armor || 0);
}

// Compute effective range after upgrades
function computeRange(baseRange, attackerUpgrades) {
  return baseRange * (1 + (attackerUpgrades.range || 0) * 0.1);
}

// Generate a short unique ID
function genId() {
  return Math.random().toString(36).slice(2, 10);
}

// Supply provided by a player's buildings
function calcMaxSupply(buildings, playerId) {
  let supply = 0;
  for (const b of Object.values(buildings)) {
    if (b.player === playerId) {
      const def = getBuildingDef(b.type);
      if (def && b.buildProgress >= 1) supply += def.supplyProvided;
    }
  }
  return Math.min(supply, MAX_SUPPLY);
}

// Supply used by a player's units
function calcUsedSupply(units, playerId) {
  let supply = 0;
  for (const u of Object.values(units)) {
    if (u.player === playerId) {
      const def = getUnitDef(u.type);
      if (def) supply += def.supply;
    }
  }
  return supply;
}
