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
import {
  loadShopAndTemplates,
  loadUserCats
} from './core/init/dataLoader.js';
import { updateCoinCount, updateUI } from './core/storage.js';

import { APP_URL } from './core/config.js';

// ───────────── Init ─────────────
document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ DOMContentLoaded');

  try {
    /* STEP A then STEP B */
    await loadShopAndTemplates();
    await loadUserCats();
  } catch (err) {
    console.error('❌ Data load failed:', err);
    return; // bail before touching UI
  }

  /* UI init – safe to read breedItems & userCats from here */
  await updateUI();
  renderCarousel();
  setupShopTabs();
  setupEditMode();
  bindUI();
  initializeMailbox();

  document.getElementById('addCatBtnEmpty')
    ?.addEventListener('click', () =>
      document.getElementById('addCatBtn')?.click()
    );

  console.log('✅ Systems initialized');
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
