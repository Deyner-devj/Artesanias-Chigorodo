// Nombre de marca oficial: Artesanías Chigorodó — NUNCA cambiar a 'Colombia', el mockup de diseño usa ese nombre solo como referencia visual.

document.addEventListener('DOMContentLoaded', function() {
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  if (!navbarPlaceholder) return;

  renderNavbar();

  // Listen to cart changes to update the badge
  window.addEventListener('cartChanged', updateCartBadge);
});

function renderNavbar() {
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  if (!navbarPlaceholder) return;

  // Determine profile text and link dynamically
  const user = getLoggedInUser();
  let profileText = 'Mi cuenta';
  let profileLink = 'login.html';
  if (user) {
    profileText = user.name;
    profileLink = (user.role === 'vendedor' || user.role === 'admin') ? 'dashboard.html' : 'mi-cuenta.html';
  }

  const html = `
    <nav class="navbar-container">
      <!-- Fila Superior -->
      <div class="navbar-main">
        <div class="nav-brand">
          <a href="index.html" style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="img/logo-vasija.svg" alt="Logo de Artesanías Chigorodó" style="width: 38px; height: 38px;" />
            <span class="brand-text" style="font-size: 1.65rem; fontWeight: 800; letter-spacing: -0.02em; display: flex; align-items: center; gap: 0.35rem;">
              <span style="color: var(--text-dark);">Artesanías</span>
              <span style="color: var(--primary);">Chigorodó</span>
            </span>
          </a>
        </div>

        <form class="nav-search" id="nav-search-form">
          <div class="nav-search-wrapper">
            <!-- Search SVG Icon -->
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
          <a href="${profileLink}" class="user-account-btn" style="display: flex; align-items: center; gap: 0.35rem;">
            <!-- User SVG Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span class="user-text" style="font-size: 0.95rem; font-weight: 600;">${profileText}</span>
            <!-- ChevronDown SVG Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </a>

          <a href="carrito.html" class="cart-badge-container" aria-label="Carrito de compras">
            <div class="cart-icon-wrapper" style="background-color: var(--primary-light); color: var(--primary);">
              <!-- ShoppingCart SVG Icon -->
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
            <!-- Hamburger Menu SVG Icon -->
            <svg id="hamburger-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            <!-- X SVG Icon -->
            <svg id="close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <!-- Fila Inferior - Menú de Navegación -->
      <div class="navbar-menu" id="navbar-menu-container">
        <ul class="menu-links">
          <li>
            <a href="index.html">Inicio</a>
          </li>
          <li class="menu-dropdown-item" id="categories-dropdown-trigger">
            <span class="dropdown-trigger" style="display: flex; align-items: center; gap: 0.25rem; color: var(--text-muted); font-weight: 600;">
              Categorías <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="arrow-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
            <ul class="dropdown-menu" id="categories-dropdown-menu" style="display: none;">
              <li><a href="productos.html?category=Tejidos">Tejidos</a></li>
              <li><a href="productos.html?category=Cerámica">Cerámica</a></li>
              <li><a href="productos.html?category=Joyería">Joyería</a></li>
              <li><a href="productos.html?category=Madera">Madera</a></li>
              <li><a href="productos.html?category=Hogar%20y%20Decoración">Hogar y Decoración</a></li>
              <li><a href="productos.html?category=Accesorios">Accesorios</a></li>
            </ul>
          </li>
          <li>
            <a href="artesanos.html">Artesanos</a>
          </li>
          <li>
            <a href="nosotros.html">Nosotros</a>
          </li>
          <li>
            <a href="contacto.html">Contacto</a>
          </li>
        </ul>
      </div>
    </nav>
  `;

  navbarPlaceholder.innerHTML = html;

  // Bind Search Submit
  const searchForm = document.getElementById('nav-search-form');
  const searchInput = document.getElementById('nav-search-input');
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const val = searchInput.value.trim();
      if (val) {
        window.location.href = `productos.html?search=${encodeURIComponent(val)}`;
      }
    });
  }

  // Bind Hamburger Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navbarMenu = document.getElementById('navbar-menu-container');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');
  if (mobileMenuBtn && navbarMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      const isOpen = navbarMenu.classList.toggle('is-open');
      if (isOpen) {
        hamburgerIcon.style.display = 'none';
        closeIcon.style.display = 'block';
      } else {
        hamburgerIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      }
    });
  }

  // Bind Dropdown Mouse Actions (Desktop Hover & Click Toggle)
  const dropdownTrigger = document.getElementById('categories-dropdown-trigger');
  const dropdownMenu = document.getElementById('categories-dropdown-menu');
  if (dropdownTrigger && dropdownMenu) {
    dropdownTrigger.addEventListener('mouseenter', () => {
      dropdownMenu.style.display = 'block';
    });
    dropdownTrigger.addEventListener('mouseleave', () => {
      dropdownMenu.style.display = 'none';
    });
    // Click toggle for mobile/accessibility
    dropdownTrigger.querySelector('.dropdown-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = dropdownMenu.style.display === 'block';
      dropdownMenu.style.display = isVisible ? 'none' : 'block';
    });
    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!dropdownTrigger.contains(e.target)) {
        dropdownMenu.style.display = 'none';
      }
    });
  }

  // Initial cart badge update
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-counter-badge');
  if (!badge) return;

  const totalQuantity = getCartQuantity();
  if (totalQuantity > 0) {
    badge.textContent = totalQuantity;
    badge.style.display = 'grid';
  } else {
    badge.style.display = 'none';
  }
}
