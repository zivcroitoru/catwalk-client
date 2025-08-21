/*-----------------------------------------------------------------------------
  shopTabs.js
-----------------------------------------------------------------------------*/
import { $$ } from '../../core/utils.js';
import { renderShopItems } from './shopItemsRenderer.js';

export function setupShopTabs() {
  const tabs = $$(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const selected = tab.dataset.category?.toLowerCase();

      if (!window.shopItemsByCategory) return;
      if (!window.shopItemsByCategory[selected]) return;

      renderShopItems(selected);
    });
  });

  if (tabs[0]) tabs[0].click();
}

export function scrollShop(direction) {
  const container = document.getElementById("shopItems");
  container.scrollBy({
    left: direction * 160,
    behavior: "smooth"
  });
}
