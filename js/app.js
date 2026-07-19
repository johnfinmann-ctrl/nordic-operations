/* ==========================================================================
   NORDIC OPERATIONS PLATFORM — app.js
   Bootstrap-lag. Indlæses FØRST på hver side, før nav.js/footer.js/products.js.

   Forventer <html data-root="./"> på forsiden og <html data-root="../">
   på sider i /pages/ og /admin/, så alle data- og asset-stier virker
   uanset om platformen ligger i domænets rod eller i en undermappe
   (fx GitHub Pages-projektsider: /nordic-operations/).
   ========================================================================== */

window.NordicPlatform = (function () {
  const ROOT = document.documentElement.dataset.root || './';

  let configPromise = null;
  let productsPromise = null;
  let casesPromise = null;
  let newsPromise = null;

  function loadJSON(path) {
    return fetch(ROOT + path)
      .then((res) => {
        if (!res.ok) throw new Error('Kunne ikke hente ' + path + ' (' + res.status + ')');
        return res.json();
      });
  }

  function getConfig() {
    if (!configPromise) configPromise = loadJSON('data/config.json');
    return configPromise;
  }
  function getProducts() {
    if (!productsPromise) productsPromise = loadJSON('data/products.json').then((d) => d.products);
    return productsPromise;
  }
  function getCases() {
    if (!casesPromise) casesPromise = loadJSON('data/cases.json').then((d) => d.cases);
    return casesPromise;
  }
  function getNews() {
    if (!newsPromise) newsPromise = loadJSON('data/news.json').then((d) => d.news);
    return newsPromise;
  }

  function applyBranding(config) {
    document.title = document.title || config.site.name + ' | ' + config.site.tagline;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = config.site.themeColor;

    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = ROOT + config.branding.favicon;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /** Init: kaldes af hver side. Loader config, sætter branding, bygger nav/footer hvis containere findes. */
  function init(callback) {
    getConfig().then((config) => {
      applyBranding(config);
      if (document.getElementById('site-nav') && window.NordicNav) {
        window.NordicNav.render(config, ROOT);
      }
      if (document.getElementById('site-footer') && window.NordicFooter) {
        window.NordicFooter.render(config, ROOT);
      }
      if (typeof callback === 'function') callback(config);
    }).catch((err) => {
      console.error('[NordicPlatform] Fejl ved indlæsning af config:', err);
    });
  }

  return { ROOT, getConfig, getProducts, getCases, getNews, escapeHTML, init };
})();
