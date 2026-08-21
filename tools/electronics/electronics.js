/* ═══════════════════════════════════════════════════════════════════
   ELECTRONICS PARTS CATALOG: behaviour.
   Renders the grid, runs the filters, drives the detail panel.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const grid = $("grid"), empty = $("empty"), count = $("count");
  const modal = $("modal"), modalBox = $("modalBox"), modalScroll = $("modalScroll");
  const prevBtn = $("prevBtn"), nextBtn = $("nextBtn"), navPos = $("navPos");
  const searchInput = $("search"), clearBtn = $("clearBtn");

  const state = { search: "", category: new Set(), signal: new Set(), difficulty: new Set() };
  let visible = [];      // parts currently passing the filters
  let openIndex = -1;    // index into `visible`
  let lastFocused = null;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ── FILTER CHIPS ─────────────────────────────────────────────── */

  function chip(key, value, label, color) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ec-chip";
    b.setAttribute("aria-pressed", "false");
    b.dataset.key = key;
    b.dataset.value = value;
    if (color) {
      b.style.setProperty("--chip-color", color);
      b.innerHTML = '<span class="ec-chip-dot"></span>' + esc(label);
    } else {
      b.textContent = label;
    }
    b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", on ? "false" : "true");
      on ? state[key].delete(value) : state[key].add(value);
      apply();
    });
    return b;
  }

  function buildChips() {
    const catBox = $("chips-category");
    Object.entries(CATEGORIES).forEach(([key, c]) => catBox.appendChild(chip("category", key, c.short, c.color)));
    ["signal", "difficulty"].forEach((key) => {
      const box = $("chips-" + key);
      FILTERS[key].forEach((v) => box.appendChild(chip(key, v, v, null)));
    });
  }

  /* ── FILTERING ────────────────────────────────────────────────── */

  function matches(p) {
    if (state.category.size && !state.category.has(p.category)) return false;
    if (state.difficulty.size && !state.difficulty.has(p.difficulty)) return false;
    if (state.signal.size && !p.signal.some((s) => state.signal.has(s))) return false;
    if (state.search) {
      const hay = [p.name, p.blurb, p.alsoCalled.join(" "), CATEGORIES[p.category].name, p.signal.join(" ")]
        .join(" ").toLowerCase();
      if (!hay.includes(state.search)) return false;
    }
    return true;
  }

  function activeCount() {
    return state.category.size + state.signal.size + state.difficulty.size + (state.search ? 1 : 0);
  }

  function apply() {
    visible = PARTS.filter(matches);
    render();
    const n = visible.length, total = PARTS.length;
    count.textContent = n === total ? `${total} parts` : `${n} of ${total} parts`;
    empty.hidden = n > 0;
    clearBtn.hidden = activeCount() === 0;
  }

  function clearAll() {
    state.search = "";
    searchInput.value = "";
    ["category", "signal", "difficulty"].forEach((k) => state[k].clear());
    document.querySelectorAll('.ec-chip[aria-pressed="true"]').forEach((c) => c.setAttribute("aria-pressed", "false"));
    apply();
  }

  /* ── GRID ─────────────────────────────────────────────────────── */

  /* Every card is built around a photograph. Until one exists the slot
     draws itself as a hatched panel carrying the part name, so a card
     with no picture still reads at a distance. */
  function photo(p) {
    if (p.media.image) {
      return '<img src="' + esc(p.media.image.src) + '" alt="' + esc(p.media.image.alt) + '" loading="lazy">';
    }
    return '<span class="ec-card-photo-empty">' +
      '<span class="ec-photo-slug">' + esc(p.shortName || p.name) + "</span>" +
      '<span class="ec-photo-wait">Photo to come</span>' +
      "</span>";
  }

  function render() {
    grid.innerHTML = "";
    visible.forEach((p, i) => {
      const cat = CATEGORIES[p.category];
      const card = document.createElement("button");
      card.type = "button";
      card.className = "ec-card";
      card.dataset.index = i;
      card.style.setProperty("--cat-color", cat.color);
      card.setAttribute("aria-label", p.name + ". " + p.blurb);
      card.innerHTML =
        '<span class="ec-card-photo">' + photo(p) + "</span>" +
        '<span class="ec-card-body">' +
          '<span class="ec-card-cat">' + esc(cat.short) + "</span>" +
          '<span class="ec-card-title">' + esc(p.name) + "</span>" +
          '<span class="ec-card-blurb">' + esc(p.blurb) + "</span>" +
          '<span class="ec-card-tags">' +
            p.signal.slice(0, 3).map((s) => '<span class="ec-card-tag">' + esc(s) + "</span>").join("") +
          "</span>" +
        "</span>";
      card.addEventListener("click", () => open(i));
      grid.appendChild(card);
    });
  }

  /* ── DETAIL PANEL ─────────────────────────────────────────────── */

  function slot(kind, content, need, caption) {
    if (content) {
      return '<div class="ec-slot">' + content +
        (caption ? '<p class="ec-slot-caption">' + esc(caption) + "</p>" : "") + "</div>";
    }
    if (!need || /^not needed/i.test(need)) return "";
    return '<div class="ec-slot"><div class="ec-slot-empty">' +
      '<span class="ec-slot-kind">' + kind + " to come</span>" +
      '<p class="ec-slot-need">' + esc(need) + "</p></div></div>";
  }

  function img(m) {
    return m ? '<img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '" loading="lazy">' : null;
  }

  function detailHTML(p) {
    const cat = CATEGORIES[p.category];
    let h = "";

    h += '<div class="ec-detail-head">';
    h += '<p class="ec-detail-cat">' + esc(cat.name) + "</p>";
    h += '<h2 id="modalTitle">' + esc(p.name) + "</h2>";
    if (p.alsoCalled.length) h += '<p class="ec-detail-alias">Also called: ' + esc(p.alsoCalled.join(", ")) + "</p>";
    h += '<div class="ec-detail-meta">';
    h += '<span class="ec-meta-tag ec-meta-tag-strong">' + esc(p.difficulty) + " to wire</span>";
    h += '<span class="ec-meta-tag">' + esc(p.voltage) + "</span>";
    p.signal.forEach((s) => { h += '<span class="ec-meta-tag">' + esc(s) + "</span>"; });
    h += "</div></div>";

    h += '<div class="ec-sec"><h3>What it is</h3>' + p.whatItIs.map((t) => "<p>" + esc(t) + "</p>").join("") + "</div>";

    if (p.pins.length) {
      h += '<div class="ec-sec"><h3>Pins and connections</h3><table class="ec-pins">' +
        "<thead><tr><th>Pin</th><th>Kind</th><th>What it does</th></tr></thead><tbody>" +
        p.pins.map((pin) =>
          "<tr>" +
          '<td class="ec-pin-name">' + esc(pin.name) + "</td>" +
          '<td class="ec-pin-type">' + esc(pin.type) + "</td>" +
          "<td>" + esc(pin.note) + "</td>" +
          "</tr>").join("") +
        "</tbody></table></div>";
    }

    h += '<div class="ec-sec"><h3>Wiring it up</h3><ol class="ec-steps">' +
      p.wiring.map((s) => "<li>" + esc(s) + "</li>").join("") + "</ol></div>";

    const media =
      slot("Photo", img(p.media.image), p.media.imageNeed, p.media.image && p.media.image.caption) +
      slot("Close-up", img(p.media.detail), p.media.detailNeed, p.media.detail && p.media.detail.caption);
    if (media) h += '<div class="ec-sec"><h3>See it</h3><div class="ec-media">' + media + "</div></div>";

    h += '<div class="ec-sec"><h3>Watch out for</h3><ul class="ec-warn">' +
      p.watchOut.map((w) => "<li>" + esc(w) + "</li>").join("") + "</ul></div>";

    if (p.goesWith.length) {
      h += '<div class="ec-sec"><h3>Goes with</h3><div class="ec-goes">' +
        p.goesWith.map((slug) => {
          const other = PARTS.find((x) => x.slug === slug);
          if (!other) return "";
          return '<button type="button" class="ec-goes-chip" data-goto="' + esc(slug) + '"' +
            ' style="--go-color:' + CATEGORIES[other.category].color + '">' + esc(other.name) + "</button>";
        }).join("") +
        "</div></div>";
    }

    h += '<div class="ec-sec"><h3>Use it for</h3><div class="ec-use"><p>' + esc(p.useItFor) + "</p></div></div>";

    if (p.links.length) {
      h += '<div class="ec-sec"><h3>Find out more</h3><div class="ec-links">' +
        p.links.map((l) =>
          '<a class="ec-link" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="ec-link-kind">' + esc(l.kind) + "</span>" +
          '<span class="ec-link-label">' + esc(l.label) + "</span>" +
          (l.vpn ? '<span class="ec-link-vpn" title="This site may not load without a VPN">VPN</span>' : "") +
          "</a>").join("") +
        "</div></div>";
    }
    return h;
  }

  function show(i) {
    const p = visible[i];
    openIndex = i;
    modalBox.style.setProperty("--cat-color", CATEGORIES[p.category].color);
    modalScroll.innerHTML = detailHTML(p);
    modalScroll.querySelectorAll("[data-goto]").forEach((b) =>
      b.addEventListener("click", () => goTo(b.dataset.goto)));
    modalScroll.scrollTop = 0;
    navPos.textContent = (i + 1) + " / " + visible.length;
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === visible.length - 1;
    history.replaceState(null, "", "#" + p.slug);
  }

  /* A related part may be filtered out of the current set. Rather than
     fail quietly, drop the filters and go there. */
  function goTo(slug) {
    let i = visible.findIndex((x) => x.slug === slug);
    if (i === -1) {
      clearAll();
      i = visible.findIndex((x) => x.slug === slug);
    }
    if (i > -1) show(i);
  }

  function open(i) {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    show(i);
    modalBox.querySelector(".ec-modal-close").focus();
  }

  function close() {
    const wasOn = openIndex;
    modal.hidden = true;
    document.body.style.overflow = "";
    openIndex = -1;
    history.replaceState(null, "", location.pathname + location.search);
    /* Return focus to the card just being read, not the one that opened
       the panel, since the arrows may have moved on since then. */
    const card = grid.children[wasOn];
    if (card) card.focus();
    else if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
  }

  function step(d) {
    const i = openIndex + d;
    if (i >= 0 && i < visible.length) show(i);
  }

  /* Keep tabbing inside the dialog while it is open. */
  function trap(e) {
    if (e.key !== "Tab" || modal.hidden) return;
    const items = modalBox.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ── WIRING ───────────────────────────────────────────────────── */

  buildChips();
  apply();

  searchInput.addEventListener("input", () => { state.search = searchInput.value.trim().toLowerCase(); apply(); });
  clearBtn.addEventListener("click", clearAll);
  document.querySelectorAll("[data-clear-all]").forEach((b) => b.addEventListener("click", clearAll));

  const moreToggle = $("moreToggle"), more = $("moreFilters");
  moreToggle.addEventListener("click", () => {
    const on = moreToggle.getAttribute("aria-expanded") === "true";
    moreToggle.setAttribute("aria-expanded", on ? "false" : "true");
    more.classList.toggle("open", !on);
  });

  modal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", close));
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
    else trap(e);
  });

  /* Deep link straight to one part. */
  if (location.hash) {
    const i = visible.findIndex((p) => p.slug === location.hash.slice(1));
    if (i > -1) open(i);
  }
})();
