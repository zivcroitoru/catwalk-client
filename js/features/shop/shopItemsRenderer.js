import { getItemState, handleShopClick } from './shopLogic.js';
import { loadUserItems, saveUserItems } from '../../core/storage.js';

export function renderShopItems(data, activeCategory) {
  if (!data || typeof data !== 'object') {
    console.warn("⚠️ shopItems is invalid");
    return;
  }

  const container = document.getElementById("shopItems");
  if (!container) {
    console.warn("⚠️ shopItems container not found");
    return;
  }

  const userItems = loadUserItems();
  container.innerHTML = "";

  const items = data[activeCategory];
  items.forEach(({ name, img, price }) => {
    const id = `${activeCategory}_${name.toLowerCase().replaceAll(" ", "_")}`;
    const state = getItemState(id, activeCategory, userItems);

    const card = document.createElement("div");
    card.className = "shop-card";
    card.dataset.category = activeCategory;

    card.innerHTML = `
      <img src="../assets/shop_cosmetics/${img}" class="shop-img" alt="${name}" />
      <div class="shop-price">
        <img src="../assets/icons/coin.png" class="coin-icon" alt="coin" />
        <span>${state === "buy" ? price : ""}</span>
      </div>
      <button class="shop-btn">${state === "buy" ? "BUY" : state.toUpperCase()}</button>
    `;

    card.querySelector(".shop-btn").onclick = () => {
      handleShopClick({ id, name, img, price, category: activeCategory }, userItems);
      saveUserItems(userItems);
      renderShopItems(data, activeCategory);
    };

    container.appendChild(card);
  });
}
