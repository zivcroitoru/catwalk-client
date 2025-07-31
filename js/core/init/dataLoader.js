// dataLoader.js
import {
  getPlayerCats,
  normalizeCat,
  buildSpriteLookup,
  resetSpriteLookup      
} from '../storage.js';
import { APP_URL } from '../../core/config.js';

export let userCats  = [];
export let shopItems = [];


export async function loadAllData () {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');

  const headers = { Authorization: `Bearer ${token}` };
  console.log('🔄 Loading shop + templates…');

  /* shop + templates (sprites) */
  const [shopRes, templates] = await Promise.all([
    fetch(`${APP_URL}/api/shop`,         { headers }).then(r => r.json()),
    fetch(`${APP_URL}/api/cats/allcats`, { headers }).then(r => r.json())
  ]);

  /* build breedItems from templates */
  const breedItems = {};
  for (const t of templates) {
    const template = t.template ?? `${t.breed}-${t.variant ?? 'default'}-${t.palette ?? 'default'}`;
    const [breed]  = template.split('-');
    if (!breed) continue;

    (breedItems[breed] ||= []).push({
      name:      t.name ?? 'Unnamed',
      template,
      sprite_url: t.sprite_url,
      variant:   t.variant  ?? 'default',
      palette:   t.palette  ?? 'default'
    });
  }
  window.breedItems = breedItems;
  resetSpriteLookup();                   // flush sprite cache

  /* player cats (sprites now resolve) */
  console.log('🔄 Loading player cats…');
  userCats = (await getPlayerCats()).map(c =>
    normalizeCat(c, buildSpriteLookup(breedItems))
  );

  /* final globals */
  shopItems          = shopRes;
  window.userCats    = userCats;
  window.shopItems   = shopItems;

  console.log(`✅ Loaded ${userCats.length} cats, ${Object.keys(shopItems).length} shop items.`);
}
