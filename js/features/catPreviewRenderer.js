export function updateCatPreview(cat, container = document) {
  if (!cat) {
    console.warn('⚠️ No cat provided to updateCatPreview');
    return;
  }

  const setLayer = (cls, path) => {
    console.log("base path is" + path);
    
    const el = container.querySelector(`.${cls}`);
    if (!el) return;
    
    // Handle empty or invalid paths
    if (!path) {
      el.style.display = "none";
      return;
    }

    // Process the path - directly use data URLs, absolute URLs, and blob URLs
    let finalPath = path;

    // Handle image load errors
    el.onerror = () => {
      console.warn(`⚠️ Failed to load image: ${path}`);
      el.style.display = "none";
    };
    
    el.src = finalPath;
    el.style.display = "block";
  };

  // Initialize equipment if not present
  cat.equipment ||= { hat: null, top: null, eyes: null, accessories: [] };

  setLayer("carouselBase", cat.image);

  const getSprite = (category, itemId) => {
    if (!itemId || !window.shopItems) return "";
    
    // Initialize category if missing
    if (!window.shopItems[category]) {
      console.warn(`⚠️ Missing shop category: ${category}`);
      window.shopItems[category] = [];
    }
    
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
