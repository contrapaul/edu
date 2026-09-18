import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mixHue } from '../js/sample/stripes.js';
import { tally, emptyProgress } from '../js/sample/progress.js';
import { emptyTally, countNewLinks } from '../js/sample/scorecard.js';

test('mixHue goes the short way round the wheel', () => {
  assert.equal(Math.round(mixHue(350, 10, 0.5)), 0);
  assert.equal(Math.round(mixHue(10, 350, 0.5)), 0);
  assert.equal(Math.round(mixHue(100, 200, 0.25)), 125);
  assert.equal(Math.round(mixHue(325, 75, 1)), 75);
});

test('tally counts seen and done screens', () => {
  const p = emptyProgress();
  p.seen.s1 = 1; p.seen.s2 = 1; p.done.s2 = 1;
  assert.deepEqual(tally(p, ['s1', 's2', 's3']), { seen: 2, done: 1, total: 3 });
});

test('countNewLinks counts each href once per side', () => {
  const t = emptyTally('2026');
  assert.equal(countNewLinks(t, ['a', 'b', 'a']), 2);
  assert.equal(countNewLinks(t, ['b', 'c']), 1);
  assert.equal(t.links, 3);
});

test('yearToX pins years outside the axis to its ends', async () => {
  const { yearToX, brickLayout } = await import('../js/sample/wall.js');
  const axis = { from: 2016, to: 2026 };
  assert.equal(yearToX(122, axis), 60);
  assert.equal(yearToX(2040, axis), 940);
  assert.equal(yearToX(2021, axis), 500);
  const bricks = brickLayout(700);
  assert.ok(bricks.length > 20);
  assert.ok(bricks.every((b) => b.y >= 44 && b.y < 330));
});

test('timeline helpers map progress to years along a stretched axis', async () => {
  const { progressToYear, stateAt, yearToPx, pxToYear } = await import('../js/sample/timeline.js');
  const seg = [[2000, 2010, 10], [2010, 2020, 100]];
  assert.equal(yearToPx(2005, seg), 50);
  assert.equal(yearToPx(2015, seg), 600);
  assert.equal(pxToYear(600, seg), 2015);
  assert.equal(pxToYear(yearToPx(2003.5, seg), seg), 2003.5);
  assert.equal(progressToYear(0, 2000, 2020, seg), 2000);
  assert.equal(progressToYear(1.5, 2000, 2020, seg), 2020);
  // halfway along the track is deep in the stretched part, not at 2010
  assert.ok(progressToYear(0.5, 2000, 2020, seg) > 2013);
  assert.equal(stateAt(2008, 2022.92), 'a');
  assert.equal(stateAt(2023, 2022.92), 'b');
});

test('the re-dated post data has a clue node for every clue and only the date differs', async () => {
  const { readFile } = await import('node:fs/promises');
  const d = JSON.parse(await readFile(new URL('../data/redated.json', import.meta.url), 'utf8'));
  const ids = d.clues.map((c) => c.id);
  assert.deepEqual([...ids].sort(), ['byline', 'comments', 'filler', 'gear', 'updated']);
  assert.ok(d.post.updated !== d.post.publishedOnly);
  const { foundLine } = await import('../js/sample/redated.js');
  assert.equal(foundLine('Found {n} of {total}.', 2, 5), 'Found 2 of 5.');
});

test('the map projects longitude and latitude and the model data is consistent', async () => {
  const { project } = await import('../js/sample/map.js');
  assert.deepEqual(project(-180, 84), { x: 0, y: 0 });
  assert.equal(project(0, 0).x, 500);
  assert.ok(project(0, 0).y > 200 && project(0, 0).y < 260);
  const { readFile } = await import('node:fs/promises');
  const d = JSON.parse(await readFile(new URL('../data/models.json', import.meta.url), 'utf8'));
  assert.ok(d.models.length >= 12);
  assert.ok(!d.models.some((m) => /grok/i.test(m.name)), 'Grok is deliberately left out');
  assert.ok(d.models.some((m) => /unsloth/i.test(m.maker)));
  for (const m of d.models) {
    assert.ok(m.checkedOn, m.id + ' needs a checked-on date');
    assert.equal(m.policy, null, m.id + ': policy text is written only after review');
    assert.ok(d.strings.values[m.search.v], m.id + ' search value must be a known one');
  }
});

test('the recap writes one line per finished activity in the reader\'s own words', async () => {
  const { buildLines, remaining } = await import('../js/sample/recap.js');
  const { readFile } = await import('node:fs/promises');
  const S = JSON.parse(await readFile(new URL('../data/recap.json', import.meta.url), 'utf8')).strings;
  const p = { seen: {}, done: { s3: 1, s4: 1, s7: 1 }, answers: {
    s3: { trusted: '2026' }, 'branch-2023': 'Look each one up before using it',
    s4: { placed: ['a', 'b'], cards: [{ text: 'Who won the 2022 World Cup?', outcome: 'before' }, { text: "What's the newest phone?", outcome: 'blocked' }] },
    s7: { names: ['DeepSeek', 'Claude', 'Mistral', 'Local models'] },
  } };
  const lines = buildLines(p, S);
  assert.equal(lines.length, 4);
  assert.ok(lines[0].includes('trusted 2026'));
  assert.ok(lines[1].includes('Look each one up'));
  assert.ok(lines[2].includes('Who won the 2022 World Cup: from memory'));
  assert.ok(lines[3].includes('DeepSeek, Claude, Mistral and Local models'));
  assert.equal(remaining(p), 2);
  assert.deepEqual(buildLines({ seen: {}, done: {}, answers: {} }, S), []);
  // an older record without the details still reads as a sentence
  const old = buildLines({ seen: {}, done: { s4: 1, s7: 1 }, answers: { s4: { placed: ['a'] }, s7: { seen: ['x'] } } }, S);
  assert.equal(old.length, 2);
  assert.ok(!old.some((l) => l.includes('()') || l.endsWith(': .')));
});
