// /core/init/dataLoader.js

import { getUserCats } from "../storage.js"
import { APP_URL } from '../../core/config.js'

export let userCats = [];
export let shopItems = [];

export async function loadAllData() {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const [shopRes, templatesRes, loadedUserCats] = await Promise.all([
      fetch(`${APP_URL}/api/shop`, { headers }),
      fetch(`${APP_URL}/api/cats/allcats`, { headers }),
      getUserCats()
    ]);

    // 🐱 Set user cats
    userCats = loadedUserCats;
    console.log("📦 Loaded userCats from userItems");

    // 🛒 Load shop data
    shopItems = await shopRes.json();

    // 🧪 Parse templates response
    const templates = await templatesRes.json();
    console.log("🐾 templates structure:", templates);

    const breedItems = {};

    // 👇 Auto-grouping logic if templates is a flat array
    for (const cat of templates) {
      if (!cat?.breed || !cat?.sprite || cat.sprite === "null") continue;

      if (!breedItems[cat.breed]) {
        breedItems[cat.breed] = [];
      }

      breedItems[cat.breed].push({
        name: cat.name,
        variant: cat.variant || cat.name,
        palette: cat.palette || "default",
        sprite: cat.sprite
      });
    }

    for (const [breed, variants] of Object.entries(breedItems)) {
      console.log(`✅ Loaded ${variants.length} valid variants for '${breed}'`);
    }

    // 🌍 Expose globals
    window.userCats = userCats;
    window.shopItems = shopItems;
    window.breedItems = breedItems;

    console.log("✅ All data loaded!!!");
  } catch (err) {
    console.error("❌ Data loading error:", err);
  }
}
