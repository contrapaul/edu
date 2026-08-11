/* The inspection bench.
   Mounted with the work orders you accepted; everything you took merges into a
   single shift, so more accepted work means units arrive faster. */

import { $, el, gauss, shuffle, money, qColor, bandGrad, toStage, inRect, capture,
         tone, thunk, clunk, detent, ratchet, click, buzz, alarm, cash,
         humOn, humOff } from "./util.js";
import { PRODUCTS as P, sigmaOf, BASE_RATE, RETURN_FEE, SCRAP_COST, MAX_CX,
         STOP_COST, SHIFT_SECS, GRACE_SECS, CLIENTS } from "./data.js";
import { G, save } from "./state.js";

/* ---- board geometry ---- */
const TRAY_X = 38, TRAY_Y = 94, SLOT_W = 96, CAP = 10;
const A_X = 24,  A_Y = 206;
const B_X = 294, B_Y = 206;
const C_X = 934, C_Y = 206;
const RULE_X0 = B_X + 116, RULE_W = 480;
const RULE_ZERO = RULE_X0 + RULE_W/2;
const PIN_W = 120;
const RULE_Y = B_Y + 130, BAND_Y = B_Y + 172;
const KNOB_X = C_X + 176, KNOB_Y = C_Y + 34, KNOB_D = 76;
const NULL_X = C_X + 20,  NULL_Y = C_Y + 150, NULL_W = 242;

const ZONES = {
  ship: {x:24,y:436,w:330,h:140}, scrap:{x:374,y:436,w:330,h:140},
  a:{x:A_X,y:A_Y,w:250,h:210}, b:{x:B_X,y:B_Y,w:620,h:210}, c:{x:C_X,y:C_Y,w:282,h:210}
};

const CAL_OPEN_FACTOR = 1;      // rig B opens across the full rule
const A_CYCLE = 2.0;            // hands free, runs while you work something else

let R = null, running = false, drag = null, hover = null, onDone = null;
let moveHandler = null, upHandler = null, keyHandler = null;

const MARKUP = `
<div id="benchwall"></div><div id="benchtop"></div><div id="benchlight"></div>
<div id="hud">
  <div id="dayLbl"></div>
  <div id="specs"></div>
  <div id="money"></div>
  <div id="cx"></div>
  <div id="prog"><i></i></div>
</div>
<div id="tray"></div>

<div class="panel" id="rigA">
  <div class="plabel" id="aName"></div>
  <div class="slot" id="aSlot"></div>
  <div id="aBar"><i></i></div>
  <div id="aLamp"></div>
  <div class="hk">1</div>
</div>
<div class="panel" id="rigB">
  <div class="plabel" id="bName"></div>
  <div class="slot" id="bSlot"></div>
  <div id="bLamp"></div>
  <div class="readout" id="bRead">--</div>
  <div class="hk">2</div>
</div>
<div class="panel" id="rigC">
  <div class="plabel" id="cName"></div>
  <div class="slot" id="cSlot"></div>
  <div class="readout" id="cRead">--</div>
  <div class="hk">3</div>
</div>

<div class="bin" id="ship">SHIP<div class="hk">S</div></div>
<div class="bin" id="scrap">SCRAP<div class="hk">X</div></div>

<div class="panel" id="line">
  <div class="plabel">LINE</div>
  <canvas id="chart"></canvas>
  <div id="leverTrack"></div>
  <div id="lever"></div>
  <div id="leverTxt"></div>
</div>

<div id="bBeam"></div><div id="bAnvil"></div><div id="bBand"></div><canvas id="bRule"></canvas>
<div id="bHandle"></div><div id="bPtr"></div>
<div id="cNull"></div><div id="cZero"></div><div id="cNeedle"></div>
<div id="cKnob"><div class="mk"></div></div>

<div id="parts"></div><div id="fx"></div><div id="stamp"><span></span></div>`;

