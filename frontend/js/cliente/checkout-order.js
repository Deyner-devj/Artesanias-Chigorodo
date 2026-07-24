// Crea una orden real, la marca como pagada y vacía el carrito.
// Los precios se recalculan siempre en el servidor.

const PAYMENT_METHOD_MAP = {
  CARD: "CREDIT_CARD",
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  MERCADOPAGO: "MERCADO_PAGO",
  PSE: "PSE",
  NEQUI: "NEQUI",
  DAVIPLATA: "DAVIPLATA",
};

function normalizePaymentMethod(method) {
  return PAYMENT_METHOD_MAP[method] || method;
}

async function completeCheckoutOrder(paymentMethod) {
  const items = getCartItems();
  if (!items.length) throw new Error("Tu carrito esta vacio.");

  const normalizedMethod = normalizePaymentMethod(paymentMethod);

  // Obtener datos de envío guardados
  const shippingCountry = sessionStorage.getItem("checkout_shipping_country") || "Colombia";
  const shippingDepartment = sessionStorage.getItem("checkout_shipping_department") || "";
  const shippingCity = sessionStorage.getItem("checkout_shipping_city") || "";
  const shippingAddress = sessionStorage.getItem("checkout_shipping_address") || "";
  const shippingPostalCode = sessionStorage.getItem("checkout_shipping_postal_code") || "";
  const shippingMethod = (sessionStorage.getItem("checkout_shipping_method") || "STANDARD").toUpperCase();

  // Validar que los datos de envío sean completos
  if (!shippingCountry || !shippingDepartment || !shippingCity || !shippingAddress) {
    throw new Error("Los datos de envío no están completos. Por favor vuelve al paso de envío.");
  }

  // 1. Crear la orden (queda PENDING, con stock ya reservado)
  const order = await window.API.orders.create({
    items: items.map((item) => ({
      productId: Number(item.product.id),
      quantity: item.quantity,
    })),
    shippingDetails: {
      country: shippingCountry,
      department: shippingDepartment,
      city: shippingCity,
      address: shippingAddress,
      postalCode: shippingPostalCode,
      shippingMethod: shippingMethod,
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
