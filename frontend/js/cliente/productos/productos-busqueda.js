function buscarProductosPorTexto(products, query) {
  if (!query || query.trim() === "") return products;
  const q = query.toLowerCase().trim();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.sellerName && p.sellerName.toLowerCase().includes(q))
  );
}
