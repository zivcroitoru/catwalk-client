// /js/core/storage.js

const USER_ITEMS_KEY = "userItems";

const DEFAULT_USER_ITEMS = {
  coins: 500,
  ownedItems: [],
  userCats: []
};

// ───────────── Load & Save ─────────────

export function loadUserItems() {
  const data = localStorage.getItem(USER_ITEMS_KEY);
  return data ? JSON.parse(data) : structuredClone(DEFAULT_USER_ITEMS);
}

export function saveUserItems(userItems) {
  localStorage.setItem(USER_ITEMS_KEY, JSON.stringify(userItems));
}

// ───────────── Cats Access ─────────────

export function getUserCats() {
  return loadUserItems().userCats || [];
}

export function addCatToUser(cat) {
  const userItems = loadUserItems();
  userItems.userCats.push(cat);
  saveUserItems(userItems);
  updateUI();
}

// ───────────── Patch Update ─────────────

export function updateUserItems(updates = {}) {
  const userItems = loadUserItems();
  Object.assign(userItems, updates);
  saveUserItems(userItems);
  updateUI();
}

// ───────────── UI Updates ─────────────

export function updateCoinCount() {
  const coins = loadUserItems().coins;
  const el = document.querySelector(".coin-count");
  if (el) {
    el.textContent = coins;
    console.log(`🪙 Coin count updated to ${coins}`);
  } else {
    console.warn("❌ .coin-count element not found");
  }
}

export function updateCatCountUI() {
  const count = loadUserItems().userCats?.length || 0;
  const el = document.querySelector(".cat-count");
  if (el) {
    el.textContent = `Total Cats: ${count}`;
    console.log(`🐱 Cat count updated to ${count}`);
  } else {
    console.warn("❌ .cat-count element not found");
  }
}

export function updateUI() {
  updateCoinCount();
  updateCatCountUI();
}
