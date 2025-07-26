export function updateCatPreview(cat) {
  if (!cat) return;

  const setLayer = (id, path) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.src = path || "";
    el.style.display = path ? "block" : "none";
  };

  // 🐾 Base cat on podium
  setLayer("carouselBase", cat.image);

  // 🧢 Hat
  const hat = cat.equipment?.hat;
  setLayer("carouselHat", hat ? `../assets/shop_cosmetics/${hat.replace("hat_", "hats/")}.png` : "");

  // 👕 Shirt
  const shirt = cat.equipment?.shirt;
  setLayer("carouselShirt", shirt ? `../assets/shop_cosmetics/${shirt.replace("shirt_", "shirt/")}.png` : "");

  // 👖 Pants
  const pants = cat.equipment?.pants;
  setLayer("carouselPants", pants ? `../assets/shop_cosmetics/${pants.replace("pants_", "pants/")}.png` : "");

  // 👟 Shoes
  const shoes = cat.equipment?.shoes;
  setLayer("carouselShoes", shoes ? `../assets/shop_cosmetics/${shoes.replace("shoes_", "shoes/")}.png` : "");

  // 🎀 Accessory (first only)
  const acc = cat.equipment?.accessories?.[0];
  setLayer("carouselAccessories", acc ? `../assets/shop_cosmetics/${acc.replace("accessories_", "accessories/")}.png` : "");
}
