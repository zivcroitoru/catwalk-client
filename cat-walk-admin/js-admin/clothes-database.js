import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

let clothesData = [];
let filteredClothes = [];
let currentPage = 1;
const clothesPerPage = 6;
let selectedCloth = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(`${APP_URL}/api/shop/allclothes`); // update endpoint as needed
    clothesData = await response.json();
    filteredClothes = clothesData;

    if (!Array.isArray(clothesData) || clothesData.length === 0) {
      document.querySelector('.clothesype').textContent = 'No clothes available';
      return;
    }

    // ❤️ Fix search input selector — get input element, not its container div
    const searchInput = document.querySelector('.search-bar input'); // ❤️ changed here
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchValue = e.target.value.toLowerCase();
        filteredClothes = clothesData.filter(cloth =>
          (cloth.template && cloth.template.toLowerCase().includes(searchValue)) ||
          (cloth.category && cloth.category.toLowerCase().includes(searchValue))
        );
        currentPage = 1;
        document.getElementById('sortSelect').value = ''; // ❤️ reset sort dropdown on search
        renderClothesPage();
      });
    }

    // ❤️ Add sort select event listener here (after clothesData is loaded)
    document.getElementById('sortSelect').addEventListener('change', (e) => {
      const sortValue = e.target.value;

      if (sortValue === 'name-asc') {
        filteredClothes.sort((a, b) => (a.template || '').localeCompare(b.template || ''));
      } else if (sortValue === 'name-desc') {
        filteredClothes.sort((a, b) => (b.template || '').localeCompare(a.template || ''));
      } else if (
        sortValue === 'accessories' ||
        sortValue === 'eyes' ||
        sortValue === 'hats' ||
        sortValue === 'jackets' ||
        sortValue === 'mustaches' ||
        sortValue === 'tops'
      ) {
        // Filter by category ❤️
        filteredClothes = clothesData.filter(cloth => cloth.category === sortValue);
      } else {
        // No sort or filter — reset filteredClothes to full clothesData
        filteredClothes = clothesData;
      }

      currentPage = 1; // reset to first page after sorting/filtering
      renderClothesPage();
    });

    renderClothesPage();
  } catch (err) {
    console.error('Failed to load clothes:', err);
    document.getElementById('warning').textContent = 'Error loading clothes data.';
  }
});

function renderClothesPage() {
  const gridWrapper = document.querySelector('.grid-wrapper-clothes');
  const pageDisplay = document.querySelector('.pages p');
  const bigImg = document.querySelector('.clothes-pic-data');
  const clothTypeLabel = document.querySelector('.clothesype');

  gridWrapper.innerHTML = '';

  if (filteredClothes.length === 0) {
    gridWrapper.innerHTML = '<p style="color:red;">No clothes found.</p>';
    pageDisplay.textContent = '0/0';
    clothTypeLabel.textContent = '';
    bigImg.src = '';
    updateArrowOpacity();
    return;
  }

  const start = (currentPage - 1) * clothesPerPage;
  const currentClothes = filteredClothes.slice(start, start + clothesPerPage);

  currentClothes.forEach((cloth, index) => {
    const img = document.createElement('img');
    img.src = cloth.sprite_url_preview;
    img.className = 'users-stuff';
    img.width = 150;
    img.height = 150;

    gridWrapper.appendChild(img);

    img.addEventListener('click', () => {
      bigImg.src = cloth.sprite_url_preview;
      clothTypeLabel.textContent = cloth.template || cloth.category;
      selectedCloth = cloth;
    });

    if (index === 0) {
      bigImg.src = cloth.sprite_url_preview;
      clothTypeLabel.textContent = cloth.template || cloth.category;
      selectedCloth = cloth;
    }
  });

  const totalPages = Math.ceil(filteredClothes.length / clothesPerPage);
  pageDisplay.textContent = `${currentPage}/${totalPages}`;
  updateArrowOpacity();
}

function updateArrowOpacity() {
  const leftArrow = document.querySelector('.arrow-left');
  const rightArrow = document.querySelector('.arrow-right');
  const totalPages = Math.ceil(filteredClothes.length / clothesPerPage);

  if (currentPage <= 1) {
    leftArrow.style.opacity = '0.3';
    leftArrow.style.pointerEvents = 'none';
  } else {
    leftArrow.style.opacity = '1';
    leftArrow.style.pointerEvents = 'auto';
  }

  if (currentPage >= totalPages) {
    rightArrow.style.opacity = '0.3';
    rightArrow.style.pointerEvents = 'none';
  } else {
    rightArrow.style.opacity = '1';
    rightArrow.style.pointerEvents = 'auto';
  }
}

// Pagination controls
document.querySelector('.arrow-left').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderClothesPage();
  }
});

document.querySelector('.arrow-right').addEventListener('click', () => {
  const totalPages = Math.ceil(filteredClothes.length / clothesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderClothesPage();
  }
});

// Optionally add click-to-edit or redirect functionality on the big image
document.querySelector('.clothes-pic-data').addEventListener('click', () => {
  if (selectedCloth) {
    localStorage.setItem('selectedCloth', JSON.stringify(selectedCloth));
    window.location.href = `edit-clothes.html?id=${selectedCloth.item_id}`;
  }
});
