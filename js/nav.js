/* ==========================================================================
   NORDIC OPERATIONS PLATFORM — nav.js
   Renderer for #site-nav. Bygger menuen 100% ud fra config.nav.
   Menupunkter tilføjes/ændres KUN i data/config.json — aldrig i markup.
   ========================================================================== */

window.NordicNav = (function () {
  function linkHTML(item, root, esc) {
    return '<a class="nav-link" href="' + root + esc(item.href) + '">' + esc(item.label) + '</a>';
  }

  function render(config, root) {
    const mount = document.getElementById('site-nav');
    if (!mount) return;
    const esc = window.NordicPlatform.escapeHTML;

    const items = config.nav.primary.map((item) => {
      if (item.children && item.children.length) {
        const sub = item.children.map((c) =>
          '<a href="' + root + esc(c.href) + '">' + esc(c.label) + '</a>'
        ).join('');
        return (
          '<li>' +
            linkHTML(item, root, esc) +
            '<div class="nav-dropdown">' + sub + '</div>' +
          '</li>'
        );
      }
      return '<li>' + linkHTML(item, root, esc) + '</li>';
    }).join('');

    mount.innerHTML =
      '<div class="container nav-inner">' +
        '<a class="nav-logo" href="' + root + esc(config.nav.primary[0].href) + '">' +
          esc(config.branding.logoText) + '<span>' + esc(config.branding.logoAccent) + '</span>' +
        '</a>' +
        '<button class="nav-toggle" id="nav-toggle" aria-label="Åbn menu" aria-expanded="false">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
        '</button>' +
        '<ul class="nav-links" id="nav-links">' +
          items +
          '<li><a class="btn btn-primary" href="' + root + esc(config.nav.cta.href) + '">' + esc(config.nav.cta.label) + '</a></li>' +
        '</ul>' +
      '</div>';

    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }
  }

  return { render };
})();
