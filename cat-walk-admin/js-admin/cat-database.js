import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

let catsData = [];
let filteredCats = [];
let currentPage = 1;
const catsPerPage = 6;
let selectedCat = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(`${APP_URL}/api/cats/allcats`);
    catsData = await response.json();
    filteredCats = catsData;

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

  // ADDED — handle no results
  if (filteredCats.length === 0) {
    gridWrapper.innerHTML = '<p style="color:red;">No cats found.</p>';
    pageDisplay.textContent = '0/0';
    catTypeLabel.textContent = '';
    bigImg.src = '';
    updateArrowOpacity();
    return;
  }

  const start = (currentPage - 1) * catsPerPage;
  const currentCats = filteredCats.slice(start, start + catsPerPage);

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

  const totalPages = Math.ceil(filteredCats.length / catsPerPage);
  pageDisplay.textContent = `${currentPage}/${totalPages}`;

  updateArrowOpacity();
}

// Added function to update arrow opacity and disable click on limits
function updateArrowOpacity() {
  const leftArrow = document.querySelector('.arrow-left');
  const rightArrow = document.querySelector('.arrow-right');
  const totalPages = Math.ceil(filteredCats.length / catsPerPage);

  if (currentPage <= 1) {
    leftArrow.style.opacity = '0.3';
    leftArrow.style.pointerEvents = 'none';  // disable click
  } else {
    leftArrow.style.opacity = '1';
    leftArrow.style.pointerEvents = 'auto';  // enable click
  }

  if (currentPage >= totalPages) {
    rightArrow.style.opacity = '0.3';
    rightArrow.style.pointerEvents = 'none'; // disable click
  } else {
    rightArrow.style.opacity = '1';
    rightArrow.style.pointerEvents = 'auto';  // enable click
  }
}

// Left/right pagination
document.querySelector('.arrow-left').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderCatsPage();
  }
});

document.querySelector('.arrow-right').addEventListener('click', () => {
  const totalPages = Math.ceil(filteredCats.length / catsPerPage); 
  if (currentPage < totalPages) {
    currentPage++;
    renderCatsPage();
  }
});

// Search input event
document.getElementById('searchInput').addEventListener('input', (e) => {
  const searchValue = e.target.value.toLowerCase();
  filteredCats = catsData.filter(cat =>
    cat.template.toLowerCase().includes(searchValue)
  );
  currentPage = 1;
  document.getElementById('sortSelect').value = '';
  renderCatsPage();
});

// SORT BY select event listener
document.getElementById('sortSelect').addEventListener('change', (e) => {
  const sortValue = e.target.value;

  if (sortValue === 'name-asc') {
    filteredCats.sort((a, b) => a.template.localeCompare(b.template));
  } else if (sortValue === 'name-desc') {
    filteredCats.sort((a, b) => b.template.localeCompare(a.template));
  } else {
    // No sorting applied
  }

  currentPage = 1; // reset to first page after sorting
  renderCatsPage();
});

// Redirect on big cat image click
document.querySelector('.cat-pic-data').addEventListener('click', () => {
  if (selectedCat) {
    localStorage.setItem('selectedCat', JSON.stringify(selectedCat));
    window.location.href = `edit-cat.html?id=${selectedCat.cat_id}`;
  }
});
