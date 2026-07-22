// ==========================================================================
// DASHBOARD RECENT ORDERS: Tabla de pedidos reales desde la API
// ==========================================================================
async function loadRecentOrdersTable() {
  const tableBody = document.getElementById("recent-orders-tbody");
  if (!tableBody) return;

  let orders = [];
  if (window.API && window.API.orders) {
    try {
      orders = await window.API.orders.getUserOrders();
    } catch (err) {
      console.warn("[dashboard-recent-orders] No se pudieron cargar las órdenes desde la API:", err.message);
    }
  }

  if (!orders || orders.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: #64748b; padding: 1.5rem;">
          No hay pedidos recientes.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = orders.slice(0, 5).map(o => `
    <tr>
      <td><strong>${o.orderNumber || o.id}</strong></td>
      <td>${o.user ? o.user.fullName : 'Cliente'}</td>
      <td>$${(o.total || 0).toLocaleString("es-CO")} COP</td>
      <td><span class="badge badge-info">${o.orderStatus || 'PENDING'}</span></td>
    </tr>
  `).join("");
}

if (typeof window !== "undefined") {
  window.loadRecentOrdersTable = loadRecentOrdersTable;
}
