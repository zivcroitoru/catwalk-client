// /features/ui/bindings.js

import { toggleShop } from '../shop/shop.js';
import { renderShopItems } from '../shop/shopItemsRenderer.js';

/**
 * Binds the shop close button
 */
export function bindShopBtn(bindButton) {
  bindButton("shopCloseBtn", toggleShop, "🧼 Close Shop clicked");
}

/**
 * Binds the customize button to force open the shop
 */
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

    const hatsTab = document.querySelector('.tab[data-category="hats"]');
    if (hatsTab) hatsTab.click();

    if (window.shopItems) {
      renderShopItems(window.shopItems);
    } else {
      console.warn("⚠️ shopItems not loaded yet");
    }
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
