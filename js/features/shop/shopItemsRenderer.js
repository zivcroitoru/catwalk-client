export function renderShopItems(data) {
  if (!data || typeof data !== 'object') {
    console.warn("⚠️ shopItems is invalid");
    return;
  }

  const container = document.getElementById("shopItems");
  if (!container) {
    console.warn("⚠️ shopItems container not found");
    return;
  }

  container.innerHTML = "";

  Object.entries(data).forEach(([category, items]) => {
    items.forEach(({ img, price }) => {
      const card = document.createElement("div");
      card.className = "shop-card";
      card.dataset.category = category;

      card.innerHTML = `
        <img src="../assets/shop_cosmetics/${img}" class="shop-img" alt="item" />
        <div class="shop-price">
          <img src="../assets/icons/coin.png" class="coin-icon" alt="coin" />
          <span>${price}</span>
        </div>
        <button class="shop-btn">EQUIP</button>
      `;

      container.appendChild(card);
    });
  });
}
