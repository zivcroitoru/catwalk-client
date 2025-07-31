import { renderShopItems } from './shopItemsRenderer.js'; // 🎨 Renders items

export function toggleShop() {
  console.log("🛒 toggleShop() FORCE OPEN");

  const popup = document.getElementById("shopPopup");
  const profileScroll = document.getElementById("catProfileScroll");
  const blocker = document.getElementById("shopOverlayBlocker");

  if (!popup) {
    console.warn("❌ shopPopup not found");
    return;
  }

  // ✅ Hide the profile scroll
  if (profileScroll) {
    profileScroll.style.display = "none";
    profileScroll.classList.add("hidden");
    console.log("📜 Profile scroll hidden");
  }

  // ✅ Show blocker behind shop
  if (blocker) {
    blocker.classList.remove("hidden");
    blocker.style.display = "block";
    console.log("🛡️ Blocker enabled");
  }

  // ✅ Show the shop popup
  popup.style.display = "block";
  popup.classList.remove("hidden");
  console.log("✅ Shop popup shown");

  // ✅ Apply global lock class
  document.body.classList.add("shop-lock");

  // ✅ Load current tab items
  if (window.shopItemsByCategory) {
    const activeTab = document.querySelector(".tab.active");
    const category = activeTab?.dataset.category?.toLowerCase() || "hats";
    renderShopItems(category);
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

export function closeShop() {
  const popup = document.getElementById("shopPopup");
  const profileScroll = document.getElementById("catProfileScroll");
  const blocker = document.getElementById("shopOverlayBlocker");

  if (popup) {
    popup.style.display = "none";
    popup.classList.add("hidden");
    console.log("🛑 Shop closed");
  }

  if (profileScroll) {
    profileScroll.style.display = "block";
    profileScroll.classList.remove("hidden");
    console.log("📜 Profile scroll re-opened");
  }

  if (blocker) {
    blocker.classList.add("hidden");
    blocker.style.display = "none";
    console.log("🧼 Blocker disabled");
  }

  // ✅ Remove global lock
  document.body.classList.remove("shop-lock");
}
