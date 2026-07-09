// js/protected-routes.js
(function() {
  const userStr = localStorage.getItem('user');
  const path = window.location.pathname;
  
  // Detect target page from URL
  const isDashboard = path.indexOf('dashboard.html') !== -1;
  const isAccount = path.indexOf('mi-cuenta.html') !== -1 || path.indexOf('mis-pedidos.html') !== -1 || path.indexOf('checkout') !== -1 || path.indexOf('pse.html') !== -1 || path.indexOf('confirmacion.html') !== -1;
  
  if (!userStr) {
    // Save current destination to return to after login
    sessionStorage.setItem('redirect_after_login', window.location.href);
    window.location.replace('login.html');
    return;
  }
  
  try {
    const user = JSON.parse(userStr);
    if (isDashboard && user.role !== 'vendedor' && user.role !== 'admin') {
      window.location.replace('mi-cuenta.html');
      return;
    }
    // Note: account is for customers (or admin, but let's allow customers or redirect sellers to dashboard)
    if (isAccount && user.role !== 'cliente' && user.role !== 'admin') {
      window.location.replace('dashboard.html');
      return;
    }
  } catch (e) {
    localStorage.removeItem('user');
    window.location.replace('login.html');
  }
})();
