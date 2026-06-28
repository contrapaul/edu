// ═══════════════════════════════════════════════════════════════════
//  Composite Craft — animated constellation backdrop (fits the
//  "connections" theme). Slow drift, sparse nodes, lines between
//  near neighbours. Colours follow the active site theme.
// ═══════════════════════════════════════════════════════════════════
(function () {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const SPEED = 0.09;          // px/frame — gentle drift
    const MAX_DIST = 150;        // link distance
    const DENSITY = 1 / 16000;   // nodes per px² — sparse
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0, nodes = [], dot = 'rgba(80,90,110,0.5)', lineRGB = '80,90,110';

    // Resolve a CSS variable to an "r,g,b" string via a probe element,
    // so colours track whichever theme is active.
    function resolveColors() {
        const probe = document.createElement('span');
        probe.style.color = getComputedStyle(document.documentElement)
            .getPropertyValue('--text').trim() || '#1a1d26';
        document.body.appendChild(probe);
        const m = getComputedStyle(probe).color.match(/\d+/g);
        probe.remove();
        const rgb = m ? `${m[0]},${m[1]},${m[2]}` : '80,90,110';
        lineRGB = rgb;
        dot = `rgba(${rgb},0.5)`;
    }

    function resize() {
        const r = canvas.getBoundingClientRect();
        w = r.width; h = r.height;
        if (!w || !h) return;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const target = Math.max(18, Math.min(60, Math.round(w * h * DENSITY)));
        if (nodes.length !== target) seed(target);
    }

    function seed(n) {
        nodes = Array.from({ length: n }, () => ({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * SPEED * 2,
            vy: (Math.random() - 0.5) * SPEED * 2,
            r: 1.2 + Math.random() * 1.5,
        }));
    }

    function frame() {
        if (!document.hidden && w && h) {
            ctx.clearRect(0, 0, w, h);
            for (const n of nodes) {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0) n.x += w; else if (n.x > w) n.x -= w;
                if (n.y < 0) n.y += h; else if (n.y > h) n.y -= h;
            }
            ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d < MAX_DIST) {
                        ctx.strokeStyle = `rgba(${lineRGB},${(1 - d / MAX_DIST) * 0.28})`;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
            ctx.fillStyle = dot;
            for (const n of nodes) {
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        requestAnimationFrame(frame);
    }

    resolveColors();
    new ResizeObserver(resize).observe(canvas);
    new MutationObserver(resolveColors)
        .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    resize();
    requestAnimationFrame(frame);
})();
