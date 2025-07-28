/*-----------------------------------------------------------------------------
  profile.js
-----------------------------------------------------------------------------*/

import { $, setDisplay } from '../../core/utils.js';
import { CHAR_LIMIT } from '../../core/constants.js';

export function showCatProfile(cat) {
  setDisplay("catProfile", true, "flex");
  setDisplay("catProfileScroll", true);

  const nameInput = $("catName");
  const descInput = $("catDesc");
  const charCount = $("charCount");
  const descBlock = $("descBlock");

  $("profileBreed").textContent = cat.breed;
  $("profileVariant").textContent = cat.variant;
  $("profilePalette").textContent = cat.palette;
  $("profileBirthday").textContent = cat.birthday;
  $("profileAge").textContent = cat.age;
  $("profileImage").src = cat.image;

  nameInput.value = cat.name;
  nameInput.disabled = true;

  descInput.value = cat.description;
  descInput.readOnly = true;
  descInput.classList.remove("editing");
  resizeTextarea(descInput);

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
  const descBlock = $("descBlock");
  const charCount = $("charCount");

  if (![editBtn, saveBtn, cancelBtn, deleteBtn, nameInput, descInput, descBlock, charCount].every(Boolean)) {
    console.warn("⚠️ setupEditMode aborted — missing elements");
    return;
  }

  descInput.addEventListener("input", () => {
    resizeTextarea(descInput);
    charCount.textContent = `${descInput.value.length} / ${CHAR_LIMIT} characters`;
  });

  editBtn.addEventListener("click", () => {
    nameInput.dataset.original = nameInput.value;
    descInput.dataset.original = descInput.value;

    nameInput.disabled = false;
    descInput.readOnly = false;
    descInput.classList.add("editing");
    descBlock.classList.add("editing");

    toggleButtons({ edit: false, save: true, cancel: true });
    resizeTextarea(descInput);

    console.log("✏️ Edit mode enabled");
  });

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

      const card = document.querySelector(`.cat-card[data-cat-id="${window.currentCat.id}"]`);
      if (card) {
        const nameSpan = card.querySelector("span");
        if (nameSpan) nameSpan.textContent = name;
      }
    }

    nameInput.disabled = true;
    descInput.readOnly = true;
    descInput.classList.remove("editing");
    descBlock.classList.remove("editing");

    toggleButtons({ edit: true, save: false, cancel: false });
    showToast("Changes saved!", "#ffcc66");

    console.log("💾 Saved changes:", { name, desc });
  });

  cancelBtn.addEventListener("click", () => {
    nameInput.value = nameInput.dataset.original;
    descInput.value = descInput.dataset.original;

    nameInput.disabled = true;
    descInput.readOnly = true;
    descInput.classList.remove("editing");
    descBlock.classList.remove("editing");

    toggleButtons({ edit: true, save: false, cancel: false });

    console.log("↩️ Edit canceled");
  });

  deleteBtn.addEventListener("click", () => {
    console.log("🟡 Delete button clicked");

    if (!window.currentCat) {
      console.warn("⚠️ No currentCat found. Aborting delete.");
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div style="
        font-family: 'Press Start 2P', monospace;
        font-size: 14px;
        text-align: center;
      ">
        <img src="${window.currentCat.image}" alt="Cat Image"
          style="width: 96px; height: 96px; object-fit: contain; margin-bottom: 16px;" />
        <div style="margin-bottom: 16px;">Delete "<b>${window.currentCat.name}</b>"?</div>
        <button id="confirmDelete" style="margin-right:16px; font-size: 12px;">Yes</button>
        <button id="cancelDelete" style="font-size: 12px;">Cancel</button>
      </div>
    `;
    const toast = window.Toastify({
      node: wrapper,
      duration: -1,
      gravity: "top",
      position: "center",
      style: {
        background: "#d62828",
        border: "4px solid black",
        color: "white",
        padding: "32px",
        width: "420px",
        maxWidth: "90vw",
        fontSize: "16px",
        fontFamily: "'Press Start 2P', monospace",
        boxShadow: "8px 8px #000",
        textAlign: "center",
        zIndex: 999999,
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      },
      callback: () => {
        $("#confirmDelete")?.removeEventListener("click", handleConfirm);
        $("#cancelDelete")?.removeEventListener("click", handleCancel);
      }
    });

    toast.showToast();

    function handleConfirm() {
      toast.hideToast();

      const deletedIndex = window.userCats.findIndex(c => c.id === window.currentCat.id);
      if (deletedIndex === -1) return;

      window.userCats.splice(deletedIndex, 1);

      setDisplay("catProfile", false);
      setDisplay("catProfileScroll", false);

      window.renderCarousel();

      let newIndex = deletedIndex - 1;
      if (newIndex < 0) newIndex = 0;

      const newCat = window.userCats[newIndex];
      const mainCatImg = document.getElementById("carouselCat");

      if (newCat) {
        showCatProfile(newCat);
        if (mainCatImg) mainCatImg.src = newCat.image;
        setDisplay("catProfile", true);
        setDisplay("catProfileScroll", true);
      } else {
        if (mainCatImg) mainCatImg.src = "../assets/cats/placeholder.png";
      }

      showToast("Cat deleted!", "#ffcc66");
    }

    function handleCancel() {
      console.log("❌ Cancel button clicked");
      toast.hideToast();
    }

    requestAnimationFrame(() => {
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

function resizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

function toggleButtons({ edit, save, cancel }) {
  const toggle = (id, show) => {
    const el = $(id);
    if (!el) return;
    el.style.visibility = "visible"; // fallback
    el.classList.toggle("hidden", !show);
  };

  toggle("editBtn", edit);
  toggle("saveBtn", save);
  toggle("cancelBtn", cancel);
  toggle("deleteBtn", edit);
  toggle("customizeBtn", edit);
  toggle("fashionBtn", edit);
}


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
