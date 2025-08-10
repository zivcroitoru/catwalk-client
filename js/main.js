// main.js
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

/* ───────────────── helpers ───────────────── */

const escapeSelector = (s) =>
  window.CSS?.escape ? window.CSS.escape(s) : s.replace(/["\\#.:]/g, '\\$&');

function dispatch(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

/* Update only one card thumbnail (keeps window.userCats authoritative) */
function updateCatCard(catId, equipment) {
  const sel = `[data-cat-id="${escapeSelector(String(catId))}"]`;
  const card = document.querySelector(sel);
  if (!card) return;

  const list = window.userCats || [];
  const cat = list.find((c) => String(c.id) === String(catId));
  if (!cat) return;

  if (equipment) cat.equipment = equipment; // sync cache
  if (typeof window.updateCatPreview === 'function') {
    window.updateCatPreview(cat, card);
  }
}

/* Bind runtime listeners that depend on the DOM */
function wireRuntimeEvents() {
  // Equipment changes -> refresh one card (or whole carousel as a fallback)
  document.addEventListener('cat:equipmentUpdated', (e) => {
    const { catId, equipment } = e.detail || {};
    if (typeof updateCatCard === 'function') updateCatCard(catId, equipment);
    else if (typeof window.renderCarousel === 'function') window.renderCarousel();
  });

  // “Add Cat” empty-state shortcut
  document.getElementById('addCatBtnEmpty')?.addEventListener('click', () => {
    document.getElementById('addCatBtn')?.click();
  });

  // Optional Cat Fact button (safe if element missing)
  const catFactBtn = document.getElementById('catFactToggle');
  if (catFactBtn) {
    catFactBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('https://catfact.ninja/fact');
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
            border: '2px solid #000',
          },
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
            border: '2px solid #000',
          },
        }).showToast();
      }
    });
  }
}

/* One-time UI render after cats are hydrated */
function onCatsReady(cats) {
  // Ensure a shared source of truth for all components
  if (Array.isArray(cats)) window.userCats = cats;

  updateUI();       // should render podium from window.userCats
  renderCarousel(); // cards read the same data used by podium

  setupShopTabs();
  setupEditMode();
  bindUI();

  wireRuntimeEvents();
}

/* ───────────────── boot ───────────────── */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // If you re-enable mailbox sockets, import and guard:
    // const token = localStorage.getItem('token');
    // const playerId = localStorage.getItem('playerId');
    // if (token && playerId && typeof setupSocket === 'function') {
    //   setupSocket(token, playerId);
    // }

    // 1) Load shop metadata/templates first, then cats (hydrated with equipment)
    await loadShopAndTemplates();
    const cats = await loadUserCats(); // expect array; if your function returns void, ensure it still populates window.userCats

    // 2) Single barrier: render everything only after cats are ready
    onCatsReady(cats || window.userCats || []);
    console.log('✅ Systems initialized');
  } catch (err) {
    console.error('❌ Data load failed:', err);
  }
});

/* ───────────────── window exports (for inline handlers) ───────────────── */
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
  updateCatCard, // expose for targeted refreshes
});
