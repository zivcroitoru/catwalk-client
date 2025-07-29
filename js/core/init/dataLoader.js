// /core/init/dataLoader.js

export let userCats = [];
export let shopItems = [];

export async function loadAllData() {
  try {
    const [catsRes, shopRes, templatesRes] = await Promise.all([
      fetch("../data/usercats.json"),
      fetch("../data/shopItems.json"),
      fetch("../data/cat_templates.json")
    ]);

    // Load default user cats from JSON
    userCats = await catsRes.json();

    // Override with localStorage if it exists
    const localCats = localStorage.getItem("usercats");
    if (localCats) {
      userCats = JSON.parse(localCats);
      console.log("📦 Loaded userCats from localStorage");
    }

    shopItems = await shopRes.json();
    const templates = await templatesRes.json(); // breed → [cats]

    const breedItems = {};

    for (const [breed, cats] of Object.entries(templates)) {
      if (!Array.isArray(cats)) {
        console.warn(`⚠️ Skipping breed '${breed}' — not an array:`, cats);
        continue;
      }

      breedItems[breed] = [];

      for (const cat of cats) {
        if (!cat?.sprite || cat.sprite === "null") {
          console.warn(`⛔ Skipping invalid cat (no sprite) in '${breed}':`, cat);
          continue;
        }

        breedItems[breed].push({
          name: cat.name,
          variant: cat.variant || cat.name,
          palette: cat.palette || "default",
          sprite: cat.sprite
        });
      }

      console.log(`✅ Loaded ${breedItems[breed].length} valid variants for '${breed}'`);
    }

    // Expose to global scope
    window.userCats = userCats;
    window.shopItems = shopItems;
    window.breedItems = breedItems;

    // Keep localStorage in sync
    localStorage.setItem("usercats", JSON.stringify(userCats));

    console.log("✅ All data loaded");
  } catch (err) {
    console.error("❌ Data loading error:", err);
  }
}
