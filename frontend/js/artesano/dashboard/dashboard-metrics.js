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
      if (kpiGanancias) kpiGanancias.textContent = "$" + (data.netEarnings || 0).toLocaleString("es-CO") + " COP";
      if (kpiPedidos) kpiPedidos.textContent = (data.totalOrders || 0) + " pedidos";
      return;
    } catch (err) {
      console.warn("[dashboard-metrics] No se pudo cargar métricas de la API:", err.message);
    }
  }

  // Fallback inicial cuando no hay datos
  if (kpiVentas) kpiVentas.textContent = "$0 COP";
  if (kpiGanancias) kpiGanancias.textContent = "$0 COP";
  if (kpiPedidos) kpiPedidos.textContent = "0 pedidos";
}

if (typeof window !== "undefined") {
  window.loadDashboardMetrics = loadDashboardMetrics;
}
