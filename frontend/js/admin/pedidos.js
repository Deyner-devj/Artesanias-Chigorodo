// Panel Admin - Pedidos: 100% real contra /api/orders. Nada de datos de ejemplo.

const ORDER_STATUS_BADGE = {
  PENDING: "badge-warning",
  PAID: "badge-info",
  TRANSIT: "badge-info",
  DELIVERED: "badge-success",
  CANCELLED: "badge-danger",
};

const ORDER_STATUS_LABEL = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  TRANSIT: "En tránsito",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

async function loadAdminOrders() {
  const body = document.getElementById("admin-orders-table-body");
  if (!body || !window.API) return;

  try {
    const orders = await window.API.orders.getAll();
    if (!orders.length) {
      body.innerHTML =
        '<tr><td colspan="6">Aún no hay pedidos registrados.</td></tr>';
      return;
    }

    // Más recientes primero
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    body.innerHTML = orders
      .map((order) => {
        const badgeClass =
          ORDER_STATUS_BADGE[order.orderStatus] || "badge-warning";
        const badgeLabel =
          ORDER_STATUS_LABEL[order.orderStatus] || order.orderStatus;
        const date = order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("es-CO", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
          : "—";
        return `<tr>
        <td class="font-mono">${escapeHtmlPedidos(order.orderNumber)}</td>
        <td>${escapeHtmlPedidos(order.userFullName)}</td>
        <td>${date}</td>
        <td class="font-semibold">${formatCOPPedidos(order.total)}</td>
        <td>
          <select class="order-status-select" data-order="${order.orderNumber}" style="border:1px solid #cbd5e1;border-radius:6px;padding:0.3rem 0.5rem;font-size:0.8rem;">
            ${Object.keys(ORDER_STATUS_LABEL)
              .map(
                (status) =>
                  `<option value="${status}" ${status === order.orderStatus ? "selected" : ""}>${ORDER_STATUS_LABEL[status]}</option>`,
              )
              .join("")}
          </select>
        </td>
        <td class="row-actions">
          <button class="icon-btn" onclick="viewAdminOrder('${order.orderNumber}')"><i data-lucide="eye"></i></button>
        </td>
      </tr>`;
      })
      .join("");

    if (typeof lucide !== "undefined") lucide.createIcons();

    body.querySelectorAll(".order-status-select").forEach((select) => {
      select.addEventListener("change", async (e) => {
        const orderNumber = e.target.getAttribute("data-order");
        const newStatus = e.target.value;
        try {
          await window.API.orders.updateStatus(orderNumber, newStatus);
          if (window.UF)
            window.UF.toast(
              `Pedido ${orderNumber} actualizado a ${ORDER_STATUS_LABEL[newStatus]}.`,
              "success",
            );
          await loadAdminOrders();
        } catch (error) {
          if (window.UF)
            window.UF.toast(
              "No fue posible actualizar el estado: " + error.message,
              "error",
            );
        }
      });
    });
  } catch (error) {
    body.innerHTML = `<tr><td colspan="6">No fue posible cargar los pedidos: ${error.message}</td></tr>`;
  }
}

async function viewAdminOrder(orderNumber) {
  try {
    const order = await window.API.orders.getByOrderNumber(orderNumber);
    const itemsList = order.items
      .map(
        (i) =>
          `- ${i.productName} x${i.quantity} (${formatCOPPedidos(i.subtotal)})`,
      )
      .join("\n");
    alert(
      `Pedido ${order.orderNumber}\n` +
        `Cliente: ${order.userFullName}\n` +
        `Estado: ${ORDER_STATUS_LABEL[order.orderStatus] || order.orderStatus}\n\n` +
        `Productos:\n${itemsList}\n\n` +
        `Envío: ${order.shippingDetails.address}, ${order.shippingDetails.city}, ${order.shippingDetails.department}\n` +
        `Total: ${formatCOPPedidos(order.total)}`,
    );
  } catch (error) {
    if (window.UF)
      window.UF.toast(
        "No fue posible cargar el detalle del pedido: " + error.message,
        "error",
      );
  }
}

function formatCOPPedidos(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value || 0);
}

function escapeHtmlPedidos(str) {
  return String(str ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

document.addEventListener("DOMContentLoaded", loadAdminOrders);
