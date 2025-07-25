import { shopItems } from './shopItems.js'; // JSON data
import { renderShopItems } from './shopItemsRenderer.js'; // Renders items

// ✅ Toggle the visibility of the shop overlay
export function toggleShop() {
  const overlay = document.getElementById("shopOverlay");
  const isVisible = getComputedStyle(overlay).display === "block";

  if (isVisible) {
    overlay.style.display = "none";
    console.log("❌ Closed shop");
  } else {
    overlay.style.display = "block";
    console.log("✅ Opened shop");

    const hatsTab = document.querySelector('.tab[data-category="hats"]');
    if (hatsTab) hatsTab.click();
  }
}

// ✅ Optional scroll behavior
export function scrollShop(direction) {
  const wrapper = document.querySelector(".shop-scroll-wrapper .items");
  wrapper.scrollBy({ left: direction * 200, behavior: "smooth" });
}

// ✅ Call once on load
document.addEventListener("DOMContentLoaded", () => {
  renderShopItems(shopItems);
});
