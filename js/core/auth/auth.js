/*-----------------------------------------------------------------------------
  auth.js
-----------------------------------------------------------------------------*/
export function signOut() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

export async function fetchUser() {
  try {
    const res = await fetch('http://localhost:3000/api/user', { credentials: 'include' });
    const data = await res.json();
    document.getElementById("welcomeMessage").textContent = `Welcome, ${data.username || 'Guest'}`;
  } catch {
    document.getElementById("welcomeMessage").textContent = 'Welcome, Guest';
  }
}