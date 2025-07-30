/*-----------------------------------------------------------------------------
  utils.js – generic helpers, no localStorage auth
-----------------------------------------------------------------------------*/
import { APP_URL } from '../core/config.js'

export const  $  = id       => document.getElementById(id);
export const  $$ = selector => document.querySelectorAll(selector);
export function setDisplay(el, visible, type = 'block') {
  if (typeof el === 'string') el = $(el);
  if (el) el.style.setProperty('display', visible ? type : 'none', 'important');
}

/*─────────────────────────────────────────────────────────────────────────────
  Auth helpers
─────────────────────────────────────────────────────────────────────────────*/
let _userCache = null;

/** Get current user (username, userId) via JWT */
export async function getLoggedInUserInfo() {
  if (_userCache) return _userCache;              // use cached copy

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    throw new Error('No auth token found');
  }

  const res = await fetch(`${APP_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (res.status === 401) {                       // token invalid/expired
    localStorage.removeItem('token');
    window.location.href = 'login.html';
    throw new Error('Auth token expired');
  }

  if (!res.ok) throw new Error('Failed /auth/me');

  const data = await res.json();
  _userCache = data.user;                         // { username, userId }
  return _userCache;
}
window.getLoggedInUserInfo = getLoggedInUserInfo;

/** Fetch full player record from your players API */
export async function fetchLoggedInUserFullInfo() {
  try {
    const { userId } = await getLoggedInUserInfo();
    const res  = await fetch(`${APP_URL}/api/players/${userId}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error();
    return await res.json();                      // full player object
  } catch {
    return null;                                  // swallow errors
  }
}
