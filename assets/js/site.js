// Header compact au scroll + fermeture du menu de langue.
(function () {
  var header = document.querySelector('.site-header');
  if (header) {
    var update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  var lang = document.querySelector('.lang');
  if (lang) {
    document.addEventListener('click', function (e) {
      if (lang.open && !lang.contains(e.target)) lang.open = false;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lang.open) {
        lang.open = false;
        lang.querySelector('summary').focus();
      }
    });
  }
})();
