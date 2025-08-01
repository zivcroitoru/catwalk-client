/*-----------------------------------------------------------------------------
  shopItemsRenderer.js – async + DB
-----------------------------------------------------------------------------*/
import { getItemState, handleShopClick } from './shopLogic.js';
import {
  loadPlayerItems,
  updateCat,
  updateCoinCount
} from '../../core/storage.js';
import {
  toastBought,
  toastCancelled,
  toastEquipResult,
  toastNotEnough
} from '../../core/toast.js';

export async function renderShopItems(activeCategory) {
  console.log(`🎨 Rendering shop items for category: ${activeCategory}`);
  const container = document.getElementById('shopItems');
  if (!window.shopItemsByCategory || !container || !window.shopItemsByCategory[activeCategory]) {
    console.warn('⚠️ Missing shop items or container');
    return;
  }

  const playerItems = await loadPlayerItems(true); // force refresh
  console.log('📦 ownedItems:', playerItems.ownedItems);
  const ownedSet    = new Set(playerItems.ownedItems || []);
  const selectedCat = window.selectedCat;
  const equipped    = selectedCat?.equipment?.[activeCategory] || null;

  container.innerHTML = '';

  window.shopItemsByCategory[activeCategory].forEach(({ name, sprite_url_preview, price, template }) => {
    const id = template;
    const state = getItemState(id, activeCategory, playerItems);
    const isBuy = state === 'buy';
    console.log(`🧾 Item: ${name} | ID: ${id} | State: ${state}`);

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
      console.log(`🛍️ handleShopClick | ${state} | ${id}`);

      if (isBuy) {
        showBuyConfirmation(item, playerItems, activeCategory);
        return;
      }

      const result = await handleShopClick(item, playerItems);
      console.log(`✅ Equip result: ${result}`);

      const updatedItems = await loadPlayerItems(true); // force-refresh
      await updateCoinCount();

      if (selectedCat) {
        selectedCat.equipment[activeCategory] = result === 'equipped' ? id : null;
        await updateCat(selectedCat.id, { equipment: selectedCat.equipment });
        console.log(`🐱 Updated cat equipment for ${selectedCat.name}:`, selectedCat.equipment);
      }

      toastEquipResult(name, result);
      renderShopItems(activeCategory); // refresh UI
    };

    container.appendChild(card);
  });
}

async function showBuyConfirmation(item, playerItems, activeCategory) {
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
    console.log(`🔓 Unlocking item: ${item.id}`);
    const result = await handleShopClick(item, playerItems);
    await updateCoinCount();

    if (result === 'bought') {
      console.log(`✅ Unlock result: bought`);
      toastBought(item.name);
    } else if (result === 'not_enough') {
      console.warn(`❌ Not enough coins`);
      toastNotEnough();
    }

    renderShopItems(activeCategory);
    box.remove();
  };

  box.querySelector('.no-btn').onclick = () => {
    console.log('❌ Cancelled purchase');
    toastCancelled();
    box.remove();
  };
}