/* ---------------------------------------------------------------- mount */
export const bench = {
  mount(root, arg){
    root.innerHTML = MARKUP;
    onDone = arg.onDone;

    const jobs = arg.jobs;
    // two orders can be the same product on different tolerances, so every unit
    // has to carry the lot it came from or its spec is unknowable
    jobs.forEach((j, i) => { j.lot = "ABCDE"[i] || "?"; });
    const products = [...new Set(jobs.map(j => j.product))];
    const total = jobs.reduce((n, j) => n + j.count, 0);

    // one entry per unit, interleaved so products arrive mixed
    const queue = shuffle(jobs.flatMap(j => Array.from({length:j.count}, () => j)));

    R = {
      day: arg.day, jobs, products, queue, total,
      interval: Math.max(0.7, SHIFT_SECS/total),
      sig: {}, bias: {},
      parts: [], tray: new Array(CAP).fill(null),
      a:null, b:null, c:null, aT:0, aPlayed:0,
      bVal:0, bLast:0, bDet:0, cVal:0, cAng:0, cRat:0,
      nPos:-1, nVel:0, nTarget:-1,
      produced:0, spawnT:0.9, grace:-1,
      dayMoney:0, cx:0, chart:[], stopped:false, seen:{}
    };
    for(const k of products){
      R.sig[k] = sigmaOf(k, arg.day);
      R.bias[k] = (Math.random()*2 - 1) * 0.8 * jobs.find(j => j.product === k).L;
    }

    drag = null; hover = null;
    bindWidgets();
    renderSpecs(); renderHud(); renderCx(); drawChart(); layout();

    $("#leverTxt").textContent = "STOP LINE  " + money(-STOP_COST);
    running = true;
    humOn();
  },

  unmount(){
    running = false;
    humOff();
    window.removeEventListener("pointermove", moveHandler);
    window.removeEventListener("pointerup", upHandler);
    window.removeEventListener("keydown", keyHandler);
    R = null; drag = null; hover = null;
  },

  tick(dt){
    if(!running || !R) return;
    needlePhysics(dt);

    if(R.produced < R.total){
      R.spawnT -= dt;
      if(R.spawnT <= 0){ makePart(); R.spawnT = R.interval; renderHud(); }
    } else if(R.grace < 0){
      R.grace = GRACE_SECS;
      $("#prog i").style.background = "#c07f28";
      buzz();
    } else {
      R.grace -= dt;
      $("#prog i").style.width = (100*Math.max(0,R.grace)/GRACE_SECS) + "%";
      if(R.grace <= 0){ endShift(null); return; }
    }

    if(R.a && R.aT > 0){
      const d = P[R.a.prod];
      R.aT -= dt;
      $("#aBar i").style.width = (100*(1 - R.aT/A_CYCLE)) + "%";
      if(d.audio){
        if(R.aPlayed === 0 && R.aT <= 1.3){ R.aPlayed = 1; tone(d.nom, 0.35); }
        if(R.aPlayed === 1 && R.aT <= 0.7){ R.aPlayed = 2; tone(R.a.val, 0.35); }
      }
      if(R.aT <= 0){
        const pass = Math.abs(R.a.dev) <= R.a.L;
        const tg = R.a.el.querySelector(".tag");
        tg.textContent = pass ? "OK" : "BAD";
        tg.style.color = pass ? "#4caf6a" : "#d9534f";
        R.a.el.classList.add("read");
        const lamp = $("#aLamp");
        lamp.textContent = pass ? d.aPass : d.aFail;
        lamp.style.background = pass ? "#1e3a28" : "#3a1e1e";
        lamp.style.color = pass ? "#4caf6a" : "#d9534f";
        lamp.classList.remove("flicker");
        void lamp.offsetWidth;
        lamp.classList.add("flicker");
        click();
      }
    } else if(!R.a){ $("#aBar i").style.width = "0%"; }
  }
};

