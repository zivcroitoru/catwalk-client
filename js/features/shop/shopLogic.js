const previewKeyMap = {
  hats: 'hat',
  tops: 'top',
  accessories: 'accessories',
  eyes: 'eyes'
};

export function getItemState(id, category, playerItems) {
  const equippedKey = previewKeyMap[category];

  // Use template everywhere for consistency
  const owned    = playerItems.ownedItems?.includes(window.shopTemplateById?.[id] ?? id)
                || playerItems.ownedItems?.includes(window.lastItemTemplate ?? id); // fallback if you already have the template
  const equipped = window.selectedCat?.equipment?.[equippedKey];

  // If you have direct access to `item.template`, prefer:
  // const owned = playerItems.ownedItems?.includes(item.template);
  // const equipped = window.selectedCat?.equipment?.[equippedKey];

  if (!owned)            return 'buy';
  if (equipped === (window.shopTemplateById?.[id] ?? id)) return 'unequip';
  return 'equip';
}

export async function handleShopClick(item, playerItems) {
  const state      = getItemState(item.id, item.category, playerItems);
  const previewKey = previewKeyMap[item.category];
  console.log(`🛍️ handleShopClick | ${state} | ${item.id}`);

  if (state === 'buy') {
    if (playerItems.coins < item.price) return 'not_enough';

    // Unlock by template
    await unlockPlayerItem(item.template);

    if (!Array.isArray(playerItems.ownedItems)) playerItems.ownedItems = [];
    const updated = await loadPlayerItems(true);
    playerItems.ownedItems = updated.ownedItems; // should be templates
    playerItems.coins      = updated.coins;
    return 'bought';
  }

  // Ensure objects exist
  window.selectedCat.equipment ??= { hat:null, top:null, eyes:null, accessories:null };
  playerItems.equippedItems   ??= {};

  // Equip → store template (single string for all slots, including accessories)
  if (state === 'equip') {
    playerItems.equippedItems[item.category] = item.template;   // keep templates
    window.selectedCat.equipment[previewKey] = item.template;   // single string
  }

  // Unequip
  if (state === 'unequip') {
    delete playerItems.equippedItems[item.category];
    window.selectedCat.equipment[previewKey] = null;
  }

  // Persist (arrays would be dropped anyway by cleanEquipment)
  await updateCatItems(window.selectedCat.id, cleanEquipment(window.selectedCat.equipment));

  updateCatPreview(window.selectedCat);

  const thumb = document.querySelector(
    `.cat-card[data-cat-id="${window.selectedCat.id}"] .cat-thumbnail`
  );
  if (thumb) updateCatPreview(window.selectedCat, thumb);

  return state === 'equip' ? 'equipped' : 'unequipped';
}

// Keep only string fields (matches our single-string schema)
function cleanEquipment(raw) {
  const cleaned = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'string' && v.trim() !== '') cleaned[k] = v;
  }
  return cleaned;
}
