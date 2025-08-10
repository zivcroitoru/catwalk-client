// carousel.js – renders the user's cats with dressed thumbnails

import { $, setDisplay } from '../../core/utils.js';
import { state } from '../../core/state.js';
import { CARDS_PER_PAGE } from '../../core/constants.js';
import { updateCatPreview } from '../catPreviewRenderer.js';
import { showCatProfile } from '../user/cat_profile.js';
import { getPlayerCats, buildSpriteLookup } from '../../core/storage.js';
import { toastNoCats } from '../../core/toast.js';

/* ───────────────── Helpers ───────────────── */
// Normalize various id shapes (object/number/string) to a lookup key
const toKey = (v) => v == null ? null : (typeof v === 'object' ? (v.template ?? v.id ?? null) : String(v));

// Safe sprite lookup (handles 1 vs "1", missing keys)
const spriteOf = (v, map) => {
  const k = toKey(v);
  if (!k) return '';
  return map[k] ?? map[String(k)] ?? '';
};

// Fallback: build layered thumbnail from base template + equipment
function makeThumbLayersFallback(cat, sprites) {
  const eq = cat.equipment || { hat: null, top: null, eyes: null, accessories: [] };
  const layers = [];
  const base = spriteOf(cat.template, sprites);
  if (base) layers.push(base);

  // Order matters; adjust if your art stack differs
  if (eq.top)  layers.push(spriteOf(eq.top, sprites));
  if (eq.hat)  layers.push(spriteOf(eq.hat, sprites));
  if (eq.eyes) layers.push(spriteOf(eq.eyes, sprites));
  for (const acc of (eq.accessories || [])) {
    const src = spriteOf(acc, sprites);
    if (src) layers.push(src);
  }
  // Filter out any falsy entries
  return layers.filter(Boolean);
}

// Render <img> layers into a container (base first, then clothes)
function renderThumbLayers(containerEl, layers) {
  // Keep background div if present; clear the rest
  const bg = containerEl.querySelector('.cat-bg');
  containerEl.innerHTML = '';
  if (bg) containerEl.appendChild(bg);

  for (const src of layers) {
    const img = document.createElement('img');
    img.className = 'cat-layer';
    img.loading = 'lazy';
    img.src = src;
    containerEl.appendChild(img);
  }
}

/* ───────────── Full Render ───────────── */
export async function renderCarousel() {
  const container = document.getElementById('catCarousel');
  const scroll    = document.getElementById('catProfileScroll');
  const podium    = document.getElementById('catDisplay');

  if (!container) {
    console.warn('⚠️ Carousel container not found');
    return;
  }

  // Load fresh cats (already normalized + hydrated by storage.getPlayerCats)
  console.log('🔄 Loading player cats...');
  window.userCats = await getPlayerCats();
  const hasCats = window.userCats.length > 0;
  console.log(`📦 Found ${window.userCats.length} cats`);

  // Show/hide main UI sections
  setDisplay('catAreaWrapper', hasCats);
  setDisplay('emptyState', !hasCats);
  scroll?.classList.toggle('hidden', !hasCats);
  podium?.classList.toggle('hidden', !hasCats);

  container.innerHTML = '';

  if (!hasCats) {
    toastNoCats();
    updateInventoryCount();
    return;
  }

  // Clear any previous toast (optional)
  if (window.Toastify && Toastify.recent) {
    try { Toastify.recent.hideToast(); } catch {}
  }

  // Build sprite lookup once for fallbacks
  const spriteLookup = buildSpriteLookup(window.breedItems || {});
  const cats = window.userCats; // ✅ do NOT re-normalize here

  // Batch DOM work
  const fragment = document.createDocumentFragment();

  cats.forEach((cat) => {
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.dataset.catId = cat.id;

    // Minimal skeleton; layers are injected programmatically
    card.innerHTML = `
      <div class="cat-thumbnail" id="cardPreview_${cat.id}">
        <div class="cat-bg"></div>
      </div>
      <span>${cat.name}</span>
    `;

    // Prefer precomputed layers from storage.getPlayerCats; else fallback
    const layers = (Array.isArray(cat.thumbLayers) && cat.thumbLayers.length > 0)
      ? cat.thumbLayers
      : makeThumbLayersFallback(cat, spriteLookup);

    const thumbWrap = card.querySelector(`#cardPreview_${cat.id}`);
    renderThumbLayers(thumbWrap, layers);

    // Select behavior
    card.addEventListener('click', () => {
      const isSame = window.selectedCat?.id === cat.id;
      window.selectedCat = cat;
      selectCatCard(card);
      showCatProfile(cat);
      if (!isSame) updateCatPreview(cat);
    });

    fragment.appendChild(card);
  });

  container.appendChild(fragment);

  // Select and show the first cat
  const firstCat = cats[0];
  firstCat.equipment ||= { hat: null, top: null, eyes: null, accessories: [] };
  window.selectedCat = firstCat;
  updateCatPreview(firstCat);

  // If your main display uses a single <img>, keep base; the preview renderer will layer
  const mainCatImg = document.getElementById('carouselCat');
  if (mainCatImg) {
    mainCatImg.src = firstCat.sprite_url;
    mainCatImg.alt = firstCat.name || 'Cat';
  }

  showCatProfile(firstCat);
  selectCatCard(document.querySelector('.cat-card'));
  updateInventoryCount();
}

/* ───────────── Card Select Highlight ───────────── */
function selectCatCard(selectedCard) {
  document.querySelectorAll('.cat-card').forEach(card =>
    card.classList.remove('selected')
  );
  selectedCard.classList.add('selected');
}

/* ───────────── Scroll Carousel ───────────── */
export function scrollCarousel(direction) {
  const carousel = $('catCarousel');
  if (!carousel) return;

  const totalCards = carousel.children.length;
  const maxPage = Math.max(0, Math.ceil(totalCards / CARDS_PER_PAGE) - 1);
  state.currentPage = Math.max(0, Math.min(state.currentPage + direction, maxPage));

  const card = carousel.querySelector('.cat-card');
  const gap = 20;
  const cardWidth = card?.offsetWidth || 0;
  const totalWidth = (cardWidth + gap) * CARDS_PER_PAGE;
  const offset = state.currentPage * totalWidth;

  carousel.style.transform = `translateX(-${offset}px)`;
}

/* ───────────── Inventory Counter ───────────── */
export function updateInventoryCount() {
  const count = window.userCats?.length || 0;
  const inventoryUI = document.getElementById('inventoryCount');
  if (inventoryUI) inventoryUI.textContent = `Inventory: ${count}/25`;
}
