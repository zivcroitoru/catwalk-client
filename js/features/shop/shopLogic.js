export function getItemState(itemId, category, userItems) {
  if (!userItems.ownedItems.includes(itemId)) return "buy";
  if (userItems.equippedItems[category] === itemId) return "unequip";
  return "equip";
}

export function handleShopClick(item, userItems) {
  const state = getItemState(item.id, item.category, userItems);

  if (state === "buy" && userItems.coins >= item.price) {
    userItems.ownedItems.push(item.id);
    userItems.coins -= item.price;
  } else if (state === "equip") {
    userItems.equippedItems[item.category] = item.id;
  } else if (state === "unequip") {
    delete userItems.equippedItems[item.category];
  }

  localStorage.setItem("userItems", JSON.stringify(userItems));
}
