// addCat.js
import { initBreedTabs } from "./breedTabs.js";
import { renderBreedItems } from "./breedItemsRenderer.js";

export function toggleAddCat() {
  const popup   = document.getElementById("addCatPopup");
  const blocker = document.getElementById("addCatOverlayBlocker");

  initBreedTabs();

  const firstBreed = Object.keys(window.breedItems || {})[0];
  if (firstBreed) renderBreedItems(firstBreed);

  popup.classList.toggle("hidden");
  blocker.classList.toggle("hidden");
  document.body.classList.toggle("shop-lock");
}

export function closeAddCat() {
  document.getElementById("addCatPopup").classList.add("hidden");
  document.getElementById("addCatOverlayBlocker").classList.add("hidden");
  document.body.classList.remove("shop-lock");
}

// 👇 Add these to make them callable from HTML
window.toggleAddCat = toggleAddCat;
window.closeAddCat = closeAddCat;
