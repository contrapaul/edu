// Benchmark Simulator for storage drives
import data from '../../data/hardware-specs.json';

class BenchmarkSimulator {
  constructor(container) {
    this.container = container;
    this.currentDrive = 0;
    this.isRunning = false;
    this.init();
  }

  get storage() { return data.storage; }

  init() {
    this.container.innerHTML = `
      <div class="simulator-controls">
        <label for="drive-select">Select Drive:</label>
        <select id="drive-select">
          <option value="0">Seagate ST340014A (1994) - 4.3GB IDE</option>
          <option value="1">WD Raptor 150GB (2003) - 150GB SATA</option>
          <option value="2">Samsung 840 EVO 128GB (2014) - 128GB SATA SSD</option>
          <option value="3">Samsung 970 EVO Plus 1TB (2018) - 1TB NVMe</option>
          <option value="4">WD Black SN850X 2TB (2021) - 2TB NVMe</option>
          <option value="5">Crucial T700 4TB (2024) - 4TB NVMe</option>
        </select>

        <label for="file-size">File Size to Copy:</label>
        <select id="file-size">
          <option value="1">1 GB</option>
          <option value="10" selected>10 GB</option>
          <option value="50">50 GB</option>
        </select>

        <button id="run-benchmark" class="simulate-btn">Run Benchmark</button>
      </div>

      <div class="benchmark-display" id="benchmark-display" hidden>
        <h3>Copy Progress</h3>
        <div class="progress-bar-container">
          <div class="progress-bar" id="progress-bar"></div>
        </div>
        <div class="benchmark-results" id="benchmark-results"></div>
        <div class="latency-visualization" id="latency-viz"></div>
      </div>
    `;

    this.progressBar = document.getElementById('progress-bar');
    this.resultsContainer = document.getElementById('benchmark-results');
    this.latencyContainer = document.getElementById('latency-viz');
    this.benchmarkDisplay = document.getElementById('benchmark-display');

    document.getElementById('run-benchmark').addEventListener('click', () => this.runBenchmark());
    document.getElementById('drive-select').addEventListener('change', (e) => {
      this.currentDrive = parseInt(e.target.value);
    });
  }

  runBenchmark() {
    if (this.isRunning) return;

    const driveData = this.storage.examples[this.currentDrive];
    const fileSizeGB = parseInt(document.getElementById('file-size').value);

    this.isRunning = true;
    document.getElementById('run-benchmark').disabled = true;
    this.benchmarkDisplay.hidden = false;

    const speedMBps = driveData.seqRead;
    const actualTime = fileSizeGB / (speedMBps / 1024);
    const animTime = Math.min(actualTime * 0.5, 10);

    let progress = 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      progress = Math.min((elapsed / animTime) * 100, 100);

      this.progressBar.style.width = `${progress}%`;
      this.progressBar.classList.add('running');

      if (progress < 100) {
        requestAnimationFrame(animate);
      } else {
        this.showResults(driveData, fileSizeGB, actualTime);
        this.isRunning = false;
        document.getElementById('run-benchmark').disabled = false;
        this.progressBar.classList.remove('running');
      }
    };

    requestAnimationFrame(animate);
  }

  showResults(drive, fileSizeGB, actualTime) {
    const timeStr = actualTime < 1 
      ? `${(actualTime * 1000).toFixed(0)}ms`
      : `${actualTime.toFixed(1)}s`;

    this.resultsContainer.innerHTML = `
      <div class="result-item">
        <span>Drive</span>
        <strong>${drive.model}</strong>
      </div>
      <div class="result-item">
        <span>File Size</span>
        <strong>${fileSizeGB} GB</strong>
      </div>
      <div class="result-item">
        <span>Transfer Speed</span>
        <strong>${drive.seqRead} MB/s</strong>
      </div>
      <div class="result-item">
        <span>Total Time</span>
        <strong>${timeStr}</strong>
      </div>
    `;

    this.showLatency(drive);
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
      <h3>Latency Breakdown</h3>
      ${latencies.map(l => `
        <div class="latency-bar">
          <span class="latency-label">${l.label}</span>
          <div class="latency-track">
            <div class="latency-fill" style="width: ${(l.value / maxLatency) * 100}%; background: ${l.color};"></div>
          </div>
          <span class="latency-value">${l.value}ms</span>
        </div>
      `).join('')}
    `;
  }
}

export default BenchmarkSimulator;
