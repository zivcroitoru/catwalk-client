/*-----------------------------------------------------------------------------
  storage.js – DB-backed player inventory & cats
-----------------------------------------------------------------------------*/
import { APP_URL } from './config.js';

const PLAYER_ITEMS_API = `${APP_URL}/api/playerItems`;
const PLAYER_CATS_API = `${APP_URL}/api/cats`;
const CAT_ITEMS_API = `${APP_URL}/api/cat_items`;

let itemCache = null;

// ───────────── Equipment merge helper ─────────────
function mergeEquipment(incoming) {
  // Normalized shape we expect across the app
  const base = { hat: null, top: null, eyes: null, accessories: [] };
  if (!incoming) return base;

  // Accept both singular/plural keys defensively
  const mapped = {
    hat: incoming.hat ?? incoming.hats ?? null,
    top: incoming.top ?? incoming.tops ?? null,
    eyes: incoming.eyes ?? null,
    accessories: Array.isArray(incoming.accessories) ? incoming.accessories : []
  };
  return { ...base, ...mapped };
}


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
    throw new Error('GET /playerItems failed');
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
    throw new Error('PATCH /playerItems failed');
  }

  return res.json();
}

async function apiGetCats() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch(PLAYER_CATS_API, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      throw new Error('Auth token expired');
    }
    throw new Error('GET /cats failed');
  }

  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Invalid cats data format');
  return data;
}

async function apiUpdateCat(catId, updates) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch(`${PLAYER_CATS_API}/${catId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });

  if (!res.ok) {
    console.error('Failed to update cat:', res.status, res.statusText);
    throw new Error('Failed to update cat');
  }

  return res.json();
}


async function apiGetCatItems(catId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch(`${CAT_ITEMS_API}/${catId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    // Non-fatal: we can still show the cat without equipment
    return null;
  }

  // Expected shape: { catId, equipment }
  return res.json();
}

async function updateCatItems(catId, equipment) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch(`${CAT_ITEMS_API}/${catId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ equipment })
  });

  if (!res.ok) {
    console.error('Failed to update cat_items:', res.status, res.statusText);
    throw new Error('Failed to update cat_items');
  }

  return res.json();
}

// ───────────── Load & Save ─────────────
export async function loadPlayerItems(force = false) {
  if (!force && itemCache) return itemCache;

  itemCache = await apiGetItems();
  itemCache.ownedItems = itemCache.items?.map(i => i.template) || [];
  return itemCache;
}

export async function unlockPlayerItem(template) {
  await apiPatchItem(template);
  await loadPlayerItems(true);
  updateUI();
}

// ───────────── JWT Helpers ─────────────
function getPlayerIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split('.')[1])).id;
  } catch {
    return null;
  }
}

// ───────────── Cats Access ─────────────
export function buildSpriteLookup(breedItems = {}) {
  return Object.values(breedItems).flat().reduce((acc, v) => {
    const key = v.id ?? v.template;
    acc[key] = v.sprite_url;
    return acc;
  }, {});
}

let cachedSpriteLookup = null;
export function resetSpriteLookup() {
  cachedSpriteLookup = null;
}

function getSpriteLookup() {
  if (!cachedSpriteLookup) {
    cachedSpriteLookup = buildSpriteLookup(window.breedItems || {});
  }
  return cachedSpriteLookup;
}

export async function getPlayerCats() {
  const [raw, sprites] = await Promise.all([apiGetCats(), getSpriteLookup()]);

  // Normalize and then hydrate equipment per cat
  const cats = await Promise.all(raw.map(async (c) => {
    const base = normalizeCat(c, sprites);
    let eqRes = null;
    try {
      eqRes = await apiGetCatItems(base.id);
    } catch {}
    const eq = mergeEquipment(eqRes?.equipment ?? c.equipment);
    return { ...base, equipment: eq };
  }));

  window.userCats = cats;
  return cats;
}

export async function updateCat(catId, updates) {

  const updatedCat = await apiUpdateCat(catId, updates);
  const idx = window.userCats.findIndex(c => c.id === catId);
  if (idx !== -1) {
    window.userCats[idx] = { ...window.userCats[idx], ...updatedCat };
  }
  return updatedCat;
}

export async function deleteCat(catId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${PLAYER_CATS_API}/${catId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to delete cat');
  return res.json();
}

export async function addCatToUser(cat) {
  const token = localStorage.getItem('token');
  const playerId = getPlayerIdFromToken();
  if (!playerId) throw new Error('No player ID found');

  const res = await fetch(`${PLAYER_CATS_API}`, {
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

// ───────────── UI Update Helpers ─────────────
export async function updateCoinCount() {
  const token = localStorage.getItem('token');
  const playerId = getPlayerIdFromToken();
  if (!token || !playerId) return;

  const res = await fetch(`${APP_URL}/api/players/${playerId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) return;

  const { coins } = await res.json();
  const el = document.querySelector('.coin-count');
  if (el) el.textContent = coins;
}

export async function updateUI() {
  const token = localStorage.getItem('token');
  const playerId = getPlayerIdFromToken();
  if (!token || !playerId) return;

  const res = await fetch(`${APP_URL}/api/players/${playerId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) return;

  const { coins, cat_count } = await res.json();
  const coinEl = document.querySelector('.coin-count');
  if (coinEl) coinEl.textContent = coins;

  const catCountEl = document.getElementById('cat-count');
  if (catCountEl) catCountEl.textContent = `Inventory: ${cat_count}/25`;
}

export function normalizeCat(cat, spriteByTemplate) {
  const template = cat.template;
  const [breed, variant, palette] = template?.split('-') ?? [];
  return {
    id: cat.cat_id ?? cat.id,
    template,
    name: cat.name ?? 'Unnamed Cat',
    birthdate: cat.birthdate,
    description: cat.description ?? '',
    sprite_url: spriteByTemplate[template] ?? 'data:image/png;base64,PLACEHOLDER_IMAGE_BASE64',
    breed: cat.breed || breed,
    variant: cat.variant || variant,
    palette: cat.palette || palette,
    selected: false,
    equipment: mergeEquipment(cat.equipment),
  };
}

// ───────────── Export Everything ─────────────
export {
  updateCatItems
};
