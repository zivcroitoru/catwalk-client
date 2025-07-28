/*-----------------------------------------------------------------------------
  auth.js
-----------------------------------------------------------------------------*/
export function signOut() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

export async function fetchUser() {
  try {
    const username = localStorage.getItem("username");
    document.getElementById("welcomeMessage").textContent = `Welcome, ${username || 'Guest'}`;
  } catch {
    document.getElementById("welcomeMessage").textContent = 'Welcome, Guest';
  }
}