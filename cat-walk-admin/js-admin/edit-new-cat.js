// edit.js
import { APP_URL } from "../../js/core/config.js";

window.addEventListener('DOMContentLoaded', () => {
  console.log('APP_URL:', APP_URL);

  const savedSpriteURL = localStorage.getItem('spriteURL');
  if (savedSpriteURL) {
    const previewImg = document.getElementById('sprite');
    if (previewImg) {
      previewImg.src = savedSpriteURL;
    }
  }

 const fieldIds = [
    'cat-name',
    'cat-breed',
    'cat-variant',
    'cat-pallete',
    'cat-description'
  ];

  fieldIds.forEach((id) => {
    const p = document.getElementById(id);
    if (p) {
      p.contentEditable = true;
      p.style.borderBottom = '1px dashed #aaa';
      p.style.cursor = 'text';

      // Load saved value from sessionStorage
      const savedText = sessionStorage.getItem(id);
      if (savedText) {
        p.textContent = savedText;
      }

      // Save on blur
      p.addEventListener('blur', () => {
        sessionStorage.setItem(id, p.textContent);
        console.log(`Saved: ${id} = ${p.textContent}`);
      });

      // Save and blur on Enter
      p.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          p.blur();
        }
      });
    }
  });
});

// NEXT button handler: send cat data to backend
  const nextButton = document.querySelector('.next-button');

  nextButton.addEventListener('click', async () => {
    const catData = {
      template: document.getElementById('cat-name').textContent.trim(),
      breed: document.getElementById('cat-breed').textContent.trim(),
      variant: document.getElementById('cat-variant').textContent.trim(),
      pallete: document.getElementById('cat-pallete').textContent.trim(),
      description: document.getElementById('cat-description').textContent.trim(),
      sprite_url: document.getElementById('sprite').src
    };

    console.log('Sending cat data:', catData);

    try {
      const response = await fetch(`${APP_URL}/api/cats/catadd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(catData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to add cat: ${errorData.error || response.statusText}`);
        return;
      }

      alert('Cat added successfully!');

      // Clear sessionStorage so no stale data
      sessionStorage.clear();

      // Optionally redirect to cat list page
      // window.location.href = 'cat-database.html';

    } catch (error) {
      alert('Error adding cat: ' + error.message);
    }
  });


// Clear sessionStorage when user leaves page
window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem('spriteURL');
  const keysToClear = ['cat-name', 'cat-breed', 'cat-variant', 'cat-pallete', 'cat-description'];
  keysToClear.forEach(key => sessionStorage.removeItem(key));
});