// /features/ui/coinUpdater.js
export function updateCoinCount() {
  const userItems = JSON.parse(localStorage.getItem("userItems"));
  if (!userItems) return console.warn("❌ No userItems in storage");

  const coinEl = document.querySelector(".coin-count");
  if (coinEl) {
    coinEl.textContent = userItems.coins;
    console.log(`🪙 Coin count updated to ${userItems.coins}`);
  } else {
    console.warn("❌ .coin-count element not found");
  }
}
