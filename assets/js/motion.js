// Animations au scroll (GSAP + ScrollTrigger).
// Sans GSAP ou en mouvement réduit, rien n'est caché : le contenu reste lisible.
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  document.documentElement.classList.add('motion-ready');

  // Titres : l'encre se diffuse.
  gsap.utils.toArray('[data-reveal="ink"]').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, y: 24, filter: 'blur(14px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.3, ease: 'power3.out',
        clearProps: 'filter',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
  });

  gsap.utils.toArray('[data-reveal="fade"]').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, y: 16 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.15,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
  });

  // Séparateurs : le coup de pinceau se trace.
  gsap.utils.toArray('.brush-divider').forEach(function (svg) {
    var path = svg.querySelector('path');
    var dot = svg.querySelector('circle');
    var tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 88%', once: true } });
    tl.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
      .fromTo(dot, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, '-=0.15');
  });

  // Cartes : arrivée échelonnée.
  window.ScrollTrigger.batch('[data-reveal="card"]', {
    start: 'top 88%',
    once: true,
    onEnter: function (els) {
      gsap.fromTo(els,
        { opacity: 0, y: 56, rotateX: -8, transformPerspective: 1000 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.1, ease: 'expo.out', stagger: 0.14, clearProps: 'transform' });
    }
  });

  // Hero : parallaxe douce en quittant l'écran.
  var hero = document.querySelector('.hero');
  if (hero) {
    var st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero-bg', { '--py': '14%', ease: 'none', scrollTrigger: st });
    gsap.to('.hero-content', { y: -90, opacity: 0.15, ease: 'none', scrollTrigger: st });
    gsap.to('.scroll-cue', { opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '20% top', scrub: true } });
  }
})();
