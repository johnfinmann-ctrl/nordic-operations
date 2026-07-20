/* ==========================================================================
   NORDIC OPERATIONS PLATFORM — service-worker.js
   ------------------------------------------------------------------------
   Basalt offline-cache: cacher app-skallen (css/js/manifest) og de
   statiske data-filer, så platformen kan installeres og delvist fungere
   uden forbindelse. Cacher IKKE admin/-siderne (de skal altid hente
   frisk, og bliver først relevante offline, når/hvis der indføres en
   ægte offline-first admin-arbejdsgang).

   Ret CACHE_VERSION ved større ændringer i css/js, så gamle klienter
   får den nye version i stedet for en forældet cache.
   ========================================================================== */

const CACHE_VERSION = 'nordic-ops-v1';

const SHELL_FILES = [
  './',
  './index.html',
  './css/core.css',
  './css/responsive.css',
  './api/supabase.config.js',
  './api/data-source.js',
  './js/app.js',
  './js/nav.js',
  './js/footer.js',
  './js/products.js',
  './data/config.json',
  './data/products.json',
  './data/cases.json',
  './data/news.json',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {
      // Stille fejl hvis en enkelt fil ikke kan caches (fx pga. relative sti-forskelle
      // mellem rod- og undermappe-deploys) — resten af cachen etableres alligevel.
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Rør ikke admin-sider eller eksterne kald (fonte, QR-billeder osv.) — kun samme-origin GET.
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.indexOf('/admin/') !== -1) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
