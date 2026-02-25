document.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('search-btn');
  if (!btn) return;
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    var kw = document.getElementById('search-keyword').value.trim();
    var loc = document.getElementById('search-location').value.trim();
    var exp = document.getElementById('search-experience').value;
    var params = [];
    if (kw) params.push('kw=' + encodeURIComponent(kw));
    if (loc) params.push('loc=' + encodeURIComponent(loc));
    if (exp) params.push('exp=' + encodeURIComponent(exp));
    var url = 'jobs/search/index.html';
    if (params.length) url += '?' + params.join('&');
    window.location.href = url;
  });
});
