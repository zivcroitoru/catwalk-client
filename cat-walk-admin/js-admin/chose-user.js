import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

// Get player ID from URL
const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get('id');
console.log('player_id:', playerId);

let latestCatsCount = 0;
let latestClothesCount = 0;

if (!playerId) {
  alert('No player ID provided.');
}

const rectangle = document.querySelector('.rectangle');
const catImage = document.querySelector('.category .cats');
const clothesImage = document.querySelector('.category .clothes');
const catCountElement = document.querySelector('.cat-count');
const clothesCountElement = document.querySelector('.clothes-count');
const catImagesContainer = document.getElementById('cat-images');

const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');
const pageNumberText = document.querySelector('.pages p');

const catColor = '#ffffffff';     // white background for cats
const clothesColor = '#838e84';   // green background for clothes

const ITEMS_PER_PAGE = 9;

let currentView = 'cats'; // Tracks what is currently shown
let currentItems = [];    // All cats or clothes fetched
let currentPage = 1;
let totalPages = 1;

// Show player info
if (playerId) {
  fetch(`${APP_URL}/api/players/${playerId}`)
    .then(response => {
      if (!response.ok) throw new Error('Player not found');
      return response.json();
    })
    .then(player => {
      const container = document.getElementById('player-info');
      container.innerHTML = `
        <p>USERNAME: ${player.username}</p>
        <p>USER ID: ${player.id}</p>
        <p>LAST LOGIN: ${new Date(player.last_logged_in).toLocaleDateString()}</p>
        <p>COINS: ${player.coins}</p>
        <p>CATS: ${player.cat_count}</p>
      `;
    })
    .catch(error => {
      console.error('Error fetching player info:', error);
      alert('Failed to fetch player info.');
    });
}

// Fetch only counts for cats and clothes on page load
function fetchCounts() {
  if (!playerId) return;

  // Fetch cats count
  fetch(`${APP_URL}/api/players/${playerId}/cats`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch cats');
      return res.json();
    })
    .then(data => {
      latestCatsCount = data.length;
      catCountElement.textContent = `CATS: ${latestCatsCount}`;
    })
    .catch(error => {
      console.error('Error fetching cats count:', error);
      catCountElement.textContent = 'CATS: 0';
    });

  // Fetch clothes count
  fetch(`${APP_URL}/api/players/${playerId}/items`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch clothes');
      return res.json();
    })
    .then(data => {
      latestClothesCount = data.length;
      clothesCountElement.textContent = `CLOTHES: ${latestClothesCount}`;
    })
    .catch(error => {
      console.error('Error fetching clothes count:', error);
      clothesCountElement.textContent = 'CLOTHES: 0';
    });
}

// Update pagination display and arrow button states
function updatePagination() {
  pageNumberText.textContent = `${currentPage} / ${totalPages}`;

  arrowLeft.style.opacity = currentPage > 1 ? '1' : '0.3';
  arrowRight.style.opacity = currentPage < totalPages ? '1' : '0.3';
  arrowLeft.style.pointerEvents = currentPage > 1 ? 'auto' : 'none';
  arrowRight.style.pointerEvents = currentPage < totalPages ? 'auto' : 'none';
}

// Show images for the given page number
function showPage(page) {
  if (!currentItems.length) {
    catImagesContainer.innerHTML = '<p>No items found.</p>';
    pageNumberText.textContent = `0 / 0`;
    return;
  }

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageItems = currentItems.slice(startIndex, endIndex);

  catImagesContainer.innerHTML = '';

  pageItems.forEach((item, index) => {
    const img = document.createElement('img');
    img.src = item.sprite_url_preview || item.sprite_url;
    img.className = 'users-stuff';
    img.width = 224;
    img.height = 224;
    img.alt = 'Item image';
    img.style.cursor = 'pointer';

    // Calculate real index in the full list for URL
    const realIndex = startIndex + index;

    if (currentView === 'cats') {
      img.addEventListener('click', () => {
        window.location.href = `/cat-walk-admin/htmls/user-cat-data.html?player_id=${playerId}&cat_index=${realIndex}`;
      });
    } else if (currentView === 'clothes') {
      img.addEventListener('click', () => {
        window.location.href = `/cat-walk-admin/htmls/user-clothes-data.html?player_id=${playerId}&item_index=${realIndex}`;
      });
    }

    catImagesContainer.appendChild(img);
  });

  updatePagination();
}

// Fetch and show cats
function fetchAndShowCats() {
  if (!playerId) return;
  fetch(`${APP_URL}/api/players/${playerId}/cats`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch cats');
      return res.json();
    })
    .then(data => {
      currentView = 'cats';
      rectangle.style.backgroundColor = catColor;
      latestCatsCount = data.length;

      // Update counts, keep clothes count too
      catCountElement.textContent = `CATS: ${latestCatsCount}`;
      clothesCountElement.textContent = `CLOTHES: ${latestClothesCount}`;

      currentItems = data;
      currentPage = 1;
      totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;
      showPage(currentPage);
    })
    .catch(error => {
      console.error(error);
      catImagesContainer.innerHTML = '<p>Error loading cats.</p>';
      pageNumberText.textContent = `0 / 0`;
    });
}

// Fetch and show clothes
function fetchAndShowClothes() {
  if (!playerId) return;
  fetch(`${APP_URL}/api/players/${playerId}/items`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch clothes');
      return res.json();
    })
    .then(data => {
      currentView = 'clothes';
      rectangle.style.backgroundColor = clothesColor;
      latestClothesCount = data.length;

      // Update counts, keep cats count too
      clothesCountElement.textContent = `CLOTHES: ${latestClothesCount}`;
      catCountElement.textContent = `CATS: ${latestCatsCount}`;

      currentItems = data;
      currentPage = 1;
      totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;
      showPage(currentPage);
    })
    .catch(error => {
      console.error(error);
      catImagesContainer.innerHTML = '<p>Error loading clothes.</p>';
      pageNumberText.textContent = `0 / 0`;
    });
}

// Arrow buttons click handlers
arrowLeft.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    showPage(currentPage);
  }
});

arrowRight.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    showPage(currentPage);
  }
});

// Initial load - fetch counts and show cats by default
if (playerId) {
  fetchCounts();       // fetch and display counts immediately
  fetchAndShowCats();  // show cats grid by default
}

// Event listeners for toggling cats/clothes
catImage.addEventListener('click', fetchAndShowCats);
catCountElement.addEventListener('click', fetchAndShowCats);
clothesImage.addEventListener('click', fetchAndShowClothes);
clothesCountElement.addEventListener('click', fetchAndShowClothes);
