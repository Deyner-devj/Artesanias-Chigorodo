// El seguimiento muestra exclusivamente el estado confirmado por el servidor.
(function () {
  const labels = { PENDING: 'Pendiente', PROCESSING: 'En preparacion', SHIPPED: 'En transito', DELIVERED: 'Entregado', CANCELLED: 'Cancelado' };
  function stageFromOrder(order) {
    const status = String(order.orderStatus || '').toUpperCase();
    if (status === 'DELIVERED') return { key: 'delivered', progress: 1 };
    if (status === 'SHIPPED') return { key: 'transit', progress: .5 };
    return { key: 'warehouse', progress: 0 };
  }
  function renderScene(container, order) {
    if (!container) return null;
    const stage = stageFromOrder(order);
    container.dataset.stage = stage.key;
    const caption = container.querySelector('.tracking-scene__caption');
    if (caption) caption.textContent = labels[String(order.orderStatus || '').toUpperCase()] || 'Estado actualizado por el comercio';
    return stage;
  }
  function renderStatusPill(element, stage, order) {
    if (!element) return;
    const text = labels[String(order?.orderStatus || '').toUpperCase()] || 'Pendiente';
    (element.querySelector('.text') || element).textContent = text;
    element.classList.toggle('is-delivered', stage.key === 'delivered');
  }
  window.OrderTracking = { renderScene, renderStatusPill, stageFromOrder };
})();
