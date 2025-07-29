const APP_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://catwalk-server.onrender.com';

// Get params from URL
const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get('player_id');
const catIndex = Number(urlParams.get('cat_index'));

if (!playerId || isNaN(catIndex)) {
  alert('Missing or invalid player ID or cat index.');
} else {
  fetch(`${APP_URL}/api/players/${playerId}/cats`,)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch cats');
      return res.json();
    })
    .then(cats => {
      if (catIndex < 0 || catIndex >= cats.length) {
        throw new Error('Cat index out of range');
      }

      const cat = cats[catIndex];

      // Assuming your cat object has these fields (adjust if needed)
      // For example: id, name, type, variant, pallete, birthday, description, sprite_url

      document.querySelector('.cat-pic-data').src = cat.sprite_url;
      console.log('Cat data:', cat);
      const ul = document.querySelector('.data-cats');
      ul.innerHTML = `
        <li>ID: ${cat.id ?? 'N/A'}</li>
        <li>NAME: ${cat.name ?? 'N/A'}</li>
        <li>BREED: ${cat.breed ?? 'N/A'}</li>
        <li>VARIANT: ${cat.variant ?? 'N/A'}</li>
        <li>PALLETE: ${cat.palette ?? 'N/A'}</li>
        <li>BIRTHDAY: ${cat.birthday ?? 'N/A'}</li>
        <li>DESCRIPTION: ${cat.description ?? 'N/A'}</li>
      `;
    })
    .catch(err => {
      console.error(err);
      alert('Error loading cat data: ' + err.message);
    });
}
