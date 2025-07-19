let soundOn = true;

function toggleSound() {
  soundOn = !soundOn;

  // Update icon
  const soundIcon = document.getElementById("soundIcon");
  soundIcon.src = soundOn
    ? "../assets/icons/speakerON.png"
    : "../assets/icons/speakerOFF.png";

  // Mute/unmute all audio and video elements
  document.querySelectorAll("audio, video").forEach(media => {
    media.muted = !soundOn;
  });
}

function toggleShop() {
  const shop = document.getElementById("shop");
  const scroll = document.getElementById("catProfileScroll");
  const mailbox = document.getElementById("mailbox");

  const isOpen = shop.style.display === "block";
  shop.style.display = isOpen ? "none" : "block";

  if (!isOpen) {
    scroll.style.display = "none";
    mailbox.style.display = "none";
  }
}

function toggleMailbox() {
  const mailbox = document.getElementById("mailbox");
  const shop = document.getElementById("shop");
  const scroll = document.getElementById("catProfileScroll");

  const isOpen = mailbox.style.display === "block";
  mailbox.style.display = isOpen ? "none" : "block";

  if (!isOpen) {
    shop.style.display = "none";
    scroll.style.display = "none";
  }
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
  const isOpen = modal.style.display === "flex";

  modal.style.display = isOpen ? "none" : "flex";
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
// Set clicked button as active
document.querySelectorAll(".floating-actions button").forEach(button => {
  button.addEventListener("click", () => {
    // Remove 'active' from all buttons
    document.querySelectorAll(".floating-actions button").forEach(b => b.classList.remove("active"));
    // Add 'active' to the clicked one
    button.classList.add("active");
  });
});
// ‑‑‑ preview chosen image


// ‑‑‑ upload to server (simple example)
async function uploadCat() {
  const file = document.getElementById('catFileInput').files[0];
  if (!file) { alert('Pick a file first 🙂'); return; }

  const form = new FormData();
  form.append('catImage', file);

  const res = await fetch('/api/cats', { method:'POST', body:form });
  if (!res.ok) { alert('Upload failed'); return; }

  const { url, name } = await res.json();       // assume backend returns these
  addCatToCarousel(url, name || 'New Cat');     // 👈 show immediately
  toggleUploadCat();
}

// ‑‑‑ utility that injects the new cat card + updates main image
function addCatToCarousel(imgUrl, label) {
  const carousel = document.getElementById('catCarousel');

  const card = document.createElement('div');
  card.className = 'cat-card';
  card.innerHTML = `
    <div class="cat-thumbnail" style="background-image:url('${imgUrl}');"></div>
    <span>${label}</span>
  `;
  carousel.appendChild(card);

  document.getElementById('carouselCat').src = imgUrl;
}
function handleCatFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const preview = document.getElementById("uploadPreview");
  preview.src = URL.createObjectURL(file);

  // Show the buttons
  document.getElementById("uploadActions").style.display = "flex";
}

function handleNextClick() {
  // TODO: replace this with your real logic
  alert("Proceeding to the next step!");
}

function triggerReupload() {
  document.getElementById("catFileInput").click();
}window.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const catName = document.getElementById('catName');
  const catDesc = document.getElementById('catDesc');
  const descCount = document.getElementById('descCount');
  const CHAR_LIMIT = 200;

function updateDescMetrics() {
  catDesc.style.height = 'auto';
  catDesc.style.height = catDesc.scrollHeight + 'px';

  if (catDesc.value.length > CHAR_LIMIT) {
    catDesc.value = catDesc.value.slice(0, CHAR_LIMIT);
  }

  descCount.textContent = `${catDesc.value.length} / ${CHAR_LIMIT} characters`;
}

  editBtn.addEventListener('click', () => {
    catName.disabled = false;
    catDesc.disabled = false;
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    deleteBtn.style.display = 'inline-block';
    updateDescMetrics();
  });

  saveBtn.addEventListener('click', () => {
    catName.disabled = true;
    catDesc.disabled = true;
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    updateDescMetrics();
    console.log('Saved:', {
      name: catName.value,
      description: catDesc.value
    });
  });

  catDesc.addEventListener('input', updateDescMetrics);
  updateDescMetrics();
});
function toggleDetails() {
  const scroll = document.getElementById("catProfileScroll");
  const shop = document.getElementById("shop");
  const mailbox = document.getElementById("mailbox");

  const isOpen = scroll.style.display === "block";
  scroll.style.display = isOpen ? "none" : "block";

  if (!isOpen) {
    shop.style.display = "none";
    mailbox.style.display = "none";
  }
}
window.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username") || "Guest";
  document.getElementById("welcomeMessage").textContent = `Welcome, ${username}`;
});

