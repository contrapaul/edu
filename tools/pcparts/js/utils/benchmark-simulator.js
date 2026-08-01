// Storage Race Simulator - multiple drives copy the same file concurrently.
// Each lane's animation duration is exactly its real transfer time (fileSize /
// seqRead) - no artificial compression - so what you watch matches the
// calculated time. Drives too small to hold the selected file are called out
// instead of racing, which keeps every real transfer time on-screen bounded
// to something actually watchable.
import data from '../../data/hardware-specs.json';

const MAX_LANES = 4;
const LANE_COLORS = ['#4a9eff', '#8b5cf6', '#10b981', '#f59e0b'];

const FILE_SIZES_MB = [
  { value: 10, label: '10 MB' },
  { value: 100, label: '100 MB' },
  { value: 1024, label: '1 GB' },
  { value: 10240, label: '10 GB' },
  { value: 102400, label: '100 GB' }
];

function capacityToMB(capacityStr) {
  const match = String(capacityStr).match(/([\d.]+)\s*(MB|GB|TB)/i);
  if (!match) return Infinity;
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === 'TB') return value * 1024 * 1024;
  if (unit === 'GB') return value * 1024;
  return value;
}

class BenchmarkSimulator {
  constructor(container) {
    this.container = container;
    this.selectedDrives = [0, 3, 5]; // a sane default spread: HDD, SATA SSD, modern NVMe
    this.isRunning = false;
    this.lanes = [];
    this.init();
  }

  get storage() { return data.storage; }

  init() {
    this.container.innerHTML = `
      <div class="simulator-controls">
        <label>Select Drives to Race (2-${MAX_LANES}):</label>
        <div class="drive-checklist" id="drive-checklist">
          ${this.storage.examples.map((d, i) => `
            <label class="drive-checkbox">
              <input type="checkbox" value="${i}" ${this.selectedDrives.includes(i) ? 'checked' : ''}>
              <span>${d.year} — ${d.model} (${d.interface})</span>
            </label>
          `).join('')}
        </div>
        <p class="drive-checklist-hint" id="drive-checklist-hint"></p>

        <label for="file-size">File Size to Copy:</label>
        <select id="file-size">
          ${FILE_SIZES_MB.map(f => `<option value="${f.value}" ${f.value === 100 ? 'selected' : ''}>${f.label}</option>`).join('')}
        </select>

        <button id="run-benchmark" class="simulate-btn">Run Race</button>
      </div>

      <div class="benchmark-display" id="benchmark-display" hidden>
        <h3>Copy Race</h3>
        <div class="race-lanes" id="race-lanes"></div>
        <div class="benchmark-results" id="benchmark-results"></div>
        <div class="latency-visualization" id="latency-viz"></div>
      </div>
    `;

    this.checklist = document.getElementById('drive-checklist');
    this.hint = document.getElementById('drive-checklist-hint');
    this.laneContainer = document.getElementById('race-lanes');
    this.resultsContainer = document.getElementById('benchmark-results');
    this.latencyContainer = document.getElementById('latency-viz');
    this.benchmarkDisplay = document.getElementById('benchmark-display');
    this.runButton = document.getElementById('run-benchmark');

    this.checklist.addEventListener('change', () => this.onChecklistChange());
    this.runButton.addEventListener('click', () => this.runRace());

    this.updateChecklistState();
  }

  getCheckedIndices() {
    return [...this.checklist.querySelectorAll('input[type="checkbox"]:checked')]
      .map(cb => parseInt(cb.value, 10));
  }

  onChecklistChange() {
    this.selectedDrives = this.getCheckedIndices();
    this.updateChecklistState();
  }

