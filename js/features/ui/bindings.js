// /features/ui/bindings.js

import { toggleShop } from '../shop/shop.js';
import { renderShopItems } from '../shop/shopItemsRenderer.js';

/**
 * Binds the shop close button
 */
export function bindShopBtn(bindButton) {
  bindButton("shopCloseBtn", toggleShop, "🧼 Close Shop clicked");
}
export function bindCustomizeBtn(bindButton) {
  bindButton("customizeBtn", () => {
    const cat = window.selectedCat;
    const catName = cat?.name || "Unknown";
    console.log(`🎨 Force-opening shop for cat: ${catName}`);

    const card = document.querySelector(`.cat-card[data-cat-id="${cat?.id}"]`);
    if (card) {
      card.classList.remove("selected");
      card.click();
    }

    const shop = document.getElementById("shopPopup");
    if (shop) {
      shop.style.display = "block";
      console.log("🛒 Shop popup forced open");
    }

    // ✅ Let tab logic do the filtering and render
    setTimeout(() => {
      const hatsTab = document.querySelector('.tab[data-category="hats"]');
      if (hatsTab) {
        console.log("🎩 Clicking hats tab (via tab logic)");
        hatsTab.click();
      } else {
        console.warn("⚠️ Hats tab not found");
      }
    }, 0);
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
