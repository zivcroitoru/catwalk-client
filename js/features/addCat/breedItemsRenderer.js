import { toastCatAdded, toastCancelled } from '../../core/toast.js';

export function renderBreedItems(breed) {
  const container = document.getElementById("breedItems");
  const variants = window.breedItems?.[breed] || [];

  container.innerHTML = "";
  let selectedCard = null;

  variants.forEach(({ name, sprite }) => {
    if (!sprite || sprite === "null") return;

    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
      <img src="${sprite}" class="shop-img" alt="${name}" />
      <div class="shop-btn-bar">
        <button class="shop-btn">SELECT</button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => {
      if (selectedCard) selectedCard.classList.remove("selected");
      selectedCard = card;
      card.classList.add("selected");

      showAddCatConfirmation(breed, name, sprite);
    });

    container.appendChild(card);
  });

  console.log(`🎨 Rendered ${variants.length} variants for ${breed}`);
}

function showAddCatConfirmation(breed, name, sprite) {
  const confirmBox = document.createElement("div");
  confirmBox.className = "confirm-toast";
  confirmBox.innerHTML = `
    <div style="text-align: center; font-family: 'Press Start 2P', monospace;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">ADD</div>
      <img src="${sprite}" alt="Cat"
        style="width: 64px; height: 64px; transform: scale(1.5); transform-origin: center;
               image-rendering: pixelated; margin-top: -20px; margin-bottom: 6px;" />
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
    const cats = JSON.parse(localStorage.getItem("usercats") || "[]");
    const newCat = {
      id: Date.now(),
      name: `${breed} (${name})`,
      breed,
      image: sprite,
      equipment: {},
    };

    cats.push(newCat);
    localStorage.setItem("usercats", JSON.stringify(cats));
    window.userCats = cats;

    window.renderCarousel?.();
    toastCatAdded({ breed, name, sprite });
    window.closeAddCat?.();
    confirmBox.remove();
  };

  confirmBox.querySelector(".no-btn").onclick = () => {
    document.querySelector(".shop-card.selected")?.classList.remove("selected");
    toastCancelled();
    confirmBox.remove();
  };
}
