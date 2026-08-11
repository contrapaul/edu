/* Career state and its save slot. */

import { START_BAL } from "./data.js";

const KEY = "qasSaveV1";

const DEFAULTS = {
  v: 1,
  day: 1,
  bal: START_BAL,
  best: 0,
  bestDay: 1,
  totalParts: 0,
  totalEscapes: 0,
  cleanShifts: 0,     // consecutive shifts with no escapes, feeds unlocks later
  unlocks: []
};

export const G = Object.assign({}, DEFAULTS);

export function load(){
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(KEY)); } catch(e){ raw = null; }
  if(!raw || raw.v !== DEFAULTS.v) return;              // anything unrecognised is discarded
  for(const k of Object.keys(DEFAULTS)){
    if(typeof raw[k] === typeof DEFAULTS[k]) G[k] = raw[k];
  }
}
export function save(){
  try { localStorage.setItem(KEY, JSON.stringify(G)); } catch(e){}
}
/* A run ends but the record of it does not, and neither do unlocks. */
export function resetCareer(){
  const best = G.best, bestDay = G.bestDay, unlocks = G.unlocks;
  Object.assign(G, DEFAULTS, { best, bestDay, unlocks });
  save();
}
