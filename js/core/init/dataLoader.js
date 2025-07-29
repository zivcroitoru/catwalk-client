// /core/init/dataLoader.js

export let userCats = [];
export let shopItems = [];

export async function loadAllData() {
  try {
    const [catsRes, shopRes, breedsRes] = await Promise.all([
      fetch("../data/usercats.json"),
      fetch("../data/shopItems.json"),
      fetch("../data/breeds.json")
    ]);

    userCats = await catsRes.json();
    shopItems = await shopRes.json();
    const breeds = await breedsRes.json();

    window.userCats = userCats;
    window.shopItems = shopItems;
    window.breedItems = breeds;

    console.log("✅ All data loaded");
  } catch (err) {
    console.error("❌ Data loading error:", err);
  }
}
