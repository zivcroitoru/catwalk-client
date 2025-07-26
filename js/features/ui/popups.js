import { $, setDisplay, $$ } from '../../core/utils.js';

// ❌ Disabled: does nothing now
export function closeAllPopups(excludeId = null) {
  console.log(`🚫 closeAllPopups() skipped (exclude: ${excludeId})`);
}

// ✅ Won't close anything anymore
export function togglePopup(id, overlayId = null, displayType = "block", defaultTab = null) {
  const popup = $(id);
  const overlay = overlayId ? $(overlayId) : null;
  const wasVisible = getComputedStyle(popup).display === displayType;

  // closeAllPopups(id); ⛔️ removed

  if (!wasVisible) {
    setDisplay(popup, true, displayType);
    if (overlay && id !== "shop") setDisplay(overlay, true);
    if (defaultTab) defaultTab.click();
  }
}

// 🐱 Upload Cat Popup
export function toggleUploadCat() {
  togglePopup("uploadCat", "uploadOverlay", "flex");
}

// 🧾 Profile Scroll Popup
export function toggleDetails() {
  togglePopup("catProfileScroll", null, "block");
}
