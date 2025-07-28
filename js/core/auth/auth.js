/*-----------------------------------------------------------------------------
  auth.js
-----------------------------------------------------------------------------*/
export function signOut() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

export async function fetchUser() {
  try {
    // const res = await fetch('https://catwalk-server.onrender.com/api/user', { credentials: 'include' });
    // const data = await res.json();
    const username = localStorage.getItem("username");
    document.getElementById("welcomeMessage").textContent = `Welcome, ${username || 'Guest'}`;
  } catch {
    document.getElementById("welcomeMessage").textContent = 'Welcome, Guest';
  }
}