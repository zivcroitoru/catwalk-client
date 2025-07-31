// dataLoader.js
import {
  getPlayerCats,
  normalizeCat,
  buildSpriteLookup,
  resetSpriteLookup
} from '../storage.js';
import { APP_URL } from '../../core/config.js';

/* globals for legacy code --------------------------------------- */
export let userCats  = [];
export let shopItems = [];

/*--------------------------------------------------------------
  STEP A: load shop list + cat templates, build breedItems
----------------------------------------------------------------*/
export async function loadShopAndTemplates () {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const headers = { Authorization: `Bearer ${token}` };

  console.log('🔄 Loading shop + templates…');
  const [shopRes, templates] = await Promise.all([
    fetch(`${APP_URL}/api/shop`,         { headers }).then(r => r.json()),
    fetch(`${APP_URL}/api/cats/allcats`, { headers }).then(r => r.json())
  ]);

  /* build breedItems */
  const breedItems = {};
  for (const t of templates) {
    const template = t.template ??
      `${t.breed}-${t.variant ?? 'default'}-${t.palette ?? 'default'}`;
    const [breed] = template.split('-');
    if (!breed) continue;

    (breedItems[breed] ||= []).push({
      name: t.name ?? 'Unnamed',
      template,
      sprite_url: t.sprite_url,
      variant:  t.variant  ?? 'default',
      palette:  t.palette  ?? 'default'
    });
  }

  /* expose + reset caches */
  window.breedItems = breedItems;
  shopItems         = shopRes;
  window.shopItems  = shopItems;
  resetSpriteLookup();

  console.log(`✅ Templates ready (${Object.keys(breedItems).length} breeds)`);
  console.log('🛍️ Full shop data:', shopItems); // ← here
  
}


/*--------------------------------------------------------------
  STEP B: load the player’s cats – must run *after* step A
----------------------------------------------------------------*/
export async function loadUserCats () {
  console.log('🔄 Loading player cats…');
  userCats = (await getPlayerCats()).map(c =>
    normalizeCat(c, buildSpriteLookup(window.breedItems))
  );
  window.userCats = userCats;
  console.log(`✅ Loaded ${userCats.length} cats`);
}

/* optional convenience wrapper */
export async function loadAllData () {
  await loadShopAndTemplates();
  await loadUserCats();
}
