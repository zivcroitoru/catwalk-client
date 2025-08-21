
import { $, toPascalCase } from '../../core/utils.js';
import { CHAR_LIMIT } from '../../core/constants.js';
import { toastSimple, toastConfirmDelete } from '../../core/toast.js';
import { updateCat, deleteCat, getPlayerCats } from '../../core/storage.js';
import { renderCarousel } from '../ui/carousel.js';

export async function showCatProfile(cat) {
  const nameInput  = $('catName');
  const descInput  = $('catDesc');
  const charCount  = $('charCount');
  const descBlock  = $('descBlock');

  // ---- Parse template safely (supports multi-hyphen variants) ----
  const [breedRaw, ...rest] = (cat.template ?? '').split('-');
  const breed   = breedRaw ?? '';
  const variant = rest.length ? rest.join('-') : (cat.variant ?? '');

  $('profileBreed').textContent   = toPascalCase(breed);
  $('profileVariant').textContent = toPascalCase(variant);
  $('profilePalette').textContent = toPascalCase(cat.palette ?? '');

  // ---- Birthday + Age (robust to invalid dates) ----
  const bd = new Date(cat.birthdate);
  if (!isNaN(bd)) {
    const formatted = `${bd.getMonth() + 1}.${bd.getDate()}.${bd.getFullYear().toString().slice(-2)}`;
    $('profileBirthday').textContent = formatted;

    const ageInDays = Math.floor((Date.now() - bd.getTime()) / 86_400_000);
    $('profileAge').textContent = `${ageInDays} days`;
  } else {
    $('profileBirthday').textContent = '—';
    $('profileAge').textContent = '—';
  }

  $('profileImage').src = cat.sprite_url;

  // ---- Inputs baseline ----
  nameInput.value = cat.name ?? '';
  nameInput.disabled = true;

  descInput.value = cat.description ?? '';
  descInput.readOnly = true;
  descInput.classList.remove('editing');

  charCount.textContent = `${descInput.value.length} / ${CHAR_LIMIT} characters`;
  descBlock.classList.remove('editing');

  // Stash current cat; ensure breed/variant are present for later updates
  window.currentCat = { ...cat, breed: cat.breed ?? breed, variant: cat.variant ?? variant };
}

export function setupEditMode() {
  const els = ['editBtn', 'saveBtn', 'cancelBtn', 'deleteBtn', 'catName', 'catDesc', 'descBlock', 'charCount'].map($);
  if (els.some(e => !e)) return;

  const [editBtn, saveBtn, cancelBtn, deleteBtn, nameInput, descInput, descBlock, charCount] = els;

  // Live counter
  descInput.addEventListener('input', () => {
    charCount.textContent = `${descInput.value.length} / ${CHAR_LIMIT} characters`;
  });

  // ---- Enter edit mode ----
  editBtn.onclick = () => {
    nameInput.dataset.original = nameInput.value;
    descInput.dataset.original = descInput.value;

    nameInput.disabled = false;
    descInput.readOnly = false;

    descInput.classList.add('editing');
    descBlock.classList.add('editing');

    toggleButtons({ edit: false, save: true, cancel: true });
  };

  // ---- Save (with guards and no premature mutation) ----
  saveBtn.onclick = async () => {
    if (!window.currentCat) return;

    if (descInput.value.length > CHAR_LIMIT) {
      toastSimple(`Description too long. Max: ${CHAR_LIMIT} characters.`, '#ff6666');
      return;
    }

    const newName = nameInput.value.trim();
    const newDesc = descInput.value.trim();

    saveBtn.disabled = true;

    try {
      const payload = {
        name: newName,
        description: newDesc,
        template: window.currentCat.template,
        breed: window.currentCat.breed,
        variant: window.currentCat.variant,
        palette: window.currentCat.palette
      };

      await updateCat(window.currentCat.id, payload);

      // Commit only after success
      window.currentCat = { ...window.currentCat, ...payload };

      const idx = window.userCats.findIndex(c => c.id === window.currentCat.id);
      if (idx !== -1) window.userCats[idx] = { ...window.currentCat };

      // Reflect name on card if present
      const card = document.querySelector(`.cat-card[data-cat-id="${window.currentCat.id}"] span`);
      if (card) card.textContent = window.currentCat.name;

      finishEdit();
      toastSimple('Changes saved!', '#ffcc66');
    } catch (err) {
      console.error('updateCat failed:', err);
      // Revert inputs to originals to avoid desync
      nameInput.value = nameInput.dataset.original ?? nameInput.value;
      descInput.value = descInput.dataset.original ?? descInput.value;
      charCount.textContent = `${descInput.value.length} / ${CHAR_LIMIT} characters`;
      toastSimple('Failed to save changes', '#ff6666');
    } finally {
      saveBtn.disabled = false;
    }
  };

  // ---- Cancel ----
  cancelBtn.onclick = () => {
    nameInput.value = nameInput.dataset.original ?? nameInput.value;
    descInput.value = descInput.dataset.original ?? descInput.value;
    charCount.textContent = `${descInput.value.length} / ${CHAR_LIMIT} characters`;
    finishEdit();
  };

  // ---- Delete ----
  deleteBtn.onclick = () => {
    if (!window.currentCat) return;

    toastConfirmDelete(window.currentCat, async () => {
      try {
        const idToDelete = window.currentCat.id;
        const idx = window.userCats.findIndex(c => c.id === idToDelete);

        let preferredId = null;
        if (idx > -1) {
          const prevId = window.userCats[idx - 1]?.id ?? null;
          const nextId = window.userCats[idx + 1]?.id ?? null;
          preferredId = prevId ?? nextId ?? null;
        }

        await deleteCat(idToDelete);
        window.userCats = await getPlayerCats();
        await renderCarousel(preferredId);

        toastSimple('Cat deleted!', '#ffcc66');
      } catch (err) {
        console.error('deleteCat failed:', err);
        toastSimple('Delete failed', '#ff6666');
      }
    });
  };

  // ---- Helpers (scoped) ----
  function finishEdit() {
    nameInput.disabled = true;
    descInput.readOnly = true;

    descInput.classList.remove('editing');
    descBlock.classList.remove('editing');

    toggleButtons({ edit: true, save: false, cancel: false });
  }
}

// ---- Shared helper ----
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
