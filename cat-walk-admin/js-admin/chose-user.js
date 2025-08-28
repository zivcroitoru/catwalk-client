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
const catCountElement = document.getElementById('showCatsBtn');
const clothesCountElement = document.getElementById('showClothesBtn');
const catImagesContainer = document.getElementById('cat-images');

const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');
const pageNumberText = document.querySelector('.pages p');

const showCatsBtn = document.getElementById('showCatsBtn');
const showClothesBtn = document.getElementById('showClothesBtn');

const catColor = '#ffffff';
const clothesColor = '#838e84';

const ITEMS_PER_PAGE = 9;
let currentView = 'cats';
let currentItems = [];
let currentPage = 1;
let totalPages = 1;

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
        <p>LAST LOGIN: ${new Date(player.last_logged_in).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
        <p>COINS: ${player.coins}</p>
        <p>CATS: ${player.cat_count}</p>
      `;
    })
    .catch(error => {
      console.error('Error fetching player info:', error);
      alert('Failed to fetch player info.');
    });
}

function fetchCounts() {
  if (!playerId) return;

  fetch(`${APP_URL}/api/players/${playerId}/cats`)
    .then(res => res.json())
    .then(data => {
      latestCatsCount = data.length;
      if (catCountElement) catCountElement.textContent = `CATS: ${latestCatsCount}`;
    })
    .catch(error => {
      console.error('Error fetching cats count:', error);
      if (catCountElement) catCountElement.textContent = 'CATS: 0';
    });

  fetch(`${APP_URL}/api/players/${playerId}/items`)
    .then(res => res.json())
    .then(data => {
      latestClothesCount = data.length;
      if (clothesCountElement) clothesCountElement.textContent = `CLOTHES: ${latestClothesCount}`;
    })
    .catch(error => {
      console.error('Error fetching clothes count:', error);
      if (clothesCountElement) clothesCountElement.textContent = 'CLOTHES: 0';
    });
}

function updatePagination() {
  pageNumberText.textContent = `${currentPage} / ${totalPages}`;
  arrowLeft.style.opacity = currentPage > 1 ? '1' : '0.3';
  arrowRight.style.opacity = currentPage < totalPages ? '1' : '0.3';
  arrowLeft.style.pointerEvents = currentPage > 1 ? 'auto' : 'none';
  arrowRight.style.pointerEvents = currentPage < totalPages ? 'auto' : 'none';
}

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
    const wrapper = document.createElement('div');
    wrapper.className = 'cat-card';

    const img = document.createElement('img');
    img.src = item.sprite_url_preview || item.sprite_url;
    img.className = 'users-stuff';
    img.width = 224;
    img.height = 224;
    img.alt = 'Item image';
    img.style.cursor = 'pointer';

    const label = document.createElement('p');

    const realIndex = startIndex + index;
    if (currentView === 'cats') {
      img.addEventListener('click', () => {
        window.location.href = `/cat-walk-admin/htmls/user-cat-data.html?player_id=${playerId}&cat_index=${realIndex}`;
      });
    } else {
      img.addEventListener('click', () => {
        window.location.href = `/cat-walk-admin/htmls/user-clothes-data.html?player_id=${playerId}&item_index=${realIndex}`;
      });
    }

    wrapper.appendChild(img);
    wrapper.appendChild(label);
    catImagesContainer.appendChild(wrapper);
  });

  updatePagination();
}

function setActiveButton(view) {
  if (view === 'cats') {
    showCatsBtn.classList.add('active');
    showClothesBtn.classList.remove('active');
  } else {
    showCatsBtn.classList.remove('active');
    showClothesBtn.classList.add('active');
  }
}

function fetchAndShowCats() {
  if (!playerId) return;
  fetch(`${APP_URL}/api/players/${playerId}/cats`)
    .then(res => res.json())
    .then(data => {
      currentView = 'cats';
      setActiveButton('cats');
      rectangle.style.backgroundColor = catColor;
      latestCatsCount = data.length;

      if (catCountElement) catCountElement.textContent = `CATS: ${latestCatsCount}`;
      if (clothesCountElement) clothesCountElement.textContent = `CLOTHES: ${latestClothesCount}`;

      currentItems = data;
      currentPage = 1;
      totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;
      showPage(currentPage);
    })
    .catch(() => {
      catImagesContainer.innerHTML = '<p>Error loading cats.</p>';
      pageNumberText.textContent = `0 / 0`;
    });
}

function fetchAndShowClothes() {
  if (!playerId) return;
  fetch(`${APP_URL}/api/players/${playerId}/items`)
    .then(res => res.json())
    .then(data => {
      currentView = 'clothes';
      setActiveButton('clothes');
      rectangle.style.backgroundColor = clothesColor;
      latestClothesCount = data.length;

      if (clothesCountElement) clothesCountElement.textContent = `CLOTHES: ${latestClothesCount}`;
      if (catCountElement) catCountElement.textContent = `CATS: ${latestCatsCount}`;

      currentItems = data;
      currentPage = 1;
      totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;
      showPage(currentPage);
    })
    .catch(() => {
      catImagesContainer.innerHTML = '<p>Error loading clothes.</p>';
      pageNumberText.textContent = `0 / 0`;
    });
}

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

showCatsBtn.addEventListener('click', fetchAndShowCats);
showClothesBtn.addEventListener('click', fetchAndShowClothes);

if (playerId) {
  fetchCounts();
  fetchAndShowCats();
}

