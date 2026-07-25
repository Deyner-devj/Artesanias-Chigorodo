// js/artesano/mis-pedidos.js
// Gestiona la carga y visualizacion de pedidos recibidos por el artesano

async function loadMisPedidos(status = null) {
  try {
    let pedidos;
    if (status) {
      pedidos = await API.orders.getReceivedByStatus(status);
    } else {
      pedidos = await API.orders.getReceived();
    }
    renderMisPedidos(pedidos);
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    if (window.UF) {
      window.UF.showToast('Error al cargar tus pedidos. Intenta de nuevo.', 'error');
    }
    const tbody = document.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #ef4444; padding: 1rem;">No se pudieron cargar los pedidos</td></tr>';
    }
  }
}

function setupStatusFilters() {
  // Agregar filtros de estado si no existen
  const filterContainer = document.createElement('div');
  filterContainer.style.marginBottom = '1.5rem';
  filterContainer.style.display = 'flex';
  filterContainer.style.gap = '0.5rem';
  filterContainer.style.flexWrap = 'wrap';
  filterContainer.innerHTML = `
    <button onclick="filterPedidosByStatus(null)" 
            style="background: var(--color-active); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-weight: 600;">
      Todos
    </button>
    <button onclick="filterPedidosByStatus('PENDING')" 
            style="background: #fbbf24; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-weight: 600;">
      Pendientes
    </button>
    <button onclick="filterPedidosByStatus('PROCESSING')" 
            style="background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-weight: 600;">
      En Proceso
    </button>
    <button onclick="filterPedidosByStatus('SHIPPED')" 
            style="background: #8b5cf6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-weight: 600;">
      Enviados
    </button>
    <button onclick="filterPedidosByStatus('DELIVERED')" 
            style="background: #22c55e; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-weight: 600;">
      Entregados
    </button>
    <button onclick="filterPedidosByStatus('CANCELLED')" 
            style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-weight: 600;">
      Cancelados
    </button>
  `;

  const container = document.querySelector('div[style*="background: white"]');
  if (container) {
    const h3 = container.querySelector('h3');
    if (h3) {
      h3.parentNode.insertBefore(filterContainer, h3.nextSibling);
    }
  }
}

function filterPedidosByStatus(status) {
  loadMisPedidos(status);
}

function renderMisPedidos(pedidos) {
  const tbody = document.querySelector('tbody');
  if (!tbody) return;

  if (!pedidos || pedidos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #64748b; padding: 1rem;">No tienes pedidos con este filtro.</td></tr>';
    return;
  }

  const statusColors = {
    PENDING: '#fbbf24',
    PROCESSING: '#3b82f6',
    SHIPPED: '#8b5cf6',
    DELIVERED: '#22c55e',
    CANCELLED: '#ef4444'
  };

  const statusLabels = {
    PENDING: 'Pendiente',
    PROCESSING: 'En Proceso',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado'
  };

  const rows = pedidos.map(pedido => {
    const date = pedido.orderDate ? new Date(pedido.orderDate).toLocaleDateString('es-CO') : 'N/A';
    const total = pedido.totalAmount || 0;
    const status = pedido.status || 'PENDING';
    const statusColor = statusColors[status] || '#64748b';
    const statusLabel = statusLabels[status] || status;

    // Obtener el primer producto para mostrar
    const firstProduct = pedido.orderItems && pedido.orderItems.length > 0 
      ? pedido.orderItems[0].productName || 'Producto sin nombre'
      : 'Producto no disponible';

    return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 1rem 0.5rem; color: #0f172a; font-weight: 600;">#${pedido.orderNumber || pedido.id || 'N/A'}</td>
        <td style="padding: 1rem 0.5rem; color: #475569;">${pedido.customerName || pedido.user?.fullName || 'Cliente anónimo'}</td>
        <td style="padding: 1rem 0.5rem; color: #475569;">${firstProduct}</td>
        <td style="padding: 1rem 0.5rem; color: #475569;">${date}</td>
        <td style="padding: 1rem 0.5rem; color: #0f172a; font-weight: 600;">$ ${formatCurrency(total)}</td>
        <td style="padding: 1rem 0.5rem; text-align: right;">
          <select onchange="updatePedidoStatus(${pedido.id}, this.value)" 
                  style="padding: 0.4rem 0.6rem; border-radius: 6px; border: 1px solid #e2e8f0; background: ${statusColor}; color: white; font-weight: 600;">
            <option value="PENDING" ${status === 'PENDING' ? 'selected' : ''}>Pendiente</option>
            <option value="PROCESSING" ${status === 'PROCESSING' ? 'selected' : ''}>En Proceso</option>
            <option value="SHIPPED" ${status === 'SHIPPED' ? 'selected' : ''}>Enviado</option>
            <option value="DELIVERED" ${status === 'DELIVERED' ? 'selected' : ''}>Entregado</option>
            <option value="CANCELLED" ${status === 'CANCELLED' ? 'selected' : ''}>Cancelado</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rows;
}

async function updatePedidoStatus(pedidoId, newStatus) {
  try {
    // Usar orderNumber si está disponible, sino el ID
    const orderIdentifier = pedidoId.toString().startsWith('ORD-') ? pedidoId : `ORD-${pedidoId}`;
    await API.orders.updateStatus(orderIdentifier, newStatus);
    
    if (window.UF) {
      window.UF.showToast(`Estado actualizado a ${newStatus}`, 'success');
    }
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    if (window.UF) {
      window.UF.showToast('Error al actualizar estado', 'error');
    }
  }
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0';
  return new Intl.NumberFormat('es-CO').format(amount);
}

// Inicializar cuando se carga la vista
async function init() {
  await loadMisPedidos();
  setupStatusFilters();
}

// Exponer funciones globalmente
window.filterPedidosByStatus = filterPedidosByStatus;
window.updatePedidoStatus = updatePedidoStatus;
window.MisPedidosJS = { init };
