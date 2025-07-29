
document.addEventListener('DOMContentLoaded', () => {
  const tableContainer = document.querySelector('.table');

  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';

  const headerRow = document.createElement('tr');
  for (let col = 1; col <= 6; col++) {
    const th = document.createElement('th');
    th.textContent = `Column ${col}`;
    th.style.border = '1px solid #ccc';
    th.style.padding = '10px';
    th.style.backgroundColor = '#ddd';
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  for (let row = 1; row <= 20; row++) {
    const tr = document.createElement('tr');
    for (let col = 1; col <= 6; col++) {
      const td = document.createElement('td');
      td.textContent = `Row ${row}, Col ${col}`;
      td.style.border = '1px solid #ccc';
      td.style.padding = '8px';
      td.style.textAlign = 'center';
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  tableContainer.appendChild(table);
});
