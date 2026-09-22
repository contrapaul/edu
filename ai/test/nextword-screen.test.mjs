import { test } from 'node:test';
import assert from 'node:assert/strict';

import { fmtProb, barWidth } from '../js/sample/nextword.js';
import { buildLines, ACTIVITY_SCREENS } from '../js/sample/recap.js';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('fmtProb keeps one decimal above 1%, two below, none above 10%', () => {
  assert.equal(fmtProb(0.7746585118701097), '77%');
  assert.equal(fmtProb(0.08250316812830517), '8.3%');
  assert.equal(fmtProb(0.0066969119565963246), '0.67%');
  assert.equal(fmtProb(0.04787666225107749), '4.8%');
  assert.equal(fmtProb(null), '?');
  assert.equal(fmtProb(NaN), '?');
});

test('barWidth scales to the sentence maximum, with a 2% floor', () => {
  assert.equal(barWidth(0.05, 0.1), 50);
  assert.equal(barWidth(0.1, 0.1), 100);
  assert.equal(barWidth(0.001, 0.7746), 2);
  assert.equal(barWidth(0, 0.1), 2);
  assert.equal(barWidth(0.5, 0), 0);
  assert.equal(barWidth(null, 0.1), 0);
});

test('the recap carries a screen 5 line, in page order', () => {
  assert.deepEqual(ACTIVITY_SCREENS, ['s2', 's3', 's4', 's5', 's6', 's7']);
  const strings = JSON.parse(readFileSync(resolve(ROOT, 'data/recap.json'), 'utf8')).strings;
  const p = {
    seen: {},
    done: { s5: 1, s6: 1 },
    answers: { s5: { picks: ['jam', 'bus', 'quiet', 'The'], matched: 0, total: 4 }, s6: { stickers: [] } },
  };
  const lines = buildLines(p, strings);
  assert.ok(lines[0].includes('next word'));
  assert.ok(lines[0].includes('4 times'));
  assert.ok(lines[1].includes('recipe post'));
  const short = buildLines({ seen: {}, done: { s5: 1 }, answers: {} }, strings);
  assert.equal(short[0], strings.lines.s5short);
});

test('every probability the screen would show is in the data file', () => {
  const data = JSON.parse(readFileSync(resolve(ROOT, 'data/next-word.json'), 'utf8'));
  for (const s of data.sentences) {
    for (const c of s.candidates) {
      assert.ok(Number.isFinite(c.prob), `${s.id}: candidate ${c.word} has a probability`);
      assert.ok(s.top.some((t) => t.token === c.token), `${s.id}: candidate token ${c.token} is in the top list`);
    }
    assert.ok(s.candidates.some((c) => c.isTop), `${s.id}: one candidate is the model's top`);
  }
});
