async function handleRegister(event) {
      event.preventDefault();

      const username = document.querySelector('input[type="text"]').value;
      const password = document.querySelector('input[type="password"]').value;

      const response = await fetch("http://localhost:3000/auth/signup", {
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
    const res = await fetch("http://localhost:3000/auth/login", {
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
