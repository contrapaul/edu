/* ═══════════════════════════════════════════════════════════════════
   DIAGRAMS: inline SVG, drawn here rather than sourced.
   Each entry returns an SVG string. Colours come from CSS custom
   properties that the detail window already sets, so a diagram picks
   up its family accent automatically.
   Add one by adding a key here, then naming that key in data.js.
   ═══════════════════════════════════════════════════════════════════ */

const DG_STYLE = `
  .dg-bg    { fill: var(--dg-f1,rgba(255,255,255,0.03)); }
  .dg-line  { stroke: var(--ink-dim, #71778c); stroke-width: 1.5; fill: none; }
  .dg-grid  { stroke: var(--line, #343846); stroke-width: 1; fill: none; }
  .dg-acc   { stroke: var(--fam-color, #FFE536); stroke-width: 2; fill: none; }
  .dg-accf  { fill: var(--fam-color, #FFE536); }
  .dg-alt   { stroke: var(--dg-alt,#FA16C2); stroke-width: 2; fill: none; }
  .dg-altf  { fill: var(--dg-alt,#FA16C2); }
  .dg-dim   { fill: var(--ink-dim, #71778c); }
  .dg-solid { fill: var(--ink-soft, #a3a9bb); }
  .dg-t     { fill: var(--ink, #eef0f6); font-family: 'Lexend', Arial, sans-serif; font-size: 13px; }
  .dg-s     { fill: var(--ink-soft, #a3a9bb); font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.08em; }
  .dg-k     { fill: var(--ink-dim, #71778c); font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; }
  .dg-on    { fill: var(--dg-on-ink, #16171d); font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; }
`;

/* The same diagram is drawn twice on a page, once small on the card and
   once full size in the detail window, so marker ids are made unique
   per call to keep the document valid. */
let dgSeq = 0;

function dgWrap(vb, body) {
  const uid = "u" + (++dgSeq);
  const unique = body.replace(/dgar\d*/g, (m) => m + uid);
  return `<svg viewBox="${vb}" role="img" xmlns="http://www.w3.org/2000/svg"><style>${DG_STYLE}</style>${unique}</svg>`;
}

