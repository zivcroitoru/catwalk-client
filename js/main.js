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
import { updateCoinCount } from './features/ui/coinUpdater.js';

// ───────────── Globals ─────────────
export const APP_URL = "http://localhost:3000";

// ───────────── Init ─────────────
document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ DOMContentLoaded");

  await loadAllData();
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
  scrollShop,
  uploadCat,
  handleCatFileChange,
  triggerReupload,
  showCatProfile,
  toggleUploadCat,
  toggleDetails,
  toggleAddCat,
  renderCarousel
});
