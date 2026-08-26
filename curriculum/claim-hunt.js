/* claim-hunt.js — shared engine for "find the unsupported claims" widgets.
   A short piece of writing is rendered as clickable sentences. The reader
   selects the ones they think assert something without supporting it, then
   checks. Every sentence carries its own verdict, so the feedback is specific
   rather than a score.

   Page-specific content (the sentences, which are weak, and why) lives in each
   page's own <page>.js file. This file only builds the widget and handles the
   interaction, the same split drag-sort.js uses.

   Marked results are carried by a word as well as a colour, so the three
   outcomes stay apart for a colour blind reader. */
window.ClaimHunt = (function () {
  'use strict';

  var DEFAULTS = {
    prompt: 'Click the sentences that make a claim without supporting it.',
    weakLabel: 'Unjustified',
    okLabel: 'Justified'
  };

  function init(config) {
    var briefEl = config.briefEl;
    if (!briefEl) return;

    var sentences = config.sentences;
    var target = config.target || sentences.filter(function (s) { return s.weak; }).length;
    var statusEl = config.statusEl, verdictsEl = config.verdictsEl;
    var prompt = config.prompt || DEFAULTS.prompt;
    var weakLabel = config.weakLabel || DEFAULTS.weakLabel;
    var okLabel = config.okLabel || DEFAULTS.okLabel;

    var buttons = [];
    var checked = false;

    function selectedCount() {
      return buttons.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
    }

    function updateStatus() {
      if (checked) return;
      var n = selectedCount();
      statusEl.textContent = n === 0
        ? prompt
        : n + ' of ' + target + ' selected.' +
          (n > target ? ' That is too many; unselect one.' : '');
    }

    function build() {
      briefEl.innerHTML = '';
      buttons = [];
      checked = false;
      verdictsEl.innerHTML = '';
      sentences.forEach(function (s) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'unit-claim';
        b.textContent = s.text;
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () {
          if (checked) return;
          b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
          updateStatus();
        });
        briefEl.appendChild(b);
        briefEl.appendChild(document.createTextNode(' '));
        buttons.push(b);
      });
      updateStatus();
    }

    function check() {
      if (checked) return;
      if (selectedCount() !== target) { updateStatus(); return; }
      checked = true;
      var found = 0;
      buttons.forEach(function (b, i) {
        var s = sentences[i];
        var picked = b.getAttribute('aria-pressed') === 'true';
        b.classList.remove('is-correct', 'is-wrong', 'is-missed');
        b.classList.add('is-marked');
        if (picked && s.weak)       { b.classList.add('is-correct'); found++; }
        else if (picked && !s.weak) { b.classList.add('is-wrong'); }
        else if (!picked && s.weak) { b.classList.add('is-missed'); }
        b.setAttribute('aria-pressed', 'false');
      });

      statusEl.textContent = found === target
        ? (config.allFound || 'All ' + target + ' found.')
        : found + ' of ' + target + ' found. Read the verdicts below for the ones you missed.';

      verdictsEl.innerHTML = '';
      sentences.forEach(function (s) {
        var d = document.createElement('div');
        d.className = 'unit-verdict' + (s.weak ? ' ok' : '');
        var n = document.createElement('span');
        n.className = 'unit-verdict-name';
        n.textContent = s.weak ? weakLabel + ': ' + s.fault : okLabel;
        d.appendChild(n);
        d.appendChild(document.createTextNode(s.why));
        verdictsEl.appendChild(d);
      });
    }

    config.checkBtn.addEventListener('click', check);
    config.resetBtn.addEventListener('click', function () {
      build();
      statusEl.textContent = prompt;
    });
    build();
  }

  return { init: init };
})();
