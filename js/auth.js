/* ==========================================================================
   NORDIC OPERATIONS PLATFORM — auth.js
   ------------------------------------------------------------------------
   VIGTIGT: Dette er en FRONT-END DEMO-GATE, ikke rigtig autentificering.
   Den forhindrer ikke en teknisk bruger i at tilgå /admin/-siderne direkte.
   Den findes for at etablere UI-mønsteret (login-skærm, session, logout),
   så det er klar til at blive erstattet af rigtig auth (fx et lille
   serverless-login/JWT-flow) når en kunde får brug for reel sikkerhed —
   f.eks. medlemsløsninger med rigtige medlemsdata.

   Brug ALDRIG dette mønster til sider med personfølsomme eller
   forretningskritiske data uden en rigtig backend bagved.
   ========================================================================== */

window.NordicAuth = (function () {
  const SESSION_KEY = 'no_admin_session';
  const ROLE_KEY = 'no_admin_role';

  // ---- Rollestruktur --------------------------------------------------
  // Dette definerer FORMEN på rollerne, så admin-UI kan bygges mod en
  // stabil grænseflade. Rollerne håndhæves IKKE sikkert af noget her —
  // det er kun en demo-gate (se advarsel i toppen af filen). Reel
  // håndhævelse skal ske i Supabase Row Level Security, når backend
  // kobles til (se docs/supabase-migration-plan.md).
  const ROLES = {
    SUPERADMIN: {
      id: 'superadmin',
      label: 'Superadmin',
      description: 'Fuld adgang: brugere, roller, alle produkter/kunder, systemindstillinger.',
      permissions: ['manage_users', 'manage_roles', 'manage_products', 'manage_content', 'manage_settings']
    },
    ADMIN: {
      id: 'admin',
      label: 'Admin',
      description: 'Kan redigere produkter, cases, nyheder, kontakt og priser — ikke brugere/roller.',
      permissions: ['manage_products', 'manage_content']
    },
    REDAKTOR: {
      id: 'redaktor',
      label: 'Redaktør',
      description: 'Kan redigere tekster, billeder og nyheder — ikke priser, produktstruktur eller brugere.',
      permissions: ['manage_content']
    }
  };

  function getRole() {
    const id = sessionStorage.getItem(ROLE_KEY);
    return Object.values(ROLES).find((r) => r.id === id) || null;
  }

  function hasPermission(permission) {
    const role = getRole();
    return !!role && role.permissions.indexOf(permission) !== -1;
  }

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === 'active';
  }

  function login(password, expectedPassword, roleId) {
    if (password === expectedPassword) {
      sessionStorage.setItem(SESSION_KEY, 'active');
      sessionStorage.setItem(ROLE_KEY, roleId || ROLES.ADMIN.id);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(ROLE_KEY);
  }

  /** Beskytter en admin-side: redirecter til login hvis ikke logget ind. */
  function guard(root) {
    if (!isLoggedIn()) {
      window.location.href = root + 'admin/index.html';
    }
  }

  return { ROLES, getRole, hasPermission, isLoggedIn, login, logout, guard };
})();
