import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

const tableContainer = document.querySelector('.table');

  async function loadTickets() {
    try {
      const res = await fetch('https://catwalk-server.onrender.com/api/admin/tickets');
      const tickets = await res.json();

      const table = document.createElement('table');
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';

      const headers = ['Ticket ID', 'Subject', 'Player', 'Status', 'Last Activity'];
      const headerRow = document.createElement('tr');
      headers.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        th.style.border = '1px solid #ccc';
        th.style.padding = '8px';
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      tickets.forEach(t => {
        const row = document.createElement('tr');
        const cells = [
          t.id,
          t.subject,
          t.player_username,
          t.status,
          new Date(t.last_activity_at).toLocaleString()
        ];
        cells.forEach(c => {
          const td = document.createElement('td');
          td.textContent = c;
          td.style.border = '1px solid #ccc';
          td.style.padding = '8px';
          row.appendChild(td);
        });
        table.appendChild(row);
      });

      tableContainer.appendChild(table);

    } catch (err) {
      console.error('Failed to load tickets:', err);
      document.getElementById('warning').textContent = 'Could not load admin tickets';
    }
  }

  loadTickets();