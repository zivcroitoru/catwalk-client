document.addEventListener('DOMContentLoaded', () => {
  const tableContainer = document.querySelector('.table');

  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';

  // Create header row based on your columns
  const headerRow = document.createElement('tr');
  const columns = ['ID', 'Username', 'Coins', 'Cat Count', 'Last Login'];
  columns.forEach(colName => {
    const th = document.createElement('th');
    th.textContent = colName;
    th.style.border = '1px solid #ccc';
    th.style.padding = '10px';
    th.style.backgroundColor = '#ddd';
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Fetch players from the API
  fetch('/api/players')
    .then(response => response.json())
    .then(players => {
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
        table.appendChild(tr);
      });
    })
    .catch(error => {
      console.error('Error fetching players:', error);
    });

  tableContainer.appendChild(table);
});
