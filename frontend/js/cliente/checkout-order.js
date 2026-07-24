// Crea una orden real, la marca como pagada y vacía el carrito.
// Los precios se recalculan siempre en el servidor.

const PAYMENT_METHOD_MAP = {
  CARD: "CREDIT_CARD",
  MERCADOPAGO: "MERCADO_PAGO",
};

function normalizePaymentMethod(method) {
  return PAYMENT_METHOD_MAP[method] || method;
}

async function completeCheckoutOrder(paymentMethod) {
  const info = JSON.parse(sessionStorage.getItem("checkout_info") || "{}");
  const items = getCartItems();
  if (!items.length) throw new Error("Tu carrito esta vacio.");

  const normalizedMethod = normalizePaymentMethod(paymentMethod);

  // 1. Crear la orden (queda PENDING, con stock ya reservado)
  const order = await window.API.orders.create({
    items: items.map((item) => ({
      productId: Number(item.product.id),
      quantity: item.quantity,
    })),
    shippingDetails: {
      country: info.country || "Colombia",
      department: info.department,
      city: info.city,
      address: info.address,
      postalCode: info.zipCode || "",
      shippingMethod: (
        sessionStorage.getItem("checkout_shipping_method") || "STANDARD"
      ).toUpperCase(),
    },
    paymentDetails: {
      paymentMethod: normalizedMethod,
      transactionId: `PENDING-${Date.now()}`,
      status: "PENDING",
    },
  });

  // 2. Procesar el pago: esto marca la orden como PAID y genera la factura
  await window.API.payments.process({
    orderNumber: order.orderNumber,
    paymentMethod: normalizedMethod,
    transactionId: `TXN-${Date.now()}`,
    status: "APPROVED",
  });

  await clearCart();
  sessionStorage.setItem("checkout_order_number", order.orderNumber);
  return order;
}
