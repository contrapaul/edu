/* ═══════════════════════════════════════════════════════════════════
   BLACK BOX CARD, AS A PNG
   Draws one finished card straight onto a canvas, so a student can
   download it and upload the image. Canvas rather than SVG or a
   library: the self-hosted fonts are already loaded on the page, so
   canvas can use them, and nothing here needs a build step or a
   network request.

   The page hands in everything this file needs, so it knows nothing
   about the rest of the tool.

     BBCardPNG.render(card, index, opts, done)
       opts.slotBrief  the fixed brief for this slot
       opts.student    name printed in the corner, may be empty
       opts.partName   slug        -> printed name
       opts.partColor  slug        -> category colour
       opts.partCat    slug        -> category short name
       done(canvas)

   The canvas is drawn tall and then cropped to what was used, so a
   long card grows downwards instead of being cut off.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var W = 1240, M = 72, GAP = 40;
var CW = W - M * 2;              // content width
var COL = (CW - GAP) / 2;        // one of two columns
var MAXH = 12000;                // scratch height, cropped at the end

var INK = '#16181c', DIM = '#5c636e', RULE = '#c9cfd7',
    FILL = '#f4f6f9', MID = '#eef1f5', PAPER = '#ffffff';

var MONO = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
var BODY = 'Lexend, "Helvetica Neue", Helvetica, Arial, sans-serif';

/* ── text helpers ─────────────────────────────────────────────────── */

function font(ctx, weight, size, family) {
  ctx.font = weight + ' ' + size + 'px ' + family;
}

