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
  
  if (!variantData || !variantData.sprite_url) {
    console.error('Missing sprite data for confirmation dialog');
    return;
  }

  const { name, variant, palette, sprite_url } = variantData;

  // Create and append confirmation box
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
    font-size: 14px;
  ">
    <div style="font-size: 16px; font-weight: bold; color: #222;">Add This Cat?</div>

<img src="${sprite_url}" alt="Cat"
  style="
    width: 64px;
    height: 64px;
    transform: scale(2);
    transform-origin: center;
    image-rendering: pixelated;
    margin-top: -30px;
    margin-bottom: 4px;
  "
  onerror="console.warn('Failed to load preview:', '${sprite_url}'); this.style.display='none';" />


<div style="font-size: 13px; color: #333; margin-top: 12px;">
  <b>${breed} (${name})</b>
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
      sprite_url,

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
