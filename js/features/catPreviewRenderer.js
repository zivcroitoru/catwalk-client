export function updateCatPreview(cat, container = document) {
  if (!cat) { console.warn('[preview] No cat provided'); return; }
  if (!container) { console.warn('[preview] No container provided'); return; }

  console.log('[preview] Render start', { catId: cat.id, container });

  // Normalize shape
  cat.equipment = cat.equipment || { hat: null, top: null, eyes: null, accessories: [] };

  const resolveUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('data:') || path.startsWith('http') || path.startsWith('blob:')) return path;
    const clean = path.startsWith('/') ? path.slice(1) : path;
    // APP_URL must exist globally or import it here
    const base = (typeof APP_URL !== 'undefined') ? APP_URL : '';
    return base ? `${base}/${clean}` : clean;
  };

  const setLayer = (cls, path) => {
    const el = container.querySelector(`.${cls}`);
    if (!el) { console.warn(`[preview] Missing element .${cls} in container`, container); return; }

    if (!path) {
      el.style.display = 'none';
      console.log(`[preview] .${cls} -> hidden (no path)`);
      return;
    }

    const finalPath = resolveUrl(path);
    // Force repaint even if same src
    if (el.src === finalPath) {
      el.style.display = 'block';
      console.log(`[preview] .${cls} unchanged src (already set)`);
      return;
    }

    el.onerror = () => {
      console.warn(`[preview] .${cls} failed to load`, { requested: finalPath });
      el.style.display = 'none';
    };

    el.onload = () => {
      console.log(`[preview] .${cls} loaded`, { src: finalPath });
    };

    el.src = finalPath;
    el.style.display = 'block';
    console.log(`[preview] .${cls} -> ${finalPath}`);
  };

  const getSprite = (category, itemId) => {
    if (!itemId) return '';
    const catMap = window.shopItemsByCategory;
    if (!catMap) { console.warn('[preview] shopItemsByCategory not ready'); return ''; }

    // NOTE: keys must match your loader: "hats","tops","eyes","accessories"
    const list = catMap[category];
    if (!Array.isArray(list)) { console.warn(`[preview] Missing category '${category}'`); return ''; }

    const item = list.find(i => i.id === itemId || i.template === itemId);
    if (!item) {
      console.warn(`[preview] Item not found in '${category}'`, { itemId });
      return '';
    }
    return item.sprite_url || '';
  };

  // Base cat body
  setLayer('carouselBase', cat.sprite_url);

  // Equipment layers
  const hat = cat.equipment?.hat;
  setLayer('carouselHat', getSprite('hats', hat));

  const top = cat.equipment?.top;
  setLayer('carouselTop', getSprite('tops', top));

  const eyes = cat.equipment?.eyes;
  setLayer('carouselEyes', getSprite('eyes', eyes));

  const accessory = cat.equipment?.accessories?.[0];
  setLayer('carouselAccessory', getSprite('accessories', accessory));

  console.log('[preview] Render end', { catId: cat.id });
}
