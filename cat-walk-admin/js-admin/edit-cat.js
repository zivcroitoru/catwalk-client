import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);
console.log(localStorage.getItem('selectedCat'));

const urlParams = new URLSearchParams(window.location.search);
const catId = urlParams.get('id');
console.log('Cat ID:', catId);

const selectedCat = JSON.parse(localStorage.getItem('selectedCat'));

if (!catId || !selectedCat) {
  console.error("Missing cat ID or data");
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const catImage = document.getElementById('cat-pic');
    const catName = document.getElementById('cat-name');
    const catBreed = document.getElementById('cat-breed');
    const catVariant = document.getElementById('cat-variant');
    const catColor = document.getElementById('cat-pallete');
    const catSprite = document.getElementById('cat-sprite');
    const deleteBtn = document.querySelector('.delete-button');
    const saveBtn = document.querySelector('.save-button');
    const cancelBtn = document.querySelector('.cancel-button');

    if (catImage) catImage.src = selectedCat.sprite_url;
    if (catName) catName.textContent = selectedCat.template;
    if (catBreed) catBreed.textContent = `BREED: ${selectedCat.breed}`;
    if (catVariant) catVariant.textContent = `VARIANT: ${selectedCat.variant}`;
    if (catColor) catColor.textContent = `PALLETE: ${selectedCat.pallete}`;
    if (catSprite) {
      catSprite.textContent = `SPRITE URL: ${selectedCat.sprite_url}`;

      catSprite.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = selectedCat.sprite_url;
        input.style.width = '100%';

        catSprite.textContent = '';
        catSprite.appendChild(input);
        input.focus();

        const save = async () => {
          const newSpriteUrl = input.value;
          selectedCat.sprite_url = newSpriteUrl;
          localStorage.setItem('selectedCat', JSON.stringify(selectedCat));
          catSprite.textContent = `SPRITE URL: ${newSpriteUrl}`;

          try {
            const response = await fetch(`${APP_URL}/api/cats/allcats/${selectedCat.cat_id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
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

        input.addEventListener('blur', save);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') input.blur();
        });
      });
    }

    // ✅ Moved OUTSIDE the catSprite click block
    cancelBtn?.addEventListener('click', () => {
      window.location.href = 'cat-database.html';
    });

    deleteBtn?.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this cat? This action cannot be undone.')) return;

      try {
        const response = await fetch(`${APP_URL}/api/cats/delete/${selectedCat.cat_id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete the cat');
        }

        alert('Cat deleted successfully.');
        window.location.href = 'cat-database.html';
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete the cat.');
      }
    });
  });
}
