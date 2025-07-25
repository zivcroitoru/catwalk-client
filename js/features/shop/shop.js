// shop.js
import { renderShopItems } from './shopItemsRenderer.js'; // 🎨 Renders items

// ✅ Toggle the visibility of the shop overlay and render items
export function toggleShop() {
  console.log("🛒 toggleShop() called");

  const overlay = document.getElementById("shopOverlay");
  if (!overlay) {
    console.warn("❌ shopOverlay not found");
    return;
  }

  const isVisible = getComputedStyle(overlay).display === "block";

  if (isVisible) {
    overlay.style.display = "none";
    console.log("❌ Closed shop");
  } else {
    overlay.style.display = "block";
    console.log("✅ Opened shop");

    // 🔁 Use global shopItems loaded from JSON
    if (window.shopItems) {
      renderShopItems(window.shopItems);
    } else {
      console.warn("⚠️ shopItems not loaded yet");
    }

    const hatsTab = document.querySelector('.tab[data-category="hats"]');
    if (hatsTab) {
      console.log("🎩 Clicking hats tab");
      hatsTab.click();
    } else {
      console.warn("⚠️ Hats tab not found");
    }
  }
}

// ✅ Optional: Scroll the shop items left/right
export function scrollShop(direction) {
  const wrapper = document.querySelector(".shop-scroll-wrapper .items");
  if (!wrapper) {
    console.warn("❌ shop-scroll-wrapper not found");
    return;
  }
  wrapper.scrollBy({ left: direction * 200, behavior: "smooth" });
}
