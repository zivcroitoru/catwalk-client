import { $, setDisplay, $$ } from './utils.js';

export function closeAllPopups() {
  ["shop", "mailbox", "uploadCat", "catProfile", "catProfileScroll"].forEach(id => setDisplay(id, false));
  $$(".floating-actions button").forEach(b => b.classList.remove("active"));
}
export function togglePopup(id, overlayId = null, displayType = "block", defaultTab = null) {
  const popup = $(id);
  const overlay = overlayId ? $(overlayId) : null;
  const wasVisible = getComputedStyle(popup).display === displayType;

  closeAllPopups();
  if (!wasVisible) {
    setDisplay(popup, true, displayType);
    if (overlay && id !== "shop") setDisplay(overlay, true); // ⬅️ Skip overlay for shop
    if (defaultTab) defaultTab.click();
  }
}

// ✅ Export these two inline functions
export function toggleUploadCat() {
  togglePopup("uploadCat", "uploadOverlay", "flex");
}

export function toggleDetails() {
  togglePopup("catProfileScroll", null, "block");
}
