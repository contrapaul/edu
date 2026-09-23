import { test } from 'node:test';
import assert from 'node:assert/strict';

import { fmtProb, barWidth, showPiece, restProb, rollIndex, lessonVars } from '../js/sample/nextword.js';
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

test('barWidth puts every bar on one 0 to 100% scale', () => {
  assert.equal(barWidth(0.5), 50);
  assert.equal(barWidth(0.0825), 8.25);
  assert.equal(barWidth(1.2), 100);
  assert.equal(barWidth(-0.1), 0);
  assert.equal(barWidth(null), 0);
  assert.equal(barWidth(NaN), 0);
});

test('showPiece draws a leading space as the rain does', () => {
  assert.equal(showPiece(' jam'), '\u2423jam');
  assert.equal(showPiece(' '), '\u2423');
  assert.equal(showPiece('2'), '2');
  assert.equal(showPiece('...'), '...');
});

test('restProb is what the top list leaves of 100%', () => {
  assert.ok(Math.abs(restProb([{ prob: 0.6 }, { prob: 0.3 }]) - 0.1) < 1e-12);
  assert.equal(restProb([{ prob: 0.7 }, { prob: 0.4 }]), 0);
  assert.equal(restProb([]), 1);
});

test('rollIndex lands in proportion to the weights', () => {
  const w = [0.5, 0.25, 0.25];
  assert.equal(rollIndex(w, 0), 0);
  assert.equal(rollIndex(w, 0.49), 0);
  assert.equal(rollIndex(w, 0.5), 1);
  assert.equal(rollIndex(w, 0.74), 1);
  assert.equal(rollIndex(w, 0.75), 2);
  assert.equal(rollIndex(w, 0.999999), 2);
  assert.equal(rollIndex([2, 2], 0.6), 1, 'weights need not sum to 1');
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

test('every recorded sentence has a lesson, and its numbers come from the recording', () => {
  const data = JSON.parse(readFileSync(resolve(ROOT, 'data/next-word.json'), 'utf8'));
  const input = JSON.parse(readFileSync(resolve(ROOT, 'data/next-word-sentences.json'), 'utf8'));
  const lessons = Object.fromEntries(input.sentences.map((s) => [s.id, s.lesson]));
  for (const s of data.sentences) {
    const lesson = lessons[s.id];
    assert.ok(lesson, `${s.id}: has a lesson`);
    assert.ok(!/\u2014/.test(lesson), `${s.id}: no em dash`);
    assert.ok(!/\d%/.test(lesson), `${s.id}: percentages come from {placeholders}, not typed in`);
    const vars = lessonVars(s);
    for (const [, k] of lesson.matchAll(/\{(\w+)\}/g)) {
      assert.ok(k in vars && vars[k] != null && vars[k] !== '?', `${s.id}: {${k}} has a value`);
    }
    // the twelve bars and "every other piece" make up the whole 100%
    const total = s.top.reduce((a, t) => a + t.prob, 0) + restProb(s.top);
    assert.ok(Math.abs(total - 1) < 1e-9, `${s.id}: the bars sum to 100%`);
  }
  const wall = lessonVars(data.sentences.find((s) => s.id === 'wall-title'));
  assert.equal(wall.digits, '98%');
  assert.equal(wall.hiddenProb, '0.67%');
  const jar = lessonVars(data.sentences.find((s) => s.id === 'jar'));
  assert.equal(jar.covered, '35%');
  assert.equal(jar.rest, '65%');
});
