function initDashboardBootstrap() {
  if (typeof initDashboardMetrics === "function") initDashboardMetrics();
  if (typeof initDashboardCharts === "function") initDashboardCharts();
  if (typeof initRecentOrdersTable === "function") initRecentOrdersTable();
}
