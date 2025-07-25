// Register handler
async function handleRegister(event) {
  event.preventDefault();

  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;

  try {
    const response = await fetch("http://localhost:3000/auth/signup", {
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
      // Optionally redirect to login page
      // window.location.href = "login.html";
    } else {
      showError(result.error || "Signup failed");
    }
  } catch (error) {
    showError("Network error. Please try again.");
  }
}

// Login handler
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;

  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include', // Include cookies for session
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

    // Success: redirect user
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
window.handleRegister = handleRegister;
