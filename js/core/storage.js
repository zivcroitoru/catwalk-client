/*-----------------------------------------------------------------------------
  storage.js – DB-backed player inventory
-----------------------------------------------------------------------------*/
import { APP_URL } from './config.js';

const PLAYER_ITEMS_API = `${APP_URL}/api/player_items`;
const PLAYER_CATS_API = `${APP_URL}/api/player_cats`;

let itemCache = null;

// ───────────── REST helpers ─────────────
async function apiGetItems() {
  const token = localStorage.getItem('token');
  const res = await fetch(PLAYER_ITEMS_API, {
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
    throw new Error('GET /player_items failed');
  }

  return res.json();
}

async function apiPatchItems(body) {
  const token = localStorage.getItem('token');
  const res = await fetch(PLAYER_ITEMS_API, {
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
    throw new Error('PATCH /player_items failed');
  }

  return res.json();
}

async function apiGetCats() {
  const token = localStorage.getItem('token');
  const res = await fetch(PLAYER_CATS_API, {
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
    throw new Error('GET /player_cats failed');
  }

  return res.json();
}

// ───────────── Load & Save ─────────────
export async function loadPlayerItems(force = false) {
  if (!force && itemCache) return itemCache;
  itemCache = await apiGetItems();
  return itemCache;
}

export async function savePlayerItems(playerItems) {
  itemCache = await apiPatchItems(playerItems);
  return itemCache;
}

// ───────────── Player ID from JWT ─────────────
function getPlayerIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const payload = token.split('.')[1];
  if (!payload) return null;

  try {
    return JSON.parse(atob(payload)).id;
  } catch (e) {
    console.error('Failed to decode JWT token:', e);
    return null;
  }
}

// ───────────── Cats Access ─────────────
export async function getPlayerCats() {
  const { cats = [] } = await apiGetCats();
  return cats;
}

export async function addCatToUser(cat) {
  const token = localStorage.getItem('token');
  const playerId = getPlayerIdFromToken();
  if (!playerId) {
    throw new Error('No player ID found in token');
  }

  const template = `${cat.breed}-${cat.variant}-${cat.palette}`;

  const res = await fetch(`${APP_URL}/api/cats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      player_id: playerId,
      template,
      name: cat.name,
      birthdate: cat.birthdate,
      description: cat.description || '',
      uploaded_photo_url: cat.uploaded_photo_url || ''
    })
  });

  if (!res.ok) {
    throw new Error('Failed to add cat');
  }

  const result = await res.json();
  await loadPlayerItems(true);
  updateUI();
  return result.cat;
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
  const cats = await getPlayerCats();
  const el = document.querySelector('.cat-count');
  if (el) el.textContent = `Total Cats: ${cats.length}`;
}

export function updateUI() {
  updateCoinCount();
  updateCatCountUI();
}
