/*---------------------------------------------------export async function loadPlayerItems(force = false) {
  if (!force && cache) return cache;
  cache = await apiGet();
  return cache;
}

export async function savePlayerItems(playerItems) {
  cache = await apiPatch(playerItems);
  return cache;
}----------------
  storage.js – DB-backed player inventory
-----------------------------------------------------------------------------*/
import { APP_URL } from './config.js';

const API = `${APP_URL}/api/player-items`;
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
    throw new Error('GET /player-items failed');
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
    throw new Error('PATCH /player-items failed');
  }

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

// ───────────── Cats Access ─────────────
export async function getUserCats() {
  const { userCats = [] } = await loadPlayerItems();
  return userCats;
}

export async function addCatToUser(cat) {
  const playerItems = await loadPlayerItems();
  const currentCats = Array.isArray(playerItems.userCats) ? playerItems.userCats : [];
  playerItems.userCats = [...currentCats, cat];

  await savePlayerItems({ userCats: playerItems.userCats });
  updateUI();
}

// ───────────── Patch Update ─────────────
export async function updatePlayerItems(updates = {}) {
  await savePlayerItems(updates);
  updateUI();
}

// ───────────── UI Updates ─────────────
export async function updateCoinCount() {
  const { coins = 0 } = await loadPlayerItems();
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