/* ---------------------------------------------------------------- parts */
function makePart(){
  const job = R.queue[R.produced];
  const prod = job.product, d = P[prod];
  const val = d.nom + R.bias[prod] + gauss()*R.sig[prod];
  R.produced++;

  const p = { id:R.produced, job, prod, val, dev:val - d.nom, L:job.L,
              state:"tray", slot:-1, reading:null, disp:null, _x:-120, _y:TRAY_Y };
  const node = el("div", "part",
    '<span class="plot">'+job.lot+'</span>' +
    '<span class="pid">'+p.id+'</span><span class="pn">'+d.tile+'</span><span class="tag"></span>');
  node.style.background = d.color;
  node.style.borderColor = d.edge;
  node.style.width = "88px"; node.style.height = "88px";
  node.style.transform = "translate(-120px," + TRAY_Y + "px)";
  node.addEventListener("pointerdown", e => grab(p, e));
  node.addEventListener("pointerenter", () => { if(!drag) setHover(p); });
  node.addEventListener("pointerleave", () => { if(hover === p) setHover(null); });
  p.el = node;
  $("#parts").appendChild(node);
  R.parts.push(p);

  let idx = R.tray.indexOf(null);
  if(idx < 0){                                   // tray full, the oldest rides out unchecked
    const old = R.tray.reduce((a,b) => (a && a.id < b.id) ? a : b);
    dispose(old, "ship", true);
    idx = R.tray.indexOf(null);
    const tray = $("#tray");
    tray.classList.remove("jostle"); void tray.offsetWidth; tray.classList.add("jostle");
  }
  R.tray[idx] = p; p.slot = idx;
  void node.offsetWidth;                         // settle the start so the slide in transitions
  layout();
  setTimeout(() => {                             // land it when the slide actually arrives
    if(!p.el.isConnected) return;
    p.el.classList.add("landed");
    clunk();
  }, 290);
}

function freeSlot(p){
  if(p.state === "tray" && p.slot >= 0){ R.tray[p.slot] = null; p.slot = -1; }
  if(p.state === "a") R.a = null;
  if(p.state === "b") R.b = null;
  if(p.state === "c") R.c = null;
}
function toTray(p){
  const i = R.tray.indexOf(null);
  if(i < 0) return false;
  R.tray[i] = p; p.slot = i; p.state = "tray";
  return true;
}
function setReading(p, val, res){
  p.reading = val;
  const dp = res < 1 ? Math.max(P[p.prod].dec, String(res).split(".")[1].length) : 0;
  const tag = p.el.querySelector(".tag");
  tag.textContent = val.toFixed(dp);
  tag.style.color = "#e0a33a";
  p.el.classList.add("read");
  R.chart.push((val - P[p.prod].nom)/p.L);
  drawChart();
  click();
}

/* ---------------------------------------------------------------- disposition */
function dispose(p, how, auto){
  freeSlot(p);
  let v;
  if(how === "ship"){
    const r = p.dev / p.L;
    v = Math.round(BASE_RATE * p.job.payMult * (1 - r*r));
    if(Math.abs(r) > 1){ v -= Math.round(RETURN_FEE * p.job.payMult); R.cx++; renderCx(); }
    v = Math.max(-500, v);
  } else {
    v = -SCRAP_COST;
  }

  p.disp = how; p.state = "gone"; p.pay = v;
  R.dayMoney += v; G.bal += v;
  renderHud();
  floater(p._x + 26, p._y + 20, (v >= 0 ? "+" : "") + v, v >= 0 ? "#2f7d52" : "#b0402c", auto);

  const node = p.el;
  if(!auto){
    stampOn(p, how);
    node.dataset.ink = how === "ship" ? "SHIP" : "SCRAP";
    node.classList.add("inked", how === "ship" ? "ink-ship" : "ink-scrap");
    thunk();
    cash(v >= 0);
  }
  if(how === "ship" && Math.abs(p.dev) > p.L) complaintHit();

  node.classList.add("out");
  node.style.transform = "translate(" + (p._x + (how === "ship" ? 90 : 0)) + "px,"
                                      + (p._y + (how === "ship" ? 0 : 70)) + "px)";
  setTimeout(() => node.remove(), 460);

  layout();
  if(R.cx >= MAX_CX) endShift("CONTRACT LOST");
  else if(G.bal < 0) endShift("BANKRUPT");
}

/* the stamp comes down where the unit is, and leaves its mark on it */
function stampOn(p, how){
  const s = $("#stamp");
  if(!s) return;
  const w = p.el.offsetWidth, h = p.el.offsetHeight;
  s.style.left = (p._x + w/2 - 52) + "px";
  s.style.top  = (p._y + h/2 - 52) + "px";
  s.style.color = how === "ship" ? "#2f7d52" : "#b0402c";
  s.firstElementChild.textContent = how === "ship" ? "SHIP" : "SCRAP";
  s.classList.remove("go");
  void s.offsetWidth;
  s.classList.add("go");
}

