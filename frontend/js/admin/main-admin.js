/**
 * ══════════════════════════════════════════════════════════════════════════
 * ARCHIVO: main-admin.js
 * UTILIDADES ADICIONALES DEL PANEL ADMIN (búsqueda de tablas)
 * El resto del layout (sidebar, topbar, menú activo, sidebar móvil, logout)
 * vive en admin-dashboard.js, que ahora se carga en TODAS las páginas del
 * panel admin para que dejen de verse "vacías"/descuadradas.
 * ══════════════════════════════════════════════════════════════════════════
 */

document.addEventListener("DOMContentLoaded", () => {
  initSearchBehavior();
});

/**
 * BUSCADOR INTERNO DEL TOPBAR
 * Filtra filas de tablas y tarjetas de categorías visibles en la página.
 */
function initSearchBehavior() {
  const searchInput = document.querySelector("#search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const tableRows = document.querySelectorAll(".data-table tbody tr");
    const categoryCards = document.querySelectorAll(".category-card");

    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? "" : "none";
    });

    categoryCards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? "" : "none";
    });
  });
}
