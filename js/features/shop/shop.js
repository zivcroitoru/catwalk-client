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
  console.log("✅ Forced shop popup open");

  // ✅ Load shop items
  if (window.shopItems) {
    renderShopItems(window.shopItems);
  } else {
    console.warn("⚠️ shopItems not loaded yet");
  }

  // ✅ Auto-select hats tab
  const hatsTab = document.querySelector('.tab[data-category="hats"]');
  if (hatsTab) {
    console.log("🎩 Clicking hats tab");
    hatsTab.click();
  } else {
    console.warn("⚠️ Hats tab not found");
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
