import { updateCatPreview } from '../catPreviewRenderer.js';

const previewKeyMap = {
  hats: "hat",
  tops: "top",
  accessories: "accessories",
  eyes: "eyes"
};

export function getItemState(itemId, category, userItems) {
  const owned = userItems.ownedItems.map(String);
  const id = String(itemId);

  return !owned.includes(id)
    ? "buy"
    : userItems.equippedItems[category] === itemId
    ? "unequip"
    : "equip";
}

export function handleShopClick(item, userItems) {
  const state = getItemState(item.id, item.category, userItems);
  const previewKey = previewKeyMap[item.category];
  console.log(`🛍️ handleShopClick | State: ${state}, Category: ${item.category}, ID: ${item.id}, Template: ${item.template}`);

  if (state === "buy") {
    if (userItems.coins >= item.price) {
      userItems.ownedItems.push(String(item.id));
      userItems.coins -= item.price;
      console.log(`💰 Bought item: ${item.id}, new coin balance: ${userItems.coins}`);
      return "bought";
    } else {
      console.warn("❌ Not enough coins.");
      return "not_enough";
    }
  }

  if (state === "equip") {
    userItems.equippedItems[item.category] = item.id;
    console.log(`🎽 Equipped item: ${item.id} in category ${item.category}`);

    if (!window.selectedCat.equipment) {
      window.selectedCat.equipment = {};
    }

    if (previewKey === "accessories") {
      window.selectedCat.equipment.accessories = [item.template];
    } else {
      window.selectedCat.equipment[previewKey] = item.template;
    }

    console.log("🐱 Updated selectedCat.equipment:", JSON.stringify(window.selectedCat.equipment, null, 2));
    updateCatPreview(window.selectedCat); // podium
    const thumb = document.querySelector(
      `.cat-card[data-cat-id="${window.selectedCat.id}"] .cat-thumbnail`
    );
    if (thumb) updateCatPreview(window.selectedCat, thumb); // thumbnail
    return "equipped";
  }

  if (state === "unequip") {
    delete userItems.equippedItems[item.category];
    console.log(`🚫 Unequipped category: ${item.category}`);

    if (window.selectedCat.equipment) {
      if (previewKey === "accessories") {
        window.selectedCat.equipment.accessories = [];
      } else {
        delete window.selectedCat.equipment[previewKey];
      }
    }

    console.log("🐱 After unequip, selectedCat.equipment:", JSON.stringify(window.selectedCat.equipment, null, 2));
    updateCatPreview(window.selectedCat); // podium
    const thumb = document.querySelector(
      `.cat-card[data-cat-id="${window.selectedCat.id}"] .cat-thumbnail`
    );
    if (thumb) updateCatPreview(window.selectedCat, thumb); // thumbnail
    return "unequipped";
  }

  return "noop";
}
