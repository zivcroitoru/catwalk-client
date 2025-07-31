import { APP_URL } from "../../js/core/config.js";
console.log(localStorage.getItem('selectedCat'));
console.log('APP_URL:', APP_URL);

document.addEventListener('DOMContentLoaded', async () => {
const urlParams = new URLSearchParams(window.location.search);
const template = urlParams.get('template');
    document.querySelector('.cat-name').textContent = 'No cat data';
    return;
  }

 );

  // Set basic info from localStorage
  document.querySelector('.cat-pic-data').src = selectedCat.sprite_url;
  document.querySelector('.cat-name').textContent = selectedCat.template;
  document.querySelector('.cat-id').textContent = `CAT ID: ${selectedCat.id}`;

  try {
    // Fetch template data from server
    const response = await fetch(`${APP_URL}/api/cats/template/${selectedCat.template}`);
    console.log('Template response:', response);
    console.log(selectedCat.template); 
    if (!response.ok) {
      throw new Error('Template not found');
    }

    const templateData = await response.json();

    // Update template-related UI
    const createdAt = new Date(templateData.created_at).toLocaleDateString();
    document.querySelector('.cat-date').textContent = `CREATED: ${createdAt}`;
    
  } catch (err) {
    console.error('Failed to fetch template data:', err);
    document.querySelector('.cat-date').textContent = 'CREATED: unknown';
  }

  // Optional: Button actions
  document.querySelector('.cancel-button').addEventListener('click', () => {
    window.location.href = 'cat-database.html';
  });

  document.querySelector('.delete-button').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to delete this cat?')) return;

    try {
      const res = await fetch(`${APP_URL}/api/cats/${selectedCat.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Cat deleted successfully.');
        window.location.href = 'cat-database.html';
      } else {
        alert('Failed to delete cat.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Server error.');
    }
  });

  document.querySelector('.save-button').addEventListener('click', () => {
    alert('Save feature not implemented yet.');
  });
