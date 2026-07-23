function renderNavbar() {
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  if (!navbarPlaceholder) return;

  const path = window.location.pathname.toLowerCase();
  const isSubfolder =
    path.includes("/home/") ||
    path.includes("/cliente/") ||
    path.includes("/admin/") ||
    path.includes("/artesano/");

  const rootPrefix = isSubfolder ? "../" : "";
  const homePrefix = `${rootPrefix}home/`;
  const clientPrefix = `${rootPrefix}cliente/`;
  const adminPrefix = `${rootPrefix}admin/`;
  const artisanPrefix = `${rootPrefix}artesano/`;
  const imgPrefix = `${rootPrefix}img/`;

  const user = getLoggedInUser();
  const isLoggedIn = !!user;
  let profileText = isLoggedIn ? user.name : "";

  const loginUrl = `${homePrefix}login.html`;
  const favoritiesUrl = `${clientPrefix}favoritos.html`;
  const trackingUrl = `${clientPrefix}rastrear-pedido.html`;

  let firstOptionLabel = "Iniciar sesión";
  let firstOptionUrl = loginUrl;

  if (isLoggedIn) {
    firstOptionLabel = "Mi perfil / Panel";
    switch (user.role) {
      case "admin":
        firstOptionUrl = `${adminPrefix}admin-dashboard.html`;
        break;
      case "vendedor":
        firstOptionUrl = `${artisanPrefix}artesano-dashboard.html`;
        break;
      case "cliente":
      default:
        firstOptionUrl = `${clientPrefix}perfil.html`;
        break;
    }
  }

  const html = `
    <nav class="navbar-container">
      <div class="navbar-main">
        <div class="nav-brand">
          <a href="${homePrefix}index.html" style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${imgPrefix}logo-vasija.svg" alt="Logo de Artesanías Chigorodó" style="width: 38px; height: 38px;" />
            <span class="brand-text" style="font-size: 1.65rem; font-weight: 800; letter-spacing: -0.02em; display: flex; align-items: center; gap: 0.35rem;">
              <span style="color: var(--text-dark);">Artesanías</span>
              <span style="color: var(--primary);">Chigorodó</span>
            </span>
          </a>
        </div>

        <form class="nav-search" id="nav-search-form">
          <div class="nav-search-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="nav-search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              id="nav-search-input"
              placeholder="Buscar artesanías..."
              class="nav-search-input"
            />
          </div>
        </form>

        <div class="nav-user-actions" style="display: flex; align-items: center; gap: 1.75rem;">
          <div class="user-dropdown-container" id="user-menu-trigger">
            <button type="button" class="user-account-btn" style="display: flex; align-items: center; gap: 0.35rem; border: none; background: transparent; cursor: pointer; color: inherit; font-family: inherit;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span class="user-text" style="font-size: 0.95rem; font-weight: 600;"></span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            
            <ul class="user-dropdown-menu" id="user-dropdown-menu">
              <li><a href="${firstOptionUrl}">${firstOptionLabel}</a></li>
              <li><a href="#" id="favs-menu-link">Ver favoritos</a></li>
              <li><a href="${trackingUrl}">Rastrear su pedido</a></li>
              ${isLoggedIn ? `<li><hr class="dropdown-divider"></li><li><a onclick="triggerLogout()" id="logout-menu-link" style="color: var(--primary);">Cerrar sesión</a></li>` : ""}
            </ul>
          </div>

          <a href="${clientPrefix}carrito.html" class="cart-badge-container" aria-label="Carrito de compras" data-cart-icon>
            <div class="cart-icon-wrapper" style="background-color: var(--primary-light); color: var(--primary);">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span id="cart-counter-badge" class="cart-counter" style="background-color: var(--primary); display: none;">0</span>
            </div>
          </a>

          <button 
            type="button" 
            id="mobile-menu-btn"
            class="mobile-menu-toggle-btn" 
            aria-label="Menu"
            style="border: none; background: none; cursor: pointer; color: var(--text-dark); padding: 4px;"
          >
            <svg id="hamburger-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            <svg id="close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <div class="navbar-menu" id="navbar-menu-container">
        <ul class="menu-links">
          <li><a href="${homePrefix}index.html">Inicio</a></li>
          <li><a href="${homePrefix}productos.html">Productos</a></li>
          <li class="menu-dropdown-item" id="categories-dropdown-trigger">
            <span class="dropdown-trigger" style="display: flex; align-items: center; gap: 0.25rem; color: var(--text-muted); font-weight: 600; cursor: pointer;">
              Categorías <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="arrow-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
            <ul class="dropdown-menu" id="categories-dropdown-menu" style="display: none;">
              <li><a href="${homePrefix}productos.html?category=Tejidos">Tejidos</a></li>
              <li><a href="${homePrefix}productos.html?category=Cerámica">Cerámica</a></li>
              <li><a href="${homePrefix}productos.html?category=Joyería">Joyería</a></li>
              <li><a href="${homePrefix}productos.html?category=Madera">Madera</a></li>
              <li><a href="${homePrefix}productos.html?category=Hogar%20y%20Decoración">Hogar y Decoración</a></li>
              <li><a href="${homePrefix}productos.html?category=Accesorios">Accesorios</a></li>
            </ul>
          </li>
          <li><a href="${homePrefix}nuestros-artesanos.html">Artesanos</a></li>
          <li><a href="${homePrefix}sobre-nosotros.html">Nosotros</a></li>
          <li><a href="${homePrefix}contacto.html">Contacto</a></li>
        </ul>
      </div>
    </nav>
  `;

  navbarPlaceholder.innerHTML = html;
  const userTextEl = navbarPlaceholder.querySelector(".user-text");
  if (userTextEl) userTextEl.textContent = profileText;
}
