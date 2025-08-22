import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

const uploadBtn = document.getElementById('uploadBtn');
const spriteInput = document.getElementById('spriteInput');
const nextButton = document.querySelector('.next-button');

uploadBtn.addEventListener('click', () => {
  if (spriteInput.style.display === 'none') {
    spriteInput.style.display = 'block';
    spriteInput.focus();
  }
});

nextButton.addEventListener('click', () => {
  const spriteURL = spriteInput.value.trim();

  if (spriteURL === '') {
    alert('Please enter a sprite URL before continuing.');
    return;
  }

  localStorage.setItem('spriteURL', spriteURL);

  window.location.href = 'new-name-clothes.html';
});