/* Canvas will not wrap, so lines are measured a word at a time. */
function wrapLines(ctx, text, maxW) {
  var words = String(text == null ? '' : text).split(/\s+/).filter(Boolean);
  var lines = [], line = '';
  for (var i = 0; i < words.length; i++) {
    var trial = line ? line + ' ' + words[i] : words[i];
    if (ctx.measureText(trial).width <= maxW || !line) {
      line = trial;
    } else {
      lines.push(line);
      line = words[i];
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

/* ctx.letterSpacing is too new to rely on, so labels are spaced by
   hand. Returns the width drawn. */
function spaced(ctx, text, x, y, extra) {
  var t = String(text), cx = x;
  for (var i = 0; i < t.length; i++) {
    ctx.fillText(t[i], cx, y);
    cx += ctx.measureText(t[i]).width + extra;
  }
  return cx - x;
}

function para(ctx, text, x, y, w, size, color, weight) {
  font(ctx, weight || 400, size, BODY);
  ctx.fillStyle = color || INK;
  var lines = wrapLines(ctx, text, w), lh = Math.round(size * 1.42);
  for (var i = 0; i < lines.length; i++) ctx.fillText(lines[i], x, y + i * lh);
  return lines.length * lh;
}

/* A small uppercase label with a hairline under it, the same shape the
   printed sheet uses. */
function label(ctx, text, x, y, w) {
  font(ctx, 700, 15, MONO);
  ctx.fillStyle = DIM;
  spaced(ctx, String(text).toUpperCase(), x, y, 1.6);
  ctx.fillStyle = RULE;
  ctx.fillRect(x, y + 9, w, 1);
  return 28;
}

/* ── one labelled block, returns the height it used ───────────────── */

function fieldBlock(ctx, lab, text, x, y, w) {
  var h = label(ctx, lab, x, y, w);
  var v = String(text == null ? '' : text).trim();
  if (v) {
    h += para(ctx, v, x, y + h + 14, w, 19);
  } else {
    font(ctx, 400, 19, BODY);
    ctx.fillStyle = '#9aa2ad';
    ctx.fillText('Not filled in', x, y + h + 14);
    h += 27;
  }
  return h + 20;
}

function listBlock(ctx, lab, items, x, y, w, empty, opts) {
  opts = opts || {};
  var h = label(ctx, lab, x, y, w);
  y += h + 14;
  if (!items.length) {
    font(ctx, 400, 19, BODY);
    ctx.fillStyle = '#9aa2ad';
    ctx.fillText(empty, x, y);
    return h + 27 + 20;
  }
  var used = 0;
  items.forEach(function (it) {
    if (it.color) {
      ctx.fillStyle = it.color;
      ctx.fillRect(x, y + used - 12, 5, 16);
    }
    var tx = it.color ? x + 16 : x;
    var tw = w - (tx - x);
    font(ctx, 600, 19, BODY);
    ctx.fillStyle = INK;
    var nameW = ctx.measureText(it.name).width;
    ctx.fillText(it.name, tx, y + used);
    if (it.note) {
      /* Try to keep the note on the same line, wrap under if it will
         not fit. */
      font(ctx, 400, 19, BODY);
      ctx.fillStyle = DIM;
      var note = '— ' + it.note;
      if (nameW + 10 + ctx.measureText(note).width <= tw) {
        ctx.fillText(note, tx + nameW + 10, y + used);
        used += 28;
      } else {
        used += 28;
        used += para(ctx, note, tx, y + used, tw, 18, DIM);
        used += 4;
      }
    } else {
      used += 28;
    }
  });
  return h + 14 + used + 12;
}

/* ── the block diagram ────────────────────────────────────────────── */

function diagram(ctx, c, opts, x, y, w) {
  var h = label(ctx, 'Block diagram', x, y, w);
  y += h + 18;

  var boxW = 300, boxH = 76, vgap = 18;
  var colX = [x, x + w / 2 - boxW / 2, x + w - boxW];
  var rows = Math.max(c.inParts.length, c.outParts.length, 1);
  var bodyH = Math.max(rows * boxH + (rows - 1) * vgap, 150);

  font(ctx, 700, 14, MONO);
  ctx.fillStyle = DIM;
  ['Senses', 'Decides', 'Acts'].forEach(function (t, i) {
    var txt = t.toUpperCase();
    /* measure the spaced width so the label can be centred */
    var wide = 0;
    for (var k = 0; k < txt.length; k++) wide += ctx.measureText(txt[k]).width + 2.4;
    spaced(ctx, txt, colX[i] + boxW / 2 - wide / 2, y, 2.4);
  });
  y += 24;

  function roundRect(bx, by, bw, bh, r) {
    ctx.beginPath();
    ctx.moveTo(bx + r, by);
    ctx.arcTo(bx + bw, by, bx + bw, by + bh, r);
    ctx.arcTo(bx + bw, by + bh, bx, by + bh, r);
    ctx.arcTo(bx, by + bh, bx, by, r);
    ctx.arcTo(bx, by, bx + bw, by, r);
    ctx.closePath();
  }

  function partBox(bx, by, slug) {
    roundRect(bx, by, boxW, boxH, 10);
    ctx.fillStyle = FILL; ctx.fill();
    ctx.strokeStyle = RULE; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = opts.partColor(slug);
    ctx.fillRect(bx, by + 8, 5, boxH - 16);
    font(ctx, 600, 21, BODY);
    ctx.fillStyle = INK;
    ctx.fillText(opts.partName(slug), bx + 20, by + 33);
    font(ctx, 400, 16, BODY);
    ctx.fillStyle = DIM;
    ctx.fillText(opts.partCat(slug), bx + 20, by + 57);
  }

  function arrow(x1, yy, x2) {
    ctx.strokeStyle = RULE; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(x1, yy); ctx.lineTo(x2 - 11, yy); ctx.stroke();
    ctx.fillStyle = RULE;
    ctx.beginPath();
    ctx.moveTo(x2 - 12, yy - 7); ctx.lineTo(x2, yy); ctx.lineTo(x2 - 12, yy + 7);
    ctx.closePath(); ctx.fill();
  }

  function colTop(n) { return y + (bodyH - (n * boxH + (n - 1) * vgap)) / 2; }

  function emptyBox(bx) {
    var by = y + bodyH / 2 - boxH / 2;
    ctx.save();
    ctx.setLineDash([8, 6]);
    roundRect(bx, by, boxW, boxH, 10);
    ctx.strokeStyle = RULE; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
    font(ctx, 400, 17, BODY);
    ctx.fillStyle = '#9aa2ad';
    var t = 'No part named yet';
    ctx.fillText(t, bx + boxW / 2 - ctx.measureText(t).width / 2, by + boxH / 2 + 6);
  }

  if (c.inParts.length) {
    var yi = colTop(c.inParts.length);
    c.inParts.forEach(function (slug, k) {
      var by = yi + k * (boxH + vgap);
      partBox(colX[0], by, slug);
      arrow(colX[0] + boxW, by + boxH / 2, colX[1]);
    });
  } else {
    emptyBox(colX[0]);
    arrow(colX[0] + boxW, y + bodyH / 2, colX[1]);
  }

  roundRect(colX[1], y, boxW, bodyH, 10);
  ctx.fillStyle = MID; ctx.fill();
  ctx.strokeStyle = RULE; ctx.lineWidth = 2.5; ctx.stroke();
  var dec = String(c.deciding || '').trim();
  font(ctx, 400, 19, BODY);
  ctx.fillStyle = dec ? INK : '#9aa2ad';
  var dl = wrapLines(ctx, dec || 'What must it be deciding?', boxW - 44);
  if (dl.length > 6) { dl = dl.slice(0, 6); dl[5] = dl[5].replace(/[,.;]?$/, '') + '…'; }
  var dy = y + bodyH / 2 - (dl.length - 1) * 13;
  dl.forEach(function (ln, k) {
    ctx.fillText(ln, colX[1] + boxW / 2 - ctx.measureText(ln).width / 2, dy + k * 26);
  });

  if (c.outParts.length) {
    var yo = colTop(c.outParts.length);
    c.outParts.forEach(function (slug, k) {
      var by = yo + k * (boxH + vgap);
      arrow(colX[1] + boxW, by + boxH / 2, colX[2]);
      partBox(colX[2], by, slug);
    });
  } else {
    arrow(colX[1] + boxW, y + bodyH / 2, colX[2]);
    emptyBox(colX[2]);
  }

  return h + 18 + 24 + bodyH + 26;
}

/* ── controls and lights table ────────────────────────────────────── */

function controlsTable(ctx, c, x, y, w) {
  var h = label(ctx, 'Controls and lights', x, y, w);
  y += h + 14;
  if (!c.controls.length) {
    font(ctx, 400, 19, BODY);
    ctx.fillStyle = '#9aa2ad';
    ctx.fillText('None listed', x, y);
    return h + 27 + 20;
  }

  var cw = [w * 0.28, w * 0.16, w * 0.56], pad = 12, used = 0;

  font(ctx, 700, 14, MONO);
  ctx.fillStyle = MID;
  ctx.fillRect(x, y - 18, w, 34);
  ctx.fillStyle = DIM;
  ['What it is', 'Kind', 'What a user must already know'].forEach(function (t, k) {
    var cx = x + pad + (k ? cw.slice(0, k).reduce(function (a, b) { return a + b; }, 0) : 0);
    spaced(ctx, t.toUpperCase(), cx, y + 4, 1.4);
  });
  used += 34;

  c.controls.forEach(function (row) {
    var cells = [row.label || '', row.kind || '', row.mustKnow || ''];
    font(ctx, 400, 18, BODY);
    var lineCounts = cells.map(function (t, k) {
      return wrapLines(ctx, t, cw[k] - pad * 2).length;
    });
    var rowH = Math.max.apply(null, lineCounts) * 26 + 18;
    var top = y - 18 + used;

    ctx.strokeStyle = RULE; ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, top + 0.5, w - 1, rowH);

    cells.forEach(function (t, k) {
      var cx = x + pad + (k ? cw.slice(0, k).reduce(function (a, b) { return a + b; }, 0) : 0);
      para(ctx, t, cx, top + 27, cw[k] - pad * 2, 18);
    });
    used += rowH;
  });

  ctx.strokeStyle = RULE; ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y - 18 + 0.5, w - 1, used);

  return h + 14 + used + 12;
}

/* ── the photo ────────────────────────────────────────────────────── */

/* Cover-crop, so a portrait phone photo does not stretch. */
function drawPhoto(ctx, img, x, y, w, h) {
  var r = Math.max(w / img.width, h / img.height);
  var dw = img.width * r, dh = img.height * r;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  ctx.restore();
  ctx.strokeStyle = RULE; ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 0.75, y + 0.75, w - 1.5, h - 1.5);
}

