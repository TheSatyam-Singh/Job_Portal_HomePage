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
    form.addEventListener('submit', (e) => {
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

        setTimeout(() => {
            submitButton.classList.remove('loading');
            submitButton.classList.add('success');

            setTimeout(() => {
                const conf = document.createElement('div');
                conf.className = 'card-container';
                const submittedAt = new Date().toLocaleString();
                conf.innerHTML = `
                    <div style="text-align:center;margin-bottom:24px;">
                        <img src="${logoUrl}" alt="${company} logo" style="width:80px;height:80px;object-fit:contain;margin-bottom:12px;" onerror="this.style.display='none'">
                    </div>
                    <h2 style="text-align:center;">Application Submitted</h2>
                    <p class="muted" style="text-align:center;">Your application has been received (prototype mode).</p>
                    <div style="margin-top:12px;">
                        <h3 style="margin:6px 0;text-align:center;">${title || 'Untitled role'}</h3>
                        <p style="margin:4px 0;color:#475569;text-align:center;">${company || 'Unknown company'}</p>
                        <p style="margin:6px 0;text-align:center;">Applicant: <strong>${name}</strong></p>
                        <p style="margin:6px 0;text-align:center;">Email: <strong>${email}</strong></p>
                        <p style="margin:6px 0;text-align:center;">Resume: <strong>${file.name}</strong></p>
                        <p class="muted" style="margin-top:12px;text-align:center;">Submitted: ${submittedAt}</p>
                    </div>
                    <div style="margin-top:24px;text-align:center">
                        <a href="/jobs/index.html" class="btn" style="display:inline-block;min-width:200px;padding:14px 24px;font-size:1rem;">Back to Jobs</a>
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

                launchConfetti();
            }, 700);
        }, 500);
    });

    function launchConfetti() {
        const colors = ['#2563eb', '#16a34a', '#dc2626', '#f59e0b', '#8b5cf6'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = `fall ${2 + Math.random() * 1}s linear forwards`;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }
    }
});

const style = document.createElement('style');
style.innerHTML = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
