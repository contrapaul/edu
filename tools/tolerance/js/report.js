/* End of shift. The report is where the truth you did not have during the
   shift gets shown: every unit at its real deviation against the band. */

import { $, el, money, signed } from "./util.js";
import { PRODUCTS as P, CLIENTS, overhead } from "./data.js";
import { G, save, resetCareer } from "./state.js";

let onNext = null;

export const report = {
  mount(root, arg){
    const r = arg.result;
    onNext = arg.onNext;

    const escapes = r.perJob.reduce((n, s) => n + s.escapes, 0);
    const gross = r.dayMoney;
    const over = r.failure ? 0 : overhead(r.day);
    const net = gross - over;

    if(!r.failure){
      G.bal -= over;
      G.totalParts += r.parts.length;
      G.totalEscapes += escapes;
      G.cleanShifts = escapes === 0 ? G.cleanShifts + 1 : 0;
      if(G.bal > G.best) G.best = G.bal;
      G.day += 1;
      if(G.day > G.bestDay) G.bestDay = G.day;
      save();
    }

    const bankrupt = r.failure === "BANKRUPT" || G.bal < 0;
    const lost = r.failure === "CONTRACT LOST";
    const over_ = bankrupt || lost;

    root.innerHTML = `
      <div class="wall"></div><div class="desk"></div><div class="deskedge"></div>
      <div id="paper">
        <div id="phead">
          <div class="ptitle">${over_ ? (bankrupt ? "TERMINATION NOTICE" : "CONTRACT CANCELLED") : "SHIFT REPORT"}</div>
          <div class="pmeta">General Purpose Production Inc. <span>/</span> day ${r.day}</div>
        </div>
        <canvas id="pchart"></canvas>
        <div class="plegend">
          <span><i style="background:#4caf6a"></i>shipped in spec</span>
          <span><i style="background:#d9534f"></i>shipped out of spec</span>
          <span><i style="background:#8b95a3"></i>scrapped in spec</span>
          <span><i style="background:#5d6673"></i>scrapped out of spec</span>
        </div>
        <table id="ptable"><tbody></tbody></table>
        <div id="ptotals"></div>
        <div id="pactions"></div>
      </div>`;

    drawTruth($("#pchart"), r);

    const tb = $("#ptable tbody");
    for(const s of r.perJob){
      const d = P[s.job.product];
      tb.appendChild(el("tr", s.escapes ? "bad" : "",
        '<td class="c"><i>' + s.job.lot + '</i>' + CLIENTS[s.job.client].short + '</td>' +
        '<td class="p">' + d.tile + '</td>' +
        '<td class="n">' + s.shipped + ' shipped</td>' +
        '<td class="n">' + s.scrapped + ' scrapped</td>' +
        '<td class="n e">' + (s.escapes ? s.escapes + ' escaped' : 'clean') + '</td>' +
        '<td class="m">' + signed(s.pay) + '</td>'));
    }

    $("#ptotals").innerHTML =
      '<div><span>units</span><b>' + r.parts.length + '</b></div>' +
      '<div><span>gross</span><b>' + signed(gross) + '</b></div>' +
      (over ? '<div><span>overhead</span><b class="neg">' + money(-over) + '</b></div>' : '') +
      '<div class="big"><span>net</span><b class="' + (net >= 0 ? 'pos' : 'neg') + '">' +
        signed(net) + '</b></div>' +
      '<div class="big"><span>balance</span><b>' + money(G.bal) + '</b></div>';

    const act = $("#pactions");
    if(over_){
      if(bankrupt || lost) resetCareer();
      act.appendChild(el("div", "pnote",
        bankrupt ? "The account is empty. Your desk has been cleared."
                 : "Too many units reached the customer. The client has walked."));
      const b = el("button", "btn", "START OVER");
      b.onclick = () => onNext();
      act.appendChild(b);
    } else {
      const b = el("button", "btn", "DAY " + G.day);
      b.onclick = () => onNext();
      act.appendChild(b);
    }
  },

  unmount(){ onNext = null; }
};

function drawTruth(cv, r){
  const w = 700, h = 200, dpr = window.devicePixelRatio || 1;
  cv.width = w*dpr; cv.height = h*dpr;
  cv.style.width = w + "px"; cv.style.height = h + "px";
  const g = cv.getContext("2d");
  g.setTransform(dpr,0,0,dpr,0,0);
  g.fillStyle = "#1a1d22"; g.fillRect(0,0,w,h);

  const parts = r.parts;
  const nds = parts.map(p => p.dev/p.L);
  const span = Math.max(2.6, Math.max.apply(null, nds.map(Math.abs).concat([0]))*1.15);
  const y = nd => h/2 - (nd/span)*(h/2 - 12);

  g.fillStyle = "rgba(76,175,106,.12)"; g.fillRect(0, y(1), w, y(-1) - y(1));
  g.strokeStyle = "#4a5563"; g.setLineDash([4,4]);
  [1,-1].forEach(v => { g.beginPath(); g.moveTo(0, y(v)); g.lineTo(w, y(v)); g.stroke(); });
  g.setLineDash([]);
  g.strokeStyle = "#333a44"; g.beginPath(); g.moveTo(0, y(0)); g.lineTo(w, y(0)); g.stroke();

  const n = parts.length;
  parts.forEach((p, i) => {
    const x = 14 + i*((w - 28)/Math.max(1, n - 1));
    const ins = Math.abs(p.dev) <= p.L;
    g.fillStyle = p.disp === "ship" ? (ins ? "#4caf6a" : "#d9534f") : (ins ? "#8b95a3" : "#5d6673");
    g.beginPath(); g.arc(x, Math.max(4, Math.min(h-4, y(p.dev/p.L))), 4.5, 0, 7); g.fill();
  });
}
