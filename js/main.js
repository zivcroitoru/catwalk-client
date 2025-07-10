function toggleShop() {
  const shop = document.getElementById("shop");
  shop.style.display = shop.style.display === "block" ? "none" : "block";
}

function signOut() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

function toggleMailbox() {
  const mailbox = document.getElementById("mailbox");
  mailbox.style.display = mailbox.style.display === "block" ? "none" : "block";
}

function toggleVolume() {
  const btn = document.getElementById("volumeBtn");
  const isOn = btn.textContent === "🔊";
  btn.textContent = isOn ? "🔇" : "🔊";
}
