// Petite traînée de braises derrière le curseur (souris uniquement).
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'trail';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var particles = [];
  var raf = 0, last = 0, lastX = null, lastY = null;

  function resize() {
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame(t) {
    var dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life -= dt;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy -= 30 * dt;
      var k = p.life / p.max;
      ctx.globalAlpha = k * 0.85;
      ctx.fillStyle = k > 0.55 ? '#FFB25E' : '#F25C05';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.4 + k * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = particles.length ? requestAnimationFrame(frame) : 0;
  }

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var dist = lastX === null ? 0 : Math.hypot(e.clientX - lastX, e.clientY - lastY);
    lastX = e.clientX;
    lastY = e.clientY;
    if (dist < 6 || particles.length > 80) return;
    var life = 0.45 + Math.random() * 0.45;
    particles.push({
      x: e.clientX, y: e.clientY,
      vx: (Math.random() - 0.5) * 30, vy: -10 - Math.random() * 30,
      r: 1 + Math.random() * 1.6, life: life, max: life
    });
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }, { passive: true });

  window.addEventListener('resize', resize);
  resize();
})();
