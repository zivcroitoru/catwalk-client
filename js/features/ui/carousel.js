// carousel.js – renders the user's cats with dressed thumbnails + debug

import { $, setDisplay } from '../../core/utils.js';
import { state } from '../../core/state.js';
import { CARDS_PER_PAGE } from '../../core/constants.js';
import { updateCatPreview } from '../catPreviewRenderer.js';
import { showCatProfile } from '../user/cat_profile.js';
import { getPlayerCats, buildSpriteLookup } from '../../core/storage.js';
import { toastNoCats } from '../../core/toast.js';

/* ───────────────── Debug toggle ───────────────── */
const DEBUG_CAROUSEL = localStorage.getItem('debugCarousel') === '1';

/* ───────────────── Helpers ───────────────── */
// Normalize various id shapes (object/number/string) to a lookup key
const toKey = (v) => v == null ? null : (typeof v === 'object' ? (v.template ?? v.id ?? null) : String(v));

// Safe sprite lookup (handles 1 vs "1", missing keys)
const spriteOf = (v, map) => {
  const k = toKey(v);
  if (!k) return '';
  return map[k] ?? map[String(k)] ?? '';
};

// Shorten data URLs for logs
const trimUrl = (u) => {
  if (!u) return '';
  if (u.startsWith('data:')) return `data:...[${u.length} chars]`;
  return u.length > 120 ? u.slice(0, 117) + '...' : u;
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
  return layers.filter(Boolean);
}

// Render <img> layers into a container (base first, then clothes)
function renderThumbLayers(containerEl, layers) {
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

/* ───────────── Debug per-cat ───────────── */
function debugRenderedCat(cat, layers, sprites) {
  const eq = cat.equipment || {};
  const info = {
    id: cat.id,
    name: cat.name,
    templateKey: toKey(cat.template),
    baseURL: trimUrl(spriteOf(cat.template, sprites) || cat.sprite_url),
    hatKey: toKey(eq.hat),
    hatURL: trimUrl(spriteOf(eq.hat, sprites)),
    topKey: toKey(eq.top),
    topURL: trimUrl(spriteOf(eq.top, sprites)),
    eyesKey: toKey(eq.eyes),
    eyesURL: trimUrl(spriteOf(eq.eyes, sprites)),
    accessoriesKeys: (eq.accessories || []).map(toKey),
    accessoriesURLs: (eq.accessories || []).map(a => trimUrl(spriteOf(a, sprites))),
    finalLayerCount: layers.length
  };

  console.groupCollapsed(
    `🐾 Rendered "${info.name}" [id=${info.id}] · base=${info.templateKey} · layers=${info.finalLayerCount}`
  );
  console.log('Equipment keys:', {
    hat: info.hatKey, top: info.topKey, eyes: info.eyesKey, accessories: info.accessoriesKeys
  });
  console.log('Resolved URLs:', {
    base: info.baseURL,
    hat: info.hatURL,
    top: info.topURL,
    eyes: info.eyesURL,
    accessories: info.accessoriesURLs
  });
  console.log('Final layer order (top→bottom shown bottom→top in DOM):', layers.map(trimUrl));
  console.groupEnd();
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

  if (DEBUG_CAROUSEL) console.time('renderCarousel');

  // Load fresh cats (already normalized + hydrated by storage.getPlayerCats)
  if (DEBUG_CAROUSEL) console.log('🔄 Loading player cats...');
  window.userCats = await getPlayerCats();
  const hasCats = window.userCats.length > 0;
  if (DEBUG_CAROUSEL) console.log(`📦 Found ${window.userCats.length} cats`);

  // Show/hide main UI sections
  setDisplay('catAreaWrapper', hasCats);
  setDisplay('emptyState', !hasCats);
  scroll?.classList.toggle('hidden', !hasCats);
  podium?.classList.toggle('hidden', !hasCats);

  container.innerHTML = '';

  if (!hasCats) {
    toastNoCats();
    updateInventoryCount();
    if (DEBUG_CAROUSEL) console.timeEnd('renderCarousel');
    return;
  }

  if (window.Toastify && Toastify.recent) {
    try { Toastify.recent.hideToast(); } catch {}
  }

  // Build sprite lookup once for fallbacks
  const spriteLookup = buildSpriteLookup(window.breedItems || {});
  if (DEBUG_CAROUSEL) console.log('🔍 spriteLookup keys:', Object.keys(spriteLookup).length);

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

    if (DEBUG_CAROUSEL) debugRenderedCat(cat, layers, spriteLookup);

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

  if (DEBUG_CAROUSEL) console.timeEnd('renderCarousel');
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
