import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);



const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get('player_id');
const itemIndex = Number(urlParams.get('item_index') || 0);


if (!playerId || isNaN(itemIndex)) {
  alert('Missing or invalid player ID or item index.');
} else {
  fetch(`${APP_URL}/api/players/${playerId}/items`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch clothes');
      return res.json();
    })
    .then(items => {
      if (itemIndex < 0 || itemIndex >= items.length) {
        throw new Error('Item index out of range');
      }
      console.log('Fetched items:', items);
      const item = items[itemIndex];

      document.querySelector('.clothes-pic-data').src = item.sprite_url_preview;
      console.log('Clothing item data:', item);

      const ul = document.querySelector('.data-clothes');
      ul.innerHTML = `
        <li>NAME: ${item.name ?? 'N/A'}</li>
        <li>CATEGORY: ${item.category ?? 'N/A'}</li>
        <li>DESCRIPTION: ${item.description ?? 'N/A'}</li>
        <li>PRICE: ${item.price ?? 'N/A'} coins</li>
        <li>CREATED AT: ${new Date(item.created_at).toLocaleDateString() ?? 'N/A'}</li>
        <li>LAST UPDATED: ${new Date(item.last_updated_at).toLocaleDateString() ?? 'N/A'}</li>
      `;
    })
    .catch(err => {
      console.error(err);
      alert('Error loading clothing item: ' + err.message);
    });
}

// Set BACK button link
const backButton = document.getElementById('backButton');
if (playerId && backButton) {
  backButton.href = `chose-user.html?id=${playerId}`;
}
