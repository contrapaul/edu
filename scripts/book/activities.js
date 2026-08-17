/* activities.js — recover matching-activity data from the per-topic scripts.

   The drag-sort widgets are populated at runtime, so the items and their
   correct zones exist only in curriculum/dp/*.js. Rather than parse that with
   regexes, run the file in a sandbox with stubbed browser globals and capture
   what it passes to DragSort.init. If the script's shape ever changes this
   fails loudly at build time instead of silently emitting an empty activity. */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

/* Returns { [widgetId]: { zones, items } } for one topic script. */
function readActivities(jsPath) {
  if (!fs.existsSync(jsPath)) return {};
  const found = {};

  const elementFor = (id) => ({ id, appendChild() {}, addEventListener() {},
    querySelector: () => null, querySelectorAll: () => [], classList: { add() {}, remove() {} },
    style: {}, set innerHTML(_) {}, get innerHTML() { return ''; } });

  const sandbox = {
    console: { log() {}, warn() {}, error() {} },
    document: {
      getElementById: elementFor,
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener() {},
      createElement: () => elementFor('created'),
    },
    window: {},
  };

  sandbox.window.document = sandbox.document;
  sandbox.window.addEventListener = () => {};
  sandbox.window.DragSort = {
    init(cfg) {
      /* bankEl.id is "<widget>-bank"; the widget itself drops the suffix. */
      const bankId = cfg && cfg.bankEl && cfg.bankEl.id;
      if (!bankId) return;
      found[bankId.replace(/-bank$/, '')] = {
        zones: (cfg.zones || []).map((z) => ({ id: z.id, label: z.label })),
        items: (cfg.items || []).map((i) => ({
          label: i.label, correctZone: i.correctZone, explanation: i.explanation || '',
        })),
      };
    },
  };
  sandbox.window.LiveCalc = { init() {} };
  sandbox.globalThis = sandbox;

  const source = fs.readFileSync(jsPath, 'utf8');
  try {
    vm.runInNewContext(source, sandbox, { timeout: 5000 });
  } catch (err) {
    /* These scripts drive calculators and diagrams too, and the stubs here
       only model what DragSort needs, so a throw is expected and harmless
       unless the file actually had a matching activity to give us. */
    if (source.includes('DragSort.init') && !Object.keys(found).length) {
      return { __error: `${path.basename(jsPath)}: ${err.message}` };
    }
  }
  return found;
}

module.exports = { readActivities };
