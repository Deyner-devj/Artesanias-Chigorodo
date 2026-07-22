// ==========================================================================
// PRODUCTOS PAGINACIÓN: Paginación estática/dinámica de productos
// ==========================================================================
let currentPage = 1;
const pageSize = 8;

function paginateProducts(items, page = 1) {
  currentPage = page;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = items.slice(start, end);

  if (typeof renderProductCatalog === "function") {
    renderProductCatalog(paginatedItems);
  }
}

if (typeof window !== "undefined") {
  window.paginateProducts = paginateProducts;
}
