// RAM & Motherboard Module
import data from '../../data/hardware-specs.json';
import { appState } from '../utils/state.js';

class RAMMoboModule {
  constructor() {
    this.currentRAM = 0;
    this.historyContainer = document.getElementById('component-timeline');
    this.evolutionContainer = document.getElementById('evolution-visualizer');

    appState.subscribe('difficulty', () => {
      const selected = appState.get('selectedComponent');
      if (selected !== 'ram' && selected !== 'mobo') return;
      if (document.getElementById('tab-specs')?.classList.contains('active')) this.renderSpecs(selected);
      if (selected === 'mobo' && document.getElementById('tab-evolution')?.classList.contains('active')) this.renderEvolution();
    });
  }

  get ram() { return data.ram; }
  get motherboard() { return data.motherboard; }

  renderSpecs(componentType) {
    const specsGrid = document.getElementById('specs-grid');
    if (!specsGrid) return;

    const tier = appState.get('difficulty') || 'beginner';
    specsGrid.dataset.tier = tier;

    if (componentType === 'ram') {
      const ramData = this.ram.examples[this.currentRAM];
      specsGrid.innerHTML = `
        <div class="era-select-row">
          <label for="ram-era-select">Era</label>
          <select id="ram-era-select" class="era-select">
            ${this.ram.examples.map((ex, i) => `<option value="${i}" ${i === this.currentRAM ? 'selected' : ''}>${ex.year} — ${ex.type}</option>`).join('')}
          </select>
        </div>
        <div class="spec-card"><h3>Type</h3><p>${ramData.type}</p></div>
        <div class="spec-card"><h3>Capacity</h3><p>${ramData.capacity}</p></div>
        <div class="spec-card"><h3>Speed</h3><p>${ramData.speed}</p></div>
        <div class="spec-card" data-tier="expert"><h3>Bus Width</h3><p>${ramData.busWidth}</p></div>
        <div class="spec-card" data-tier="expert"><h3>Voltage</h3><p>${ramData.voltage}</p></div>
        <div class="spec-card" data-tier="expert"><h3>CAS Latency</h3><p>${ramData.casLatency || '—'}</p></div>
        <div class="spec-card" data-tier="expert"><h3>Bandwidth</h3><p>${ramData.bandwidth || '—'}</p></div>
        <div class="spec-card" data-tier="expert"><h3>Key Feature</h3><p>${ramData.keyFeature}</p></div>
        <div class="spec-card" data-tier="expert"><h3>Deep Dive</h3><p>${ramData.expertNote || ramData.keyFeature}</p></div>
      `;

      document.getElementById('ram-era-select').addEventListener('change', (e) => {
        this.updateRAM(parseInt(e.target.value, 10));
      });
    } else if (componentType === 'mobo') {
      this.renderMotherboardSpecs(tier);
    }
  }

  renderMotherboardSpecs(tier) {
    const specsGrid = document.getElementById('specs-grid');
    if (!specsGrid) return;

    const sockets = this.motherboard.sockets;
    const currentSocket = sockets[sockets.length - 1];

    specsGrid.innerHTML = `
      <div class="spec-card"><h3>Current Socket</h3><p>${currentSocket.name}</p></div>
      <div class="spec-card"><h3>Supported CPU</h3><p>${currentSocket.cpu}</p></div>
      <div class="spec-card"><h3>Year</h3><p>${currentSocket.year}</p></div>
      <div class="spec-card" data-tier="expert"><h3>Max Slots</h3><p>${currentSocket.slots}</p></div>
      <div class="spec-card" data-tier="expert"><h3>VRM Phases</h3><p>16-18 phase</p></div>
      <div class="spec-card" data-tier="expert"><h3>PCIe Version</h3><p>PCIe 5.0</p></div>
    `;
  }

  renderTimeline() {
    if (!this.historyContainer) return;

    const socketTimeline = this.motherboard.sockets;

    this.historyContainer.innerHTML = `
      <h3>Socket Evolution</h3>
      ${socketTimeline.map(socket => `
        <div class="timeline-item">
          <span class="timeline-year">${socket.year}</span>
          <div class="timeline-content">
            <h3>${socket.name}</h3>
            <p>${socket.cpu} - ${socket.slots}</p>
          </div>
        </div>
      `).join('')}
    `;
  }

  renderEvolution() {
    if (!this.evolutionContainer) return;
    this.evolutionContainer.innerHTML = '';

    if ((appState.get('difficulty') || 'beginner') === 'beginner') {
      this.evolutionContainer.innerHTML = `
        <p class="tier-locked-note">Switch to Advanced or Expert difficulty (sidebar) to see evolution charts.</p>
      `;
      return;
    }

    const vrms = this.motherboard.vrms;
    const chartContainer = document.createElement('div');
    chartContainer.className = 'comparison-chart';
    chartContainer.innerHTML = `
      <h3>VRM Phase Evolution</h3>
      <div class="chart-container">
        <canvas id="vrms-chart"></canvas>
      </div>
    `;
    this.evolutionContainer.appendChild(chartContainer);

    this.createVRMsChart(vrms);
  }

  createVRMsChart(vrms) {
    const canvas = document.getElementById('vrms-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    const maxPhases = Math.max(...vrms.map(v => v.phases));
    const barWidth = (width - 100) / vrms.length - 10;

    vrms.forEach((v, i) => {
      const barHeight = (v.phases / maxPhases) * (height - 60);
      const x = 60 + i * (barWidth + 10);
      const y = height - 30 - barHeight;

      ctx.fillStyle = '#10b981';
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#e8edf5';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${v.year}`, x + barWidth / 2, height - 15);
      ctx.fillText(`${v.phases}ph`, x + barWidth / 2, y - 5);
    });

    ctx.strokeStyle = '#2a3050';
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, height - 30);
    ctx.lineTo(width - 10, height - 30);
    ctx.stroke();
  }

  updateRAM(index) {
    this.currentRAM = index;
    this.renderSpecs('ram');
  }
}

export default RAMMoboModule;
