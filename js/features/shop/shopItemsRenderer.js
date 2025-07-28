import { getItemState, handleShopClick } from './shopLogic.js';
import { loadUserItems, saveUserItems, updateCoinUI } from '../../core/storage.js';

export function renderShopItems(data, activeCategory) {
  const container = document.getElementById("shopItems");
  if (!data || !container || !data[activeCategory]) return;

  const items = data[activeCategory];
  const userItems = loadUserItems();
  const equipped = userItems.equippedItems?.[activeCategory];
  const ownedSet = new Set(userItems.ownedItems || []);

  container.innerHTML = "";

  items.forEach(({ name, sprite_url_preview, price, template }) => {
    const img = sprite_url_preview;
    const id = `${activeCategory}_${name.toLowerCase().replaceAll(" ", "_")}`;
    const state = getItemState(id, activeCategory, userItems);
    const isBuy = state === "buy";

    const card = document.createElement("div");
    card.className = "shop-card";
    card.dataset.category = activeCategory;

    if (equipped === id) card.classList.add("equipped");
    else if (ownedSet.has(id)) card.classList.add("owned");

    card.innerHTML = `
      <img src="${img}" class="shop-img" alt="${name}" />
      <div class="${isBuy ? "shop-price-bar" : "shop-btn-bar"}">
        ${isBuy
          ? `<img src="../assets/icons/coin.png" class="coin-icon" alt="coin" />
             <span>${price}</span>`
          : `<button class="shop-btn">${state.toUpperCase()}</button>`}
      </div>
    `;

    const clickTarget = isBuy
      ? card.querySelector(".shop-price-bar")
      : card.querySelector(".shop-btn");

    clickTarget.onclick = () => {
      const item = { id, name, img, price, category: activeCategory, template };

      if (isBuy) {
        showBuyConfirmation(item, userItems, data, activeCategory);
      } else {
        const result = handleShopClick(item, userItems);
        saveUserItems(userItems);
        updateCoinUI(userItems.coins);

        const selectedCat = window.selectedCat;
        if (selectedCat) {
          const userCats = JSON.parse(localStorage.getItem("usercats") || "[]");
          const cat = userCats.find(c => c.id === selectedCat.id);
          if (cat) {
            cat.equipment[activeCategory] = result === "equipped" ? id : null;
            localStorage.setItem("usercats", JSON.stringify(userCats));
            console.log(`🐾 ${cat.name} now ${result} ${activeCategory}: ${cat.equipment[activeCategory]}`);
          }
        }

        if (result === "equipped" || result === "unequipped") {
          Toastify({
            text: result === "equipped"
              ? `Equipped "${name}"`
              : `Unequipped "${name}"`,
            duration: 2000,
            gravity: "bottom",
            position: "center",
            style: { background: "#2196f3" },
          }).showToast();
          renderShopItems(data, activeCategory);
        }
      }
    };

    container.appendChild(card);
  });
}

function showBuyConfirmation(item, userItems, data, activeCategory) {
  const confirmBox = document.createElement("div");
  confirmBox.className = "confirm-toast";
  confirmBox.innerHTML = `
    <div class="confirm-text">Buy "<b>${item.name}</b>" for ${item.price} coins?</div>
    <div class="confirm-buttons">
      <button class="yes-btn">Yes</button>
      <button class="no-btn">No</button>
    </div>
  `;
  document.body.appendChild(confirmBox);

  confirmBox.querySelector(".yes-btn").onclick = () => {
    const result = handleShopClick(item, userItems);
    saveUserItems(userItems);
    updateCoinUI(userItems.coins);

    if (result === "bought") {
      Toastify({
        text: `✅ Bought "${item.name}"!`,
        duration: 2000,
        gravity: "bottom",
        position: "center",
        style: { background: "#4caf50" },
      }).showToast();
      renderShopItems(data, activeCategory);
    } else if (result === "not_enough") {
      Toastify({
        text: `❌ Not enough coins`,
        duration: 2000,
        gravity: "bottom",
        position: "center",
        style: { background: "#d32f2f" },
      }).showToast();
    }

    confirmBox.remove();
  };

  confirmBox.querySelector(".no-btn").onclick = () => {
    Toastify({
      text: `❌ Cancelled`,
      duration: 1500,
      gravity: "bottom",
      position: "center",
      style: { background: "#999" },
    }).showToast();
    confirmBox.remove();
  };
}
