/*-----------------------------------------------------------------------------
  carousel.js
-----------------------------------------------------------------------------*/
import { $, setDisplay } from '../../core/utils.js';
import { state } from '../../core/state.js';
import { CARD_WIDTH, CARDS_PER_PAGE } from '../../core/constants.js';

export function scrollCarousel(direction) {
  const carousel = $("catCarousel");
  const totalCards = carousel.children.length;
  const maxPage = Math.ceil(totalCards / CARDS_PER_PAGE) - 1;

  state.currentPage = Math.max(0, Math.min(state.currentPage + direction, maxPage));
  const offset = state.currentPage * CARD_WIDTH * CARDS_PER_PAGE;
  carousel.style.transform = `translateX(-${offset}px)`;
}

export function updateInventoryCount() {
  const count = state.userCats?.length || 0;
  const inventoryUI = document.getElementById("inventoryCount");
  if (inventoryUI) inventoryUI.textContent = `Inventory: ${count}/25`;
}

export function addCatToCarousel(imgUrl, label) {
  const card = document.createElement("div");
  card.className = "cat-card";
  card.innerHTML = `
    <div class="cat-thumbnail" style="background-image:url('${imgUrl}');"></div>
    <span>${label}</span>
  `;
  card.onclick = () =>
    import("../user/cat_profile.js").then(m =>
      m.showCatProfile({ name: label, image: imgUrl })
    );

  $("catCarousel").appendChild(card);

  // 🎯 Set and animate the cat image directly
  const catImg = $("carouselCat");
  catImg.src = imgUrl;
  catImg.classList.remove("bounce-in");
  void catImg.offsetWidth;
  catImg.classList.add("bounce-in");

  updateInventoryCount(); // ✅ based on state.userCats
}
