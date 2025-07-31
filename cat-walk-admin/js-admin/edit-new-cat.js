import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

// Get sprite URL from localStorage
const spriteURL = localStorage.getItem('spriteURL');
// console.log('Loaded sprite URL from localStorage:', spriteURL);

// Set the image preview if sprite URL exists
const spriteImage = document.getElementById('sprite');
if (spriteImage && spriteURL) {
  spriteImage.src = spriteURL;
}

// When "Next" button is clicked, gather cat data and POST to backend
document.querySelector('.next-button').addEventListener('click', async () => {
  const template = document.getElementById('cat-name')?.textContent.trim();
  const breed = document.getElementById('cat-breed')?.textContent.trim();
  const variant = document.getElementById('cat-variant')?.textContent.trim();
  const palette = document.getElementById('cat-pallete')?.textContent.trim();
  const description = document.getElementById('cat-description')?.textContent.trim();
  const sprite_url = spriteImage?.src;

  const catData = {
    template,
    breed,
    variant,
    palette,
    description,
    sprite_url,
  };

  console.log('Sending cat data:', catData);

  // Simple frontend validation
  if (!template || !breed || !variant || !palette || !description || !sprite_url) {
    alert("Please make sure all fields are filled in.");
    return;
  }

  try {
    const response = await fetch(`${APP_URL}/api/cats/catadd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(catData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Server returned error:", result);
      alert(`Failed to add cat: ${result.error || 'Unknown error'}`);
      return;
    }

    console.log("Cat added successfully:", result);
    alert("Cat added successfully!");

    // Redirect to success page or next step
    window.location.href = "add-cats.html"; // update path as needed
  } catch (err) {
    console.error("Error sending request:", err);
    alert("Network or server error. Please try again later.");
  }
});
