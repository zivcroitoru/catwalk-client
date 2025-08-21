// addCat.js
import { initBreedTabs } from "./breedTabs.js";
import { renderBreedItems } from "./breedItemsRenderer.js";

export function toggleAddCat() {
  // close any toast
  if (window.Toastify?.recent) { try { Toastify.recent.hideToast(); } catch {} }

  // hide the empty-state card when opening popup
  document.getElementById('emptyState')?.classList.add('hidden');

  // Get required elements
  const popup   = document.getElementById("addCatPopup");
  const blocker = document.getElementById("addCatOverlayBlocker");

  initBreedTabs();

  const firstBreed = Object.keys(window.breedItems || {})[0];
  if (firstBreed) {
    renderBreedItems(firstBreed);
  }

  popup.classList.toggle("hidden");
  blocker.classList.toggle("hidden");
  document.body.classList.toggle("shop-lock");
}

export function closeAddCat() {
  // Hide the empty-state card if it’s still showing
  document.getElementById("emptyState")?.classList.add("hidden");

  document.getElementById("addCatPopup").classList.add("hidden");
  document.getElementById("addCatOverlayBlocker").classList.add("hidden");
  document.body.classList.remove("shop-lock");

  if (window.Toastify?.recent) {
    try { Toastify.recent.hideToast(); } catch {}
  }
}

// Make callable from HTML
window.toggleAddCat = toggleAddCat;
window.closeAddCat = closeAddCat;
