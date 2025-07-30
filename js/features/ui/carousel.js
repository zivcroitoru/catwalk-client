// /features/ui/carousel.js

import { $, setDisplay } from '../../core/utils.js';
import { state } from '../../core/state.js';
import { CARDS_PER_PAGE } from '../../core/constants.js';
import { updateCatPreview } from '../catPreviewRenderer.js';
import { showCatProfile } from '../user/cat_profile.js';
import { loadUserItems, addCatToUser } from '../../core/storage.js';

// ───────────── Full Render ─────────────
export function renderCarousel() {
  const container = document.getElementById("catCarousel");
  const profile = document.getElementById("catProfile");
  const scroll = document.getElementById("catProfileScroll");

  if (!container) return console.warn("❌ catCarousel not found");

  // 🧼 Clean boot userCats if missing
  if (!Array.isArray(window.userCats)) {
    window.userCats = loadUserItems().userCats || [];
  }

  console.log("🔄 Rendering carousel with", window.userCats?.length || 0, "cats");
  container.innerHTML = "";

  if (!window.userCats.length) {
    console.warn("⚠️ No cats to display");
    updateInventoryCount();
    return;
  }

  window.userCats.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "cat-card";
    card.dataset.catId = cat.id;

    // 🛡 Ensure equipment is defined
    cat.equipment ||= {
      hat: null,
      top: null,
      eyes: null,
      accessories: []
    };

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

    updateCatPreview(cat, card.querySelector(`#cardPreview_${cat.id}`));

    card.addEventListener("click", () => {
      const isSame = window.selectedCat?.id === cat.id;
      window.selectedCat = cat;
      selectCatCard(card);
      showCatProfile(cat);
      console.log("🐾 Selected cat:", cat.name);
      if (!isSame) updateCatPreview(cat);
    });

    container.appendChild(card);
  });

  // Select and preview first cat
  const firstCat = window.userCats[0];
  firstCat.equipment ||= {
    hat: null,
    top: null,
    eyes: null,
    accessories: []
  };
  window.selectedCat = firstCat;
  updateCatPreview(firstCat);

  const mainCatImg = document.getElementById("carouselCat");
  if (mainCatImg) {
    mainCatImg.src = firstCat.image;
    mainCatImg.alt = firstCat.name || "Cat";
  }

  showCatProfile(firstCat);
  selectCatCard(document.querySelector(".cat-card"));

  if (profile) profile.style.display = "flex";
  if (scroll) scroll.style.display = "block";

  updateInventoryCount();
  console.log("✅ Profile made visible");
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
  if (!carousel) {
    console.warn("❌ catCarousel not found for scrolling");
    return;
  }

  const totalCards = carousel.children.length;
  const maxPage = Math.max(0, Math.ceil(totalCards / CARDS_PER_PAGE) - 1);
  state.currentPage = Math.max(0, Math.min(state.currentPage + direction, maxPage));

  const card = carousel.querySelector(".cat-card");
  const gap = 20; // CSS gap
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

// ───────────── Dynamic Add ─────────────
export function addCatToCarousel(imgUrl, label, equipment = {}) {
  const today = new Date().toISOString().split("T")[0];

  const fullCat = {
    id: crypto.randomUUID(),
    name: label,
    image: imgUrl,
    equipment: {
      hat: equipment.hat || null,
      top: equipment.top || null,
      eyes: equipment.eyes || null,
      accessories: equipment.accessories || []
    },
    breed: "-",
    variant: "-",
    palette: "-",
    birthday: today,
    age: 0,
    description: ""
  };

  // Save to storage
  addCatToUser(fullCat);

  // Update runtime state
  window.userCats.push(fullCat);

  // Add to DOM
  const card = document.createElement("div");
  card.className = "cat-card";

  card.innerHTML = `
    <div class="cat-thumbnail">
      <div class="cat-bg"></div>
      <img id="carouselBase" class="cat-layer" />
      <img id="carouselHat" class="cat-layer" />
      <img id="carouselTop" class="cat-layer" />
      <img id="carouselEyes" class="cat-layer" />
      <img id="carouselAccessory" class="cat-layer" />
    </div>
    <span>${label}</span>
  `;

  updateCatPreview(fullCat, card);

  card.onclick = () =>
    import("../user/cat_profile.js").then((m) => m.showCatProfile(fullCat));

  const carousel = $("catCarousel");
  if (carousel) carousel.appendChild(card);

  const catImg = $("carouselCat");
  if (catImg) {
    catImg.src = imgUrl;
    catImg.classList.remove("bounce-in");
    void catImg.offsetWidth;
    catImg.classList.add("bounce-in");
  }

  updateInventoryCount();
}
