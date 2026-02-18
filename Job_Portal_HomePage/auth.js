// auth.js - Firebase Email/Password auth (modular SDK)
// Place Firebase config in /firebase-config.json (so secrets are not hardcoded in JS).
// 1) Create a Firebase project and enable Email/Password auth in Authentication
// 2) Add your Firebase config values to firebase-config.json

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

let auth = null; // will be set after config is loaded

// Helpers
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

// Load firebase config from JSON
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

// Initialize Firebase and wire up forms
async function startAuth() {
  const cfg = await loadConfig();
  if (!cfg) {
    console.warn('Firebase config not found — auth is disabled. Add /firebase-config.json to enable authentication.');
    return;
  }

  try {
    const app = initializeApp(cfg);
    auth = getAuth(app);
    // Initialize Firestore (optional)
    try { var db = getFirestore(app); } catch (e) { console.warn('Firestore init failed', e); db = null; }
  } catch (err) {
    console.error('Firebase initialization failed', err);
    return;
  }

  // Register flow
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
        // Set display name
        if (name) {
          await updateProfile(userCred.user, { displayName: name });
        }
        // Optionally send verification email
        try { await sendEmailVerification(userCred.user); } catch (err) { /* ignore */ }

        // Save basic profile to Firestore if available
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

  // Login flow
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

// start
startAuth();

// Export a getter in case other modules need auth after init
export function getAuthInstance() { return auth; }
