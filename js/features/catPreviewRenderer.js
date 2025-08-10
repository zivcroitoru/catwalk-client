const catKeyMap = { hat:'hats', top:'tops', eyes:'eyes', accessory:'accessories' };

const getSprite = (category, itemId) => {
  if (!itemId) return '';

  // normalize id (strip accidental prefixes like 'hats/' etc.)
  const cleanId = String(itemId).replace(/^[a-z]+\/+/i, '');

  // 1) Fast path
  if (window.spriteByTemplate && window.spriteByTemplate[cleanId]) {
    return window.spriteByTemplate[cleanId];
  }

  // 2) Fallback: scan category list
  const catMap = window.shopItemsByCategory;
  if (!catMap) { console.warn('[preview] shopItemsByCategory not ready'); return ''; }

  const key = catMap[category] ? category : (catKeyMap[category] || category);
  const list = catMap[key];
  if (!Array.isArray(list)) { console.warn(`[preview] Missing category '${key}'`); return ''; }

  const item = list.find(i =>
    String(i.template ?? i.id ?? '') === cleanId
  );

  if (!item) {
    console.warn('[preview] Item not found', { category:key, itemId:cleanId, sample:list.slice(0,3) });
    return '';
  }

  const sprite = item.sprite_url ?? item.sprite ?? item.image_url ?? item.image ?? '';
  if (!sprite) console.warn('[preview] Item has no sprite field', { item });
  return sprite;
};
