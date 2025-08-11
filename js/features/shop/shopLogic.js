/*-----------------------------------------------------------------------------
  shopLogic.js – DB version, no localStorage
-----------------------------------------------------------------------------*/
import { updateCatPreview } from '../catPreviewRenderer.js';
import { loadPlayerItems, unlockPlayerItem, updateCatItems } from '../../core/storage.js';

const previewKeyMap = {
  hats: 'hat',
  tops: 'top',
  accessories: 'accessories',
  eyes: 'eyes'
};

export function getItemState(id, category, playerItems) {
  const equippedKey = previewKeyMap[category];
  const owned       = playerItems.ownedItems?.includes(id);
  const equipped    = window.selectedCat?.equipment?.[equippedKey];
  if (!owned)            return 'buy';
  if (equipped === id)   return 'unequip';
  return 'equip';
}

export async function handleShopClick(item, playerItems) {
  const state      = getItemState(item.id, item.category, playerItems);
  const previewKey = previewKeyMap[item.category];
  console.log(`🛍️ handleShopClick | ${state} | ${item.id}`);

  // ───── buy ─────
  if (state === 'buy') {
    if (playerItems.coins < item.price) return 'not_enough';

    await unlockPlayerItem(item.template);

    if (!Array.isArray(playerItems.ownedItems)) {
      playerItems.ownedItems = [];
    }

    const updated = await loadPlayerItems(true);
    playerItems.ownedItems = updated.ownedItems;
    playerItems.coins = updated.coins;

    return 'bought';
  }

  // ───── equip / unequip ─────
  if (!window.selectedCat.equipment) {
    console.warn('⚠️ selectedCat.equipment was undefined. Initializing...');
    window.selectedCat.equipment = {
      hat: null,
      top: null,
      eyes: null,
      accessories: null
    };
  }

  if (!playerItems.equippedItems) {
    console.warn('⚠️ equippedItems was undefined. Initializing...');
    playerItems.equippedItems = {};
  }

  // Equip
  if (state === 'equip') {
    playerItems.equippedItems[item.category] = item.id;

    if (previewKey === 'accessories') {
      window.selectedCat.equipment.accessories = [item.template];
    } else {
      window.selectedCat.equipment[previewKey] = item.template;
    }
  }

  // Unequip
  if (state === 'unequip') {
    delete playerItems.equippedItems[item.category];

    if (previewKey === 'accessories') {
      window.selectedCat.equipment.accessories = [];
    } else {
      window.selectedCat.equipment[previewKey] = null;
    }
  }

  // Send cleaned equipment to server
  await updateCatItems(
    window.selectedCat.id,
    cleanEquipment(window.selectedCat.equipment)
  );

  updateCatPreview(window.selectedCat);

  const thumb = document.querySelector(
    `.cat-card[data-cat-id="${window.selectedCat.id}"] .cat-thumbnail`
  );
  if (thumb) updateCatPreview(window.selectedCat, thumb);

  return state === 'equip' ? 'equipped' : 'unequipped';
}

// ───────────── Helper: Filter invalid entries ─────────────
function cleanEquipment(raw) {
  const cleaned = {};

  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'string' && value.trim() !== '') {
      cleaned[key] = value;
    }
  }

  return cleaned;
}
