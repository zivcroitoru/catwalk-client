/*-----------------------------------------------------------------------------
  shopItemsRenderer.js – async + DB
-----------------------------------------------------------------------------*/
import { getItemState, handleShopClick } from './shopLogic.js';
import {
  loadPlayerItems,
  updateCatItems,
  updateCoinCount
} from '../../core/storage.js';
import {
  toastBought,
  toastCancelled,
  toastEquipResult,
  toastNotEnough
} from '../../core/toast.js';

const EQUIPMENT_KEY_MAP = {
  hats: 'hat',
  tops: 'top',
  eyes: 'eyes',
  accessories: 'accessories'
};

/**
 * Render all shop items for the selected category.
 */
export async function renderShopItems(activeCategory) {
  activeCategory = activeCategory.toLowerCase();
  console.log(`🎨 Rendering shop items for category: ${activeCategory}`);

  const container = document.getElementById('shopItems');
  const items = window.shopItemsByCategory?.[activeCategory];

  if (!items || !container) {
    console.warn('⚠️ Missing shop items or container');
    return;
  }

  const playerItems = await loadPlayerItems(true); // force refresh
  const ownedSet = new Set(playerItems.ownedItems || []);
  const selectedCat = window.selectedCat;
  const equipKey = EQUIPMENT_KEY_MAP[activeCategory];
  const equipped = selectedCat?.equipment?.[equipKey] || null;

  container.innerHTML = '';

  for (const { name, sprite_url_preview, price, template } of items) {
    const id = template;
    const state = getItemState(id, activeCategory, playerItems);
    const isBuy = state === 'buy';

    console.log(`🧾 Item: ${name} | ID: ${id} | State: ${state}`);

    const card = document.createElement('div');
    card.className = 'shop-card';
    card.dataset.category = activeCategory;

    if (equipped === id) card.classList.add('equipped');
    else if (ownedSet.has(id)) card.classList.add('owned');

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

    clickTarget.onclick = () =>
      isBuy
        ? showBuyConfirmation({ id, name, img: sprite_url_preview, price, category: activeCategory, template }, playerItems, activeCategory)
        : handleEquipClick({ id, name, category: activeCategory, template }, playerItems, selectedCat, equipKey, activeCategory);

    container.appendChild(card);
  }
}

/**
 * Handle equipping or unequipping an item.
 */
async function handleEquipClick(item, playerItems, selectedCat, equipKey, activeCategory) {
  const result = await handleShopClick(item, playerItems);
  console.log(`✅ Equip result: ${result}`);

  await updateCoinCount();
  await loadPlayerItems(true); // refresh inventory

  if (selectedCat && equipKey) {
    selectedCat.equipment ||= { hat: null, top: null, eyes: null, accessories: null };
    selectedCat.equipment[equipKey] = result === 'equipped' ? item.id : null;

    console.log(`🎯 Updating equipment slot '${equipKey}' to:`, selectedCat.equipment[equipKey]);
    await updateCatItems(selectedCat.id, selectedCat.equipment);
    console.log(`✅ Cat '${selectedCat.name}' updated equipment:`, selectedCat.equipment);
  }

  toastEquipResult(item.name, result);
  renderShopItems(activeCategory); // refresh UI
}

/**
 * Show buy confirmation popup.
 */
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
