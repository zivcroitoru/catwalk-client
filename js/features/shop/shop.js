import { renderShopItems } from './shopItemsRenderer.js';

export function toggleShop() {
  const popup = document.getElementById("shopPopup");
  const profileScroll = document.getElementById("catProfileScroll");
  const blocker = document.getElementById("shopOverlayBlocker");

  if (!popup) return;

  if (profileScroll) {
    profileScroll.style.display = "none";
    profileScroll.classList.add("hidden");
  }

  if (blocker) {
    blocker.classList.remove("hidden");
    blocker.style.display = "block";
  }

  popup.style.display = "block";
  popup.classList.remove("hidden");

  document.body.classList.add("shop-lock");

  if (window.shopItemsByCategory) {
    const activeTab = document.querySelector(".tab.active");
    const category = activeTab?.dataset.category?.toLowerCase() || "hats";
    renderShopItems(category);
  }
}

export function scrollShop(direction) {
  const wrapper = document.querySelector(".shop-scroll-wrapper");
  if (!wrapper) return;

  wrapper.scrollBy({ top: direction * 120, behavior: "smooth" });
}

export function closeShop() {
  const popup = document.getElementById("shopPopup");
  const profileScroll = document.getElementById("catProfileScroll");
  const blocker = document.getElementById("shopOverlayBlocker");

  if (popup) {
    popup.style.display = "none";
    popup.classList.add("hidden");
  }

  if (profileScroll) {
    profileScroll.style.display = "block";
    profileScroll.classList.remove("hidden");
  }

  if (blocker) {
    blocker.classList.add("hidden");
    blocker.style.display = "none";
  }

  document.body.classList.remove("shop-lock");
}
