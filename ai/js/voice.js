/* ============================================================
   Student voice
   ------------------------------------------------------------
   Pull quotes from students, placed through the pages. A slot is
   any element with data-voice="<tag>". If data/quotes.json has a
   quote with that tag, it is rendered with its attribution; if
   not, a clearly marked placeholder is shown, because no quote on
   this site is ever invented. Quotes are Paul's to add, with
   permission, anonymised to a grade and a month.
   ============================================================ */

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

/** Pure: the quotes for a tag, in file order. */
export function quotesFor(data, tag) {
  return (data.quotes || []).filter((q) => (q.tags || []).includes(tag));
}

export async function mountVoices(root = document, { url = './data/quotes.json' } = {}) {
  const slots = Array.from(root.querySelectorAll('[data-voice]'));
  if (!slots.length) return;
  const data = await (await fetch(url)).json();
  for (const slot of slots) {
    const tag = slot.getAttribute('data-voice');
    const found = quotesFor(data, tag);
    slot.classList.add('voice');
    slot.innerHTML = '';
    if (!found.length) {
      slot.classList.add('voice--placeholder');
      slot.append(el('p', 'voice-text', fill(data.placeholder, { tag })));
      continue;
    }
    const q = found[Number(slot.getAttribute('data-voice-index')) || 0] || found[0];
    const block = el('blockquote', 'voice-block');
    block.append(el('p', 'voice-text', q.text), el('footer', 'voice-by', fill(data.attribution, q)));
    slot.appendChild(block);
  }
}
