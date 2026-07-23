// ==========================================================================
// NAVBAR ORQUESTADOR: Carga submódulos del Navbar y los ejecuta
// ==========================================================================
(function loadNavbarSubmodules() {
  const currentScript = document.currentScript
    ? document.currentScript.src
    : "";
  const basePath =
    currentScript.substring(0, currentScript.lastIndexOf("/")) + "/navbar/";

  const submodules = [
    "navbar-render.js",
    "navbar-auth-state.js",
    "navbar-cart-badge.js",
    "navbar-mobile-menu.js",
    "navbar-clearance.js",
  ];

  let loadedCount = 0;

  function initAll() {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (!navbarPlaceholder) return;

    if (typeof renderNavbar === "function") renderNavbar();
    if (typeof initNavbarAuthState === "function") initNavbarAuthState();
    if (typeof updateCartBadge === "function") updateCartBadge();
    if (typeof initCartTransition === "function") initCartTransition();
    if (typeof initNavbarMobileMenu === "function") initNavbarMobileMenu();
    if (typeof initNavbarClearance === "function") initNavbarClearance();

    window.addEventListener("cartChanged", function () {
      if (typeof updateCartBadge === "function") updateCartBadge();
    });
  }

  // Carga dinámica de los submódulos de la subcarpeta navbar/
  submodules.forEach((file) => {
    const script = document.createElement("script");
    script.src = basePath + file;
    script.onload = () => {
      loadedCount++;
      if (loadedCount === submodules.length) {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", initAll);
        } else {
          initAll();
        }
      }
    };
    script.onerror = () => {
      // Fallback si la ruta relativa falla
      loadedCount++;
      if (loadedCount === submodules.length) {
        initAll();
      }
    };
    document.head.appendChild(script);
  });
})();
