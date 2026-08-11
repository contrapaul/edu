/* The office at General Purpose Production Inc.
   Work arrives as mail. Drag a message off the screen and it becomes a work
   order; drop it in the tray to take the job or in the shredder to refuse it.
   Everything in the tray runs in one shift, so the tray is the difficulty dial. */

import { $, el, toStage, inRect, money, click, thunk, chime, buzz } from "./util.js";
import { PRODUCTS as P, CLIENTS, makeOffers, overhead, SHIFT_SECS } from "./data.js";
import { G } from "./state.js";

const INTRAY = { x:850, y:436, w:330, h:134 };
const SHRED  = { x:850, y:606, w:330, h:106 };

let offers = [], accepted = [], onStart = null;
let drag = null, moveHandler = null, upHandler = null;

const MARKUP = `
<div class="wall"></div>
<div class="desk"></div>
<div class="deskedge"></div>

<div id="sign">GENERAL PURPOSE PRODUCTION INC.</div>

<div id="board">
  <div class="brow"><span>DAY</span><b id="bDay"></b></div>
  <div class="brow"><span>BALANCE</span><b id="bBal"></b></div>
  <div class="brow"><span>OVERHEAD TODAY</span><b id="bOver" class="neg"></b></div>
</div>

<div id="clock">
  <div class="cface"><div class="ctime">07:5<span id="clkMin">4</span></div></div>
  <div class="cslot"></div>
  <div id="punch">PUNCH IN</div>
</div>

<div id="monitor"><div id="screen">
  <div id="mailbar"><span>GPP MAIL</span><i id="mailCount"></i></div>
  <div id="maillist"></div>
</div></div>
<div id="stand"></div><div id="base"></div>

<div id="intray">
  <div class="traylip"></div>
  <div class="traylabel">IN TRAY</div>
  <div id="trayStack"></div>
</div>
<div id="trayInfo"></div>

<div id="shredder">
  <div class="shredmouth"></div>
  <div class="shredlabel">SHREDDER</div>
</div>

<div id="nameplate"><b>QUALITY ASSURANCE</b><span id="npDay"></span></div>
<div id="mug"><div class="mughandle"></div><div class="mugtop"></div></div>

<div id="dragLayer"></div>`;

export const office = {
  mount(root, arg){
    root.innerHTML = MARKUP;
    onStart = arg.onStart;
    offers = makeOffers(G.day);
    accepted = [];
    drag = null;

    $("#bDay").textContent = G.day;
    $("#bBal").textContent = money(G.bal);
    $("#bOver").textContent = money(-overhead(G.day));
    $("#npDay").textContent = "shift " + G.day;
    $("#clkMin").textContent = String(4 + (G.day % 5));

    renderMail();
    renderTray();
    bind();
    chime();
  },

  unmount(){
    window.removeEventListener("pointermove", moveHandler);
    window.removeEventListener("pointerup", upHandler);
    offers = []; accepted = []; drag = null;
  }
};

/* ---------------------------------------------------------------- mail */
function renderMail(){
  const list = $("#maillist");
  list.innerHTML = "";
  for(const j of offers){
    const c = CLIENTS[j.client], d = P[j.product];
    const row = el("div", "mail",
      '<div class="mfrom">' + c.short + '</div>' +
      '<div class="mline">' + j.line + '</div>' +
      '<div class="mspec">' + d.nom.toFixed(d.dec) +
        ' <span>&plusmn;</span> ' + j.L.toFixed(d.dec) + ' <em>' + d.unit + '</em></div>' +
      '<div class="mqty">' + j.count + ' units</div>' +
      '<div class="mrate">$' + j.rate + ' / unit</div>');
    row.dataset.id = j.id;
    row.addEventListener("pointerdown", e => grabMail(j, row, e));
    list.appendChild(row);
  }
  $("#mailCount").textContent = offers.length ? offers.length + " new" : "empty";
}

