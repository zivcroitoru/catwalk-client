import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

const spriteURL = localStorage.getItem('spriteURL');

const spriteImage = document.getElementById('sprite');
if (spriteImage && spriteURL) {
  spriteImage.src = spriteURL;
}

document.querySelector('.next-button').addEventListener('click', async () => {
  const template = document.getElementById('cat-name')?.value;
  const breed = document.getElementById('cat-breed')?.value;
  const variant = document.getElementById('cat-variant')?.value;
  const palette = document.getElementById('cat-pallete')?.value;
  const description = document.getElementById('cat-description')?.value;
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

    window.location.href = "add-cats.html";
  } catch (err) {
    console.error("Error sending request:", err);
    alert("Network or server error. Please try again later.");
  }
});
