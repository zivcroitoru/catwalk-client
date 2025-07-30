// /core/init/dataLoader.js

import { getUserCats } from "../storage.js"
import { APP_URL } from '../../core/config.js'



export let userCats = [];
export let shopItems = [];

export async function loadAllData() {
  try {
const [shopRes, templatesRes] = await Promise.all([
  fetch(`${APP_URL}/api/shop`),
  fetch(`${APP_URL}/api/cats/allcats`)
]);

    // 🐱 Load local user cats
    userCats = getUserCats();
    console.log("📦 Loaded userCats from userItems");

    // 🛒 Load shop data
    shopItems = await shopRes.json();

    // 🎨 Parse cat templates
    const templates = await templatesRes.json();
    const breedItems = {};

    for (const [breed, cats] of Object.entries(templates)) {
      if (!Array.isArray(cats)) {
        console.warn(`⚠️ Skipping breed '${breed}' — not an array`);
        continue;
      }

      breedItems[breed] = cats
        .filter(cat => cat?.sprite && cat.sprite !== "null")
        .map(cat => ({
          name: cat.name,
          variant: cat.variant || cat.name,
          palette: cat.palette || "default",
          sprite: cat.sprite
        }));

      console.log(`✅ Loaded ${breedItems[breed].length} valid variants for '${breed}'`);
    }

    // 🌍 Expose globals
    window.userCats = userCats;
    window.shopItems = shopItems;
    window.breedItems = breedItems;

    console.log("✅ All data loaded");
  } catch (err) {
    console.error("❌ Data loading error:", err);
  }
}
