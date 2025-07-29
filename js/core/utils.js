/*-----------------------------------------------------------------------------
  utils.js
-----------------------------------------------------------------------------*/
export const $ = id => document.getElementById(id);
export const $$ = selector => document.querySelectorAll(selector);
export function setDisplay(el, visible, type = 'block') {
  if (typeof el === 'string') el = $(el);
  if (el) el.style.display = visible ? type : 'none';
}

export function getLoggedInUserInfo() {
    const username = localStorage.getItem("username");
    const userId = parseInt(localStorage.getItem("userId"));
    if ((username === undefined) || (userId === undefined)) {
      // Not logged-in: redirecting to login...
      window.location.href = "login.html";
      throw new Error('Redirecting to login...');
    }
    return { username, userId }
}
window.getLoggedInUserInfo = getLoggedInUserInfo;

export async function fetchLoggedInUserFullInfo() {
  try {
    const res = await fetch(`${APP_URL}/api/players/${getLoggedInUserInfo().userId}`, { credentials: 'include' });
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

