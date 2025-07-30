// Determine the backend URL based on the environment
// const APP_URL = window.location.hostname === 'localhost'
//   ? 'http://localhost:3000'
//   : 'https://catwalk-server.onrender.com';
// import { APP_URL } from '../../js/main.js';
import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

document.addEventListener('DOMContentLoaded', () => {
  const tableContainer = document.querySelector('.table');

  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.backgroundColor = 'white'; // <-- Set table background to white
  console.log('Creating table with players data');

  // Create header row based on your columns
  const headerRow = document.createElement('tr');
  const columns = ['ID', 'Username', 'Coins', 'Cat Count', 'Last Login', 'GO']; // <-- Added 'Action' column
  columns.forEach(colName => {
    const th = document.createElement('th');
    th.textContent = colName;
    th.style.border = '1px solid #ccc';
    th.style.padding = '10px';
    th.style.backgroundColor = '#ddd';
    headerRow.appendChild(th);
    console.log(`Adding column: ${colName}`);
  });
  table.appendChild(headerRow);

  // Fetch players from the API //
  fetch(`${APP_URL}/api/players`)
    .then(response => response.json())
    .then(players => {
      console.log('Fetched players:', players);
      players.forEach(player => {
        const tr = document.createElement('tr');
        const values = [
          player.id,
          player.username,
          player.coins,
          player.cat_count,
          new Date(player.last_logged_in).toLocaleDateString()
        ];
        values.forEach(value => {
          const td = document.createElement('td');
          td.textContent = value;
          td.style.border = '1px solid #ccc';
          td.style.padding = '8px';
          td.style.textAlign = 'center';
          tr.appendChild(td);
        });

        
        // Add action button in new column
        const actionTd = document.createElement('td');
        actionTd.style.border = '1px solid #ccc';
        actionTd.style.padding = '8px';
        actionTd.style.textAlign = 'center';

        const button = document.createElement('button');
        button.textContent = 'Go to page';
        button.style.padding = '6px 10px';
        button.style.cursor = 'pointer';

        // Navigate to chose-user.html with the player's ID
        button.addEventListener('click', () => {
            sessionStorage.setItem("selectedPlayerId", player.id);
           window.location.href = `chose-user.html?id=${player.id}`
        });

        actionTd.appendChild(button);
        tr.appendChild(actionTd);

        table.appendChild(tr);
      });
    })
    .catch(error => {
      console.error('Error fetching players:', error);
    });

  tableContainer.appendChild(table);
});
