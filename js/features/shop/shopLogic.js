/*-----------------------------------------------------------------------------
  shopLogic.js – DB version, no localStorage
-----------------------------------------------------------------------------*/
import { updateCatPreview } from '../catPreviewRenderer.js';
import { loadUserItems, saveUserItems } from '../../core/storage.js';
import { updateCat } from '../../core/api.js';       // ← server PATCH helper

const previewKeyMap = {
  hats: 'hat',
  tops: 'top',
  accessories: 'accessories',
  eyes: 'eyes'
};

export function getItemState(id, category, userItems) {
  const owned       = userItems.ownedItems?.includes(id);
  const equipped    = window.selectedCat?.equipment?.[category];
  if (!owned)            return 'buy';
  if (equipped === id)   return 'unequip';
  return 'equip';
}

export async function handleShopClick(item, userItems) {
  const state      = getItemState(item.id, item.category, userItems);
  const previewKey = previewKeyMap[item.category];
  console.log(`🛍️ handleShopClick | ${state} | ${item.id}`);

  // ───── buy ─────
  if (state === 'buy') {
    if (userItems.coins < item.price) return 'not_enough';
    userItems.ownedItems.push(String(item.id));
    userItems.coins -= item.price;
    return 'bought';
  }

  // ───── equip / unequip ─────
  if (!window.selectedCat.equipment) window.selectedCat.equipment = {};

  if (state === 'equip') {
    userItems.equippedItems[item.category] = item.id;
    if (previewKey === 'accessories')
      window.selectedCat.equipment.accessories = [item.template];
    else
      window.selectedCat.equipment[previewKey] = item.template;
  }

  if (state === 'unequip') {
    delete userItems.equippedItems[item.category];
    if (previewKey === 'accessories')
      window.selectedCat.equipment.accessories = [];
    else
      delete window.selectedCat.equipment[previewKey];
  }

  await syncCatEquipment();     // persist changes
  updateCatPreview(window.selectedCat);        // podium
  const thumb = document.querySelector(
    `.cat-card[data-cat-id="${window.selectedCat.id}"] .cat-thumbnail`
  );
  if (thumb) updateCatPreview(window.selectedCat, thumb); // thumbnail

  return state === 'equip' ? 'equipped' : 'unequipped';
}

// 🔁 persist equipment to DB and userItems
async function syncCatEquipment() {
  // 1️⃣ update selected cat on server
  await updateCat(window.selectedCat.id, { equipment: window.selectedCat.equipment });

  // 2️⃣ update cached userItems in DB
  const userItems = await loadUserItems();
  const idx = window.userCats.findIndex(c => c.id === window.selectedCat.id);
  if (idx !== -1) window.userCats[idx].equipment = structuredClone(window.selectedCat.equipment);
  userItems.userCats = window.userCats;
  await saveUserItems({ userCats: userItems.userCats });

  console.log('💾 Equipment synced to DB & cache');
}
