// /js/core/storage.js

const USER_ITEMS_KEY = "userItems";

const DEFAULT_USER_ITEMS = {
  coins: 500,
  ownedItems: [],
  equippedItems: {
    hat: null,
    shoes: null,
    shirt: null,
    pants: null,
    accessories: null
  },
  userCats: []
};

// Load from localStorage or return default
export function loadUserItems() {
  const data = localStorage.getItem(USER_ITEMS_KEY);
  return data ? JSON.parse(data) : structuredClone(DEFAULT_USER_ITEMS);
}

// Save user data to localStorage
export function saveUserItems(userItems) {
  localStorage.setItem(USER_ITEMS_KEY, JSON.stringify(userItems));
}

// Update only the coin count UI
export function updateCoinCount() {
  const userItems = loadUserItems();
  const coinEl = document.querySelector(".coin-count");
  if (coinEl) {
    coinEl.textContent = userItems.coins;
    console.log(`🪙 Coin count updated to ${userItems.coins}`);
  } else {
    console.warn("❌ .coin-count element not found");
  }
}

// Update only the cat count UI
export function updateCatCountUI() {
  const userItems = loadUserItems();
  const catCountEl = document.querySelector(".cat-count");
  if (catCountEl) {
    catCountEl.textContent = `Total Cats: ${userItems.userCats.length}`;
    console.log(`🐱 Cat count updated to ${userItems.userCats.length}`);
  } else {
    console.warn("❌ .cat-count element not found");
  }
}

// Add a cat, save it, and update UI
export function addCatToUser(cat) {
  const userItems = loadUserItems();
  userItems.userCats.push(cat);
  saveUserItems(userItems);
  updateCatCountUI();
  updateCoinCount(); // Optional, if coins change when adding
}

// Patch-style update to userItems
export function updateUserItems(updates) {
  const userItems = loadUserItems();
  Object.assign(userItems, updates);
  saveUserItems(userItems);
  updateCoinCount();
  updateCatCountUI();
}
