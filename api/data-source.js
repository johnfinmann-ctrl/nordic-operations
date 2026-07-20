/* ==========================================================================
   NORDIC OPERATIONS PLATFORM — api/data-source.js
   ------------------------------------------------------------------------
   Dette ER adapterlaget. Alle sider/komponenter henter data via
   NordicDataSource, aldrig via fetch() direkte. I dag læser hver metode
   en JSON-fil. Når Supabase kobles til, udskiftes KUN kroppen af disse
   metoder — signaturen (hvad man kalder, hvad man får tilbage) ændres
   ikke, så intet i pages/ eller components/ skal røres.

   Afhænger af api/supabase.config.js (indlæses før denne fil).
   ========================================================================== */

window.NordicDataSource = (function () {
  const cfg = window.NordicSupabaseConfig || { active: false };

  function loadJSON(root, path) {
    return fetch(root + path).then((res) => {
      if (!res.ok) throw new Error('Kunne ikke hente ' + path + ' (' + res.status + ')');
      return res.json();
    });
  }

  // ---- Hver metode tjekker Supabase-flaget først. I dag er "active"
  // altid false, så else-grenen (JSON) er den eneste, der nogensinde kører.
  // Sprint B udfylder if-grenene med rigtige Supabase-kald.

  function getConfig(root) {
    if (cfg.active) throw new Error('Supabase-adapter er ikke implementeret endnu.');
    return loadJSON(root, 'data/config.json');
  }

  function getProducts(root) {
    if (cfg.active) throw new Error('Supabase-adapter er ikke implementeret endnu.');
    return loadJSON(root, 'data/products.json').then((d) => d.products);
  }

  function getCases(root) {
    if (cfg.active) throw new Error('Supabase-adapter er ikke implementeret endnu.');
    return loadJSON(root, 'data/cases.json').then((d) => d.cases);
  }

  function getNews(root) {
    if (cfg.active) throw new Error('Supabase-adapter er ikke implementeret endnu.');
    return loadJSON(root, 'data/news.json').then((d) => d.news);
  }

  return { getConfig, getProducts, getCases, getNews, isSupabaseActive: () => cfg.active };
})();
