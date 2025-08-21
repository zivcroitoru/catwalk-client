import { toastCatAdded, toastCancelled, toastConfirmAddCat } from '../../core/toast.js';
import { addCatToUser, getPlayerCats } from '../../core/storage.js';
import { renderCarousel, updateInventoryCount } from '../ui/carousel.js';
import { toPascalCase } from "../../core/utils.js";

export function renderBreedItems(breed) {
  const container = document.getElementById("breedItems");
  if (!container) return;

  const variants = window.breedItems?.[breed] || [];
  container.innerHTML = "";
  let selectedCard = null;

  variants.forEach(variantData => {
    const { name, sprite_url } = variantData;
    if (!sprite_url) return;

    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
      <img src="${sprite_url}" class="shop-img" alt="${name}" />
      <div class="shop-btn-bar">
        <button class="shop-btn">${toPascalCase(variantData.variant)} (${toPascalCase(variantData.palette)})</button>
      </div>
    `;

    card.addEventListener("click", () => {
      if (selectedCard) selectedCard.classList.remove("selected");
      selectedCard = card;
      card.classList.add("selected");
      showAddCatConfirmation(breed, variantData);
    });

    container.appendChild(card);
  });
}

async function showAddCatConfirmation(breed, variantData) {
  const allVariants = window.breedItems?.[breed] || [];
  const matched = allVariants.find(v =>
    v.name === variantData.name && v.sprite_url === variantData.sprite_url
  );

  if (!matched) return;

  toastConfirmAddCat(
    matched,
    async () => {
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
        equipment: { hat: null, top: null, eyes: null, accessories: null },
      };

      // 1) Create on server
      const created = await addCatToUser(newCat);

      // 2) Refresh cache from server
      window.userCats = await getPlayerCats();

      // 3) Select the created cat
      const selectId =
        (created && created.id) ||
        window.userCats.at(-1)?.id ||
        null;

      await renderCarousel(selectId);

      toastCatAdded({ breed, name: matched.name, sprite_url: matched.sprite_url });
      window.closeAddCat?.();

      setTimeout(() => {
        window.catAdded = false;
      }, 300);
    },
    () => {
      document.querySelector(".shop-card.selected")?.classList.remove("selected");
      toastCancelled();
    }
  );
}
