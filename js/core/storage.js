import { APP_URL } from './config.js';

// ───────────── API Routes ─────────────
const PLAYER_ITEMS_API = `${APP_URL}/api/playerItems`;
const PLAYER_CATS_API = `${APP_URL}/api/cats`;
const CAT_ITEMS_API    = `${APP_URL}/api/cat_items`;

let itemCache = null;

// ───────────── Equipment Helper ─────────────
/**
 * Normalizes equipment data with consistent property names and null defaults
 * @param {Object} incoming - Raw equipment data from API
 * @returns {Object} Normalized equipment object
 */
function mergeEquipment(incoming) {
  const base = { hat: null, top: null, eyes: null, accessories: null };
  if (!incoming) return base;

  return {
    ...base,
    hat: incoming.hat ?? incoming.hats ?? null,
    top: incoming.top ?? incoming.tops ?? null,
    eyes: incoming.eyes ?? null,
    accessories: incoming.accessories ?? null
  };
}

// ───────────── JWT Helpers ─────────────
/**
 * Extracts player ID from JWT token stored in localStorage
 * @returns {string|null} Player ID or null if token is invalid
 */
function getPlayerIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('[storage] No auth token found in localStorage');
    return null;
  }

  try {
    const playerId = JSON.parse(atob(token.split('.')[1])).id;
    console.log('[storage] Successfully extracted player ID from token');
    return playerId;
  } catch {
    console.error('[storage] Failed to decode JWT token');
    return null;
  }
}

// ───────────── REST: Items ─────────────
/**
 * Fetches player's items from API
 * @returns {Promise<Object>} Player items data
 */
async function apiGetItems() {
  const token = localStorage.getItem('token');
  console.log('[storage] Fetching player items from API');
  
  const res = await fetch(PLAYER_ITEMS_API, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    if (res.status === 401) {
      console.warn('[storage] Auth token expired, redirecting to login');
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      throw new Error('Auth token expired');
    }
    console.error('[storage] Failed to fetch player items:', res.status);
    throw new Error('GET /playerItems failed');
  }

  const data = await res.json();
  console.log('[storage] Successfully fetched player items:', data);
  return data;
}

/**
 * Updates player's item by adding a new template
 * @param {string} template - Item template to add
 * @returns {Promise<Object>} API response
 */
async function apiPatchItem(template) {
  const token = localStorage.getItem('token');
  console.log('[storage] Patching player item:', template);
  
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
      console.warn('[storage] Auth token expired during item patch, redirecting to login');
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      throw new Error('Auth token expired');
    }
    console.error('[storage] Failed to patch player item:', res.status);
    throw new Error('PATCH /playerItems failed');
  }

  const data = await res.json();
  console.log('[storage] Successfully patched player item');
  return data;
}

// ───────────── REST: Cats ─────────────
/**
 * Fetches all cats belonging to the player
 * @returns {Promise<Array>} Array of cat objects
 */
async function apiGetCats() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('[storage] No auth token available for fetching cats');
    throw new Error('No auth token');
  }

  console.log('[storage] Fetching player cats from API');
  const res = await fetch(PLAYER_CATS_API, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    if (res.status === 401) {
      console.warn('[storage] Auth token expired while fetching cats, redirecting to login');
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      throw new Error('Auth token expired');
    }
    console.error('[storage] Failed to fetch cats:', res.status);
    throw new Error('GET /cats failed');
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    console.error('[storage] Invalid cats data format - expected array, got:', typeof data);
    throw new Error('Invalid cats data format');
  }
  
  console.log('[storage] Successfully fetched', data.length, 'cats');
  return data;
}

/**
 * Updates a specific cat's properties
 * @param {string} catId - ID of the cat to update
 * @param {Object} updates - Properties to update
 * @returns {Promise<Object>} Updated cat data
 */
async function apiUpdateCat(catId, updates) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('[storage] No auth token available for updating cat');
    throw new Error('No auth token');
  }

  console.log('[storage] Updating cat:', catId, 'with updates:', updates);
  const res = await fetch(`${PLAYER_CATS_API}/${catId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });

  if (!res.ok) {
    console.error('[storage] Failed to update cat:', res.status);
    throw new Error('Failed to update cat');
  }
  
  const data = await res.json();
  console.log('[storage] Successfully updated cat:', catId);
  return data;
}

// ───────────── REST: Equipment ─────────────
/**
 * Fetches equipment data for a specific cat
 * @param {string} catId - ID of the cat
 * @returns {Promise<Object|null>} Equipment data or null if not found
 */
async function apiGetCatItems(catId) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('[storage] No auth token available for fetching cat items');
    throw new Error('No auth token');
  }

  console.log('[storage] Fetching equipment for cat:', catId);
  const res = await fetch(`${CAT_ITEMS_API}/${catId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    console.warn('[storage] Failed to fetch cat items for cat:', catId, '- status:', res.status);
    return null; // non-fatal
  }
  
  const data = await res.json();
  console.log('[storage] Successfully fetched equipment for cat:', catId);
  return data;
}

