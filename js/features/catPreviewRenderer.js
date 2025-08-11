// Efficient, readable, with concise comments
export function updateCatPreview(
  cat,
  container = document,
  opts = {}
) {
  if (!cat || !container) return;

  const {
    shopItemsByCategory = window.shopItemsByCategory,
    spriteByTemplate    = window.spriteByTemplate, // optional fast map: template -> sprite_url
    appUrl              = (typeof APP_URL !== 'undefined') ? APP_URL : ''
  } = opts;

  // Normalize equipment shape once
  const equip = cat.equipment ?? { hat: null, top: null, eyes: null, accessories: null };

  // ---- Helpers ----
  const resolveUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('data:') || path.startsWith('http') || path.startsWith('blob:')) return path;
    const clean = path[0] === '/' ? path.slice(1) : path;
    return appUrl ? `${appUrl}/${clean}` : clean;
  };

  const q = (cls) => container.querySelector(`.${cls}`);

  const setImg = (cls, src) => {
    const el = q(cls);
    if (!el) { console.warn(`[preview] Missing .${cls}`); return; }

    if (!src) { el.style.display = 'none'; return; }

    const finalSrc = resolveUrl(src);

    // Only update when changed to avoid extra loads
    if (el.src !== finalSrc) {
      el.onerror = () => { el.style.display = 'none'; console.warn(`[preview] .${cls} failed`, { finalSrc }); };
      el.onload  = () => { el.style.display = 'block'; };
      el.src = finalSrc;
    }
    el.style.display = 'block';
  };

  const findSprite = (category, itemId) => {
    if (!itemId) return '';
    // Fast path by template
    if (spriteByTemplate && spriteByTemplate[itemId]) return spriteByTemplate[itemId];

    if (!shopItemsByCategory || !Array.isArray(shopItemsByCategory[category])) {
      console.warn(`[preview] Category missing: ${category}`);
      return '';
    }
    const list = shopItemsByCategory[category];

    // Match by template or id (string/number)
    const item = list.find(i => i.template === itemId || i.id === itemId || String(i.id) === String(itemId));
    if (!item) {
      console.warn('[preview] Item not found', { category, itemId, sample: list.slice(0, 3) });
      return '';
    }
    return item.sprite_url || '';
  };

  // ---- Render ----
  setImg('carouselBase', cat.sprite_url);
  setImg('carouselHat',  findSprite('hats',        equip.hat));
  setImg('carouselTop',  findSprite('tops',        equip.top));
  setImg('carouselEyes', findSprite('eyes',        equip.eyes));
  setImg('carouselAccessory', findSprite('accessories', equip.accessories?.[0]));
}
