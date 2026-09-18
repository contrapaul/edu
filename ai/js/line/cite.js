/* ============================================================
   Citation builder
   ------------------------------------------------------------
   Say what you did with a tool and what the work is, and it
   writes the line you need: an MLA Works Cited entry and in-text
   citation, a credit line for a poster, a note in your own words,
   or a comment for a file. It also says when nothing is required,
   and when the tool is not the thing to cite (it found sources;
   cite those).

   The MLA forms follow the MLA Style Center's guidance on citing
   generative AI: a description of the prompt in quotation marks
   as the title, the tool as the container, version, company,
   date, and the address.

   Data: data/cite.json (strings and options) and data/models.json
   (tools). buildCitation() is pure and tested.
   ============================================================ */

import { markDone } from '../sample/progress.js';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/** Pure: an MLA date, "8 Mar. 2023". `iso` is YYYY-MM-DD. */
export function mlaDate(iso, months) {
  const [y, m, d] = String(iso).split('-').map(Number);
  if (!y || !m || !d) return '';
  return `${d} ${months[m - 1]} ${y}`;
}

/** Pure: a plain date, "8 March 2023". */
export function longDate(iso, monthsLong) {
  const [y, m, d] = String(iso).split('-').map(Number);
  if (!y || !m || !d) return '';
  return `${d} ${monthsLong[m - 1]} ${y}`;
}

/** Pure: the first few words of a prompt, for the in-text form. */
export function shortTitle(prompt, n = 3) {
  const words = String(prompt).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  return words.slice(0, n).join(' ') + (words.length > n ? '…' : '');
}

/**
 * Pure: the blocks to show for a use and a work.
 * input: { use, work, tool: {name, company, url}, version, date, prompt }
 * returns { blocks: [{ kind, label, text }], why: [keys], noneNeeded, sourcesNote }
 */
export function buildCitation(input, data) {
  const S = data.strings;
  const { use, work } = input;
  const tool = input.tool || {};
  const name = (tool.name || '').trim();
  const company = (tool.company || '').trim();
  const url = (tool.url || '').trim();
  const version = (input.version || '').trim();
  const prompt = (input.prompt || '').trim();
  const date = input.date || '';
  const mla = mlaDate(date, data.months);
  const plain = longDate(date, data.monthsLong);
  const blocks = [];
  const why = [];

  const worksCited = () => {
    const parts = [];
    parts.push(prompt ? `"${prompt}" prompt.` : '"Description of what you asked" prompt.');
    parts.push(name || 'Tool name');
    if (version) parts.push(version);
    if (company && company.toLowerCase() !== name.toLowerCase()) parts.push(company);   // no "DeepSeek, DeepSeek"
    if (mla) parts.push(mla);
    if (url) parts.push(url);
    return `${parts[0]} ${parts.slice(1).join(', ')}.`;
  };
  const inText = () => `("${shortTitle(prompt) || 'Description of what you asked'}")`;
  const did = {
    words: 'wrote a first version of some sentences, which I rewrote',
    image: 'made the image',
    ideas: 'suggested the outline and some of the ideas',
    edit: 'checked the grammar and wording',
    feedback: 'gave feedback on a draft, which I acted on',
    sources: 'helped find sources, each of which I opened and checked',
  }[use] || 'helped';
  const toolPhrase = name ? `${name}${company && company.toLowerCase() !== name.toLowerCase() ? ` (${company})` : ''}` : 'the tool';
  const when = plain ? ` on ${plain}` : '';
  const noteText = `I used ${toolPhrase}${when}. It ${did}.${prompt ? ` My request was: "${prompt}".` : ''}`;
  const creditText = use === 'image'
    ? `Image made with ${toolPhrase}${when}${prompt ? ` from the prompt "${prompt}"` : ''}.`
    : `Made with help from ${toolPhrase}${when}. It ${did}.`;
  const commentText = `// Written with help from ${toolPhrase}${when}.${prompt ? ` Prompt: "${prompt}".` : ''} Reviewed and edited by hand.`;

  if (work === 'private') {
    return { blocks: [{ kind: 'note', label: S.note, text: noteText }], why: ['private'], noneNeeded: true, sourcesNote: false };
  }
  if (use === 'sources') {
    return { blocks: [{ kind: 'note', label: S.note, text: noteText }], why: ['sources'], noneNeeded: false, sourcesNote: true };
  }

  const cites = use === 'words' || use === 'image' || use === 'ideas';
  if (work === 'code') {
    blocks.push({ kind: 'comment', label: S.comment, text: commentText });
    why.push('code');
  } else if (work === 'teaching') {
    blocks.push({ kind: 'credit', label: S.credit, text: creditText });
    if (cites) blocks.push({ kind: 'worksCited', label: S.worksCited, text: worksCited() });
    why.push('teaching');
  } else if (work === 'poster') {
    blocks.push({ kind: 'credit', label: S.credit, text: creditText });
    if (cites) blocks.push({ kind: 'worksCited', label: S.worksCited, text: worksCited() });
    why.push('poster');
    if (use === 'image') why.push('image');
  } else {
    // an essay or report
    if (cites) {
      blocks.push({ kind: 'worksCited', label: S.worksCited, text: worksCited() });
      blocks.push({ kind: 'inText', label: S.inText, text: inText() });
      if (use === 'image') blocks.push({ kind: 'credit', label: S.credit, text: creditText });
    } else {
      blocks.push({ kind: 'note', label: S.note, text: noteText });
    }
    why.push(use);
  }
  return { blocks, why, noneNeeded: false, sourcesNote: false };
}

