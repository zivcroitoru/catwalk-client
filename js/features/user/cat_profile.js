/*-----------------------------------------------------------------------------
  profile.js
-----------------------------------------------------------------------------*/

import { $, setDisplay } from '../../core/utils.js';
import { CHAR_LIMIT } from '../../core/constants.js';
import { toastSimple, toastConfirmDelete } from '../../core/toast.js';

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
  $("profileImage").src = cat.image;

  // ✅ Calculate age in days
  const birthDate = new Date(cat.birthday);
  const today = new Date();
  const ageInDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
  $("profileAge").textContent = `${ageInDays} days`;

  // ✅ Optionally store new age
  const index = window.userCats.findIndex(c => c.id === cat.id);
  if (index !== -1) {
    window.userCats[index].age = ageInDays;
    localStorage.setItem("usercats", JSON.stringify(window.userCats));
  }

  nameInput.value = cat.name;
  nameInput.disabled = true;

  const desc = cat.description || "";
  descInput.value = desc;
  descInput.readOnly = true;
  descInput.classList.remove("editing");
  resizeTextarea(descInput);

  charCount.textContent = `${desc.length} / ${CHAR_LIMIT} characters`;
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

      const index = window.userCats.findIndex(c => c.id === window.currentCat.id);
      if (index !== -1) {
        window.userCats[index].name = name;
        window.userCats[index].description = desc;
        localStorage.setItem("usercats", JSON.stringify(window.userCats));
        console.log("💾 Name & description saved to localStorage");
      }

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
    toastSimple("Changes saved!", "#ffcc66");
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
    if (!window.currentCat) {
      console.warn("⚠️ No currentCat found. Aborting delete.");
      return;
    }

    toastConfirmDelete(window.currentCat, () => {
      const deletedIndex = window.userCats.findIndex(c => c.id === window.currentCat.id);
      if (deletedIndex === -1) return;

      window.userCats.splice(deletedIndex, 1);

      setDisplay("catProfile", false);
      setDisplay("catProfileScroll", false);
      window.renderCarousel();

      const newIndex = Math.max(0, deletedIndex - 1);
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

      toastSimple("Cat deleted!", "#ffcc66");
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
    if (el) {
      el.style.visibility = "visible";
      el.classList.toggle("hidden", !show);
    }
  };

  toggle("editBtn", edit);
  toggle("saveBtn", save);
  toggle("cancelBtn", cancel);
  toggle("deleteBtn", edit);
  toggle("customizeBtn", edit);
  toggle("fashionBtn", edit);
}
