export function renderShopItems(data) {
  const container = document.getElementById("shopItems");
  if (!container) return;
  container.innerHTML = "";

  Object.entries(data).forEach(([category, items]) => {
    items.forEach(({ img, price }) => {
      const wrapper = document.createElement("div");
      wrapper.className = "item-wrapper";
      wrapper.dataset.category = category;

      wrapper.innerHTML = `
        <div class="item">
          <img src="../assets/shop_cosmetics/${img}" />
          <div class="price">
            <img src="../assets/icons/coin.png" /> ${price}
          </div>
        </div>
      `;

      container.appendChild(wrapper);
    });
  });
}
