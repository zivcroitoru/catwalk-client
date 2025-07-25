// shop.js

// ✅ Shop items data
export const shopItems = {
  hats: [
    { name: "Chef Hat", price: 25, img: "hats/chef_hat.png" },
    { name: "Cowboy Hat", price: 25, img: "hats/cowboy_hat.png" },
    { name: "Santa Hat", price: 175, img: "hats/santa_hat.png" },
    { name: "Wizard Hat", price: 250, img: "hats/wizard_hat.png" },
    { name: "Party Hat", price: 100, img: "hats/party_hat.png" }
  ],
  shoes: [
    { name: "Sneakers", price: 150, img: "shoes/sneakers.png" },
    { name: "Boots", price: 200, img: "shoes/boots.png" },
    { name: "Sandals", price: 75, img: "shoes/sandals.png" },
    { name: "Formal Shoes", price: 220, img: "shoes/formal_shoes.png" },
    { name: "Running Shoes", price: 180, img: "shoes/running_shoes.png" }
  ],
  shirt: [
    { name: "T-Shirt", price: 80, img: "shirt/tshirt.png" },
    { name: "Hoodie", price: 120, img: "shirt/hoodie.png" },
    { name: "Button Up", price: 150, img: "shirt/button_up.png" },
    { name: "Tank Top", price: 90, img: "shirt/tank_top.png" },
    { name: "Jacket", price: 200, img: "shirt/jacket.png" }
  ],
  pants: [
    { name: "Jeans", price: 130, img: "pants/jeans.png" },
    { name: "Shorts", price: 70, img: "pants/shorts.png" },
    { name: "Cargo Pants", price: 150, img: "pants/cargo_pants.png" },
    { name: "Dress Pants", price: 180, img: "pants/dress_pants.png" },
    { name: "Trousers", price: 160, img: "pants/trousers.png" }
  ],
  accessories: [
    { name: "Glasses", price: 60, img: "accessories/glasses.png" },
    { name: "Necklace", price: 110, img: "accessories/necklace.png" },
    { name: "Bracelet", price: 75, img: "accessories/bracelet.png" },
    { name: "Earrings", price: 90, img: "accessories/earrings.png" },
    { name: "Hat Pin", price: 45, img: "accessories/hat_pin.png" }
  ]
};

// ✅ Renders all shop items into the shopItems container
export function renderShopItems() {
  const container = document.getElementById("shopItems");
  container.innerHTML = ""; // Clear existing

  Object.entries(shopItems).forEach(([category, items]) => {
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

// ✅ Toggle the visibility of the shop (overlay includes the popup)
export function toggleShop() {
  const overlay = document.getElementById("shopOverlay");
  const isVisible = getComputedStyle(overlay).display === "block";

  if (isVisible) {
    overlay.style.display = "none";
    console.log("❌ Closed shop");
  } else {
    overlay.style.display = "block";
    console.log("✅ Opened shop");

    // Optional: activate default tab
    const hatsTab = document.querySelector('.tab[data-category="hats"]');
    if (hatsTab) hatsTab.click();
  }
}

// ✅ Optional scroll handler (if needed)
export function scrollShop(direction) {
  const wrapper = document.querySelector(".shop-scroll-wrapper .items");
  const scrollAmount = 200;
  wrapper.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
}
