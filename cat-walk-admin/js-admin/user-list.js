import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);



document.addEventListener('DOMContentLoaded', () => {
  const tableContainer = document.querySelector('.table');

  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.backgroundColor = 'white';
  console.log('Creating table with players data');

  const headerRow = document.createElement('tr');
  const columns = ['ID', 'Username', 'Coins', 'Cat Count', 'Last Login', 'GO']; 
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

        
        const actionTd = document.createElement('td');
        actionTd.style.border = '1px solid #ccc';
        actionTd.style.padding = '8px';
        actionTd.style.textAlign = 'center';

        const button = document.createElement('button');
        button.textContent = 'GO';
        button.style.padding = '6px 10px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            sessionStorage.setItem("selectedPlayerId", player.id);
           window.location.href = `chose-user.html?id=${player.id}`
        });

        actionTd.appendChild(button);
        tr.appendChild(actionTd);

        table.appendChild(tr);
      });


      
searchInput.addEventListener('input', () => {
  const filter = searchInput.value.toLowerCase().trim();
  const rows = table.querySelectorAll('tr');

  rows.forEach((row, index) => {
    if (index === 0) return;

    const idCell = row.children[0];
    const usernameCell = row.children[1];

    const id = idCell.textContent.toLowerCase();
    const username = usernameCell.textContent.toLowerCase();

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

  const [column, direction] = value.split('-');
  
  const rows = Array.from(table.querySelectorAll('tr')).slice(1); // skip header

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

    if (column === 'login') {
      aText = new Date(aText).getTime();
      bText = new Date(bText).getTime();
    }

    if (column === 'username') {
      if (direction === 'asc') return aText.localeCompare(bText);
      else return bText.localeCompare(aText);
    } else {
      aText = Number(aText);
      bText = Number(bText);
      if (direction === 'asc') return aText - bText;
      else return bText - aText;
    }
  });

  rows.forEach(row => table.appendChild(row));
});


    })
    .catch(error => {
      console.error('Error fetching players:', error);
    });

  tableContainer.appendChild(table);
});
