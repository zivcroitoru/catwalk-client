/*-----------------------------------------------------------------------------
  cat_profile.js – DB version (no localStorage)
-----------------------------------------------------------------------------*/

import { $, setDisplay, toPascalCase } from '../../core/utils.js';
import { CHAR_LIMIT } from '../../core/constants.js';
import { toastSimple, toastConfirmDelete } from '../../core/toast.js';
import { loadPlayerItems as loadUserItems, updateCat, deleteCat, getPlayerCats } from '../../core/storage.js';


export async function showCatProfile(cat) {
  const nameInput = $('catName');
  const descInput = $('catDesc');
  const charCount = $('charCount');
  const descBlock = $('descBlock');

  const [breed, variant] = cat.template.split('-');
  $('profileBreed').textContent = toPascalCase(breed);
  $('profileVariant').textContent = toPascalCase(variant);
  $('profilePalette').textContent = toPascalCase(cat.palette);
  const date = new Date(cat.birthdate);
  const formatted = `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear().toString().slice(-2)}`;
  $('profileBirthday').textContent = formatted;
  $('profileImage').src = cat.sprite_url;

  const ageInDays = Math.floor(
    (Date.now() - new Date(cat.birthdate)) / (1000 * 60 * 60 * 24)
  );
  $('profileAge').textContent = `${ageInDays} days`;

  nameInput.value = cat.name;
  nameInput.disabled = true;

  descInput.value = cat.description || '';
  descInput.readOnly = true;
  descInput.classList.remove('editing');

  charCount.textContent = `${descInput.value.length} / ${CHAR_LIMIT} characters`;
  descBlock.classList.remove('editing');

  window.currentCat = cat;
}

export function setupEditMode() {
  const els = [
    'editBtn', 'saveBtn', 'cancelBtn', 'deleteBtn',
    'catName', 'catDesc', 'descBlock', 'charCount'
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
  };

  saveBtn.onclick = async () => {
    if (descInput.value.length > CHAR_LIMIT) {
      alert(`Description too long. Max: ${CHAR_LIMIT} characters.`);
      return;
    }

    if (window.currentCat) {
      window.currentCat.name = nameInput.value.trim();
      window.currentCat.description = descInput.value.trim();

      try {
        await updateCat(window.currentCat.id, {
          name: window.currentCat.name,
          description: window.currentCat.description,
          template: window.currentCat.template,
          breed: window.currentCat.breed,
          variant: window.currentCat.variant,
          palette: window.currentCat.palette
        });

        const idx = window.userCats.findIndex(c => c.id === window.currentCat.id);
        if (idx !== -1) {
          window.userCats[idx] = {
            ...window.currentCat
          };
        }
      } catch (err) {
        console.error('Failed to save cat changes:', err);
        toastSimple('Failed to save changes', '#ff6666');
        return;
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
    try {
      const idToDelete = window.currentCat.id;
      const idx = window.userCats.findIndex(c => c.id === idToDelete);

      // figure out which cat should be selected after deletion
      const prevId = window.userCats[idx - 1]?.id || null;
      const nextId = window.userCats[idx + 1]?.id || null;
      const preferredId = prevId ?? nextId ?? null;

      // delete from backend
      await deleteCat(idToDelete);

      // refresh list
      window.userCats = await getPlayerCats();

      // ⬇️ re-render selecting the "preferred" cat
      await renderCarousel(preferredId);

      toastSimple('Cat deleted!', '#ffcc66');
    } catch (err) {
      console.error('❌ Delete flow error:', err);
      toastSimple('Delete failed', '#ff6666');
    }
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

function toggleButtons({ edit, save, cancel }) {
  const setVis = (id, show) => {
    const el = $(id);
    if (el) el.classList.toggle('hidden', !show);
  };
  setVis('editBtn', edit);
  setVis('saveBtn', save);
  setVis('cancelBtn', cancel);
  setVis('deleteBtn', edit);
  setVis('customizeBtn', edit);
  setVis('fashionBtn', edit);
}
