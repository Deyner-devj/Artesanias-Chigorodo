// js/artesano/ventas.js
// Gestiona la visualizacion de historial de ventas del artesano

async function init() {
  try {
    await loadVentasData();
    setupChart();
    setupTable();
  } catch (error) {
    console.error('Error al cargar ventas:', error);
    showErrorState();
  }
}

async function loadVentasData() {
  try {
    // Obtener usuario actual
    const currentUser = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
    if (!currentUser || !currentUser.id) {
      throw new Error('No se pudo obtener el usuario actual');
    }

    // Obtener datos específicos de ventas del artesano
    let ventasData = null;
    try {
      // Usar el endpoint de sales-reports
      ventasData = await API.salesReports.getArtisan();
    } catch (e) {
      console.error('Error al obtener ventas específicas, usando dashboard:', e);
      // Fallback: usar datos del dashboard
      const dashboardData = await API.dashboard.getSummary();
      ventasData = dashboardData;
    }

    // Actualizar el gráfico con los datos
    updateChartData(ventasData);
    
    // Actualizar la tabla de ventas
    updateVentasTable(ventasData);

  } catch (error) {
    console.error('Error al cargar datos:', error);
    throw error;
  }
}

function updateChartData(data) {
  // Extraer datos de ventas por fecha
  const salesByDate = data.salesByDate || data.dailySales || [];
  
  if (salesByDate.length > 0) {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    // Destruir gráfico existente si hay uno
    if (ctx.chart) {
      ctx.chart.destroy();
    }

    // Preparar datos para el gráfico
    const labels = salesByDate.map(s => {
      if (s.date) {
        return new Date(s.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
      }
      return s.label || '';
    });
    
    const values = salesByDate.map(s => s.amount || s.total || 0);

    ctx.chart = new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Monto de Ventas ($)',
            data: values,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#10b981',
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: {
              callback: (value) => '$' + value.toLocaleString('es-CO'),
            },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });
  }
}

function updateVentasTable(data) {
  const tbody = document.querySelector('tbody');
  if (!tbody) return;

  // Obtener transacciones de ventas
  let ventas = [];
  
  if (data.transactions && Array.isArray(data.transactions)) {
    ventas = data.transactions.filter(t => t.type === 'SALE' || t.type === 'ORDER');
  } else if (data.recentOrders && Array.isArray(data.recentOrders)) {
    ventas = data.recentOrders;
  } else if (data.sales && Array.isArray(data.sales)) {
    ventas = data.sales;
  }

  if (ventas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 1rem;">No hay historial de ventas aún.</td></tr>';
    return;
  }

  const rows = ventas.slice(0, 10).map(venta => {
    const fecha = new Date(venta.date || venta.createdAt || venta.orderDate).toLocaleDateString('es-CO');
    const monto = formatCurrency(venta.amount || venta.total || venta.totalAmount || 0);
    const producto = venta.productName || venta.product?.name || 'Producto no especificado';
    const metodoPago = venta.paymentMethod || 'No especificado';
    const referencia = venta.reference || venta.paymentReference || venta.orderNumber || `#${venta.id}`;
    
    return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 1rem 0.75rem; color: #475569;">${referencia}</td>
        <td style="padding: 1rem 0.75rem; color: #475569;">${producto}</td>
        <td style="padding: 1rem 0.75rem; color: #475569;">${metodoPago}</td>
        <td style="padding: 1rem 0.75rem; color: #475569;">${fecha}</td>
        <td style="padding: 1rem 0.75rem; color: #0f172a; font-weight: 600; text-align: right;">${monto}</td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rows;
}

function setupChart() {
  // Crear gráfico inicial - se actualizará con datos reales cuando se carguen
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;

  // Crear gráfico vacío inicialmente, se actualizará con updateChartData
  ctx.chart = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Sin datos'],
      datasets: [
        {
          label: 'Monto de Ventas ($)',
          data: [0],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#10b981',
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: {
            callback: (value) => '$' + value.toLocaleString('es-CO'),
          },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
}

function setupTable() {
  // La tabla se actualiza en updateVentasTable
}

function showErrorState() {
  const container = document.querySelector('.aa-ventas-container');
  if (container) {
    container.innerHTML = '<p style="color: #ef4444; text-align: center; padding: 2rem;">No se pudieron cargar los datos de ventas. Este módulo requiere endpoints de backend que aún no están implementados.</p>';
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

// Exponer el módulo
window.VentasJS = { init };
