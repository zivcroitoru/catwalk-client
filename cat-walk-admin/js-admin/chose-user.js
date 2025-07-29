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
        <h2>Username: ${player.username}</h2>
        <p>Coins: ${player.coins}</p>
        <p>Cat count: ${player.cat_count}</p>
      `;
    })
    .catch(error => {
      console.error('Error:', error);
    //   console.log(playerId, player.username, player.coins, player.cat_count);
      alert('Failed to fetch player info.');
    });
}
