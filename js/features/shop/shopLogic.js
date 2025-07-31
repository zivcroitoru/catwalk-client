/*-----------------------------------------------------------------------------
  shopLogic.js – DB version, no localStorage
-----------------------------------------------------------------------------*/
import { updateCatPreview } from '../catPreviewRenderer.js';
import { loadplayer_items, unlockplayer_items, updateCat } from '../../core/storage.js';

const previewKeyMap = {
  hats: 'hat',
  tops: 'top',
  accessories: 'accessories',
  eyes: 'eyes'
};

export function getItemState(id, category, player_items) {
  const owned       = player_items.ownedItems?.includes(id);
  const equipped    = window.selectedCat?.equipment?.[category];
  if (!owned)            return 'buy';
  if (equipped === id)   return 'unequip';
  return 'equip';
}

export async function handleShopClick(item, player_items) {
  const state      = getItemState(item.id, item.category, player_items);
  const previewKey = previewKeyMap[item.category];
  console.log(`🛍️ handleShopClick | ${state} | ${item.id}`);

  // ───── buy ─────
  if (state === 'buy') {
    if (player_items.coins < item.price) return 'not_enough';

    // ✅ Unlock via proper server call
    await unlockplayer_items(item.template);

    // ✅ Prevent push on undefined
    if (!Array.isArray(player_items.ownedItems)) {
      player_items.ownedItems = [];
    }

    player_items.ownedItems.push(String(item.id));
    player_items.coins -= item.price;
    return 'bought';
  }

  // ───── equip / unequip ─────
  // Initialize standard equipment structure if needed
  if (!window.selectedCat.equipment) {
    window.selectedCat.equipment = { hat: null, top: null, eyes: null, accessories: [] };
  }

  if (state === 'equip') {
    player_items.equippedItems[item.category] = item.id;
    if (previewKey === 'accessories') {
      window.selectedCat.equipment.accessories = [item.template];
    } else {
      window.selectedCat.equipment[previewKey] = item.template;
    }
  }

  if (state === 'unequip') {
    delete player_items.equippedItems[item.category];
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

// 🔁 persist equipment to DB (only cat, not player_items anymore)
async function syncCatEquipment() {
  // Ensure equipment has standard structure before saving
  const equipment = {
    hat: window.selectedCat.equipment?.hat || null,
    top: window.selectedCat.equipment?.top || null,
    eyes: window.selectedCat.equipment?.eyes || null,
    accessories: window.selectedCat.equipment?.accessories || []
  };

  await updateCat(window.selectedCat.id, { equipment });

  const idx = window.userCats.findIndex(
    (c) => c.id === window.selectedCat.id
  );
  if (idx !== -1) {
    window.userCats[idx].equipment = structuredClone(window.selectedCat.equipment);
  }

  console.log('💾 Equipment synced to DB & cache');
}
