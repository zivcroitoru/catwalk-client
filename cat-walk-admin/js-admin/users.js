import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);


const rectangle = document.querySelector('.rectangle');


const catImage = document.querySelector('.category .cats');
const clothesImage = document.querySelector('.category .clothes');
const catCount = document.querySelector('.category .cat-count');
const clothesCount = document.querySelector('.category .clothes-count');


const catColor = '#ffffffff';
const clothesColor = '#838e84';
const defaultColor = '#ffffff';

catImage.addEventListener('click', () => {
  rectangle.style.backgroundColor = catColor;
  console.log("cat");
});

clothesImage.addEventListener('click', () => {
  rectangle.style.backgroundColor = clothesColor;
  console.log("clothes");

});

clothesCount.addEventListener('click', () => {
  rectangle.style.backgroundColor = clothesColor;
  console.log("clothes");

});

catCount.addEventListener('click', () => {
  rectangle.style.backgroundColor = catColor;
  console.log("cat");

});


