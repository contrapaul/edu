// Phase 4 — Certification Submission & Regulatory Navigation.
// Step A: the document-verification desk, fed discrepancies derived from the
//         earlier design + test choices.
// Step B: a piece of bureaucratic correspondence with a paid Translate option.

import { state, save } from '../state.js';
import { getMaterial, getSupplier } from '../content/materials.js';
import { renderDocDesk } from '../minigames/docverify.js';
import { getMorale, applyModifiers } from '../engine/events.js';

const TRANSLATE_BASE_COST = 200;
const GUNTHER_FREE_MORALE = 75;   // a happy Gunther translates gratis

// Build the comparison checks generically from the product definition + the
// player's design/test choices. Pure function of state, so it survives reloads
// without extra persistence. Works for any product, not just the speaker.
function buildChecks(def, p) {
  const certCfg = def.phases.certification;
  const matComp = def.components.find(c => c.kind === 'material');
  const material = matComp ? getMaterial(p.selectedMaterials[matComp.id]) : null;
  const critComp = def.components.find(c => c.critical);
  const critSupplier = critComp ? getSupplier(p.selectedSuppliers[critComp.id]) : null;

  const checks = [
    { id: 'model', doc: 'Form 1-A', field: 'Product model designation',
      fileValue: certCfg.modelName, formValue: certCfg.modelName, match: true }
  ];

  if (material) {
    checks.push({ id: 'material', doc: 'Form 3-B', field: certCfg.materialLabel ?? 'Declared housing material',
      fileValue: material.name, formValue: material.name, match: true });
  }

  // The product's one genuinely-arguable (within-tolerance) discrepancy.
  const tc = certCfg.toleranceCheck;
  if (tc) {
    checks.push({ id: tc.id, doc: tc.doc, field: tc.field, fileValue: tc.fileValue, formValue: tc.formValue,
      match: false, arguable: true, correctCost: tc.correctCost, note: tc.note });
  }

  // A real (must-correct) discrepancy reused across products.
  checks.push({ id: 'address', doc: 'Form 1-A', field: 'Applicant registered address',
    fileValue: 'Unit 4, 12 Maker Rd', formValue: 'Unit 4, 21 Maker Rd', match: false,
    arguable: false, correctCost: 150,
    note: 'Legal identity must be exact — a transposed street number is not "close enough".' });

  // Critical component with unverifiable certification.
  if (critSupplier && !critSupplier.docsComplete) {
    checks.push({ id: 'crit-cert', doc: 'Annex C', field: `${critComp.name} safety certificate`,
      fileValue: 'on file', formValue: 'unverifiable / pending', match: false,
      arguable: false, correctCost: certCfg.critCorrectCost ?? 2000,
      note: `${critSupplier.name} cannot produce a valid certificate. Re-source from an approved supplier.` });
  }

  // Test-report discrepancies, derived from the testing config + results.
  for (const test of def.phases.testing.tests) {
    const result = p.testResults.find(r => r.testId === test.id);
    const failing = result && (result.status === 'fail' || (result.status === 'conditional' && test.certRequired));
    const missing = !result && test.certRequired;
    if (failing) {
      checks.push({ id: `${test.id}-report`, doc: 'Annex E', field: `${test.name} report`,
        fileValue: 'PASS required', formValue: result.status.toUpperCase(), match: false,
        arguable: false, correctCost: test.certReworkCost ?? 1500,
        note: `A non-passing ${test.name} must be reworked and retested before submission.` });
    } else if (missing) {
      checks.push({ id: `${test.id}-report`, doc: 'Annex E', field: `${test.name} report`,
        fileValue: 'PASS required', formValue: 'MISSING', match: false,
        arguable: false, correctCost: test.certMissingCost ?? 2500,
        note: `Certification requires the ${test.name} report — you skipped it. Commission it now.` });
    }
  }

  return checks;
}

