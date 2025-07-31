/*-----------------------------------------------------------------------------
  shopItemsRenderer.js – async + DB
-----------------------------------------------------------------------------*/
import { getItemState, handleShopClick } from './shopLogic.js';
import {
  loadPlayerItems,
  savePlayerItems,
  updateCoinCount
} from '../../core/storage.js';
import { updateCat } from '../../core/api.js';
import {
  toastBought,
  toastCancelled,
  toastEquipResult,
  toastNotEnough
} from '../../core/toast.js';

export async function renderShopItems(data, activeCategory) {
  const container = document.getElementById('shopItems');
  if (!data || !container || !data[activeCategory]) return;

  const playerItems  = await loadPlayerItems();
  const ownedSet   = new Set(playerItems.ownedItems || []);
  const selectedCat = window.selectedCat;
  const equipped   = selectedCat?.equipment?.[activeCategory] || null;

  container.innerHTML = '';
  data[activeCategory].forEach(({ name, sprite_url_preview, price, template }) => {
    const id = `${activeCategory}_${name.toLowerCase().replaceAll(' ', '_')}`;
    const state = getItemState(id, activeCategory, playerItems);
    const isBuy = state === 'buy';

    const card = document.createElement('div');
    card.className = 'shop-card';
    card.dataset.category = activeCategory;
    if (equipped === id)        card.classList.add('equipped');
    else if (ownedSet.has(id))  card.classList.add('owned');

    card.innerHTML = `
      <img src="${sprite_url_preview}" class="shop-img" alt="${name}" />
      <div class="${isBuy ? 'shop-price-bar' : 'shop-btn-bar'}">
        ${isBuy
          ? `<img src="../assets/icons/coin.png" class="coin-icon" alt="coin"/><span>${price}</span>`
          : `<button class="shop-btn">${state.toUpperCase()}</button>`}
      </div>
    `;
    const clickTarget = isBuy
      ? card.querySelector('.shop-price-bar')
      : card.querySelector('.shop-btn');

    clickTarget.onclick = async () => {
      const item = { id, name, img: sprite_url_preview, price, category: activeCategory, template };

      if (isBuy) {
        showBuyConfirmation(item, playerItems, data, activeCategory);
        return;
      }

      const result = handleShopClick(item, playerItems);
      await savePlayerItems(playerItems);
      await updateCoinCount();

      if (selectedCat) {
        selectedCat.equipment[activeCategory] = result === 'equipped' ? id : null;
        await updateCat(selectedCat.id, { equipment: selectedCat.equipment });
      }
      toastEquipResult(name, result);
      renderShopItems(data, activeCategory);
    };

    container.appendChild(card);
  });
}

async function showBuyConfirmation(item, playerItems, data, activeCategory) {
  const box = document.createElement('div');
  box.className = 'confirm-toast';
  box.innerHTML = `
    <div class="confirm-text">Buy "<b>${item.name}</b>" for ${item.price} coins?</div>
    <div class="confirm-buttons">
      <button class="yes-btn">Yes</button>
      <button class="no-btn">No</button>
    </div>`;
  document.body.appendChild(box);

  box.querySelector('.yes-btn').onclick = async () => {
    const result = handleShopClick(item, playerItems);
    await savePlayerItems(playerItems);
    await updateCoinCount();

    if (result === 'bought')      toastBought(item.name);
    else if (result === 'not_enough') toastNotEnough();

    renderShopItems(data, activeCategory);
    box.remove();
  };
  box.querySelector('.no-btn').onclick = () => {
    toastCancelled();
    box.remove();
  };
}
