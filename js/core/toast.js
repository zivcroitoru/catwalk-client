// /js/core/toast.js
import { toPascalCase } from './utils.js';

// 🎨 **STANDARDIZED STYLING FOR FASHION SHOW**
const FASHION_TOAST_STYLE = {
  border: '3px solid #000',
  boxShadow: '4px 4px 0px #000',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '12px',
  padding: '16px',
  zIndex: 999999
};

export function toastCatAdded({ breed, name, sprite_url }) {
  Toastify({
    node: (() => {
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        font-family: 'Press Start 2P', monospace;
        font-size: 14px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
        gap: 30px;
      `;
      wrapper.innerHTML = `
        <img src="${sprite_url}" alt="Cat"
          style="
            width: 48px;
            height: 48px;
            image-rendering: pixelated;
            transform: scale(1.5);
            transform-origin: center;
          " />
        <div><b>${breed} (${name})</b></div>
        <div style="font-size: 12px;">added to your collection!</div>
      `;
      return wrapper;
    })(),
    duration: 2200,
    gravity: "top",
    position: "center",
    style: {
      background: "#4caf50",
      border: "3px solid black",
      padding: "20px",
      width: "260px",
      maxWidth: "90vw",
      color: "black",
      boxShadow: "6px 6px #000",
      zIndex: 999999,
    }
  }).showToast();
}



export function toastCancelled() {
  Toastify({
    text: "❌ Cancelled",
    duration: 1500,
    gravity: "bottom",
    position: "center",
    style: { background: "#999" }
  }).showToast();
}

export function toastBought(name) {
  Toastify({
    text: `✅ Bought "${name}"!`,
    duration: 2000,
    gravity: "bottom",
    position: "center",
    style: { background: "#4caf50" }
  }).showToast();
}

export function toastNotEnough() {
  Toastify({
    text: `❌ Not enough coins`,
    duration: 2000,
    gravity: "bottom",
    position: "center",
    style: { background: "#d32f2f" }
  }).showToast();
}

export function toastEquipResult(name, result) {
  Toastify({
    text: result === "equipped"
      ? `Equipped "${name}"`
      : `Unequipped "${name}"`,
    duration: 2000,
    gravity: "bottom",
    position: "center",
    style: { background: "#2196f3" }
  }).showToast();
}

export function toastInfo(text, background = "#ffcc66") {
  Toastify({
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

export function toastSimple(text, background = "#4caf50") {
  Toastify({
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

export function toastConfirmDelete(cat, onConfirm, onCancel) {
  const imageURL = new URL(cat.sprite_url || cat.image || '', window.location.origin).href;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div style="font-family:'Press Start 2P', monospace; font-size:14px; text-align:center;">
      <img src="${imageURL}" alt="Cat"
        style="width:96px; height:96px; object-fit:contain; margin-bottom:16px;"
        onerror="this.style.display='none'; console.warn('❌ Failed to load cat image:', this.src);" />
      <div style="margin-bottom:16px;">Delete "<b>${cat.name}</b>"?</div>
      <button id="confirmDelete" style="margin-right:16px; font-size:12px;">Yes</button>
      <button id="cancelDelete" style="font-size:12px;">Cancel</button>
    </div>
  `;

  const toast = Toastify({
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
      document.getElementById("confirmDelete")?.removeEventListener("click", onConfirm);
      document.getElementById("cancelDelete")?.removeEventListener("click", onCancel);
    }
  });

  toast.showToast();

  requestAnimationFrame(() => {
    document.getElementById("confirmDelete")?.addEventListener("click", () => {
      toast.hideToast();
      onConfirm?.();
    });
    document.getElementById("cancelDelete")?.addEventListener("click", () => {
      toast.hideToast();
      onCancel?.();
    });
  });
}

export function toastNoCats() {
  const toast = Toastify({
    node: (() => {
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        font-family: 'Press Start 2P', monospace;
        font-size: 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 32px;
        color: #333;
      `;
      wrapper.innerHTML = `
        <div style="font-size: 2rem; font-weight: bold; color: #555; margin-bottom: 0.7rem;">No cats :(</div>
        <button id="addCatBtnToast" style="
          background: #ffcc66; 
          border: 2px solid #222; 
          border-radius: 0.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          padding: 8px 16px;
          cursor: pointer;
          margin-top: 8px;
        ">
          <img src="../../assets/ui/plus.png" alt="Add Cat" style="width: 22px; vertical-align: middle;" /> Add Cat
        </button>
      `;
      return wrapper;
    })(),
    duration: -1, // stays until user closes it
    gravity: "top",
    position: "center",
    style: {
      background: "#fffbe7",
      border: "2px solid #ffcc66",
      boxShadow: "0 6px 24px #0001",
      borderRadius: "1.2rem",
      minWidth: "260px",
      zIndex: 999999,
    },
    callback: () => {
      document.getElementById("addCatBtnToast")
        ?.removeEventListener("click", window.__addCatBtnToastHandler);
    }
  });

  // Track the toast so we can close it later
  window.Toastify = window.Toastify || {};
  window.Toastify.recent = toast;

  toast.showToast();

  // Button click closes toast & opens Add Cat popup
  window.__addCatBtnToastHandler = () => {
    if (window.Toastify?.recent) {
      try { window.Toastify.recent.hideToast(); } catch {}
    }
    document.getElementById("addCatBtn")?.click();
  };

  requestAnimationFrame(() => {
    document.getElementById("addCatBtnToast")
      ?.addEventListener("click", window.__addCatBtnToastHandler);
  });
}

export async function toastCatFact() {
  try {
    const res = await fetch('https://catfact.ninja/fact');
    const { fact } = await res.json();
    Toastify({
      text: `🐾 ${fact}`,
      duration: 5000,
      gravity: 'bottom',
      position: 'right',
      style: {
        background: '#fff2d9',
        color: '#000',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '10px',
        border: '2px solid #000',
      },
    }).showToast();
  } catch {
    Toastify({
      text: 'Failed to load cat fact 😿',
      duration: 3000,
      gravity: 'bottom',
      position: 'right',
      style: {
        background: '#fdd',
        color: '#000',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '10px',
        border: '2px solid #000',
      },
    }).showToast();
  }
}

export function toastConfirmAddCat({ name, variant, palette, sprite_url }, onYes, onCancel) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div style="font-family:'Press Start 2P', monospace; font-size:14px; text-align:center;">
      <div style="font-size:16px; font-weight:bold; color:#222; margin-bottom:10px;">Add This Cat?</div>

      <img src="${sprite_url}" alt="Cat"
        style="width:64px; height:64px; image-rendering:pixelated; transform:scale(2); transform-origin:center; margin: -8px 0 6px 0;"
        onerror="this.style.display='none'; console.warn('❌ Failed to load preview:', this.src);" />

      <div style="font-size:13px; color:#333; margin-top:8px;">
        <b>${toPascalCase(variant)} (${toPascalCase(palette)})</b>
      </div>
      <div style="font-size:12px; margin-top:2px;">Add to your collection?</div>

      <div style="display:flex; gap:24px; justify-content:center; margin-top:16px;">
        <button id="confirmAddYes" style="padding:6px 14px;">✅ Yes</button>
        <button id="confirmAddNo" style="padding:6px 14px;">❌ No</button>
      </div>
    </div>
  `;

  const toast = Toastify({
    node: wrapper,
    duration: -1,
    gravity: "top",
    position: "center",
    style: {
      background: "#fffbe7",
      border: "4px solid black",
      color: "#000",
      padding: "28px",
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
      document.getElementById("confirmAddYes")?.removeEventListener("click", onYes);
      document.getElementById("confirmAddNo")?.removeEventListener("click", onCancel);
    }
  });

  toast.showToast();

  // bind after mount
  requestAnimationFrame(() => {
    document.getElementById("confirmAddYes")?.addEventListener("click", () => {
      toast.hideToast();
      onYes?.();
    });
    document.getElementById("confirmAddNo")?.addEventListener("click", () => {
      toast.hideToast();
      onCancel?.();
    });
  });

  return toast;
}

// ═══════════════════════════════════════════════════════════════
// FASHION SHOW SPECIFIC TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * ✅ SIMPLIFIED: Show coin reward for fashion show results
 * @param {number} coinsEarned - Coins earned this round
 * @param {number} votesReceived - Number of votes received
 */
export function toastFashionShowReward(coinsEarned, votesReceived) {
  // Only show if coins > 0
  if (coinsEarned <= 0) {
    console.log('🍞 No reward toast - zero coins earned');
    return;
  }

  const plural = votesReceived === 1 ? 'vote' : 'votes';
  const message = `${votesReceived} ${plural} received, +${coinsEarned} COINS`;
  
  Toastify({
    text: `🎉 ${message}`,
    duration: 4000,
    gravity: "top",
    position: "right",
    style: {
      ...FASHION_TOAST_STYLE,
      background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
      color: '#000',
      fontSize: '14px',
      fontWeight: 'bold',
      width: '280px',
      textAlign: 'center'
    }
  }).showToast();
}

/**
 * ✅ KEEP: Show warning when player quits early (before results)
 */
export function toastFashionShowEarlyQuit() {
  Toastify({
    text: "⚠️ You left the fashion show early - no coins awarded!",
    duration: 3000,
    gravity: "bottom",
    position: "right",
    style: {
      ...FASHION_TOAST_STYLE,
      background: "#ff9800",
      color: "#000",
      width: "280px"
    }
  }).showToast();
}

/**
 * ✅ SIMPLIFIED: Show connection status toast
 * @param {'connected' | 'disconnected' | 'reconnecting' | 'error'} status
 * @param {string} [message] - Optional custom message for errors
 */
export function toastFashionShowConnection(status, message = '') {
  const statusConfig = {
    connected: {
      text: "✅ Connected to fashion show!",
      background: "#4caf50",
      duration: 2000
    },
    disconnected: {
      text: "❌ Disconnected from fashion show",
      background: "#f44336",
      duration: 3000
    },
    reconnecting: {
      text: "🔄 Reconnecting to fashion show...",
      background: "#ff9800",
      duration: -1 // Persistent
    },
    error: {
      text: message || "❌ Fashion show connection error",
      background: "#d32f2f",
      duration: 4000
    }
  };

  const config = statusConfig[status] || statusConfig.error;

  Toastify({
    text: config.text,
    duration: config.duration,
    gravity: "top",
    position: "center",
    style: {
      ...FASHION_TOAST_STYLE,
      background: config.background,
      color: '#fff',
      minWidth: '250px',
      textAlign: 'center'
    }
  }).showToast();
}

/**
 * ✅ SIMPLIFIED: Show game error toast
 * @param {string} errorMessage - Error message to display
 * @param {'warning' | 'error' | 'info'} [severity='error'] - Error severity
 */
export function toastFashionShowError(errorMessage, severity = 'error') {
  const severityConfig = {
    error: {
      background: "#d32f2f",
      emoji: "❌",
      color: "#fff"
    },
    warning: {
      background: "#ff9800", 
      emoji: "⚠️",
      color: "#000"
    },
    info: {
      background: "#2196f3",
      emoji: "ℹ️", 
      color: "#fff"
    }
  };

  const config = severityConfig[severity];

  Toastify({
    text: `${config.emoji} ${errorMessage}`,
    duration: 4000,
    gravity: "top",
    position: "center",
    style: {
      ...FASHION_TOAST_STYLE,
      background: config.background,
      color: config.color,
      maxWidth: '400px',
      textAlign: 'center'
    }
  }).showToast();
}

