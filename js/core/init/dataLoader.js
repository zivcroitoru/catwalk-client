// /core/init/dataLoader.js

import { getPlayerCats } from "../storage.js";
import { APP_URL } from "../../core/config.js";

export let userCats = [];
export let shopItems = [];

export async function loadAllData() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error('No auth token found for data loading');
      throw new Error('Authentication required');
    }

    const headers = { Authorization: `Bearer ${token}` };
    console.log('🔄 Starting data load...');

    // Load all data in parallel
    const [shopRes, templates, loadedUserCats] = await Promise.all([
      fetch(`${APP_URL}/api/shop`, { headers })
        .then(res => {
          if (!res.ok) throw new Error(`Shop fetch failed: ${res.status}`);
          return res.json();
        }),
      fetch(`${APP_URL}/api/cats/allcats`, { headers })
        .then(res => {
          if (!res.ok) throw new Error(`Templates fetch failed: ${res.status}`);
          return res.json();
        }),
      getPlayerCats()
        .catch(err => {
          console.error('Failed to load player cats:', err);
          return [];
        })
    ]).catch(err => {
      console.error('Failed to load initial data:', err);
      throw err;
    });

    // 🐱 User cats validation
    if (!Array.isArray(loadedUserCats)) {
      console.error('Invalid user cats data:', loadedUserCats);
      userCats = [];
    } else {
      userCats = loadedUserCats.filter(cat => cat && cat.id);
      console.log("📦 Loaded", userCats.length, "valid user cats");
    }

    // 🛒 Shop validation
    if (!shopRes || typeof shopRes !== 'object') {
      console.error('Invalid shop data:', shopRes);
      shopItems = {};
    } else {
      shopItems = shopRes;
    }

    // 🧪 Templates
    console.log("🐾 templates structure:", templates);

    const breedItems = {};
    window.breedItems = breedItems; // Ensure global access

    for (const cat of templates) {
      const breed = cat.breed || cat.template || cat.type;
      const sprite = cat.sprite_url;

      console.log("🐈‍⬛ RAW CAT:", cat);
      console.log("📦 Mapped:", { breed, sprite });

      if (!breed) {
        console.warn("⛔ Skipping template due to missing breed:", cat);
        continue;
      }

      // Initialize breed category if it doesn't exist
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
