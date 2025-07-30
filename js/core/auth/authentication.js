/*-----------------------------------------------------------------------------
  authentication.js – session‑cookie version (with logs)
-----------------------------------------------------------------------------*/
import { APP_URL } from '../../core/config.js';

// ───────────── helpers ─────────────
async function postJSON(url, body) {
  console.log('📤 POST to:', url, '| Body:', body);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });

  const data = await res.json().catch(() => ({}));
  console.log('📥 Response:', res.status, '| Data:', data);

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function showError(msg = '') {
  console.warn('⚠️ Error:', msg);
  const box = document.querySelector('.warning-box');
  if (!box) return;
  box.style.display = msg ? 'block' : 'none';
  box.style.color = 'red';
  box.textContent = msg;
}

// ───────────── register ─────────────
export async function handleRegister(e) {
  e.preventDefault();
  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;
  console.log('📝 Registering:', username);

  try {
    await postJSON(`${APP_URL}/auth/signup`, { username, password });
    alert('Account created successfully!');
  } catch (err) {
    console.error('❌ Register failed:', err);
    showError(err.message);
  }
}
window.handleRegister = handleRegister;

// ───────────── login ─────────────
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('usernameInput').value;
  const password = document.getElementById('passwordInput').value;
  console.log('🔐 Logging in:', username);

  try {
    await postJSON(`${APP_URL}/auth/login`, { username, password });
    console.log('✅ Login successful. Redirecting to album...');
    window.location.href = 'album.html';
  } catch (err) {
    console.error('❌ Login failed:', err);
    showError(err.message);
  }
});

// ───────────── welcome banner ─────────────
document.addEventListener('DOMContentLoaded', async () => {
  const banner = document.getElementById('welcomeMessage');
  if (!banner) return;

  console.log('🔎 Checking session status...');
  try {
    const { username } = await fetch(`${APP_URL}/auth/me`, {
      credentials: 'include'
    }).then(r => r.json());
    banner.textContent = `Welcome, ${username || 'Guest'}`;
    console.log('👋 Welcome user:', username);
  } catch (err) {
    banner.textContent = 'Welcome, Guest';
    console.warn('🕵️ No session found');
  }
});

// ───────────── sign‑out ─────────────
export async function signOut() {
  console.log('🚪 Signing out...');
  try {
    await fetch(`${APP_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    console.log('✅ Logged out');
  } catch (err) {
    console.error('❌ Logout error:', err);
  } finally {
    window.location.href = 'login.html';
  }
}
window.signOut = signOut;
