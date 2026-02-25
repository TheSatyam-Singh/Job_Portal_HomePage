function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

function getLogoUrl(companyName) {
  if (!companyName) return '';
  const slug = companyName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  const token = 'pk_LoVhOGmeSIStfZajPMuB_g';
  return `https://img.logo.dev/name/${encodeURIComponent(slug)}?token=${token}`;
}

function renderResults(jobs) {
  const list = document.getElementById('results-list');
  list.innerHTML = '';
  if (!jobs || jobs.length === 0) {
    list.innerHTML = '<p>No jobs found.</p>';
    return;
  }

  jobs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'job-card';

    const logoUrl = getLogoUrl(job.company || '');
    const logoHtml = logoUrl ? `<img class="company-logo" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(job.company)} logo" ">` : '';

    card.innerHTML = `
      <div class="card-inner">
        ${logoHtml}
        <div class="card-content">
          <h2>${escapeHtml(job.title || '')}</h2>
          <p><strong>Company:</strong> ${escapeHtml(job.company || '')}</p>
          <p><strong>Location:</strong> ${escapeHtml(job.location || '')}</p>
          <p><strong>Role:</strong> ${escapeHtml(job.role || '')}</p>
          <div class="job-actions">
            <button class="apply-btn">Apply</button>
          </div>
        </div>
      </div>
    `;

    card.querySelector('.apply-btn').addEventListener('click', () => {
      const params = new URLSearchParams({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        role: job.role || ''
      });
      window.open('../apply/index.html?' + params.toString(), '_blank');
    });

    list.appendChild(card);
  });
}

function doSearch(opts) {
  let kw = '', loc = '';
  if (opts && typeof opts === 'object') {
    kw = (opts.kw || '').trim().toLowerCase();
    loc = (opts.loc || '').trim().toLowerCase();
  } else {
    kw = (document.getElementById('search-keyword').value || '').trim().toLowerCase();
    loc = (document.getElementById('search-location').value || '').trim().toLowerCase();
  }

  const stored = JSON.parse(localStorage.getItem('jobs') || '[]');
  const results = stored.filter(job => {
    const combined = `${job.title || ''} ${job.company || ''} ${job.location || ''} ${job.role || ''}`.toLowerCase();
    if (kw && !combined.includes(kw)) return false;
    if (loc && !(job.location || '').toLowerCase().includes(loc)) return false;
    return true;
  });

  renderResults(results);
}

document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const kw = params.get('kw') || '';
  const loc = params.get('loc') || '';

  if (document.getElementById('search-keyword')) document.getElementById('search-keyword').value = kw;
  if (document.getElementById('search-location')) document.getElementById('search-location').value = loc;

  document.getElementById('search-btn').addEventListener('click', function(e) {
    e.preventDefault();
    doSearch();
  });

  document.getElementById('search-keyword').addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });
  document.getElementById('search-location').addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });

  if (kw || loc) {
    doSearch({ kw, loc });
  } else {
    const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    renderResults(allJobs);
  }
});
