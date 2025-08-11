import { toastCatAdded, toastCancelled, toastConfirmAddCat } from '../../core/toast.js';
import { addCatToUser } from '../../core/storage.js';
import { renderCarousel, updateInventoryCount } from '../ui/carousel.js';

export function renderBreedItems(breed) {
  console.log('🎨 Rendering breed items for:', breed);
  console.log('Available breeds:', Object.keys(window.breedItems || {}));

  const container = document.getElementById("breedItems");
  if (!container) {
    console.error('❌ breedItems container not found');
    return;
  }

  const variants = window.breedItems?.[breed] || [];
  console.log(`Found ${variants.length} variants for ${breed}:`, variants);

  container.innerHTML = "";
  let selectedCard = null;

  variants.forEach(variantData => {
    const { name, sprite_url } = variantData;
    if (!sprite_url) {
      console.warn('Missing sprite_url for variant:', variantData);
      return;
    }

    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
      <img src="${sprite_url}" class="shop-img" alt="${name}" />
      <div class="shop-btn-bar">
        <button class="shop-btn">SELECT</button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => {
      if (selectedCard) selectedCard.classList.remove("selected");
      selectedCard = card;
      card.classList.add("selected");
      showAddCatConfirmation(breed, variantData);
    });

    container.appendChild(card);
  });

  console.log(`🎨 Rendered ${variants.length} variants for ${breed}`);
}

function showAddCatConfirmation(breed, variantData) {
  const allVariants = window.breedItems?.[breed] || [];
  const matched = allVariants.find(v =>
    v.name === variantData.name && v.sprite_url === variantData.sprite_url
  );

  if (!matched) {
    console.error('❌ Variant not found in breedItems for:', variantData.name);
    return;
  }

toastConfirmAddCat(
  matched,
  () => {
    if (window.catAdded) return;
    window.catAdded = true;

    if (!matched.variant || !matched.palette) {
      window.catAdded = false;
      return;
    }

    const newCat = {
      id: crypto.randomUUID(),
      template: `${breed}-${matched.variant}-${matched.palette}`,
      name: `${breed} (${matched.name})`,
      birthdate: new Date().toISOString().split("T")[0],
      description: "",
      breed,
      variant: matched.variant,
      palette: matched.palette,
      sprite_url: matched.sprite_url,
      selected: false,
      equipment: { hat: null, top: null, eyes: null, accessories: [] }
    };
addCatToUser(newCat);
console.log("📦 Cat added to local storage");

window.userCats.push(newCat);
console.log("🐱 Cat pushed to window.userCats:", window.userCats.length, "cats total");

console.log("🔄 Calling renderCarousel()");
renderCarousel();

console.log("🔢 Updating inventory count");
updateInventoryCount();

console.log("📢 Showing toast: Cat Added");
toastCatAdded({ breed, name: matched.name, sprite_url: matched.sprite_url });

console.log("❌ Closing Add Cat popup");
window.closeAddCat?.();

setTimeout(() => {
  window.catAdded = false;
  console.log("⏱️ Reset catAdded flag");
}, 300);

  },
  () => {
    document.querySelector(".shop-card.selected")?.classList.remove("selected");
    toastCancelled();
  }
);
}

