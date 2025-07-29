document.addEventListener('DOMContentLoaded', async () => {
  const tableContainer = document.querySelector('.table');

  const table = document.createElement('table');
  table.classList.add('user-table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';

  // Create header
  const headerRow = document.createElement('tr');
  const headers = ['ID', 'Username', 'Email', 'Coins', 'Cat Count', 'Last Login'];
  headers.forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    th.style.border = '1px solid #ccc';
    th.style.padding = '10px';
    th.style.backgroundColor = '#ddd';
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  try {
    const res = await fetch('http://localhost:3000/api/players'); // change if deployed
    const players = await res.json();

    players.forEach(player => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${player.id}</td>
        <td>${player.username}</td>
        <td>${player.email || '-'}</td>
        <td>${player.coins}</td>
        <td>${player.cat_count}</td>
        <td>${player.last_logged_in ? new Date(player.last_logged_in).toLocaleDateString() : '-'}</td>
      `;
      table.appendChild(tr);
    });

    tableContainer.appendChild(table);

  } catch (err) {
    document.getElementById('warning').textContent = 'Failed to load players';
    console.error('Fetch error:', err);
  }
});
