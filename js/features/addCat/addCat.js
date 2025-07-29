// addCat.js
import { initBreedTabs } from "./breedTabs.js";
import { renderBreedItems } from "./breedItemsRenderer.js";

export function toggleAddCat() {
  const popup   = document.getElementById("addCatPopup");
  const blocker = document.getElementById("addCatOverlayBlocker");

  console.log("🔄 Toggling Add Cat Popup...");
  console.log("📦 Popup:", popup);
  console.log("🛡️ Blocker:", blocker);
  console.log("📚 Breed Items:", window.breedItems);

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

  document.getElementById("addCatPopup").classList.add("hidden");
  document.getElementById("addCatOverlayBlocker").classList.add("hidden");
  document.body.classList.remove("shop-lock");

  console.log("✅ Popup closed");
}

// 👇 Make callable from HTML
window.toggleAddCat = toggleAddCat;
window.closeAddCat = closeAddCat;
