// js/protected-routes.js
(function () {
  // --- Lógica de Rutas ---
  const currentPath = window.location.pathname;
  const isSubfolder =
    currentPath.includes("/home/") ||
    currentPath.includes("/cliente/") ||
    currentPath.includes("/admin/") ||
    currentPath.includes("/artesano/");
  const rootPrefix = isSubfolder ? "../" : "";

  const path = window.location.pathname;
  const userStr =
    sessionStorage.getItem("user") || localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Define las rutas que requieren un rol específico
  const adminRoutes = ["/admin/", "admin-dashboard"];
  const vendorRoutes = ["/artesano/", "artesano-dashboard.html"];

  // Rutas exclusivas para clientes registrados (requieren cuenta obligatoria)
  const strictClientRoutes = ["mi-cuenta.html", "mis-pedidos.html"];

  // Excepciones PÚBLICAS dentro de la carpeta /cliente/ (Compras como invitado)
  const publicClientRoutes = [
    "checkout", // Permite checkout-info, checkout-envio, checkout-pago
    "carrito", // Permite el carrito de compras
    "pse.html", // Permite el simulador de pagos
    "confirmacion", // Permite ver el éxito de la compra
  ];

  // Funciones de verificación
  const isPathProtected = (routes) =>
    routes.some((route) => path.includes(route));
  const isPublicClientRoute = publicClientRoutes.some((route) =>
    path.includes(route),
  );

  // Es una ruta estricta si está en la carpeta /cliente/ PERO no es de las públicas,
  // o si coincide directamente con mi-cuenta/mis-pedidos.
  const isStrictClientPage =
    (path.includes("/cliente/") && !isPublicClientRoute) ||
    isPathProtected(strictClientRoutes);

  // ¿Necesita obligatoriamente iniciar sesión?
  const needsAuth =
    isPathProtected(adminRoutes) ||
    isPathProtected(vendorRoutes) ||
    isStrictClientPage;

  // Si la ruta NO es pública y NO hay usuario, redirigir al login
  if (needsAuth && !user) {
    sessionStorage.setItem("redirect_after_login", window.location.href); // Guardar para volver después
    const loginPath = `${rootPrefix}home/login.html`;
    window.location.replace(loginPath);
    return;
  }

  // Si hay un usuario logueado, verificar que tenga los permisos correctos para la ruta
  if (user) {
    const isAdminPage = isPathProtected(adminRoutes);
    const isVendorPage = isPathProtected(vendorRoutes);

    // Evitar que clientes o vendedores entren al panel de admin
    if (isAdminPage && user.role !== "admin") {
      window.location.replace(`${rootPrefix}home/404.html`);
    }
    // Evitar que clientes entren al panel de artesanos
    if (isVendorPage && user.role !== "vendedor" && user.role !== "admin") {
      window.location.replace(`${rootPrefix}home/404.html`);
    }
    // Evitar que vendedores entren a páginas exclusivas de clientes (como mis-pedidos)
    if (
      isStrictClientPage &&
      user.role !== "cliente" &&
      user.role !== "admin"
    ) {
      window.location.replace(`${rootPrefix}home/404.html`);
    }
  }
})();
