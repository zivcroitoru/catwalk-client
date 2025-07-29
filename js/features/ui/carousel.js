/*-----------------------------------------------------------------------------
  carousel.js
-----------------------------------------------------------------------------*/
import { $, setDisplay } from '../../core/utils.js';
import { state } from '../../core/state.js';
import { CARDS_PER_PAGE } from '../../core/constants.js';
import { updateCatPreview } from '../catPreviewRenderer.js';

export function scrollCarousel(direction) {
  const carousel = $("catCarousel");
  const totalCards = carousel.children.length;
  const maxPage = Math.max(0, Math.ceil(totalCards / CARDS_PER_PAGE) - 1);

  state.currentPage = Math.max(0, Math.min(state.currentPage + direction, maxPage));

  // 🧠 Calculate offset based on real card width + CSS gap
  const card = carousel.querySelector(".cat-card");
  const gap = 20; // matches .carousel { gap: 20px }
  const cardWidth = card?.offsetWidth || 0;
  const totalWidth = (cardWidth + gap) * CARDS_PER_PAGE;

  const offset = state.currentPage * totalWidth;
  carousel.style.transform = `translateX(-${offset}px)`;
}

export function updateInventoryCount() {
  const count = state.userCats?.length || 0;
  const inventoryUI = document.getElementById("inventoryCount");
  if (inventoryUI) inventoryUI.textContent = `Inventory: ${count}/25`;
}

export function addCatToCarousel(imgUrl, label, equipment = {}) {
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

  updateCatPreview(
    {
      name: label,
      image: imgUrl,
      equipment,
    },
    card
  );

  card.onclick = () =>
    import("../user/cat_profile.js").then((m) =>
      m.showCatProfile({
        name: label,
        image: imgUrl,
        equipment,
        breed: "-",
        variant: "-",
        palette: "-",
        birthday: "-",
        age: "-",
        description: "",
      })
    );

  $("catCarousel").appendChild(card);

  const catImg = $("carouselCat");
  catImg.src = imgUrl;
  catImg.classList.remove("bounce-in");
  void catImg.offsetWidth;
  catImg.classList.add("bounce-in");

  updateInventoryCount();
}
