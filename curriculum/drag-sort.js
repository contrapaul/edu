/* drag-sort.js — shared engine for click-to-select, click-to-place category-sort
   widgets. Interaction is click/tap an item, then click/tap a zone to place it —
   chosen over native HTML5 drag-and-drop, which doesn't work on touch devices and
   isn't keyboard-accessible (see expandedplans.md's "Decisions locked in" note).
   Page-specific content (items/zones/explanations) lives in each page's own
   <page>.js file; this only builds the widget and handles the interaction.

   Two modes, picked automatically by config shape:
   - Single-axis (default): one bank, one row of zones. An item's `correctZone`
     can be a single zone id, or an array of ids if more than one answer should
     count as correct (e.g. a deliberately ambiguous item).
   - Dual-axis (pass `zonesEl2`/`zones2`): two independent zone rows. Each item
     needs both `correctZone` (axis 1) and `correctZone2` (axis 2) matched
     before it's considered fully solved; getting one right without the other
     leaves it in the bank, marked partially done, so it can be picked up again
     for the remaining axis. */
window.DragSort = (function () {
  'use strict';

  function matchesZone(correctValue, zoneId) {
    return Array.isArray(correctValue) ? correctValue.indexOf(zoneId) !== -1 : correctValue === zoneId;
  }

  function buildZoneRow(zonesEl, zones) {
    zonesEl.innerHTML = '';
    var parts = {};
    zones.forEach(function (zone) {
      var wrap = document.createElement('div');
      wrap.className = 'drag-sort-zone-wrap';

      var zoneBtn = document.createElement('button');
      zoneBtn.type = 'button';
      zoneBtn.className = 'drag-sort-zone-btn';
      zoneBtn.textContent = zone.label;

      var slot = document.createElement('div');
      slot.className = 'drag-sort-zone-slot';

      wrap.appendChild(zoneBtn);
      wrap.appendChild(slot);
      wrap.dataset.zone = zone.id;
      zonesEl.appendChild(wrap);
      parts[zone.id] = { wrap: wrap, btn: zoneBtn, slot: slot };
    });
    return parts;
  }

  function buildBankItem(item, onClick) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'drag-sort-item';
    btn.textContent = item.label;
    btn.dataset.item = item.id;
    btn.addEventListener('click', function () { onClick(btn, item); });
    return btn;
  }

  function renderSolvedCard(slotEl, item, explanationText) {
    var card = document.createElement('div');
    card.className = 'drag-sort-solved-card';
    var q = document.createElement('p');
    q.className = 'drag-sort-solved-q';
    q.textContent = item.label;
    var exp = document.createElement('p');
    exp.className = 'drag-sort-solved-explanation';
    exp.textContent = explanationText;
    card.appendChild(q);
    card.appendChild(exp);
    slotEl.appendChild(card);
  }

  function statusMessage(count, wrongAttempts, fully) {
    var qualifier = fully ? 'fully matched' : 'matched correctly';
    return wrongAttempts === 0
      ? 'All ' + count + ' ' + qualifier + ', first try on every one.'
      : 'All ' + count + ' ' + qualifier + ' (' + wrongAttempts + ' incorrect ' +
        (wrongAttempts === 1 ? 'try' : 'tries') + ' along the way).';
  }


  /* Optional pointer based dragging, switched on per widget with
     `enableDrag: true`. Pointer events rather than HTML5 drag, so a finger
     works as well as a mouse. Clicking is untouched and still does the same
     job, which keeps the widget usable by keyboard and by anyone who does
     not drag. Only single-axis mode wires this up; dual-axis widgets ignore
     the flag. */
  function attachDragging(itemBtn, item, zonesEl, onDrop, state) {
    var drag = null;

    function ghostFor(x, y) {
      var g = itemBtn.cloneNode(true);
      g.classList.add('drag-sort-ghost');
      g.style.width = itemBtn.getBoundingClientRect().width + 'px';
      g.style.left = x + 'px';
      g.style.top = y + 'px';
      document.body.appendChild(g);
      itemBtn.classList.add('is-dragging');
      return g;
    }

    function wrapUnder(x, y) {
      var el = document.elementFromPoint(x, y);
      return el ? el.closest('.drag-sort-zone-wrap') : null;
    }

    function clearHover() {
      if (!drag || !drag.over) return;
      drag.over.classList.remove('drag-over');
      drag.over = null;
    }

    itemBtn.addEventListener('pointerdown', function (e) {
      drag = { moved: false, ghost: null, over: null };
      itemBtn.setPointerCapture(e.pointerId);
    });

    itemBtn.addEventListener('pointermove', function (e) {
      if (!drag) return;
      if (!drag.moved) { drag.moved = true; drag.ghost = ghostFor(e.clientX, e.clientY); }
      drag.ghost.style.left = e.clientX + 'px';
      drag.ghost.style.top = e.clientY + 'px';
      var wrap = wrapUnder(e.clientX, e.clientY);
      if (drag.over !== wrap) {
        clearHover();
        if (wrap) { wrap.classList.add('drag-over'); drag.over = wrap; }
      }
    });

    function finish(e) {
      if (!drag) return;
      var d = drag;
      clearHover();
      drag = null;
      if (d.ghost) d.ghost.remove();
      itemBtn.classList.remove('is-dragging');
      if (!d.moved) return;                 // a plain click; the click handler has it
      state.suppressClick = true;           // a real drag, so ignore the click that follows
      var wrap = wrapUnder(e.clientX, e.clientY);
      if (wrap) onDrop(wrap.dataset.zone, itemBtn, item);
    }

    itemBtn.addEventListener('pointerup', finish);
    itemBtn.addEventListener('pointercancel', function () {
      if (!drag) return;
      clearHover();
      if (drag.ghost) drag.ghost.remove();
      itemBtn.classList.remove('is-dragging');
      drag = null;
    });
  }

  // ── SINGLE-AXIS MODE ─────────────────────────────────────────
  function initSingleAxis(config) {
    var bankEl = config.bankEl, zonesEl = config.zonesEl;
    var statusEl = config.statusEl, resetBtn = config.resetBtn;
    var items = config.items, zones = config.zones;
    var selected = null, solvedCount = 0, wrongAttempts = 0, zoneParts = {};
    var dragState = { suppressClick: false };

    function onItemClick(btn, item) {
      if (dragState.suppressClick) { dragState.suppressClick = false; return; }
      selectItem(btn, item);
    }

    /* Dropping straight onto a zone selects the item and places it in one go. */
    function dropOn(zoneId, btn, item) {
      selected = { btn: btn, item: item };
      btn.classList.add('selected');
      attemptPlace(zoneId);
    }

    function build() {
      bankEl.innerHTML = '';
      statusEl.textContent = '';
      statusEl.classList.remove('drag-sort-status--complete');
      selected = null; solvedCount = 0; wrongAttempts = 0;
      dragState.suppressClick = false;

      items.forEach(function (item) {
        var btn = buildBankItem(item, onItemClick);
        if (config.enableDrag) attachDragging(btn, item, zonesEl, dropOn, dragState);
        bankEl.appendChild(btn);
      });

      zoneParts = buildZoneRow(zonesEl, zones);
      Object.keys(zoneParts).forEach(function (zoneId) {
        zoneParts[zoneId].wrap.addEventListener('click', function () { attemptPlace(zoneId); });
      });
    }

    function selectItem(btn, item) {
      if (selected && selected.btn === btn) { btn.classList.remove('selected'); selected = null; return; }
      if (selected) selected.btn.classList.remove('selected');
      selected = { btn: btn, item: item };
      btn.classList.add('selected');
    }

    function attemptPlace(zoneId) {
      var parts = zoneParts[zoneId];
      if (!selected) return;
      var item = selected.item, itemBtn = selected.btn;

      if (matchesZone(item.correctZone, zoneId)) {
        itemBtn.remove();
        renderSolvedCard(parts.slot, item, item.explanation);
        parts.wrap.classList.add('solved'); // visual only — a zone can hold more than one correct item
        selected = null;
        solvedCount++;
        if (solvedCount === items.length) {
          statusEl.textContent = statusMessage(items.length, wrongAttempts, false);
          statusEl.classList.add('drag-sort-status--complete');
        }
      } else {
        wrongAttempts++;
        parts.wrap.classList.add('flash-incorrect');
        setTimeout(function () { parts.wrap.classList.remove('flash-incorrect'); }, 450);
        itemBtn.classList.remove('selected');
        selected = null;
      }
    }

    if (resetBtn) resetBtn.addEventListener('click', build);
    build();
  }

  // ── DUAL-AXIS MODE ───────────────────────────────────────────
  function initDualAxis(config) {
    var bankEl = config.bankEl, statusEl = config.statusEl, resetBtn = config.resetBtn;
    var items = config.items;
    var selected = null, solvedCount = 0, wrongAttempts = 0, progress = {};

    function build() {
      bankEl.innerHTML = '';
      statusEl.textContent = '';
      statusEl.classList.remove('drag-sort-status--complete');
      selected = null; solvedCount = 0; wrongAttempts = 0; progress = {};

      items.forEach(function (item) {
        progress[item.id] = { axis1: false, axis2: false, btn: null };
        var btn = buildBankItem(item, selectItem);
        progress[item.id].btn = btn;
        bankEl.appendChild(btn);
      });

      var zoneParts1 = buildZoneRow(config.zonesEl, config.zones);
      Object.keys(zoneParts1).forEach(function (zoneId) {
        zoneParts1[zoneId].wrap.addEventListener('click', function () {
          attemptPlace('axis1', 'correctZone', zoneParts1[zoneId], zoneId);
        });
      });

      var zoneParts2 = buildZoneRow(config.zonesEl2, config.zones2);
      Object.keys(zoneParts2).forEach(function (zoneId) {
        zoneParts2[zoneId].wrap.addEventListener('click', function () {
          attemptPlace('axis2', 'correctZone2', zoneParts2[zoneId], zoneId);
        });
      });
    }

    function selectItem(btn, item) {
      if (selected && selected.btn === btn) { btn.classList.remove('selected'); selected = null; return; }
      if (selected) selected.btn.classList.remove('selected');
      selected = { btn: btn, item: item };
      btn.classList.add('selected');
    }

    function attemptPlace(axisKey, correctField, parts, zoneId) {
      if (!selected) return;
      var item = selected.item, itemBtn = selected.btn;
      var itemProgress = progress[item.id];
      if (itemProgress[axisKey]) return; // this axis already solved for this item

      if (matchesZone(item[correctField], zoneId)) {
        itemProgress[axisKey] = true;
        parts.wrap.classList.add('solved'); // visual only — a zone can hold more than one correct item
        renderSolvedCard(parts.slot, item, item.explanation);

        itemBtn.classList.remove('selected');
        selected = null;

        if (itemProgress.axis1 && itemProgress.axis2) {
          itemBtn.remove();
          solvedCount++;
          if (solvedCount === items.length) {
            statusEl.textContent = statusMessage(items.length, wrongAttempts, true);
            statusEl.classList.add('drag-sort-status--complete');
          }
        } else {
          itemBtn.classList.add('partial');
          itemBtn.title = 'One part matched — one more to go.';
        }
      } else {
        wrongAttempts++;
        parts.wrap.classList.add('flash-incorrect');
        setTimeout(function () { parts.wrap.classList.remove('flash-incorrect'); }, 450);
        itemBtn.classList.remove('selected');
        selected = null;
      }
    }

    if (resetBtn) resetBtn.addEventListener('click', build);
    build();
  }

  function init(config) {
    if (config.zonesEl2) return initDualAxis(config);
    return initSingleAxis(config);
  }

  return { init: init };
})();
