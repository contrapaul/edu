/* Copy the same file to two drives from different decades and watch the gap.
 *
 * Real time is compressed so the slowest run finishes in about twelve seconds.
 * The clock on screen counts simulated time, and the compression ratio is
 * shown, because the whole point is the size of the number. */

const RUN_SECONDS = 12;

export default function mountStorageTest(host, block) {
  const drives = block.drives;
  const sizes = block.sizes || [1024, 10240, 51200];

  host.innerHTML = `
    <div class="tool">
      <div class="tool-controls">
        <label>Copy
          <select data-size>${sizes.map(mb =>
            `<option value="${mb}">${fmtSize(mb)}</option>`).join('')}</select>
        </label>
        <label>to
          <select data-a>${drives.map((d, i) =>
            `<option value="${i}"${i === 0 ? ' selected' : ''}>${d.name}</option>`).join('')}</select>
        </label>
        <label>and
          <select data-b>${drives.map((d, i) =>
            `<option value="${i}"${i === drives.length - 1 ? ' selected' : ''}>${d.name}</option>`).join('')}</select>
        </label>
        <button type="button" data-run>Run</button>
      </div>
      <div class="tool-lanes">
        ${lane('a')}
        ${lane('b')}
      </div>
      <p class="tool-note" data-note></p>
    </div>`;

  const els = {
    size: host.querySelector('[data-size]'),
    a: host.querySelector('[data-a]'),
    b: host.querySelector('[data-b]'),
    run: host.querySelector('[data-run]'),
    note: host.querySelector('[data-note]')
  };

  const lanes = ['a', 'b'].map(k => ({
    fill: host.querySelector(`[data-fill="${k}"]`),
    name: host.querySelector(`[data-name="${k}"]`),
    spec: host.querySelector(`[data-spec="${k}"]`),
    clock: host.querySelector(`[data-clock="${k}"]`)
  }));

  let frame = null;

  function reset() {
    const picked = [drives[+els.a.value], drives[+els.b.value]];
    lanes.forEach((lane, i) => {
      lane.fill.style.width = '0%';
      lane.name.textContent = picked[i].name;
      lane.spec.textContent =
        `${picked[i].year} · ${picked[i].interface} · ${picked[i].readMBs} MB/s`;
      lane.clock.textContent = '';
    });
    els.note.textContent = '';
    return picked;
  }

  function run() {
    cancelAnimationFrame(frame);
    const picked = reset();
    const sizeMB = +els.size.value;

    // Seek time only matters on a drive with an arm to move. A large
    // sequential copy is not one seek, but it is not free either, so this
    // charges a seek per gigabyte of fragmented file.
    const seconds = picked.map(d =>
      sizeMB / d.readMBs + (d.seekMs ? (d.seekMs / 1000) * (sizeMB / 1024) * 40 : 0));

    const slowest = Math.max(...seconds);
    const compression = slowest / RUN_SECONDS;

    els.note.textContent =
      `One second here is ${fmtDuration(compression)} of real copying.`;

    const start = performance.now();

    function step(now) {
      const simulated = ((now - start) / 1000) * compression;
      let done = 0;

      lanes.forEach((lane, i) => {
        const pct = Math.min(1, simulated / seconds[i]);
        lane.fill.style.width = `${pct * 100}%`;
        lane.clock.textContent = pct >= 1
          ? `done in ${fmtDuration(seconds[i])}`
          : fmtDuration(Math.min(simulated, seconds[i]));
        if (pct >= 1) done++;
      });

      if (done < lanes.length) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
  }

  els.run.addEventListener('click', run);
  [els.a, els.b, els.size].forEach(el => el.addEventListener('change', reset));
  reset();
}

function lane(key) {
  return `
    <div class="lane">
      <div class="lane-head">
        <span class="lane-name" data-name="${key}"></span>
        <span class="lane-clock" data-clock="${key}"></span>
      </div>
      <div class="lane-track"><div class="lane-fill" data-fill="${key}"></div></div>
      <div class="lane-spec" data-spec="${key}"></div>
    </div>`;
}

function fmtSize(mb) {
  return mb >= 1024 ? `${mb / 1024} GB` : `${mb} MB`;
}

function fmtDuration(s) {
  if (s < 1) return `${Math.round(s * 1000)} ms`;
  if (s < 60) return `${s < 10 ? s.toFixed(1) : Math.round(s)} seconds`;
  if (s < 3600) {
    const m = Math.floor(s / 60);
    return `${m} minute${m === 1 ? '' : 's'} ${Math.round(s % 60)} seconds`;
  }
  const h = Math.floor(s / 3600);
  return `${h} hour${h === 1 ? '' : 's'} ${Math.round((s % 3600) / 60)} minutes`;
}
