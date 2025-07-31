import { $, setDisplay } from '../../core/utils.js'
import { state } from '../../core/state.js';
import { CARDS_PER_PAGE } from '../../core/constants.js';
import { updateCatPreview } from '../catPreviewRenderer.js';
import { showCatProfile } from '../user/cat_profile.js';
import { getPlayerCats, addCatToUser } from '../../core/storage.js';
import { toastNoCats } from '../../core/toast.js'; // ✅ Import the new toast

// ───────────── Full Render ─────────────
export async function renderCarousel() {
  const container = document.getElementById("catCarousel");
  const scroll = document.getElementById("catProfileScroll");
  const podium = document.getElementById("catDisplay");

  if (!container) {
    console.warn('⚠️ Carousel container not found');
    return;
  }

  // Get fresh cats data
  console.log('🔄 Loading player cats...');
  window.userCats = await getPlayerCats();
  const hasCats = window.userCats.length > 0;
  console.log(`📦 Found ${window.userCats.length} cats`);

  // Show/hide main UI sections
  setDisplay("catAreaWrapper", hasCats);
  setDisplay("emptyState", !hasCats);
  scroll?.classList.toggle("hidden", !hasCats);
  podium?.classList.toggle("hidden", !hasCats);

  container.innerHTML = "";

  if (!hasCats) {
    toastNoCats(); // ✅ Show Toastify floaty
    updateInventoryCount();
    return;
  }

  // Remove any floating no-cat Toast (if you want to auto-clear it)
  if (window.Toastify && Toastify.recent) {
    try { Toastify.recent.hideToast(); } catch { }
  }

  // Normalize cats to match server structure
  window.userCats = window.userCats.map(cat => ({
    // Required fields from server
    id: cat.cat_id || cat.id,
    template: cat.template,
    name: cat.name || 'Unnamed Cat',
    birthdate: cat.birthdate || new Date().toISOString().split('T')[0],
    description: cat.description || '',
    sprite_url: cat.sprite_url,
    
    // Client-side UI state
    selected: false,
    equipment: {
      hat: cat.equipment?.hat || null,
      top: cat.equipment?.top || null,
      eyes: cat.equipment?.eyes || null,
      accessories: cat.equipment?.accessories || []
    }
  }));


  // Create cat cards
  window.userCats.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "cat-card";
    card.dataset.catId = cat.id;

    card.innerHTML = `
      <div class="cat-thumbnail" id="cardPreview_${cat.id}">
        <div class="cat-bg"></div>
        <img class="cat-layer carouselBase" />
        <img class="cat-layer carouselHat" />
        <img class="cat-layer carouselTop" />
        <img class="cat-layer carouselEyes" />
        <img class="cat-layer carouselAccessory" />
      </div>
      <span>${cat.name}</span>
    `;

    // Update the carouselBase image layer with the sprite_url
    const baseLayer = card.querySelector(".carouselBase");
    if (baseLayer) {
      baseLayer.src = cat.sprite_url;
    }

    updateCatPreview(cat, card.querySelector(`#cardPreview_${cat.id}`));

    card.addEventListener("click", () => {
      const isSame = window.selectedCat?.id === cat.id;
      window.selectedCat = cat;
      selectCatCard(card);
      showCatProfile(cat);
      if (!isSame) updateCatPreview(cat);
    });

    container.appendChild(card);
  });

  // Select and show the first cat
  const firstCat = window.userCats[0];
  firstCat.equipment ||= { hat: null, top: null, eyes: null, accessories: [] };
  window.selectedCat = firstCat;
  updateCatPreview(firstCat);

  const mainCatImg = document.getElementById("carouselCat");
  if (mainCatImg) {
    mainCatImg.src = firstCat.sprite_url;
    mainCatImg.alt = firstCat.name || "Cat";
  }

  showCatProfile(firstCat);
  selectCatCard(document.querySelector(".cat-card"));

  updateInventoryCount();
}

// ───────────── Card Select Highlight ─────────────
function selectCatCard(selectedCard) {
  document.querySelectorAll('.cat-card').forEach(card =>
    card.classList.remove('selected')
  );
  selectedCard.classList.add('selected');
}

// ───────────── Scroll Carousel ─────────────
export function scrollCarousel(direction) {
  const carousel = $("catCarousel");
  if (!carousel) return;

  const totalCards = carousel.children.length;
  const maxPage = Math.max(0, Math.ceil(totalCards / CARDS_PER_PAGE) - 1);
  state.currentPage = Math.max(0, Math.min(state.currentPage + direction, maxPage));

  const card = carousel.querySelector(".cat-card");
  const gap = 20;
  const cardWidth = card?.offsetWidth || 0;
  const totalWidth = (cardWidth + gap) * CARDS_PER_PAGE;
  const offset = state.currentPage * totalWidth;

  carousel.style.transform = `translateX(-${offset}px)`;
}

// ───────────── Inventory Counter ─────────────
export function updateInventoryCount() {
  const count = window.userCats?.length || 0;
  const inventoryUI = document.getElementById("inventoryCount");
  if (inventoryUI) inventoryUI.textContent = `Inventory: ${count}/25`;
}

// Note: Dynamic cat addition has been moved to breedItemsRenderer.js
// This maintains a single source of truth for adding cats through the breed selection UI
