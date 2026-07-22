document.addEventListener("DOMContentLoaded", function () {
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  if (!navbarPlaceholder) return;

  if (typeof renderNavbar === "function") renderNavbar();
  if (typeof initNavbarAuthState === "function") initNavbarAuthState();
  if (typeof updateCartBadge === "function") updateCartBadge();
  if (typeof initCartTransition === "function") initCartTransition();
  if (typeof initNavbarMobileMenu === "function") initNavbarMobileMenu();

  window.addEventListener("cartChanged", function() {
    if (typeof updateCartBadge === "function") updateCartBadge();
  });
});
