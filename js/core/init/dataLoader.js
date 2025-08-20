// dataLoader.js
import {
  getPlayerCats,
  normalizeCat,
  buildSpriteLookup,
  resetSpriteLookup
} from '../storage.js';
import { APP_URL } from '../../core/config.js';

/* globals for legacy code --------------------------------------- */
export let userCats = [];

/*--------------------------------------------------------------
  STEP A: Load shop items and cat templates, build breed lookup
  
  Fetches shop data and cat templates in parallel, then creates
  a breed-indexed lookup structure for cat creation.
----------------------------------------------------------------*/
export async function loadShopAndTemplates() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const headers = { Authorization: `Bearer ${token}` };

  console.log('🔄 Loading shop items and cat templates...');
  const [shopRes, templates] = await Promise.all([
    fetch(`${APP_URL}/api/shop`, { headers }).then(r => r.json()),
    fetch(`${APP_URL}/api/cats/allcats`, { headers }).then(r => r.json())
  ]);

  console.log(`📦 Fetched ${shopRes.length} shop items and ${templates.length} cat templates`);

  /* Build breed-indexed lookup for cat templates */
  const breedItems = {};
  for (const t of templates) {
    // Generate template ID from breed-variant-palette pattern
    const template = t.template ??
      `${t.breed}-${t.variant ?? 'default'}-${t.palette ?? 'default'}`;
    const [breed] = template.split('-');
    if (!breed) continue;

    // Group templates by breed for easier lookup
    (breedItems[breed] ||= []).push({
      name: t.name ?? 'Unnamed',
      template,
      sprite_url: t.sprite_url,
      variant: t.variant ?? 'default',
      palette: t.palette ?? 'default'
    });
  }
  
  /* Cache data globally and reset sprite lookup cache */
  window.shopItemsByCategory = shopRes.reduce((acc, item) => {
    const category = item.category.toLowerCase();
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});
  
  window.breedItems = breedItems;
  resetSpriteLookup(); // Clear any previous sprite cache

  console.log(`✅ Shop and templates loaded successfully:`);
  console.log(`   • ${Object.keys(breedItems).length} breeds available`);
  console.log(`   • ${Object.keys(window.shopItemsByCategory).length} shop categories`);
  console.log('🛍️ Full shop data:', shopItems); // ← here
}


/*--------------------------------------------------------------
  STEP B: Load player's cats - requires templates to be loaded first
  
  Fetches the player's cat collection and normalizes each cat
  using the breed lookup created in Step A.
----------------------------------------------------------------*/
export async function loadUserCats() {
  console.log('🔄 Loading player cats...');

  userCats = (await getPlayerCats()).map(c =>
    normalizeCat(c, buildSpriteLookup(window.breedItems))
  );
  
  // Expose to global scope for legacy compatibility
  window.userCats = userCats;
  
  console.log(`✅ Successfully loaded and normalized ${userCats.length} player cats`);
}

/* Convenience wrapper to load all game data in proper sequence */
export async function loadAllData() {
  await loadShopAndTemplates();
  await loadUserCats();
  console.log('🎉 All game data loaded successfully');
}