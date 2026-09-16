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
