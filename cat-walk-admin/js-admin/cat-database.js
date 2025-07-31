import { APP_URL } from "../../js/core/config.js";

console.log(localStorage.getItem('selectedCat'));
console.log('lol APP_URL:', APP_URL);

let catsData = [];
let currentPage = 1;
const catsPerPage = 6;

// Get the selected cat from localStorage
let selectedCat = null;
const storedCat = localStorage.getItem('selectedCat');
if (storedCat) {
  selectedCat = JSON.parse(storedCat);
  console.log("Selected cat loaded:", selectedCat);

  // Example: update the UI with the selected cat info
  const bigCatImg = document.querySelector('.big-cat-img');
  const catName = document.querySelector('.cat-name');
  const catType = document.querySelector('.catype');

  if (bigCatImg && selectedCat.sprite_url) {
    bigCatImg.src = selectedCat.sprite_url;
  }

  if (catName && selectedCat.name) {
    catName.textContent = selectedCat.name;
  }

  if (catType && selectedCat.template) {
    catType.textContent = selectedCat.template;
  }
} else {
  console.warn("No selectedCat found in localStorage.");
}
