const APP_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://catwalk-server.onrender.com';

// import { APP_URL } from '../../js/main.js';


// Get params from URL
const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get('player_id');
const catIndex = Number(urlParams.get('cat_index') || 0);


if (!playerId || isNaN(catIndex)) {
    alert('Missing or invalid player ID or cat index.');
} else {
    fetch(`${APP_URL}/api/cats/player/${playerId}`)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch cats');
            return res.json();
        })
        .then(cats => {
            if (catIndex < 0 || catIndex >= cats.length) {
                throw new Error('Cat index out of range');
            }

            const cat = cats[catIndex];

            document.querySelector('.cat-pic-data').src = cat.sprite_url;
            console.log('Cat data:', cat);

            const ul = document.querySelector('.data-cats');
            ul.innerHTML = `
        <li>ID: ${cat.cat_id ?? 'N/A'}</li>
        <li>NAME: ${cat.name ?? 'N/A'}</li>
        <li>BREED: ${cat.breed ?? 'N/A'}</li>
        <li>VARIANT: ${cat.variant ?? 'N/A'}</li>
        <li>PALLETE: ${cat.palette ?? 'N/A'}</li>
        <li>BIRTHDAY: ${cat.birthdate ?? 'N/A'}</li>
        <li>DESCRIPTION: ${cat.description ?? 'N/A'}</li>
      `;
        })
        .catch(err => {
            console.error(err);
            alert('Error loading cat data: ' + err.message);
        });
}

// Set BACK button link
const backButton = document.getElementById('backButton');
  if (playerId && backButton) {
    backButton.href = `chose-user.html?id=${playerId}`;
  }
