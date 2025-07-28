import { renderShopItems } from './shopItemsRenderer.js'; // 🎨 Renders items
export function toggleShop() {
  console.log("🛒 toggleShop() FORCE OPEN");

  const popup = document.getElementById("shopPopup");
  const profileScroll = document.getElementById("catProfileScroll");

  if (!popup) {
    console.warn("❌ shopPopup not found");
    return;
  }

  // 🛑 DO NOT close the profile scroll (disabled for now)
  // if (profileScroll) {
  //   profileScroll.style.display = "none";
  // }

  // ✅ Force display of shop
  popup.style.display = "block";
  popup.classList.remove("hidden");
  console.log("✅ Forced shop popup open");

  // ✅ Load shop items (default to current tab)
  if (window.shopItems) {
const activeTab = document.querySelector(".tab.active");
const category = activeTab?.dataset.category?.toLowerCase() || "hats";
renderShopItems(window.shopItems, category);
  } else {
    console.warn("⚠️ shopItems not loaded yet");
  }
}

export function scrollShop(direction) {
  const wrapper = document.querySelector(".shop-scroll-wrapper");
  if (!wrapper) {
    console.warn("❌ .shop-scroll-wrapper not found");
    return;
  }

  wrapper.scrollBy({ top: direction * 120, behavior: "smooth" });
}

// ✅ Add this function
export function closeShop() {
  const popup = document.getElementById("shopPopup");
  if (popup) {
    popup.style.display = "none"; // ← direct hide
    console.log("🛑 Shop closed");
  }
}
