(function () {
  var supported = ['fr', 'en', 'de', 'it', 'es', 'pt'];
  var fallback = 'en';
  var candidates = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || navigator.userLanguage || fallback];

  var target = fallback;
  for (var i = 0; i < candidates.length; i++) {
    var code = String(candidates[i]).slice(0, 2).toLowerCase();
    if (supported.indexOf(code) !== -1) {
      target = code;
      break;
    }
  }

  window.location.replace(target + '/');
})();