export async function mountCite(root, { url = './data/cite.json', modelsUrl = './data/models.json' } = {}) {
  const [data, models] = await Promise.all([fetch(url).then((r) => r.json()), fetch(modelsUrl).then((r) => r.json())]);
  const S = data.strings;
  const screenId = root.closest('section')?.id || 'cite';
  root.classList.add('cite', 'tp-scope');

  const form = el('form', 'cite-form');
  form.addEventListener('submit', (e) => e.preventDefault());

  const group = (label, name, options) => {
    const fs = el('fieldset', 'cite-group');
    fs.appendChild(el('legend', 'cite-legend', label));
    const wrap = el('div', 'cite-options');
    options.forEach((o, i) => {
      const lab = el('label', 'cite-option');
      const inp = document.createElement('input');
      inp.type = 'radio'; inp.name = name; inp.value = o.id; if (i === 0) inp.checked = true;
      lab.append(inp, el('span', null, o.label));
      wrap.appendChild(lab);
    });
    fs.appendChild(wrap);
    return fs;
  };
  form.appendChild(group(S.use, 'use', data.uses));
  form.appendChild(group(S.work, 'work', data.works));

  // tool
  const toolFs = el('fieldset', 'cite-group');
  toolFs.appendChild(el('legend', 'cite-legend', S.tool));
  const toolSel = document.createElement('select');
  toolSel.className = 'cite-select'; toolSel.name = 'tool';
  const tools = models.models.filter((m) => m.lon != null);
  for (const m of tools) { const o = document.createElement('option'); o.value = m.id; o.textContent = m.name; toolSel.appendChild(o); }
  const other = document.createElement('option'); other.value = 'other'; other.textContent = S.toolOther; toolSel.appendChild(other);
  const otherFields = el('div', 'cite-other');
  otherFields.hidden = true;
  const mk = (name, label, placeholder = '') => {
    const lab = el('label', 'cite-field');
    lab.appendChild(el('span', null, label));
    const inp = document.createElement('input'); inp.type = 'text'; inp.name = name; inp.placeholder = placeholder;
    lab.appendChild(inp);
    return { lab, inp };
  };
  const oName = mk('toolName', S.toolName), oCompany = mk('company', S.company), oUrl = mk('url', S.url, 'example.com');
  otherFields.append(oName.lab, oCompany.lab, oUrl.lab);
  const version = mk('version', S.version, '');
  const dateLab = el('label', 'cite-field');
  dateLab.appendChild(el('span', null, S.date));
  const dateInp = document.createElement('input'); dateInp.type = 'date'; dateInp.name = 'date';
  const now = new Date();
  dateInp.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;   // local date, not UTC
  dateLab.appendChild(dateInp);
  const promptLab = el('label', 'cite-field cite-field--wide');
  promptLab.appendChild(el('span', null, S.prompt));
  const promptInp = document.createElement('input'); promptInp.type = 'text'; promptInp.name = 'prompt'; promptInp.maxLength = 140;
  promptLab.append(promptInp, el('small', 'cite-hint', S.promptHint));
  const row = el('div', 'cite-row');
  row.append(toolSel, version.lab, dateLab);
  toolFs.append(row, otherFields, promptLab);
  form.appendChild(toolFs);

  const out = el('div', 'cite-out');
  out.setAttribute('aria-live', 'polite');
  root.append(el('p', 'cite-intro', S.intro), form, out, el('p', 'cite-foot', S.reviewed));

  const read = () => {
    const use = form.querySelector('input[name="use"]:checked')?.value;
    const work = form.querySelector('input[name="work"]:checked')?.value;
    let tool;
    if (toolSel.value === 'other') tool = { name: oName.inp.value, company: oCompany.inp.value, url: oUrl.inp.value };
    else { const m = tools.find((x) => x.id === toolSel.value); tool = { name: m.name, company: m.maker, url: m.url }; }
    return { use, work, tool, version: version.inp.value, date: dateInp.value, prompt: promptInp.value };
  };

  let done = false;
  const render = () => {
    const input = read();
    otherFields.hidden = toolSel.value !== 'other';
    const result = buildCitation(input, data);
    out.innerHTML = '';
    if (result.sourcesNote) out.appendChild(el('p', 'cite-lead', S.sources));
    if (result.noneNeeded) out.appendChild(el('p', 'cite-lead', S.none));
    for (const b of result.blocks) {
      const box = el('div', 'cite-block cite-block--' + b.kind);
      box.appendChild(el('p', 'cite-block-label', b.label));
      const text = el('p', 'cite-block-text', b.text);
      if (b.kind === 'worksCited') text.classList.add('cite-hanging');
      if (b.kind === 'comment') text.classList.add('mono');
      const copy = el('button', 'tp-btn cite-copy', S.copy); copy.type = 'button';
      copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(b.text); copy.textContent = S.copied; } catch { /* clipboard blocked */ }
        setTimeout(() => { copy.textContent = S.copy; }, 1400);
        if (!done) { done = true; markDone(screenId, { use: input.use, work: input.work, tool: input.tool.name }); }
      });
      box.append(text, copy);
      out.appendChild(box);
    }
    const why = el('div', 'cite-why');
    why.appendChild(el('p', 'cite-why-label', S.why));
    for (const k of result.why) if (data.why[k]) why.appendChild(el('p', 'cite-why-text', data.why[k]));
    out.appendChild(why);
  };
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  render();
  return { render, read };
}
