/*-----------------------------------------------------------------------------
  breedTabs.js – builds tabs from breed names (once)
-----------------------------------------------------------------------------*/
import { renderBreedItems } from "./breedItemsRenderer.js";
import { $$, toPascalCase } from "../../core/utils.js";

export function initBreedTabs() {
  const bar = document.getElementById("breedTabs");
  if (!bar) return;

  const breeds = Object.keys(window.breedItems || {});
  if (!breeds.length) return;

  // Clear and rebuild tabs each time
  bar.innerHTML = "";

  breeds.forEach((breed, i) => {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.dataset.breed = breed;
    tab.textContent = toPascalCase(breed);
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

  // Always open the first tab
  const firstTab = tabs[0];
  if (firstTab) firstTab.click();
}
