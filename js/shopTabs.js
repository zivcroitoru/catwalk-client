/*-----------------------------------------------------------------------------
  shopTabs.js
-----------------------------------------------------------------------------*/
import { $$ } from './utils.js';

export function setupShopTabs() {
  const tabs = $$(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const selected = tab.dataset.category.toLowerCase();
      const items = $$("#shopItems .item-wrapper"); // 🔄 fresh query every time

      items.forEach(i => {
        i.style.display = i.dataset.category?.toLowerCase() === selected ? "block" : "none";
      });
    });
  });

  if (tabs[0]) tabs[0].click(); // auto-activate first tab
}

export function scrollShop(direction) {
  const container = document.getElementById("shopItems");
  container.scrollBy({
    left: direction * 160,
    behavior: "smooth"
  });
}
