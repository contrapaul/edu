// Document-verification desk (Papers-Please style).
// Compares the Technical File against the Submission Form, row by row. Matching
// rows pass; discrepancies must be resolved before the dossier can be submitted.
// The player chooses to CORRECT a discrepancy (costs money) or ARGUE it is
// within tolerance (free, but wrong arguments get a REJECTED stamp).
//
// The component is presentational + interaction; the host owns money/reputation
// /persistence via the handlers it passes in.
//
// renderDocDesk(container, model, handlers)
//   model = { intro, checks: [{ id, doc, field, fileValue, formValue, match,
//                               arguable, correctCost, note, resolved }] }
//   handlers = {
//     onResolve(checkId, method) -> { ok, rejected, message }   // method: 'correct' | 'argue'
//     onCleared()                                               // all discrepancies resolved
//   }

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

export function renderDocDesk(container, model, handlers) {
  const checks = model.checks;

  const unresolvedDiscrepancies = () =>
    checks.filter(c => !c.match && !c.resolved).length;

  function rowHTML(c) {
    if (c.match) {
      return `<div class="doc-row match">
        <div class="doc-field"><span class="doc-doc">${c.doc}</span>${c.field}</div>
        <div class="doc-vals"><span class="doc-tf">${c.fileValue}</span><span class="doc-eq">＝</span><span class="doc-form">${c.formValue}</span></div>
        <div class="doc-action"><span class="doc-ok">✓ matches</span></div>
      </div>`;
    }

    let action;
    if (c.resolved === 'corrected') {
      action = `<span class="doc-stamp amended">AMENDED</span>`;
    } else if (c.resolved === 'argued') {
      action = `<span class="doc-stamp accepted">ACCEPTED · within tolerance</span>`;
    } else {
      const rejected = c.rejected ? `<span class="doc-stamp rejected">REJECTED</span>` : '';
      action = `${rejected}
        <button class="doc-btn correct" data-resolve="correct" data-check="${c.id}">Correct form · ${money(c.correctCost)}</button>
        ${c.rejected ? '' : `<button class="doc-btn argue" data-resolve="argue" data-check="${c.id}">Argue: within tolerance</button>`}`;
    }

    return `<div class="doc-row discrepancy${c.resolved ? ' resolved' : ''}">
      <div class="doc-field"><span class="doc-doc">${c.doc}</span>${c.field}</div>
      <div class="doc-vals"><span class="doc-tf">${c.fileValue}</span><span class="doc-neq">≠</span><span class="doc-form">${c.formValue}</span></div>
      <div class="doc-action">${action}</div>
      ${c.note && !c.resolved ? `<p class="doc-note">${c.note}</p>` : ''}
      ${c.msg ? `<p class="doc-msg ${c.msgKind}">${c.msg}</p>` : ''}
    </div>`;
  }

  function render() {
    const remaining = unresolvedDiscrepancies();
    container.innerHTML = `
      <div class="docdesk">
        <p class="phase-intro">${model.intro}</p>
        <div class="doc-legend"><span>Technical File</span><span>Submission Form</span></div>
        <div class="doc-rows">${checks.map(rowHTML).join('')}</div>
        <div class="phase-actions">
          <button class="btn-primary" id="submit-dossier" ${remaining ? 'disabled' : ''}>Submit dossier →</button>
          <span class="confirm-msg">${remaining ? `${remaining} discrepancy${remaining === 1 ? '' : 'ies'} unresolved.` : 'Dossier consistent — ready to submit.'}</span>
        </div>
      </div>`;

    container.querySelectorAll('[data-resolve]').forEach(btn => {
      btn.addEventListener('click', () => {
        const check = checks.find(c => c.id === btn.dataset.check);
        const method = btn.dataset.resolve;
        const res = handlers.onResolve(check.id, method) || {};
        if (method === 'correct') {
          if (res.ok) { check.resolved = 'corrected'; check.msg = null; }
          else { check.msg = res.message; check.msgKind = 'bad'; }
        } else { // argue
          if (res.ok) { check.resolved = 'argued'; check.msg = null; }
          else { check.rejected = true; check.msg = res.message; check.msgKind = 'bad'; }
        }
        render();
      });
    });

    const submit = container.querySelector('#submit-dossier');
    if (submit) submit.addEventListener('click', () => { if (unresolvedDiscrepancies() === 0) handlers.onCleared(); });
  }

  render();
}
