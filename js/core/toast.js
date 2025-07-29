// /js/core/toast.js

export function toastCatAdded({ breed, name, sprite }) {
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
        <img src="${sprite}" alt="Cat"
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
      zIndex: 999999
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
