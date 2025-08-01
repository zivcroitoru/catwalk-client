/*-----------------------------------------------------------------------------
  storage.js – DB-backed player inventory & cats
-----------------------------------------------------------------------------*/
import { APP_URL } from './config.js';

const PLAYER_ITEMS_API = `${APP_URL}/api/playerItems`;
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

  if (!Array.isArray(data)) {
    console.error('Invalid cats data received:', data);
    throw new Error('Invalid cats data format');
  }

  return data;
}

async function apiUpdateCat(catId, updates) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch(`${APP_URL}/api/cats/${catId}`, {
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

// ───────────── Load & Save ─────────────
export async function loadPlayerItems(force = false) {
  if (!force && itemCache) {
    console.log('🪵 Using cached player items');
    return itemCache;
  }
  console.log('🪵 Fetching fresh player items from API...');
itemCache = await apiGetItems();
itemCache.ownedItems = itemCache.items?.map(i => i.template).filter(Boolean) || [];
console.log('🪵 Fetched items:', itemCache);
return itemCache;

}

export async function unlockPlayerItem(template) {
  console.log('🔓 Unlocking item:', template);
  const result = await apiPatchItem(template);
  console.log('✅ Unlock result:', result);
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
    if (!window.breedItems || Object.keys(window.breedItems).length === 0) {
      console.warn("⚠️ window.breedItems is empty or undefined in getSpriteLookup");
    } else {
      console.log("✅ window.breedItems in getSpriteLookup:", window.breedItems);
    }
    cachedSpriteLookup = buildSpriteLookup(window.breedItems);
  }
  return cachedSpriteLookup;
}

export async function getPlayerCats() {
  console.log('📥 getPlayerCats() start...');
  const [raw, sprites] = await Promise.all([apiGetCats(), getSpriteLookup()]);
  const cats = raw.map(c => normalizeCat(c, sprites));
  console.log('✅ Normalized cats:', cats);
  window.userCats = cats;
  return cats;
}

export async function updateCat(catId, updates) {
  console.log(`✏️ Updating cat ${catId} with:`, updates);
  const allowedFields = ['name', 'description', 'template'];
  const safeUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedFields.includes(key))
  );

  try {
    const updatedCat = await apiUpdateCat(catId, safeUpdates);
    const idx = window.userCats.findIndex(c => c.id === catId);
    if (idx !== -1) {
      window.userCats[idx] = { ...window.userCats[idx], ...updatedCat };
      console.log(`✅ Cat ${catId} updated in local cache`);
    }
    return updatedCat;
  } catch (error) {
    console.error('❌ Error updating cat:', error);
    throw error;
  }
}

export async function deleteCat(catId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${PLAYER_CATS_API}/${catId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    console.error('❌ Failed to delete cat:', res.status, res.statusText);
    throw new Error('Failed to delete cat');
  }

  return res.json();
}

export async function addCatToUser(cat) {
  console.log('➕ Adding cat:', cat);
  const token = localStorage.getItem('token');
  const playerId = getPlayerIdFromToken();
  if (!playerId) throw new Error('No player ID found in token');

  if (!cat.breed || !cat.variant || !cat.palette || !cat.sprite_url) {
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
  console.log('✅ New cat added:', result.cat);

  await loadPlayerItems(true);
  updateUI();
  return result.cat;
}

// ───────────── UI Updates ─────────────
export async function updateCoinCount() {
  const token = localStorage.getItem('token');
  const playerId = getPlayerIdFromToken();
  if (!token || !playerId) return;

  const res = await fetch(`${APP_URL}/api/players/${playerId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    console.error('Failed to fetch player data for coin count:', res.statusText);
    return;
  }

  const { coins } = await res.json();
  const el = document.querySelector('.coin-count');
  if (el) {
    el.textContent = coins;
    console.log('🪙 Coin count updated:', coins);
  } else {
    console.warn('⚠️ .coin-count element not found');
  }
}

export async function updateUI() {
  const token = localStorage.getItem('token');
  const playerId = getPlayerIdFromToken();
  if (!token || !playerId) {
    console.warn('⚠️ Missing token or player ID');
    return;
  }

  try {
    console.log('🔄 Fetching player data for UI update...');
    const res = await fetch(`${APP_URL}/api/players/${playerId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      console.error('❌ Failed to fetch player data:', res.statusText);
      return;
    }

    const { coins, cat_count } = await res.json();
    console.log('✅ Player data fetched:', { coins, cat_count });

    const coinEl = document.querySelector('.coin-count');
    if (coinEl) {
      coinEl.textContent = coins;
      console.log('🪙 Coin count updated:', coins);
    } else {
      console.warn('⚠️ .coin-count element not found');
    }

    const catCountEl = document.getElementById('cat-count');
    if (catCountEl) {
      catCountEl.textContent = `Inventory: ${cat_count}/25`;
      console.log('🐱 Cat count updated:', cat_count);
    } else {
      console.warn('⚠️ #cat-count element not found');
    }
  } catch (err) {
    console.error('Error updating UI:', err);
  }
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
    equipment: { hat: null, top: null, eyes: null, accessories: [] },
  };
}
