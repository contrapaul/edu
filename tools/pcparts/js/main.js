// Main Application Controller
import Scene3D from './three-scene.js';
import BenchmarkSimulator from './utils/benchmark-simulator.js';
import CPUModule from './components/cpu-module.js';
import GPUModule from './components/gpu-module.js';
import RAMMoboModule from './components/ram-mobo-module.js';
import { appState } from './utils/state.js';
import data from '../data/hardware-specs.json';

class App {
  constructor() {
    this.scene = null;
    this.benchmarkSim = null;
    this.cpuModule = null;
    this.gpuModule = null;
    this.ramMoboModule = null;
    this.currentComponent = null;
  }

  get timelineEvents() { return data.timelineEvents; }
  get cpu() { return data.cpu; }
  get gpu() { return data.gpu; }
  get ram() { return data.ram; }
  get storage() { return data.storage; }

  async init() {
    const canvas = document.getElementById('scene-canvas');
    this.scene = new Scene3D(canvas);

    this.setupUI();
    this.setupEventListeners();
    this.setupTabs();
    this.setupComponentToggles();
    this.setupResearchModal();

    console.log('PC History Interactive initialized successfully!');
  }

  setupUI() {
    // Initialize component modules
    this.cpuModule = new CPUModule(document.getElementById('tab-specs'));
    this.gpuModule = new GPUModule(document.getElementById('tab-specs'));
    this.ramMoboModule = new RAMMoboModule();

    // Initialize benchmark simulator
    const simContainer = document.getElementById('simulator-container');
    if (simContainer) {
      this.benchmarkSim = new BenchmarkSimulator(simContainer);
    }
  }

