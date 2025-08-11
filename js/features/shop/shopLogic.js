// shopLogic.js
import { updateCatItems, loadPlayerItems, unlockPlayerItem } from '../../core/storage.js';
import { updateCatPreview } from '../catPreviewRenderer.js';

const previewKeyMap = {
  hats: 'hat',
  tops: 'top',
  accessories: 'accessories',
  eyes: 'eyes'
};

/**
 * Determine if an item is owned, equipped, or needs to be bought.
 */
export function getItemState(id, category, playerItems) {
  const equippedKey = previewKeyMap[category];
  const templateId  = window.shopTemplateById?.[id] ?? id; // map ID to template if available

  const owned    = playerItems.ownedItems?.includes(templateId);
  const equipped = window.selectedCat?.equipment?.[equippedKey];

  if (!owned) return 'buy';
  if (equipped === templateId) return 'unequip';
  return 'equip';
}

/**
 * Handles buying, equipping, and unequipping shop items.
 */
export async function handleShopClick(item, playerItems) {
  const state      = getItemState(item.id, item.category, playerItems);
  const previewKey = previewKeyMap[item.category];
  const templateId = item.template;

  console.log(`🛍️ handleShopClick | ${state} | ${item.id}`);

  // ── Buy ──
  if (state === 'buy') {
    if (playerItems.coins < item.price) return 'not_enough';

    await unlockPlayerItem(templateId);

    if (!Array.isArray(playerItems.ownedItems)) playerItems.ownedItems = [];
    const updated = await loadPlayerItems(true);
    playerItems.ownedItems = updated.ownedItems;
    playerItems.coins      = updated.coins;

    return 'bought';
  }

  // Ensure structures exist
  window.selectedCat.equipment ??= { hat: null, top: null, eyes: null, accessories: null };
  playerItems.equippedItems    ??= {};

  // ── Equip ──
  if (state === 'equip') {
    playerItems.equippedItems[item.category] = templateId;
    window.selectedCat.equipment[previewKey] = templateId;
  }

  // ── Unequip ──
  if (state === 'unequip') {
    delete playerItems.equippedItems[item.category];
    window.selectedCat.equipment[previewKey] = null;
  }

  // Save to server
  await updateCatItems(window.selectedCat.id, cleanEquipment(window.selectedCat.equipment));

  // Refresh previews
  updateCatPreview(window.selectedCat);
  const thumb = document.querySelector(
    `.cat-card[data-cat-id="${window.selectedCat.id}"] .cat-thumbnail`
  );
  if (thumb) updateCatPreview(window.selectedCat, thumb);

  return state === 'equip' ? 'equipped' : 'unequipped';
}

/**
 * Remove empty or invalid equipment fields.
 */
function cleanEquipment(raw) {
  const cleaned = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'string' && v.trim() !== '') cleaned[k] = v;
  }
  return cleaned;
}
