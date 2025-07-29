console.log("🐱 MAIN.JS LOADED");

// ───────────── Imports ─────────────
import { toggleShop } from './features/shop/shop.js';
import { renderShopItems } from './features/shop/shopItemsRenderer.js';
import { toggleMailbox } from './features/mailbox/mailbox.js';
import { toggleVolume } from './core/sound.js';
import { signOut, fetchUser } from './core/auth/auth.js';
import { scrollCarousel } from './features/ui/carousel.js';
import { scrollShop, setupShopTabs } from './features/shop/shopTabs.js';
import { uploadCat, handleCatFileChange, triggerReupload } from './features/user/upload_cat.js';
import { showCatProfile, setupEditMode } from './features/user/cat_profile.js';
import { toggleUploadCat, toggleDetails } from './features/ui/popups.js';
import { bindShopBtn, bindCustomizeBtn, bindFashionBtn, bindAddCatBtn } from './features/ui/bindings.js';
import { $$ } from './core/utils.js';
import { updateCatPreview } from './features/catPreviewRenderer.js';
import { toggleAddCat } from './features/addCat/addCat.js';

// ───────────── Globals ─────────────
export let userCats = [];
export let shopItems = [];
export const APP_URL = "http://localhost:3000";

// ───────────── Data Load ─────────────
fetch("../data/usercats.json")
  .then(res => res.json())
  .then(data => {
    userCats = data;
    window.userCats = userCats;
    renderCarousel();
  })
  .catch(err => console.error("❌ Failed to load usercats.json", err));

fetch("../data/shopItems.json")
  .then(res => res.json())
  .then(data => {
    shopItems = data;
    window.shopItems = shopItems;
    console.log("🛒 Shop items loaded");
  })
  .catch(err => console.error("❌ Failed to load shopItems.json", err));

fetch("../data/breeds.json")
  .then(res => res.json())
  .then(data => {
    window.breedItems = data;
    console.log("🐾 Breed data loaded");
  })
  .catch(err => console.error("❌ Failed to load breeds.json", err));

// ───────────── Expose to Window ─────────────
Object.assign(window, {
  toggleShop,
  renderShopItems,
  toggleMailbox,
  toggleVolume,
  signOut,
  scrollCarousel,
  scrollShop,
  uploadCat,
  handleCatFileChange,
  triggerReupload,
  showCatProfile,
  toggleUploadCat,
  toggleDetails,
  userCats,
  shopItems,
  renderCarousel,
  selectCatCard,
  toggleAddCat, // ✅ AddCat exposed
});

// ───────────── Init ─────────────
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOMContentLoaded");

  fetchUser();
  setupShopTabs();
  setupEditMode();

  bindUI();
  updateCoinCount();

  console.log("✅ Initialized systems");
});

// ───────────── UI Bindings ─────────────
function bindUI() {
  requestAnimationFrame(() => {
    bindShopBtn(bindButton);
    bindCustomizeBtn(bindButton);
    bindFashionBtn(bindButton);
    bindAddCatBtn(bindButton); // ✅ Handles both open and close buttons
    bindButton("addCatBtn", toggleAddCat, "➕ Add Cat clicked");

    console.log("✅ Event listeners bound");
  });
}

function bindButton(id, handler, logText = null) {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener("click", () => {
      if (logText) console.log(logText);
      handler();
    });
  } else {
    console.warn(`⚠️ ${id} not found`);
  }
}

// ───────────── Carousel Logic ─────────────
function renderCarousel() {
  const container = document.getElementById("catCarousel");
  const profile = document.getElementById("catProfile");
  const scroll = document.getElementById("catProfileScroll");

  if (!container) {
    console.warn("❌ catCarousel not found");
    return;
  }

  console.log("🔄 Rendering carousel with", window.userCats.length, "cats");
  container.innerHTML = "";

  window.userCats.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "cat-card";
    card.dataset.catId = cat.id;

    card.innerHTML = `
      <div class="cat-thumbnail" id="cardPreview_${cat.id}">
        <div class="cat-bg"></div>
        <img class="cat-layer carouselBase" />
        <img class="cat-layer carouselHat" />
        <img class="cat-layer carouselTop" />
        <img class="cat-layer carouselEyes" />
        <img class="cat-layer carouselAccessory" />
      </div>
      <span>${cat.name}</span>
    `;

    const previewContainer = card.querySelector(`#cardPreview_${cat.id}`);
    updateCatPreview(cat, previewContainer);

    card.addEventListener("click", () => {
      const isSame = window.selectedCat?.id === cat.id;
      window.selectedCat = cat;

      selectCatCard(card);
      showCatProfile(cat);
      console.log("🐾 Selected cat:", cat.name);

      if (!isSame) updateCatPreview(cat);
    });

    container.appendChild(card);
  });

  if (window.userCats.length === 0) {
    console.log("⚠️ No cats to display");
    return;
  }

  const firstCat = window.userCats[0];
  window.selectedCat = firstCat;
  updateCatPreview(firstCat);

  const mainCatImg = document.getElementById("carouselCat");
  if (mainCatImg) {
    mainCatImg.src = firstCat.image;
    mainCatImg.alt = firstCat.name || "Cat";
    console.log("🏁 Podium cat set to:", firstCat.name);
  }

  showCatProfile(firstCat);

  const firstCard = document.querySelector(".cat-card");
  if (firstCard) {
    selectCatCard(firstCard);
    console.log("✨ First cat card selected");
  }

  if (profile) profile.style.display = "flex";
  if (scroll) scroll.style.display = "block";

  const inventoryUI = document.getElementById("inventoryCount");
  if (inventoryUI) {
    inventoryUI.textContent = `Inventory: ${window.userCats.length}/25`;
    console.log("📦 Inventory updated:", window.userCats.length);
  }

  console.log("✅ Profile made visible");
}

function selectCatCard(selectedCard) {
  document.querySelectorAll('.cat-card').forEach(card =>
    card.classList.remove('selected')
  );
  selectedCard.classList.add('selected');
}

// ───────────── Coin Count Update ─────────────
function updateCoinCount() {
  const userItems = JSON.parse(localStorage.getItem("userItems"));
  if (!userItems) {
    console.warn("❌ No userItems in storage");
    return;
  }

  const coinEl = document.querySelector(".coin-count");
  if (coinEl) {
    coinEl.textContent = userItems.coins;
    console.log(`🪙 Coin count updated to ${userItems.coins}`);
  } else {
    console.warn("❌ .coin-count element not found");
  }
}
