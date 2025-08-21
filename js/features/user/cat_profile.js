
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

  // --- Auto-resize helper ---
  function autoResize(el) {
    el.style.height = 'auto';                // reset
    el.style.height = el.scrollHeight + 'px'; // expand to fit
  }

  // Live counter + auto-resize
  descInput.addEventListener('input', () => {
    charCount.textContent = `${descInput.value.length} / ${CHAR_LIMIT} characters`;
    autoResize(descInput);
  });

  // Run once on setup to size existing text
  autoResize(descInput);

  // ---- Enter edit mode ----
  editBtn.onclick = () => {
    nameInput.dataset.original = nameInput.value;
    descInput.dataset.original = descInput.value;

    nameInput.disabled = false;
    descInput.readOnly = false;

    descInput.classList.add('editing');
    descBlock.classList.add('editing');

    toggleButtons({ edit: false, save: true, cancel: true });
    autoResize(descInput); // ensure height updates when entering edit mode
  };
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
