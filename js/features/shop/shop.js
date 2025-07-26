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

    // ✅ Auto-select hats tab AFTER rendering
    setTimeout(() => {
      const hatsTab = document.querySelector('.tab[data-category="hats"]');
      if (hatsTab) {
        console.log("🎩 Clicking hats tab (delayed)");
        hatsTab.click();
      } else {
        console.warn("⚠️ Hats tab not found");
      }
    }, 50); // Slight delay to let DOM update
  } else {
    console.warn("⚠️ shopItems not loaded yet");
  }
}

// ✅ Vertical scroll logic for up/down buttons
export function scrollShop(direction) {
  const wrapper = document.querySelector(".shop-scroll-wrapper");
  if (!wrapper) {
    console.warn("❌ .shop-scroll-wrapper not found");
    return;
  }

  wrapper.scrollBy({ top: direction * 120, behavior: "smooth" });
}