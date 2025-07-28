import { APP_URL } from "../../js/main";

async function handleRegister(event) {
      event.preventDefault();

      const username = document.querySelector('input[type="text"]').value;
      const password = document.querySelector('input[type="password"]').value;

      const response = await fetch(`${APP_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        console.log("u good");
        // window.location.href = "login.html";
      } else {
        document.querySelector(".warning-box").innerText = result.error || "Signup failed";
      }
    }


//login     
 document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;

  try {
    const res = await fetch(`${APP_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      throw new Error("Invalid JSON response from server");
    }

    if (!res.ok) {
      showError(data?.error || "Login failed");
      return; // stop here if login failed
    }

    // ✅ Success: redirect user
// Save username locally
localStorage.setItem("username", username);
// Redirect
window.location.href = "album.html";


  } catch (err) {
    console.error(err);
    showError("Something went wrong. Please try again.");
  }
});

function showError(msg) {
  const warningBox = document.querySelector(".warning-box");
  warningBox.textContent = msg;
  warningBox.style.color = "red";
}


document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username") || "Guest";
    const welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.textContent = `Welcome, ${username}`;
  });

  function signOut() {
  localStorage.removeItem("username");
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}
window.signOut = signOut;


function showError(msg) {
  const warningBox = document.querySelector(".warning-box");
  if (!msg) {
    warningBox.style.display = "none";
    warningBox.textContent = "";
    return;
  }
  warningBox.textContent = msg;
  warningBox.style.color = "red";
  warningBox.style.display = "block";
}
