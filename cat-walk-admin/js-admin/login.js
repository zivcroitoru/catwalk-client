import { APP_URL } from "../../js/core/config.js";
// Determine the backend URL based on the environment
// const APP_URL = window.location.hostname === 'https://catwalk-server.onrender.com';
 
// import { APP_URL } from '../../js/main.js';
console.log('APP_URL:', APP_URL);

const designWidth = 1920;
    const designHeight = 1080;

    function scaleToFitScreen() {
      const scaleX = window.innerWidth / designWidth;
      const scaleY = window.innerHeight / designHeight;
      const scale = Math.min(scaleX, scaleY);

      const wrapper = document.querySelector('.scale-wrapper');
      if (wrapper) {
        wrapper.style.transform = `scale(${scale})`;

        // Center the wrapper in the viewport
        const left = (window.innerWidth - designWidth * scale) / 2;
        const top = (window.innerHeight - designHeight * scale) / 2;
        wrapper.style.left = `${left}px`;
        wrapper.style.top = `${top}px`;
      }
    }

    window.addEventListener('resize', scaleToFitScreen);
    window.addEventListener('DOMContentLoaded', scaleToFitScreen);


document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.querySelector('.login-button');
  const warning = document.getElementById('warning');

  loginButton.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Clear previous warning
    warning.textContent = '';

    if (!username || !password) {
      warning.textContent = 'Please enter both username and password.';
      warning.style.color = 'red';
      return;
    }

    try {
      const response = await fetch(`${APP_URL}/api/admins/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Try to parse error message from server JSON response
        let errorMsg = 'Invalid username or password.';
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMsg = errorData.message;
          } else if (errorData.error) {
            errorMsg = errorData.error;
          }
        } catch {
          // If parsing fails, keep default message
        }

        warning.textContent = errorMsg;
        warning.style.color = 'red';
        return;
      }


      const data = await response.json();

      if (data.success) {
        // Redirect on success
        window.location.href = 'users.html';
      } else {
        warning.textContent = data.message || 'Invalid username or password.';
        warning.style.color = 'red';
      }
    } catch (error) {
      console.error('Error during login:', error);
      warning.textContent = 'Something went wrong. Please try again.';
      warning.style.color = 'red';
    }
  });
});
