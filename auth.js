import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

let auth = null;

function showMessage(elId, msg, isError = false) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? '#b91c1c' : '#475569';
}

function clearMessage(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = '';
}

async function loadConfig() {
  try {
    const res = await fetch('/firebase-config.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not fetch /firebase-config.json');
    return await res.json();
  } catch (err) {
    console.error('Error loading firebase config:', err);
    return null;
  }
}

async function startAuth() {
  const cfg = await loadConfig();
  if (!cfg) {
    console.warn('Firebase config not found — auth is disabled. Add /firebase-config.json to enable authentication.');
    return;
  }

  try {
    const app = initializeApp(cfg);
    auth = getAuth(app);
    try { var db = getFirestore(app); } catch (e) { console.warn('Firestore init failed', e); db = null; }
  } catch (err) {
    console.error('Firebase initialization failed', err);
    return;
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessage('registerMessage');

      const name = document.getElementById('fullname').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirm = (document.getElementById('passwordConfirm') && document.getElementById('passwordConfirm').value) || '';

      if (!email || !password) {
        showMessage('registerMessage', 'Email and password are required', true);
        return;
      }

      if (password.length < 6) {
        showMessage('registerMessage', 'Password must be at least 6 characters', true);
        return;
      }

      if (password !== confirm) {
        showMessage('registerMessage', 'Passwords do not match', true);
        return;
      }

      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCred.user, { displayName: name });
        }
        try { await sendEmailVerification(userCred.user); } catch (err) {}

        if (typeof db !== 'undefined' && db) {
          try {
            await setDoc(doc(db, 'users', userCred.user.uid), {
              name: name || null,
              email: email,
              role: 'jobseeker',
              createdAt: serverTimestamp()
            });
          } catch (err) {
            console.warn('Failed to save profile to Firestore', err);
          }
        }

        showMessage('registerMessage', 'Account created. Verification email sent (if enabled). Redirecting...');
        setTimeout(() => { window.location.href = '/login/index.html'; }, 1600);
      } catch (err) {
        const code = err.code || '';
        const msg = (err.message || 'Registration failed').replace('Firebase: ', '');
        showMessage('registerMessage', `${code} — ${msg}`, true);
        console.error(err);
      }
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessage('loginMessage');

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (!email || !password) {
        showMessage('loginMessage', 'Email and password are required', true);
        return;
      }

      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        showMessage('loginMessage', 'Login successful. Redirecting...');
        setTimeout(() => { window.location.href = '/'; }, 900);
      } catch (err) {
        const code = err.code || '';
        const msg = (err.message || 'Login failed').replace('Firebase: ', '');
        showMessage('loginMessage', `${code} — ${msg}`, true);
        console.error(err);
      }
    });
  }
}

startAuth();

export function getAuthInstance() { return auth; }
