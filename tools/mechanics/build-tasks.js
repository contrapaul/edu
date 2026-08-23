/* Regenerates tasks.md from the media fields in data.js.
   Run with:  node build-tasks.js > tasks.md            */
const fs = require('fs');
const { MECHANICS, FAMILIES } = new Function(fs.readFileSync(__dirname + '/data.js', 'utf8') + '; return {MECHANICS,FAMILIES};')();

const skip = t => !t || /^not needed/i.test(t);
const rows = [];
const filled = [];

MECHANICS.forEach(m => {
  const games = m.games.map(g => g.title);
  /* A slot that already holds a file is done, whatever its need text says. */
  const add = (kind, need, has) => {
    if (has) { filled.push({ kind, mech: m.name, fam: FAMILIES[m.family].short, src: has.src }); return; }
    if (skip(need)) return;
    const bucket = /screenshot|screen capture/i.test(need) ? 'screen' : kind === 'Video' ? 'video' : 'photo';
    rows.push({ bucket, mech: m.name, fam: FAMILIES[m.family].short, games, need });
  };
  add('Photo', m.media.imageNeed, m.media.image);
  add('Video', m.media.videoNeed, m.media.video);
});

const withDiagram = MECHANICS.filter(m => m.media.diagram);
const buckets = {
  photo: { title: '1. Photograph from your own shelf',
    blurb: 'Physical components on a table. The cheapest and fastest of these to produce, and the ones that will look most like your classroom. A phone on a tripod and a desk lamp is enough for all of them.' },
  screen: { title: '2. Screen capture',
    blurb: 'Stills or clips from games on a screen. Quick to make if you own the game. Check your school policy on using publisher screenshots before you publish any of these.' },
  video: { title: '3. Film or source a clip',
    blurb: 'Short video, ten to thirty seconds. The most work per item, so treat this list as optional and pick the three or four that teach something a still photo cannot.' }
};

const out = [];
out.push('# Media task list');
out.push('');
out.push('Generated from the `media` fields in `data.js`. Re-run it after filling a slot:');
out.push('');
out.push('```bash');
out.push('node build-tasks.js > tasks.md');
out.push('```');
out.push('');
out.push('Every mechanic has a slot waiting, and until one is filled the page shows a');
out.push('labelled placeholder describing what should go there. The page is complete and');
out.push('presentable without any of them.');
out.push('');
out.push('To fill a slot, drop the file in `media/` and edit that mechanic in `data.js`:');
out.push('');
out.push('```js');
out.push('image: { src: "media/your-file.jpg", alt: "What it shows", caption: "Optional caption" }');
out.push('```');
out.push('');
out.push('| | count |');
out.push('|---|---|');
out.push('| Photos to shoot | ' + rows.filter(r => r.bucket === 'photo').length + ' |');
out.push('| Screen captures | ' + rows.filter(r => r.bucket === 'screen').length + ' |');
out.push('| Video clips | ' + rows.filter(r => r.bucket === 'video').length + ' |');
out.push('| **Still to do** | **' + rows.length + '** |');
out.push('| Already filled | ' + filled.length + ' |');
out.push('| Diagrams already drawn | ' + withDiagram.length + ' |');
out.push('');

if (filled.length) {
  out.push('## Done');
  out.push('');
  out.push('| Mechanic | Family | Slot | File |');
  out.push('|---|---|---|---|');
  filled.forEach(f => out.push('| ' + f.mech + ' | ' + f.fam + ' | ' + f.kind + ' | `' + f.src + '` |'));
  out.push('');
}

out.push('---');
out.push('');
['photo', 'screen', 'video'].forEach(b => {
  const list = rows.filter(r => r.bucket === b);
  out.push('## ' + buckets[b].title + ' (' + list.length + ' items)');
  out.push('');
  out.push(buckets[b].blurb);
  out.push('');
  out.push('| Done | Mechanic | Family | Game to shoot | What it needs to show |');
  out.push('|---|---|---|---|---|');
  list.sort((a, b2) => a.fam.localeCompare(b2.fam) || a.mech.localeCompare(b2.mech));
  list.forEach(r => out.push('| [ ] | ' + r.mech + ' | ' + r.fam + ' | ' + r.games.slice(0, 2).join(', ') + ' | ' + r.need + ' |'));
  out.push('');
});

out.push('---');
out.push('');
out.push('## Already covered, do not duplicate');
out.push('');
out.push('All ' + withDiagram.length + ' mechanics have a diagram drawn in `diagrams.js`. Each appears twice:');
out.push('full size and in colour inside the detail window, and again small, wordless, and');
out.push('in one colour as the artwork on the card itself. If your time is short, skip');
out.push('anything above whose diagram already makes the point.');
out.push('');
out.push('---');
out.push('');
out.push('## Suggested order');
out.push('');
out.push('1. Shoot the photos for the three families you teach first. That is roughly a dozen');
out.push('   images and it makes the most used part of the page feel finished.');
out.push('2. Add screen captures only where the video game version shows something the');
out.push('   tabletop one cannot.');
out.push('3. Leave video until last. Two or three good clips beat twenty rushed ones, and');
out.push('   the placeholders read as deliberate rather than missing.');
console.log(out.join('\n'));
