/*-----------------------------------------------------------------------------
  authentication.js – session‑cookie version
-----------------------------------------------------------------------------*/
import { APP_URL } from '../../core/config.js';

// ───────────── helpers ─────────────
async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
function showError(msg = '') {
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
  try {
    await postJSON(`${APP_URL}/auth/signup`, { username, password });
    alert('Account created successfully!');
  } catch (err) {
    console.error(err);
    showError(err.message);
  }
}
window.handleRegister = handleRegister;

// ───────────── login ─────────────
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('usernameInput').value;
  const password = document.getElementById('passwordInput').value;
  try {
    await postJSON(`${APP_URL}/auth/login`, { username, password }); // sets cookie
    window.location.href = 'album.html';
  } catch (err) {
    console.error(err);
    showError(err.message);
  }
});

// ───────────── welcome banner ─────────────
document.addEventListener('DOMContentLoaded', async () => {
  const banner = document.getElementById('welcomeMessage');
  if (!banner) return;
  try {
    const { username } = await fetch(`${APP_URL}/auth/me`, {
      credentials: 'include'
    }).then(r => r.json());
    banner.textContent = `Welcome, ${username || 'Guest'}`;
  } catch {
    banner.textContent = 'Welcome, Guest';
  }
});

// ───────────── sign‑out ─────────────
export async function signOut() {
  try {
    await fetch(`${APP_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
  } finally {
    window.location.href = 'login.html';
  }
}
window.signOut = signOut;