/* a unit reaching the customer is the loudest thing that happens in here */
function complaintHit(){
  alarm();
  const root = document.getElementById("scene");
  if(!root) return;
  root.classList.remove("shake");
  void root.offsetWidth;
  root.classList.add("shake");
  setTimeout(() => root.classList.remove("shake"), 360);
}

function floater(x, y, txt, col, auto){
  const d = el("div", "float", "");
  d.textContent = txt;
  d.style.color = col;
  d.style.left = x + "px"; d.style.top = y + "px";
  if(auto) d.style.opacity = ".6";
  $("#fx").appendChild(d);
  requestAnimationFrame(() => { d.style.transform = "translateY(-40px)"; d.style.opacity = "0"; });
  setTimeout(() => d.remove(), 950);
}

/* ---------------------------------------------------------------- drag and keys */
function setHover(p){
  if(hover === p) return;
  if(hover) hover.el.classList.remove("hover");
  hover = p;
  if(hover) hover.el.classList.add("hover");
}
function highlight(s){
  $("#ship").classList.toggle("hot", !!s && inRect(ZONES.ship, s));
  $("#scrap").classList.toggle("hot", !!s && inRect(ZONES.scrap, s));
  $("#rigA").classList.toggle("hot", !!s && !R.a && inRect(ZONES.a, s));
  $("#rigB").classList.toggle("hot", !!s && !R.b && inRect(ZONES.b, s));
  $("#rigC").classList.toggle("hot", !!s && !R.c && inRect(ZONES.c, s));
}
function grab(p, e){
  if(!running || p.state === "gone") return;
  if(p.state === "a" && R.aT > 0) return;
  e.preventDefault();
  const s = toStage(e);
  drag = { p, dx:s.x - p._x, dy:s.y - p._y, from:p.state };
  freeSlot(p);
  p.state = "drag";
  p.el.classList.add("drag");
  capture(p.el, e);
  layout();
}

function bindWidgets(){
  moveHandler = e => {
    if(!drag) return;
    const s = toStage(e);
    drag.p._x = s.x - drag.dx; drag.p._y = s.y - drag.dy;
    drag.p.el.style.transform = "translate(" + drag.p._x + "px," + drag.p._y + "px)";
    highlight(s);
  };
  upHandler = e => {
    if(!drag) return;
    const p = drag.p, from = drag.from;
    drag = null;
    p.el.classList.remove("drag");
    highlight(null);
    const ctr = { x:p._x + p.el.offsetWidth/2, y:p._y + p.el.offsetHeight/2 };

    if(inRect(ZONES.ship, ctr)) { dispose(p, "ship"); return; }
    if(inRect(ZONES.scrap, ctr)){ dispose(p, "scrap"); return; }
    if(inRect(ZONES.a, ctr) && !R.a){ seatA(p); return; }
    if(inRect(ZONES.b, ctr) && !R.b){ seatB(p); return; }
    if(inRect(ZONES.c, ctr) && !R.c){ seatC(p); return; }

    if(!toTray(p)){
      if(from === "a" && !R.a) seatA(p);
      else if(from === "b" && !R.b) seatB(p);
      else if(from === "c" && !R.c) seatC(p);
      else { dispose(p, "scrap"); return; }
    }
    layout();
  };
  keyHandler = e => {
    if(!running || !hover || hover.state === "gone" || hover.state === "drag") return;
    if(hover.state === "a" && R.aT > 0) return;
    const p = hover, k = e.key.toLowerCase();
    if(k === "s"){ setHover(null); dispose(p, "ship"); }
    else if(k === "x"){ setHover(null); dispose(p, "scrap"); }
    else if(k === "1" && !R.a){ freeSlot(p); seatA(p); }
    else if(k === "2" && !R.b){ freeSlot(p); seatB(p); }
    else if(k === "3" && !R.c){ freeSlot(p); seatC(p); }
  };
  window.addEventListener("pointermove", moveHandler);
  window.addEventListener("pointerup", upHandler);
  window.addEventListener("keydown", keyHandler);

  $("#bHandle").addEventListener("pointerdown", startSweep);
  $("#cKnob").addEventListener("pointerdown", startNull);
  $("#lever").addEventListener("pointerdown", startLever);
}

