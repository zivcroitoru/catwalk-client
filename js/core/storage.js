/*-----------------------------------------------------------------------------
  storage.js – DB‑backed user inventory
-----------------------------------------------------------------------------*/
import { APP_URL } from './config.js'; // adjust path if needed

const API = `${APP_URL}/api/user-items`;
let cache = null;

// ───────────── REST helpers ─────────────
async function apiGet() {
  const token = localStorage.getItem('token');
  const res = await fetch(API, { 
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      throw new Error('Auth token expired');
    }
    throw new Error('GET /user-items failed');
  }
  return res.json();
}
async function apiPatch(body) {
  const token = localStorage.getItem('token');
  const res = await fetch(API, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      throw new Error('Auth token expired');
    }
    throw new Error('PATCH /user-items failed');
  }
  return res.json();
  return res.json();
}

// ───────────── Load & Save ─────────────
export async function loadUserItems(force = false) {
  if (cache && !force) return cache;
  cache = await apiGet();
  return cache;
}
export async function saveUserItems(userItems) {
  cache = await apiPatch(userItems);
  return cache;
}

// ───────────── Cats access ─────────────
export async function getUserCats() {
  const { userCats = [] } = await loadUserItems();
  return userCats;
}
export async function addCatToUser(cat) {
  const userItems = await loadUserItems();
  userItems.userCats = [...userItems.userCats, cat];
  await saveUserItems({ userCats: userItems.userCats });
  updateUI();
}

// ───────────── Patch update ─────────────
export async function updateUserItems(updates = {}) {
  await saveUserItems(updates);
  updateUI();
}

// ───────────── UI updates ─────────────
export async function updateCoinCount() {
  const { coins = 0 } = await loadUserItems();
  const el = document.querySelector('.coin-count');
  if (el) el.textContent = coins;
}
export async function updateCatCountUI() {
  const { userCats = [] } = await loadUserItems();
  const el = document.querySelector('.cat-count');
  if (el) el.textContent = `Total Cats: ${userCats.length}`;
}
export function updateUI() {
  updateCoinCount();
  updateCatCountUI();
}
