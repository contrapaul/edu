/* Products, clients, job offers and the difficulty curve.
   Every product reduces to one hidden scalar with a spec band, so the three
   rigs on the bench work on all of them without knowing what they are. */

import { pick, clamp } from "./util.js";

export const PRODUCTS = {
  pin:  { tile:"PIN",  name:"pin",         unit:"mm",  nom:10.00, dec:2, span:0.90, coarse:0.1,  fine:0.01,
          baseL:0.20, color:"#4a5a6e", edge:"#6d7f95",
          a:"GO / NO GO", b:"CALIPER", c:"MICROMETER",
          aPass:"GO", aFail:"NO GO", bLo:"OPEN", bHi:"OPEN", bMatch:"CONTACT", contact:true },
  cell: { tile:"CELL", name:"cell",        unit:"V",   nom:3.70,  dec:2, span:0.60, coarse:0.05, fine:0.005,
          baseL:0.12, color:"#5c5433", edge:"#9a8c50",
          a:"LOAD TEST", b:"COMPARATOR", c:"NULL METER",
          aPass:"HOLDS", aFail:"SAGS", bLo:"CELL HIGHER", bHi:"CELL LOWER", bMatch:"BALANCED" },
  board:{ tile:"BRD",  name:"board",       unit:"ms",  nom:600,   dec:0, span:400,  coarse:20,   fine:2,
          baseL:50, color:"#2f4d43", edge:"#4e8574",
          a:"BOOT", b:"WATCHDOG", c:"TRACE",
          aPass:"BOOTS", aFail:"HANGS", bLo:"TIMED OUT", bHi:"BOOTED", bMatch:"EDGE" },
  lamp: { tile:"LED",  name:"indicator",   unit:"mcd", nom:120,   dec:0, span:80,   coarse:5,    fine:1,
          baseL:12, color:"#5a4527", edge:"#a07a44",
          a:"PRESS TEST", b:"PHOTOCELL", c:"PHOTOMETER",
          aPass:"LIGHTS", aFail:"DEAD", bLo:"BRIGHTER", bHi:"DIMMER", bMatch:"MATCHED" },
  horn: { tile:"HRN",  name:"sounder",     unit:"Hz",  nom:1000,  dec:0, span:150,  coarse:10,   fine:1,
          baseL:24, color:"#443a5c", edge:"#7a67a8",
          a:"SOUND TEST", b:"PITCH", c:"TUNER",
          aPass:"IN TUNE", aFail:"WRONG TONE", bLo:"UNIT HIGHER", bHi:"UNIT LOWER", bMatch:"UNISON",
          audio:true }
};

/* Divisions of General Purpose Production Inc.
   `from` is the day the division starts sending work. Later clients arrive
   through unlocks instead, which is phase 3. */
export const CLIENTS = {
  fastener: { name:"Fastener Division",     short:"FASTENER", product:"pin",   from:1,
              lines:["Usual pins. Usual pallet.", "Do not overthink it."] },
  powercell:{ name:"Power Cell Group",      short:"POWER CELL", product:"cell", from:2,
              lines:["Cells off the new line.", "Customer is watching this one."] },
  boards:   { name:"Board Assembly",        short:"BOARDS",   product:"board", from:3,
              lines:["Boot times, same as last week.", "Anything slow gets returned."] },
  signal:   { name:"Indicator and Signal",  short:"SIGNAL",   product:"lamp",  from:4,
              lines:["Output check on the indicators.", "Dim ones are coming back to us."] },
  warning:  { name:"Audible Warning",       short:"WARNING",  product:"horn",  from:5,
              lines:["Sounders, pitch check.", "They must all sing the same note."] }
};

/* ---- difficulty ---- */
export const BASE_RATE   = 100;   // pay for a perfect unit at rate 1.00
export const RETURN_FEE  = 150;   // charged on top of the loss when a bad unit ships
export const SCRAP_COST  = 20;
export const MAX_CX      = 4;     // complaints allowed in one shift
export const START_BAL   = 1200;
export const STOP_COST   = 250;
export const SHIFT_SECS  = 80;    // production window, regardless of how much work you took
export const GRACE_SECS  = 10;    // time to clear the tray after the last unit

export function tolOf(prod, day){
  return PRODUCTS[prod].baseL * Math.max(0.40, Math.pow(0.90, day-1));
}
export function sigmaOf(prod, day){
  return tolOf(prod, day) / 1.25;      // roughly 21 percent of units fall outside spec
}
export function overhead(day){
  return 250 + 60*(day-1);             // rises every day, so you have to take on more work
}

/* ---- job offers ---- */
let jobSeq = 0;

export function availableClients(day){
  return Object.keys(CLIENTS).filter(k => CLIENTS[k].from <= day);
}

const TOL_MULTS = [0.70, 0.85, 1.00, 1.15, 1.30];

function makeJob(clientKey, day){
  const c = CLIENTS[clientKey];
  const tolMult = pick(TOL_MULTS);
  const payMult = Math.round((1/tolMult) * 20) / 20;          // tighter work pays better
  const count = Math.round(clamp(10 + Math.random()*10 + day*0.6, 10, 34));
  return {
    id: "j" + (++jobSeq),
    client: clientKey,
    product: c.product,
    count: count,
    tolMult: tolMult,
    payMult: payMult,
    L: tolOf(c.product, day) * tolMult,
    rate: Math.round(BASE_RATE * payMult),
    line: pick(c.lines)
  };
}

/* Two offers on the opening day so there is a choice from the very first
   morning, then one per division with an extra thrown in, capped at five. */
export function makeOffers(day){
  const avail = availableClients(day);
  const out = [];
  if(avail.length === 1){
    out.push(makeJob(avail[0], day), makeJob(avail[0], day));
  } else {
    for(const k of avail) out.push(makeJob(k, day));
    if(out.length < 5) out.push(makeJob(pick(avail), day));
  }
  return out.slice(0, 5);
}
