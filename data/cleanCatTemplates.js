// cleanCatTemplates.js
import fs from 'fs';

// CONFIG
const inputPath = './cat_templates.json'; // path to your current file
const outputPath = './cat_templates_cleaned.json'; // new cleaned file
const PLACEHOLDER_SPRITE = '../assets/cats/placeholder.png'; // or null to skip replace

// Load JSON
const raw = fs.readFileSync(inputPath, 'utf-8');
const original = JSON.parse(raw);
const cleaned = {};

for (const [breed, variants] of Object.entries(original)) {
  if (!Array.isArray(variants)) continue;

  const valid = variants.filter(cat => cat?.sprite && cat.sprite !== 'null');

  cleaned[breed] = valid.map(cat => ({
    ...cat,
    sprite: cat.sprite === 'null' ? PLACEHOLDER_SPRITE : cat.sprite
  }));

  if (!cleaned[breed].length) delete cleaned[breed]; // skip empty
}

// Save new file
fs.writeFileSync(outputPath, JSON.stringify(cleaned, null, 2), 'utf-8');
console.log(`✅ Cleaned file saved as ${outputPath}`);
