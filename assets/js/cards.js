// Cartes de jeux : inclinaison 3D au survol et étincelles sur la bordure.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function sparkFrom(card) {
    var w = card.offsetWidth, h = card.offsetHeight;
    var edge = Math.floor(Math.random() * 4);
    var t = Math.random();
    var x, y, nx, ny;
    if (edge === 0) { x = t * w; y = 0; nx = 0; ny = -1; }
    else if (edge === 1) { x = w; y = t * h; nx = 1; ny = 0; }
    else if (edge === 2) { x = t * w; y = h; nx = 0; ny = 1; }
    else { x = 0; y = t * h; nx = -1; ny = 0; }

    var s = document.createElement('span');
    s.className = 'spark';
    s.style.left = x - 2 + 'px';
    s.style.top = y - 2 + 'px';
    card.appendChild(s);

    var dist = 24 + Math.random() * 46;
    var dx = nx * dist + (Math.random() - 0.5) * 30;
    var dy = ny * dist - 20 - Math.random() * 40;
    var anim = s.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0.2)', opacity: 0 }
    ], { duration: 700 + Math.random() * 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    anim.onfinish = function () { s.remove(); };
  }

  document.querySelectorAll('[data-tilt]').forEach(function (card) {
    var frame = 0, timer = 0, rx = 0, ry = 0;

    function apply() {
      card.style.setProperty('--rx', rx + 'deg');
      card.style.setProperty('--ry', ry + 'deg');
      frame = 0;
    }

    card.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      card.classList.add('is-tilting');
      for (var i = 0; i < 10; i++) sparkFrom(card);
      timer = setInterval(function () { sparkFrom(card); }, 240);
    });

    card.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      rx = ((0.5 - py) * 6).toFixed(2);
      ry = ((px - 0.5) * 8).toFixed(2);
      if (!frame) frame = requestAnimationFrame(apply);
    });

    card.addEventListener('pointerleave', function () {
      clearInterval(timer);
      card.classList.remove('is-tilting');
      rx = ry = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    });
  });
})();