const DIAGRAMS = {

  /* ── One player moves everything, versus swapping one at a time ── */
  "turn-alternating": () => {
    let s = `<text class="dg-k" x="0" y="12">The slow way: whole turns</text>`;
    // whole-turn bar
    s += `<rect class="dg-accf" x="0" y="22" width="150" height="26" rx="5"/>`;
    s += `<text class="dg-on" x="14" y="39">PLAYER 1 MOVES ALL</text>`;
    s += `<rect x="156" y="22" width="150" height="26" rx="5" style="fill:var(--dg-alt,#FA16C2)"/>`;
    s += `<text class="dg-on" x="170" y="39">PLAYER 2 MOVES ALL</text>`;
    s += `<text class="dg-s" x="316" y="39">waiting</text>`;

    s += `<text class="dg-k" x="0" y="86">You go, I go: one piece each</text>`;
    for (let i = 0; i < 6; i++) {
      const x = i * 51;
      const p1 = i % 2 === 0;
      s += `<rect x="${x}" y="96" width="45" height="26" rx="5" style="fill:${p1 ? 'var(--fam-color,#FFE536)' : 'var(--dg-alt,#FA16C2)'}"/>`;
      s += `<text class="dg-on" x="${x + 13}" y="113">${p1 ? 'P1' : 'P2'}</text>`;
      if (i < 5) s += `<path class="dg-line" d="M${x + 45} 109 L${x + 51} 109"/>`;
    }
    s += `<text class="dg-s" x="316" y="113">round ends</text>`;
    s += `<text class="dg-t" x="0" y="152">Nobody waits long. Both players stay focused.</text>`;
    return dgWrap("0 0 400 165", s);
  },

  /* ── Secret choices, one reveal ── */
  "turn-simultaneous": () => {
    let s = `<text class="dg-k" x="0" y="12">Step 1: everyone chooses in secret</text>`;
    for (let i = 0; i < 4; i++) {
      const x = 8 + i * 96;
      s += `<rect class="dg-grid" x="${x}" y="24" width="60" height="44" rx="5" style="fill:var(--dg-f1,rgba(255,255,255,0.03))"/>`;
      s += `<text class="dg-s" x="${x + 30}" y="51" text-anchor="middle">?</text>`;
      s += `<text class="dg-k" x="${x + 30}" y="82" text-anchor="middle">P${i + 1}</text>`;
      s += `<path class="dg-acc" d="M${x + 30} 92 L${x + 30} 108" marker-end="url(#dgar)"/>`;
    }
    s += `<defs><marker id="dgar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="dg-accf"/></marker></defs>`;
    s += `<text class="dg-k" x="0" y="132">Step 2: all revealed at the same moment</text>`;
    const faces = ["MOVE", "FIRE", "MOVE", "WAIT"];
    for (let i = 0; i < 4; i++) {
      const x = 8 + i * 96;
      s += `<rect class="dg-accf" x="${x}" y="142" width="60" height="44" rx="5"/>`;
      s += `<text class="dg-on" x="${x + 30}" y="169" text-anchor="middle">${faces[i]}</text>`;
    }
    s += `<text class="dg-t" x="0" y="212">Players must guess what everyone else picked.</text>`;
    return dgWrap("0 0 400 225", s);
  },

  /* ── A budget of four, and a price list ── */
  "turn-action-points": () => {
    let s = `<text class="dg-k" x="0" y="12">Your budget this turn</text>`;
    for (let i = 0; i < 4; i++) {
      s += `<circle class="dg-accf" cx="${14 + i * 34}" cy="36" r="12"/>`;
    }
    s += `<text class="dg-s" x="152" y="41">4 points</text>`;
    s += `<text class="dg-k" x="0" y="82">Price list</text>`;
    const rows = [["Move one space", 1], ["Attack", 2], ["Heal a friend", 2], ["Build", 3]];
    rows.forEach(([label, cost], i) => {
      const y = 96 + i * 28;
      s += `<rect class="dg-grid" x="0" y="${y}" width="270" height="22" rx="4"/>`;
      s += `<text class="dg-t" x="10" y="${y + 16}" style="font-size:12px">${label}</text>`;
      for (let c = 0; c < cost; c++) s += `<circle class="dg-accf" cx="${224 + c * 14}" cy="${y + 11}" r="5"/>`;
    });
    s += `<text class="dg-t" x="0" y="226">Spend them in any order. Leftovers are lost.</text>`;
    return dgWrap("0 0 400 240", s);
  },

  /* ── Three chess pieces, three shapes ── */
  "move-patterns": () => {
    const cell = 22, n = 5;
    const board = (ox, label, marks) => {
      let g = `<text class="dg-k" x="${ox}" y="12">${label}</text>`;
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        const dark = (r + c) % 2 === 1;
        g += `<rect x="${ox + c * cell}" y="${22 + r * cell}" width="${cell}" height="${cell}" style="fill:${dark ? 'var(--dg-f2,rgba(255,255,255,0.06))' : 'var(--dg-f1,rgba(255,255,255,0.03))'}" class="dg-grid"/>`;
      }
      marks.forEach(([c, r]) => {
        g += `<circle class="dg-accf" cx="${ox + c * cell + cell / 2}" cy="${22 + r * cell + cell / 2}" r="5"/>`;
      });
      // the piece itself, always centre
      g += `<rect class="dg-altf" x="${ox + 2 * cell + 4}" y="${22 + 2 * cell + 4}" width="${cell - 8}" height="${cell - 8}" rx="3"/>`;
      return g;
    };
    let s = "";
    s += board(0, "Rook", [[0,2],[1,2],[3,2],[4,2],[2,0],[2,1],[2,3],[2,4]]);
    s += board(140, "Bishop", [[0,0],[1,1],[3,3],[4,4],[0,4],[1,3],[3,1],[4,0]]);
    s += board(280, "Knight", [[1,0],[3,0],[0,1],[4,1],[0,3],[4,3],[1,4],[3,4]]);
    s += `<text class="dg-t" x="0" y="158">One pattern per piece.</text>`;
    return dgWrap("0 0 400 172", s);
  },

  /* ── Why diagonal movement is a problem, and how hexes fix it ── */
  "move-grid-hex": () => {
    let s = `<text class="dg-k" x="0" y="12">Square grid: 8 neighbours, 2 different distances</text>`;
    const cell = 30;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const mid = r === 1 && c === 1;
      const diag = (r + c) % 2 === 0 && !mid;
      s += `<rect class="dg-grid" x="${20 + c * cell}" y="${24 + r * cell}" width="${cell}" height="${cell}" style="fill:${mid ? 'var(--fam-color,#FFE536)' : diag ? 'var(--dg-alt-soft,rgba(250,22,194,0.22))' : 'var(--dg-f2,rgba(255,255,255,0.06))'}"/>`;
      if (!mid) s += `<text class="dg-s" x="${20 + c * cell + cell / 2}" y="${24 + r * cell + 19}" text-anchor="middle">${diag ? '1.4' : '1.0'}</text>`;
    }
    s += `<text class="dg-s" x="120" y="60">the corner steps</text>`;
    s += `<text class="dg-s" x="120" y="76">travel further</text>`;
    s += `<text class="dg-s" x="120" y="92">for the same cost</text>`;

    s += `<text class="dg-k" x="0" y="146">Hex grid: 6 neighbours, all the same distance</text>`;
    const hex = (cx, cy, r, fill) => {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 180 * (60 * i - 30);
        pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
      }
      return `<polygon class="dg-grid" points="${pts.join(' ')}" style="fill:${fill}"/>`;
    };
    const R = 22, W = R * Math.sqrt(3);
    const cx = 68, cy = 214;
    s += hex(cx, cy, R, "var(--fam-color,#FFE536)");
    const dirs = [[W, 0], [-W, 0], [W / 2, R * 1.5], [-W / 2, R * 1.5], [W / 2, -R * 1.5], [-W / 2, -R * 1.5]];
    dirs.forEach(([dx, dy]) => {
      s += hex(cx + dx, cy + dy, R, "var(--dg-f2,rgba(255,255,255,0.06))");
      s += `<text class="dg-s" x="${cx + dx}" y="${cy + dy + 4}" text-anchor="middle">1.0</text>`;
    });
    s += `<text class="dg-t" x="168" y="200">Every direction costs the same.</text>`;
    s += `<text class="dg-t" x="168" y="222">No player gains ground by</text>`;
    s += `<text class="dg-t" x="168" y="244">moving diagonally.</text>`;
    return dgWrap("0 0 400 282", s);
  },

  /* ── Wall blocks one shot, not the other ── */
  "move-line-of-sight": () => {
    let s = `<rect class="dg-bg" x="0" y="0" width="400" height="200" rx="6"/>`;
    // shooter
    s += `<circle class="dg-accf" cx="40" cy="100" r="13"/>`;
    s += `<text class="dg-k" x="18" y="134">SHOOTER</text>`;
    // wall
    s += `<rect x="180" y="30" width="18" height="80" rx="3" style="fill:var(--ink-dim,#71778c)"/>`;
    s += `<text class="dg-k" x="166" y="124">WALL</text>`;
    // clear target
    s += `<circle class="dg-solid" cx="350" cy="160" r="13"/>`;
    s += `<path class="dg-acc" d="M52 106 L337 155" stroke-dasharray="0"/>`;
    s += `<text class="dg-s" x="228" y="186" style="fill:var(--fam-color,#FFE536)">clear shot</text>`;
    // blocked target
    s += `<circle class="dg-solid" cx="350" cy="60" r="13"/>`;
    s += `<path class="dg-alt" d="M52 94 L337 64" stroke-dasharray="5 4"/>`;
    s += `<path class="dg-alt" d="M182 78 L196 66 M182 66 L196 78" stroke-width="2.6"/>`;
    s += `<text class="dg-s" x="228" y="40" style="fill:var(--dg-alt,#FA16C2)">blocked</text>`;
    s += `<text class="dg-t" x="0" y="222">Hold a piece of string between two models to check.</text>`;
    return dgWrap("0 0 400 235", s);
  },

  /* ── Win rate before and after a small gift ── */
  "fair-first-player": () => {
    const bar = (y, label, first, second) => {
      let g = `<text class="dg-k" x="0" y="${y - 8}">${label}</text>`;
      const W = 300, x = 60;
      g += `<rect class="dg-accf" x="${x}" y="${y}" width="${W * first / 100}" height="24" rx="3"/>`;
      g += `<rect x="${x + W * first / 100}" y="${y}" width="${W * second / 100}" height="24" rx="3" style="fill:var(--dg-alt,#FA16C2)"/>`;
      g += `<text class="dg-on" x="${x + 10}" y="${y + 17}">${first}%</text>`;
      g += `<text class="dg-on" x="${x + W * first / 100 + 10}" y="${y + 17}">${second}%</text>`;
      return g;
    };
    let s = `<text class="dg-s" x="60" y="12">first player wins</text><text class="dg-s" x="270" y="12">second player</text>`;
    s += bar(38, "Before", 68, 32);
    s += bar(102, "After the coin", 51, 49);
    s += `<text class="dg-t" x="0" y="162">The gift is small. It closes the gap without flipping it.</text>`;
    s += `<text class="dg-t" x="0" y="184">You can only find the right size by counting real games.</text>`;
    return dgWrap("0 0 400 196", s);
  },

  /* ── Item strength by race position ── */
  "fair-rubber-band": () => {
    let s = `<text class="dg-k" x="0" y="12">What you find in the item box</text>`;
    const rows = [["1st", 1, "banana"], ["4th", 2, "green shell"], ["7th", 4, "star"], ["12th", 5, "bullet bill"]];
    rows.forEach(([pos, strength, item], i) => {
      const y = 30 + i * 40;
      s += `<text class="dg-s" x="0" y="${y + 17}">${pos}</text>`;
      for (let b = 0; b < 5; b++) {
        s += `<rect x="${44 + b * 26}" y="${y}" width="20" height="24" rx="3" style="fill:${b < strength ? 'var(--fam-color,#FFE536)' : 'var(--dg-f2,rgba(255,255,255,0.06))'}"/>`;
      }
      s += `<text class="dg-t" x="186" y="${y + 17}" style="font-size:12px">${item}</text>`;
    });
    s += `<path class="dg-alt" d="M330 34 L330 178" marker-end="url(#dgar2)"/>`;
    s += `<defs><marker id="dgar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="dg-altf"/></marker></defs>`;
    s += `<text class="dg-s" x="340" y="100" style="fill:var(--dg-alt,#FA16C2)">further</text>`;
    s += `<text class="dg-s" x="340" y="116" style="fill:var(--dg-alt,#FA16C2)">behind</text>`;
    s += `<text class="dg-t" x="0" y="212">The further back you are, the better your help.</text>`;
    return dgWrap("0 0 400 225", s);
  },

  /* ── Bids become seats ── */
  "fair-bidding": () => {
    let s = `<text class="dg-k" x="0" y="12">Secret bids</text>`;
    const bids = [["P1", 3], ["P2", 5], ["P3", 1], ["P4", 4]];
    bids.forEach(([p, n], i) => {
      const x = i * 100;
      s += `<rect class="dg-grid" x="${x}" y="22" width="82" height="46" rx="5" style="fill:var(--dg-f1,rgba(255,255,255,0.03))"/>`;
      s += `<text class="dg-k" x="${x + 41}" y="40" text-anchor="middle">${p}</text>`;
      const px = x + (82 - (n - 1) * 14) / 2;
      for (let c = 0; c < n; c++) s += `<circle class="dg-accf" cx="${px + c * 14}" cy="56" r="5"/>`;
    });
    s += `<path class="dg-line" d="M200 78 L200 100" marker-end="url(#dgar3)"/>`;
    s += `<defs><marker id="dgar3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="dg-dim"/></marker></defs>`;
    s += `<text class="dg-k" x="0" y="124">Turn order this round</text>`;
    const order = [["P2", 5], ["P4", 4], ["P1", 3], ["P3", 1]];
    order.forEach(([p, n], i) => {
      const x = i * 100;
      s += `<rect class="dg-accf" x="${x}" y="134" width="92" height="30" rx="5"/>`;
      s += `<text class="dg-on" x="${x + 46}" y="154" text-anchor="middle">${i + 1}. ${p} pays ${n}</text>`;
    });
    s += `<text class="dg-t" x="0" y="196">Players decide for themselves what going first is worth.</text>`;
    return dgWrap("0 0 400 210", s);
  },

  /* Dice decide the order, and the order changes every round */
  "turn-initiative": () => {
    const pips = (ox, oy, n) => {
      const P = { 1:[[1,1]], 2:[[0,0],[2,2]], 3:[[0,0],[1,1],[2,2]],
                  4:[[0,0],[2,0],[0,2],[2,2]], 5:[[0,0],[2,0],[1,1],[0,2],[2,2]],
                  6:[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2]] }[n];
      return P.map(([c, r]) => `<circle class="dg-accf" cx="${ox + 14 + c * 16}" cy="${oy + 14 + r * 16}" r="4.5"/>`).join("");
    };
    let s = `<text class="dg-k" x="0" y="12">Everyone rolls one die</text>`;
    const rolls = [["P1", 4], ["P2", 6], ["P3", 2], ["P4", 5]];
    rolls.forEach(([p, n], i) => {
      const x = i * 96;
      s += `<rect class="dg-grid" x="${x}" y="22" width="60" height="60" rx="10" style="fill:var(--dg-f2,rgba(255,255,255,0.06))"/>`;
      s += pips(x, 22, n);
      s += `<text class="dg-k" x="${x + 20}" y="96">${p}</text>`;
    });
    s += `<text class="dg-k" x="0" y="128">Highest goes first</text>`;
    [["P2", 6], ["P4", 5], ["P1", 4], ["P3", 2]].forEach(([p, n], i) => {
      const y = 138 + i * 24;
      s += `<rect class="dg-accf" x="0" y="${y}" width="${40 + n * 26}" height="17" rx="4"/>`;
      s += `<text class="dg-on" x="8" y="${y + 13}">${i + 1}. ${p}</text>`;
    });
    s += `<text class="dg-t" x="0" y="250">A player who was last can suddenly be first.</text>`;
    return dgWrap("0 0 400 262", s);
  },

  /* The order is not fixed to the seating */
  "turn-variable": () => {
    const seq = (y, order) => order.map((p, i) =>
      `<rect x="${i * 84}" y="${y}" width="72" height="26" rx="5" style="fill:${p === 1 ? 'var(--fam-color,#FFE536)' : p === 2 ? 'var(--dg-alt,#FA16C2)' : 'var(--dg-f4,rgba(255,255,255,0.14))'}"/>` +
      `<text class="dg-on" x="${i * 84 + 36}" y="${y + 18}" text-anchor="middle">P${p}</text>`).join("");
    let s = `<text class="dg-k" x="0" y="12">Round 1</text>` + seq(22, [1, 2, 3, 4]);
    s += `<text class="dg-k" x="0" y="76">Round 2</text>` + seq(86, [3, 1, 4, 2]);
    s += `<text class="dg-k" x="0" y="140">Round 3</text>` + seq(150, [4, 3, 2, 1]);
    s += `<text class="dg-t" x="0" y="204">Nobody keeps the good seat for the whole game.</text>`;
    return dgWrap("0 0 400 216", s);
  },

  /* No turns, one shared clock */
  "turn-realtime": () => {
    let s = `<text class="dg-k" x="0" y="12">One clock, everyone at once</text>`;
    s += `<rect class="dg-grid" x="0" y="22" width="400" height="18" rx="9"/>`;
    s += `<rect class="dg-accf" x="0" y="22" width="255" height="18" rx="9"/>`;
    s += `<text class="dg-s" x="264" y="36">time left</text>`;
    for (let p = 0; p < 4; p++) {
      const y = 58 + p * 34;
      s += `<text class="dg-k" x="0" y="${y + 16}">P${p + 1}</text>`;
      let x = 34;
      const widths = [[38, 22, 54, 30], [26, 46, 20, 40], [52, 28, 34, 24], [30, 36, 26, 50]][p];
      widths.forEach((w, i) => {
        s += `<rect x="${x}" y="${y}" width="${w}" height="22" rx="4" style="fill:${i % 2 ? 'var(--dg-f4,rgba(255,255,255,0.14))' : 'var(--fam-color,#FFE536)'}"/>`;
        x += w + 7;
      });
    }
    s += `<text class="dg-t" x="0" y="212">Nobody waits, and nobody gets a tidy turn either.</text>`;
    return dgWrap("0 0 400 225", s);
  },

  /* Pick the job, everyone uses it, you use it better */
  "turn-roles": () => {
    let s = `<text class="dg-k" x="0" y="12">Four roles on the table, you take one</text>`;
    const roles = [0, 1, 2, 3];
    roles.forEach((r, i) => {
      const x = i * 100, on = i === 1;
      s += `<rect x="${x}" y="22" width="82" height="54" rx="7" class="dg-grid" style="fill:${on ? 'var(--fam-color,#FFE536)' : 'var(--dg-f2,rgba(255,255,255,0.06))'}"/>`;
      for (let k = 0; k < 3; k++) {
        s += `<rect x="${x + 12}" y="${34 + k * 13}" width="${58 - k * 14}" height="6" rx="3" style="fill:${on ? 'var(--dg-knock,rgba(0,0,0,0.55))' : 'var(--dg-f5,rgba(255,255,255,0.21))'}"/>`;
      }
    });
    s += `<text class="dg-k" x="0" y="106">What the role gives</text>`;
    s += `<text class="dg-k" x="0" y="132">You</text>`;
    s += `<rect class="dg-accf" x="92" y="118" width="300" height="20" rx="4"/>`;
    s += `<text class="dg-on" x="102" y="132">the action, plus your bonus</text>`;
    s += `<text class="dg-k" x="0" y="164">Everyone else</text>`;
    s += `<rect x="92" y="150" width="150" height="20" rx="4" style="fill:var(--dg-f5,rgba(255,255,255,0.21))"/>`;
    s += `<text class="dg-s" x="250" y="164">the action only</text>`;
    s += `<text class="dg-t" x="0" y="204">The choice matters because your rivals ride along.</text>`;
    return dgWrap("0 0 400 216", s);
  },

  /* Lines between places, not open ground */
  "move-points": () => {
    const N = { a:[40,50], b:[140,28], c:[150,110], d:[250,60], e:[340,36], f:[330,124], g:[240,140] };
    const E = [["a","b"],["a","c"],["b","c"],["b","d"],["c","d"],["c","g"],["d","e"],["d","f"],["d","g"],["f","g"],["e","f"]];
    let s = `<text class="dg-k" x="0" y="12">Places joined by routes</text>`;
    E.forEach(([p, q]) => { s += `<path class="dg-line" d="M${N[p][0]} ${N[p][1] + 20} L${N[q][0]} ${N[q][1] + 20}"/>`; });
    Object.entries(N).forEach(([k, [x, y]], i) => {
      s += `<circle cx="${x}" cy="${y + 20}" r="13" style="fill:${i === 0 ? 'var(--fam-color,#FFE536)' : 'var(--dg-f4,rgba(255,255,255,0.14))'};stroke:var(--ink-dim,#71778c);stroke-width:1.5"/>`;
    });
    s += `<text class="dg-t" x="0" y="196">You can only go where a route already goes.</text>`;
    s += `<text class="dg-t" x="0" y="218">Distance stops being about centimetres.</text>`;
    return dgWrap("0 0 400 230", s);
  },

  /* A budget, and ground that eats it */
  "move-terrain": () => {
    const hex = (cx, cy, r, fill) => {
      const pts = [];
      for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 30); pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`); }
      return `<polygon class="dg-grid" points="${pts.join(' ')}" style="fill:${fill}"/>`;
    };
    let s = `<text class="dg-k" x="0" y="12">You have 4 movement points</text>`;
    for (let i = 0; i < 4; i++) s += `<circle class="dg-accf" cx="${14 + i * 30}" cy="34" r="10"/>`;
    const ground = [["grass", 1, "var(--dg-f2,rgba(255,255,255,0.06))"], ["hill", 2, "var(--dg-f4,rgba(255,255,255,0.14))"], ["forest", 2, "var(--dg-f4,rgba(255,255,255,0.14))"], ["swamp", 3, "var(--dg-f6,rgba(255,255,255,0.32))"]];
    ground.forEach(([label, cost, fill], i) => {
      const cx = 48 + i * 90, cy = 108;
      s += hex(cx, cy, 34, fill);
      for (let c = 0; c < cost; c++) s += `<circle class="dg-accf" cx="${cx - (cost - 1) * 8 + c * 16}" cy="${cy}" r="5.5"/>`;
      s += `<text class="dg-k" x="${cx - 18}" y="${cy + 56}">${label}</text>`;
    });
    s += `<text class="dg-t" x="0" y="196">Crossing the swamp costs your whole turn.</text>`;
    s += `<text class="dg-t" x="0" y="218">The map starts making decisions for you.</text>`;
    return dgWrap("0 0 400 230", s);
  },

  /* Your piece is a wall */
  "move-blocking": () => {
    const cell = 34;
    let s = `<text class="dg-k" x="0" y="12">Where your piece stands, nobody passes</text>`;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) {
      s += `<rect class="dg-grid" x="${c * cell}" y="${22 + r * cell}" width="${cell}" height="${cell}" style="fill:${(r + c) % 2 ? 'var(--dg-f2,rgba(255,255,255,0.06))' : 'var(--dg-f1,rgba(255,255,255,0.03))'}"/>`;
    }
    // blockers
    [[3, 1], [3, 2]].forEach(([c, r]) => {
      s += `<rect class="dg-accf" x="${c * cell + 6}" y="${22 + r * cell + 6}" width="${cell - 12}" height="${cell - 12}" rx="4"/>`;
      // the squares they lock down
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dc, dr]) => {
        const nc = c + dc, nr = r + dr;
        if (nc >= 0 && nc < 8 && nr >= 0 && nr < 4) s += `<rect x="${nc * cell + 2}" y="${22 + nr * cell + 2}" width="${cell - 4}" height="${cell - 4}" rx="3" style="fill:var(--dg-alt-soft,rgba(250,22,194,0.22))"/>`;
      });
    });
    s += `<path class="dg-alt" d="M20 ${22 + cell * 1.5} L${3 * cell - 4} ${22 + cell * 1.5}" stroke-dasharray="5 4"/>`;
    s += `<path class="dg-alt" d="M${3 * cell - 14} ${22 + cell * 1.5 - 8} L${3 * cell - 4} ${22 + cell * 1.5} L${3 * cell - 14} ${22 + cell * 1.5 + 8}" stroke-width="2.6"/>`;
    s += `<text class="dg-t" x="0" y="188">Two pieces can shut a whole lane, and standing still becomes a real move.</text>`;
    return dgWrap("0 0 400 222", s);
  },

  /* The board does not exist yet */
  "move-tiles": () => {
    let s = `<text class="dg-k" x="0" y="12">Turn 1</text>`;
    const T = 30;
    const draw = (ox, oy, cells, newOne) => cells.map(([c, r], i) =>
      `<rect x="${ox + c * T}" y="${oy + r * T}" width="${T - 3}" height="${T - 3}" rx="3" class="dg-grid" style="fill:${i === cells.length - 1 && newOne ? 'var(--fam-color,#FFE536)' : 'var(--dg-f4,rgba(255,255,255,0.14))'}"/>`).join("");
    s += draw(0, 22, [[1, 1]], false);
    s += `<text class="dg-k" x="130" y="12">Turn 4</text>`;
    s += draw(130, 22, [[1, 1], [2, 1], [1, 2], [0, 1]], true);
    s += `<text class="dg-k" x="270" y="12">Turn 9</text>`;
    s += draw(270, 22, [[1, 1], [2, 1], [1, 2], [0, 1], [2, 0], [0, 2], [2, 2], [1, 0], [3, 1]], true);
    s += `<text class="dg-t" x="0" y="164">Every game is played on a different map and players build the problem they have to solve.</text>`;
    return dgWrap("0 0 400 198", s);
  },


  /* Every face is as likely as every other */
  "chance-dice": () => {
    /* Pip layout for each face, in units of the die half-size. */
    const FACES = {
      1: [[0, 0]],
      2: [[-1, -1], [1, 1]],
      3: [[-1, -1], [0, 0], [1, 1]],
      4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
      5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
      6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]
    };
    const pips = (cx, cy, size, n, fill) => FACES[n].map(([dx, dy]) =>
      `<circle cx="${(cx + dx * size * 0.27).toFixed(1)}" cy="${(cy + dy * size * 0.27).toFixed(1)}" r="${(size * 0.088).toFixed(1)}" style="fill:${fill}"/>`
    ).join("");

    let s = `<text class="dg-k" x="0" y="12">One die, and the six equal shares of a roll</text>`;

    /* The die itself, so the diagram reads as dice at a glance. */
    const D = 84, dy = 24;
    s += `<rect x="1" y="${dy}" width="${D}" height="${D}" rx="15" class="dg-grid" style="fill:var(--dg-f3,rgba(255,255,255,0.09));stroke-width:2"/>`;
    s += pips(1 + D / 2, dy + D / 2, D, 4, "var(--fam-color,#FFE536)");

    /* One whole roll, cut into six equal parts, one face per part. */
    const x0 = 106, W = 288, seg = W / 6, H = seg, y0 = dy + (D - H) / 2;
    for (let i = 0; i < 6; i++) {
      s += `<rect x="${(x0 + i * seg).toFixed(1)}" y="${y0}" width="${seg.toFixed(1)}" height="${H}" style="fill:var(--fam-color,#FFE536)"/>`;
      s += pips(x0 + i * seg + seg / 2, y0 + H / 2, seg * 0.98, i + 1, "var(--dg-knock,rgba(0,0,0,0.55))");
      if (i > 0) s += `<path d="M${(x0 + i * seg).toFixed(1)} ${y0} L${(x0 + i * seg).toFixed(1)} ${y0 + H}" style="stroke:var(--ground,#16171d);stroke-width:2.5"/>`;
    }
    s += `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" rx="7" class="dg-grid" style="fill:none;stroke-width:2"/>`;

    /* The bracket says the six shares add up to one whole. */
    const by = y0 + H + 9;
    s += `<path class="dg-alt" d="M${x0} ${by + 7} L${x0} ${by} L${x0 + W} ${by} L${x0 + W} ${by + 7}"/>`;
    s += `<text class="dg-s" x="${x0 + 96}" y="${by + 24}">one whole roll</text>`;

    s += `<text class="dg-t" x="0" y="164">No face is favoured. A 1 is exactly as likely as a 6.</text>`;
    s += `<text class="dg-t" x="0" y="186">Good for wild swings. Bad for anything a player</text>`;
    s += `<text class="dg-t" x="0" y="208">needs to plan around.</text>`;
    return dgWrap("0 0 400 220", s);
  },

  /* Roll a handful, count the hits */
  "chance-pools": () => {
    let s = `<text class="dg-k" x="0" y="12">Roll 6 dice, count every 4 or higher</text>`;
    const results = [2, 5, 6, 3, 4, 1];
    results.forEach((n, i) => {
      const x = i * 66, hit = n >= 4;
      s += `<rect x="${x}" y="24" width="52" height="52" rx="9" class="dg-grid" style="fill:${hit ? 'var(--fam-color,#FFE536)' : 'var(--dg-f2,rgba(255,255,255,0.06))'}"/>`;
      const P = { 1:[[1,1]], 2:[[0,0],[2,2]], 3:[[0,0],[1,1],[2,2]], 4:[[0,0],[2,0],[0,2],[2,2]],
                  5:[[0,0],[2,0],[1,1],[0,2],[2,2]], 6:[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2]] }[n];
      P.forEach(([c, r]) => { s += `<circle cx="${x + 12 + c * 14}" cy="${36 + r * 14}" r="4" style="fill:${hit ? 'var(--dg-knock,rgba(0,0,0,0.55))' : 'var(--ink-soft,#a3a9bb)'}"/>`; });
    });
    s += `<text class="dg-k" x="0" y="108">3 hits</text>`;
    for (let i = 0; i < 3; i++) s += `<rect class="dg-accf" x="${70 + i * 40}" y="94" width="32" height="18" rx="4"/>`;
    s += `<text class="dg-t" x="0" y="146">More dice means a steadier result, not just a bigger one.</text>`;
    s += `<text class="dg-t" x="0" y="168">Six dice almost always give you two or three hits.</text>`;
    return dgWrap("0 0 400 180", s);
  },

  /* Flat versus a hill */
  "chance-curve": () => {
    let s = `<text class="dg-k" x="0" y="12">One die: flat</text>`;
    for (let i = 0; i < 6; i++) {
      s += `<rect class="dg-accf" x="${i * 28}" y="${28}" width="22" height="58" rx="3"/>`;
    }
    s += `<text class="dg-k" x="210" y="12">Two dice added: a hill</text>`;
    const counts = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
    counts.forEach((c, i) => {
      const h = c * 9.6;
      s += `<rect class="dg-accf" x="${210 + i * 17}" y="${86 - h}" width="13" height="${h}" rx="2"/>`;
    });
    s += `<text class="dg-t" x="0" y="118">With one die, any number is as likely as any other.</text>`;
    s += `<text class="dg-t" x="0" y="140">Add two dice together and the middle happens far more often.</text>`;
    s += `<text class="dg-t" x="0" y="162">A 7 is six times as likely as a 12. That is why Catan puts</text>`;
    s += `<text class="dg-t" x="0" y="184">its best land on the middle numbers.</text>`;
    return dgWrap("0 0 400 196", s);
  },

  /* Keep going or bank it */
  "chance-push": () => {
    let s = `<text class="dg-k" x="0" y="12">Each extra roll: more points, more risk</text>`;
    const rows = [[1, 10, 17], [2, 25, 33], [3, 45, 50], [4, 70, 67], [5, 100, 83]];
    rows.forEach(([roll, pts, risk], i) => {
      const y = 26 + i * 32;
      s += `<text class="dg-k" x="0" y="${y + 16}">roll ${roll}</text>`;
      s += `<rect class="dg-accf" x="56" y="${y}" width="${pts * 1.5}" height="10" rx="5"/>`;
      s += `<rect class="dg-alt" x="56" y="${y + 14}" width="${risk * 1.5}" height="10" rx="5" style="fill:var(--dg-alt,#FA16C2);stroke:none"/>`;
    });
    s += `<text class="dg-s" x="248" y="42">reward</text>`;
    s += `<text class="dg-s" x="248" y="56">risk</text>`;
    s += `<text class="dg-t" x="0" y="208">Stop and keep what you have, or roll once more.</text>`;
    s += `<text class="dg-t" x="0" y="230">The player decides where the line is, which is the whole game.</text>`;
    return dgWrap("0 0 400 242", s);
  },

  /* A second chance changes the odds a lot */
  "chance-reroll": () => {
    const bar = (y, label, pct) => {
      let g = `<text class="dg-k" x="0" y="${y + 15}">${label}</text>`;
      g += `<rect class="dg-grid" x="120" y="${y}" width="270" height="22" rx="4"/>`;
      g += `<rect class="dg-accf" x="120" y="${y}" width="${270 * pct / 100}" height="22" rx="4"/>`;
      g += `<text class="dg-on" x="128" y="${y + 16}">${pct}%</text>`;
      return g;
    };
    let s = `<text class="dg-k" x="0" y="12">Chance of rolling at least one 5 or 6</text>`;
    s += bar(26, "one roll", 33);
    s += bar(64, "with a reroll", 55);
    s += bar(102, "two rerolls", 70);
    s += `<text class="dg-t" x="0" y="156">A reroll does not feel powerful, but it nearly doubles your odds.</text>`;
    s += `<text class="dg-t" x="0" y="178">Price rerolls carefully. Players undervalue them.</text>`;
    return dgWrap("0 0 400 190", s);
  },

  /* A different board every time */
  "chance-setup": () => {
    const hex = (cx, cy, r, fill) => {
      const pts = [];
      for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 30); pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`); }
      return `<polygon class="dg-grid" points="${pts.join(' ')}" style="fill:${fill}"/>`;
    };
    const layout = (ox, pattern) => {
      const R = 20, W = R * Math.sqrt(3);
      let g = "";
      /* Centre plus its six true neighbours, so the cluster tessellates. */
      const spots = [[0, 0], [W, 0], [-W, 0], [W / 2, R * 1.5], [-W / 2, R * 1.5], [W / 2, -R * 1.5], [-W / 2, -R * 1.5]];
      spots.forEach(([dx, dy], i) => {
        g += hex(ox + 60 + dx, 74 + dy, R,
          pattern[i] ? 'var(--fam-color,#FFE536)' : 'var(--dg-f2,rgba(255,255,255,0.06))');
      });
      return g;
    };
    let s = `<text class="dg-k" x="0" y="12">Game 1</text>` + layout(0, [1,0,1,0,0,1,0]);
    s += `<text class="dg-k" x="140" y="12">Game 2</text>` + layout(140, [0,1,0,1,1,0,0]);
    s += `<text class="dg-k" x="276" y="12">Game 3</text>` + layout(276, [0,0,1,1,0,0,1]);
    s += `<text class="dg-t" x="0" y="152">The good land moves. Last game's plan does not fit.</text>`;
    s += `<text class="dg-t" x="0" y="174">One box, many different games.</text>`;
    return dgWrap("0 0 400 186", s);
  },

  /* Dice forget, decks remember */
  "chance-deck": () => {
    let s = `<text class="dg-k" x="0" y="12">A die: the odds never change</text>`;
    for (let i = 0; i < 5; i++) {
      s += `<rect class="dg-grid" x="${i * 46}" y="22" width="36" height="36" rx="7" style="fill:var(--dg-f2,rgba(255,255,255,0.06))"/>`;
      s += `<circle class="dg-accf" cx="${i * 46 + 18}" cy="40" r="6"/>`;
    }
    s += `<text class="dg-s" x="240" y="45">still 1 in 6, always</text>`;
    s += `<text class="dg-k" x="0" y="92">A deck: every card drawn changes what is left</text>`;
    for (let i = 0; i < 10; i++) {
      const drawn = i < 4;
      s += `<rect x="${i * 30}" y="102" width="24" height="34" rx="4" class="dg-grid" style="fill:${drawn ? 'var(--dg-f2,rgba(255,255,255,0.06))' : 'var(--fam-color,#FFE536)'}"/>`;
    }
    /* A bracket under the drawn cards, rather than a box around them, so
       nothing runs off the frame or overlaps the card that follows. */
    s += `<path class="dg-alt" d="M1 142 L1 148 L114 148 L114 142" stroke-dasharray="5 4"/>`;
    s += `<text class="dg-s" x="0" y="164">these four are already drawn</text>`;
    s += `<text class="dg-t" x="0" y="188">A deck has a memory. Players can count what is left.</text>`;
    s += `<text class="dg-t" x="0" y="210">That turns luck into something a careful player can work with.</text>`;
    return dgWrap("0 0 400 222", s);
  },


  /* Few cards, many jobs to cover */
  "cards-hand": () => {
    let s = `<text class="dg-k" x="0" y="12">Five cards, four jobs that need doing</text>`;
    for (let i = 0; i < 5; i++) {
      const x = i * 56;
      s += `<rect x="${x}" y="22" width="46" height="66" rx="5" class="dg-grid" style="fill:var(--fam-color,#FFE536)"/>`;
      for (let k = 0; k < 3; k++) s += `<rect x="${x + 8}" y="${34 + k * 12}" width="${30 - k * 8}" height="5" rx="2" style="fill:var(--dg-knock,rgba(0,0,0,0.55))"/>`;
    }
    const jobs = ["attack", "build", "defend", "score"];
    jobs.forEach((j, i) => {
      const y = 110 + i * 26;
      s += `<rect class="dg-grid" x="0" y="${y}" width="250" height="19" rx="4" style="fill:var(--dg-f1,rgba(255,255,255,0.03))"/>`;
      s += `<text class="dg-t" x="8" y="${y + 14}" style="font-size:12px">${j}</text>`;
      if (i < 2) s += `<rect class="dg-accf" x="255" y="${y}" width="40" height="19" rx="4"/>`;
      else s += `<rect class="dg-alt" x="255" y="${y}" width="40" height="19" rx="4" style="fill:none" stroke-dasharray="4 3"/>`;
    });
    s += `<text class="dg-t" x="0" y="242">You cannot cover it all. Choosing what to drop is the game.</text>`;
    return dgWrap("0 0 400 254", s);
  },

  /* The deck you build is the deck you draw from */
  "cards-deckbuild": () => {
    const row = (y, label, cards) => {
      let g = `<text class="dg-k" x="0" y="${y + 22}">${label}</text>`;
      cards.forEach((strong, i) => {
        g += `<rect x="${70 + i * 26}" y="${y}" width="20" height="30" rx="3" class="dg-grid" style="fill:${strong ? 'var(--fam-color,#FFE536)' : 'var(--dg-f3,rgba(255,255,255,0.09))'}"/>`;
      });
      return g;
    };
    let s = `<text class="dg-k" x="0" y="12">Start: ten weak cards</text>`;
    s += row(22, "turn 1", [0,0,0,0,0,0,0,0,0,0]);
    s += row(70, "turn 6", [1,0,0,1,0,0,0,1,0,0,0,0]);
    s += row(118, "turn 12", [1,1,0,1,1,0,1,0,1,1,0,1]);
    s += `<text class="dg-t" x="0" y="182">Each card you buy goes into your own deck.</text>`;
    s += `<text class="dg-t" x="0" y="204">Buying a bad card is worse than buying nothing, because it</text>`;
    s += `<text class="dg-t" x="0" y="226">will keep coming back into your hand all game.</text>`;
    return dgWrap("0 0 400 238", s);
  },

  /* Take one, pass the rest */
  "cards-draft": () => {
    let s = `<text class="dg-k" x="0" y="12">Everyone takes one card, then passes the pack left</text>`;
    const packs = [[5, 1], [4, 2], [3, 0]];
    packs.forEach(([n, taken], p) => {
      const y = 24 + p * 62;
      s += `<text class="dg-k" x="0" y="${y + 28}">pass ${p + 1}</text>`;
      for (let i = 0; i < n; i++) {
        const x = 62 + i * 40;
        s += `<rect x="${x}" y="${y}" width="32" height="44" rx="4" class="dg-grid" style="fill:${i === taken ? 'var(--fam-color,#FFE536)' : 'var(--dg-f3,rgba(255,255,255,0.09))'}"/>`;
      }
      s += `<path class="dg-line" d="M${62 + n * 40 + 6} ${y + 22} L${62 + n * 40 + 30} ${y + 22}"/>`;
      s += `<path class="dg-line" d="M${62 + n * 40 + 22} ${y + 15} L${62 + n * 40 + 30} ${y + 22} L${62 + n * 40 + 22} ${y + 29}"/>`;
    });
    s += `<text class="dg-t" x="0" y="222">What you pass on is as important as what you keep.</text>`;
    return dgWrap("0 0 400 234", s);
  },

  /* Draw, discard, reshuffle, repeat */
  "cards-cycle": () => {
    let s = "";
    const box = (x, y, w, label, fill, onFill) =>
      `<rect x="${x}" y="${y}" width="${w}" height="42" rx="7" class="dg-grid" style="fill:${fill}"/>` +
      `<text class="dg-t" x="${x + w / 2}" y="${y + 26}" text-anchor="middle" ` +
      `style="font-size:12px${onFill ? ';fill:var(--dg-on-ink,#16171d)' : ''}">${label}</text>`;
    s += box(0, 30, 92, "deck", "var(--fam-color,#FFE536)", true);
    s += box(150, 30, 92, "hand", "var(--dg-f3,rgba(255,255,255,0.09))");
    s += box(300, 30, 92, "discard", "var(--dg-f3,rgba(255,255,255,0.09))");
    s += `<path class="dg-acc" d="M96 51 L144 51" marker-end="url(#dgar)"/>`;
    s += `<path class="dg-acc" d="M246 51 L294 51" marker-end="url(#dgar)"/>`;
    s += `<path class="dg-acc" d="M346 78 L346 106 L46 106 L46 78" marker-end="url(#dgar)"/>`;
    s += `<defs><marker id="dgar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="dg-accf"/></marker></defs>`;
    s += `<text class="dg-s" x="140" y="124">shuffle when the deck runs out</text>`;
    s += `<text class="dg-t" x="0" y="164">Every card you own comes back around eventually.</text>`;
    s += `<text class="dg-t" x="0" y="186">How fast it comes back is a number you control.</text>`;
    return dgWrap("0 0 400 198", s);
  },

  /* Sets are worth more than their parts */
  "cards-sets": () => {
    let s = `<text class="dg-k" x="0" y="12">Three of a kind beats three loose cards</text>`;
    const set = (ox, kinds, label, score) => {
      let g = "";
      kinds.forEach((k, i) => {
        g += `<rect x="${ox + i * 34}" y="24" width="28" height="40" rx="4" class="dg-grid" style="fill:${k ? 'var(--fam-color,#FFE536)' : 'var(--dg-f3,rgba(255,255,255,0.09))'}"/>`;
      });
      g += `<text class="dg-k" x="${ox}" y="82">${label}</text>`;
      g += `<rect class="dg-accf" x="${ox}" y="90" width="${score * 8}" height="16" rx="4"/>`;
      return g;
    };
    s += set(0, [1, 1, 1], "matching", 12);
    s += set(150, [1, 0, 1], "two only", 5);
    s += set(300, [1, 0, 0], "one", 1);
    s += `<text class="dg-t" x="0" y="146">The reward grows faster than the number of cards.</text>`;
    s += `<text class="dg-t" x="0" y="168">That is what makes players chase a set instead of taking</text>`;
    s += `<text class="dg-t" x="0" y="190">whatever is easiest.</text>`;
    return dgWrap("0 0 400 202", s);
  },

  /* Everyone plays one, highest of the led suit takes it */
  "cards-trick": () => {
    let s = `<text class="dg-k" x="0" y="12">Everyone plays one card</text>`;
    const played = [["P1", 7, true, false], ["P2", 9, true, true], ["P3", 3, true, false], ["P4", 11, false, false]];
    played.forEach(([p, v, follows, wins], i) => {
      const x = i * 100;
      s += `<rect x="${x}" y="24" width="70" height="94" rx="6" class="dg-grid" style="fill:${wins ? 'var(--fam-color,#FFE536)' : follows ? 'var(--dg-f4,rgba(255,255,255,0.14))' : 'var(--dg-f1,rgba(255,255,255,0.03))'}"/>`;
      for (let k = 0; k < Math.min(v, 5); k++) {
        s += `<circle cx="${x + 19 + (k % 3) * 16}" cy="${44 + Math.floor(k / 3) * 18}" r="5" style="fill:${wins ? 'var(--dg-knock,rgba(0,0,0,0.55))' : 'var(--ink-soft,#a3a9bb)'}"/>`;
      }
      s += `<text class="dg-k" x="${x + 4}" y="${134}">${p}${follows ? "" : " off suit"}</text>`;
    });
    s += `<text class="dg-t" x="0" y="172">The first card sets the suit. Everyone must follow it if they can.</text>`;
    s += `<text class="dg-t" x="0" y="194">P4 could not follow, so their 11 is worthless. P2 wins with a 9.</text>`;
    return dgWrap("0 0 400 206", s);
  },

  /* One card, three different jobs */
  "cards-multiuse": () => {
    let s = `<text class="dg-k" x="0" y="12">The same card, three ways to spend it</text>`;
    s += `<rect x="0" y="24" width="90" height="126" rx="8" class="dg-grid" style="fill:var(--fam-color,#FFE536)"/>`;
    for (let k = 0; k < 4; k++) s += `<rect x="14" y="${42 + k * 22}" width="${62 - k * 12}" height="8" rx="4" style="fill:var(--dg-knock,rgba(0,0,0,0.55))"/>`;
    const uses = ["play its action", "spend as money", "discard for speed"];
    uses.forEach((u, i) => {
      const y = 30 + i * 44;
      s += `<path class="dg-line" d="M96 87 L136 ${y + 16}"/>`;
      s += `<rect class="dg-grid" x="142" y="${y}" width="250" height="32" rx="6" style="fill:var(--dg-f2,rgba(255,255,255,0.06))"/>`;
      s += `<text class="dg-t" x="154" y="${y + 21}" style="font-size:12px">${u}</text>`;
    });
    s += `<text class="dg-t" x="0" y="186">Fewer cards to print, more decisions to make.</text>`;
    s += `<text class="dg-t" x="0" y="208">Every use you choose is two uses you gave up.</text>`;
    return dgWrap("0 0 400 220", s);
  },


  /* Land pays out when its number comes up */
  "econ-gather": () => {
    const hex = (cx, cy, r, fill) => {
      const pts = [];
      for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 30); pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`); }
      return `<polygon class="dg-grid" points="${pts.join(' ')}" style="fill:${fill}"/>`;
    };
    let s = `<text class="dg-k" x="0" y="12">The dice show 8, so every 8 tile pays</text>`;
    const tiles = [[52, 60, 8, 1], [140, 60, 5, 0], [228, 60, 8, 1], [316, 60, 11, 0],
                   [96, 128, 3, 0], [184, 128, 8, 1], [272, 128, 6, 0]];
    tiles.forEach(([x, y, n, pays]) => {
      s += hex(x, y, 40, pays ? 'var(--fam-color,#FFE536)' : 'var(--dg-f2,rgba(255,255,255,0.06))');
      for (let k = 0; k < (pays ? 2 : 0); k++) s += `<circle cx="${x - 10 + k * 20}" cy="${y}" r="7" style="fill:var(--dg-knock,rgba(0,0,0,0.55))"/>`;
    });
    s += `<text class="dg-t" x="0" y="196">You do not choose when income arrives. The dice do.</text>`;
    s += `<text class="dg-t" x="0" y="218">You only choose where to stand before the rolling starts.</text>`;
    return dgWrap("0 0 400 230", s);
  },

  /* Take the space and nobody else can */
  "econ-workers": () => {
    let s = `<text class="dg-k" x="0" y="12">Six jobs, and only one worker fits each</text>`;
    const taken = [1, 0, 2, 0, 1, 0];
    taken.forEach((who, i) => {
      const x = (i % 3) * 136, y = 22 + Math.floor(i / 3) * 74;
      s += `<rect class="dg-grid" x="${x}" y="${y}" width="118" height="58" rx="8" style="fill:${who ? 'var(--dg-f1,rgba(255,255,255,0.03))' : 'var(--dg-f3,rgba(255,255,255,0.09))'}"/>`;
      for (let k = 0; k < 3; k++) s += `<rect x="${x + 14}" y="${y + 12 + k * 12}" width="${74 - k * 18}" height="6" rx="3" style="fill:var(--dg-f5,rgba(255,255,255,0.21))"/>`;
      if (who) {
        s += `<circle cx="${x + 96}" cy="${y + 29}" r="13" style="fill:${who === 1 ? 'var(--fam-color,#FFE536)' : 'var(--dg-alt,#FA16C2)'}"/>`;
      }
    });
    s += `<text class="dg-t" x="0" y="192">Three jobs are already taken and cannot be used again.</text>`;
    s += `<text class="dg-t" x="0" y="214">Going early matters. So does taking the job a rival wanted.</text>`;
    return dgWrap("0 0 400 226", s);
  },

  /* What is worthless to you is precious to them */
  "econ-trade": () => {
    let s = `<text class="dg-k" x="0" y="12">P1 has too much wood</text>`;
    for (let i = 0; i < 5; i++) s += `<rect class="dg-accf" x="${i * 24}" y="22" width="18" height="26" rx="3"/>`;
    s += `<text class="dg-k" x="250" y="12">P2 has too much stone</text>`;
    for (let i = 0; i < 5; i++) s += `<rect x="${250 + i * 24}" y="22" width="18" height="26" rx="3" style="fill:var(--dg-alt,#FA16C2)"/>`;
    /* The trade itself, read as one line across the middle. */
    s += `<text class="dg-s" x="0" y="95">P1 offers 2 wood</text>`;
    s += `<path class="dg-line" d="M120 91 L154 91"/>`;
    s += `<path class="dg-line" d="M144 83 L154 91 L144 99"/>`;
    s += `<rect class="dg-accf" x="162" y="78" width="76" height="26" rx="13"/>`;
    s += `<text class="dg-s" x="200" y="95" text-anchor="middle" style="fill:var(--dg-on-ink,#16171d)">TRADE</text>`;
    s += `<path class="dg-line" d="M280 91 L246 91"/>`;
    s += `<path class="dg-line" d="M256 83 L246 91 L256 99"/>`;
    s += `<text class="dg-s" x="400" y="95" text-anchor="end">P2 offers 2 stone</text>`;
    /* The hands after the swap, so the gain is visible rather than asserted. */
    const hand = (x0, y, kinds) => kinds.map((k, i) => k
      ? `<rect class="dg-accf" x="${x0 + i * 24}" y="${y}" width="18" height="26" rx="3"/>`
      : `<rect x="${x0 + i * 24}" y="${y}" width="18" height="26" rx="3" style="fill:var(--dg-alt,#FA16C2)"/>`).join('');
    s += `<text class="dg-k" x="0" y="138">P1 now has 3 wood, 2 stone</text>`;
    s += hand(0, 148, [1, 1, 1, 0, 0]);
    s += `<text class="dg-k" x="250" y="138">P2 now has 3 stone, 2 wood</text>`;
    s += hand(250, 148, [0, 0, 0, 1, 1]);
    return dgWrap("0 0 400 176", s);
  },

  /* Each purchase makes the next one easier */
  "econ-engine": () => {
    let s = `<text class="dg-k" x="0" y="12">Income per turn</text>`;
    const income = [1, 1, 2, 3, 5, 8, 12, 18, 26];
    const maxv = 26;
    income.forEach((v, i) => {
      const h = (v / maxv) * 130;
      s += `<rect class="dg-accf" x="${i * 44}" y="${158 - h}" width="34" height="${h}" rx="3"/>`;
      s += `<text class="dg-k" x="${i * 44 + 8}" y="176">t${i + 1}</text>`;
    });
    s += `<path class="dg-alt" d="M1 152 L392 152" stroke-dasharray="6 5"/>`;
    s += `<text class="dg-t" x="0" y="206">A flat game gives you the same amount every turn.</text>`;
    s += `<text class="dg-t" x="0" y="228">An engine game pays you for building the engine first.</text>`;
    s += `<text class="dg-t" x="0" y="250">Which is why the first few turns feel like nothing is happening.</text>`;
    return dgWrap("0 0 400 262", s);
  },

  /* The price moves as people buy */
  "econ-market": () => {
    let s = `<text class="dg-k" x="0" y="12">The price ladder for wheat</text>`;
    const steps = [2, 3, 4, 6, 8, 11, 15, 20];
    steps.forEach((p, i) => {
      const x = i * 48, y = 150 - i * 16;
      s += `<rect x="${x}" y="${y}" width="42" height="16" rx="3" class="dg-grid" style="fill:${i < 3 ? 'var(--fam-color,#FFE536)' : 'var(--dg-f3,rgba(255,255,255,0.09))'}"/>`;
      s += `<text class="dg-s" x="${x + 21}" y="${y + 12}" text-anchor="middle"` +
        `${i < 3 ? ' style="fill:var(--dg-on-ink,#16171d)"' : ''}>${p}</text>`;
    });
    s += `<circle cx="${2 * 48 + 21}" cy="${150 - 2 * 16 + 8}" r="12" style="fill:none;stroke:var(--dg-alt,#FA16C2);stroke-width:2.5"/>`;
    s += `<text class="dg-s" x="120" y="184">price now</text>`;
    s += `<path class="dg-alt" d="M1 170 L336 42" stroke-dasharray="6 5"/>`;
    s += `<text class="dg-t" x="0" y="220">Every purchase pushes the marker one rung up.</text>`;
    s += `<text class="dg-t" x="0" y="242">Being slow costs you money, with no rule saying it should.</text>`;
    return dgWrap("0 0 400 254", s);
  },

  /* Owning things costs money */
  "econ-upkeep": () => {
    let s = `<text class="dg-k" x="0" y="12">Income against upkeep, turn by turn</text>`;
    const inc = [4, 6, 9, 12, 14, 15, 15, 15];
    const up  = [1, 2, 4, 7, 11, 14, 17, 20];
    inc.forEach((v, i) => {
      const x = i * 48;
      s += `<rect class="dg-accf" x="${x}" y="${150 - v * 6.5}" width="20" height="${v * 6.5}" rx="3"/>`;
      s += `<rect x="${x + 22}" y="${150 - up[i] * 6.5}" width="20" height="${up[i] * 6.5}" rx="3" style="fill:var(--dg-alt,#FA16C2)"/>`;
    });
    s += `<path class="dg-line" d="M1 150 L392 150"/>`;
    s += `<text class="dg-s" x="0" y="170">income</text>`;
    s += `<text class="dg-s" x="250" y="170">upkeep overtakes it</text>`;
    s += `<text class="dg-t" x="0" y="206">Every building you own has to be paid for again next turn.</text>`;
    s += `<text class="dg-t" x="0" y="228">Growing too fast becomes a way to lose.</text>`;
    return dgWrap("0 0 400 240", s);
  },

  /* Raw goods become useful goods become points */
  "econ-chain": () => {
    let s = `<text class="dg-k" x="0" y="12">Three wood, one plank, half a house</text>`;
    const stage = (x, n, w, label) => {
      let g = "";
      for (let i = 0; i < n; i++) g += `<rect x="${x + (i % 3) * 22}" y="${30 + Math.floor(i / 3) * 26}" width="${w}" height="${w}" rx="3" class="dg-accf"/>`;
      g += `<text class="dg-k" x="${x}" y="112">${label}</text>`;
      return g;
    };
    s += stage(0, 6, 18, "wood");
    s += `<path class="dg-line" d="M78 56 L118 56"/><path class="dg-line" d="M108 49 L118 56 L108 63"/>`;
    s += stage(130, 2, 18, "planks");
    s += `<path class="dg-line" d="M180 56 L220 56"/><path class="dg-line" d="M210 49 L220 56 L210 63"/>`;
    s += `<rect class="dg-accf" x="234" y="30" width="46" height="46" rx="5"/>`;
    s += `<text class="dg-k" x="234" y="112">house</text>`;
    s += `<path class="dg-line" d="M290 56 L330 56"/><path class="dg-line" d="M320 49 L330 56 L320 63"/>`;
    s += `<rect x="342" y="30" width="46" height="46" rx="23" style="fill:var(--dg-alt,#FA16C2)"/>`;
    s += `<text class="dg-k" x="342" y="112">points</text>`;
    s += `<text class="dg-t" x="0" y="152">Every step costs a turn, so the last step is worth a lot.</text>`;
    s += `<text class="dg-t" x="0" y="174">Short chains feel fast. Long chains reward planning ahead.</text>`;
    return dgWrap("0 0 400 186", s);
  },


  /* Roll to hit, then they roll to survive */
  "combat-attack": () => {
    let s = `<text class="dg-k" x="0" y="12">Three rolls, and most attacks die on the way</text>`;
    const steps = [["roll to hit", 100, 67], ["roll to wound", 67, 33], ["they roll armour", 33, 22]];
    steps.forEach(([label, from, to], i) => {
      const y = 26 + i * 54;
      s += `<text class="dg-k" x="0" y="${y + 15}">${label}</text>`;
      s += `<rect class="dg-grid" x="120" y="${y}" width="270" height="24" rx="4"/>`;
      s += `<rect class="dg-accf" x="120" y="${y}" width="${270 * from / 100}" height="24" rx="4"/>`;
      s += `<rect x="${120 + 270 * to / 100}" y="${y}" width="${270 * (from - to) / 100}" height="24" rx="4" style="fill:var(--dg-alt,#FA16C2)"/>`;
      s += `<text class="dg-on" x="128" y="${y + 17}">${to}% left</text>`;
    });
    s += `<text class="dg-t" x="0" y="212">Ten attacks become two wounds.</text>`;
    s += `<text class="dg-t" x="0" y="234">Every extra roll makes combat slower and more predictable.</text>`;
    return dgWrap("0 0 400 246", s);
  },

  /* A bar that only goes down */
  "combat-hp": () => {
    let s = `<text class="dg-k" x="0" y="12">Ten hit points, taking hits</text>`;
    const states = [10, 7, 7, 3, 1, 0];
    states.forEach((hp, i) => {
      const y = 24 + i * 30;
      for (let k = 0; k < 10; k++) {
        s += `<rect x="${120 + k * 26}" y="${y}" width="20" height="20" rx="3" style="fill:${k < hp ? 'var(--fam-color,#FFE536)' : 'var(--dg-f2,rgba(255,255,255,0.06))'}"/>`;
      }
      s += `<text class="dg-k" x="0" y="${y + 15}">${i === 0 ? 'start' : i === 5 ? 'destroyed' : 'hit ' + i}</text>`;
    });
    s += `<text class="dg-t" x="0" y="216">Players can see exactly how close a piece is to dying.</text>`;
    s += `<text class="dg-t" x="0" y="238">That visible countdown is what makes the table lean in.</text>`;
    return dgWrap("0 0 400 250", s);
  },

  /* Everything beats something */
  "combat-rps": () => {
    let s = `<text class="dg-k" x="0" y="12">Each unit type beats one and loses to another</text>`;
    const nodes = [[200, 64, "spears"], [320, 164, "swords"], [80, 164, "cavalry"]];
    nodes.forEach(([x, y, label]) => {
      s += `<circle cx="${x}" cy="${y}" r="38" class="dg-grid" style="fill:var(--fam-color,#FFE536)"/>`;
      s += `<text class="dg-t" x="${x}" y="${y + 5}" text-anchor="middle" style="font-size:12px;fill:var(--dg-on-ink,#16171d)">${label}</text>`;
    });
    const arc = (x1, y1, x2, y2) => {
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
      const ux = dx / len, uy = dy / len;
      const sx = x1 + ux * 44, sy = y1 + uy * 44, ex = x2 - ux * 46, ey = y2 - uy * 46;
      return `<path class="dg-alt" d="M${sx.toFixed(1)} ${sy.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}"/>` +
             `<path class="dg-alt" d="M${(ex - ux * 12 - uy * 7).toFixed(1)} ${(ey - uy * 12 + ux * 7).toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)} L${(ex - ux * 12 + uy * 7).toFixed(1)} ${(ey - uy * 12 - ux * 7).toFixed(1)}" stroke-width="2.6"/>`;
    };
    s += arc(200, 64, 320, 164) + arc(320, 164, 80, 164) + arc(80, 164, 200, 64);
    s += `<text class="dg-t" x="0" y="236">No unit is best. Bringing the wrong army is the mistake.</text>`;
    return dgWrap("0 0 400 248", s);
  },

  /* Where you attack from matters */
  "combat-facing": () => {
    let s = `<text class="dg-k" x="0" y="12">The same attack, three different results</text>`;
    const cx = 130, cy = 126;
    s += `<path d="M${cx} ${cy} L${cx - 70} ${cy - 70} A99 99 0 0 1 ${cx + 70} ${cy - 70} Z" style="fill:var(--dg-f2,rgba(255,255,255,0.06))" class="dg-grid"/>`;
    s += `<path d="M${cx} ${cy} L${cx + 70} ${cy - 70} A99 99 0 0 1 ${cx + 70} ${cy + 70} Z" style="fill:var(--dg-alt-soft,rgba(250,22,194,0.22))" class="dg-grid"/>`;
    s += `<path d="M${cx} ${cy} L${cx - 70} ${cy - 70} A99 99 0 0 0 ${cx - 70} ${cy + 70} Z" style="fill:var(--dg-alt-soft,rgba(250,22,194,0.22))" class="dg-grid"/>`;
    s += `<path d="M${cx} ${cy} L${cx - 70} ${cy + 70} A99 99 0 0 0 ${cx + 70} ${cy + 70} Z" style="fill:var(--fam-color,#FFE536)" class="dg-grid"/>`;
    s += `<rect class="dg-accf" x="${cx - 14}" y="${cy - 14}" width="28" height="28" rx="4"/>`;
    s += `<path class="dg-line" d="M${cx} ${cy - 20} L${cx} ${cy - 46}"/>`;
    const key = [["front: they defend fully", "var(--dg-f2,rgba(255,255,255,0.06))"], ["flank: reduced defence", "var(--dg-alt-soft,rgba(250,22,194,0.22))"], ["rear: no defence at all", "var(--fam-color,#FFE536)"]];
    key.forEach(([label, fill], i) => {
      const y = 66 + i * 34;
      s += `<rect x="246" y="${y}" width="22" height="22" rx="4" class="dg-grid" style="fill:${fill}"/>`;
      s += `<text class="dg-t" x="276" y="${y + 16}" style="font-size:11px">${label}</text>`;
    });
    s += `<text class="dg-t" x="0" y="250">Moving to a better angle becomes worth a whole turn.</text>`;
    return dgWrap("0 0 400 262", s);
  },

  /* One shot, several targets */
  "combat-aoe": () => {
    const cell = 32;
    let s = `<text class="dg-k" x="0" y="12">One blast, everything under it is hit</text>`;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 10; c++) {
      s += `<rect class="dg-grid" x="${c * cell}" y="${22 + r * cell}" width="${cell}" height="${cell}" style="fill:var(--dg-f1,rgba(255,255,255,0.03))"/>`;
    }
    s += `<circle cx="${5 * cell}" cy="${22 + 2.5 * cell}" r="${cell * 1.6}" style="fill:var(--dg-alt-soft,rgba(250,22,194,0.22));stroke:var(--dg-alt,#FA16C2);stroke-width:2"/>`;
    const units = [[2,1,0],[4,1,1],[5,2,1],[5,3,1],[4,3,1],[8,2,0],[7,4,0]];
    units.forEach(([c, r, hit]) => {
      s += `<circle cx="${c * cell + cell / 2}" cy="${22 + r * cell + cell / 2}" r="10" style="fill:${hit ? 'var(--fam-color,#FFE536)' : 'var(--dg-f5,rgba(255,255,255,0.21))'}"/>`;
    });
    s += `<text class="dg-t" x="0" y="212">Four hit at once, which punishes players who bunch up.</text>`;
    s += `<text class="dg-t" x="0" y="234">Now spreading out is a real tactic instead of a habit.</text>`;
    return dgWrap("0 0 400 246", s);
  },

  /* Everything is looking at the loud one */
  "combat-aggro": () => {
    let s = `<text class="dg-k" x="0" y="12">Enemies must attack the loud one first</text>`;
    const tank = [90, 120];
    s += `<circle cx="${tank[0]}" cy="${tank[1]}" r="30" class="dg-accf"/>`;
    s += `<text class="dg-k" x="${tank[0] - 22}" y="${tank[1] + 56}">taunt</text>`;
    const weak = [[300, 60], [330, 130], [296, 196]];
    weak.forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="18" style="fill:var(--dg-f4,rgba(255,255,255,0.14))"/>`; });
    const foes = [[200, 40], [220, 110], [200, 186]];
    foes.forEach(([x, y]) => {
      s += `<rect x="${x - 15}" y="${y - 15}" width="30" height="30" rx="5" style="fill:var(--dg-alt,#FA16C2)"/>`;
      const dx = tank[0] - x, dy = tank[1] - y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
      const ex = x + ux * (L - 34), ey = y + uy * (L - 34);
      s += `<path class="dg-acc" d="M${(x + ux * 20).toFixed(1)} ${(y + uy * 20).toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}"/>`;
      s += `<path class="dg-acc" d="M${(ex - ux * 11 - uy * 6).toFixed(1)} ${(ey - uy * 11 + ux * 6).toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)} L${(ex - ux * 11 + uy * 6).toFixed(1)} ${(ey - uy * 11 - ux * 6).toFixed(1)}" stroke-width="2.6"/>`;
    });
    s += `<text class="dg-t" x="0" y="246">One tough piece protects three fragile ones by standing there.</text>`;
    return dgWrap("0 0 400 258", s);
  },

  /* Powerful, but not every turn */
  "combat-cooldown": () => {
    let s = `<text class="dg-k" x="0" y="12">A three turn cooldown across eight turns</text>`;
    const state = ["ready", "cool", "cool", "ready", "cool", "cool", "ready", "cool"];
    state.forEach((st, i) => {
      const x = i * 49, ready = st === "ready";
      s += `<rect x="${x}" y="24" width="40" height="52" rx="7" class="dg-grid" style="fill:${ready ? 'var(--fam-color,#FFE536)' : 'var(--dg-f2,rgba(255,255,255,0.06))'}"/>`;
      if (ready) { s += `<circle cx="${x + 20}" cy="50" r="11" style="fill:var(--dg-knock,rgba(0,0,0,0.55))"/>`; }
      else { s += `<rect x="${x + 8}" y="44" width="24" height="12" rx="6" style="fill:var(--dg-f5,rgba(255,255,255,0.21))"/>`; }
      s += `<text class="dg-k" x="${x + 10}" y="94">t${i + 1}</text>`;
    });
    s += `<text class="dg-t" x="0" y="132">The ability can be strong, because it is rare.</text>`;
    s += `<text class="dg-t" x="0" y="154">Choosing the turn to use it becomes the interesting part.</text>`;
    return dgWrap("0 0 400 166", s);
  },


  /* You see faces, they see backs */
  "hidden-hand": () => {
    let s = `<text class="dg-k" x="0" y="12">What you see</text>`;
    for (let i = 0; i < 4; i++) {
      const x = i * 48;
      s += `<rect x="${x}" y="22" width="40" height="58" rx="5" class="dg-grid" style="fill:var(--fam-color,#FFE536)"/>`;
      for (let k = 0; k < 3; k++) s += `<rect x="${x + 7}" y="${32 + k * 12}" width="${26 - k * 7}" height="5" rx="2" style="fill:var(--dg-knock,rgba(0,0,0,0.55))"/>`;
    }
    s += `<text class="dg-k" x="230" y="12">What they see</text>`;
    for (let i = 0; i < 4; i++) {
      const x = 230 + i * 42;
      s += `<rect x="${x}" y="22" width="36" height="58" rx="5" class="dg-grid" style="fill:var(--dg-f3,rgba(255,255,255,0.09))"/>`;
      s += `<path class="dg-line" d="M${x + 8} 40 L${x + 28} 62 M${x + 28} 40 L${x + 8} 62" style="stroke:var(--ink-dim,#71778c)"/>`;
    }
    s += `<text class="dg-t" x="0" y="118">They know how many cards you hold, and nothing else.</text>`;
    s += `<text class="dg-t" x="0" y="140">The count alone tells them something, which is why hand size</text>`;
    s += `<text class="dg-t" x="0" y="162">is worth thinking about.</text>`;
    return dgWrap("0 0 400 174", s);
  },

  /* One of these players is lying */
  "hidden-roles": () => {
    let s = `<text class="dg-k" x="0" y="12">Five identical card backs</text>`;
    for (let i = 0; i < 5; i++) {
      const x = i * 80;
      s += `<rect x="${x}" y="22" width="66" height="90" rx="7" class="dg-grid" style="fill:var(--dg-f3,rgba(255,255,255,0.09))"/>`;
      s += `<circle cx="${x + 33}" cy="67" r="16" style="fill:var(--dg-f4,rgba(255,255,255,0.14))"/>`;
    }
    s += `<text class="dg-k" x="0" y="146">What is actually on them</text>`;
    const roles = [0, 0, 1, 0, 0];
    roles.forEach((traitor, i) => {
      const x = i * 80;
      s += `<rect x="${x}" y="156" width="66" height="52" rx="7" class="dg-grid" style="fill:${traitor ? 'var(--dg-alt,#FA16C2)' : 'var(--fam-color,#FFE536)'}"/>`;
      s += `<circle cx="${x + 33}" cy="182" r="12" style="fill:var(--dg-knock,rgba(0,0,0,0.55))"/>`;
    });
    s += `<text class="dg-t" x="0" y="242">Everyone looks the same. One is playing a different game.</text>`;
    return dgWrap("0 0 400 254", s);
  },

  /* You can only see near your own pieces */
  "hidden-fog": () => {
    const cell = 28;
    let s = `<text class="dg-k" x="0" y="12">The map, as one player sees it</text>`;
    const seen = (c, r) => Math.hypot(c - 3, r - 3) < 2.6 || Math.hypot(c - 10, r - 2) < 2.1;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) {
      const vis = seen(c, r);
      s += `<rect class="dg-grid" x="${c * cell}" y="${22 + r * cell}" width="${cell}" height="${cell}" style="fill:${vis ? 'var(--dg-f3,rgba(255,255,255,0.09))' : 'var(--dg-f1,rgba(255,255,255,0.03))'}"/>`;
    }
    [[3, 3], [10, 2]].forEach(([c, r]) => {
      s += `<circle cx="${c * cell + cell / 2}" cy="${22 + r * cell + cell / 2}" r="10" class="dg-accf"/>`;
    });
    [[7, 4], [12, 5]].forEach(([c, r]) => {
      s += `<rect x="${c * cell + 8}" y="${22 + r * cell + 8}" width="12" height="12" rx="2" style="fill:var(--dg-f2,rgba(255,255,255,0.06))"/>`;
    });
    s += `<text class="dg-t" x="0" y="212">Two enemies are on this board. The player sees neither.</text>`;
    s += `<text class="dg-t" x="0" y="234">Scouting becomes worth spending a turn on.</text>`;
    return dgWrap("0 0 400 246", s);
  },

  /* Betting big with nothing */
  "hidden-bluff": () => {
    let s = `<text class="dg-k" x="0" y="12">What they bet</text>`;
    const rows = [["P1", 80, 70], ["P2", 30, 85], ["P3", 90, 15]];
    rows.forEach(([p, bet, real], i) => {
      const y = 24 + i * 58;
      s += `<text class="dg-k" x="0" y="${y + 16}">${p}</text>`;
      s += `<rect class="dg-accf" x="44" y="${y}" width="${bet * 3.2}" height="20" rx="4"/>`;
      s += `<rect x="44" y="${y + 26}" width="${real * 3.2}" height="20" rx="4" style="fill:var(--dg-f4,rgba(255,255,255,0.14))"/>`;
    });
    /* Both bars are labelled beside the first row instead of over the
       heading, which the old tags collided with. */
    s += `<text class="dg-s" x="308" y="38">bet</text>`;
    s += `<text class="dg-s" x="308" y="64">hand</text>`;
    s += `<text class="dg-t" x="0" y="210">P3 has almost nothing and is betting the most.</text>`;
    s += `<text class="dg-t" x="0" y="232">The lie only works because nobody can check.</text>`;
    return dgWrap("0 0 400 244", s);
  },

  /* A trail, and a gap where the runner actually is */
  "hidden-movement": () => {
    const N = { a:[30,60], b:[100,30], c:[110,110], d:[190,66], e:[270,34], f:[280,116], g:[360,70] };
    const E = [["a","b"],["a","c"],["b","d"],["c","d"],["d","e"],["d","f"],["e","g"],["f","g"],["b","c"]];
    let s = `<text class="dg-k" x="0" y="12">The runner shows where they were, not where they are</text>`;
    E.forEach(([p, q]) => { s += `<path class="dg-line" d="M${N[p][0]} ${N[p][1] + 20} L${N[q][0]} ${N[q][1] + 20}"/>`; });
    const shown = ["a", "b", "d"];
    Object.entries(N).forEach(([k, [x, y]]) => {
      const isShown = shown.includes(k);
      const isNow = k === "f";
      s += `<circle cx="${x}" cy="${y + 20}" r="14" style="fill:${isShown ? 'var(--fam-color,#FFE536)' : 'var(--dg-f3,rgba(255,255,255,0.09))'};stroke:var(--ink-dim,#71778c);stroke-width:1.5"/>`;
      if (isNow) s += `<circle cx="${x}" cy="${y + 20}" r="20" style="fill:none;stroke:var(--dg-alt,#FA16C2);stroke-width:2.5;stroke-dasharray:5 4"/>`;
    });
    s += `<text class="dg-s" x="232" y="178">could be here</text>`;
    s += `<text class="dg-t" x="0" y="200">Three known stops, and a growing set of places they might be.</text>`;
    s += `<text class="dg-t" x="0" y="222">The hunters are doing detective work, not chasing.</text>`;
    return dgWrap("0 0 400 234", s);
  },

  /* Same board, different goals */
  "hidden-objectives": () => {
    let s = `<text class="dg-k" x="0" y="12">One shared board</text>`;
    const cell = 30;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
      s += `<rect class="dg-grid" x="${c * cell}" y="${22 + r * cell}" width="${cell}" height="${cell}" style="fill:var(--dg-f2,rgba(255,255,255,0.06))"/>`;
    }
    s += `<text class="dg-k" x="210" y="12">Three secret goals</text>`;
    const goals = [[[0,0],[1,0],[2,0]], [[5,2],[5,1]], [[2,1],[3,1],[3,2]]];
    goals.forEach((cells, i) => {
      const oy = 22 + i * 0;
      cells.forEach(([c, r]) => {
        s += `<rect x="${c * cell + 5}" y="${oy + r * cell + 5}" width="${cell - 10}" height="${cell - 10}" rx="3" style="fill:${['var(--fam-color,#FFE536)','var(--dg-alt,#FA16C2)','var(--dg-f6,rgba(255,255,255,0.32))'][i]};opacity:0.85"/>`;
      });
      s += `<rect x="${210 + i * 62}" y="${34}" width="50" height="34" rx="5" style="fill:${['var(--fam-color,#FFE536)','var(--dg-alt,#FA16C2)','var(--dg-f6,rgba(255,255,255,0.32))'][i]}"/>`;
    });
    s += `<text class="dg-t" x="0" y="148">Nobody knows why anyone else is doing what they are doing.</text>`;
    s += `<text class="dg-t" x="0" y="170">Watching a rival's moves becomes a way to guess their goal.</text>`;
    return dgWrap("0 0 400 182", s);
  },

  /* You may say this much, and no more */
  "hidden-comms": () => {
    let s = `<text class="dg-k" x="0" y="12">Allowed</text>`;
    const ok = ["point at one card", "say a number", "say a colour"];
    ok.forEach((t, i) => {
      const y = 22 + i * 34;
      s += `<rect class="dg-grid" x="0" y="${y}" width="184" height="26" rx="6" style="fill:var(--dg-f2,rgba(255,255,255,0.06))"/>`;
      s += `<rect class="dg-accf" x="8" y="${y + 7}" width="12" height="12" rx="3"/>`;
      s += `<text class="dg-t" x="28" y="${y + 18}" style="font-size:11px">${t}</text>`;
    });
    s += `<text class="dg-k" x="212" y="12">Not allowed</text>`;
    const no = ["say what to play", "describe your hand", "hint with your voice"];
    no.forEach((t, i) => {
      const y = 22 + i * 34;
      s += `<rect class="dg-grid" x="212" y="${y}" width="184" height="26" rx="6" style="fill:var(--dg-f1,rgba(255,255,255,0.03))"/>`;
      s += `<path class="dg-alt" d="M220 ${y + 8} L232 ${y + 20} M232 ${y + 8} L220 ${y + 20}" stroke-width="2.4"/>`;
      s += `<text class="dg-t" x="240" y="${y + 18}" style="font-size:11px">${t}</text>`;
    });
    s += `<text class="dg-t" x="0" y="156">Cutting communication down makes a team game hard.</text>`;
    s += `<text class="dg-t" x="0" y="178">It also stops one loud player from running everyone's turn.</text>`;
    return dgWrap("0 0 400 190", s);
  },


  /* One divides, the other picks */
  "fair-cut-choose": () => {
    let s = `<text class="dg-k" x="0" y="12">P1 splits the pile</text>`;
    s += `<rect class="dg-accf" x="4" y="24" width="128" height="46" rx="6"/>`;
    s += `<rect x="146" y="24" width="110" height="46" rx="6" style="fill:var(--fam-color,#FFE536);opacity:0.55"/>`;
    s += `<text class="dg-k" x="0" y="92">P2 chooses first</text>`;
    s += `<rect class="dg-accf" x="4" y="104" width="128" height="46" rx="6"/>`;
    /* Inset by 2 so the stroke stays inside the frame. */
    s += `<path class="dg-alt" d="M2 100 L136 100 L136 154 L2 154 Z" stroke-dasharray="6 4"/>`;
    s += `<rect x="146" y="104" width="110" height="46" rx="6" style="fill:var(--dg-f4,rgba(255,255,255,0.14))"/>`;
    s += `<text class="dg-s" x="266" y="132">P1 gets the rest</text>`;
    s += `<text class="dg-t" x="0" y="192">P1 has every reason to split it evenly.</text>`;
    s += `<text class="dg-t" x="0" y="214">No rule made them fair. The order of the two jobs did.</text>`;
    return dgWrap("0 0 400 226", s);
  },

  /* A head start, sized to the gap */
  "fair-handicap": () => {
    let s = `<text class="dg-k" x="0" y="12">Without a handicap</text>`;
    s += `<rect class="dg-accf" x="80" y="22" width="290" height="22" rx="4"/>`;
    s += `<rect x="80" y="50" width="110" height="22" rx="4" style="fill:var(--dg-f4,rgba(255,255,255,0.14))"/>`;
    s += `<text class="dg-k" x="0" y="38">strong</text>`;
    s += `<text class="dg-k" x="0" y="66">new</text>`;
    s += `<text class="dg-k" x="0" y="112">With a handicap</text>`;
    s += `<rect class="dg-accf" x="80" y="124" width="290" height="22" rx="4"/>`;
    s += `<text class="dg-k" x="0" y="140">strong</text>`;
    s += `<rect x="80" y="152" width="110" height="22" rx="4" style="fill:var(--dg-f4,rgba(255,255,255,0.14))"/>`;
    s += `<text class="dg-k" x="0" y="168">new</text>`;
    s += `<rect x="190" y="152" width="170" height="22" rx="4" style="fill:var(--dg-alt,#FA16C2)"/>`;
    s += `<text class="dg-s" x="196" y="192">the head start</text>`;
    s += `<text class="dg-t" x="0" y="228">The weaker player starts closer, so both can still lose.</text>`;
    s += `<text class="dg-t" x="0" y="250">Go has done this for centuries with extra stones.</text>`;
    return dgWrap("0 0 400 262", s);
  },

  /* Luck narrows the gap between skill levels */
  "fair-luck": () => {
    const bar = (y, label, skillWin, luckWin) => {
      let g = `<text class="dg-k" x="0" y="${y + 15}">${label}</text>`;
      g += `<rect class="dg-grid" x="130" y="${y}" width="260" height="22" rx="4"/>`;
      g += `<rect class="dg-accf" x="130" y="${y}" width="${260 * skillWin / 100}" height="22" rx="4"/>`;
      g += `<text class="dg-on" x="138" y="${y + 16}">${skillWin}%</text>`;
      return g;
    };
    let s = `<text class="dg-k" x="0" y="12">How often the stronger player wins</text>`;
    s += bar(26, "no luck", 97);
    s += bar(62, "some luck", 78);
    s += bar(98, "lots of luck", 56);
    s += `<text class="dg-t" x="0" y="152">Chess has almost no luck, so a beginner never beats an expert.</text>`;
    s += `<text class="dg-t" x="0" y="174">Adding luck gives a weaker player a real chance, and costs the</text>`;
    s += `<text class="dg-t" x="0" y="196">stronger player the certainty of winning.</text>`;
    return dgWrap("0 0 400 208", s);
  },

  /* Different powers, same chance of winning */
  "fair-asymmetry": () => {
    let s = `<text class="dg-k" x="0" y="12">Four factions, four different shapes</text>`;
    const shapes = [[5, 2, 1, 4], [1, 5, 4, 2], [3, 3, 3, 3], [2, 1, 5, 4]];
    shapes.forEach((f, i) => {
      const x = i * 100;
      f.forEach((v, k) => {
        s += `<rect class="dg-accf" x="${x}" y="${24 + k * 22}" width="${v * 16}" height="14" rx="3"/>`;
      });
      s += `<text class="dg-k" x="${x}" y="${132}">faction ${i + 1}</text>`;
    });
    s += `<text class="dg-k" x="0" y="166">Win rate across many games</text>`;
    shapes.forEach((f, i) => {
      const x = i * 100;
      s += `<rect x="${x}" y="176" width="82" height="20" rx="4" style="fill:var(--dg-alt,#FA16C2)"/>`;
    });
    s += `<text class="dg-t" x="0" y="230">Nothing is the same, and everything is equally likely to win.</text>`;
    s += `<text class="dg-t" x="0" y="252">This is the hardest kind of balance to get right.</text>`;
    return dgWrap("0 0 400 264", s);
  },

  /* Numbers going up */
  "growth-xp": () => {
    let s = `<text class="dg-k" x="0" y="12">Experience needed for each level</text>`;
    const need = [10, 25, 45, 70, 100, 140];
    need.forEach((n, i) => {
      const y = 24 + i * 30;
      s += `<text class="dg-k" x="0" y="${y + 16}">lv ${i + 2}</text>`;
      s += `<rect class="dg-accf" x="46" y="${y}" width="${n * 2.4}" height="20" rx="4"/>`;
    });
    s += `<text class="dg-t" x="0" y="228">Each level costs more than the last, so growth slows down.</text>`;
    s += `<text class="dg-t" x="0" y="250">Without that, whoever levels first runs away with it.</text>`;
    return dgWrap("0 0 400 262", s);
  },

  /* Unlocks that open other unlocks */
  "growth-tech": () => {
    const N = { a:[30,124], b:[130,74], c:[130,174], d:[240,44], e:[240,119], f:[240,194], g:[350,82], h:[350,164] };
    const E = [["a","b"],["a","c"],["b","d"],["b","e"],["c","e"],["c","f"],["d","g"],["e","g"],["e","h"],["f","h"]];
    const done = ["a", "b", "c"];
    let s = `<text class="dg-k" x="0" y="12">Two branches unlocked, the rest still closed</text>`;
    E.forEach(([p, q]) => { s += `<path class="dg-line" d="M${N[p][0]} ${N[p][1]} L${N[q][0]} ${N[q][1]}"/>`; });
    Object.entries(N).forEach(([k, [x, y]]) => {
      const on = done.includes(k);
      s += `<rect x="${x - 22}" y="${y - 15}" width="44" height="30" rx="6" class="dg-grid" style="fill:${on ? 'var(--fam-color,#FFE536)' : 'var(--dg-f2,rgba(255,255,255,0.06))'}"/>`;
    });
    s += `<text class="dg-t" x="0" y="242">You cannot reach the far right without choosing a path.</text>`;
    s += `<text class="dg-t" x="0" y="264">Two players can end the same game with different abilities.</text>`;
    return dgWrap("0 0 400 276", s);
  },

  /* Better gear, same person */
  "growth-gear": () => {
    let s = `<text class="dg-k" x="0" y="12">The same character, three loadouts</text>`;
    const sets = [[1, 0, 0, 0], [1, 1, 1, 0], [1, 1, 1, 1]];
    sets.forEach((slots, i) => {
      const x = i * 136;
      s += `<circle cx="${x + 46}" cy="52" r="26" class="dg-accf"/>`;
      slots.forEach((on, k) => {
        const positions = [[x + 4, 92], [x + 40, 92], [x + 76, 92], [x + 40, 128]];
        s += `<rect x="${positions[k][0]}" y="${positions[k][1]}" width="30" height="30" rx="5" class="dg-grid" style="fill:${on ? 'var(--fam-color,#FFE536)' : 'var(--dg-f2,rgba(255,255,255,0.06))'}"/>`;
      });
      s += `<rect class="dg-accf" x="${x}" y="172" width="${(i + 1) * 34}" height="16" rx="4"/>`;
    });
    s += `<text class="dg-s" x="0" y="206">power</text>`;
    s += `<text class="dg-t" x="0" y="240">Gear is easier to balance than levels. You can take it away.</text>`;
    return dgWrap("0 0 400 252", s);
  },

  /* The game remembers last time */
  "growth-legacy": () => {
    let s = `<text class="dg-k" x="0" y="12">The same board, three sessions apart</text>`;
    const cell = 26;
    const marks = [[], [[1,1],[4,0]], [[1,1],[4,0],[2,2],[0,3],[5,1],[3,3]]];
    marks.forEach((set, i) => {
      const ox = i * 132;
      for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
        s += `<rect class="dg-grid" x="${ox + c * (cell - 4)}" y="${22 + r * (cell - 4)}" width="${cell - 6}" height="${cell - 6}" style="fill:var(--dg-f1,rgba(255,255,255,0.03))"/>`;
      }
      set.forEach(([c, r]) => {
        s += `<rect x="${ox + c * (cell - 4) + 3}" y="${22 + r * (cell - 4) + 3}" width="${cell - 12}" height="${cell - 12}" rx="2" style="fill:var(--fam-color,#FFE536)"/>`;
      });
      s += `<text class="dg-k" x="${ox}" y="132">game ${i * 4 + 1}</text>`;
    });
    s += `<text class="dg-t" x="0" y="170">Stickers go on, cards get torn up, rules change permanently.</text>`;
    s += `<text class="dg-t" x="0" y="192">The copy on your shelf stops being the same as anyone else's.</text>`;
    return dgWrap("0 0 400 204", s);
  },

  /* It gets worse whether you are ready or not */
  "growth-escalation": () => {
    let s = `<text class="dg-k" x="0" y="12">Threat against player strength</text>`;
    const threat = [2, 3, 5, 7, 10, 14, 19, 25];
    const power  = [4, 6, 8, 11, 13, 15, 17, 19];
    threat.forEach((t, i) => {
      const x = i * 48;
      s += `<rect x="${x + 22}" y="${162 - t * 5.6}" width="20" height="${t * 5.6}" rx="3" style="fill:var(--dg-alt,#FA16C2)"/>`;
      s += `<rect class="dg-accf" x="${x}" y="${162 - power[i] * 5.6}" width="20" height="${power[i] * 5.6}" rx="3"/>`;
    });
    s += `<path class="dg-line" d="M1 162 L392 162"/>`;
    s += `<text class="dg-s" x="0" y="182">you</text>`;
    s += `<text class="dg-s" x="256" y="182">threat passes you</text>`;
    s += `<text class="dg-t" x="0" y="218">You are getting stronger. The problem is getting stronger faster.</text>`;
    s += `<text class="dg-t" x="0" y="240">That crossing point is when the game has to end.</text>`;
    return dgWrap("0 0 400 252", s);
  },

  /* Crossing a line changes the rules */
  "growth-milestones": () => {
    let s = `<text class="dg-k" x="0" y="12">One track, three thresholds</text>`;
    s += `<rect class="dg-grid" x="0" y="40" width="392" height="30" rx="15"/>`;
    s += `<rect class="dg-accf" x="0" y="40" width="220" height="30" rx="15"/>`;
    [98, 196, 294].forEach((x, i) => {
      s += `<path class="dg-alt" d="M${x} 30 L${x} 80"/>`;
      s += `<circle cx="${x}" cy="${100}" r="13" style="fill:${x < 220 ? 'var(--fam-color,#FFE536)' : 'var(--dg-f3,rgba(255,255,255,0.09))'}"/>`;
      s += `<text class="dg-k" x="${x - 26}" y="130">tier ${i + 1}</text>`;
    });
    s += `<text class="dg-t" x="0" y="172">Nothing happens between the lines, everything at them.</text>`;
    s += `<text class="dg-t" x="0" y="194">Players start counting how far they are from the next one.</text>`;
    return dgWrap("0 0 400 206", s);
  },

  /* You lose, but you keep something */
  "growth-runs": () => {
    let s = `<text class="dg-k" x="0" y="12">Four attempts, each one starts stronger</text>`;
    const runs = [[3, 0], [5, 1], [6, 2], [9, 3]];
    runs.forEach(([reach, kept], i) => {
      const y = 24 + i * 44;
      s += `<text class="dg-k" x="0" y="${y + 20}">run ${i + 1}</text>`;
      for (let k = 0; k < 10; k++) {
        s += `<rect x="${52 + k * 34}" y="${y}" width="28" height="28" rx="4" style="fill:${k < kept ? 'var(--dg-alt,#FA16C2)' : k < reach ? 'var(--fam-color,#FFE536)' : 'var(--dg-f2,rgba(255,255,255,0.06))'}"/>`;
      }
    });
    s += `<text class="dg-s" x="52" y="208">kept between runs</text>`;
    s += `<text class="dg-t" x="0" y="242">Losing still moves you forward, so a failed game is not wasted.</text>`;
    return dgWrap("0 0 400 254", s);
  },


  /* Everything converts to one number */
  "goals-vp": () => {
    let s = `<text class="dg-k" x="0" y="12">Different things, one currency</text>`;
    const sources = [["buildings", 3, 4], ["routes", 2, 6], ["cards", 5, 1], ["bonus", 1, 8]];
    let total = 0;
    sources.forEach(([label, n, each], i) => {
      const y = 24 + i * 34;
      s += `<text class="dg-k" x="0" y="${y + 17}">${label}</text>`;
      for (let k = 0; k < n; k++) s += `<rect x="${92 + k * 22}" y="${y}" width="17" height="24" rx="3" style="fill:var(--dg-f4,rgba(255,255,255,0.14))"/>`;
      s += `<rect class="dg-accf" x="220" y="${y}" width="${n * each * 3.4}" height="24" rx="4"/>`;
      total += n * each;
    });
    s += `<path class="dg-line" d="M220 168 L392 168"/>`;
    s += `<rect class="dg-accf" x="220" y="176" width="${Math.min(total * 3.4, 172)}" height="26" rx="4"/>`;
    s += `<text class="dg-k" x="0" y="194">total</text>`;
    s += `<text class="dg-t" x="0" y="240">Any two piles of stuff can be compared once they are points.</text>`;
    return dgWrap("0 0 400 252", s);
  },

  /* Most pieces in the region takes it */
  "goals-area": () => {
    let s = `<text class="dg-k" x="0" y="12">Three regions, counted separately</text>`;
    const regions = [[0, 4, 2], [136, 2, 3], [272, 3, 3]];
    regions.forEach(([ox, a, b], i) => {
      s += `<rect class="dg-grid" x="${ox}" y="22" width="118" height="110" rx="10" style="fill:var(--dg-f1,rgba(255,255,255,0.03))"/>`;
      for (let k = 0; k < a; k++) s += `<circle cx="${ox + 26 + (k % 3) * 26}" cy="${46 + Math.floor(k / 3) * 26}" r="10" class="dg-accf"/>`;
      for (let k = 0; k < b; k++) s += `<circle cx="${ox + 26 + (k % 3) * 26}" cy="${100 + Math.floor(k / 3) * 26}" r="10" style="fill:var(--dg-alt,#FA16C2)"/>`;
      const winner = a > b ? "var(--fam-color,#FFE536)" : a < b ? "var(--dg-alt,#FA16C2)" : "var(--dg-f5,rgba(255,255,255,0.21))";
      s += `<rect x="${ox}" y="140" width="118" height="16" rx="4" style="fill:${winner}"/>`;
    });
    s += `<text class="dg-t" x="0" y="196">Second place in a region is usually worth nothing.</text>`;
    s += `<text class="dg-t" x="0" y="218">One extra piece in the right place beats five in the wrong one.</text>`;
    return dgWrap("0 0 400 230", s);
  },

  /* First past the line */
  "goals-race": () => {
    let s = `<text class="dg-k" x="0" y="12">First to the end wins, and everyone can see it coming</text>`;
    const pos = [86, 62, 71, 40];
    pos.forEach((p, i) => {
      const y = 26 + i * 40;
      s += `<rect class="dg-grid" x="40" y="${y}" width="330" height="26" rx="13"/>`;
      s += `<rect x="40" y="${y}" width="${330 * p / 100}" height="26" rx="13" style="fill:${p > 80 ? 'var(--fam-color,#FFE536)' : 'var(--dg-f4,rgba(255,255,255,0.14))'}"/>`;
      s += `<text class="dg-k" x="0" y="${y + 18}">P${i + 1}</text>`;
    });
    s += `<path class="dg-alt" d="M370 18 L370 190"/>`;
    s += `<text class="dg-t" x="0" y="224">No scoring at the end, no adding up, no surprises.</text>`;
    s += `<text class="dg-t" x="0" y="246">The downside is that everyone knows who to gang up on.</text>`;
    return dgWrap("0 0 400 258", s);
  },

  /* Several roads to the same finish */
  "goals-multiwin": () => {
    let s = `<text class="dg-k" x="0" y="12">Four ways to win, one game</text>`;
    const paths = [["military", 82], ["science", 46], ["culture", 64], ["economy", 28]];
    paths.forEach(([label, p], i) => {
      const y = 26 + i * 42;
      s += `<text class="dg-k" x="0" y="${y + 20}">${label}</text>`;
      s += `<rect class="dg-grid" x="90" y="${y}" width="280" height="28" rx="6"/>`;
      s += `<rect x="90" y="${y}" width="${280 * p / 100}" height="28" rx="6" style="fill:${p > 75 ? 'var(--fam-color,#FFE536)' : 'var(--dg-f4,rgba(255,255,255,0.14))'}"/>`;
    });
    s += `<path class="dg-alt" d="M370 18 L370 198"/>`;
    s += `<text class="dg-t" x="0" y="232">Blocking one road does not stop a player who is on another.</text>`;
    s += `<text class="dg-t" x="0" y="254">Watching all four is the hard part, and the interesting part.</text>`;
    return dgWrap("0 0 400 266", s);
  },

  /* Nobody knows the score until the end */
  "goals-hidden": () => {
    let s = `<text class="dg-k" x="0" y="12">During the game</text>`;
    for (let i = 0; i < 4; i++) {
      const x = i * 100;
      s += `<rect x="${x}" y="22" width="82" height="56" rx="7" class="dg-grid" style="fill:var(--dg-f2,rgba(255,255,255,0.06))"/>`;
      s += `<text class="dg-s" x="${x + 36}" y="56">?</text>`;
      s += `<text class="dg-k" x="${x + 30}" y="94">P${i + 1}</text>`;
    }
    s += `<text class="dg-k" x="0" y="126">At the reveal, in points</text>`;
    const finals = [34, 41, 29, 38];
    const best = Math.max.apply(null, finals);
    finals.forEach((v, i) => {
      const x = i * 100, top = v === best, h = v * 2;
      s += `<rect x="${x}" y="136" width="82" height="${h}" rx="6" style="fill:${top ? 'var(--fam-color,#FFE536)' : 'var(--dg-f4,rgba(255,255,255,0.14))'}"/>`;
      /* The number is the point of the reveal, so it goes on the bar. */
      s += `<text class="${top ? 'dg-on' : 'dg-s'}" x="${x + 41}" y="${158}" text-anchor="middle" style="font-size:15px;font-weight:700">${v}</text>`;
    });
    s += `<text class="dg-t" x="0" y="238">Nobody could gang up on the leader, because nobody knew.</text>`;
    s += `<text class="dg-t" x="0" y="260">The cost is that players cannot tell how they are doing.</text>`;
    return dgWrap("0 0 400 272", s);
  },

  /* Two matching things are worth more than two things */
  "goals-multiplier": () => {
    let s = `<text class="dg-k" x="0" y="12">Same eight pieces, arranged two ways</text>`;
    const layout = (ox, y, groups, score, label) => {
      let g = `<text class="dg-k" x="${ox}" y="${y}">${label}</text>`;
      let x = ox;
      groups.forEach(function (n) {
        for (let k = 0; k < n; k++) {
          g += `<rect x="${x + k * 20}" y="${y + 12}" width="16" height="22" rx="3" class="dg-accf"/>`;
        }
        x += n * 20 + 12;
      });
      g += `<rect class="dg-accf" x="${ox}" y="${y + 44}" width="${score * 4.4}" height="22" rx="4"/>`;
      /* The score sits beside the bar, since the short bar cannot hold it. */
      g += `<text class="dg-s" x="${ox + score * 4.4 + 10}" y="${y + 60}">${score} points</text>`;
      return g;
    };
    s += layout(0, 34, [2, 2, 2, 2], 8, "spread out");
    s += layout(0, 140, [5, 3], 34, "grouped up");
    s += `<text class="dg-t" x="0" y="242">Grouping is worth four times as much for the same effort.</text>`;
    s += `<text class="dg-t" x="0" y="264">Steep scoring is what makes players commit to a plan.</text>`;
    return dgWrap("0 0 400 276", s);
  },

  /* Out is out */
  "goals-elimination": () => {
    let s = `<text class="dg-k" x="0" y="12">Six players, one game</text>`;
    const rounds = [6, 6, 4, 3, 2, 1];
    rounds.forEach((alive, r) => {
      const y = 24 + r * 34;
      s += `<text class="dg-k" x="0" y="${y + 18}">r${r + 1}</text>`;
      for (let i = 0; i < 6; i++) {
        s += `<circle cx="${52 + i * 40}" cy="${y + 12}" r="13" style="fill:${i < alive ? 'var(--fam-color,#FFE536)' : 'var(--dg-f2,rgba(255,255,255,0.06))'}"/>`;
        if (i >= alive) s += `<path class="dg-alt" d="M${45 + i * 40} ${y + 5} L${59 + i * 40} ${y + 19} M${59 + i * 40} ${y + 5} L${45 + i * 40} ${y + 19}" stroke-width="2"/>`;
      }
    });
    s += `<text class="dg-t" x="0" y="252">A crossed circle is a student with nothing to do.</text>`;
    s += `<text class="dg-t" x="0" y="274">By the last round, five of the six are watching.</text>`;
    return dgWrap("0 0 400 286", s);
  }

};
