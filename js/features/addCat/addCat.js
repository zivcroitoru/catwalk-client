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
  const breedTabsContainer = document.getElementById("breedTabs");
  const breedItemsContainer = document.getElementById("breedItems");

  // Log initial state
  console.log("📦 Elements found:", {
    popup: !!popup,
    blocker: !!blocker,
    breedTabs: !!breedTabsContainer,
    breedItems: !!breedItemsContainer
  });
  console.log("� Available breeds:", Object.keys(window.breedItems || {}));
  console.log("🎨 First breed data:", Object.values(window.breedItems || {})[0]);

  initBreedTabs();

  const firstBreed = Object.keys(window.breedItems || {})[0];
  if (firstBreed) {
    console.log(`🎨 First breed: ${firstBreed}`);
    renderBreedItems(firstBreed);
  } else {
    console.warn("⚠️ No breeds found in window.breedItems");
  }

  popup.classList.toggle("hidden");
  blocker.classList.toggle("hidden");
  document.body.classList.toggle("shop-lock");

  console.log("✅ Popup visible:", !popup.classList.contains("hidden"));
  console.log("✅ Body shop-lock:", document.body.classList.contains("shop-lock"));
}

export function closeAddCat() {
  console.log("❌ Closing Add Cat popup");

  // Hide the empty-state card if it’s still showing
  document.getElementById("emptyState")?.classList.add("hidden");

  document.getElementById("addCatPopup").classList.add("hidden");
  document.getElementById("addCatOverlayBlocker").classList.add("hidden");
  document.body.classList.remove("shop-lock");

  console.log("✅ Popup closed");
  if (window.Toastify?.recent) {
  try { Toastify.recent.hideToast(); } catch {}
}
}


// 👇 Make callable from HTML
window.toggleAddCat = toggleAddCat;
window.closeAddCat = closeAddCat;