// ───────────── REST: Equipment ─────────────
/**
 * Updates equipment for a specific cat
 * @param {string} catId - ID of the cat
 * @param {Object} equipment - Equipment data to save
 * @returns {Promise<Object>} API response
 */
export async function updateCatItems(catId, equipment) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('[storage] No auth token available for updating cat items');
    throw new Error('No auth token');
  }

  console.log('[storage] Updating cat items for cat:', catId, 'with equipment:', equipment);
  const res = await fetch(`${CAT_ITEMS_API}/${catId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ equipment })
  });

  if (!res.ok) {
    console.error('[storage] Failed to update cat_items:', res.status);
    throw new Error('Failed to update cat_items');
  }
  
  const data = await res.json();
  console.log('[storage] Successfully updated cat items for cat:', catId);
  return data;
}

// ───────────── Public: Data Loaders ─────────────
/**
 * Loads and caches player items, with force refresh option
 * @param {boolean} force - Whether to bypass cache and fetch fresh data
 * @returns {Promise<Object>} Player items with ownedItems array
 */
export async function loadPlayerItems(force = false) {
  if (!force && itemCache) {
    console.log('[storage] Returning cached player items');
    return itemCache;
  }

  console.log('[storage] Loading player items', force ? '(forced refresh)' : '');
  itemCache = await apiGetItems();
  itemCache.ownedItems = itemCache.items?.map(i => i.template) || [];
  console.log('[storage] Processed', itemCache.ownedItems.length, 'owned item templates');
  return itemCache;
}

/**
 * Unlocks a new item for the player and refreshes UI
 * @param {string} template - Item template to unlock
 */
export async function unlockPlayerItem(template) {
  console.log('[storage] Unlocking player item:', template);
  await apiPatchItem(template);
  await loadPlayerItems(true);
  updateUI();
  console.log('[storage] Successfully unlocked item and updated UI');
}

/**
 * Fetches all player cats with their equipment and sprite data
 * @returns {Promise<Array>} Array of normalized cat objects
 */
export async function getPlayerCats() {
  console.log('[storage] Loading player cats with equipment data');
  const [raw, sprites] = await Promise.all([apiGetCats(), getSpriteLookup()]);

  const cats = await Promise.all(raw.map(async (c) => {
    const base = normalizeCat(c, sprites);
    let eqRes = null;
    try {
      eqRes = await apiGetCatItems(base.id);
    } catch {
      console.warn('[storage] Failed to fetch equipment for cat:', base.id);
    }
    const eq = mergeEquipment(eqRes?.equipment ?? c.equipment);
    return { ...base, equipment: eq };
  }));

  window.userCats = cats;
  console.log('[storage] Loaded and stored', cats.length, 'cats in window.userCats');
  return cats;
}

// ───────────── Public: Cat Management ─────────────
/**
 * Updates a cat and refreshes the local cache
 * @param {string} catId - ID of the cat to update
 * @param {Object} updates - Properties to update
 * @returns {Promise<Object>} Updated cat data
 */
export async function updateCat(catId, updates) {
  const updatedCat = await apiUpdateCat(catId, updates);
  const idx = window.userCats.findIndex(c => c.id === catId);
  if (idx !== -1) {
    window.userCats[idx] = { ...window.userCats[idx], ...updatedCat };
    console.log('[storage] Updated cat in local cache at index:', idx);
  } else {
    console.warn('[storage] Cat not found in local cache for update:', catId);
  }
  return updatedCat;
}

/**
 * Deletes a cat from the player's collection
 * @param {string} catId - ID of the cat to delete
 * @returns {Promise<Object>} API response
 */
export async function deleteCat(catId) {
  const token = localStorage.getItem('token');
  console.log('[storage] Deleting cat:', catId);
  
  const res = await fetch(`${PLAYER_CATS_API}/${catId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    console.error('[storage] Failed to delete cat:', res.status);
    throw new Error('Failed to delete cat');
  }
  
  const data = await res.json();
  console.log('[storage] Successfully deleted cat:', catId);
  return data;
}

/**
 * Adds a new cat to the player's collection
 * @param {Object} cat - Cat data including template, name, birthdate, description
 * @returns {Promise<Object>} Created cat data
 */
export async function addCatToUser(cat) {
  const token = localStorage.getItem('token');
  const playerId = getPlayerIdFromToken();
  if (!playerId) {
    console.error('[storage] Cannot add cat - no player ID found');
    throw new Error('No player ID found');
  }

  console.log('[storage] Adding new cat to player:', playerId, 'cat:', cat);
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

  if (!res.ok) {
    console.error('[storage] Failed to add cat:', res.status);
    throw new Error('Failed to add a cat');
  }
  
  const result = await res.json();
  await loadPlayerItems(true);
  console.log('[storage] Successfully added cat and refreshed items');
  return result.cat;
}

