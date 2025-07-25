console.log("🐱 MAIN.JS LOADED");

import { toggleShop, renderShopItems } from './shop.js';
import { toggleMailbox } from './mailbox.js';
import { toggleVolume } from './sound.js';
import { signOut, fetchUser } from './auth.js';
import { scrollCarousel } from './carousel.js';
import { scrollShop, setupShopTabs } from './shopTabs.js';
import { uploadCat, handleCatFileChange, triggerReupload } from './upload.js';
import { showCatProfile, setupEditMode } from './profile.js';
import { toggleUploadCat, toggleDetails } from './popups.js';
import { userCats } from './usercats.js';
import { $$ } from './utils.js';

// Expose for dev tools and other modules
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
  renderCarousel // exposed after definition
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOMContentLoaded");

  // Initialize systems
  fetchUser();
  setupShopTabs();
  setupEditMode();
  renderCarousel();
  renderShopItems();

  console.log("✅ Initialized systems");

  // Bind UI event handlers
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
// Utility Functions
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

function renderCarousel() {
  const container = document.getElementById("catCarousel");
  if (!container) {
    console.warn("❌ catCarousel not found");
    return;
  }

  container.innerHTML = "";

  window.userCats.forEach(cat => {
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
      selectCatCard(card);
      console.log("🐾 Selected cat:", cat.name);
      showCatProfile(cat);

      const mainCatImg = document.getElementById("carouselCat");
      if (mainCatImg) {
        mainCatImg.src = cat.image;
      }
    });

    container.appendChild(card);
  });
}

// Highlight selected cat
function selectCatCard(selectedCard) {
  document.querySelectorAll('.cat-card').forEach(card =>
    card.classList.remove('selected')
  );
  selectedCard.classList.add('selected');
}

window.selectCatCard = selectCatCard;
window.renderCarousel = renderCarousel;
