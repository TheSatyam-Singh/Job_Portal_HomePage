const jobform = document.getElementById('job-form');
const joblist = document.getElementById('joblist');
const submitButton = document.getElementById('submit-button');

const STORAGE_KEY = 'jobs';
let jobs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let editingIndex = null;

function saveJobs() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

function getLogoUrl(companyName) {
    if (!companyName) return '';
    const slug = companyName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
        
    const token = 'pk_LoVhOGmeSIStfZajPMuB_g';
    return `https://img.logo.dev/name/${encodeURIComponent(slug)}?token=${token}`;
}

function escapeHtml(s) {
    return (s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderJobs(filter = '') {
    joblist.innerHTML = '<h2>Available Jobs</h2>';
    const q = (filter || '').trim().toLowerCase();

    jobs.forEach((job, idx) => {
        const combined = (job.title + ' ' + job.company + ' ' + job.location + ' ' + job.role).toLowerCase();
        if (q && !combined.includes(q)) return;

        const card = document.createElement('div');
        card.className = 'job-card';

        const logoUrl = getLogoUrl(job.company);

        card.innerHTML = `
            <div class="card-inner">
                <img class="company-logo" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(job.company)} logo" onerror="this.style.display='none'">
                <div class="card-content">
                    <h3>${escapeHtml(job.title)}</h3>
                    <p><strong>Company:</strong> ${escapeHtml(job.company)}</p>
                    <p><strong>Location:</strong> ${escapeHtml(job.location)}</p>
                    <p><strong>Role:</strong> ${escapeHtml(job.role)}</p>
                    <div class="job-actions">
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                        <button class="apply-btn">Apply</button>
                    </div>
                </div>
            </div>
        `;

        card.querySelector('.edit-btn').addEventListener('click', () => {
            editingIndex = idx;
            document.getElementById('job-title').value = job.title;
            document.getElementById('company-name').value = job.company;
            document.getElementById('location').value = job.location;
            document.getElementById('job-role').value = job.role;
            submitButton.textContent = 'Update Job';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        card.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Delete this job?')) {
                jobs.splice(idx, 1);
                saveJobs();
                renderJobs(document.getElementById('search-input') ? document.getElementById('search-input').value : '');
            }
        });

        card.querySelector('.apply-btn').addEventListener('click', () => {
            const params = new URLSearchParams({
                title: job.title || '',
                company: job.company || '',
                location: job.location || '',
                role: job.role || ''
            });
            window.open('apply/index.html?' + params.toString(), '_blank');
        });

        joblist.appendChild(card);
    });
}

jobform.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('job-title').value.trim();
    const company = document.getElementById('company-name').value.trim();
    const location = document.getElementById('location').value.trim();
    const role = document.getElementById('job-role').value.trim();

    if (!title && !company) {
        alert('Enter a job title or company');
        return;
    }

    const item = { title, company, location, role };

    if (editingIndex === null) {
        jobs.push(item);
    } else {
        jobs[editingIndex] = item;
        editingIndex = null;
    }

    saveJobs();
    jobform.reset();
    submitButton.textContent = 'Add Job';
    renderJobs();
});

const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        renderJobs(this.value);
    });
}

renderJobs();