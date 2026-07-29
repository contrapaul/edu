// GPU Module - Graphics card history and visualization
import data from '../../data/hardware-specs.json';

class GPUModule {
  constructor(container) {
    this.container = container;
    this.currentGPU = 0;
    this.init();
  }

  get gpu() { return data.gpu; }

  init() {
    this.renderSpecs();
    this.renderTimeline();
    this.renderEvolution();
  }

  renderSpecs() {
    const specsGrid = document.getElementById('specs-grid');
    const gpuData = this.gpu.examples[this.currentGPU];

    specsGrid.innerHTML = `
      <div class="spec-card"><h3>Model</h3><p>${gpuData.model}</p></div>
      <div class="spec-card"><h3>VRAM</h3><p>${gpuData.vram}</p></div>
      <div class="spec-card"><h3>Memory Bandwidth</h3><p>${gpuData.memoryBandwidth}</p></div>
      <div class="spec-card"><h3>Pixel Rate</h3><p>${gpuData.pixelRate}</p></div>
      <div class="spec-card"><h3>TDP</h3><p>${gpuData.tdp}</p></div>
      <div class="spec-card"><h3>Key Feature</h3><p>${gpuData.keyFeature}</p></div>
    `;
  }

  renderTimeline() {
    if (!this.historyContainer) return;

    const gpuTimeline = [
      { year: 1999, event: 'NVIDIA GeForce 256 - First GPU with hardware T&L' },
      { year: 2001, event: 'GeForce 3 - Vertex shaders introduced' },
      { year: 2004, event: 'GeForce 6800 - Pixel shaders 2.0' },
      { year: 2006, event: 'GeForce 7900 - Unified shader architecture' },
      { year: 2009, event: 'AMD HD 5870 - First GDDR5 memory' },
      { year: 2013, event: 'GeForce GTX 780 - DirectX 12 support' },
      { year: 2018, event: 'NVIDIA RTX 2080 Ti - Real-time ray tracing' },
      { year: 2020, event: 'AMD RDNA 2 - Console GPUs (PS5, Xbox Series)' },
      { year: 2022, event: 'AMD RX 7900 XTX - 24GB GDDR6, 320-bit bus' },
      { year: 2023, event: 'Apple M3 Max - Hardware ray tracing, unified memory' }
    ];

    this.historyContainer.innerHTML = `
      <h3>GPU Timeline</h3>
      ${gpuTimeline.map(event => `
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

    const chartContainer = document.createElement('div');
    chartContainer.className = 'comparison-chart';
    chartContainer.innerHTML = `
      <h3>Memory Bandwidth Comparison</h3>
      <div class="chart-container">
        <canvas id="gpu-bandwidth-chart"></canvas>
      </div>
    `;
    this.evolutionContainer.appendChild(chartContainer);

    this.createBandwidthChart();
  }

  createBandwidthChart() {
    const canvas = document.getElementById('gpu-bandwidth-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 250;
    canvas.width = width;
    canvas.height = height;

    const gpus = this.gpu.examples;
    
    const parseBandwidth = (bw) => {
      const match = bw.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    };

    const data = gpus.map(gpuData => ({
      bandwidth: parseBandwidth(gpuData.memoryBandwidth),
      label: gpuData.model.split(' ').slice(-2).join(' '),
      year: gpuData.year
    }));

    const maxBW = Math.max(...data.map(d => d.bandwidth));
    const barWidth = (width - 100) / data.length - 10;

    // Draw bars
    data.forEach((d, i) => {
      const barHeight = (d.bandwidth / maxBW) * (height - 60);
      const x = 60 + i * (barWidth + 10);
      const y = height - 30 - barHeight;

      // Gradient bar
      const gradient = ctx.createLinearGradient(x, y, x, height - 30);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(1, '#4a9eff');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Label
      ctx.fillStyle = '#e8edf5';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${d.year}`, x + barWidth / 2, height - 15);
      ctx.fillText(`${d.bandwidth}GB/s`, x + barWidth / 2, y - 5);
    });

    // Axes
    ctx.strokeStyle = '#2a3050';
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, height - 30);
    ctx.lineTo(width - 10, height - 30);
    ctx.stroke();
  }

  updateGPU(index) {
    this.currentGPU = index;
    this.renderSpecs();
  }
}

export default GPUModule;
