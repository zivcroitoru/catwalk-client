export function updateCatPreview(cat, container = document) {
  if (!cat) return;

  const setLayer = (cls, path) => {
    const el = container.querySelector(`.${cls}`);
    if (!el) return;
    el.src = path || "";
    el.style.display = path ? "block" : "none";
  };

  setLayer("carouselBase", cat.image);

  const getSprite = (category, itemId) => {
    if (!itemId || !window.shopItems?.[category]) return "";
    const item = window.shopItems[category].find(
      i => i.id === itemId || i.template === itemId
    );
    return item?.sprite_url || "";
  };

  const hat = cat.equipment?.hat;
  const hatSprite = getSprite("hats", hat);
  setLayer("carouselHat", hatSprite);

  const top = cat.equipment?.top;
  const topSprite = getSprite("tops", top);
  setLayer("carouselTop", topSprite);

  const eyes = cat.equipment?.eyes;
  const eyesSprite = getSprite("eyes", eyes);
  setLayer("carouselEyes", eyesSprite);

  const accessory = cat.equipment?.accessories?.[0];
  const accSprite = getSprite("accessories", accessory);
  setLayer("carouselAccessory", accSprite);
}
