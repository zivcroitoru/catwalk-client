export function updateCatPreview(cat, container = document) {
  if (!cat) {
    console.warn('⚠️ No cat provided to updateCatPreview');
    return;
  }

  // Ensure cat has standardized structure
  cat.equipment = cat.equipment || { hat: null, top: null, eyes: null, accessories: [] };

  const setLayer = (cls, path) => {
    console.log("Setting layer", cls, "with path", path);
    
    const el = container.querySelector(`.${cls}`);
    if (!el) return;
    
    // Handle empty or invalid paths
    if (!path) {
      el.style.display = "none";
      return;
    }

    // Process the path based on type
    let finalPath = path;
    if (!path.startsWith('data:') && // Don't modify data URLs
        !path.startsWith('http') &&   // Don't modify absolute URLs
        !path.startsWith('blob:') &&  // Don't modify blob URLs
        !path.startsWith('/')) {      // Don't modify root-relative paths
      finalPath = `${APP_URL}/${path}`;
    }

    // Handle image load errors
    el.onerror = () => {
      console.warn(`⚠️ Failed to load image: ${path}`);
      el.style.display = "none";
    };
    
    el.src = finalPath;
    el.style.display = "block";
  };

  // Always use normalized equipment structure
  cat.equipment ||= { hat: null, top: null, eyes: null, accessories: [] };

  setLayer("carouselBase", cat.sprite_url);

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
