console.log('🐱 MAIN.JS LOADED');

// ───────────── Imports ─────────────
import { toggleShop } from './features/shop/shop.js';
import { renderShopItems } from './features/shop/shopItemsRenderer.js';
import { initializeMailbox, toggleMailbox } from './features/mailbox/mailbox.js';
import { toggleVolume } from './core/sound.js';
import { signOut } from './core/auth/authentication.js';

import { renderCarousel, scrollCarousel } from './features/ui/carousel.js';
import { scrollShop, setupShopTabs } from './features/shop/shopTabs.js';
import { showCatProfile, setupEditMode } from './features/user/cat_profile.js';
import { toggleUploadCat, toggleDetails } from './features/ui/popups.js';
import { toggleAddCat } from './features/addCat/addCat.js';

import { bindUI } from './features/ui/uiBinder.js';
import { loadAllData } from './core/init/dataLoader.js';
import { updateCoinCount } from './core/storage.js';

import { APP_URL } from './core/config.js';

// ───────────── Init ─────────────
document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ DOMContentLoaded');

  await loadAllData();           // Load cats, items, templates, etc.

  if (!window.breedItems || Object.keys(window.breedItems).length === 0) {
    console.warn("⚠️ No breeds to initialize");
  } else {
    console.log("📚 Breed Items:", window.breedItems);
    // Optionally call a function to initialize breed UI
    // initBreedSelector(); ← Uncomment if you have it
  }

  renderCarousel();              // Render carousel or empty state
  setupShopTabs();              // Shop tab handlers
  setupEditMode();              // Edit/save/delete profile buttons
  bindUI();                     // Global UI interactions
  await updateCoinCount();      // Coin display from DB

  // ✅ Initialize mailbox system (handles all its own logic)
  initializeMailbox();

  // ✅ Empty state button redirects to main add button
  document.getElementById('addCatBtnEmpty')?.addEventListener('click', () => {
    document.getElementById('addCatBtn')?.click();
  });

  console.log('✅ Initialized systems');
});

// ───────────── Expose to Window (for inline HTML handlers) ─────────────
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