function seatA(p){
  p.state = "a"; R.a = p; R.aT = A_CYCLE; R.aPlayed = 0;
  const lamp = $("#aLamp");
  lamp.textContent = ""; lamp.style.background = "#171b20"; lamp.style.color = "#5b656f";
  clunk();
  layout();
}
function seatB(p){
  const d = P[p.prod];
  p.state = "b"; R.b = p;
  R.bVal = d.contact ? d.nom + d.span : d.nom - d.span;
  R.bLast = R.bVal;
  R.bDet = Math.round(R.bVal/d.coarse);
  clunk();
  layout();
}
function seatC(p){
  const d = P[p.prod];
  p.state = "c"; R.c = p; R.cVal = d.nom - d.span*0.6; R.cAng = 0; R.cRat = 0;
  R.nPos = -1.25; R.nVel = 0; R.nTarget = -1;     // needle starts pegged and swings in
  clunk();
  layout();
}

/* ---------------------------------------------------------------- layout */
const ppu = prod => RULE_W / (2*P[prod].span);

function layout(){
  if(!R) return;
  for(const p of R.parts){
    if(p.state === "gone" || p.state === "drag") continue;
    let w = 88, h = 88;
    if(p.state === "tray"){ p._x = TRAY_X + p.slot*SLOT_W; p._y = TRAY_Y; }
    else if(p.state === "a"){ w = 74; h = 74; p._x = A_X + 88; p._y = A_Y + 52; }
    else if(p.state === "b"){
      if(P[p.prod].contact){ w = PIN_W + p.dev*ppu(p.prod); h = 84; p._x = RULE_ZERO - PIN_W; p._y = B_Y + 40; }
      else { w = 76; h = 76; p._x = B_X + 22; p._y = B_Y + 52; }
    }
    else if(p.state === "c"){ w = 76; h = 76; p._x = C_X + 20; p._y = C_Y + 46; }
    p.el.style.width = w + "px"; p.el.style.height = h + "px";
    p.el.style.transform = "translate(" + p._x + "px," + p._y + "px)";
  }
  rigs();
}

/* Idle rigs stay blank until something goes in, then keep the name of whatever
   was last tested, so the bench reads back what it is. */
function rigName(slot, prod){
  if(prod) R.seen[slot] = P[prod][slot];
  return R.seen[slot] || "";
}

