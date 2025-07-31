/*-----------------------------------------------------------------------------
  shopLogic.js – DB version, no localStorage
-----------------------------------------------------------------------------*/
import { updateCatPreview } from '../catPreviewRenderer.js';
import { loadPlayerItems, unlockPlayerItem } from '../../core/storage.js';
import { updateCat } from '../../core/api.js';       // ← server PATCH helper

const previewKeyMap = {
  hats: 'hat',
  tops: 'top',
  accessories: 'accessories',
  eyes: 'eyes'
};

export function getItemState(id, category, playerItems) {
  const owned       = playerItems.ownedItems?.includes(id);
  const equipped    = window.selectedCat?.equipment?.[category];
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

    // ✅ Unlock via proper server call
    await unlockPlayerItem(item.template);

    playerItems.ownedItems.push(String(item.id));
    playerItems.coins -= item.price;
    return 'bought';
  }

  // ───── equip / unequip ─────
  if (!window.selectedCat.equipment) window.selectedCat.equipment = {};

  if (state === 'equip') {
    playerItems.equippedItems[item.category] = item.id;
    if (previewKey === 'accessories') {
      window.selectedCat.equipment.accessories = [item.template];
    } else {
      window.selectedCat.equipment[previewKey] = item.template;
    }
  }

  if (state === 'unequip') {
    delete playerItems.equippedItems[item.category];
    if (previewKey === 'accessories') {
      window.selectedCat.equipment.accessories = [];
    } else {
      delete window.selectedCat.equipment[previewKey];
    }
  }

  await syncCatEquipment();                         // 💾 persist changes
  updateCatPreview(window.selectedCat);             // 🎨 podium
  const thumb = document.querySelector(
    `.cat-card[data-cat-id="${window.selectedCat.id}"] .cat-thumbnail`
  );
  if (thumb) updateCatPreview(window.selectedCat, thumb); // 🎨 thumbnail

  return state === 'equip' ? 'equipped' : 'unequipped';
}

// 🔁 persist equipment to DB (only cat, not playerItems anymore)
async function syncCatEquipment() {
  await updateCat(window.selectedCat.id, {
    equipment: window.selectedCat.equipment
  });

  const idx = window.userCats.findIndex(
    (c) => c.id === window.selectedCat.id
  );
  if (idx !== -1) {
    window.userCats[idx].equipment = structuredClone(window.selectedCat.equipment);
  }

  console.log('💾 Equipment synced to DB & cache');
}
