function filtrarProductosPorCategoria(products, category) {
  if (!category || category === "Todas") return products;
  return products.filter((p) => p.category === category);
}

function filtrarProductosPorPrecio(products, minPrice, maxPrice) {
  return products.filter((p) => {
    const minMatch = minPrice == null || p.price >= minPrice;
    const maxMatch = maxPrice == null || p.price <= maxPrice;
    return minMatch && maxMatch;
  });
}
