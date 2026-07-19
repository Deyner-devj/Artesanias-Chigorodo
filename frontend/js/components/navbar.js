document.addEventListener("DOMContentLoaded", function () {
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  if (!navbarPlaceholder) return;

  renderNavbar();
  updateCartBadge();
  initCartTransition();

  // Escuchar cambios en el carrito para actualizar el contador
  window.addEventListener("cartChanged", updateCartBadge);
});

function renderNavbar() {
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  if (!navbarPlaceholder) return;

  // --- Lógica de Rutas Mejorada ---
  const path = window.location.pathname.toLowerCase();
  const isSubfolder =
    path.includes("/home/") ||
    path.includes("/cliente/") ||
    path.includes("/admin/") ||
    path.includes("/artesano/");

  // Prefijos para rutas según la ubicación actual
  const rootPrefix = isSubfolder ? "../" : "";
  const homePrefix = `${rootPrefix}home/`;
  const clientPrefix = `${rootPrefix}cliente/`;
  const adminPrefix = `${rootPrefix}admin/`;
  const artisanPrefix = `${rootPrefix}artesano/`;
  const imgPrefix = `${rootPrefix}img/`;

  // --- Lógica de Perfil de Usuario ---
  const user = getLoggedInUser();
  const isLoggedIn = !!user;

  // Cambiamos el texto dinámico para que diga "Mi cuenta" si no hay usuario, o el nombre si está logueado
  let profileText = isLoggedIn ? user.name : "";

  // Enlaces del menú desplegable de usuario
  const loginUrl = `${homePrefix}login.html`;
  const favoritiesUrl = `${clientPrefix}favoritos.html`;
  const trackingUrl = `${clientPrefix}rastrear-pedido.html`;

  // Lógica de desvío/cierre de sesión dinámico para el primer botón
  let firstOptionLabel = "Iniciar sesión";
  let firstOptionUrl = loginUrl;

  if (isLoggedIn) {
    firstOptionLabel = "Mi perfil / Panel";
    // Asigna el enlace de panel basado en el rol del usuario
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
      <!-- Fila Superior -->
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
          
          <!-- Contenedor del Dropdown del Usuario -->
          <div class="user-dropdown-container" id="user-menu-trigger">
            <button type="button" class="user-account-btn" style="display: flex; align-items: center; gap: 0.35rem; border: none; background: transparent; cursor: pointer; color: inherit; font-family: inherit;">
              <!-- User SVG Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span class="user-text" style="font-size: 0.95rem; font-weight: 600;"></span>
              <!-- ChevronDown SVG Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            
            <!-- Menú Desplegable Flotante -->
            <ul class="user-dropdown-menu" id="user-dropdown-menu">
              <li><a href="${firstOptionUrl}">${firstOptionLabel}</a></li>
              <li><a href="#" id="favs-menu-link">Ver favoritos</a></li>
              <li><a href="${trackingUrl}">Rastrear su pedido</a></li>
              ${isLoggedIn ? `<li><hr class="dropdown-divider"></li><li><a href="#" id="logout-menu-link" style="color: var(--primary);">Cerrar sesión</a></li>` : ""}
            </ul>
          </div>

          <a href="${clientPrefix}carrito.html" class="cart-badge-container" aria-label="Carrito de compras" data-cart-icon>
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
            <a href="${homePrefix}index.html">Inicio</a>
          </li>
          <li>
            <a href="${homePrefix}productos.html">Productos</a>
          </li>
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
          <li>
            <a href="${homePrefix}nuestros-artesanos.html">Artesanos</a>
          </li>
          <li>
            <a href="${homePrefix}sobre-nosotros.html">Nosotros</a>
          </li>
          <li>
            <a href="${homePrefix}contacto.html">Contacto</a>
          </li>
        </ul>
      </div>
    </nav>
  `;

  navbarPlaceholder.innerHTML = html;

  // El nombre de usuario puede ser un dato controlado por el propio usuario
  // (lo escribió al registrarse), así que se inyecta como texto plano con
  // textContent en vez de interpolarlo dentro del HTML de arriba, para
  // evitar XSS persistente si alguien se registra con un nombre malicioso.
  const userTextEl = navbarPlaceholder.querySelector(".user-text");
  if (userTextEl) userTextEl.textContent = profileText;

  // --- LÓGICA: Desplegable de Usuario e Interacciones ---
  const userTrigger = document.getElementById("user-menu-trigger");
  const userMenu = document.getElementById("user-dropdown-menu");
  const favsLink = document.getElementById("favs-menu-link");
  const logoutLink = document.getElementById("logout-menu-link");

  if (userTrigger && userMenu) {
    // Abrir/cerrar dropdown al dar clic al botón de la personita
    userTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      const isVisible = userMenu.classList.contains("is-active");
      if (isVisible) {
        userMenu.classList.remove("is-active");
      } else {
        userMenu.classList.add("is-active");
        // Asegurarse de cerrar el menú de categorías para evitar solapamientos
        const categoryMenu = document.getElementById(
          "categories-dropdown-menu",
        );
        if (categoryMenu) categoryMenu.style.display = "none";
      }
    });

    // Cerrar el dropdown al hacer clic en cualquier parte fuera de él
    document.addEventListener("click", function () {
      userMenu.classList.remove("is-active");
    });
  }

  // Interceptar la redirección de "Ver Favoritos" sin 'alert'
  if (favsLink) {
    favsLink.addEventListener("click", function (e) {
      e.preventDefault();

      // Validamos si el usuario actual existe y es de rol "cliente"
      if (isLoggedIn && user.role === "cliente") {
        window.location.href = favoritiesUrl;
      } else {
        // Redirección inmediata y directa
        window.location.href = loginUrl;
      }
    });
  }

  // Cerrar sesión interactivo (si existe el enlace)
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("user");
      window.location.href = loginUrl;
    });
  }

  // Lógica del Formulario de Búsqueda original
  const searchForm = document.getElementById("nav-search-form");
  const searchInput = document.getElementById("nav-search-input");
  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const val = searchInput.value.trim();
      if (val) {
        window.location.href = `${homePrefix}productos.html?search=${encodeURIComponent(val)}`;
      }
    });
  }

  // Lógica del Botón Menú Móvil original
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navbarMenu = document.getElementById("navbar-menu-container");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");
  if (mobileMenuBtn && navbarMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      const isOpen = navbarMenu.classList.toggle("is-open");
      if (isOpen) {
        hamburgerIcon.style.display = "none";
        closeIcon.style.display = "block";
      } else {
        hamburgerIcon.style.display = "block";
        closeIcon.style.display = "none";
      }
    });
  }

  // Lógica de Despliegue para el menú de Categorías
  const dropdownTrigger = document.getElementById(
    "categories-dropdown-trigger",
  );
  const dropdownMenu = document.getElementById("categories-dropdown-menu");

  if (dropdownTrigger && dropdownMenu) {
    dropdownTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      const isVisible = dropdownMenu.style.display === "block";
      dropdownMenu.style.display = isVisible ? "none" : "block";
    });

    dropdownMenu.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    document.addEventListener("click", function (e) {
      if (!dropdownTrigger.contains(e.target)) {
        dropdownMenu.style.display = "none";
      }
    });
  }
}
function updateCartBadge() {
  const badge = document.getElementById("cart-counter-badge");
  if (!badge) return;

  const stored = localStorage.getItem("cart_items");
  let totalQty = 0;

  if (stored) {
    try {
      const items = JSON.parse(stored);
      totalQty = items.reduce(
        (sum, item) => sum + (parseInt(item.quantity) || 0),
        0,
      );
    } catch (e) {
      console.error("Error badge:", e);
    }
  }

  badge.textContent = totalQty;
  badge.style.display = totalQty > 0 ? "grid" : "none";
}

// getLoggedInUser() vive en auth.js (lee sessionStorage, que es donde
// loginUser() guarda la sesión). No se duplica aquí para evitar que esta
// versión (que leía localStorage y nunca encontraba la sesión) la pise.

// ---------------------------------------------------------------------------
// Animacion de transicion al carrito ("circulo revelador"):
// al hacer clic en el icono del carrito (o en "Ver mi carrito"), un circulo
// solido nace justo en el punto donde se hizo clic y crece hasta cubrir
// TODA la pantalla, con el icono del carrito animandose en su interior
// (rebote + giro). Cuando el circulo ya cubrio todo, navegamos a la pagina
// del carrito; esa pagina arranca ya "tapada" por el mismo circulo y luego
// se encoge/desvanece para revelar el contenido real que hay debajo.
//
// Vive AQUI (y no en carrito.js) porque navbar.js es el unico archivo
// incluido en TODAS las paginas del sitio, igual que el propio icono.
//
// Se activa con:
// - El icono del carrito del navbar (data-cart-icon).
// - Cualquier boton/link con el atributo data-view-cart (p. ej. "Ver mi
//   carrito" en producto.html).
// ---------------------------------------------------------------------------
const CART_TRANSITION_DURATION = 650; // ms: crecimiento del circulo hasta cubrir la pantalla
const CART_REVEAL_DURATION = 550; // ms: encogida/disolucion al llegar a la pagina destino
const CART_TRANSITION_FLAG = "cartTransitionReveal";

function injectCartTransitionStyles() {
  if (document.getElementById("cart-transition-styles")) return;

  const style = document.createElement("style");
  style.id = "cart-transition-styles";
  style.textContent = `
    #cart-transition-overlay {
      position: fixed;
      inset: 0;
      z-index: 999999999;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
    }
    #cart-transition-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    #cart-transition-circle {
      position: fixed;
      top: 0;
      left: 0;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, var(--primary-light, #e8956b) 0%, var(--primary, #c46b2d) 55%, var(--color-clay-dark, #8a4a1c) 100%);
      box-shadow: 0 0 0 0 rgba(239, 186, 148, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: translate(-50%, -50%) scale(0);
      will-change: transform, opacity, width, height;
    }
    #cart-transition-circle svg {
      width: 34px;
      height: 34px;
      stroke: #ffffff;
      fill: none;
      opacity: 0;
      transform: scale(0.4) rotate(-25deg);
    }
    /* Anillo de pulso que confirma "agregado / entrando" mientras el
       circulo todavia esta creciendo */
    #cart-transition-circle::after {
      content: "";
      position: absolute;
      inset: -10px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.45);
      opacity: 0;
    }
    #cart-transition-circle.pulse::after {
      animation: cart-circle-pulse 0.9s ease-out infinite;
    }
    @keyframes cart-circle-pulse {
      0% { transform: scale(0.85); opacity: 0.9; }
      100% { transform: scale(1.9); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

function buildCartTransitionOverlay() {
  injectCartTransitionStyles();

  const overlay = document.createElement("div");
  overlay.id = "cart-transition-overlay";
  overlay.innerHTML =
    '<div id="cart-transition-circle">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
    '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>' +
    "</svg>" +
    "</div>";
  document.body.appendChild(overlay);
  return overlay;
}

// Deja todo como si la animacion nunca hubiera empezado. Se usa antes de
// arrancar (por si quedo algo a medias) y al restaurar la pagina desde el
// cache del navegador (boton atras/adelante).
function resetCartTransitionState() {
  const overlay = document.getElementById("cart-transition-overlay");
  const circle = document.getElementById("cart-transition-circle");
  if (overlay) overlay.classList.remove("active");
  if (circle) {
    circle.getAnimations().forEach((a) => a.cancel());
    circle
      .querySelectorAll("svg")
      .forEach((svg) => svg.getAnimations().forEach((a) => a.cancel()));
    circle.classList.remove("pulse");
    circle.style.opacity = "0";
    circle.style.transform = "translate(-50%, -50%) scale(0)";
  }
}

// Diagonal de la pantalla: el circulo debe crecer lo suficiente para
// cubrirla por completo sin importar desde que esquina nace.
function viewportCoverScale(originX, originY) {
  const maxX = Math.max(originX, window.innerWidth - originX);
  const maxY = Math.max(originY, window.innerHeight - originY);
  const radiusNeeded = Math.hypot(maxX, maxY); // pequeño margen
  return radiusNeeded / 600; // 60px = tamaño base del circulo
}

// FASE 1 (pagina de origen): el circulo nace en el punto de clic y crece
// hasta tragarse toda la pantalla, con el icono rebotando/girando dentro.
function playCartTransition(originEl, onDone) {
  resetCartTransitionState();

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const duration = reduceMotion ? 220 : CART_TRANSITION_DURATION;

  const overlay =
    document.getElementById("cart-transition-overlay") ||
    buildCartTransitionOverlay();
  const circle = document.getElementById("cart-transition-circle");
  const svg = circle.querySelector("svg");

  const originRect = originEl.getBoundingClientRect();
  const originX = originRect.left + originRect.width / 2;
  const originY = originRect.top + originRect.height / 2;
  const coverScale = viewportCoverScale(originX, originY);

  overlay.classList.add("active");
  circle.classList.add("pulse");
  circle.style.left = originX + "px";
  circle.style.top = originY + "px";

  const circleAnim = circle.animate(
    [
      { transform: "translate(-50%,-50%) scale(0)", opacity: 0, offset: 0 },
      {
        transform: "translate(-50%,-50%) scale(0.6)",
        opacity: 1,
        offset: 0.18,
      },
      {
        transform: `translate(-50%,-50%) scale(${coverScale})`,
        opacity: 1,
        offset: 1,
      },
    ],
    { duration, easing: "cubic-bezier(.22,.85,.32,1)", fill: "forwards" },
  );

  svg.animate(
    [
      { transform: "scale(0.4) rotate(-25deg)", opacity: 0, offset: 0 },
      { transform: "scale(1.15) rotate(8deg)", opacity: 1, offset: 0.3 },
      { transform: "scale(1) rotate(0deg)", opacity: 1, offset: 0.55 },
      { transform: "scale(0.85) rotate(0deg)", opacity: 0, offset: 1 },
    ],
    { duration, easing: "ease-in-out", fill: "forwards" },
  );

  circleAnim.onfinish = () => {
    circle.classList.remove("pulse");
    if (onDone) onDone();
  };
}

// FASE 2 (pagina destino): arranca ya cubierta por el mismo circulo grande
// (para que no haya "parpadeo" del contenido crudo) y luego se encoge y
// desvanece hacia el icono del carrito, revelando el contenido real.
function playCartRevealIfNeeded() {
  let shouldReveal = false;
  try {
    shouldReveal = sessionStorage.getItem(CART_TRANSITION_FLAG) === "1";
    sessionStorage.removeItem(CART_TRANSITION_FLAG);
  } catch (e) {
    shouldReveal = false;
  }
  if (!shouldReveal) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const duration = reduceMotion ? 220 : CART_REVEAL_DURATION;

  const overlay = buildCartTransitionOverlay();
  const circle = document.getElementById("cart-transition-circle");
  const svg = circle.querySelector("svg");

  const cartIcon =
    document.querySelector("[data-cart-icon]") ||
    document.querySelector('a[href*="carrito.html"]');
  const targetRect = cartIcon
    ? cartIcon.getBoundingClientRect()
    : { left: window.innerWidth / 2, top: 60, width: 0, height: 0 };
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;
  const coverScale = viewportCoverScale(targetX, targetY);

  overlay.classList.add("active");
  circle.style.left = targetX + "px";
  circle.style.top = targetY + "px";
  circle.style.opacity = "1";
  circle.style.transform = `translate(-50%,-50%) scale(${coverScale})`;
  svg.style.opacity = "1";
  svg.style.transform = "scale(1) rotate(0deg)";

  // Pequeña pausa para que el usuario perciba "llegada" antes de revelar,
  // y para asegurar que el navegador ya pinto el frame inicial cubierto.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      circle.animate(
        [
          {
            transform: `translate(-50%,-50%) scale(${coverScale})`,
            opacity: 1,
            offset: 0,
          },
          {
            transform: "translate(-50%,-50%) scale(0.7)",
            opacity: 1,
            offset: 0.6,
          },
          {
            transform: "translate(-50%,-50%) scale(0)",
            opacity: 0,
            offset: 1,
          },
        ],
        { duration, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" },
      ).onfinish = () => {
        overlay.classList.remove("active");
        resetCartTransitionState();
      };

      svg.animate(
        [
          { transform: "scale(1) rotate(0deg)", opacity: 1, offset: 0 },
          { transform: "scale(0.6) rotate(15deg)", opacity: 0, offset: 0.5 },
          { transform: "scale(0.6) rotate(15deg)", opacity: 0, offset: 1 },
        ],
        { duration, easing: "ease-in", fill: "forwards" },
      );
    });
  });
}

