// Braises qui montent dans le hero (canvas, en pause hors écran).
(function () {
  var canvas = document.querySelector('.embers');
  if (!canvas || !canvas.getContext) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var count = window.innerWidth < 768 ? 26 : 60;
  var particles = [];
  var w = 0, h = 0, raf = 0, last = 0;
  var onScreen = true;

  // Sprite lumineux pré-rendu : un drawImage par braise, rien de plus.
  var sprite = document.createElement('canvas');
  sprite.width = sprite.height = 32;
  var sctx = sprite.getContext('2d');
  var g = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,214,150,1)');
  g.addColorStop(0.18, 'rgba(255,138,31,0.95)');
  g.addColorStop(0.45, 'rgba(242,92,5,0.35)');
  g.addColorStop(1, 'rgba(184,50,4,0)');
  sctx.fillStyle = g;
  sctx.fillRect(0, 0, 32, 32);

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(p, anywhere) {
    p.x = Math.random() * w;
    p.y0 = anywhere ? Math.random() * h : h + 12;
    p.y = p.y0;
    p.travel = h * (0.35 + Math.random() * 0.55);
    p.size = 6 + Math.random() * 12;
    p.vy = 18 + Math.random() * 42;
    p.sway = 8 + Math.random() * 22;
    p.phase = Math.random() * Math.PI * 2;
    return p;
  }

  function frame(t) {
    var dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.y -= p.vy * dt;
      p.phase += dt * 1.4;
      var progress = (p.y0 - p.y) / p.travel;
      if (progress >= 1) { spawn(p, false); continue; }
      var alpha = Math.sin(Math.PI * Math.max(progress, 0)) * 0.9;
      var s = p.size * (1 - progress * 0.5);
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, p.x + Math.sin(p.phase) * p.sway - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf || !onScreen || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  resize();
  for (var i = 0; i < count; i++) particles.push(spawn({}, true));

  window.addEventListener('resize', function () {
    resize();
    particles.forEach(function (p) { spawn(p, true); });
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) start(); else stop();
    }).observe(canvas);
  }

  start();
})();