function rigs(){
  const pa = R.a;
  $("#aName").textContent = rigName("a", pa && pa.prod);
  $("#aSlot").style.display = pa ? "none" : "block";

  const pb = R.b, d = pb ? P[pb.prod] : null;
  const showB = !!pb;
  ["#bHandle","#bAnvil","#bRule","#bBand","#bPtr","#bBeam"].forEach(s => $(s).style.display = showB ? "block" : "none");
  $("#bLamp").style.display = showB ? "flex" : "none";
  $("#bName").textContent = rigName("b", pb && pb.prod);
  const bs = $("#bSlot");
  bs.style.display = showB ? "none" : "block";
  bs.style.left = (P[R.products[0]].contact ? RULE_ZERO - PIN_W - B_X : 22) + "px";

  if(showB){
    const u = ppu(pb.prod);
    const hx = RULE_ZERO + (R.bVal - d.nom)*u;
    const tall = d.contact;
    const handle = $("#bHandle");
    handle.style.width = "12px";
    handle.style.height = tall ? "84px" : "64px";
    handle.style.transform = "translate(" + hx + "px," + (B_Y + (tall ? 40 : 58)) + "px)";
    const anvil = $("#bAnvil");
    anvil.style.height = "84px";
    anvil.style.display = d.contact ? "block" : "none";
    anvil.style.transform = "translate(" + (RULE_ZERO - PIN_W - 12) + "px," + (B_Y + 40) + "px)";

    // the beam the moving jaw rides on, drawn from the anvil out past the handle
    const beamX = d.contact ? RULE_ZERO - PIN_W - 12 : RULE_X0 - 14;
    const beam = $("#bBeam");
    beam.style.transform = "translate(" + beamX + "px," + (B_Y + (tall ? 112 : 106)) + "px)";
    beam.style.width = Math.max(60, (hx + 12) - beamX) + "px";

    const band = $("#bBand");
    band.style.transform = "translate(" + (RULE_ZERO - pb.L*u) + "px," + BAND_Y + "px)";
    band.style.width = (2*pb.L*u) + "px";
    band.style.background = bandGrad();
    $("#bPtr").style.transform = "translate(" + (hx + 5) + "px," + (BAND_Y - 4) + "px)";
    drawRule(pb.prod);

    const v = Math.round(R.bVal/d.coarse)*d.coarse;
    const read = $("#bRead");
    read.innerHTML = v.toFixed(d.dec) + ' <u>' + d.unit + '</u>';
    read.style.color = qColor((v - d.nom)/pb.L);

    const diff = R.bVal - pb.val;
    const lamp = $("#bLamp");
    if(Math.abs(diff) <= d.coarse*0.5){
      lamp.textContent = d.bMatch; lamp.style.background = "#1e3a28"; lamp.style.color = "#4caf6a";
    } else {
      lamp.textContent = diff < 0 ? d.bLo : d.bHi; lamp.style.background = "#20242b"; lamp.style.color = "#8b95a3";
    }
  } else {
    $("#bRead").textContent = "--"; $("#bRead").style.color = "#e0a33a";
  }

  const pc = R.c, e = pc ? P[pc.prod] : null;
  const showC = !!pc;
  ["#cKnob","#cNull","#cNeedle","#cZero"].forEach(s => $(s).style.display = showC ? "block" : "none");
  $("#cName").textContent = rigName("c", pc && pc.prod);
  $("#cSlot").style.display = showC ? "none" : "block";

  if(showC){
    const knob = $("#cKnob");
    knob.style.width = KNOB_D + "px"; knob.style.height = KNOB_D + "px";
    knob.style.transform = "translate(" + KNOB_X + "px," + KNOB_Y + "px) rotate(" + R.cAng + "rad)";
    const nul = $("#cNull");
    nul.style.transform = "translate(" + NULL_X + "px," + NULL_Y + "px)";
    nul.style.width = NULL_W + "px";
    $("#cZero").style.transform = "translate(" + (NULL_X + NULL_W/2) + "px," + NULL_Y + "px)";
    const diff = pc.val - R.cVal;
    R.nTarget = Math.max(-1, Math.min(1, diff/(e.fine*10)));
    const needle = $("#cNeedle");
    const near = Math.abs(diff) <= e.fine*0.5;
    needle.style.background = near ? "#4caf6a" : "#e0a33a";
    needle.style.boxShadow = near ? "0 0 10px rgba(76,175,106,.8)" : "0 0 8px rgba(224,163,58,.7)";
    const v = Math.round(R.cVal/e.fine)*e.fine;
    const read = $("#cRead");
    read.innerHTML = v.toFixed(e.dec) + ' <u>' + e.unit + '</u>';
    read.style.color = qColor((v - e.nom)/pc.L);
  } else {
    $("#cRead").textContent = "--"; $("#cRead").style.color = "#e0a33a";
  }
}

/* A real meter needle has mass. It overshoots and settles rather than tracking
   the value exactly, and that is most of what makes it feel like an object. */
function needlePhysics(dt){
  if(!R) return;
  const needle = $("#cNeedle");
  if(!needle) return;
  if(!R.c){ R.nPos = R.nTarget = -1; R.nVel = 0; return; }
  const stiffness = 210, damping = 0.86;
  R.nVel += (R.nTarget - R.nPos) * stiffness * dt;
  R.nVel *= Math.pow(damping, dt*60);
  R.nPos += R.nVel * dt;
  if(R.nPos < -1.25){ R.nPos = -1.25; R.nVel = 0; }
  if(R.nPos >  1.25){ R.nPos =  1.25; R.nVel = 0; }
  needle.style.transform =
    "translate(" + (NULL_X + NULL_W/2 + R.nPos*NULL_W/2 - 1) + "px," + NULL_Y + "px)";
}

function drawRule(prod){
  const d = P[prod], u = ppu(prod), w = RULE_W + 40, h = 34;
  const dpr = window.devicePixelRatio || 1;
  const cv = $("#bRule");
  cv.width = w*dpr; cv.height = h*dpr;
  cv.style.width = w + "px"; cv.style.height = h + "px";
  cv.style.transform = "translate(" + (RULE_X0 - 20) + "px," + RULE_Y + "px)";
  const g = cv.getContext("2d");
  g.setTransform(dpr,0,0,dpr,0,0);
  g.clearRect(0,0,w,h);
  g.strokeStyle = "#5d6673"; g.fillStyle = "#8b95a3";
  g.font = "10px 'JetBrains Mono', ui-monospace, monospace";
  g.textAlign = "center";
  const step = d.coarse, n = Math.floor(d.span/step);
  for(let i = -n; i <= n; i++){
    const v = d.nom + i*step, x = 20 + RULE_W/2 + i*step*u;
    if(x < 0 || x > w) continue;
    const major = (i % 5 === 0);
    g.beginPath(); g.moveTo(x, 0); g.lineTo(x, major ? 14 : 8); g.stroke();
    if(major) g.fillText(v.toFixed(d.dec), x, 26);
  }
}

