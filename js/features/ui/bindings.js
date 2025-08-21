// /features/ui/bindings.js

import { toggleShop, closeShop } from '../shop/shop.js';
import { renderShopItems } from '../shop/shopItemsRenderer.js';
import { closeAddCat } from '../addCat/addCat.js';
import { getLoggedInUserInfo } from '../../core/utils.js';

export function bindShopBtn(bindButton) {
  bindButton("shopCloseBtn", closeShop);
}

export function bindAddCatBtn(bindButton) {
  bindButton("addCatCloseBtn", closeAddCat);
}

export function bindCustomizeBtn(bindButton) {
  bindButton("customizeBtn", () => {
    const cat = window.selectedCat;
    const card = document.querySelector(`.cat-card[data-cat-id="${cat?.id}"]`);
    if (card) {
      const allCards = document.querySelectorAll('.cat-card');
      allCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    }
    toggleShop();
  });
}

export function bindFashionBtn(bindButton) {
  bindButton("fashionBtn", () => {
    const cat = window.selectedCat;
    if (!cat || !cat.id) return;

    const playerInfo = getLoggedInUserInfo();
    window.location.href = `fashion-show.html?catId=${cat.id}`;
    // Optionally include playerId too:
    // window.location.href = `fashion-show.html?catId=${cat.id}&playerId=${playerInfo.userId}`;
  });
}
