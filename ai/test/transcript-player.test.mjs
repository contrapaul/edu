import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseBlocks, parseInline, applyAnnotations, plainLength } from '../js/transcript-player.js';

test('parseBlocks splits paragraphs and lists', () => {
  const blocks = parseBlocks('Hello there.\nSecond line.\n\n1. one\n2. two\n\n- a\n- b\n\nBye.');
  assert.deepEqual(blocks.map((b) => b.type), ['p', 'ol', 'ul', 'p']);
  assert.equal(blocks[0].text, 'Hello there. Second line.');
  assert.deepEqual(blocks[1].items, ['one', 'two']);
  assert.deepEqual(blocks[2].items, ['a', 'b']);
});

test('parseBlocks starts a list without a blank line before it', () => {
  const blocks = parseBlocks('Here are some sources:\n1. one\n2. two\nI hope these help!');
  assert.deepEqual(blocks.map((b) => b.type), ['p', 'ol', 'p']);
  assert.equal(blocks[2].text, 'I hope these help!');
});

test('parseInline handles bold and code', () => {
  const nodes = parseInline('a **b** `c` d');
  assert.deepEqual(nodes.map((n) => n.t), ['text', 'strong', 'text', 'code', 'text']);
  assert.equal(nodes[1].children[0].s, 'b');
  assert.equal(nodes[3].s, 'c');
});

test('parseInline leaves unmatched markers as text', () => {
  const nodes = parseInline('2 ** 3 and a ` tick');
  assert.equal(nodes.length, 1);
  assert.equal(nodes[0].s, '2 ** 3 and a ` tick');
});

test('applyAnnotations wraps the first match and reports what it found', () => {
  const { text, found } = applyAnnotations('see Book A and Book B', [
    { match: 'Book B', kind: 'fabricated' },
    { match: 'Missing', kind: 'check' },
    { match: 'Book A', kind: 'good' },
  ]);
  assert.equal(found.length, 2);
  assert.equal(found[0].match, 'Book B');
  assert.equal(found[1].match, 'Book A');
  const nodes = parseInline(text);
  const anns = nodes.filter((n) => n.t === 'ann');
  assert.equal(anns.length, 2);
  assert.equal(anns[0].index, 1);   // Book A comes first in the text
  assert.equal(anns[0].children[0].s, 'Book A');
  assert.equal(anns[1].index, 0);
});

test('annotations survive inside bold text', () => {
  const { text } = applyAnnotations('**a Book b**', [{ match: 'Book', kind: 'note' }]);
  const nodes = parseInline(text);
  assert.equal(nodes[0].t, 'strong');
  assert.equal(nodes[0].children[1].t, 'ann');
});

test('plainLength counts visible characters only', () => {
  assert.equal(plainLength('ab **cd** `e`'), 7);
  const { text } = applyAnnotations('hello world', [{ match: 'world', kind: 'note' }]);
  assert.equal(plainLength(text), 11);
  assert.equal(plainLength('1. one\n2. two'), 6);
});

test('the recorded transcript parses and every annotation is found', async () => {
  const { readFile } = await import('node:fs/promises');
  const t = JSON.parse(await readFile(new URL('../data/transcripts/hadrians-wall-2023.json', import.meta.url), 'utf8'));
  for (const m of t.messages) {
    if (!m.annotations) continue;
    const { found } = applyAnnotations(m.text, m.annotations);
    assert.equal(found.length, m.annotations.length, 'every annotation must match text in its message');
  }
});

test('parseBlocks handles headings, quotes, tables and reference lines', () => {
  const blocks = parseBlocks('### Title\n> quoted\n> more\n| a | b |\n| --- | --- |\n| 1 | 2 |\n[1]: https://x.example/ "X"\n[2]: https://y.example/');
  assert.deepEqual(blocks.map((b) => b.type), ['h', 'quote', 'table', 'refs']);
  assert.equal(blocks[0].text, 'Title');
  assert.equal(blocks[1].text, 'quoted more');
  assert.deepEqual(blocks[2].rows, [['a', 'b'], ['1', '2']]);
  assert.deepEqual(blocks[3].refs[0], { id: '1', url: 'https://x.example/', title: 'X' });
  assert.equal(blocks[3].refs[1].title, 'https://y.example/');
});

test('parseInline handles links and images', () => {
  const nodes = parseInline('see [**the** site](https://x.example/?a=1) and ![Image](https://img.example/p.jpg) now');
  assert.deepEqual(nodes.map((n) => n.t), ['text', 'link', 'text', 'img', 'text']);
  assert.equal(nodes[1].url, 'https://x.example/?a=1');
  assert.equal(nodes[1].children[0].t, 'strong');
  assert.equal(nodes[3].url, 'https://img.example/p.jpg');
});

test('an annotation inside link text still becomes a span', () => {
  const { text } = applyAnnotations('[English Heritage](https://x.example/)', [{ match: 'Heritage', kind: 'check' }]);
  const nodes = parseInline(text);
  assert.equal(nodes[0].t, 'link');
  assert.equal(nodes[0].children[1].t, 'ann');
});

test('a blank line between numbered items keeps one list, and the start number is kept', () => {
  const blocks = parseBlocks('Intro:\n\n1. **[A](https://a.example/)**\n   About A.\n\n2. **[B](https://b.example/)**\n   About B.\n\nOutro.\n\n5. five\n6. six');
  assert.deepEqual(blocks.map((b) => b.type), ['p', 'ol', 'p', 'ol']);
  assert.equal(blocks[1].items.length, 2);
  assert.equal(blocks[1].items[0], '**[A](https://a.example/)** About A.');
  assert.equal(blocks[3].start, 5);
});

test('a blank line between two paragraphs still separates them', () => {
  const blocks = parseBlocks('One.\n\nTwo.');
  assert.equal(blocks.length, 2);
});
