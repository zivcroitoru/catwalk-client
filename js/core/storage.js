/*-----------------------------------------------------------------------------
  storage.js – DB-backed player inventory & cats
-----------------------------------------------------------------------------*/
import { APP_URL } from './config.js';

const PLAYER_ITEMS_API = `${APP_URL}/api/player_items`;
const PLAYER_CATS_API = `${APP_URL}/api/cats`;

let itemCache = null;

// ───────────── REST helpers ─────────────
async function apiGetItems() {
  const token = localStorage.getItem('token');
  const res = await fetch(PLAYER_ITEMS_API, {
    headers: { 'Authorization': `Bearer ${token}` }
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

async function apiPatchItem(template) {
  const token = localStorage.getItem('token');
  const res = await fetch(PLAYER_ITEMS_API, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ template })
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
  if (!token) {
    console.error('No auth token found');
    window.location.href = 'login.html';
    throw new Error('No auth token');
  }

  console.log('🔄 Fetching cats from API...');
  const res = await fetch(PLAYER_CATS_API, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      throw new Error('Auth token expired');
    }
    console.error('Failed to fetch cats:', res.status, res.statusText);
    throw new Error('GET /cats failed');
  }

  const data = await res.json();
  console.log('📦 Received cats data:', data);

  // Validate the data structure
  if (!Array.isArray(data)) {
    console.error('Invalid cats data received:', data);
    throw new Error('Invalid cats data format');
  }

  return data;
}

// ───────────── Load & Save ─────────────
export async function loadPlayerItems(force = false) {
  if (!force && itemCache) return itemCache;
  itemCache = await apiGetItems();
  return itemCache;
}

// 🛍️ Unlock/purchase a new item by template ID
export async function unlockPlayerItem(template) {
  const result = await apiPatchItem(template);
  await loadPlayerItems(true);
  updateUI();
  return result.item;
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
  const cats = await apiGetCats();
  
  // Normalize cats from server to match our structure
  return cats.map(cat => ({
    // Core fields
    id: cat.cat_id || cat.id,
    template: cat.template || `${cat.breed}-${cat.variant}-${cat.palette}`,
    name: cat.name || 'Unnamed Cat',
    birthdate: cat.birthdate,
    description: cat.description || '',

    // Handle sprite_url - ensure it's properly formatted with APP_URL
    sprite_url: cat.sprite_url ? (
      cat.sprite_url.startsWith('http') ? cat.sprite_url :
      `${APP_URL}/${cat.sprite_url.startsWith('/') ? cat.sprite_url.substring(1) : cat.sprite_url}`
    ) : null,

    // Client-side UI state (initialize empty)
    selected: false,
    equipment: { hat: null, top: null, eyes: null, accessories: [] }
  }));
}

export async function updateCat(catId, updates) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch(`${APP_URL}/api/cats/${catId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: updates.name,
      description: updates.description,
      // Only send server-relevant fields
      ...(updates.template && { template: updates.template }),
      ...(updates.breed && { breed: updates.breed }),
      ...(updates.variant && { variant: updates.variant }),
      ...(updates.palette && { palette: updates.palette })
    })
  });

  if (!res.ok) throw new Error('Failed to update cat');
  return res.json();
}

export async function addCatToUser(cat) {
  const token = localStorage.getItem('token');
  const playerId = getPlayerIdFromToken();
  if (!playerId) throw new Error('No player ID found in token');

  // Ensure we have all required template fields
  if (!cat.breed || !cat.variant || !cat.palette) {
    throw new Error('Missing required template fields (breed, variant, palette)');
  }

  const res = await fetch(`${APP_URL}/api/cats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      player_id: playerId,
      template: cat.template,
      name: cat.name,
      birthdate: cat.birthdate,
      description: cat.description || ''
    })
  });

  if (!res.ok) throw new Error('Failed to add cat');

  const result = await res.json();
  await loadPlayerItems(true);
  updateUI();
  return result.cat;
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
