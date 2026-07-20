/* ==========================================================================
   NORDIC OPERATIONS PLATFORM — components/install-prompt.js
   ------------------------------------------------------------------------
   Lille, selvstændig komponent: fanger browserens "beforeinstallprompt"
   og viser en simpel banner med en Installér-knap. Ikke afhængig af
   Supabase eller andet backend — virker allerede nu.
   Indlæses efter js/app.js på offentlige sider (ikke nødvendig i /admin/).
   ========================================================================== */

(function () {
  let deferredPrompt = null;

  function showBanner() {
    if (document.getElementById('install-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'install-banner';
    banner.style.cssText =
      'position:fixed;bottom:1rem;left:1rem;right:1rem;z-index:200;' +
      'max-width:420px;margin:0 auto;display:flex;align-items:center;gap:0.75rem;' +
      'background:var(--bg-card, #0f172a);border:1px solid var(--border, #1e293b);' +
      'border-radius:var(--radius-md, 14px);padding:0.9rem 1rem;' +
      'font-family:var(--font-body, sans-serif);color:var(--text, #e5e7eb);' +
      'box-shadow:0 10px 30px rgba(0,0,0,0.35);';

    banner.innerHTML =
      '<span style="flex:1;font-size:0.875rem;">Installér som app for hurtigere adgang.</span>' +
      '<button id="install-accept" style="background:var(--accent,#3b82f6);color:#fff;border:none;' +
      'border-radius:8px;padding:0.5rem 0.9rem;font-weight:600;font-size:0.8125rem;cursor:pointer;">Installér</button>' +
      '<button id="install-dismiss" aria-label="Luk" style="background:none;border:none;color:var(--text-muted,#94a3b8);' +
      'font-size:1.1rem;cursor:pointer;line-height:1;">×</button>';

    document.body.appendChild(banner);

    document.getElementById('install-accept').addEventListener('click', () => {
      banner.remove();
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt = null;
      }
    });
    document.getElementById('install-dismiss').addEventListener('click', () => {
      banner.remove();
      try { sessionStorage.setItem('no_install_dismissed', '1'); } catch (e) { /* ignore */ }
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    let dismissed = false;
    try { dismissed = sessionStorage.getItem('no_install_dismissed') === '1'; } catch (e2) { /* ignore */ }
    if (!dismissed) showBanner();
  });
})();
