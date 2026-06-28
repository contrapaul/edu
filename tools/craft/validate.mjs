#!/usr/bin/env node
// Dev-only data guard for Composite Craft.  Run: `node tools/craft/validate.mjs`
// Enforces the 5 invariants that keep the game playable.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const read = (f) => JSON.parse(readFileSync(join(here, f), 'utf8'));

const discoveries = read('discoveries.json').discoveries;
const recipes = read('recipes.json').recipes;
const BASE = ['metal', 'carbon', 'ceramic', 'polymer'];

const errors = [];
const ids = new Set();
for (const d of discoveries) {
    if (ids.has(d.id)) errors.push(`duplicate discovery id: ${d.id}`);
    ids.add(d.id);
}

// 1 & 3: every recipe is binary with existing ingredient + product ids.
const pairOwner = new Map();
const products = new Set();
for (const r of recipes) {
    if (!ids.has(r.id)) errors.push(`recipe product not an element: ${r.id}`);
    products.add(r.id);
    if (r.ingredients.length !== 2) errors.push(`non-binary recipe: ${r.id}`);
    for (const i of r.ingredients) if (!ids.has(i)) errors.push(`dangling ingredient '${i}' in ${r.id}`);
    // 2: deterministic — one product per unordered pair.
    const key = [...r.ingredients].sort().join('|');
    if (pairOwner.has(key)) errors.push(`duplicate pair ${key}: ${pairOwner.get(key)} vs ${r.id}`);
    else pairOwner.set(key, r.id);
}

// 5: every non-base element is some recipe's product (no orphans).
for (const d of discoveries) {
    if (!BASE.includes(d.id) && !products.has(d.id)) errors.push(`orphan element (no recipe): ${d.id}`);
}

// 4: BFS reachability from the base materials.
const have = new Set(BASE);
let changed = true;
while (changed) {
    changed = false;
    for (const r of recipes) {
        if (!have.has(r.id) && r.ingredients.every((i) => have.has(i))) { have.add(r.id); changed = true; }
    }
}
const unreachable = discoveries.filter((d) => !have.has(d.id)).map((d) => d.id);
if (unreachable.length) errors.push(`unreachable (${unreachable.length}): ${unreachable.join(', ')}`);

console.log(`elements: ${discoveries.length}  recipes: ${recipes.length}  reachable: ${have.size}/${discoveries.length}`);
if (errors.length) {
    console.error('\nFAILED:');
    for (const e of errors) console.error('  ! ' + e);
    process.exit(1);
}
console.log('ALL INVARIANTS PASS');
