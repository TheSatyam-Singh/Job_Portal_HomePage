function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title') || '';
    const company = params.get('company') || '';
    const location = params.get('location') || '';
    const role = params.get('role') || '';

    const companyTitle = document.getElementById('company-title');
    const companyNameEl = document.getElementById('company-name');
    const companyRole = document.getElementById('company-role');
    const companyLocation = document.getElementById('company-location');
    const postedInfo = document.getElementById('posted-info');
    const logoImg = document.getElementById('company-logo');

    companyTitle.textContent = title || 'Untitled role';
    companyNameEl.textContent = company || 'Unknown company';
    companyRole.textContent = role ? `Role: ${role}` : '';
    companyLocation.textContent = location ? `Location: ${location}` : '';
    postedInfo.textContent = `Open since ${new Date().toLocaleDateString()}`;

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

    const logoUrl = getLogoUrl(company);
    if (logoUrl) {
        logoImg.src = logoUrl;
        logoImg.style.display = '';
    } else {
        logoImg.style.display = 'none';
    }

    const resumeInput = document.getElementById('resume');
    const resumeInfo = document.getElementById('resume-info');
    resumeInput.addEventListener('change', () => {
        const f = resumeInput.files[0];
        if (!f) {
            resumeInfo.textContent = '';
            return;
        }
        const sizeKb = Math.round(f.size / 1024);
        resumeInfo.textContent = `${f.name} — ${sizeKb} KB`;
    });

    const form = document.getElementById('apply-form');
    const submitButton = document.getElementById('submit-application');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const file = resumeInput.files[0];

        if (!name || !email || !file) {
            alert('Please fill name, email and attach a resume.');
            return;
        }

        submitButton.classList.add('loading');
        submitButton.disabled = true;
        const controls = Array.from(form.querySelectorAll('input,button,textarea'));
        controls.forEach(c => { if (c !== submitButton) c.disabled = true });

        try {
            const dataUrl = await readFileAsDataURL(file);
            const applications = JSON.parse(localStorage.getItem('applications') || '[]');
            applications.push({
                job: { title, company, location, role },
                name,
                email,
                cover: '',
                resumeName: file.name,
                resumeType: file.type,
                resumeDataUrl: dataUrl,
                submittedAt: new Date().toISOString()
            });
            localStorage.setItem('applications', JSON.stringify(applications));

            submitButton.classList.remove('loading');
            submitButton.classList.add('success');

            setTimeout(() => {
                const conf = document.createElement('div');
                conf.className = 'card-container';
                const submittedAt = new Date().toLocaleString();
                conf.innerHTML = `
                    <h2>Application Submitted</h2>
                    <p class="muted">Your application has been received.</p>
                    <div style="margin-top:12px;">
                        <h3 style="margin:6px 0">${title || 'Untitled role'}</h3>
                        <p style="margin:4px 0;color:#475569">${company || 'Unknown company'}</p>
                        <p style="margin:6px 0">Applicant: <strong>${name}</strong></p>
                        <p style="margin:6px 0">Email: <strong>${email}</strong></p>
                        <p style="margin:6px 0">Resume: <strong>${file.name}</strong></p>
                        <p class="muted" style="margin-top:12px">Submitted: ${submittedAt}</p>
                    </div>
                    <div style="margin-top:18px;text-align:center">
                        <a href="/jobs/index.html" class="btn">Back to Jobs</a>
                    </div>
                `;

                const main = document.querySelector('main.auth-page') || document.body;
                main.innerHTML = '';
                const wrap = document.createElement('div');
                wrap.style.display = 'flex';
                wrap.style.alignItems = 'center';
                wrap.style.justifyContent = 'center';
                wrap.style.minHeight = '50vh';
                wrap.appendChild(conf);
                main.appendChild(wrap);
            }, 700);
        } catch (err) {
            console.error(err);
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            controls.forEach(c => c.disabled = false);
            alert('Could not read resume file.');
        }
    });
});
