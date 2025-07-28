// /features/ui/bindings.js

import { toggleShop, closeShop } from '../shop/shop.js';
import { renderShopItems } from '../shop/shopItemsRenderer.js';

/**
 * Binds the shop close button
 */
export function bindShopBtn(bindButton) {
  // ✅ Now actually closes the shop
  bindButton("shopCloseBtn", closeShop, "🧼 Close Shop clicked");
}

/**
 * Binds the customize button
 */
export function bindCustomizeBtn(bindButton) {
  bindButton("customizeBtn", () => {
    const cat = window.selectedCat;
    const catName = cat?.name || "Unknown";
    console.log(`🎨 Force-opening shop for cat: ${catName}`);

    // Make sure the selected cat is updated visually
    const card = document.querySelector(`.cat-card[data-cat-id="${cat?.id}"]`);
if (card) {
  const allCards = document.querySelectorAll('.cat-card');
  allCards.forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
}

    toggleShop(); // 👈 cleaner way to open the shop
  });
}

/**
 * Binds the fashion show button
 */
export function bindFashionBtn(bindButton) {
  bindButton("fashionBtn", () => {
    const cat = window.selectedCat;
    if (!cat || !cat.id) {
      console.warn("❌ No selected cat to enter fashion show");
      return;
    }

    console.log(`🎭 Entering Fashion Show with cat ID ${cat.id}`);
    window.location.href = `fashion-show.html?catId=${cat.id}`;

  });
}
