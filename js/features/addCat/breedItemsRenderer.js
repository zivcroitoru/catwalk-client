import { toastCatAdded, toastCancelled } from '../../core/toast.js';
import { addCatToUser } from '../../core/storage.js';

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

    console.log('Rendering breed item:', { name, sprite_url });

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

  const { name, variant, palette, sprite_url } = variantData;
  const template = `${breed}-${variant}-${palette}`;

  // Create and append confirmation box
  const confirmBox = document.createElement("div");
  confirmBox.className = "confirm-toast";
  confirmBox.innerHTML = `
    <div style="text-align: center; font-family: 'Press Start 2P', monospace;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">ADD</div>
      <div class="cat-preview">
        <img src="${sprite_url}" alt="Cat" 
          style="width: 64px; height: 64px; transform: scale(1.5); transform-origin: center;
                 image-rendering: pixelated; margin-top: -20px; margin-bottom: 6px;"
          onerror="console.warn('Failed to load preview:', '${sprite_url}'); this.style.display='none';" />
      </div>
      <div style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">${breed} (${name})</div>
      <div style="font-size: 10px; margin-bottom: 12px;">to your cats?</div>
      <div class="confirm-buttons">
        <button class="yes-btn">Yes</button>
        <button class="no-btn">No</button>
      </div>
    </div>
  `;

  document.body.appendChild(confirmBox);

  confirmBox.querySelector(".yes-btn").onclick = () => {
    if (window.catAdded) return;
    window.catAdded = true;

    const newCat = {
      // Core fields matching server structure
      id: crypto.randomUUID(), // Temporary until server assigns real ID
      template: `${breed}-${variant}-${palette}`,
      name: `${breed} (${name})`,
      birthdate: new Date().toISOString().split("T")[0],
      description: "",

      // Template properties
      breed,
      variant, 
      palette,
      sprite_url: sprite,

      // Client-side UI state
      selected: false,
      equipment: {
        hat: null,
        top: null,
        eyes: null,
        accessories: []
      }
    };

    addCatToUser(newCat);
    window.userCats.push(newCat);

    console.log("🐱 Cat added:", newCat);
    console.log(`📦 Total cats: ${window.userCats?.length}`);

    updateUIAfterCatAddition(window.userCats.length);
    toastCatAdded({ breed, name, sprite });
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

function updateUIAfterCatAddition(catCount) {
  window.renderCarousel?.();
  updateInventoryCount(catCount);
}

function updateInventoryCount(count) {
  const inventoryCount = document.getElementById("inventoryCount");
  if (inventoryCount) {
    inventoryCount.textContent = `Inventory: ${count}/25`;
  }
}
