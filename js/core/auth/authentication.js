/*-----------------------------------------------------------------------------
  authentication.js – JWT 
-----------------------------------------------------------------------------*/
import { APP_URL } from '../../core/config.js';
console.log('APP_URL:', APP_URL);

// ───────────── Token Management ─────────────
let authToken = localStorage.getItem('token');
export function getAuthToken() {
  return localStorage.getItem('token');
}


function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

// ───────────── API Helpers ─────────────
async function postJSON(url, body) {
  console.log('POST to:', url, '| Body:', body);
  const headers = { 'Content-Type': 'application/json' };
  if (authToken && !url.endsWith('/login') && !url.endsWith('/signup')) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  const data = await res.json().catch(() => ({}));
  console.log('Response:', res.status, '| Data:', data);

  if (!res.ok) {
    if (res.status === 401) {
      setAuthToken(null); // Clear invalid token
      window.location.href = 'login.html';
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error(data.error || 'Request failed');
  }
  
  // Save token if it's returned from login/signup
  if (data.token) {
    setAuthToken(data.token);
  }
  
  return data;
}

function showError(msg = '') {
  console.warn('Error:', msg);
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
    console.error('Register failed:', err);
    showError(err.message);
  }
}
window.handleRegister = handleRegister;


// ───────────── login ─────────────
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('usernameInput').value;
  const password = document.getElementById('passwordInput').value;
  console.log('Logging in:', username);

  try {
    const result = await postJSON(`${APP_URL}/auth/login`, { username, password });

    // Save user ID in localStorage
    if (result.user?.id) {
      localStorage.setItem('userId', result.user.id);
      console.log('Saved user ID:', result.user.id);
    }

    console.log('Login successful. Redirecting to album...');
    window.location.href = 'album.html'; // or mailbox.html
  } catch (err) {
    console.error('Login failed:', err);
    showError(err.message);
  }
});


// ───────────── welcome banner ─────────────
document.addEventListener('DOMContentLoaded', async () => {
  const banner = document.getElementById('welcomeMessage');
  if (!banner) return;

  console.log('🔎 Checking auth status...');
  try {
    const response = await fetch(`${APP_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then(r => r.json());
    banner.textContent = `Welcome, ${response.user.username || 'Guest'}`;
    console.log('👋 Welcome user:', response.user.username);
  } catch (err) {
    banner.textContent = 'Welcome, Guest';
    console.warn('🕵️ No auth token or invalid token');
    setAuthToken(null); // Clear invalid token
  }
});

// ───────────── sign‑out ─────────────
export async function signOut() {
  console.log('Signing out...');
  try {
    await fetch(`${APP_URL}/auth/logout`, { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Logged out');
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    setAuthToken(null);
    window.location.href = 'login.html';
  }
}
window.signOut = signOut;
