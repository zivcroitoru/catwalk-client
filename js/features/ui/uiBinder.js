// /features/ui/uiBinder.js

import { toggleShop, closeShop } from '../shop/shop.js';
import { closeAddCat } from '../addCat/addCat.js';
import { toggleAddCat } from '../addCat/addCat.js';

export function bindUI() {
  requestAnimationFrame(() => {
    bindButton("shopCloseBtn", closeShop, "🧼 Close Shop clicked");
    bindButton("customizeBtn", () => {
      const cat = window.selectedCat;
      const catName = cat?.name || "Unknown";
      console.log(`🎨 Force-opening shop for cat: ${catName}`);
      const card = document.querySelector(`.cat-card[data-cat-id="${cat?.id}"]`);
      if (card) {
        document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      }
      toggleShop();
    });

    bindButton("fashionBtn", () => {
      const cat = window.selectedCat;
      if (!cat?.id) {
        console.warn("❌ No selected cat to enter fashion show");
        toastSimple('Please select a cat first!', '#ff6666');
        return;
      }
      console.log(`🎭 Entering Fashion Show with cat ID ${cat.id}`);
      window.location.href = `fashion-show.html?catId=${cat.id}`;
    });

    bindButton("addCatBtn", toggleAddCat, "➕ Add Cat clicked");
    bindButton("addCatCloseBtn", closeAddCat, "🚪 Close Add Cat clicked");

    console.log("✅ Event listeners bound");
  });
}

function bindButton(id, handler, logText = null) {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener("click", () => {
      if (logText) console.log(logText);
      handler();
    });
  } else {
    console.warn(`⚠️ ${id} not found`);
  }
}
