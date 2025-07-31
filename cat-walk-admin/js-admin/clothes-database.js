import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

let clothesData = [];
let currentPage = 1;
const clothesPerPage = 6;
let selectedCloth = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(`${APP_URL}/api/clothes/all`); // update endpoint as needed
    clothesData = await response.json();

    if (!Array.isArray(clothesData) || clothesData.length === 0) {
      document.querySelector('.clothesype').textContent = 'No clothes available';
      return;
    }

    renderClothesPage();
  } catch (err) {
    console.error('Failed to load clothes:', err);
    document.getElementById('warning').textContent = 'Error loading clothes data.';
  }
});

function renderClothesPage() {
  const gridWrapper = document.querySelector('.grid-wrapper-cats');
  const pageDisplay = document.querySelector('.pages p');
  const bigImg = document.querySelector('.clothes-pic-data');
  const clothTypeLabel = document.querySelector('.clothesype');

  gridWrapper.innerHTML = '';

  const start = (currentPage - 1) * clothesPerPage;
  const currentClothes = clothesData.slice(start, start + clothesPerPage);

  currentClothes.forEach((cloth, index) => {
    const img = document.createElement('img');
    img.src = cloth.sprite_url;
    img.className = 'users-stuff';
    img.width = 150;
    img.height = 150;

    gridWrapper.appendChild(img);

    img.addEventListener('click', () => {
      bigImg.src = cloth.sprite_url;
      clothTypeLabel.textContent = cloth.template || cloth.type;
      selectedCloth = cloth;
    });

    if (index === 0) {
      bigImg.src = cloth.sprite_url;
      clothTypeLabel.textContent = cloth.template || cloth.type;
      selectedCloth = cloth;
    }
  });

  const totalPages = Math.ceil(clothesData.length / clothesPerPage);
  pageDisplay.textContent = `${currentPage}/${totalPages}`;
}

// Pagination controls
document.querySelector('.arrow-left').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderClothesPage();
  }
});

document.querySelector('.arrow-right').addEventListener('click', () => {
  const totalPages = Math.ceil(clothesData.length / clothesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderClothesPage();
  }
});

// Optionally add click-to-edit or redirect functionality on the big image
// document.querySelector('.clothes-pic-data').addEventListener('click', () => {
//   if (selectedCloth) {
//     localStorage.setItem('selectedCloth', JSON.stringify(selectedCloth));
//     window.location.href = `edit-cloth.html?id=${selectedCloth.cloth_id}`;
//   }
// });