function grabMail(job, row, e){
  if(drag) return;
  e.preventDefault();
  const s = toStage(e);
  const card = makeOrderCard(job);
  card.style.transform = "translate(" + (s.x - 100) + "px," + (s.y - 40) + "px)";
  $("#dragLayer").appendChild(card);
  drag = { job, row, card, dx:100, dy:40 };
  row.classList.add("taken");
  click();
}

function makeOrderCard(j){
  const c = CLIENTS[j.client], d = P[j.product];
  return el("div", "order",
    '<div class="ohead">' + c.short + '</div>' +
    '<div class="oprod">' + d.tile + '</div>' +
    '<div class="ospec">' + d.nom.toFixed(d.dec) + ' &plusmn; ' + j.L.toFixed(d.dec) + ' ' + d.unit + '</div>' +
    '<div class="ofoot"><span>' + j.count + ' units</span><span>$' + j.rate + '</span></div>' +
    '<div class="ohole"></div>');
}

function bind(){
  moveHandler = e => {
    if(!drag) return;
    const s = toStage(e);
    drag.card.style.transform = "translate(" + (s.x - drag.dx) + "px," + (s.y - drag.dy) + "px)";
    $("#intray").classList.toggle("hot", inRect(INTRAY, s));
    $("#shredder").classList.toggle("hot", inRect(SHRED, s));
  };
  upHandler = e => {
    if(!drag) return;
    const s = toStage(e);
    const { job, row, card } = drag;
    drag = null;
    $("#intray").classList.remove("hot");
    $("#shredder").classList.remove("hot");

    if(inRect(INTRAY, s)){
      accepted.push(job);
      offers = offers.filter(o => o.id !== job.id);
      card.remove(); row.remove();
      renderTray(); renderCount();
      thunk();
    } else if(inRect(SHRED, s)){
      offers = offers.filter(o => o.id !== job.id);
      card.classList.add("shredded");
      row.remove();
      renderCount();
      buzz();
      setTimeout(() => card.remove(), 420);
    } else {
      card.classList.add("dropped");
      row.classList.remove("taken");
      setTimeout(() => card.remove(), 260);
    }
  };
  window.addEventListener("pointermove", moveHandler);
  window.addEventListener("pointerup", upHandler);
  $("#punch").addEventListener("pointerdown", punchIn);
}

function renderCount(){
  $("#mailCount").textContent = offers.length ? offers.length + " new" : "empty";
}

/* ---------------------------------------------------------------- tray */
function renderTray(){
  const stack = $("#trayStack");
  stack.innerHTML = "";
  accepted.forEach((j, i) => {
    const card = makeOrderCard(j);
    card.classList.add("stacked");
    card.style.transform = "translate(" + (i*16) + "px," + (i*-9) + "px) rotate(" + ((i%2?1:-1)*1.4) + "deg)";
    card.addEventListener("pointerdown", e => unaccept(j, e));
    stack.appendChild(card);
  });

  const units = accepted.reduce((n, j) => n + j.count, 0);
  const info = $("#trayInfo");
  if(!units){
    info.innerHTML = '<span class="dim">tray empty</span>';
  } else {
    const per = Math.max(0.7, SHIFT_SECS/units);
    info.innerHTML = '<b>' + units + '</b> units <span class="dim">/</span> one every <b>' +
                     per.toFixed(1) + 's</b>';
  }
  $("#punch").classList.toggle("off", accepted.length === 0);
}

/* pull a work order back out of the tray if you change your mind */
function unaccept(job, e){
  e.preventDefault();
  e.stopPropagation();
  accepted = accepted.filter(j => j.id !== job.id);
  offers.push(job);
  renderMail();
  renderTray();
  click();
}

/* ---------------------------------------------------------------- punch in */
function punchIn(e){
  e.preventDefault();
  if(!accepted.length) return;
  thunk();
  $("#clock").classList.add("punched");
  const jobs = accepted.slice();
  setTimeout(() => onStart(jobs), 320);
}
