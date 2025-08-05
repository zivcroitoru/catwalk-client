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
    th.style.color = 'white';
    th.style.border = '1px solid #ccc';
    th.style.padding = '10px';
    th.style.backgroundColor = '#838E84';
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
        button.textContent = 'GO';
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


      
// STEP 2: Add search functionality AFTER table is built
searchInput.addEventListener('input', () => {
  const filter = searchInput.value.toLowerCase().trim();
  const rows = table.querySelectorAll('tr');

  rows.forEach((row, index) => {
    if (index === 0) return; // Skip header row

    const idCell = row.children[0];       // ID column
    const usernameCell = row.children[1]; // Username column

    const id = idCell.textContent.toLowerCase();
    const username = usernameCell.textContent.toLowerCase();

    // Show row if search matches ID or username
    if (id.includes(filter) || username.includes(filter)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

sortSelect.addEventListener('change', () => {
  const value = sortSelect.value;
  if (!value) return;

  // Split into column and direction
  const [column, direction] = value.split('-');
  
  const rows = Array.from(table.querySelectorAll('tr')).slice(1); // skip header

  // Map column names to index as before
  const columnIndexMap = {
    id: 0,
    username: 1,
    coins: 2,
    cat: 3,
    login: 4
  };

  const index = columnIndexMap[column];
  if (index === undefined) return;

  rows.sort((a, b) => {
    let aText = a.children[index].textContent;
    let bText = b.children[index].textContent;

    // Convert date for login column to timestamp for comparison
    if (column === 'login') {
      aText = new Date(aText).getTime();
      bText = new Date(bText).getTime();
    }

    // Numeric or string comparison
    if (column === 'username') {
      if (direction === 'asc') return aText.localeCompare(bText);
      else return bText.localeCompare(aText);
    } else {
      // numeric
      aText = Number(aText);
      bText = Number(bText);
      if (direction === 'asc') return aText - bText;
      else return bText - aText;
    }
  });

  // Re-append sorted rows
  rows.forEach(row => table.appendChild(row));
});


    })
    .catch(error => {
      console.error('Error fetching players:', error);
    });

  tableContainer.appendChild(table);
});
