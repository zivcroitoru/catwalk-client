import { $, setDisplay, $$ } from '../../core/utils.js';

// No-op
export function closeAllPopups(excludeId = null) {}

// Toggle a popup (no close-all side effects)
export function togglePopup(id, overlayId = null, displayType = "block", defaultTab = null) {
  const popup = $(id);
  const overlay = overlayId ? $(overlayId) : null;
  const wasVisible = getComputedStyle(popup).display === displayType;

  if (!wasVisible) {
    setDisplay(popup, true, displayType);
    if (overlay && id !== "shop") setDisplay(overlay, true);
    if (defaultTab) defaultTab.click();
  }
}

// Upload Cat Popup
export function toggleUploadCat() {
  togglePopup("uploadCat", "uploadOverlay", "flex");
}

// Profile Scroll Popup
export function toggleDetails() {
  togglePopup("catProfileScroll", null, "block");
}

// Cat Fact Container Visibility
const container = document.getElementById('catFactContainer');

function updateCatFactVisibility() {
  if (!container) return;
  container.style.display = container.textContent.trim() ? 'block' : 'none';
}

// Initialize once on load
updateCatFactVisibility();

// Update cat fact text and toggle visibility
export function setCatFact(text) {
  if (!container) return;
  container.textContent = text;
  updateCatFactVisibility();
}
