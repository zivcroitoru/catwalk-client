/*-----------------------------------------------------------------------------
  api.js – generic helpers for server calls
-----------------------------------------------------------------------------*/
import { APP_URL } from '../core/config.js'

export async function updateCat(catId, patch) {
  const res = await fetch(`${APP_URL}/api/cats/${catId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error('Failed to update cat');
  return res.json();
}
