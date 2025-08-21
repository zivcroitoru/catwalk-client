// /features/ui/uiBinder.js

import { toggleShop, closeShop } from '../shop/shop.js';
import { closeAddCat, toggleAddCat } from '../addCat/addCat.js';

export function bindUI() {
  requestAnimationFrame(() => {
    bindButton("shopCloseBtn", closeShop);

    bindButton("customizeBtn", () => {
      const cat = window.selectedCat;
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
        // assuming toastSimple is globally available
        if (typeof toastSimple === 'function') toastSimple('Please select a cat first!', '#ff6666');
        return;
      }
      window.location.href = `fashion-show.html?catId=${cat.id}`;
    });

    bindButton("addCatBtn", toggleAddCat);
    bindButton("addCatCloseBtn", closeAddCat);
  });
}

function bindButton(id, handler) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener("click", handler);
}
