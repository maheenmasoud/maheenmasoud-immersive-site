// ===== Immersive personal site — shared interactivity =====

const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

/* ---------- canvas starfield ---------- */
(function starfield() {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h;
  let mouseX = 0, mouseY = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
      depth: Math.random() * 0.6 + 0.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const parX = (mouseX - w / 2) / w;
    const parY = (mouseY - h / 2) / h;
    for (const s of stars) {
      s.phase += s.speed;
      const twinkle = 0.5 + 0.5 * Math.sin(s.phase);
      const dx = s.x - parX * 40 * s.depth;
      const dy = s.y - parY * 40 * s.depth;
      ctx.beginPath();
      ctx.arc(dx, dy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${(0.25 + twinkle * 0.75).toFixed(2)})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  if (!isCoarsePointer) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  }
  resize();
  draw();
})();

/* ---------- custom cursor ---------- */
if (!isCoarsePointer) {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring) {
    let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
    window.addEventListener('mousemove', (e) => {
      dotX = e.clientX; dotY = e.clientY;
    });
    function animateCursor() {
      ringX += (dotX - ringX) * 0.18;
      ringY += (dotY - ringY) * 0.18;
      dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .glass-btn').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  }
}

/* ---------- nebula parallax ---------- */
if (!isCoarsePointer) {
  const blobs = document.querySelectorAll('.blob');
  window.addEventListener('mousemove', (e) => {
    const px = (e.clientX / window.innerWidth - 0.5) * 2;
    const py = (e.clientY / window.innerHeight - 0.5) * 2;
    blobs.forEach((b, i) => {
      const strength = 18 + i * 10;
      b.style.transform = `translate(${px * strength}px, ${py * strength}px)`;
    });
  });
}

/* ---------- scroll reveal ---------- */
(function revealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((item) => observer.observe(item));
})();

