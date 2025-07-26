const DEFAULT_USER_ITEMS = {
  coins: 500,
  ownedItems: [],
  equippedItems: {
    hat: null,
    shoes: null,
    shirt: null,
    pants: null,
    accessories: null
  }
};

export function loadUserItems() {
  const data = localStorage.getItem("userItems");
  return data ? JSON.parse(data) : structuredClone(DEFAULT_USER_ITEMS);
}

export function saveUserItems(userItems) {
  localStorage.setItem("userItems", JSON.stringify(userItems));
}
