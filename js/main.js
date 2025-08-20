console.log('🐱 main.js - Application entry point loading');

// Feature imports - UI and business logic
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

// Core system imports - initialization and storage
import { loadShopAndTemplates, loadUserCats } from './core/init/dataLoader.js';
import { updateUI } from './core/storage.js';
import { toastCatFact } from './core/toast.js';

/**
 * Safely escapes CSS selectors to prevent injection attacks
 * @param {string} s - The selector string to escape
 * @returns {string} Escaped selector string
 */
const escapeSelector = (s) =>
  window.CSS?.escape ? window.CSS.escape(s) : s.replace(/["\\#.:]/g, '\\$&');

/**
 * Dispatches custom events throughout the application
 * @param {string} name - Event name
 * @param {any} detail - Event payload
 */
function dispatch(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

/**
 * Initializes the application UI after cats data is loaded
 * Sets up all interactive components and binds event handlers
 * @param {Array} cats - User's cat collection
 */
function onCatsReady(cats) {
  console.log('🔧 Initializing UI components with cats data:', cats?.length || 0, 'cats');
  
  // Store cats globally for component access
  if (Array.isArray(cats)) window.userCats = cats;

  // Initialize UI components in dependency order
  updateUI();
  renderCarousel();
  setupShopTabs();
  setupEditMode();
  bindUI();
  wireRuntimeEvents();
  
  console.log('✅ UI initialization complete');
}

/**
 * Wires up runtime event handlers that depend on DOM being ready
 * Handles special cases like empty state interactions and toast management
 */
function wireRuntimeEvents() {
  console.log('⚡ Wiring runtime event handlers');

  document.getElementById('addCatBtnEmpty')?.addEventListener('click', () => {
    document.getElementById('emptyState')?.classList.add('hidden');

    // Close any active toast notifications
    if (window.Toastify?.recent) {
      try { Toastify.recent.hideToast(); } catch {}
    }

    document.getElementById('addCatBtn')?.click();
  });

  const catFactBtn = document.getElementById('catFactToggle');
  if (catFactBtn) catFactBtn.addEventListener('click', toastCatFact);
}


document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 DOM ready - starting application initialization');
  
  try {
    // Load core application data
    console.log('📦 Loading shop data and templates...');
    await loadShopAndTemplates();
    
    console.log('🐱 Loading user cats...');
    const cats = await loadUserCats();
    
    // Initialize UI with loaded data
    onCatsReady(cats || window.userCats || []);
    
    console.log('✅ Application startup complete');
  } catch (err) {
    console.error('❌ Critical startup failure:', err);
  }
});

// Export functions to global scope for inline HTML event handlers
console.log('🔗 Exposing functions to global scope for legacy HTML handlers');
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