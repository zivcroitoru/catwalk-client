/*-----------------------------------------------------------------------------
  breedTabs.js – builds tabs from breed names (once)
-----------------------------------------------------------------------------*/
import { renderBreedItems } from "./breedItemsRenderer.js";
import { $$ } from "../../core/utils.js";

export function initBreedTabs() {
  const bar = document.getElementById("breedTabs");
  if (!bar || bar.children.length > 0) return; // Already initialized or missing

  const breeds = Object.keys(window.breedItems || {});
  if (!breeds.length) {
    console.warn("⚠️ No breeds to initialize");
    return;
  }

  breeds.forEach((breed, i) => {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.dataset.breed = breed;
    tab.textContent = breed;
    if (i === 0) tab.classList.add("active");
    bar.appendChild(tab);
  });

  // Add click listeners
  const tabs = $$("#breedTabs .tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const breed = tab.dataset.breed;
      renderBreedItems(breed);
    });
  });

  console.log("✅ Breed tabs initialized");
}
