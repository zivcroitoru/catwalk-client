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
  const template = document.getElementById('clothes-template')?.textContent.trim();
  const name = document.getElementById('clothes-name')?.textContent.trim();
  const category = document.getElementById('clothes-category')?.textContent.trim();
  const price = document.getElementById('clothes-price')?.textContent.trim();
  const description = document.getElementById('clothes-description')?.textContent.trim();
  const sprite_url_preview = document.getElementById('clothes-sprite-preview')?.textContent.trim()
  const sprite_url = spriteImage?.src;


  document.getElementById('clothes-template').textContent = truncateText(templateFull, 20);
  document.getElementById('clothes-name').textContent = truncateText(nameFull, 20);
  document.getElementById('clothes-category').textContent = truncateText(categoryFull, 20);
  document.getElementById('clothes-price').textContent = truncateText(priceFull, 20);
  document.getElementById('clothes-description').textContent = truncateText(descriptionFull, 30);
  document.getElementById('clothes-sprite-preview').textContent = truncateText(previewFull, 30);
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
