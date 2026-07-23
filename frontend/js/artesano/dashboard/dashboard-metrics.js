// ==========================================================================
// DASHBOARD METRICS: KPIs de ventas y ganancias reales del artesano desde la API
// ==========================================================================
async function loadDashboardMetrics() {
  const kpiVentas = document.getElementById("kpi-total-ventas");
  const kpiGanancias = document.getElementById("kpi-total-ganancias");
  const kpiPedidos = document.getElementById("kpi-total-pedidos");

  if (window.API && window.API.dashboard) {
    try {
      const data = await window.API.dashboard.getArtisan();
      if (kpiVentas) kpiVentas.textContent = "$" + (data.totalSales || 0).toLocaleString("es-CO") + " COP";
      if (kpiGanancias) kpiGanancias.textContent = "No disponible";
      if (kpiPedidos) kpiPedidos.textContent = (data.totalOrders || 0) + " pedidos";
      return;
    } catch (err) {
      console.warn("[dashboard-metrics] No se pudo cargar métricas de la API:", err.message);
    }
  }

  if (kpiVentas) kpiVentas.textContent = "No disponible";
  if (kpiGanancias) kpiGanancias.textContent = "No disponible";
  if (kpiPedidos) kpiPedidos.textContent = "No disponible";
}

if (typeof window !== "undefined") {
  window.loadDashboardMetrics = loadDashboardMetrics;
}
