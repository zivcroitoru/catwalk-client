// edit-cat.js
import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);
console.log(localStorage.getItem('selectedCat'));

// 1. Get the selected cat ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const catId = urlParams.get('id');

// 2. Get the selectedCat object from localStorage (optional, for more data)
const selectedCat = JSON.parse(localStorage.getItem('selectedCat'));

if (!catId || !selectedCat) {
  console.error("Missing cat ID or data");
  // Optionally redirect or show an error message
} else {
  // 3. Populate the page with the cat's data
  document.addEventListener('DOMContentLoaded', () => {
    // Example elements:
    const catImage = document.getElementById('cat-pic'); // <img>
    const catName = document.getElementById('cat-name');   // <h2> or <input>
    const catBreed = document.getElementById('cat-breed'); // <p> or <select>
    const catVariant = document.getElementById('cat-variant');     // <p> or
    const catColor = document.getElementById('cat-pallete'); // <p> or <select>
    const catSprite = document.getElementById('cat-sprite'); // <p> or <input>
         const deleteBtn = document.querySelector('.delete-button-clothes');


    // Display data
    if (catImage) catImage.src = selectedCat.sprite_url;
    if (catName) catName.textContent = selectedCat.template; // or .value for <input>
    if (catBreed) catBreed.textContent = `BREED: ${selectedCat.breed}`; // or .value for <input>
    if (catVariant) catVariant.textContent = `VARIANT: ${selectedCat.variant}`; // or .value
    if (catColor) catColor.textContent = `PALLETE: ${selectedCat.pallete}`; // or .value for <input>
    if (catSprite) {
      catSprite.textContent = `SPRITE URL: ${selectedCat.sprite_url}`;

      // Make editable on click
      catSprite.addEventListener('click', () => {
        // Create an input field with current sprite URL
        const input = document.createElement('input');
        input.type = 'text';
        input.value = selectedCat.sprite_url;
        input.style.width = '100%';

        // Replace the text with the input
        catSprite.textContent = '';
        catSprite.appendChild(input);
        input.focus();

        // Save on blur or Enter
        const save = async () => {
          const newSpriteUrl = input.value;
          selectedCat.sprite_url = newSpriteUrl;
          localStorage.setItem('selectedCat', JSON.stringify(selectedCat));
          catSprite.textContent = `SPRITE URL: ${newSpriteUrl}`;

          try {
            const response = await fetch(`${APP_URL}/api/cats/allcats/${selectedCat.cat_id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ sprite_url: newSpriteUrl })
            });

            if (!response.ok) {
              throw new Error('Failed to update sprite_url');
            }

            console.log('Sprite URL updated successfully');
          } catch (err) {
            console.error('Error saving to server:', err);
            alert('Failed to save sprite URL to the database.');
          }
        };
// CANCEL button click handler
    cancelBtn.addEventListener('click', () => {
      window.location.href = 'cat-database.html';
    });

    // DELETE button click handler
    deleteBtn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this clothing item? This action cannot be undone.')) {
        return;
      }

      try {
        const response = await fetch(`${APP_URL}/api/cats/delete/${selectedCat.catId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete the cat');
        }

        alert('cat deleted successfully.');
        window.location.href = 'cat-database.html';
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete the cat.');
      }
    });
  });
}



  });
}
