for (const cat of templates) {
  const breed = cat.breed || cat.template || cat.type;
  const sprite = cat.sprite_url || cat.sprite;

  // Debug EVERYTHING
  console.log("🐈‍⬛ RAW CAT:", cat);
  console.log("📦 Mapped:", { breed, sprite });

  if (!breed || !sprite || sprite === "null") {
    console.warn("⛔ Skipping template due to missing data:", { breed, sprite });
    continue;
  }

  if (!breedItems[breed]) breedItems[breed] = [];

  breedItems[breed].push({
    name: cat.name || "Unnamed",
    variant: cat.variant || cat.name || "Default",
    palette: cat.palette || "default",
    sprite
  });
}
