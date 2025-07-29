/*-----------------------------------------------------------------------------
  breedItemsRenderer.js – shows cat color options for a given breed
-----------------------------------------------------------------------------*/

export function renderBreedItems(breed) {
  const container = document.getElementById("breedItems");
  const variants = window.breedItems?.[breed] || [];

  container.innerHTML = "";
  let selectedCard = null;

  variants.forEach(({ name, sprite }) => {
    if (!sprite || sprite === "null") return; // Skip invalid entries

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

    if (typeof window.renderCarousel === "function") {
      window.renderCarousel();
    }

    Toastify({
      node: (() => {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = `
          font-family: 'Press Start 2P', monospace;
          font-size: 10px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        `;
        wrapper.innerHTML = `
          <img src="${sprite}" alt="Cat"
            style="width: 32px; height: 32px; image-rendering: pixelated; margin-bottom: 4px;" />
          <div><b>${breed} (${name})</b> added!</div>
        `;
        return wrapper;
      })(),
      duration: 1800,
      gravity: "top",
      position: "center",
      style: {
        background: "#4caf50",
        border: "2px solid black",
        padding: "8px",
        width: "180px",
        maxWidth: "80vw",
        color: "black",
        boxShadow: "4px 4px #000",
        zIndex: 999999
      }
    }).showToast();

    if (typeof window.closeAddCat === "function") {
      window.closeAddCat();
    }

    confirmBox.remove();
  };

  confirmBox.querySelector(".no-btn").onclick = () => {
    const selected = document.querySelector(".shop-card.selected");
    if (selected) selected.classList.remove("selected");

    Toastify({
      text: "❌ Cancelled",
      duration: 1500,
      gravity: "bottom",
      position: "center",
      style: { background: "#999" }
    }).showToast();

    confirmBox.remove();
  };
}
