// const APP_URL = window.location.hostname === 'localhost'
//   ? 'http://localhost:3000'
//   : 'https://catwalk-server.onrender.com';


import { APP_URL } from '../../js/main.js';


console.log(window.location.hostname, 'using backend URL:', APP_URL);

// Get player ID from URL
const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get('id');
console.log('player_id:', playerId);

if (!playerId) {
  alert('No player ID provided.');
}

const rectangle = document.querySelector('.rectangle');
const catImage = document.querySelector('.category .cats');
const clothesImage = document.querySelector('.category .clothes');
const catCountElement = document.querySelector('.cat-count');
const clothesCountElement = document.querySelector('.clothes-count');
const catImagesContainer = document.getElementById('cat-images');

const catColor = '#ffffffff';     // white background for cats
const clothesColor = '#838e84';   // green background for clothes

let currentView = 'cats'; // Tracks what is currently shown

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

// Helper to show images in the container
function showImages(items) {
  catImagesContainer.innerHTML = '';

  if (items.length === 0) {
    catImagesContainer.innerHTML = '<p>No items found.</p>';
    return;
  }

  items.forEach((item, index) => {
    const img = document.createElement('img');
    img.src = item.sprite_url;
    img.className = 'users-stuff';
    img.width = 224;
    img.height = 224;
    img.alt = 'Item image';
    img.style.cursor = 'pointer';

    if (currentView === 'cats') {
      img.addEventListener('click', () => {
        window.location.href = `/cat-walk-admin/htmls/user-cat-data.html?player_id=${playerId}&cat_index=${index}`;
      });
    } else if (currentView === 'clothes') {
      img.addEventListener('click', () => {
        window.location.href = `/cat-walk-admin/htmls/user-clothes-data.html?player_id=${playerId}&item_index=${index}`;
      });
    }

    catImagesContainer.appendChild(img);
  });
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
      catCountElement.textContent = `CATS: ${data.length}`;
      showImages(data);
    })
    .catch(error => {
      console.error(error);
      catImagesContainer.innerHTML = '<p>Error loading cats.</p>';
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
      clothesCountElement.textContent = `CLOTHES: ${data.length}`;
      showImages(data);
    })
    .catch(error => {
      console.error(error);
      catImagesContainer.innerHTML = '<p>Error loading clothes.</p>';
    });
}

// Initial load - show cats by default
if (playerId) {
  fetchAndShowCats();
}

// Event listeners for toggling cats/clothes
catImage.addEventListener('click', fetchAndShowCats);
catCountElement.addEventListener('click', fetchAndShowCats);
clothesImage.addEventListener('click', fetchAndShowClothes);
clothesCountElement.addEventListener('click', fetchAndShowClothes);
