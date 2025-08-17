import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);
console.log(localStorage.getItem('selectedCloth'));

const urlParams = new URLSearchParams(window.location.search);
const clothId = urlParams.get('id');
let selectedCloth = JSON.parse(localStorage.getItem('selectedCloth'));

if (!clothId || !selectedCloth) {
  console.error("Missing cloth ID or data");
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const clothImage = document.querySelector('.clothes-pic-data');
    const clothName = document.querySelector('.clothes-name');
    const clothCategory = document.querySelector('.clothes-category');
    const clothSprite = document.querySelector('.clothes-sprite-url');
    const saveBtn = document.querySelector('.save-button');
    const cancelBtn = document.querySelector('.cancel-button');
     const deleteBtn = document.querySelector('.delete-button-clothes');

    // Prefill data
    if (clothImage) clothImage.src = selectedCloth.sprite_url_preview;
    if (clothName) clothName.textContent = selectedCloth.template;
    if (clothCategory) clothCategory.textContent = `CATEGORY: ${selectedCloth.category}`;
    if (clothSprite) clothSprite.textContent = `SPRITE URL: ${selectedCloth.sprite_url_preview}`;

clothSprite.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = selectedCloth.sprite_url_preview;
        input.style.width = '100%';
        clothSprite.textContent = '';
        clothSprite.appendChild(input);
        input.focus();

        input.addEventListener('blur', () => {
          selectedCloth.sprite_url_preview = input.value;
          localStorage.setItem('selectedCloth', JSON.stringify(selectedCloth));
          clothSprite.textContent = `SPRITE URL: ${input.value}`;
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') input.blur();
        });
      });
    


    // SAVE
    saveBtn.addEventListener('click', async () => {
      try {
        const response = await fetch(`${APP_URL}/api/shop/edit/${selectedCloth.item_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sprite_url_preview: selectedCloth.sprite_url_preview,
            // Add other fields if needed here
          })
        });

        if (!response.ok) throw new Error('Failed to update clothes');

        const data = await response.json();
        console.log('Clothes updated successfully:', data);
        alert('Changes saved successfully!');
        if (clothImage) clothImage.src = selectedCloth.sprite_url_preview;

      } catch (err) {
        console.error('Save error:', err);
        alert('Failed to save changes.');
      }
    });

// CANCEL button click handler
    cancelBtn.addEventListener('click', () => {
      window.location.href = 'clothes-database.html';
    });

    // DELETE button click handler
    deleteBtn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this clothing item? This action cannot be undone.')) {
        return;
      }

      try {
        const response = await fetch(`${APP_URL}/api/shop/delete/${selectedCloth.item_id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(template);
          throw new Error(errorData.error || 'Failed to delete the clothing item');
        }

        alert('Clothing item deleted successfully.');
        window.location.href = 'clothes-database.html';
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete the clothing item.');
      }
    });
  });
}