// /js/core/toast.js

export function toastCatAdded({ breed, name, sprite_url }) {
  Toastify({
    node: (() => {
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        font-family: 'Press Start 2P', monospace;
        font-size: 10px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      `;
      wrapper.innerHTML = `
        <img src="${sprite_url}" alt="Cat"
          style="width: 32px; height: 32px; image-rendering: pixelated; margin-bottom: 4px;" />
        <div><b>${breed} (${name})</b> added!</div>
      `;
      return wrapper;
    })(),
    duration: 1800,
    gravity: "top",
    position: "center",
    style: {
      background: "#4caf50",
      border: "2px solid black",
      padding: "8px",
      width: "180px",
      maxWidth: "80vw",
      color: "black",
      boxShadow: "4px 4px #000",
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
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div style="font-family:'Press Start 2P', monospace; font-size:14px; text-align:center;">
      <img src="${cat.image}" alt="Cat" style="width:96px; height:96px; object-fit:contain; margin-bottom:16px;" />
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
  Toastify({
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
    duration: -1, // Stays until user clicks
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
      document.getElementById("addCatBtnToast")?.removeEventListener("click", window.__addCatBtnToastHandler);
    }
  }).showToast();

  // Add button click triggers the real Add Cat popup
  window.__addCatBtnToastHandler = () => {
    document.getElementById("addCatBtn")?.click();
  };
  requestAnimationFrame(() => {
    document.getElementById("addCatBtnToast")?.addEventListener("click", window.__addCatBtnToastHandler);
  });
}

