import { toastCatAdded, toastCancelled} from '../../core/toast.js';
import { toPascalCase } from '../../core/utils.js';
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
  console.log('🎭 Showing confirmation for:', { breed, variantData });

  const allVariants = window.breedItems?.[breed] || [];
  const matchedVariant = allVariants.find(v =>
    v.name === variantData.name && v.sprite_url === variantData.sprite_url
  );

  if (!matchedVariant) {
    console.error('❌ Variant not found in breedItems for:', variantData.name);
    return;
  }

  const { name, variant, palette, sprite_url } = matchedVariant;

  const confirmBox = document.createElement("div");
  confirmBox.className = "confirm-toast";
  confirmBox.innerHTML = `
    <div style="
      font-family: 'Press Start 2P', monospace;
      text-align: center;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 31px;
      font-size: 14px;">
      
      <div style="font-size: 16px; font-weight: bold; color: #222;">Add This Cat?</div>

      <img src="${sprite_url}" alt="Cat" style="
        width: 64px;
        height: 64px;
        transform: scale(2);
        transform-origin: center;
        image-rendering: pixelated;
        margin-top: -30px;
        margin-bottom: 4px;"
        onerror="console.warn('Failed to load preview:', '${sprite_url}'); this.style.display='none';" />

      <div style="font-size: 13px; color: #333; margin-top: 12px;">
        <b>${toPascalCase(variant)} (${toPascalCase(palette)})</b>
      </div>

      <div style="font-size: 12px; margin-top: -4px;">Add to your collection?</div>

      <div class="confirm-buttons" style="display: flex; gap: 24px; margin-top: 16px;">
        <button class="yes-btn" style="padding: 6px 14px;">✅ Yes</button>
        <button class="no-btn" style="padding: 6px 14px;">❌ No</button>
      </div>
    </div>
  `;

  document.body.appendChild(confirmBox);

  confirmBox.querySelector(".yes-btn").onclick = () => {
    if (window.catAdded) return;
    window.catAdded = true;

    const newCat = {
      id: crypto.randomUUID(),
      template: `${breed}-${variant}-${palette}`,
      name: `${breed} (${name})`,
      birthdate: new Date().toISOString().split("T")[0],
      description: "",
      breed,
      variant,
      palette,
      sprite_url,
      selected: false,
      equipment: { hat: null, top: null, eyes: null, accessories: null }
    };

    addCatToUser(newCat);
    window.userCats.push(newCat);

    console.log("🐱 Cat added:", newCat);
    console.log(`📦 Total cats: ${window.userCats?.length}`);

    renderCarousel();
    updateInventoryCount();
    toastCatAdded({ breed, name, sprite_url });
    window.closeAddCat?.();
    confirmBox.remove();
    setTimeout(() => (window.catAdded = false), 300);
  };

  confirmBox.querySelector(".no-btn").onclick = () => {
    document.querySelector(".shop-card.selected")?.classList.remove("selected");
    toastCancelled();
    confirmBox.remove();
  };
}
