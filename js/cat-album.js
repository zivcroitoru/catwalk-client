function toggleShop() {
  const shop = document.getElementById("shop");
  shop.style.display = shop.style.display === "block" ? "none" : "block";
}

function toggleMailbox() {
  const mailbox = document.getElementById("mailbox");
  mailbox.style.display = mailbox.style.display === "block" ? "none" : "block";
}

function signOut() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

const carousel = document.getElementById("catCarousel");
const cardWidth = 96;
const cardsPerPage = 5;
const totalCards = carousel.children.length;
const maxPage = Math.ceil(totalCards / cardsPerPage) - 1;
let currentPage = 0;

function scrollCarousel(direction) {
  currentPage += direction;
  currentPage = Math.max(0, Math.min(currentPage, maxPage));
  const offset = currentPage * cardWidth * cardsPerPage;
  carousel.style.transform = `translateX(-${offset}px)`;
}
function toggleUploadCat() {
  const modal = document.getElementById("uploadCat");
  const overlay = document.getElementById("uploadOverlay");
  const isOpen = modal.style.display === "block";

  modal.style.display = isOpen ? "none" : "block";
  overlay.style.display = isOpen ? "none" : "block";
}
function showCatProfile(cat) {
  const profile = document.getElementById("catProfile");
  profile.style.display = "flex";

  document.getElementById("profileName").textContent = cat.name;
  document.getElementById("profileBreed").textContent = cat.breed;
  document.getElementById("profileVariant").textContent = cat.variant;
  document.getElementById("profilePalette").textContent = cat.palette;
  document.getElementById("profileBirthday").textContent = cat.birthday;
  document.getElementById("profileAge").textContent = cat.age;
  document.getElementById("profileDescription").textContent = cat.description;
  document.getElementById("profileImage").src = cat.image;
}




