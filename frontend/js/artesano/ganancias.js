// js/artesano/ganancias.js
// Gestiona la visualizacion de ganancias y liquidaciones del artesano

async function init() {
  try {
    const data = await loadGananciasData();
    setupChart(data);
  } catch (error) {
    console.error('Error al cargar ganancias:', error);
    showErrorState();
  }
}

async function loadGananciasData() {
  try {
    // Obtener usuario actual
    const currentUser = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
    if (!currentUser || !currentUser.id) {
      throw new Error('No se pudo obtener el usuario actual');
    }

    // Obtener datos de ganancias específicos del artesano
    let gananciasData = null;
    try {
      gananciasData = await API.artisans.getEarnings(currentUser.id);
    } catch (e) {
      console.error('Error al obtener ganancias específicas, usando dashboard:', e);
      // Fallback: usar datos del dashboard
      const dashboardData = await API.dashboard.getSummary();
      gananciasData = dashboardData;
    }

    // Actualizar el panel izquierdo con los datos de ganancias
    updateGananciasPanel(gananciasData);
    
    // Actualizar el historial de desembolsos
    updateHistorialDesembolsos(gananciasData);

    return gananciasData;

  } catch (error) {
    console.error('Error al cargar datos:', error);
    throw error;
  }
}

function updateGananciasPanel(data) {
  // Actualizar el monto de ganancias netas disponibles
  const montoEl = document.querySelector('.aa-ganancias-monto');
  
  if (montoEl) {
    // Usar el nuevo campo availableBalance o netEarnings
    const gananciasNetas = data.availableBalance || data.netEarnings || data.totalEarnings || data.totalSales || 0;
    montoEl.textContent = formatCurrency(gananciasNetas);
  }

  // Actualizar información adicional
  const infoEls = document.querySelectorAll('.aa-ganancias-info');
  if (infoEls.length > 0) {
    // Mostrar información de ganancias
    const totalVentas = data.totalSales || 0;
    const comision = data.totalCommission || data.platformCommission || 0;
    const totalRetirado = data.totalWithdrawn || 0;
    
    if (infoEls[0]) {
      infoEls[0].textContent = `Ventas totales: ${formatCurrency(totalVentas)}`;
    }
    if (infoEls[1]) {
      infoEls[1].textContent = `Comisión plataforma: ${formatCurrency(comision)}`;
    }
    if (infoEls[2]) {
      infoEls[2].textContent = `Total retirado: ${formatCurrency(totalRetirado)}`;
    }
    
    // Calcular proyección mensual si hay datos
    const hoy = new Date();
    const diaDelMes = hoy.getDate();
    const diasEnMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    
    if (data.monthlySales) {
      const proyeccionMensual = Math.round((data.monthlySales / diaDelMes) * diasEnMes);
      if (infoEls[3]) {
        infoEls[3].textContent = `Proyección mensual: ${formatCurrency(proyeccionMensual)}`;
      }
    }
  }
}