  setupEventListeners() {
    // View mode selector
    const viewMode = document.getElementById('view-mode');
    if (viewMode) {
      viewMode.addEventListener('change', (e) => {
        this.scene.setViewMode(e.target.value);
      });
    }

    // Difficulty selector
    const difficulty = document.getElementById('difficulty');
    if (difficulty) {
      difficulty.addEventListener('change', (e) => {
        appState.set('difficulty', e.target.value);
      });
    }

    // Reset camera button
    const resetBtn = document.getElementById('reset-view');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.scene.resetCamera();
      });
    }

    // Close panel button
    const closePanel = document.getElementById('close-panel');
    if (closePanel) {
      closePanel.addEventListener('click', () => {
        this.scene.deselectComponent();
      });
    }
  }

  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        this.scene.switchTab(tabName);
        this.updateTabContent(tabName);
      });
    });
  }

  updateTabContent(tabName) {
    const component = appState.get('selectedComponent');
    if (!component) return;

    switch (tabName) {
      case 'specs':
        this.updateSpecsTab(component);
        break;
      case 'history':
        this.updateHistoryTab(component);
        break;
      case 'evolution':
        this.updateEvolutionTab(component);
        break;
      case 'simulator':
        this.updateSimulatorTab(component);
        break;
    }
  }

  updateSpecsTab(component) {
    switch (component) {
      case 'cpu':
        this.cpuModule.renderSpecs();
        break;
      case 'gpu':
        this.gpuModule.renderSpecs();
        break;
      case 'ram':
        this.ramMoboModule.renderSpecs('ram');
        break;
      case 'mobo':
        this.ramMoboModule.renderSpecs('mobo');
        break;
      default:
        this.scene.openInfoPanel(component);
    }
  }

  updateHistoryTab(component) {
    const timeline = document.getElementById('component-timeline');
    if (!timeline) return;

    switch (component) {
      case 'cpu':
        this.cpuModule.renderTimeline();
        break;
      case 'gpu':
        this.gpuModule.renderTimeline();
        break;
      case 'ram':
        this.renderRAMTimeline(timeline);
        break;
      case 'mobo':
        this.ramMoboModule.renderTimeline();
        break;
      case 'storage':
        this.renderStorageTimeline(timeline);
        break;
      default:
        this.renderGeneralTimeline(timeline);
    }
  }

  updateEvolutionTab(component) {
    switch (component) {
      case 'cpu':
        this.cpuModule.renderEvolution();
        break;
      case 'gpu':
        this.gpuModule.renderEvolution();
        break;
      case 'mobo':
        this.ramMoboModule.renderEvolution();
        break;
      default:
        this.renderGeneralEvolution();
    }
  }

  updateSimulatorTab(component) {
    // Benchmark simulator is already initialized
    if (component === 'storage' && this.benchmarkSim) {
      // Re-initialize if needed
    }
  }

  renderRAMTimeline(timeline) {
    const ramExamples = this.ram.examples;
    timeline.innerHTML = `
      <h3>RAM Evolution</h3>
      ${ramExamples.map(ramData => `
        <div class="timeline-item">
          <span class="timeline-year">${ramData.year}</span>
          <div class="timeline-content">
            <h3>${ramData.model}</h3>
            <p>${ramData.type} - ${ramData.capacity} at ${ramData.speed}</p>
          </div>
        </div>
      `).join('')}
    `;
  }

  renderStorageTimeline(timeline) {
    const storageExamples = this.storage.examples;
    timeline.innerHTML = `
      <h3>Storage Evolution</h3>
      ${storageExamples.map(storageData => `
        <div class="timeline-item">
          <span class="timeline-year">${storageData.year}</span>
          <div class="timeline-content">
            <h3>${storageData.model}</h3>
            <p>${storageData.interface} - ${storageData.capacity}</p>
          </div>
        </div>
      `).join('')}
    `;
  }

  renderGeneralTimeline(timeline) {
    timeline.innerHTML = `
      <h3>General PC History</h3>
      ${this.timelineEvents.map(event => `
        <div class="timeline-item">
          <span class="timeline-year">${event.year}</span>
          <div class="timeline-content">
            <p>${event.event}</p>
          </div>
        </div>
      `).join('')}
    `;
  }

  renderGeneralEvolution() {
    const evolution = document.getElementById('evolution-visualizer');
    if (!evolution) return;

    evolution.innerHTML = `
      <div class="comparison-chart">
        <h3>PC Industry Milestones</h3>
        <p>Select a specific component (CPU, GPU, Motherboard) to see detailed evolution charts.</p>
        <div class="chart-container">
          <canvas id="milestones-chart"></canvas>
        </div>
      </div>
    `;

    this.createMilestonesChart();
  }

  createMilestonesChart() {
    const canvas = document.getElementById('milestones-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    const milestones = [
      { year: 1971, value: 1 },
      { year: 1981, value: 2 },
      { year: 1993, value: 3 },
      { year: 1999, value: 4 },
      { year: 2006, value: 5 },
      { year: 2014, value: 6 },
      { year: 2020, value: 7 },
      { year: 2024, value: 8 }
    ];

    const chartWidth = width - 100;
    const barWidth = chartWidth / milestones.length - 10;

    milestones.forEach((m, i) => {
      const x = 60 + i * (barWidth + 10);
      const barHeight = (m.value / 8) * (height - 60);
      const y = height - 30 - barHeight;

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#e8edf5';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${m.year}`, x + barWidth / 2, height - 15);
    });

    ctx.strokeStyle = '#2a3050';
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, height - 30);
    ctx.lineTo(width - 10, height - 30);
    ctx.stroke();
  }

  setupComponentToggles() {
    const checkboxes = document.querySelectorAll('.component-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const component = e.target.closest('.component-item').dataset.component;
        const visible = e.target.checked;
        this.scene.toggleComponent(component, visible);
        appState.setState({
          visibleComponents: {
            ...appState.get('visibleComponents'),
            [component]: visible
          }
        });
      });
    });
  }

  setupResearchModal() {
    const exportBtn = document.getElementById('export-research');
    const modal = document.getElementById('research-modal');
    const closeBtn = document.getElementById('close-research');
    const downloadBtn = document.getElementById('download-research');

    if (!modal) return;

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        modal.hidden = false;
        this.populateResearchEditor();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.hidden = true;
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadResearch();
      });
    }
  }

  populateResearchEditor() {
    const editor = document.getElementById('research-editor');
    if (!editor) return;

    const template = `---
title: "PC Component History Research"
author: "[Your Name]"
date: "${new Date().toISOString().split('T')[0]}"
status: "Draft"
---

# PC Component History Research

## 1. CPU Evolution
| Year | Model | Socket | Process | Cores/Threads | IPC vs GHz Note |
|------|-------|--------|---------|---------------|-----------------|
| 1991 | Intel 486DX2-66 | Socket 3 | 1.2μm | 1/1 | First x86 with 32-bit internals |
| 1997 | AMD K6-2 450 | Socket 7 | 0.25μm | 1/1 | 3DNow! SIMD |
| 2002 | Pentium 4 3.2GHz HT | Socket 478 | 0.13μm | 1/2 | Hyper-Threading (first x86) |
| 2006 | Core 2 Duo E6600 | LGA 775 | 65nm | 2/2 | Dual-core, uncored |
| 2017 | AMD Ryzen 5 3600 | AM4 | 12nm | 6/12 | MCM (CCD+I/O die) |
| 2020 | Apple M1 | BGA (SoC) | 5nm | 8/8 | Unified memory, ARM |
| 2022 | Intel Core i9-13900K | LGA 1700 | 10nm | 24/32 | Hybrid P/E cores |
| 2022 | AMD Ryzen 7 7800X3D | AM5 | 5nm | 8/16 | 3D V-Cache |

## 2. Storage Timeline
| Year | Model | Interface | Capacity | Seq Read | Latency | Form Factor |
|------|-------|------------|----------|----------|---------|-------------|
| 1994 | Seagate ST340014A | IDE/ATA-2 | 4.3GB | 7 MB/s | 9.3ms | 3.5" HDD |
| 2003 | WD Raptor 150GB | SATA 1.5 Gb/s | 150GB | 55 MB/s | 4.5ms | 3.5" HDD |
| 2014 | Samsung 840 EVO 128GB | SATA 6 Gb/s | 128GB | 520 MB/s | 0.1ms | 2.5" SATA SSD |
| 2018 | Samsung 970 EVO Plus 1TB | PCIe 3.0 x4 NVMe | 1TB | 3,500 MB/s | 0.08ms | M.2 2280 |
| 2021 | WD Black SN850X 2TB | PCIe 4.0 x4 NVMe | 2TB | 7,300 MB/s | 0.06ms | M.2 2280 |
| 2024 | Crucial T700 4TB | PCIe 5.0 x4 NVMe | 4TB | 14,500 MB/s | 0.04ms | M.2 2280 |

## 3. Analysis Questions
1. How did the transition from single-core to multi-core change software development paradigms?
2. Why did NVMe overtake SATA despite similar physical interfaces?
3. Compare AMD MCM vs Intel monolithic approaches. What are the yield/thermal trade-offs?
4. How does unified memory (Apple Silicon) differ from traditional CPU+GPU RAM partitioning?
5. Predict the next 5 years for socket/interface standards. Justify with current bottlenecks.

## 4. Submission Guidelines
- Fill all tables with real hardware data.
- Include 3 benchmark comparisons from your simulator.
- Export as .md or .html. Submit via LMS or GitHub.
- Rubric: Accuracy (40%), Depth (30%), Visualization (20%), Reflection (10%)
`;

    editor.innerHTML = `<textarea id="research-textarea" class="research-textarea">${this.escapeHtml(template)}</textarea>`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  downloadResearch() {
    const textarea = document.getElementById('research-textarea');
    if (!textarea) return;

    const content = textarea.value;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pc-component-history-research.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export default App;
