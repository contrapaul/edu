// CPU Module - Interactive visualization and education
import data from '../../data/hardware-specs.json';

class CPUModule {
  constructor(container) {
    this.container = container;
    this.currentCPU = 0;
    this.historyContainer = document.getElementById('component-timeline');
    this.evolutionContainer = document.getElementById('evolution-visualizer');
    this.init();
  }

  get cpu() { return data.cpu; }
  get timelineEvents() { return data.timelineEvents; }

  init() {
    this.renderSpecs();
    this.renderTimeline();
    this.renderEvolution();
  }

  renderSpecs() {
    const specsGrid = document.getElementById('specs-grid');
    const cpuData = this.cpu.examples[this.currentCPU];
    
    specsGrid.innerHTML = `
      <div class="spec-card"><h3>Socket</h3><p>${cpuData.socket}</p></div>
      <div class="spec-card"><h3>Process Node</h3><p>${cpuData.process}</p></div>
      <div class="spec-card"><h3>Cores/Threads</h3><p>${cpuData.cores}/${cpuData.threads}</p></div>
      <div class="spec-card"><h3>Clock Speed</h3><p>${cpuData.clockSpeed}</p></div>
      <div class="spec-card"><h3>TDP</h3><p>${cpuData.tdp}</p></div>
      <div class="spec-card"><h3>Transistors</h3><p>${cpuData.transistorCount}</p></div>
      <div class="spec-card"><h3>Cache</h3><p>${cpuData.cache}</p></div>
      <div class="spec-card"><h3>Key Feature</h3><p>${cpuData.keyFeature}</p></div>
    `;
  }

  renderTimeline() {
    if (!this.historyContainer) return;

    const cpuTimeline = this.timelineEvents.filter(e => 
      e.year >= 1971 && e.year <= 2024
    );

    this.historyContainer.innerHTML = `
      <h3>CPU Timeline</h3>
      ${cpuTimeline.map(event => `
        <div class="timeline-item">
          <span class="timeline-year">${event.year}</span>
          <div class="timeline-content">
            <p>${event.event}</p>
          </div>
        </div>
      `).join('')}
    `;
  }

  renderEvolution() {
    if (!this.evolutionContainer) return;

    const cpuExamples = this.cpu.examples;
    const chartContainer = document.createElement('div');
    chartContainer.className = 'comparison-chart';
    chartContainer.innerHTML = `
      <h3>Performance vs IPC (Instructions Per Cycle)</h3>
      <div class="chart-container">
        <canvas id="ipc-chart"></canvas>
      </div>
    `;
    this.evolutionContainer.appendChild(chartContainer);

    // Create IPC chart using Chart.js
    this.createIPCChart(cpuExamples);

    // Add die shrink visualization
    this.createDieShrinkVisualization(cpuExamples);
  }

  createIPCChart(cpuExamples) {
    const canvas = document.getElementById('ipc-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 250;
    canvas.width = width;
    canvas.height = height;

    const data = cpuExamples.map(cpu => ({
      x: parseFloat(cpu.clockSpeed),
      y: parseInt(cpu.transistorCount.replace(/[^0-9]/g, '')) || 0,
      label: cpu.model.split(' ').slice(-2).join(' '),
      year: cpu.year
    }));

    // Simple bar chart rendering
    const maxVal = Math.max(...data.map(d => d.x));
    const barWidth = (width - 100) / data.length - 10;

    data.forEach((d, i) => {
      const barHeight = (d.x / maxVal) * (height - 60);
      const x = 60 + i * (barWidth + 10);
      const y = height - 30 - barHeight;

      // Draw bar
      ctx.fillStyle = '#4a9eff';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Label
      ctx.fillStyle = '#e8edf5';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${d.year}`, x + barWidth / 2, height - 15);
      ctx.fillText(`${d.x}GHz`, x + barWidth / 2, y - 5);
    });

    // Axes
    ctx.strokeStyle = '#2a3050';
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, height - 30);
    ctx.lineTo(width - 10, height - 30);
    ctx.stroke();
  }

  createDieShrinkVisualization(cpuExamples) {
    const vizContainer = document.createElement('div');
    vizContainer.className = 'comparison-chart';
    vizContainer.innerHTML = `
      <h3>Die Shrink Progression</h3>
      <div class="chart-container">
        <canvas id="die-shrink-chart"></canvas>
      </div>
    `;
    this.evolutionContainer.appendChild(vizContainer);

    const canvas = document.getElementById('die-shrink-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    const processData = (process) => {
      if (process.includes('μm')) return parseFloat(process) * 1000;
      return parseFloat(process.replace('nm', ''));
    };

    const data = cpuExamples.map(cpu => ({
      process: processData(cpu.process),
      transistors: parseInt(cpu.transistorCount.replace(/[^0-9]/g, '')) || 0,
      label: cpu.model.split(' ').slice(-2).join(' '),
      year: cpu.year
    }));

    // Log scale chart
    const maxProcess = Math.max(...data.map(d => d.process));
    const minProcess = Math.min(...data.map(d => d.process));
    const maxTrans = Math.max(...data.map(d => Math.log10(d.transistors)));

    const chartWidth = width - 100;
    const chartHeight = height - 60;

    // Draw grid
    ctx.strokeStyle = '#1a2035';
    for (let i = 0; i <= 5; i++) {
      const y = 20 + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(width - 10, y);
      ctx.stroke();
    }

    // Draw data points
    data.forEach((d, i) => {
      const x = 60 + (i / (data.length - 1)) * chartWidth;
      const y = 20 + chartHeight - ((Math.log10(d.transistors) / maxTrans) * chartHeight);

      // Point
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.fill();

      // Label
      ctx.fillStyle = '#e8edf5';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${d.year}`, x, height - 15);
      ctx.fillText(`${d.process}nm`, x, 15);
    });

    // Axes
    ctx.strokeStyle = '#2a3050';
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, height - 30);
    ctx.lineTo(width - 10, height - 30);
    ctx.stroke();
  }

  updateCPU(index) {
    this.currentCPU = index;
    this.renderSpecs();
  }
}

export default CPUModule;
