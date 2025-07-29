const APP_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://catwalk-server.onrender.com';
console.log(window.location.hostname, 'using backend URL:', APP_URL);

// 1. Get ID from URL
const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get('id');

if (!playerId) {
  alert('No player ID provided.');
} else {
  // 2. Fetch player data
  fetch(`${APP_URL}/api/players/${playerId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Player not found');
      }
      return response.json();
    })
    .then(player => {
      // 3. Show player info on page
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
      console.error('Error:', error);
      //   console.log(playerId, player.username, player.coins, player.cat_count);
      alert('Failed to fetch player info.');
    });
}

//////////////////After showing player info:



fetch(`${APP_URL}/api/players/${playerId}/cats`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch cat images');
    }
    return response.json();
  })
  .then(catSprites => {
    const catImagesContainer = document.getElementById('cat-images');
    catImagesContainer.innerHTML = ''; // Clear existing content

    if (catSprites.length === 0) {
      catImagesContainer.innerHTML = '<p>No cats found.</p>';
    } else {
      catSprites.forEach(cat => {
        const img = document.createElement('img');
        img.src = cat.sprite_url;
        img.className = 'users-stuff';
        img.width = 224;
        img.height = 224;
        catImagesContainer.appendChild(img);
      });
    }
    const catCountElement = document.querySelector('.cat-count');
    catCountElement.textContent = `CATS: ${catSprites.length}`;

  })
  .catch(error => {
    console.error('Error loading cat images:', error);
  });




/////table change

const rectangle = document.querySelector('.rectangle');

// Select cat and clothes images inside .category
const catImage = document.querySelector('.category .cats');
const clothesImage = document.querySelector('.category .clothes');
const catCount = document.querySelector('.category .cat-count');
const clothesCount = document.querySelector('.category .clothes-count');

// Define colors to toggle (you can customize these)
const catColor = '#ffffffff';      // pinkish for cat
const clothesColor = '#838e84';  // greenish for clothes
const defaultColor = '#ffffff';  // original white

// When clicking the cat image
catImage.addEventListener('click', () => {
  rectangle.style.backgroundColor = catColor;
  console.log("cat");
});

// When clicking the clothes image
clothesImage.addEventListener('click', () => {
  rectangle.style.backgroundColor = clothesColor;
  console.log("clothes");

});

clothesCount.addEventListener('click', () => {
  rectangle.style.backgroundColor = clothesColor;
  console.log("clothes");

});

catCount.addEventListener('click', () => {
  rectangle.style.backgroundColor = catColor;
  console.log("cat");

});


