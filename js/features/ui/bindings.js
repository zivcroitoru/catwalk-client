// /features/ui/bindings.js

import { toggleShop, closeShop } from '../shop/shop.js';
import { renderShopItems } from '../shop/shopItemsRenderer.js';
import { closeAddCat } from '../addCat/addCat.js'; // adjust path if needed
import { getLoggedInUserInfo } from '../../core/utils.js';

/**
 * Binds the shop close button
 */
export function bindShopBtn(bindButton) {
  // ✅ Now actually closes the shop
  bindButton("shopCloseBtn", closeShop, "🧼 Close Shop clicked");
}
export function bindAddCatBtn(bindButton) {
  bindButton("addCatCloseBtn", closeAddCat, "🚪 Close Add Cat clicked");
}

/**
 * Binds the customize button
 */
export function bindCustomizeBtn(bindButton) {
  bindButton("customizeBtn", () => {
    const cat = window.selectedCat;
    const catName = cat?.name || "Unknown";
    console.log(`🎨 Force-opening shop for cat: ${catName}`);

    // Make sure the selected cat is updated visually
    const card = document.querySelector(`.cat-card[data-cat-id="${cat?.id}"]`);
if (card) {
  const allCards = document.querySelectorAll('.cat-card');
  allCards.forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
}

    toggleShop(); // 👈 cleaner way to open the shop
  });
}

export function bindFashionBtn(bindButton) {
  bindButton("fashionBtn", () => {
    const cat = window.selectedCat;
    if (!cat || !cat.id) {
      console.warn("❌ No selected cat to enter fashion show");
      return;
    }
    console.log(`🎭 Entering Fashion Show with cat ID ${cat.id}`);

    // Get player info and log the player ID
    const playerInfo = getLoggedInUserInfo();
    console.log(`🎭🎭 Entering Fashion Show with user ID ${playerInfo.userId}`);
    
    debugger;
    
    // This line hands over both the selected cat ID and player ID to fashion-show.js:
    // - catId is passed via URL parameter and will be read by fashion-show.js
    // - playerId is available to fashion-show.js via getLoggedInUserInfo() function
    window.location.href = `fashion-show.html?catId=${cat.id}`;
    
    // Alternative approach: Pass both IDs in URL (optional)
    // window.location.href = `fashion-show.html?catId=${cat.id}&playerId=${playerInfo.userId}`;
  });
}
// /**
//  * Binds the fashion show button
//  */
// export function bindFashionBtn(bindButton) {
//   bindButton("fashionBtn", () => {
//     const cat = window.selectedCat;
//     if (!cat || !cat.id) {
//       console.warn("❌ No selected cat to enter fashion show");
//       return;
//     }
//     console.log(`🎭 Entering Fashion Show with cat ID ${cat.id}`);

//     // Get player info and log the player ID
//     const playerInfo = getLoggedInUserInfo();
//     console.log(`🎭🎭 Entering Fashion Show with user ID ${playerInfo.userId}`);
    
//     debugger;
//     window.location.href = `fashion-show.html?catId=${cat.id}`; 
//     // TODO: I need this line (or function) to hand over to fashion-show.js the id of our selcted cat and the id of our player 
//   });
// }
