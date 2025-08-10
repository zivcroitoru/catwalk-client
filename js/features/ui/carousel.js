import { $, setDisplay } from '../../core/utils.js';
import { state } from '../../core/state.js';
import { CARDS_PER_PAGE } from '../../core/constants.js';
import { updateCatPreview } from '../catPreviewRenderer.js';
import { showCatProfile } from '../user/cat_profile.js';
import { getPlayerCats, buildSpriteLookup, normalizeCat } from '../../core/storage.js';
import { toastNoCats } from '../../core/toast.js';

// ───────────── Full Render ─────────────
export async function renderCarousel() {
  const container = document.getElementById("catCarousel");
  const scroll = document.getElementById("catProfileScroll");
  const podium = document.getElementById("catDisplay");

  if (!container) return;

  window.userCats = await getPlayerCats();
  const hasCats = window.userCats.length > 0;

  setDisplay("catAreaWrapper", hasCats);
  setDisplay("emptyState", !hasCats);
  scroll?.classList.toggle("hidden", !hasCats);
  podium?.classList.toggle("hidden", !hasCats);
  container.innerHTML = "";

  if (!hasCats) {
    toastNoCats();
    updateInventoryCount();
    return;
  }

  if (window.Toastify?.recent) {
    try { Toastify.recent.hideToast(); } catch {}
  }

  const spriteLookup = buildSpriteLookup(window.breedItems);

  const normalizedCats = window.userCats.map(cat => {
    const normalized = normalizeCat(cat, spriteLookup);
    return normalized;
  });

  const fragment = document.createDocumentFragment();

  normalizedCats.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "cat-card";
    card.dataset.catId = cat.id;

    card.innerHTML = `
      <div class="cat-thumbnail" id="cardPreview_${cat.id}">
        <div class="cat-bg"></div>
        <img class="cat-layer carouselBase" loading="lazy" />
        <img class="cat-layer carouselHat" loading="lazy" />
        <img class="cat-layer carouselTop" loading="lazy" />
        <img class="cat-layer carouselEyes" loading="lazy" />
        <img class="cat-layer carouselAccessory" loading="lazy" />
      </div>
      <span>${cat.name}</span>
    `;

    const thumb = card.querySelector(`#cardPreview_${cat.id}`);
    updateCatPreview(cat, thumb, {
      spriteByTemplate: window.spriteByTemplate,
      shopItemsByCategory: window.shopItemsByCategory
    });

    card.addEventListener("click", () => {
      const isSame = window.selectedCat?.id === cat.id;
      window.selectedCat = cat;
      selectCatCard(card);
      showCatProfile(cat);
      if (!isSame) updateCatPreview(cat);
    });

    fragment.appendChild(card);
  });

  container.appendChild(fragment);

  const firstCat = normalizedCats[0];
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
