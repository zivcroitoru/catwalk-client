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
      card.classList.remove("selected");
      card.click();
    }

    toggleShop(); // 👈 cleaner way to open the shop
  });
}

/**
 * Binds the fashion show button
 */
export function bindFashionBtn(bindButton) {
  bindButton("fashionBtn", () => {
    console.log("🎭 Enter Fashion Show clicked");
    // TODO: Add fashion show join logic
  });
}
