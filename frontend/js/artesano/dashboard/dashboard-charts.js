// ==========================================================================
// DASHBOARD CHARTS: Gráficas dinámicas de ventas desde la API
// ==========================================================================
async function renderDashboardCharts() {
  const chartCanvas = document.getElementById("artisanSalesChart");
  if (!chartCanvas || typeof Chart === "undefined") return;

  let salesData = [0, 0, 0, 0, 0, 0];
  if (window.API && window.API.dashboard) {
    try {
      const data = await window.API.dashboard.getArtisan();
      if (data && data.monthlySales) {
        salesData = data.monthlySales;
      }
    } catch (_) {}
  }

  new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      datasets: [{
        label: "Ventas Mensuales (COP)",
        data: salesData,
        borderColor: "#ea580c",
        backgroundColor: "rgba(234, 88, 12, 0.1)",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

if (typeof window !== "undefined") {
  window.renderDashboardCharts = renderDashboardCharts;
}
