console.log("🐱 MAIN.JS LOADED");

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
import { $$ } from './core/utils.js';

export let userCats = [];
export let shopItems = [];

// 🐾 Load user cats
fetch("../data/usercats.json")
  .then(res => res.json())
  .then(data => {
    userCats = data;
    window.userCats = userCats;
    renderCarousel();
  })
  .catch(err => console.error("❌ Failed to load usercats.json", err));

// 🛍️ Load shop items
fetch("../data/shopItems.json")
  .then(res => res.json())
  .then(data => {
    shopItems = data;
    window.shopItems = shopItems;
    renderShopItems(); // ✅ Render after items are loaded
  })
  .catch(err => console.error("❌ Failed to load shopItems.json", err));

// ─────────────────────────────────────
// Global Exports
// ─────────────────────────────────────

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
});

// ─────────────────────────────────────
// Init
// ─────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOMContentLoaded");

  fetchUser();
  setupShopTabs();
  setupEditMode();

  console.log("✅ Initialized systems");

  bindFloatingActionButtons();

  bindButton("openShopBtn", () => toggleShop(), "🛒 Open Shop clicked");
  bindButton("shopCloseBtn", () => toggleShop(), "🧼 Close Shop clicked");
  bindOverlay("shopOverlay", toggleShop);

  bindButton("openMailboxBtn", () => toggleMailbox(), "📬 Mailbox clicked");
  bindButton("uploadCatBtn", () => toggleUploadCat(), "🐾 Upload Cat clicked");
  bindButton("toggleSoundBtn", () => toggleVolume(), "🔊 Sound toggle clicked");
  bindButton("openDetailsBtn", () => toggleDetails(), "📄 Open Details clicked");

  bindButton("scrollLeftBtn", () => scrollCarousel(-1), "⬅️ Carousel left scroll");
  bindButton("scrollRightBtn", () => scrollCarousel(1), "➡️ Carousel right scroll");

  bindButton("shopScrollLeft", () => scrollShop(-1), "🛒⬅️ Shop left scroll");
  bindButton("shopScrollRight", () => scrollShop(1), "🛒➡️ Shop right scroll");

  console.log("✅ Event listeners bound");
});

// ─────────────────────────────────────
// UI Binding
// ─────────────────────────────────────

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

function bindOverlay(id, handler) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target.id === id) {
        console.log(`🧊 Clicked outside ${id}`);
        handler();
      }
    });
  }
}

function bindFloatingActionButtons() {
  $$('.floating-actions button').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.floating-actions button').forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      console.log("⭐ Active button clicked:", btn.textContent.trim());
    });
  });
}

// ─────────────────────────────────────
// Carousel
// ─────────────────────────────────────

function renderCarousel() {
  const container = document.getElementById("catCarousel");
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
      <div class="cat-thumbnail">
        <div class="cat-bg"></div>
        <div class="cat-sprite" style="background-image: url('${cat.image}')"></div>
      </div>
      <span>${cat.name}</span>
    `;

    card.addEventListener("click", () => {
      console.log("🐾 Selected cat:", cat.name);
      selectCatCard(card);
      showCatProfile(cat);

      const mainCatImg = document.getElementById("carouselCat");
      if (mainCatImg) {
        mainCatImg.src = cat.image;
        mainCatImg.alt = cat.name || "Cat";
        console.log("🎯 Podium cat updated to:", cat.name);
      }
    });

    container.appendChild(card);
  });

  if (window.userCats.length > 0) {
    const firstCat = window.userCats[0];
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

    document.getElementById("catProfile").style.display = "flex";
    document.getElementById("catProfileScroll").style.display = "block";
    console.log("✅ Profile made visible");
  } else {
    console.log("⚠️ No cats to display");
  }
}

// ─────────────────────────────────────
// Cat Card Selection
// ─────────────────────────────────────

function selectCatCard(selectedCard) {
  document.querySelectorAll('.cat-card').forEach(card =>
    card.classList.remove('selected')
  );
  selectedCard.classList.add('selected');
}