/* ---------- avatar tilt ---------- */
(function avatarTilt() {
  const inner = document.querySelector('.avatar-inner');
  const card = document.querySelector('.avatar-card');
  if (!inner || !card || isCoarsePointer) return;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    inner.style.transform = `rotateY(${px * 22}deg) rotateX(${-py * 22}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'rotateY(0) rotateX(0) scale(1)';
  });
})();

/* ---------- typing effect for hero subtitle ---------- */
(function typeEffect() {
  const el = document.querySelector('.hero-sub .typed');
  if (!el) return;
  const phrases = ['Software Engineer @ Tradeweb', 'B.A. Computer Science & Math, Hamilton \'24', 'Graph Theory & AI', 'Building agentic dev tools'];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIdx--;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 80);
  }
  tick();
})();

/* ---------- active nav dot on scroll ---------- */
(function navDots() {
  const dots = document.querySelectorAll('.nav-dots a');
  const sections = Array.from(dots)
    .map((d) => document.querySelector(d.getAttribute('href')))
    .filter(Boolean);
  if (!dots.length || !sections.length) return;

  function onScroll() {
    let current = sections[0];
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top <= window.innerHeight * 0.4) {
        current = sec;
      }
    }
    dots.forEach((d) => {
      d.classList.toggle('active', d.getAttribute('href') === `#${current.id}`);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- generated career visuals (canvas, no external images) ---------- */
(function careerVisuals() {
  const canvases = Array.from(document.querySelectorAll('canvas[data-viz]'));
  if (!canvases.length) return;

  const VIOLET = '139,92,246';
  const FUCHSIA = '217,70,239';

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, cx, cy, maxWidth, lineHeight) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    lines.push(line);
    const startY = cy - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((l, i) => ctx.fillText(l, cx, startY + i * lineHeight));
  }

  function drawNetwork(s, t) {
    const { ctx, w, h } = s;
    ctx.clearRect(0, 0, w, h);
    const nodes = [
      [0.1, 0.5], [0.3, 0.22], [0.3, 0.78], [0.52, 0.5],
      [0.74, 0.18], [0.74, 0.5], [0.74, 0.82], [0.92, 0.5],
    ].map(([x, y]) => [x * w, y * h]);
    const edges = [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[3,6],[4,7],[5,7],[6,7]];

    edges.forEach(([a, b], i) => {
      ctx.strokeStyle = `rgba(${VIOLET},0.25)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(nodes[a][0], nodes[a][1]);
      ctx.lineTo(nodes[b][0], nodes[b][1]);
      ctx.stroke();

      const phase = (t * 0.00035 + i * 0.15) % 1;
      const px = nodes[a][0] + (nodes[b][0] - nodes[a][0]) * phase;
      const py = nodes[a][1] + (nodes[b][1] - nodes[a][1]) * phase;
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${FUCHSIA},0.9)`;
      ctx.fill();
    });

    nodes.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${VIOLET},0.9)`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 7.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${VIOLET},0.3)`;
      ctx.stroke();
    });
  }

  function drawPipeline(s, t) {
    const { ctx, w, h } = s;
    ctx.clearRect(0, 0, w, h);
    const stages = ['RAW DATA', 'AUTOMATION', 'REST API', 'RECOMMENDATIONS'];
    const n = stages.length;
    const boxW = (w / n) * 0.68;
    const boxH = h * 0.4;
    const y = h / 2 - boxH / 2;
    const xs = stages.map((_, i) => (i + 0.5) * (w / n) - boxW / 2);

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < n - 1; i++) {
      const startX = xs[i] + boxW;
      const endX = xs[i + 1];
      ctx.strokeStyle = `rgba(${VIOLET},0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, h / 2);
      ctx.lineTo(endX, h / 2);
      ctx.stroke();

      const phase = (t * 0.0004 + i * 0.3) % 1;
      const px = startX + (endX - startX) * phase;
      ctx.beginPath();
      ctx.arc(px, h / 2, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${FUCHSIA},0.9)`;
      ctx.fill();
    }

    stages.forEach((label, i) => {
      const x = xs[i];
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.strokeStyle = `rgba(${VIOLET},0.4)`;
      ctx.lineWidth = 1;
      roundRect(ctx, x, y, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(233,225,255,0.85)';
      wrapText(ctx, label, x + boxW / 2, y + boxH / 2, boxW - 10, 11);
    });
  }

  function drawWave(s, t) {
    const { ctx, w, h } = s;
    ctx.clearRect(0, 0, w, h);
    const bars = 26;
    const gap = w / bars;
    for (let i = 0; i < bars; i++) {
      const amp = (Math.sin(t * 0.002 + i * 0.5) + 1) / 2;
      const barH = 6 + amp * (h * 0.6);
      const x = i * gap + gap * 0.25;
      const bw = gap * 0.5;
      const y = h / 2 - barH / 2;
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, `rgba(${FUCHSIA},0.9)`);
      grad.addColorStop(1, `rgba(${VIOLET},0.5)`);
      ctx.fillStyle = grad;
      roundRect(ctx, x, y, bw, barH, bw / 2);
      ctx.fill();
    }
  }

  function drawMathGraph(s, t) {
    const { ctx, w, h } = s;
    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = `rgba(${VIOLET},0.18)`;
    ctx.lineWidth = 1.2;
    for (let x = 0; x <= w; x += 4) {
      const y = h / 2 + Math.sin(x * 0.02 + t * 0.0006) * (h * 0.22);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    const nodes = [
      [0.08, 0.5], [0.24, 0.24], [0.24, 0.76], [0.42, 0.5],
      [0.6, 0.2], [0.6, 0.8], [0.78, 0.38], [0.78, 0.64], [0.94, 0.5],
    ].map(([x, y]) => [x * w, y * h]);
    const edges = [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,6],[5,7],[6,8],[7,8],[4,5]];

    ctx.lineWidth = 1;
    edges.forEach(([a, b]) => {
      ctx.strokeStyle = `rgba(${FUCHSIA},0.28)`;
      ctx.beginPath();
      ctx.moveTo(nodes[a][0], nodes[a][1]);
      ctx.lineTo(nodes[b][0], nodes[b][1]);
      ctx.stroke();
    });
    nodes.forEach(([x, y], i) => {
      const pulse = 3.4 + Math.sin(t * 0.002 + i) * 0.8;
      ctx.beginPath();
      ctx.arc(x, y, pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${VIOLET},0.9)`;
      ctx.fill();
    });
  }

  const drawFns = { network: drawNetwork, pipeline: drawPipeline, wave: drawWave, mathgraph: drawMathGraph };

  const state = canvases
    .filter((canvas) => drawFns[canvas.dataset.viz])
    .map((canvas) => ({ canvas, type: canvas.dataset.viz }));

  function fitCanvas(s) {
    const rect = s.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    s.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    s.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    s.ctx = s.canvas.getContext('2d');
    s.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    s.w = rect.width;
    s.h = rect.height;
  }

  function resizeAll() {
    state.forEach(fitCanvas);
  }

  function frame(t) {
    state.forEach((s) => drawFns[s.type](s, t));
    requestAnimationFrame(frame);
  }

  resizeAll();
  window.addEventListener('resize', resizeAll);
  requestAnimationFrame(frame);
})();
