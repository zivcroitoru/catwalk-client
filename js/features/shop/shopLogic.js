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

  if (state === "buy") {
    if (userItems.coins >= item.price) {
      userItems.ownedItems.push(String(item.id));
      userItems.coins -= item.price;
      return "bought";
    } else {
      return "not_enough";
    }
  }

  if (state === "equip") {
    userItems.equippedItems[item.category] = item.id;
    return "equipped";
  }

  if (state === "unequip") {
    delete userItems.equippedItems[item.category];
    return "unequipped";
  }

  return "noop";
}
