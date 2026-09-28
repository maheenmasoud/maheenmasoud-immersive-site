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
