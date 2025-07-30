/*-----------------------------------------------------------------------------
  profile.js – DB version (no localStorage)
-----------------------------------------------------------------------------*/

import { $, setDisplay } from '../../core/utils.js';
import { CHAR_LIMIT } from '../../core/constants.js';
import { toastSimple, toastConfirmDelete } from '../../core/toast.js';
import { loadUserItems, saveUserItems } from '../../core/storage.js';

export async function showCatProfile(cat) {
  setDisplay('catProfile', true, 'flex');
  setDisplay('catProfileScroll', true);

  const nameInput = $('catName');
  const descInput = $('catDesc');
  const charCount = $('charCount');
  const descBlock = $('descBlock');

  $('profileBreed').textContent    = cat.breed;
  $('profileVariant').textContent  = cat.variant;
  $('profilePalette').textContent  = cat.palette;
  $('profileBirthday').textContent = cat.birthday;
  $('profileImage').src            = cat.image;

  // age in days
  const ageInDays = Math.floor(
    (Date.now() - new Date(cat.birthday)) / (1000 * 60 * 60 * 24)
  );
  $('profileAge').textContent = `${ageInDays} days`;

  // persist age
  const idx = window.userCats.findIndex(c => c.id === cat.id);
  if (idx !== -1) {
    window.userCats[idx].age = ageInDays;
    const userItems = await loadUserItems();
    userItems.userCats = window.userCats;
    await saveUserItems({ userCats: userItems.userCats });
  }

  nameInput.value     = cat.name;
  nameInput.disabled  = true;

  descInput.value     = cat.description || '';
  descInput.readOnly  = true;
  descInput.classList.remove('editing');
  resizeTextarea(descInput);

  charCount.textContent = `${descInput.value.length} / ${CHAR_LIMIT} characters`;
  descBlock.classList.remove('editing');

  window.currentCat = cat;
}

export function setupEditMode() {
  const els = [
    'editBtn','saveBtn','cancelBtn','deleteBtn',
    'catName','catDesc','descBlock','charCount'
  ].map($);
  if (els.some(e => !e)) {
    console.warn('⚠️ setupEditMode aborted — missing elements');
    return;
  }
  const [
    editBtn, saveBtn, cancelBtn, deleteBtn,
    nameInput, descInput, descBlock, charCount
  ] = els;

  descInput.addEventListener('input', () => {
    resizeTextarea(descInput);
    charCount.textContent = `${descInput.value.length} / ${CHAR_LIMIT} characters`;
  });

  editBtn.onclick = () => {
    nameInput.dataset.original = nameInput.value;
    descInput.dataset.original = descInput.value;
    nameInput.disabled = false;
    descInput.readOnly = false;
    descInput.classList.add('editing');
    descBlock.classList.add('editing');
    toggleButtons({ edit: false, save: true, cancel: true });
    resizeTextarea(descInput);
  };

  saveBtn.onclick = async () => {
    if (descInput.value.length > CHAR_LIMIT) {
      alert(`Description too long. Max: ${CHAR_LIMIT} characters.`);
      return;
    }
    if (window.currentCat) {
      window.currentCat.name        = nameInput.value.trim();
      window.currentCat.description = descInput.value.trim();

      const idx = window.userCats.findIndex(c => c.id === window.currentCat.id);
      if (idx !== -1) {
        window.userCats[idx] = { ...window.currentCat };
        const userItems = await loadUserItems();
        userItems.userCats = window.userCats;
        await saveUserItems({ userCats: userItems.userCats });
      }
      const card = document.querySelector(`.cat-card[data-cat-id="${window.currentCat.id}"] span`);
      if (card) card.textContent = window.currentCat.name;
    }
    finishEdit();
    toastSimple('Changes saved!', '#ffcc66');
  };

  cancelBtn.onclick = () => {
    nameInput.value = nameInput.dataset.original;
    descInput.value = descInput.dataset.original;
    finishEdit();
  };

  deleteBtn.onclick = () => {
    if (!window.currentCat) return;
    toastConfirmDelete(window.currentCat, async () => {
      const idx = window.userCats.findIndex(c => c.id === window.currentCat.id);
      if (idx === -1) return;
      window.userCats.splice(idx, 1);

      const userItems = await loadUserItems();
      userItems.userCats = window.userCats;
      await saveUserItems({ userCats: userItems.userCats });

      setDisplay('catProfile', false);
      setDisplay('catProfileScroll', false);
      window.renderCarousel();

      const newCat = window.userCats[Math.max(0, idx - 1)];
      const mainImg = document.getElementById('carouselCat');
      if (newCat) {
        showCatProfile(newCat);
        if (mainImg) mainImg.src = newCat.image;
      } else if (mainImg) {
        mainImg.src = '../assets/cats/placeholder.png';
      }
      toastSimple('Cat deleted!', '#ffcc66');
    });
  };

  function finishEdit() {
    nameInput.disabled = true;
    descInput.readOnly = true;
    descInput.classList.remove('editing');
    descBlock.classList.remove('editing');
    toggleButtons({ edit: true, save: false, cancel: false });
  }
}

// ───────────── helpers ─────────────
function resizeTextarea(t) {
  t.style.height = 'auto';
  t.style.height = t.scrollHeight + 'px';
}
function toggleButtons({ edit, save, cancel }) {
  const setVis = (id, show) => {
    const el = $(id);
    if (el) el.classList.toggle('hidden', !show);
  };
  setVis('editBtn',    edit);
  setVis('saveBtn',    save);
  setVis('cancelBtn',  cancel);
  setVis('deleteBtn',  edit);
  setVis('customizeBtn', edit);
  setVis('fashionBtn',  edit);
}
