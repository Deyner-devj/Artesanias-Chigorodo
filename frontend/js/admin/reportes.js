// js/admin/reportes.js
// Gestiona los reportes administrativos de la plataforma

async function init() {
  try {
    await loadReportesData();
    setupFilters();
  } catch (error) {
    console.error('Error al cargar reportes:', error);
    showErrorState();
  }
}

async function loadReportesData(filters = {}) {
  try {
    // Obtener datos del dashboard de admin
    const dashboardData = await API.dashboard.getSummary();
    
    if (!dashboardData) {
      throw new Error('No se encontraron datos de dashboard');
    }

    // Obtener reportes específicos si el endpoint existe
    let reportesData = null;
    try {
      // Intentar obtener reportes de admin
      // NOTA: Este endpoint aún no está implementado en el backend
      // Por ahora usamos datos del dashboard general
      reportesData = dashboardData;
    } catch (e) {
      reportesData = dashboardData;
    }

    // Renderizar el dashboard de reportes
    renderReportesDashboard(reportesData);
    renderReportesTable(reportesData);

  } catch (error) {
    console.error('Error al cargar datos:', error);
    throw error;
  }
}

function renderReportesDashboard(data) {
  // Obtener contenedores de métricas
  const metricsContainer = document.getElementById('admin-reports-metrics');
  if (!metricsContainer) return;

  const totalVentas = data.totalSales || 0;
  const totalProductos = data.totalProducts || 0;
  const totalUsuarios = data.totalUsers || 0;
  const totalArtesanos = data.totalArtisans || 0;

  metricsContainer.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
      <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #3b82f6;">
        <div style="color: #64748b; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;">Ventas Totales</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: #0f172a;">${formatCurrency(totalVentas)}</div>
        <div style="font-size: 0.75rem; color: #10b981; font-weight: 700;">+${formatCurrency(data.salesGrowth || 0)} vs mes anterior</div>
      </div>
      
      <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #10b981;">
        <div style="color: #64748b; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;">Productos Activos</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: #0f172a;">${totalProductos}</div>
        <div style="font-size: 0.75rem; color: #64748b;">En catálogo público</div>
      </div>
      
      <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #f59e0b;">
        <div style="color: #64748b; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;">Artesanos Activos</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: #0f172a;">${totalArtesanos}</div>
        <div style="font-size: 0.75rem; color: #64748b;">Verificando calidad</div>
      </div>
      
      <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #ef4444;">
        <div style="color: #64748b; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;">Clientes Totales</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: #0f172a;">${totalUsuarios}</div>
        <div style="font-size: 0.75rem; color: #64748b;">Compradores registrados</div>
      </div>
    </div>
  `;
}

function renderReportesTable(data) {
  const tableContainer = document.getElementById('admin-reports-table');
  if (!tableContainer) return;

  // Obtener ventas recientes o pedidos
  let reportes = [];
  
  if (data.recentOrders && Array.isArray(data.recentOrders)) {
    reportes = data.recentOrders;
  } else if (data.transactions && Array.isArray(data.transactions)) {
    reportes = data.transactions.filter(t => t.type === 'SALE');
  }

  if (reportes.length === 0) {
    tableContainer.innerHTML = '<p style="color: #64748b; text-align: center; padding: 2rem;">No hay datos de reportes disponibles.</p>';
    return;
  }

  // Mostrar tabla con los últimos reportes
  const tableHTML = `
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-top: 1rem;">
      <thead>
        <tr style="border-bottom: 2px solid #e2e8f0; color: #64748b;">
          <th style="padding: 1rem; text-align: left;">Fecha</th>
          <th style="padding: 1rem; text-align: left;">Tipo</th>
          <th style="padding: 1rem; text-align: left;">Descripción</th>
          <th style="padding: 1rem; text-align: left;">Artesano</th>
          <th style="padding: 1rem; text-align: right;">Monto</th>
        </tr>
      </thead>
      <tbody>
        ${reportes.slice(0, 10).map((reporte, index) => {
          const fecha = new Date(reporte.date || reporte.createdAt).toLocaleDateString('es-CO');
          const tipo = reporte.type || 'Venta';
          const descripcion = reporte.productName || reporte.description || 'Transacción';
          const artesano = reporte.artisanName || reporte.user?.fullName || 'N/A';
          const monto = formatCurrency(reporte.amount || reporte.total || 0);
          
          return `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 1rem;">${fecha}</td>
              <td style="padding: 1rem;">${tipo}</td>
              <td style="padding: 1rem;">${descripcion}</td>
              <td style="padding: 1rem;">${artesano}</td>
              <td style="padding: 1rem; text-align: right;">${monto}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;

  tableContainer.innerHTML = tableHTML;
}

function setupFilters() {
  // Configurar filtros de fechas
  const filterContainer = document.getElementById('admin-reports-filters');
  if (!filterContainer) return;

  filterContainer.innerHTML = `
    <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap;">
      <div>
        <label style="font-size: 0.85rem; font-weight: 600; color: #475569; margin-right: 0.5rem;">Fecha Inicio:</label>
        <input type="date" id="filter-start-date" style="padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px;" />
      </div>
      <div>
        <label style="font-size: 0.85rem; font-weight: 600; color: #475569; margin-right: 0.5rem;">Fecha Fin:</label>
        <input type="date" id="filter-end-date" style="padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px;" />
      </div>
      <button onclick="applyFilters()" style="background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600;">
        Aplicar Filtros
      </button>
      <button onclick="exportReportes()" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600;">
        Exportar a Excel
      </button>
    </div>
  `;
}

function applyFilters() {
  const startDate = document.getElementById('filter-start-date')?.value;
  const endDate = document.getElementById('filter-end-date')?.value;

  if (window.UF) {
    window.UF.showToast('Filtros aplicados. Funcionalidad de filtrado pendiente de implementación en backend.', 'info');
  }

  // Recargar datos con filtros (por ahora solo notificación)
  loadReportesData({ startDate, endDate });
}

async function exportReportes() {
  try {
    const startDate = document.getElementById('filter-start-date')?.value;
    const endDate = document.getElementById('filter-end-date')?.value;
    
    // Usar el nuevo endpoint de exportación
    await API.adminReports.export(startDate, endDate);
    
    if (window.UF) {
      window.UF.showToast('Exportación iniciada. El archivo se descargará automáticamente.', 'success');
    }
  } catch (error) {
    console.error('Error al exportar:', error);
    if (window.UF) {
      window.UF.showToast('Error al exportar reportes: ' + error.message, 'error');
    }
  }
}

function showErrorState() {
  const container = document.getElementById('admin-reports-container');
  if (container) {
    container.innerHTML = '<p style="color: #ef4444; text-align: center; padding: 2rem;">No se pudieron cargar los reportes. Este módulo requiere endpoints de backend que aún no están implementados.</p>';
  }
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
}

// Exponer funciones globalmente
window.applyReportesFilters = applyFilters;
window.exportReportes = exportReportes;
window.AdminReportesJS = { init };
