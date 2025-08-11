import { toastCatAdded, toastCancelled, toastConfirmAddCat } from '../../core/toast.js';
import { addCatToUser } from '../../core/storage.js';
import { renderCarousel, updateInventoryCount } from '../ui/carousel.js';

export function renderBreedItems(breed) {
  const container = document.getElementById("breedItems");
  if (!container) {
    console.error('❌ breedItems container not found');
    return;
  }

  const variants = window.breedItems?.[breed] || [];
  container.innerHTML = "";

  let selectedCard = null;

  variants.forEach(variantData => {
    const { name, sprite_url } = variantData;
    if (!sprite_url) {
      console.warn('Missing sprite_url for:', variantData);
      return;
    }

    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
      <img src="${sprite_url}" class="shop-img" alt="${name}" />
      <div class="shop-btn-bar"><button class="shop-btn">SELECT</button></div>
    `;

    card.querySelector("button").addEventListener("click", () => {
      if (selectedCard) selectedCard.classList.remove("selected");
      selectedCard = card;
      card.classList.add("selected");
      showAddCatConfirmation(breed, variantData);
    });

    container.appendChild(card);
  });
}

function showAddCatConfirmation(breed, variantData) {
  const matchedVariant = (window.breedItems?.[breed] || []).find(v =>
    v.name === variantData.name && v.sprite_url === variantData.sprite_url
  );

  if (!matchedVariant) {
    console.error('❌ Variant not found in breedItems for:', variantData.name);
    return;
  }

  const { name, variant, palette, sprite_url } = matchedVariant;

  toastConfirmAddCat(
    { name, variant, palette, sprite_url },
    // ✅ Yes handler
    async () => {
      if (window.catAdded) return;
      window.catAdded = true;

      const newCat = {
        id: crypto.randomUUID(),
        template: `${breed}-${variant}-${palette}`,
        name: `${breed} (${name})`,
        birthdate: new Date().toISOString().split("T")[0],
        description: "",
        breed, variant, palette, sprite_url,
        selected: false,
        equipment: { hat: null, top: null, eyes: null, accessories: null }
      };

      await addCatToUser(newCat);
      window.userCats.push(newCat);

      renderCarousel();
      updateInventoryCount();
      toastCatAdded({ breed, name, sprite_url });
      window.closeAddCat?.();
      setTimeout(() => (window.catAdded = false), 300);
    },
    // ❌ No handler
    () => {
      document.querySelector(".shop-card.selected")?.classList.remove("selected");
      toastCancelled();
    }
  );
}
