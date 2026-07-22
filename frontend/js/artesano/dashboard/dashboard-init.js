// ==========================================================================
// DASHBOARD INIT: Bootstrap de la página del artesano
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  if (typeof loadDashboardMetrics === "function") loadDashboardMetrics();
  if (typeof renderDashboardCharts === "function") renderDashboardCharts();
  if (typeof loadRecentOrdersTable === "function") loadRecentOrdersTable();
});