/* ---------------------------------------------------------------- instrument input */
function startSweep(e){
  if(!R || !R.b) return;
  e.preventDefault();
  capture($("#bHandle"), e);
  const p = R.b, d = P[p.prod], u = ppu(p.prod);
  const x0 = toStage(e).x, v0 = R.bVal;
  const mv = ev => {
    let v = v0 + (toStage(ev).x - x0)/u;
    if(d.contact) v = Math.max(p.val, Math.min(d.nom + d.span*CAL_OPEN_FACTOR, v));
    else v = Math.max(d.nom - d.span, Math.min(d.nom + d.span, v));
    R.bVal = v;
    if(Math.abs(v - p.val) <= d.coarse*0.5) setReading(p, Math.round(v/d.coarse)*d.coarse, d.coarse);
    const step = Math.round(v/d.coarse);
    if(step !== R.bDet){ R.bDet = step; detent(); }          // a click per graduation
    if(d.audio && Math.abs(v - R.bLast) >= d.coarse){ R.bLast = v; tone(v, 0.09); }
    rigs();
  };
  const up = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
  window.addEventListener("pointermove", mv);
  window.addEventListener("pointerup", up);
}

function startNull(e){
  if(!R || !R.c) return;
  e.preventDefault();
  capture($("#cKnob"), e);
  const p = R.c, d = P[p.prod];
  const cx = KNOB_X + KNOB_D/2, cy = KNOB_Y + KNOB_D/2;
  let last = Math.atan2(toStage(e).y - cy, toStage(e).x - cx);
  const perTurn = d.span*0.30;
  const mv = ev => {
    const s = toStage(ev);
    const a = Math.atan2(s.y - cy, s.x - cx);
    let dv = a - last;
    while(dv > Math.PI) dv -= 2*Math.PI;
    while(dv < -Math.PI) dv += 2*Math.PI;
    last = a; R.cAng += dv;
    R.cVal = Math.max(d.nom - d.span, Math.min(d.nom + d.span, R.cVal + (dv/(2*Math.PI))*perTurn));
    if(Math.abs(R.cVal - p.val) <= d.fine*0.5) setReading(p, Math.round(R.cVal/d.fine)*d.fine, d.fine);
    const notch = Math.round(R.cAng/(Math.PI/9));            // 18 clicks per turn
    if(notch !== R.cRat){ R.cRat = notch; ratchet(); }
    rigs();
  };
  const up = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
  window.addEventListener("pointermove", mv);
  window.addEventListener("pointerup", up);
}

function startLever(e){
  if(!R || R.stopped || !running) return;
  e.preventDefault();
  const lever = $("#lever");
  capture(lever, e);
  const y0 = toStage(e).y, top0 = 56;
  const mv = ev => {
    const dy = Math.max(0, Math.min(112, toStage(ev).y - y0));
    lever.style.top = (top0 + dy) + "px";
    if(dy >= 104) stopLine();
  };
  const up = () => {
    window.removeEventListener("pointermove", mv);
    window.removeEventListener("pointerup", up);
    if(!R.stopped) lever.style.top = top0 + "px";
  };
  window.addEventListener("pointermove", mv);
  window.addEventListener("pointerup", up);
}

function stopLine(){
  if(R.stopped) return;
  R.stopped = true;
  G.bal -= STOP_COST; R.dayMoney -= STOP_COST;
  for(const k of R.products) R.bias[k] = 0;
  const lever = $("#lever");
  lever.style.background = "linear-gradient(180deg,#4b8468,#33654b)";
  lever.style.borderColor = "#26503b";
  $("#leverTxt").textContent = "LINE RESET";
  floater(1000, 520, "-" + STOP_COST, "#b0402c");
  thunk();
  renderHud();
  if(G.bal < 0) endShift("BANKRUPT");
}

