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

  document.getElementById('addCatBtnEmpty')
    ?.addEventListener('click', () =>
      document.getElementById('addCatBtn')?.click()
    );

  console.log('✅ Systems initialized');
  const factContainer = document.createElement('div');
factContainer.id = 'catFactContainer';
factContainer.style = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 280px;
  padding: 12px;
  background: #fff2d9;
  border: 2px solid #000;
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  z-index: 1000;
  box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
  cursor: pointer;
  user-select: none;
`;
factContainer.textContent = '🐾 Click me for a cat fact!';
document.body.appendChild(factContainer);

factContainer.addEventListener('click', async () => {
  factContainer.textContent = 'Loading...';
  try {
    const res = await fetch('https://catfact.ninja/fact');
    const data = await res.json();
    factContainer.textContent = data.fact;
  } catch {
    factContainer.textContent = 'Failed to load cat fact 😿';
  }
});

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
