// Import the base API URL
import { APP_URL } from "../../js/core/config.js";

console.log('APP_URL:', APP_URL);
console.log('Saved sprite URL:', localStorage.getItem('spriteURL'));

const savedSpriteURL = localStorage.getItem('spriteURL');

if (savedSpriteURL) {
  console.log('Sprite URL from previous page:', savedSpriteURL);

  // Example: show preview
  const previewImg = document.getElementById('sprite');
  console.log(document.getElementById('sprite')); // should not be null
  previewImg.src = savedSpriteURL;
}