/* ---------------------------------------------------------------- chart and hud */
function drawChart(){
  const w = 280, h = 190, dpr = window.devicePixelRatio || 1;
  const cv = $("#chart");
  cv.width = w*dpr; cv.height = h*dpr;
  cv.style.width = w + "px"; cv.style.height = h + "px";
  const g = cv.getContext("2d");
  g.setTransform(dpr,0,0,dpr,0,0);
  const y = nd => h/2 - (nd/2.6)*(h/2);
  g.fillStyle = "#12161b"; g.fillRect(0,0,w,h);
  g.fillStyle = "rgba(76,175,106,.10)"; g.fillRect(0, y(1), w, y(-1) - y(1));
  g.strokeStyle = "#3d4a56"; g.setLineDash([4,4]);
  [1,-1].forEach(v => { g.beginPath(); g.moveTo(0, y(v)); g.lineTo(w, y(v)); g.stroke(); });
  g.setLineDash([]);
  g.strokeStyle = "#2e343d"; g.beginPath(); g.moveTo(0, y(0)); g.lineTo(w, y(0)); g.stroke();
  R.chart.slice(-36).forEach((nd, i) => {
    const x = 8 + i*((w-16)/35);
    g.fillStyle = qColor(nd);
    g.beginPath(); g.arc(x, Math.max(3, Math.min(h-3, y(nd))), 3.2, 0, 7); g.fill();
  });
}

function renderHud(){
  $("#dayLbl").textContent = "DAY " + R.day;
  const m = $("#money");
  m.textContent = money(G.bal);
  m.style.color = G.bal < 300 ? "#b0402c" : "#2b2a24";
  $("#prog i").style.width = (100*R.produced/R.total) + "%";
}
function renderSpecs(){
  const box = $("#specs");
  box.innerHTML = "";
  for(const j of R.jobs){
    const d = P[j.product];
    const c = el("div", "card",
      '<div class="cn"><i>' + j.lot + '</i>' + CLIENTS[j.client].short + '</div>' +
      '<div class="cv">' + d.nom.toFixed(d.dec) + ' <span>&plusmn;</span> ' + j.L.toFixed(d.dec) +
      ' <em>' + d.unit + '</em></div><div class="cb"></div>');
    c.querySelector(".cb").style.background = bandGrad();
    box.appendChild(c);
  }
}
function renderCx(){
  const box = $("#cx");
  box.innerHTML = "";
  for(let i = 0; i < MAX_CX; i++){
    box.appendChild(el("div", "cxd" + (i < R.cx ? " on" : "")));
  }
}

/* ---------------------------------------------------------------- end */
function endShift(failure){
  if(!running) return;
  running = false;

  if(!failure){
    for(const p of R.parts.slice()){
      if(p.state !== "gone" && p.state !== "drag") dispose2(p);
    }
  }

  const perJob = {};
  for(const j of R.jobs) perJob[j.id] = { job:j, shipped:0, scrapped:0, escapes:0, pay:0 };
  for(const p of R.parts){
    if(!p.disp) continue;
    const s = perJob[p.job.id];
    if(p.disp === "ship"){ s.shipped++; if(Math.abs(p.dev) > p.L) s.escapes++; }
    else s.scrapped++;
    s.pay += p.pay;
  }

  const result = {
    failure,
    day: R.day,
    dayMoney: R.dayMoney,
    cx: R.cx,
    parts: R.parts.filter(p => p.disp),
    jobs: R.jobs,
    perJob: Object.values(perJob),
    stopped: R.stopped
  };
  save();
  const done = onDone;
  setTimeout(() => done(result), failure ? 500 : 250);
}

/* end of shift auto ship, without re-entering the failure checks */
function dispose2(p){
  freeSlot(p);
  const r = p.dev / p.L;
  let v = Math.round(BASE_RATE * p.job.payMult * (1 - r*r));
  if(Math.abs(r) > 1){ v -= Math.round(RETURN_FEE * p.job.payMult); R.cx++; }
  v = Math.max(-500, v);
  p.disp = "ship"; p.state = "gone"; p.pay = v;
  R.dayMoney += v; G.bal += v;
  if(p.el) p.el.remove();
}
