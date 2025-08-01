console.log('🐱 MAIN.JS LOADED');

// ───────────── Imports ─────────────
import { toggleShop } from './features/shop/shop.js';
import { renderShopItems } from './features/shop/shopItemsRenderer.js';
import { initializeMailbox, toggleMailbox, requestNotificationPermission } from './features/mailbox/mailbox.js';
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
import { updateUI } from './core/storage.js';



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

  // Initialize mailbox (only once!)
  await initializeMailbox();

  // “Add Cat” from empty-state shortcut
  document.getElementById('addCatBtnEmpty')
    ?.addEventListener('click', () =>
      document.getElementById('addCatBtn')?.click()
    );

  console.log('✅ Systems initialized');

  /* ───────────── CAT FACT BUTTON (replaces speaker) ───────────── */
  const catFactBtn = document.getElementById('catFactToggle');
  if (catFactBtn) {
    catFactBtn.addEventListener('click', async () => {
      try {
        const res   = await fetch('https://catfact.ninja/fact');
        const { fact } = await res.json();
        Toastify({
          text: `🐾 ${fact}`,
          duration: 5000,
          gravity: 'bottom',
          position: 'right',
          style: {
            background: '#fff2d9',
            color: '#000',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '10px',
            border: '2px solid #000'
          }
        }).showToast();
      } catch {
        Toastify({
          text: 'Failed to load cat fact 😿',
          duration: 3000,
          gravity: 'bottom',
          position: 'right',
          style: {
            background: '#fdd',
            color: '#000',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '10px',
            border: '2px solid #000'
          }
        }).showToast();
      }
    });
  }
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
