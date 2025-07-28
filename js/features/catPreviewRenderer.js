export function updateCatPreview(cat) {
  if (!cat) return;

  console.log("🎨 Updating preview for cat:", cat.name);

  const setLayer = (id, path) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.src = path || "";
    el.style.display = path ? "block" : "none";
  };

  // 🐾 Base
  setLayer("carouselBase", cat.image);
  console.log("✅ Base equipped:", cat.image);

  const getSprite = (category, template) => {
    if (!template || !window.shopItems?.[category]) return "";
    const item = window.shopItems[category].find(i => i.template === template);
    return item?.sprite_url || "";
  };

  // 🧢 Hat
  const hat = cat.equipment?.hat;
  const hatSprite = getSprite("hats", hat);
  setLayer("carouselHat", hatSprite);
  hatSprite ? console.log("✅ Hat equipped:", hatSprite) : console.log("❌ Hat unequipped");

  // 👕 Top
  const top = cat.equipment?.top;
  const topSprite = getSprite("tops", top);
  setLayer("carouselTop", topSprite);
  topSprite ? console.log("✅ Top equipped:", topSprite) : console.log("❌ Top unequipped");

  // 👀 Eyes
  const eyes = cat.equipment?.eyes;
  const eyesSprite = getSprite("eyes", eyes);
  setLayer("carouselEyes", eyesSprite);
  eyesSprite ? console.log("✅ Eyes equipped:", eyesSprite) : console.log("❌ Eyes unequipped");

  // 🎀 Accessory (first one only)
  const accessory = cat.equipment?.accessories?.[0];
  const accSprite = getSprite("accessories", accessory);
  setLayer("carouselAccessory", accSprite);
  accSprite ? console.log("✅ Accessory equipped:", accSprite) : console.log("❌ Accessory unequipped");
}
