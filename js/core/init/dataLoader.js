// /core/init/dataLoader.js

import { getUserCats } from "../storage.js";
import { APP_URL } from "../../core/config.js";

export let userCats = [];
export let shopItems = [];

export async function loadAllData() {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const [shopRes, templatesRes, loadedUserCats] = await Promise.all([
      fetch(`${APP_URL}/api/shop`, { headers }),
      fetch(`${APP_URL}/api/cats/allcats`, { headers }),
      getUserCats()
    ]);

    // 🐱 User cats
    userCats = loadedUserCats;
    console.log("📦 Loaded userCats from userItems!!");

    // 🛒 Shop
    shopItems = await shopRes.json();

    // 🧪 Templates
    const templates = await templatesRes.json();
    console.log("🐾 templates structure:", templates);

    const breedItems = {};

    for (const cat of templates) {
      const breed = cat.breed || cat.template || cat.type;
      const sprite = cat.sprite_url || cat.sprite;

      console.log("🐈‍⬛ RAW CAT:", cat);
      console.log("📦 Mapped:", { breed, sprite });

      if (!breed || !sprite || sprite === "null") {
        console.warn("⛔ Skipping template due to missing data:", { breed, sprite });
        continue;
      }

      if (!breedItems[breed]) breedItems[breed] = [];

      breedItems[breed].push({
        name: cat.name || "Unnamed",
        variant: cat.variant || cat.name || "Default",
        palette: cat.palette || "default",
        sprite
      });
    }

    console.log("✅ breedItems:", breedItems);

    for (const [breed, variants] of Object.entries(breedItems)) {
      console.log(`✅ Loaded ${variants.length} valid variants for '${breed}'`);
    }

    window.userCats = userCats;
    window.shopItems = shopItems;
    window.breedItems = breedItems;

    console.log("✅ All data loaded!!!");
  } catch (err) {
    console.error("❌ Data loading error:", err);
  }
}
