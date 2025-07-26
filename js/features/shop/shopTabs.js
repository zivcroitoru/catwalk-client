/*-----------------------------------------------------------------------------
  shopTabs.js
-----------------------------------------------------------------------------*/
import { $$ } from '../../core/utils.js';

export function setupShopTabs() {
  const tabs = $$(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const selected = tab.dataset.category.toLowerCase();
      const items = $$("#shopItems .shop-card"); // ✅ updated selector

      items.forEach(i => {
        i.style.display = i.dataset.category?.toLowerCase() === selected ? "flex" : "none";
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
