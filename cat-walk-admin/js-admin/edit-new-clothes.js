import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

// Load sprite image from localStorage and display it
const spriteURL = localStorage.getItem('spriteURL');
const spriteImage = document.getElementById('sprite');

if (spriteImage && spriteURL) {
  spriteImage.src = spriteURL;
}

// Handle NEXT button click
document.querySelector('.next-button').addEventListener('click', async () => {
  const template = document.getElementById('clothes-template')?.value;
  const name = document.getElementById('clothes-name')?.value;
  const category = document.getElementById('clothes-category')?.value;
  let price = document.getElementById('clothes-price')?.value;
  price = parseInt(price);
  const description = document.getElementById('clothes-description')?.value;
  const sprite_url_preview = document.getElementById('clothes-sprite-preview')?.value;
  const sprite_url = spriteImage?.src;

  const clothesData = {
    template,
    name,
    category,
    price,
    description,
    sprite_url_preview,
    sprite_url,
  };

  console.log('Sending clothes data:', clothesData);

  // Validate required fields
  if (!template || !name || !category || !price || !description || !sprite_url_preview || !sprite_url) {
    alert("Please fill in all fields before submitting.");
    return;
  }

  try {
    const response = await fetch(`${APP_URL}/api/shop/clothesadd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clothesData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Server error:", result);
      alert(`Failed to add clothes: ${result.error || 'Unknown error'}`);
      return;
    }

    alert("Clothing item added successfully!");
    window.location.href = "clothes-database.html"; // or wherever you want to go next

  } catch (err) {
    console.error("Request failed:", err);
    alert("Network or server error. Please try again.");
  }
});