  updateChecklistState() {
    const checked = this.getCheckedIndices();
    const atMax = checked.length >= MAX_LANES;

    this.checklist.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.disabled = atMax && !cb.checked;
    });

    if (atMax) {
      this.hint.textContent = `Maximum ${MAX_LANES} drives per race — uncheck one to swap.`;
    } else if (checked.length < 2) {
      this.hint.textContent = 'Pick at least 2 drives to race.';
    } else {
      this.hint.textContent = '';
    }

    this.runButton.disabled = checked.length < 2;
  }

  runRace() {
    if (this.isRunning) return;
    const drives = this.selectedDrives.map(i => ({ index: i, data: this.storage.examples[i] }));
    if (drives.length < 2) return;

    const fileSizeMB = parseInt(document.getElementById('file-size').value, 10);
    const fileSizeLabel = FILE_SIZES_MB.find(f => f.value === fileSizeMB)?.label || `${fileSizeMB} MB`;

    this.isRunning = true;
    this.runButton.disabled = true;
    this.benchmarkDisplay.hidden = false;
    this.resultsContainer.innerHTML = '';
    this.latencyContainer.innerHTML = '';

    // A drive smaller than the file being copied can't run this race at all -
    // skip the math/animation for it entirely rather than trying to compress
    // an impossible transfer into a plausible time.
    this.lanes = drives.map((drive, laneIndex) => {
      const capacityMB = capacityToMB(drive.data.capacity);
      const tooLarge = fileSizeMB > capacityMB;
      return {
        ...drive,
        color: LANE_COLORS[laneIndex % LANE_COLORS.length],
        tooLarge,
        capacityMB,
        // Real transfer time, unscaled - the animation IS the calculated time.
        actualTime: tooLarge ? null : fileSizeMB / drive.data.seqRead,
        startTime: null,
        finished: tooLarge,
        finishOrder: null
      };
    });

    this.laneContainer.innerHTML = this.lanes.map((lane, i) => `
      <div class="race-lane ${lane.tooLarge ? 'race-lane-blocked' : ''}" id="race-lane-${i}">
        <div class="race-lane-label">
          <span class="race-lane-rank" id="race-lane-rank-${i}"></span>
          <span>${lane.data.year} — ${lane.data.model}</span>
        </div>
        ${lane.tooLarge ? `
          <p class="race-lane-blocked-note">Too large for this drive — ${lane.data.capacity} capacity can't hold a ${fileSizeLabel} file.</p>
        ` : `
          <div class="progress-bar-container race-lane-track">
            <div class="progress-bar running" id="race-lane-bar-${i}" style="background: ${lane.color};"></div>
          </div>
          <span class="race-lane-readout" id="race-lane-readout-${i}">0 MB/s</span>
        `}
      </div>
    `).join('');

    const racingLanes = this.lanes.filter(lane => !lane.tooLarge);

    if (racingLanes.length === 0) {
      this.isRunning = false;
      this.runButton.disabled = false;
      this.resultsContainer.innerHTML = `<p class="tier-locked-note">None of the selected drives can hold a ${fileSizeLabel} file. Pick a smaller file size or larger drives.</p>`;
      return;
    }

    this.finishedCount = 0;
    const startTime = Date.now();
    racingLanes.forEach(lane => { lane.startTime = startTime; });

    // setInterval rather than requestAnimationFrame: a progress-bar race
    // doesn't need frame-perfect smoothness, and unlike rAF it keeps running
    // (throttled, not paused) if the tab loses focus mid-demo.
    this.raceInterval = setInterval(() => {
      let allDone = true;
      const justFinished = [];

      racingLanes.forEach(lane => {
        if (lane.finished) return;
        allDone = false;

        const i = this.lanes.indexOf(lane);
        const elapsed = (Date.now() - lane.startTime) / 1000;
        const progress = Math.min((elapsed / lane.actualTime) * 100, 100);

        const bar = document.getElementById(`race-lane-bar-${i}`);
        const readout = document.getElementById(`race-lane-readout-${i}`);
        if (bar) bar.style.width = `${progress}%`;
        if (readout) readout.textContent = `${lane.data.seqRead.toLocaleString()} MB/s`;

        if (progress >= 100) {
          lane.finished = true;
          justFinished.push(lane);
        }
      });

      // A throttled/delayed tick (e.g. a backgrounded tab) can let several
      // lanes cross their finish line within the same callback. Rank those by
      // their real completion time (== actualTime, since every lane shares
      // the same startTime) rather than by array/iteration order.
      justFinished
        .sort((a, b) => a.actualTime - b.actualTime)
        .forEach(lane => {
          lane.finishOrder = ++this.finishedCount;
          const i = this.lanes.indexOf(lane);
          const bar = document.getElementById(`race-lane-bar-${i}`);
          if (bar) bar.classList.remove('running');
          const rankEl = document.getElementById(`race-lane-rank-${i}`);
          if (rankEl) rankEl.textContent = `#${lane.finishOrder}`;
          const laneEl = document.getElementById(`race-lane-${i}`);
          if (laneEl) laneEl.addEventListener('click', () => this.showLatency(lane.data));
        });

      if (allDone) {
        clearInterval(this.raceInterval);
        this.showResults(fileSizeLabel);
        this.isRunning = false;
        this.runButton.disabled = false;
      }
    }, 50);
  }

  showResults(fileSizeLabel) {
    const finished = this.lanes.filter(lane => !lane.tooLarge);
    const ranked = [...finished].sort((a, b) => a.finishOrder - b.finishOrder);
    const blocked = this.lanes.filter(lane => lane.tooLarge);

    this.resultsContainer.innerHTML = `
      <h3 class="race-results-title">Results — ${fileSizeLabel} copy</h3>
      ${ranked.map(lane => {
        const timeStr = lane.actualTime < 1
          ? `${(lane.actualTime * 1000).toFixed(0)}ms`
          : lane.actualTime < 60
            ? `${lane.actualTime.toFixed(1)}s`
            : `${Math.floor(lane.actualTime / 60)}m ${Math.round(lane.actualTime % 60)}s`;
        return `
          <div class="result-item">
            <span>#${lane.finishOrder} ${lane.data.model}</span>
            <strong>${timeStr} @ ${lane.data.seqRead.toLocaleString()} MB/s</strong>
          </div>
        `;
      }).join('')}
      ${blocked.map(lane => `
        <div class="result-item result-item-blocked">
          <span>${lane.data.model}</span>
          <strong>Too large (${lane.data.capacity} capacity)</strong>
        </div>
      `).join('')}
    `;

    // Default to the winner's latency breakdown; user can click any finished lane to inspect another.
    if (ranked.length) this.showLatency(ranked[0].data);
  }

  showLatency(drive) {
    const latencies = [
      { label: 'OS Call', value: 0.5, color: '#4a9eff' },
      { label: 'Controller', value: 0.1, color: '#8b5cf6' },
      { label: 'NAND/PLC', value: parseFloat(drive.latency) || 0.1, color: '#10b981' },
      { label: 'Host Response', value: parseFloat(drive.latency) || 0.1, color: '#f59e0b' }
    ];

    const maxLatency = 15;

    this.latencyContainer.innerHTML = `
      <h3>Latency Breakdown — ${drive.model}</h3>
      ${latencies.map(l => `
        <div class="latency-bar">
          <span class="latency-label">${l.label}</span>
          <div class="latency-track">
            <div class="latency-fill" style="width: ${(l.value / maxLatency) * 100}%; background: ${l.color};"></div>
          </div>
          <span class="latency-value">${l.value}ms</span>
        </div>
      `).join('')}
      <p class="latency-hint">Click any finished lane above to inspect its latency breakdown.</p>
    `;
  }
}

export default BenchmarkSimulator;