// ───────────── Public: Equipment Saver ─────────────
/**
 * Updates a cat's equipment and synchronizes local cache
 * @param {string} catId - ID of the cat
 * @param {Object} newEquipment - New equipment configuration
 * @returns {Promise<Object>} Normalized equipment data
 */
export async function setCatEquipment(catId, newEquipment) {
  console.log(`[storage] setCatEquipment called for cat ${catId}`, newEquipment);

  await updateCatItems(catId, newEquipment);
  const eq = mergeEquipment(newEquipment);

  const i = window.userCats.findIndex(c => c.id === catId);
  if (i !== -1) {
    window.userCats[i] = { ...window.userCats[i], equipment: eq };
    console.log(`[storage] Updated window.userCats[${i}] with new equipment`);
  } else {
    console.warn(`[storage] Cat ${catId} not found in window.userCats for equipment update`);
  }

  console.log(`[storage] Dispatching cat:equipmentUpdated event for cat ${catId}`);
  document.dispatchEvent(new CustomEvent('cat:equipmentUpdated', {
    detail: { catId, equipment: eq }
  }));

  return eq;
}

// ───────────── Public: Sprite & Normalization ─────────────
/**
 * Builds a lookup table mapping templates/IDs to sprite URLs
 * @param {Object} breedItems - Breed items data structure
 * @returns {Object} Template -> sprite URL mapping
 */
export function buildSpriteLookup(breedItems = {}) {
  return Object.values(breedItems).flat().reduce((acc, v) => {
    const key = v.id ?? v.template;
    acc[key] = v.sprite_url;
    return acc;
  }, {});
}

let cachedSpriteLookup = null;

/**
 * Clears the cached sprite lookup, forcing rebuild on next access
 */
export function resetSpriteLookup() {
  console.log('[storage] Resetting sprite lookup cache');
  cachedSpriteLookup = null;
}

/**
 * Gets sprite lookup table, building and caching it if needed
 * @returns {Object} Template -> sprite URL mapping
 */
function getSpriteLookup() {
  if (!cachedSpriteLookup) {
    console.log('[storage] Building sprite lookup from window.breedItems');
    cachedSpriteLookup = buildSpriteLookup(window.breedItems || {});
  }
  return cachedSpriteLookup;
}

/**
 * Normalizes cat data into a consistent format with sprite and equipment
 * @param {Object} cat - Raw cat data from API
 * @param {Object} spriteByTemplate - Template -> sprite URL mapping
 * @returns {Object} Normalized cat object
 */
export function normalizeCat(cat, spriteByTemplate) {
  const template = cat.template;
  const [breed, variant, palette] = template?.split('-') ?? [];
  
  const normalized = {
    id: cat.cat_id ?? cat.id,
    template,
    name: cat.name ?? '',   // no fallback label
    birthdate: cat.birthdate,
    description: cat.description ?? '',
    sprite_url: spriteByTemplate[template] ?? 'data:image/png;base64,PLACEHOLDER_IMAGE_BASE64',
    breed: cat.breed || breed,
    variant: cat.variant || variant,
    palette: cat.palette || palette,
    selected: false,
    equipment: mergeEquipment(cat.equipment),
  };

  return normalized;
}


// ───────────── Public: UI Helpers ─────────────
/**
 * Updates the coin count display in the UI
 */
export async function updateCoinCount() {
  const token = localStorage.getItem('token');
  const playerId = getPlayerIdFromToken();
  if (!token || !playerId) {
    console.warn('[storage] Cannot update coin count - missing token or player ID');
    return;
  }

  console.log('[storage] Updating coin count display');
  const res = await fetch(`${APP_URL}/api/players/${playerId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    console.warn('[storage] Failed to fetch player data for coin count:', res.status);
    return;
  }

  const { coins } = await res.json();
  const el = document.querySelector('.coin-count');
  if (el) {
    el.textContent = coins;
    console.log('[storage] Updated coin count display to:', coins);
  } else {
    console.warn('[storage] Coin count element not found in DOM');
  }
}

/**
 * Updates both coin count and cat count displays in the UI
 */
export async function updateUI() {
  const token = localStorage.getItem('token');
  const playerId = getPlayerIdFromToken();
  if (!token || !playerId) {
    console.warn('[storage] Cannot update UI - missing token or player ID');
    return;
  }

  console.log('[storage] Updating UI with player data');
  const res = await fetch(`${APP_URL}/api/players/${playerId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    console.warn('[storage] Failed to fetch player data for UI update:', res.status);
    return;
  }

  const { coins, cat_count } = await res.json();
  
  const coinEl = document.querySelector('.coin-count');
  if (coinEl) {
    coinEl.textContent = coins;
    console.log('[storage] Updated coin display to:', coins);
  } else {
    console.warn('[storage] Coin count element not found');
  }

  const catCountEl = document.getElementById('cat-count');
  if (catCountEl) {
    catCountEl.textContent = `Cats: ${userCats.length}/25`;
    console.log('[storage] Updated cat count display to:', userCats.length);
  } else {
    console.warn('[storage] Cat count element not found');
  }
}