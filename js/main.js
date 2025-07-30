console.log("🐱 MAIN.JS LOADED");

// ───────────── Imports ─────────────
import { toggleShop } from './features/shop/shop.js';
import { renderShopItems } from './features/shop/shopItemsRenderer.js';
import { toggleMailbox } from './features/mailbox/mailbox.js';
import { toggleVolume } from './core/sound.js';
import { signOut } from './core/auth/authentication.js';

import { renderCarousel, scrollCarousel } from './features/ui/carousel.js'; // ✅ updated
import { scrollShop, setupShopTabs } from './features/shop/shopTabs.js';
import { showCatProfile, setupEditMode } from './features/user/cat_profile.js';
import { toggleUploadCat, toggleDetails } from './features/ui/popups.js';
import { toggleAddCat } from './features/addCat/addCat.js';

import { bindUI } from './features/ui/uiBinder.js';
import { loadAllData } from './core/init/dataLoader.js';
import { updateCoinCount } from './core/storage.js';


// ───────────── Globals ─────────────
export const APP_URL = import.meta.env.VITE_APP_URL; 

// ───────────── Init ─────────────
document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ DOMContentLoaded");

  await loadAllData();

  // ✅ Load only manually added cats
  window.userCats = JSON.parse(localStorage.getItem("usercats") || "[]");

  renderCarousel();

  setupShopTabs();
  setupEditMode();
  bindUI();
  updateCoinCount();

  console.log("✅ Initialized systems");
});


// ───────────── Expose to Window (for debugging/dev) ─────────────
Object.assign(window, {
  toggleShop,
  renderShopItems,
  toggleMailbox,
  toggleVolume,
  signOut,
  scrollCarousel,
  showCatProfile,
  toggleUploadCat,
  toggleDetails,
  toggleAddCat,
  renderCarousel
});
