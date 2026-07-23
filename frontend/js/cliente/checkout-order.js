// Crea una orden real antes de vaciar el carrito. Los precios se recalculan en el servidor.
async function completeCheckoutOrder(paymentMethod) {
  const info = JSON.parse(sessionStorage.getItem('checkout_info') || '{}');
  const items = getCartItems();
  if (!items.length) throw new Error('Tu carrito esta vacio.');
  const order = await window.API.orders.create({
    items: items.map((item) => ({ productId: Number(item.product.id), quantity: item.quantity })),
    shippingDetails: { country: info.country || 'Colombia', department: info.department, city: info.city, address: info.address, postalCode: info.zipCode || '', shippingMethod: (sessionStorage.getItem('checkout_shipping_method') || 'STANDARD').toUpperCase() },
    paymentDetails: { paymentMethod: paymentMethod === 'CARD' ? 'CREDIT_CARD' : paymentMethod, transactionId: `PENDING-${Date.now()}`, status: 'PENDING' },
  });
  await clearCart();
  sessionStorage.setItem('checkout_order_number', order.orderNumber);
  return order;
}