/* ── fonts have to be ready or canvas silently falls back ─────────── */

function withFonts(cb) {
  if (!document.fonts || !document.fonts.load) { cb(); return; }
  var want = [
    '800 44px "JetBrains Mono"', '700 15px "JetBrains Mono"', '700 14px "JetBrains Mono"',
    '400 19px Lexend', '600 19px Lexend', '600 21px Lexend', '400 16px Lexend'
  ];
  Promise.all(want.map(function (f) { return document.fonts.load(f); }))
    .then(function () { cb(); }, function () { cb(); });
}

function loadImage(src, cb) {
  if (!src) { cb(null); return; }
  var img = new Image();
  img.onload = function () { cb(img); };
  img.onerror = function () { cb(null); };
  img.src = src;
}

/* ── the whole card ───────────────────────────────────────────────── */

function render(c, i, opts, done) {
  withFonts(function () {
    loadImage(c.photo, function (img) {
      var cv = document.createElement('canvas');
      cv.width = W; cv.height = MAXH;
      var ctx = cv.getContext('2d');
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, W, MAXH);

      var y = M + 16;

      /* masthead */
      font(ctx, 700, 15, MONO);
      ctx.fillStyle = DIM;
      spaced(ctx, ('Black Box Card ' + (i + 1) + ' of 4  /  Aiii').toUpperCase(), M, y, 1.6);
      if (opts.student) {
        var s = opts.student.toUpperCase(), sw = 0;
        for (var k = 0; k < s.length; k++) sw += ctx.measureText(s[k]).width + 1.6;
        spaced(ctx, s, M + CW - sw, y, 1.6);
      }
      y += 46;

      font(ctx, 800, 44, MONO);
      ctx.fillStyle = INK;
      var title = wrapLines(ctx, (c.name || '').trim() || opts.slotBrief, CW);
      title.forEach(function (ln) { ctx.fillText(ln, M, y); y += 54; });

      y += 4;
      y += para(ctx, opts.slotBrief, M, y, CW, 20, DIM);
      y += 18;
      ctx.fillStyle = INK;
      ctx.fillRect(M, y, CW, 3);
      y += 40;

      /* photo beside the plain facts, or facts across two columns */
      var facts = [
        ['Who it is for', c.who], ['What it costs', c.cost],
        ['Where it lives', c.lives], ['Power', c.powerSource]
      ];
      if (img) {
        var ph = 360;
        drawPhoto(ctx, img, M, y, COL, ph);
        var capH = 0;
        if (String(c.photoCaption || '').trim()) {
          capH = 8 + para(ctx, c.photoCaption, M, y + ph + 24, COL, 17, DIM);
        }
        var fy = y;
        facts.forEach(function (f) { fy += fieldBlock(ctx, f[0], f[1], M + COL + GAP, fy, COL); });
        y = Math.max(y + ph + 24 + capH, fy) + 14;
      } else {
        var ly = y, ry = y;
        facts.forEach(function (f, k) {
          if (k % 2 === 0) ly += fieldBlock(ctx, f[0], f[1], M, ly, COL);
          else ry += fieldBlock(ctx, f[0], f[1], M + COL + GAP, ry, COL);
        });
        y = Math.max(ly, ry);
      }

      /* a pair of blocks side by side, advancing past the taller one */
      function pair(la, ta, lb, tb) {
        var a = fieldBlock(ctx, la, ta, M, y, COL);
        var b = fieldBlock(ctx, lb, tb, M + COL + GAP, y, COL);
        y += Math.max(a, b);
      }

      pair('What it must be sensing', c.sensing, 'The evidence', c.evidence);

      var inList = c.inParts.map(function (s) {
        return { name: opts.partName(s), color: opts.partColor(s) };
      });
      var outList = c.ruledOut.map(function (r) {
        return { name: opts.partName(r.slug), color: opts.partColor(r.slug), note: r.why || 'no reason given' };
      });
      var ha = listBlock(ctx, 'Parts that could sense it', inList, M, y, COL, 'None named');
      var hb = listBlock(ctx, 'Ruled out, and how I know', outList, M + COL + GAP, y, COL, 'Nothing ruled out');
      y += Math.max(ha, hb);

      y += fieldBlock(ctx, 'What it must be deciding', c.deciding, M, y, CW);

      var hc = fieldBlock(ctx, 'What it does back', c.doesBack, M, y, COL);
      var hd = listBlock(ctx, 'Parts that could do it',
        c.outParts.map(function (s) { return { name: opts.partName(s), color: opts.partColor(s) }; }),
        M + COL + GAP, y, COL, 'None named');
      y += Math.max(hc, hd);

      y += diagram(ctx, c, opts, M, y, CW);
      y += controlsTable(ctx, c, M, y, CW);

      pair('What I would copy', c.copyThis, 'What I would leave behind', c.leaveThis);

      if (String(c.checkUrl || '').trim() || String(c.checkRight || '').trim() || String(c.checkWrong || '').trim()) {
        y += fieldBlock(ctx, 'Where I checked', c.checkUrl, M, y, CW);
        pair('Where I was right', c.checkRight, 'Where I was wrong', c.checkWrong);
      }

      /* footer, then crop the scratch canvas to what was actually used */
      y += 14;
      ctx.fillStyle = RULE;
      ctx.fillRect(M, y, CW, 1);
      y += 26;
      font(ctx, 700, 14, MONO);
      ctx.fillStyle = DIM;
      spaced(ctx, 'MYP DESIGN / GRADE 10 ELECTRONICS DESIGN', M, y, 1.4);
      var rt = 'AIII / BLACK BOX CARD ' + (i + 1), rw = 0;
      for (var q = 0; q < rt.length; q++) rw += ctx.measureText(rt[q]).width + 1.4;
      spaced(ctx, rt, M + CW - rw, y, 1.4);
      y += M;

      var out = document.createElement('canvas');
      out.width = W;
      out.height = Math.max(Math.round(y), 900);
      var octx = out.getContext('2d');
      octx.fillStyle = PAPER;
      octx.fillRect(0, 0, out.width, out.height);
      octx.drawImage(cv, 0, 0);
      done(out);
    });
  });
}

window.BBCardPNG = { render: render };

})();
