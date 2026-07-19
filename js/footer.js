/* ==========================================================================
   NORDIC OPERATIONS PLATFORM — footer.js
   Renderer for #site-footer. Bygges 100% ud fra config.footer + config.contact.
   ========================================================================== */

window.NordicFooter = (function () {
  function render(config, root) {
    const mount = document.getElementById('site-footer');
    if (!mount) return;
    const esc = window.NordicPlatform.escapeHTML;

    const columns = config.footer.columns.map((col) => {
      const links = col.links.map((l) =>
        '<li><a href="' + root + esc(l.href) + '">' + esc(l.label) + '</a></li>'
      ).join('');
      return '<div><h4>' + esc(col.title) + '</h4><ul>' + links + '</ul></div>';
    }).join('');

    mount.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div>' +
            '<div class="nav-logo">' + esc(config.branding.logoText) + '<span>' + esc(config.branding.logoAccent) + '</span></div>' +
            '<p style="margin-top:0.75rem;max-width:280px;">' + esc(config.footer.description) + '</p>' +
          '</div>' +
          columns +
        '</div>' +
        '<div class="footer-bottom">' + esc(config.footer.copyright) + '</div>' +
      '</div>';
  }

  return { render };
})();