function resolveCartTransitionUrl(originEl) {
  // Si el trigger es (o esta dentro de) un <a href="...">, usamos esa ruta:
  // ya trae el prefijo correcto (home/, cliente/, admin/, etc).
  const link = originEl.closest("a[href]");
  if (link) return link.getAttribute("href");
  // Si no, se puede indicar la ruta manualmente con data-cart-url="...".
  if (originEl.dataset && originEl.dataset.cartUrl)
    return originEl.dataset.cartUrl;
  return "carrito.html";
}

function goToCartWithTransition(originEl) {
  const url = resolveCartTransitionUrl(originEl);
  playCartTransition(originEl, () => {
    try {
      sessionStorage.setItem(CART_TRANSITION_FLAG, "1");
    } catch (e) {}
    window.location.href = url;
  });
}

function initCartTransition() {
  if (window.__cartTransitionInitialized) return;
  window.__cartTransitionInitialized = true;

  // Si llegamos a esta pagina como destino de la transicion, revelamos.
  playCartRevealIfNeeded();

  // Delegacion de eventos: el icono del carrito se renderiza dinamicamente
  // dentro de #navbar-placeholder, asi que escuchamos en document.
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-view-cart], [data-cart-icon]");
    if (!trigger) return;
    e.preventDefault();
    goToCartWithTransition(trigger);
  });

  // Cuando el navegador restaura la pagina desde el cache (boton
  // atras/adelante), event.persisted es true y el JS NO se re-ejecuta
  // desde cero: cualquier overlay/animacion que haya quedado a medias se
  // ve "congelada". Aqui la limpiamos para que la pagina quede normal.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) resetCartTransitionState();
  });
}

// Se expone por si se quiere disparar manualmente desde otro script
window.playCartTransition = playCartTransition;
window.goToCartWithTransition = goToCartWithTransition;
