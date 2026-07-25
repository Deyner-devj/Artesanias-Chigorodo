// js/artesano/clientes.js
// Gestiona la visualizacion de clientes del artesano

async function init() {
  try {
    await loadClientes();
  } catch (error) {
    console.error('Error al cargar clientes:', error);
    const tbody = document.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #ef4444; padding: 1rem;">No se pudieron cargar los clientes. Este módulo requiere un endpoint de backend que aún no está implementado.</td></tr>';
    }
  }
}

async function loadClientes() {
  // Según las reglas de negocio, los artesanos NO pueden ver información de clientes (email, teléfono)
  // Solo pueden ver productos vendidos y cuántos (de su pertenencia)
  // Este módulo ahora muestra información agregada de ventas por cliente anonimizado
  
  try {
    const pedidos = await API.orders.getReceived();
    if (pedidos && pedidos.length > 0) {
      // Extraer información AGREGADA de ventas (sin datos personales de clientes)
      const clientesMap = new Map();
      pedidos.forEach(pedido => {
        // Usar un identificador anonimizado o el número de pedido
        const clienteId = pedido.id || pedido.orderNumber || Math.random().toString(36).substr(2, 9);
        
        // Solo mostrar información no sensible
        const clienteName = 'Cliente #' + (pedido.orderNumber || clienteId.substring(0, 8));
        const clienteLocation = pedido.shippingDetails?.city || 'No especificado';
        
        if (!clientesMap.has(clienteId)) {
          clientesMap.set(clienteId, {
            id: clienteId,
            name: clienteName,
            // NO incluir email ni teléfono - política de privacidad
            location: clienteLocation,
            compras: 1,
            totalGastado: pedido.total || 0
          });
        } else {
          const cliente = clientesMap.get(clienteId);
          cliente.compras = (cliente.compras || 1) + 1;
          cliente.totalGastado = (cliente.totalGastado || 0) + (pedido.total || 0);
        }
      });
      
      const clientes = Array.from(clientesMap.values());
      renderClientes(clientes);
      return;
    }
  } catch (e) {
    console.error('Error al obtener pedidos:', e);
  }

  // Si no hay datos, mostrar mensaje
  const tbody = document.querySelector('tbody');
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #64748b; padding: 1rem;">No tienes ventas registradas aún.</td></tr>';
  }
}

function renderClientes(clientes) {
  const tbody = document.querySelector('tbody');
  if (!tbody) return;

  if (!clientes || clientes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #64748b; padding: 1rem;">No tienes ventas registradas aún.</td></tr>';
    return;
  }

  const rows = clientes.map(cliente => {
    const totalFormatted = formatCurrency(cliente.totalGastado || 0);
    
    return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 1rem 0.5rem;">
          <div style="font-weight: 600; color: #0f172a;">${cliente.name || 'Cliente Anónimo'}</div>
          <div style="font-size: 0.75rem; color: #94a3b8;">${cliente.id}</div>
        </td>
        <td style="padding: 1rem 0.5rem; color: #475569;">${cliente.location || 'No especificado'}</td>
        <td style="padding: 1rem 0.5rem; color: #0f172a; font-weight: 600; text-align: center;">${cliente.compras || 1}</td>
        <td style="padding: 1rem 0.5rem; color: #10b981; font-weight: 600; text-align: right;">${totalFormatted}</td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rows;
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
window.ClientesJS = { init };
