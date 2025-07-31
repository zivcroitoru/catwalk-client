import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);
console.log(localStorage.getItem('selectedCat'));

const urlParams = new URLSearchParams(window.location.search);
const catId = urlParams.get('id');
let selectedCat = JSON.parse(localStorage.getItem('selectedCat'));

if (!catId || !selectedCat) {
  console.error("Missing cat ID or data");
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const catImage = document.getElementById('cat-pic');
    const catName = document.getElementById('cat-name'); // maybe an <input>
    const catBreed = document.getElementById('cat-breed');
    const catVariant = document.getElementById('cat-variant');
    const catColor = document.getElementById('cat-pallete');
    const catSprite = document.getElementById('cat-sprite');
    const saveBtn = document.getElementById('save-btn');

    // Prefill data
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

        input.addEventListener('blur', () => {
          selectedCat.sprite_url = input.value;
          localStorage.setItem('selectedCat', JSON.stringify(selectedCat));
          catSprite.textContent = `SPRITE URL: ${input.value}`;
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') input.blur();
        });
      });
    }

    // SAVE BUTTON HANDLER
    saveBtn.addEventListener('click', async () => {
      try {
        const response = await fetch(`${APP_URL}/api/cats/allcats/${selectedCat.cat_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sprite_url: selectedCat.sprite_url // Add more fields as needed
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update cat');
        }

        const data = await response.json();
        console.log('Cat updated successfully:', data);
        alert('Changes saved successfully!');
      } catch (err) {
        console.error('Save error:', err);
        alert('Failed to save changes.');
      }
    });
  });
}
