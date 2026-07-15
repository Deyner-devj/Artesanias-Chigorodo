/**
 * ══════════════════════════════════════════════════════════════════════════
 * ARCHIVO: main.js
 * CONTROLADOR PRINCIPAL DEL PANEL - ARTESANÍAS CHIGORODÓ
 * ══════════════════════════════════════════════════════════════════════════
 */

document.addEventListener("DOMContentLoaded", () => {
  // Inicializaciones iniciales
  initSearchBehavior();
  initMenuHighlight();
});

/**
 * 1. MANEJO DEL MENU EN MÓVILES (SIDEBAR)
 */
function toggleMobileSidebar() {
  const sidebar = document.getElementById("dash-sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (sidebar && overlay) {
    sidebar.classList.toggle("mobile-open");
    overlay.classList.toggle("mobile-open");

    // Desactiva el scroll del body mientras el menú esté abierto
    if (sidebar.classList.contains("mobile-open")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById("dash-sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (sidebar && overlay) {
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("mobile-open");
    document.body.style.overflow = "";
  }
}

/**
 * 2. BUSCADOR INTERNO DEL TOPBAR
 * Simulación de búsqueda rápida que se adapta a las tablas
 */
function initSearchBehavior() {
  const searchInput = document.querySelector(".topbar-search input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const tableRows = document.querySelectorAll(".data-table tbody tr");
    const categoryCards = document.querySelectorAll(".category-card");

    // Filtrar filas de tabla si existen en pantalla
    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? "" : "none";
    });

    // Filtrar tarjetas de categorías si existen en pantalla
    categoryCards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.style.display = text.includes(query) ? "" : "none";
    });
  });
}

/**
 * 3. CONTROL DE DESTAQUE DEL MENÚ DE NAVEGACIÓN ACTIVO
 * Identifica la página actual de la URL y asigna la clase .active
 */
function initMenuHighlight() {
  const currentPath = window.location.pathname.split("/").pop();
  if (!currentPath) return;

  const menuItems = document.querySelectorAll(".account-menu-item");
  menuItems.forEach((item) => {
    const href = item.getAttribute("href");
    if (href === currentPath) {
      // Remover activas previas por seguridad
      menuItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    }
  });
}

/**
 * 4. CIERRE DE SESIÓN SEGURO (LOGOUT)
 * Muestra una alerta interactiva nativa antes de redireccionar a la salida
 */
function triggerLogout() {
  const confirmLogout = confirm(
    "¿Estás seguro de que deseas cerrar sesión en el panel de control?",
  );
  if (confirmLogout) {
    // Aquí puedes vaciar tokens de autenticación
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");

    // Redirección simulada a la landing page o login
    alert("Sesión cerrada con éxito. ¡Vuelve pronto!");
    window.location.href = "../index.html";
  }
}