function updateHistorialDesembolsos(data) {
  // Obtener el contenedor del historial
  const historialContainer = document.getElementById('payouts-history');
  if (!historialContainer) return;

  let desembolsos = [];
  
  // Usar el nuevo campo payoutsHistory
  if (data.payoutsHistory && Array.isArray(data.payoutsHistory)) {
    desembolsos = data.payoutsHistory;
  } else if (data.pendingWithdrawals && Array.isArray(data.pendingWithdrawals)) {
    // Combinar pendientes y historial
    desembolsos = data.pendingWithdrawals;
    if (data.payoutsHistory && Array.isArray(data.payoutsHistory)) {
      desembolsos = [...data.pendingWithdrawals, ...data.payoutsHistory];
    }
  } else if (data.payouts && Array.isArray(data.payouts)) {
    desembolsos = data.payouts;
  } else if (data.transactions && Array.isArray(data.transactions)) {
    // Filtrar transacciones que sean desembolsos
    desembolsos = data.transactions.filter(t => t.type === 'PAYOUT' || t.type === 'WITHDRAWAL');
  }

  if (desembolsos.length === 0) {
    historialContainer.innerHTML = '<p style="color: #64748b; font-size: 0.9rem; text-align: center; padding: 1rem;">No hay historial de retiradas aún.</p>';
    return;
  }

  // Ordenar por fecha (más reciente primero)
  desembolsos.sort((a, b) => {
    const dateA = new Date(a.requestedAt || a.processedAt || a.date || a.createdAt);
    const dateB = new Date(b.requestedAt || b.processedAt || b.date || b.createdAt);
    return dateB - dateA;
  });

  // Mostrar las últimas transacciones
  const lastTransactions = desembolsos.slice(0, 5);
  const html = lastTransactions.map(desembolso => {
    const fecha = new Date(desembolso.requestedAt || desembolso.processedAt || desembolso.date || desembolso.createdAt).toLocaleDateString('es-CO');
    const monto = formatCurrency(desembolso.netAmount || desembolso.amount || 0);
    const metodo = desembolso.bankName || desembolso.method || 'Transferencia bancaria';
    const estado = desembolso.status === 'COMPLETED' ? '✓ Completado' : 
                  desembolso.status === 'PENDING' ? '⏳ Pendiente' :
                  desembolso.status === 'PROCESSING' ? '⏳ En proceso' :
                  '✗ Fallido';
    
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9;">
        <div>
          <h4 style="font-size: 0.9rem; font-weight: 700; color: #0f172a; margin: 0;">${estado}</h4>
          <p style="font-size: 0.75rem; color: #64748b; margin: 2px 0 0 0;">${metodo} (${fecha})</p>
        </div>
        <span style="color: #10b981; font-weight: 800; background: #ecfdf5; padding: 4px 8px; border-radius: 6px; font-size: 0.85rem;">${monto}</span>
      </div>
    `;
  }).join('');

  historialContainer.innerHTML = html;
}

function setupChart(data) {
  // Configurar el gráfico de desembolsos
  const ctx = document.getElementById('payoutsChart');
  if (!ctx) return;

  // Extraer datos de desembolsos del backend
  let labels = [];
  let chartData = [];
  
  // Usar payoutsHistory si está disponible
  if (data.payoutsHistory && Array.isArray(data.payoutsHistory)) {
    const sortedPayouts = [...data.payoutsHistory].sort((a, b) => 
      new Date(b.requestedAt || b.date) - new Date(a.requestedAt || a.date)
    );
    labels = sortedPayouts.slice(0, 5).map(p => {
      const date = new Date(p.requestedAt || p.date || p.createdAt);
      return date.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
    });
    chartData = sortedPayouts.slice(0, 5).map(p => p.netAmount || p.amount || 0);
  } else if (data.payouts && Array.isArray(data.payouts)) {
    const sortedPayouts = [...data.payouts].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    labels = sortedPayouts.slice(0, 5).map(p => {
      const date = new Date(p.date);
      return date.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
    });
    chartData = sortedPayouts.slice(0, 5).map(p => p.netAmount || p.amount || 0);
  }
  
  // Si no hay datos, usar datos por defecto vacíos
  if (labels.length === 0) {
    labels = ['Sin datos'];
    chartData = [0];
  }

  new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Desembolsado ($)',
          data: chartData,
          backgroundColor: '#3b82f6',
          borderRadius: 6,
          barThickness: 35,
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
            callback: (value) => '$' + Math.round(value / 1000) + 'k',
          },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
}

function showErrorState() {
  const container = document.querySelector('.aa-ganancias-container');
  if (container) {
    container.innerHTML = '<p style="color: #ef4444; text-align: center; padding: 2rem;">No se pudieron cargar los datos de ganancias. Este módulo requiere endpoints de backend que aún no están implementados.</p>';
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
window.GananciasJS = { init };
