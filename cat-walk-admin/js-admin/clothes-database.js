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
    const clothImage = document.querySelector('.cat-pic-data');
    const clothName = document.querySelector('.clothes-name');
    const clothIdField = document.querySelector('.clothes-id');
    const clothDate = document.querySelector('.clothes-date');
    const saveBtn = document.querySelector('.save-button');
    const cancelBtn = document.querySelector('.cancel-button');

    // Prefill data
    if (clothImage) clothImage.src = selectedCloth.sprite_url_preview;
    if (clothName) clothName.textContent = selectedCloth.template || selectedCloth.category || 'Unnamed Cloth';
    if (clothIdField) clothIdField.textContent = `CLOTHES ID: ${selectedCloth.item_id}`;
    if (clothDate) clothDate.textContent = `CREATED: ${selectedCloth.created_at?.split('T')[0] || 'N/A'}`;

    // Optional: make sprite URL editable on image click
    clothImage.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = selectedCloth.sprite_url_preview;
      input.style.width = '100%';
      input.style.fontSize = '14px';
      clothImage.replaceWith(input);
      input.focus();

      input.addEventListener('blur', () => {
        selectedCloth.sprite_url_preview = input.value;
        localStorage.setItem('selectedCloth', JSON.stringify(selectedCloth));
        location.reload(); // Re-render with new image
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
            // add other editable fields if needed
          })
        });

        if (!response.ok) throw new Error('Failed to update clothes');

        const data = await response.json();
        console.log('Clothes updated successfully:', data);
        alert('Changes saved successfully!');
      } catch (err) {
        console.error('Save error:', err);
        alert('Failed to save changes.');
      }
    });

    // CANCEL
    cancelBtn.addEventListener('click', () => {
      window.location.href = 'clothes-database.html';
    });
  });
}
