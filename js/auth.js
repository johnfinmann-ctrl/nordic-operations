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

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === 'active';
  }

  function login(password, expectedPassword) {
    if (password === expectedPassword) {
      sessionStorage.setItem(SESSION_KEY, 'active');
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  /** Beskytter en admin-side: redirecter til login hvis ikke logget ind. */
  function guard(root) {
    if (!isLoggedIn()) {
      window.location.href = root + 'admin/index.html';
    }
  }

  return { isLoggedIn, login, logout, guard };
})();
