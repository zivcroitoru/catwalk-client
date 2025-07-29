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

    userCats = await catsRes.json();
    shopItems = await shopRes.json();
    const templates = await templatesRes.json(); // templates is an object, not an array

    const breedItems = {};
    for (const breed in templates) {
      const cats = templates[breed];
      breedItems[breed] = cats.map(cat => ({
        name: cat.name,
        variant: cat.variant,
        palette: cat.palette,
        sprite: cat.sprite
      }));
    }

    window.userCats = userCats;
    window.shopItems = shopItems;
    window.breedItems = breedItems;

    console.log("✅ All data loaded");
  } catch (err) {
    console.error("❌ Data loading error:", err);
  }
}