export function renderCertification(container, ctx) {
  const { def } = ctx;
  const cert = def.phases.certification;
  const p = state.product;

  if (!p.certification) p.certification = { resolved: {}, deskCleared: false };

  function paint() {
    if (p.certification.deskCleared) renderCorrespondence();
    else renderDesk();
  }

  function renderDesk() {
    const checks = buildChecks(def, p).map(c => ({
      ...c,
      resolved: p.certification.resolved[c.id] || null,
      // Apply sandbox modifiers to the correction fee so display == charge.
      correctCost: c.correctCost != null ? applyModifiers('cert-fee', c.correctCost) : c.correctCost
    }));

    renderDocDesk(container, { intro: cert.deskIntro, checks }, {
      onResolve(checkId, method) {
        const check = checks.find(c => c.id === checkId);
        if (method === 'correct') {
          const cost = check.correctCost;   // already modifier-adjusted at build
          if (state.budget < cost)
            return { ok: false, message: `Not enough budget to correct this (${cost}).` };
          state.budget -= cost;
          state.competitorProgress = Math.min(100, state.competitorProgress + 3);
          p.certification.resolved[checkId] = 'corrected';
          save(); ctx.refreshHud();
          return { ok: true };
        }
        // argue
        if (check.arguable) {
          p.certification.resolved[checkId] = 'argued';
          save();
          return { ok: true };
        }
        state.reputation = Math.max(0, state.reputation - 8);
        save();
        return { ok: false, message: 'Mr. Zhang stamps it REJECTED: "This is not within tolerance." You must correct it.' };
      },
      onCleared() {
        p.certification.deskCleared = true;
        save();
        renderCorrespondence();
      }
    });
  }

  function renderCorrespondence() {
    const L = cert.letter;
    const translator = ctx.character.staff.find(s => s.translator) || ctx.character.staff[0];
    let translated = false;
    let outcome = '';

    function draw() {
      const translateCost = getMorale(translator.id) >= GUNTHER_FREE_MORALE ? 0 : applyModifiers('cert-fee', TRANSLATE_BASE_COST);
      const translateLabel = translateCost === 0 ? `free — ${translator.name}'s in a good mood` : '$' + translateCost;
      container.innerHTML = `
        <div class="phase phase-cert-letter">
          <h2>Regulatory correspondence</h2>
          <div class="letter">
            <p class="letter-body">${L.body}</p>
            ${translated ? `<p class="letter-translation">${L.translation}</p>` : ''}
          </div>
          ${translated ? '' : `<button class="btn-secondary" id="translate">Ask ${translator.name} to translate · ${translateLabel}</button>`}
          <h3 class="resp-title">Your response</h3>
          <div class="responses">
            ${L.responses.map(r => `<button class="response" data-resp="${r.id}">${r.text}</button>`).join('')}
          </div>
          ${outcome ? `<p class="letter-outcome">${outcome}</p>` : ''}
        </div>`;

      const tr = container.querySelector('#translate');
      if (tr) tr.addEventListener('click', () => {
        const cost = getMorale(translator.id) >= GUNTHER_FREE_MORALE ? 0 : applyModifiers('cert-fee', TRANSLATE_BASE_COST);
        if (state.budget < cost) { outcome = 'Not enough budget for a translation.'; return draw(); }
        state.budget -= cost;
        save(); ctx.refreshHud();
        translated = true; draw();
      });

      container.querySelectorAll('[data-resp]').forEach(btn => {
        btn.addEventListener('click', () => {
          const resp = L.responses.find(r => r.id === btn.dataset.resp);
          if (resp.correct) {
            p.certification.granted = true;
            save();
            ctx.advance();
          } else {
            state.reputation = Math.max(0, state.reputation - 6);
            state.competitorProgress = Math.min(100, state.competitorProgress + 5);
            save(); ctx.refreshHud();
            outcome = resp.outcome;
            draw();
          }
        });
      });
    }

    draw();
  }

  paint();
}
