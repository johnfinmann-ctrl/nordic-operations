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

  // Al datahentning går via api/data-source.js (adapterlaget). app.js
  // aner ikke om data kommer fra JSON-filer eller Supabase — det er
  // netop pointen med adapteret.
  function getConfig() {
    if (!configPromise) configPromise = window.NordicDataSource.getConfig(ROOT);
    return configPromise;
  }
  function getProducts() {
    if (!productsPromise) productsPromise = window.NordicDataSource.getProducts(ROOT);
    return productsPromise;
  }
  function getCases() {
    if (!casesPromise) casesPromise = window.NordicDataSource.getCases(ROOT);
    return casesPromise;
  }
  function getNews() {
    if (!newsPromise) newsPromise = window.NordicDataSource.getNews(ROOT);
    return newsPromise;
  }

  function setMeta(attr, key, content) {
    let el = document.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function applyBranding(config) {
    document.title = document.title || config.site.name + ' | ' + config.site.tagline;

    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
      document.head.appendChild(themeMeta);
    }
    themeMeta.content = config.site.themeColor;

    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = ROOT + config.branding.favicon;

    // ---- SEO: canonical (kun sat automatisk hvis siden ikke selv har angivet én) ----
    if (!document.querySelector('link[rel="canonical"]')) {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = config.site.url.replace(/\/$/, '') + window.location.pathname.replace(/^\/+/, '/');
      document.head.appendChild(canonical);
    }

    // ---- SEO: Open Graph + Twitter Card (kun udfyldt hvis siden ikke selv har sat dem) ----
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const pageTitle = document.title;
    const pageDesc = (document.querySelector('meta[name="description"]') || {}).content || config.site.description;

    if (!ogTitle) setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', pageDesc);
    if (!document.querySelector('meta[property="og:type"]')) setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', config.site.name);
    setMeta('property', 'og:locale', 'da_DK');

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', pageDesc);

    // ---- SEO: JSON-LD Organization schema (én gang pr. side, i <head>) ----
    if (!document.getElementById('nordic-jsonld-org')) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'nordic-jsonld-org';
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: config.site.name,
        url: config.site.url,
        description: config.site.description,
        email: config.contact && config.contact.email
      });
      document.head.appendChild(script);
    }
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    // Kun forsøg registrering hvis en service-worker.js rent faktisk findes ved ROOT.
    // Eksplicit scope sikrer korrekt opførsel både i domænets rod og under en
    // undermappe (fx GitHub Pages-projektsider: /nordic-operations/).
    navigator.serviceWorker.register(ROOT + 'service-worker.js', { scope: ROOT }).catch(() => {
      // Stille fejl — fx hvis siden køres uden for GitHub Pages/HTTPS-kontekst.
    });
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
      registerServiceWorker();
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
