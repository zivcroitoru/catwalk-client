import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);


let catsData = [];
let currentPage = 1;
const catsPerPage = 6;
let selectedCat = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(`${APP_URL}/api/cats/allcats`);
    catsData = await response.json();

    if (!Array.isArray(catsData) || catsData.length === 0) {
      document.querySelector('.catype').textContent = 'No cats available';
      return;
    }

    renderCatsPage();
  } catch (err) {
    console.error('Failed to load cats:', err);
    document.getElementById('warning').textContent = 'Error loading cat data.';
  }
});

function renderCatsPage() {
  const gridWrapper = document.querySelector('.grid-wrapper-cats');
  const pageDisplay = document.querySelector('.pages p');
  const bigImg = document.querySelector('.cat-pic-data');
  const catTypeLabel = document.querySelector('.catype');

  gridWrapper.innerHTML = '';

  const start = (currentPage - 1) * catsPerPage;
  const currentCats = catsData.slice(start, start + catsPerPage);

  currentCats.forEach((cat, index) => {
    const catCard = document.createElement('div');
    catCard.className = 'cat-card';

    const img = document.createElement('img');
    img.src = cat.sprite_url;
    img.className = 'users-stuff';
    img.width = 150;
    img.height = 150;

    const name = document.createElement('p');
    name.textContent = cat.type;
    name.className = 'cat-name';

    catCard.appendChild(img);
    catCard.appendChild(name);
    gridWrapper.appendChild(catCard);

    catCard.addEventListener('click', () => {
      bigImg.src = cat.sprite_url;
      catTypeLabel.textContent = cat.template;
      selectedCat = cat;
    });

    if (index === 0) {
      bigImg.src = cat.sprite_url;
      catTypeLabel.textContent = cat.template;
      selectedCat = cat;
    }
  });

  const totalPages = Math.ceil(catsData.length / catsPerPage);
  pageDisplay.textContent = `${currentPage}/${totalPages}`;
}

// Left/right pagination
document.querySelector('.arrow-left').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderCatsPage();
  }
});

document.querySelector('.arrow-right').addEventListener('click', () => {
  const totalPages = Math.ceil(catsData.length / catsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderCatsPage();
  }
});

// Redirect on big cat image click
document.querySelector('.cat-pic-data').addEventListener('click', () => {
  if (selectedCat) {
    localStorage.setItem('selectedCat', JSON.stringify(selectedCat));
    window.location.href = `edit-cat.html?id=${selectedCat.cat_id}`;
  }
});


