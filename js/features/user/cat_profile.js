/*-----------------------------------------------------------------------------
  profile.js
-----------------------------------------------------------------------------*/

import { $, setDisplay } from '../../core/utils.js';
import { CHAR_LIMIT } from '../../core/constants.js';

export function showCatProfile(cat) {
  setDisplay("catProfile", true, "flex");
  setDisplay("catProfileScroll", true);

  // UI Elements
  const nameInput = $("catName");
  const descInput = $("catDesc");
  const descDisplay = $("descDisplay");
  const charCount = $("charCount");
  const descBlock = $("descBlock");

  $("profileBreed").textContent = cat.breed;
  $("profileVariant").textContent = cat.variant;
  $("profilePalette").textContent = cat.palette;
  $("profileBirthday").textContent = cat.birthday;
  $("profileAge").textContent = cat.age;
  $("profileImage").src = cat.image;

  // Set fields
  nameInput.value = cat.name;
  nameInput.disabled = true;

  descInput.value = cat.description;
  descInput.disabled = true;
  resizeTextarea(descInput);

  descDisplay.textContent = cat.description;
  charCount.textContent = `${cat.description.length} / ${CHAR_LIMIT} characters`;
  descBlock.classList.remove("editing");

  window.currentCat = cat;
}

export function setupEditMode() {
  const editBtn = $("editBtn");
  const saveBtn = $("saveBtn");
  const cancelBtn = $("cancelBtn");
  const deleteBtn = $("deleteBtn");

  const nameInput = $("catName");
  const descInput = $("catDesc");
  const descDisplay = $("descDisplay");
  const descBlock = $("descBlock");
  const charCount = $("charCount");

  if (![editBtn, saveBtn, cancelBtn, deleteBtn, nameInput, descInput, descDisplay, descBlock, charCount].every(Boolean)) {
    console.warn("⚠️ setupEditMode aborted — missing elements");
    return;
  }

  // Live typing
  descInput.addEventListener("input", () => {
    resizeTextarea(descInput);
    charCount.textContent = `${descInput.value.length} / ${CHAR_LIMIT} characters`;
  });

  // ✏️ Edit Mode
  editBtn.addEventListener("click", () => {
    nameInput.dataset.original = nameInput.value;
    descInput.dataset.original = descInput.value;

    nameInput.disabled = false;
    descInput.disabled = false;
    descBlock.classList.add("editing");

    toggleButtons({ edit: false, save: true, cancel: true });
    resizeTextarea(descInput);

    console.log("✏️ Edit mode enabled");
  });

  // 💾 Save
saveBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const desc = descInput.value.trim();

  if (desc.length > CHAR_LIMIT) {
    alert(`Description too long. Max: ${CHAR_LIMIT} characters.`);
    return;
  }

  if (window.currentCat) {
    window.currentCat.name = name;
    window.currentCat.description = desc;

    // Update carousel display name
    const card = document.querySelector(`.cat-card[data-cat-id="${window.currentCat.id}"]`);
    if (card) {
      const nameSpan = card.querySelector("span");
      if (nameSpan) nameSpan.textContent = name;
    }
  }

  nameInput.disabled = true;
  descInput.disabled = true;
  descDisplay.textContent = desc;
  descBlock.classList.remove("editing");

  toggleButtons({ edit: true, save: false, cancel: false });
  showToast("Changes saved!", "#ffcc66");

  console.log("💾 Saved changes:", { name, desc });
});


  // ↩️ Cancel
  cancelBtn.addEventListener("click", () => {
    nameInput.value = nameInput.dataset.original;
    descInput.value = descInput.dataset.original;

    nameInput.disabled = true;
    descInput.disabled = true;
    descDisplay.textContent = descInput.dataset.original;
    descBlock.classList.remove("editing");

    toggleButtons({ edit: true, save: false, cancel: false });

    console.log("↩️ Edit canceled");
  });

  // 🗑️ Delete
  deleteBtn.addEventListener("click", () => {
    console.log("🟡 Delete button clicked");

    if (!window.currentCat) {
      console.warn("⚠️ No currentCat found. Aborting delete.");
      return;
    }

    console.log(`🟠 Preparing Toastify confirm for "${window.currentCat.name}"`);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div style="font-family: 'Press Start 2P', monospace; font-size: 10px;">
        Delete "${window.currentCat.name}"?<br><br>
        <button id="confirmDelete" style="margin-right:10px;">Yes</button>
        <button id="cancelDelete">Cancel</button>
      </div>
    `;

    const toast = window.Toastify({
      node: wrapper,
      duration: -1,
      gravity: "top",
      position: "right",
      close: true,
      style: {
        background: "#d62828",
        border: "3px solid black",
        color: "white",
        padding: "12px",
        zIndex: 999999,
      },
      callback: () => {
        console.log("🔁 Toast closed");
        $("#confirmDelete")?.removeEventListener("click", handleConfirm);
        $("#cancelDelete")?.removeEventListener("click", handleCancel);
      }
    });

    toast.showToast();
    console.log("✅ Toastify confirm shown");
function handleConfirm() {
  toast.hideToast();

  const deletedIndex = window.userCats.findIndex(c => c.id === window.currentCat.id);
  if (deletedIndex === -1) return;

  // Remove cat from array
  window.userCats.splice(deletedIndex, 1);

  // Hide profile UI
  setDisplay("catProfile", false);
  setDisplay("catProfileScroll", false);

  // Rerender carousel
  window.renderCarousel();

  // Select previous cat or first cat after deletion
  let newIndex = deletedIndex - 1;
  if (newIndex < 0) newIndex = 0;

  const newCat = window.userCats[newIndex];
  if (newCat) {
    showCatProfile(newCat);

    // Update big carousel image
    const mainCatImg = document.getElementById("carouselCat");
    if (mainCatImg) {
      mainCatImg.src = newCat.image;
    }

    // Make sure profile UI is visible
    setDisplay("catProfile", true);
    setDisplay("catProfileScroll", true);
  } else {
    // No cats left - clear main image
    const mainCatImg = document.getElementById("carouselCat");
    if (mainCatImg) {
      mainCatImg.src = "../assets/cats/placeholder.png"; // fallback image
    }
  }

  showToast("Cat deleted!", "#ffcc66");
}


    function handleCancel() {
      console.log("❌ Cancel button clicked");
      toast.hideToast();
    }

    // 👇 Delay binding until Toast DOM is ready
    requestAnimationFrame(() => {
      console.log("⏳ Binding delete toast buttons...");
      const confirmBtn = document.getElementById("confirmDelete");
      const cancelBtn = document.getElementById("cancelDelete");

      if (confirmBtn && cancelBtn) {
        confirmBtn.addEventListener("click", handleConfirm);
        cancelBtn.addEventListener("click", handleCancel);
        console.log("✅ Button events bound successfully");
      } else {
        console.warn("❌ Could not find confirm or cancel buttons in Toast");
      }
    });
  });
}

// 🟨 Resize textarea to fit content
function resizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

// 🎛️ Button visibility toggle
function toggleButtons({ edit, save, cancel }) {
  $("editBtn").style.display = edit ? "inline-block" : "none";
  $("saveBtn").style.display = save ? "inline-block" : "none";
  $("cancelBtn").style.display = cancel ? "inline-block" : "none";
}

// 🟧 Pixel-style toast
function showToast(text, background) {
  window.Toastify({
    text,
    duration: 2000,
    gravity: "top",
    position: "right",
    style: {
      background,
      border: "3px solid black",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "12px",
      color: "black",
      padding: "10px",
      zIndex: 999999,
    }
  }).showToast();
}
