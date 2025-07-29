import { APP_URL } from "../../main.js";

// Handle registration
async function handleRegister(event) {
  event.preventDefault();

  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;

  try {
    const response = await fetch(`${APP_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include', // Include cookies for session
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok) {
      alert("Account created successfully!");
      console.log("Registration successful");
      // Optionally redirect to login page
      // window.location.href = "login.html";
    } else {
      showError(result.error || "Signup failed");
    }
  } catch (error) {
    console.error(error);
    showError("Network error. Please try again.");
  }
}
window.handleRegister = handleRegister;

// Handle login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;

  try {
    const res = await fetch(`${APP_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid JSON response from server");
    }

    if (!res.ok) {
      showError(data?.error || "Login failed");
      return;
    }

    // Success: store username and redirect
    localStorage.setItem("username", data.username);
    localStorage.setItem("userId", data.userId);
    window.location.href = "album.html";
  } catch (err) {
    console.error(err);
    showError("Something went wrong. Please try again.");
  }
});

// Display welcome message if username is stored
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username") || "Guest";
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.textContent = `Welcome, ${username}`;
  }
});

// Sign out
export function signOut() {
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  localStorage.removeItem("userItems");
  window.location.href = "login.html";
}
window.signOut = signOut;

// Display error messages
function showError(msg) {
  const warningBox = document.querySelector(".warning-box");
  if (!warningBox) return;

  if (!msg) {
    warningBox.style.display = "none";
    warningBox.textContent = "";
    return;
  }
  warningBox.textContent = msg;
  warningBox.style.color = "red";
  warningBox.style.display = "block";
}
