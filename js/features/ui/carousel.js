import { $, setDisplay } from '../../core/utils.js';
import { state } from '../../core/state.js';
import { CARDS_PER_PAGE } from '../../core/constants.js';
import { updateCatPreview } from '../catPreviewRenderer.js';
import { showCatProfile } from '../user/cat_profile.js';
import { getPlayerCats, buildSpriteLookup, normalizeCat } from '../../core/storage.js';
import { toastNoCats } from '../../core/toast.js';

export async function renderCarousel(selectCatId = null) {
  const container = document.getElementById("catCarousel");
  const scroll = document.getElementById("catProfileScroll");
  const podium = document.getElementById("catDisplay");
  if (!container) return;

  // Fetch player cats
  window.userCats = await getPlayerCats();
  const cats = window.userCats;
  const hasCats = cats.length > 0;

  // Show/hide main UI areas
  setDisplay("catAreaWrapper", hasCats);
  scroll?.classList.toggle("hidden", !hasCats);
  podium?.classList.toggle("hidden", !hasCats);
  container.innerHTML = "";

  // If no cats → show toast and stop
// If no cats → show toast only when add popup is closed
if (!hasCats) {
  const addPopup = document.getElementById("addCatPopup");
  const isOpen =
    addPopup && !addPopup.classList.contains("hidden") && addPopup.style.display !== "none";

  if (!isOpen) toastNoCats();

  updateInventoryCount();
  return;
}

  // Close any existing toast
  if (window.Toastify?.recent) {
    try { Toastify.recent.hideToast(); } catch {}
  }

  // Cache sprite lookup
  window._spriteLookup ||= buildSpriteLookup(window.breedItems);

  // Render cards
  const frag = document.createDocumentFragment();
  cats.forEach(cat => frag.appendChild(buildCatCard(cat, window._spriteLookup)));
  container.appendChild(frag);

  // Select current or first cat
  const selectedCat = cats.find(c => c.id === selectCatId) || cats[0];
  if (!selectedCat) return;

  selectedCat.equipment ||= { hat: null, top: null, eyes: null, accessories: null };
  window.selectedCat = selectedCat;

  // Update podium
  updateCatPreview(selectedCat);
  const mainCatImg = document.getElementById("carouselCat");
  if (mainCatImg) {
    mainCatImg.src = selectedCat.sprite_url;
    mainCatImg.alt = selectedCat.name || "Cat";
  }
  showCatProfile(selectedCat);

  // Highlight selected card
  const selectedCard = document.querySelector(`.cat-card[data-cat-id="${selectedCat.id}"]`);
  if (selectedCard) {
    selectCatCard(selectedCard);

    // Scroll to page containing selected card
    const idx = Array.from(container.children).indexOf(selectedCard);
    if (idx >= 0) {
      const page = Math.floor(idx / CARDS_PER_PAGE);
      state.currentPage = page;
      scrollCarousel(0);
      selectedCard.scrollIntoView({ block: "nearest", inline: "center" });
    }
  }

  updateInventoryCount();
}

function buildCatCard(cat) {
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

  return card;
}

function selectCatCard(selectedCard) {
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
  if (selectedCard) selectedCard.classList.add('selected');
}

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

export function updateInventoryCount() {
  const count = window.userCats?.length || 0;
  const inventoryUI = document.getElementById("inventoryCount");
  if (inventoryUI) inventoryUI.textContent = `Inventory: ${count}/25`;
}
