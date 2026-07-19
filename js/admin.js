/* ==========================================================================
   NORDIC OPERATIONS PLATFORM — admin.js
   ------------------------------------------------------------------------
   Admin-skallen læser SAMME data/*.json som resten af platformen, så
   admin altid viser den reelle live-tilstand. I dette skelet er
   redigering visuel/lokal (in-memory) — permanent gem kræver et rigtigt
   write-endpoint (se note i admin/index.html). Arkitekturen er allerede
   forberedt til det: al indhold er data, ikke kode.
   ========================================================================== */

window.NordicAdmin = (function () {
  function renderDashboard(root) {
    const mount = document.getElementById('admin-dashboard');
    if (!mount) return;

    Promise.all([
      window.NordicPlatform.getProducts(),
      window.NordicPlatform.getCases(),
      window.NordicPlatform.getNews()
    ]).then(([products, cases, news]) => {
      const live = products.filter((p) => p.status === 'live').length;
      mount.innerHTML =
        '<div class="grid grid-3">' +
          statCard('Produkter', products.length, live + ' aktive') +
          statCard('Cases', cases.length, '') +
          statCard('Nyheder', news.length, '') +
        '</div>';
    });
  }

  function statCard(label, value, sub) {
    return (
      '<div class="admin-card">' +
        '<div class="muted" style="font-size:var(--fs-xs);text-transform:uppercase;letter-spacing:.04em;">' + label + '</div>' +
        '<div style="font-family:var(--font-display);font-size:var(--fs-3xl);font-weight:800;">' + value + '</div>' +
        (sub ? '<div class="muted" style="font-size:var(--fs-xs);">' + sub + '</div>' : '') +
      '</div>'
    );
  }

  function renderProductTable(root) {
    const mount = document.getElementById('admin-product-table');
    if (!mount) return;

    window.NordicPlatform.getProducts().then((products) => {
      const e = window.NordicPlatform.escapeHTML;
      const rows = products.map((p) =>
        '<tr>' +
          '<td>' + e(p.icon) + ' ' + e(p.name) + '</td>' +
          '<td>' + e(p.category) + '</td>' +
          '<td>' + e(p.statusLabel) + '</td>' +
          '<td><a href="#" class="muted">Redigér</a></td>' +
        '</tr>'
      ).join('');

      mount.innerHTML =
        '<table class="admin-table">' +
          '<thead><tr><th>Produkt</th><th>Kategori</th><th>Status</th><th></th></tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>';
    });
  }

  return { renderDashboard, renderProductTable };
})();
