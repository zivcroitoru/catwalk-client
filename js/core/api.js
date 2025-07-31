/*-----------------------------------------------------------------------------
  api.js – generic helpers for server calls
-----------------------------------------------------------------------------*/
import { APP_URL } from '../core/config.js'

export async function apiUpdateCat(catId, updates) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch(`${APP_URL}/api/cats/${catId}`, {
    method: 'PATCH', // Corrected to use PATCH
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });

  if (!res.ok) {
    console.error('Failed to update cat:', res.status, res.statusText);
    throw new Error('Failed to update cat');
  }

  return res.json();
}
