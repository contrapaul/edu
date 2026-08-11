/* Small shared helpers. No dependencies. */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function el(tag, cls, html){
  const n = document.createElement(tag);
  if(cls) n.className = cls;
  if(html != null) n.innerHTML = html;
  return n;
}

/* standard normal, Box Muller */
export function gauss(){
  let u = 0, v = 0;
  while(!u) u = Math.random();
  while(!v) v = Math.random();
  return Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v);
}

export const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
export const pick = arr => arr[Math.floor(Math.random()*arr.length)];

export function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length-1; i > 0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function money(n){
  const r = Math.round(n);
  return (r < 0 ? "-$" : "$") + Math.abs(r).toLocaleString();
}
export function signed(n){
  return (n >= 0 ? "+" : "") + money(n);
}

/* colour by how far through the tolerance band a value sits, 0 at nominal, 1 at the limit */
export function qColor(r){
  r = Math.abs(r);
  if(r <= 0.40) return "#4caf6a";
  if(r <= 0.75) return "#a8b84a";
  if(r <= 1.00) return "#e0a33a";
  if(r <= 1.50) return "#d97a3a";
  return "#d9534f";
}

export function bandGrad(){
  return "linear-gradient(90deg,#d9534f 0%,#e0a33a 12%,#4caf6a 42%,#4caf6a 58%,#e0a33a 88%,#d9534f 100%)";
}

/* ---- stage space ----
   Everything is laid out on a fixed 1240 x 740 board that is scaled to fit.
   Pointer positions get converted back into board coordinates. */
export const STAGE_W = 1240, STAGE_H = 740;
let stageEl = null;

export function bindStage(node){
  stageEl = node;
  fitStage();
  window.addEventListener("resize", fitStage);
}
export function fitStage(){
  if(!stageEl) return;
  const k = Math.min(window.innerWidth/STAGE_W, window.innerHeight/STAGE_H);
  stageEl.style.transform = "scale(" + k + ")";
  stageEl._k = k;
}
export function toStage(e){
  const r = stageEl.getBoundingClientRect();
  return { x:(e.clientX - r.left)/stageEl._k, y:(e.clientY - r.top)/stageEl._k };
}
export function inRect(rect, p){
  return p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h;
}

/* ---- audio ----
   Synthesised only, no files. Created on first use so it follows a user gesture. */
let AC = null;
function ctx(){
  if(!AC){
    try { AC = new (window.AudioContext || window.webkitAudioContext)(); }
    catch(e){ return null; }
  }
  return AC;
}
export function tone(freq, dur, type = "square", vol = 0.05){
  const ac = ctx();
  if(!ac) return;
  try{
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    o.start();
    o.stop(ac.currentTime + dur + 0.02);
  }catch(e){}
}
export function thunk(){ tone(90, 0.10, "triangle", 0.10); }
export function click(){ tone(1600, 0.02, "square", 0.02); }
export function chime(){ tone(880, 0.09, "sine", 0.05); setTimeout(()=>tone(1320, 0.12, "sine", 0.045), 90); }
export function buzz(){ tone(140, 0.35, "sawtooth", 0.05); }
