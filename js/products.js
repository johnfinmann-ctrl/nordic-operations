/* ==========================================================================
   NORDIC OPERATIONS PLATFORM — products.js
   Renderer for produktkort og produktdetalje-sider.
   Al produktdata kommer fra data/products.json — ingen tekst i markup.
   ========================================================================== */

window.NordicProducts = (function () {
  const esc = () => window.NordicPlatform.escapeHTML;

  function statusBadge(product) {
    const e = window.NordicPlatform.escapeHTML;
    return '<span class="badge status-' + e(product.status) + '"><span class="badge-dot"></span>' + e(product.statusLabel) + '</span>';
  }

  /** Renderer et grid af produktkort i #mount. options.featuredOnly / options.limit kan filtrere. */
  function renderGrid(mountId, root, options) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    options = options || {};

    window.NordicPlatform.getProducts().then((products) => {
      const e = window.NordicPlatform.escapeHTML;
      let list = products;
      if (options.featuredOnly) list = list.filter((p) => p.featured);
      if (options.limit) list = list.slice(0, options.limit);

      mount.innerHTML = list.map((p) => (
        '<a class="card" href="' + root + 'pages/produkt.html?id=' + e(p.id) + '">' +
          '<div class="icon">' + e(p.icon) + '</div>' +
          '<h3>' + e(p.name) + '</h3>' +
          '<p>' + e(p.tagline) + '</p>' +
          statusBadge(p) +
        '</a>'
      )).join('');
    });
  }

  /** Renderer én produktdetaljeside i #mount ud fra ?id= i URL'en. */
  function renderDetail(mountId, root) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    window.NordicPlatform.getProducts().then((products) => {
      const e = window.NordicPlatform.escapeHTML;
      const product = products.find((p) => p.id === id);

      if (!product) {
        mount.innerHTML =
          '<div class="container" style="padding:4rem 0;">' +
            '<h1>Produktet blev ikke fundet</h1>' +
            '<p>Vi kunne ikke finde det produkt, du ledte efter.</p>' +
            '<a class="btn btn-primary" href="' + root + 'pages/produkter.html">Se alle produkter</a>' +
          '</div>';
        return;
      }

      document.title = product.name + ' | Nordic Operations';

      const features = product.features.map((f) => '<li>' + e(f) + '</li>').join('');
      const screenshots = (product.screenshots && product.screenshots.length)
        ? '<div class="grid grid-3">' + product.screenshots.map((s) =>
            '<img src="' + root + e(s) + '" alt="Screenshot af ' + e(product.name) + '" style="border-radius:var(--radius-md);border:1px solid var(--border);">'
          ).join('') + '</div>'
        : '<p class="muted">Screenshots tilføjes snarest.</p>';

      mount.innerHTML =
        '<div class="container" style="padding:var(--space-6) 0;">' +
          '<div class="eyebrow">' + e(product.category) + '</div>' +
          '<div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">' +
            '<h1 style="margin:0;">' + e(product.icon) + '&nbsp; ' + e(product.name) + '</h1>' +
            statusBadge(product) +
          '</div>' +
          '<p class="lead" style="font-size:var(--fs-lg);max-width:640px;">' + e(product.tagline) + '</p>' +

          '<div class="grid grid-2" style="margin:var(--space-5) 0;">' +
            '<div class="card"><h3>Problemet</h3><p>' + e(product.problem) + '</p></div>' +
            '<div class="card"><h3>Løsningen</h3><p>' + e(product.solution) + '</p></div>' +
          '</div>' +

          '<h2>Funktioner</h2>' +
          '<ul style="color:var(--text-muted);line-height:2;">' + features + '</ul>' +

          '<h2 style="margin-top:var(--space-5);">Pris</h2>' +
          '<div class="card" style="max-width:360px;">' +
            '<div style="font-family:var(--font-display);font-weight:800;font-size:var(--fs-2xl);">' +
              (product.pricing && product.pricing.priceFrom ? 'Fra ' + e(product.pricing.priceFrom) : e((product.pricing && product.pricing.priceLabel) || 'Kontakt for pris')) +
            '</div>' +
            (product.pricing && product.pricing.billingNote ? '<p class="muted" style="font-size:var(--fs-sm);">' + e(product.pricing.billingNote) + '</p>' : '') +
          '</div>' +

          '<h2 style="margin-top:var(--space-5);">Målgruppe</h2>' +
          '<p style="max-width:640px;">' + e(product.audience) + '</p>' +

          '<h2 style="margin-top:var(--space-5);">Screenshots</h2>' +
          screenshots +

          '<div class="card" style="margin-top:var(--space-5);text-align:center;">' +
            '<h3>' + e(product.contactCta) + '</h3>' +
            '<a class="btn btn-primary" href="' + root + 'pages/kontakt.html?product=' + e(product.id) + '">Book en samtale</a>' +
          '</div>' +
        '</div>';
    });
  }

  return { renderGrid, renderDetail };
})();
