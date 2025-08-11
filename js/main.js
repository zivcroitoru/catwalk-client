console.log('🐱 main.js');

import { toggleShop } from './features/shop/shop.js';
import { renderShopItems } from './features/shop/shopItemsRenderer.js';
import { toggleVolume } from './core/sound.js';
import { signOut } from './core/auth/authentication.js';
import { renderCarousel, scrollCarousel } from './features/ui/carousel.js';
import { setupShopTabs } from './features/shop/shopTabs.js';
import { showCatProfile, setupEditMode } from './features/user/cat_profile.js';
import { toggleUploadCat, toggleDetails } from './features/ui/popups.js';
import { toggleAddCat } from './features/addCat/addCat.js';
import { bindUI } from './features/ui/uiBinder.js';
import { loadShopAndTemplates, loadUserCats } from './core/init/dataLoader.js';
import { updateUI } from './core/storage.js';
import { toastCatFact } from './core/toast.js';



const escapeSelector = (s) =>
  window.CSS?.escape ? window.CSS.escape(s) : s.replace(/["\\#.:]/g, '\\$&');

function dispatch(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

// Attach listeners that depend on DOM elements
function wireRuntimeEvents() {
  document.getElementById('addCatBtnEmpty')?.addEventListener('click', () => {
    document.getElementById('emptyState')?.classList.add('hidden');
    document.getElementById('addCatBtn')?.click();
  });

  const catFactBtn = document.getElementById('catFactToggle');
  if (catFactBtn) {
    catFactBtn.addEventListener('click', toastCatFact);
  }
}

// Run after cats are loaded
function onCatsReady(cats) {
  if (Array.isArray(cats)) window.userCats = cats;

  updateUI();
  renderCarousel();
  setupShopTabs();
  setupEditMode();
  bindUI();
  wireRuntimeEvents();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadShopAndTemplates();
    const cats = await loadUserCats();
    onCatsReady(cats || window.userCats || []);
    console.log('✅ Systems initialized');
  } catch (err) {
    console.error('❌ Data load failed:', err);
  }
});

// Export for inline HTML handlers
Object.assign(window, {
  toggleShop,
  renderShopItems,
  toggleVolume,
  signOut,
  scrollCarousel,
  showCatProfile,
  toggleUploadCat,
  toggleDetails,
  toggleAddCat,
  renderCarousel,
});
