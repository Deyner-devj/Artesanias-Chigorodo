import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Check, X, ArrowLeft, Shield, User, Mail, Phone, MapPin, Globe, CreditCard, Lock, RotateCcw, Truck } from 'lucide-react';

const CartPage = () => {
  const { items, removeProduct, addProduct, decreaseProduct, clearCart, total } = useCart();
  const [step, setStep] = useState(0); // 0: Cart, 1: Info, 2: Shipping, 3: Payment, 4: PSE, 5: Success
  const navigate = useNavigate();

  // Discount code states
  const [couponInput, setCouponInput] = useState('');
  const [discount, setDiscount] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    name: 'Juan Pérez',
    email: 'juanperez@mail.com',
    phone: '3001234567',
    address: 'Calle 12 #45-67',
    department: 'Antioquia',
    city: 'Medellín',
    zipCode: '050004',
    shippingMethod: 'STANDARD', // STANDARD, EXPRESS, PICKUP
    paymentMethod: 'PSE', // PSE, CARD, MERCADOPAGO, NEQUI, DAVIPLATA
    pseBank: ''
  });

  const [orderNumber, setOrderNumber] = useState('');

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val);
  };

  const getShippingCost = () => {
    if (formData.shippingMethod === 'STANDARD') return 15000;
    if (formData.shippingMethod === 'EXPRESS') return 25000;
    return 0; // PICKUP
  };

  const subTotalAfterDiscount = Math.max(0, total - discount);
  const grandTotal = subTotalAfterDiscount + getShippingCost();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.paymentMethod === 'PSE') {
      setStep(4); // Go to PSE Mock Bank Portal
    } else {
      processMockOrder();
    }
  };

  const processMockOrder = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(`AC-2024-${randomNum}`);
    clearCart();
    setStep(5); // Go to Success
  };

  if (items.length === 0 && step < 5) {
    return (
      <main className="page cart-page" style={{ width: 'min(1200px, calc(100% - 2rem))', margin: '0 auto', padding: '4rem 0' }}>
        <header className="page-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Tu carrito de compras</h1>
        </header>
        <section className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem' }}>
          <div className="empty-cart-icon" style={{ fontSize: '4rem', color: 'var(--text-muted)' }}>
            <ShoppingCartIcon />
          </div>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Aún no hay productos en tu carrito.</p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '14px 28px' }}>Ir al catálogo</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page cart-page-container" style={{ width: 'min(1200px, calc(100% - 2rem))', margin: '0 auto', padding: '2.5rem 0' }}>
      {/* Checkout Progress Bar (for steps 1-3) */}
      {step >= 1 && step <= 3 && (
        <div className="checkout-progress-bar">
          <div className={`progress-step ${step === 1 ? 'active' : step > 1 ? 'completed' : 'pending'}`}>
            <div className="step-num-badge">
              {step > 1 ? <Check size={16} strokeWidth={3} /> : '1'}
            </div>
            <span className="step-label">1. Información</span>
          </div>
          <div className={`progress-connector ${step > 1 ? 'filled' : ''}`}></div>
          <div className={`progress-step ${step === 2 ? 'active' : step > 2 ? 'completed' : 'pending'}`}>
            <div className="step-num-badge">
              {step > 2 ? <Check size={16} strokeWidth={3} /> : '2'}
            </div>
            <span className="step-label">2. Envío</span>
          </div>
          <div className={`progress-connector ${step > 2 ? 'filled' : ''}`}></div>
          <div className={`progress-step ${step === 3 ? 'active' : step > 3 ? 'completed' : 'pending'}`}>
            <div className="step-num-badge">
              {step > 3 ? <Check size={16} strokeWidth={3} /> : '3'}
            </div>
            <span className="step-label">3. Pago</span>
          </div>
        </div>
      )}

      {/* STEP 0: Shopping Cart View */}
      {step === 0 && (
        <div className="cart-grid">
          {/* List of Products */}
          <div className="cart-items-panel" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>Mi carrito</h1>
            
            {/* Table layout headers */}
            <div className="cart-table-headers" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 40px', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Producto</span>
              <span>Precio unitario</span>
              <span style={{ textAlign: 'center' }}>Cantidad</span>
              <span style={{ textAlign: 'right' }}>Subtotal</span>
              <span></span>
            </div>

            <div className="cart-items-list" style={{ display: 'flex', flexDirection: 'column' }}>
              {items.map((item) => (
                <div key={item.product.id} className="cart-item-card" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 40px', alignItems: 'center', padding: '1.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={item.product.image} alt={item.product.name} className="cart-item-img" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>{item.product.name}</h3>
                      <p className="cart-item-seller" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Vendedor: {item.product.sellerName}</p>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-dark)', fontWeight: 500 }}>
                    {formatCOP(item.product.price)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="qty-selector-group" style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
                      <button 
                        onClick={() => decreaseProduct(item.product.id)} 
                        className="quantity-btn-minus"
                        style={{ border: 'none', background: 'none', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 700 }}
                      >
                        -
                      </button>
                      <input 
                        type="text" 
                        value={item.quantity} 
                        readOnly 
                        style={{ width: '28px', textAlign: 'center', border: 'none', background: 'transparent', fontWeight: 700, padding: 0, fontSize: '0.85rem' }} 
                      />
                      <button 
                        onClick={() => addProduct(item.product)} 
                        className="quantity-btn-plus"
                        style={{ border: 'none', background: 'none', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 700 }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.95rem' }}>
                    {formatCOP(item.product.price * item.quantity)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => removeProduct(item.product.id)} 
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)', opacity: 0.8 }}
                      title="Eliminar producto"
                    >
                      <X size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Código de descuento" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{ width: '180px', padding: '0.65rem 1rem', fontSize: '0.9rem' }} 
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (couponInput.trim().toUpperCase() === 'CHIGORODO10') {
                      setDiscount(Math.round(total * 0.1));
                      alert('¡Código de descuento CHIGORODO10 aplicado! 10% de descuento.');
                    } else {
                      alert('Código inválido. Usa el código de prueba "CHIGORODO10".');
                    }
                  }}
                  className="btn btn-outline-orange" 
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', borderRadius: 'var(--border-radius-input)' }}
                >
                  Aplicar
                </button>
              </div>
              <Link to="/products" className="link-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ArrowLeft size={16} /> Seguir comprando
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary-panel" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Resumen del pedido</h2>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatCOP(total)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--primary)' }}>
                <span>Descuento (10%)</span>
                <span style={{ fontWeight: 600 }}>-{formatCOP(discount)}</span>
              </div>
            )}
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              <span>Envío</span>
              <span>Calculado en pago</span>
            </div>
            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1.5rem 0' }}></div>
            <div className="summary-row total-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 800 }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>{formatCOP(subTotalAfterDiscount)}</span>
            </div>

            <button onClick={handleNextStep} className="btn btn-secondary btn-block" style={{ padding: '14px' }}>Ir a pagar</button>
          </div>
        </div>
      )}

      {/* STEP 1: Shipping Information */}
      {step === 1 && (
        <div className="cart-grid">
          <div className="checkout-form-panel">
            <h2>Finalizar compra</h2>
            <div className="form-section-title">1. Información de contacto</div>
            <form className="checkout-inputs-grid" onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
              <div className="input-field full-width">
                <label>Nombre completo</label>
                <div className="checkout-input-with-icon">
                  <User className="checkout-input-icon" size={18} />
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="input-field half-width">
                <label>Correo electrónico</label>
                <div className="checkout-input-with-icon">
                  <Mail className="checkout-input-icon" size={18} />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="input-field half-width">
                <label>Teléfono</label>
                <div className="checkout-input-with-icon">
                  <Phone className="checkout-input-icon" size={18} />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-section-title full-width" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Dirección de envío</div>
              
              <div className="input-field third-width">
                <label>País</label>
                <div className="checkout-input-with-icon">
                  <Globe className="checkout-input-icon" size={18} />
                  <select name="country" disabled style={{ paddingLeft: '2.75rem' }}>
                    <option value="Colombia">Colombia</option>
                  </select>
                </div>
              </div>
              <div className="input-field third-width">
                <label>Departamento</label>
                <input type="text" name="department" value={formData.department} onChange={handleInputChange} required />
              </div>
              <div className="input-field third-width">
                <label>Ciudad</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
              </div>
              <div className="input-field full-width">
                <label>Dirección</label>
                <div className="checkout-input-with-icon">
                  <MapPin className="checkout-input-icon" size={18} />
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="input-field half-width">
                <label>Código postal</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
              </div>

              <div className="full-width" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="save-info" style={{ accentColor: 'var(--secondary)' }} defaultChecked />
                <label htmlFor="save-info" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>Guardar información para próximas compras</label>
              </div>

              <div className="form-actions-row full-width" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button type="button" onClick={handlePrevStep} className="btn btn-outline-green" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ArrowLeft size={16} /> Volver al carrito
                </button>
                <button type="submit" className="btn btn-secondary">Continuar con envío</button>
              </div>
            </form>
          </div>

          {/* Cart Summary Mini */}
          <SideOrderSummary total={total} items={items} formatCOP={formatCOP} shippingCost={0} discount={discount} isInitialStep />
        </div>
      )}

      {/* STEP 2: Shipping Method */}
      {step === 2 && (
        <div className="cart-grid">
          <div className="checkout-form-panel">
            <h2>Finalizar compra</h2>
            <div className="form-section-title">2. Método de envío</div>
            
            <div className="shipping-methods-list">
              <label className={`shipping-option-card ${formData.shippingMethod === 'STANDARD' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="shippingMethod" 
                  value="STANDARD" 
                  checked={formData.shippingMethod === 'STANDARD'}
                  onChange={handleInputChange}
                />
                <div className="shipping-option-details">
                  <span className="option-title">Envío estándar (2 a 5 días hábiles)</span>
                  <span className="option-desc">Entrega nacional confiable a tu domicilio.</span>
                </div>
                <span className="option-price">{formatCOP(15000)}</span>
              </label>

              <label className={`shipping-option-card ${formData.shippingMethod === 'EXPRESS' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="shippingMethod" 
                  value="EXPRESS" 
                  checked={formData.shippingMethod === 'EXPRESS'}
                  onChange={handleInputChange}
                />
                <div className="shipping-option-details">
                  <span className="option-title">Envío express (24 a 48 horas)</span>
                  <span className="option-desc">Entrega prioritaria en principales ciudades colombianas.</span>
                </div>
                <span className="option-price">{formatCOP(25000)}</span>
              </label>

              <label className={`shipping-option-card ${formData.shippingMethod === 'PICKUP' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="shippingMethod" 
                  value="PICKUP" 
                  checked={formData.shippingMethod === 'PICKUP'}
                  onChange={handleInputChange}
                />
                <div className="shipping-option-details">
                  <span className="option-title">Recoger en tienda (Medellín)</span>
                  <span className="option-desc">Retira directamente en nuestro punto físico sin costos de envío.</span>
                </div>
                <span className="option-price">Gratis</span>
              </label>
            </div>

            <div className="form-actions-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button type="button" onClick={handlePrevStep} className="btn btn-outline-green" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={16} /> Volver
              </button>
              <button type="button" onClick={handleNextStep} className="btn btn-secondary">Continuar con pago</button>
            </div>
          </div>

          {/* Cart Summary Mini */}
          <SideOrderSummary total={total} items={items} formatCOP={formatCOP} shippingCost={getShippingCost()} discount={discount} />
        </div>
      )}

      {/* STEP 3: Payment Method */}
      {step === 3 && (
        <div className="cart-grid">
          <div className="checkout-form-panel">
            <h2>Finalizar compra</h2>
            <div className="form-section-title">3. Método de pago</div>
            <form onSubmit={handlePaymentSubmit}>
              <div className="payment-methods-list">
                <label className={`payment-option-card ${formData.paymentMethod === 'PSE' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="PSE" 
                    checked={formData.paymentMethod === 'PSE'}
                    onChange={handleInputChange}
                  />
                  <div className="payment-option-icon">
                    <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', border: '1.5px solid var(--primary)', padding: '0.15rem 0.35rem', borderRadius: '4px' }}>PSE</span>
                  </div>
                  <div className="payment-option-details">
                    <span className="payment-title">PSE - Pagos Seguros en Línea</span>
                    <span className="payment-desc">Débito directo desde tu cuenta bancaria (Ahorros/Corriente).</span>
                  </div>
                </label>

                <label className={`payment-option-card ${formData.paymentMethod === 'CARD' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="CARD" 
                    checked={formData.paymentMethod === 'CARD'}
                    onChange={handleInputChange}
                  />
                  <div className="payment-option-icon">
                    <CreditCard size={20} />
                  </div>
                  <div className="payment-option-details">
                    <span className="payment-title">Tarjeta de crédito / débito</span>
                    <span className="payment-desc">Visa, Mastercard, American Express.</span>
                  </div>
                </label>

                <label className={`payment-option-card ${formData.paymentMethod === 'MERCADOPAGO' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="MERCADOPAGO" 
                    checked={formData.paymentMethod === 'MERCADOPAGO'}
                    onChange={handleInputChange}
                  />
                  <div className="payment-option-icon">
                    <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>MP</span>
                  </div>
                  <div className="payment-option-details">
                    <span className="payment-title">Mercado Pago</span>
                    <span className="payment-desc">Dinero en cuenta de Mercado Pago o tarjetas guardadas.</span>
                  </div>
                </label>

                <label className={`payment-option-card ${formData.paymentMethod === 'NEQUI' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="NEQUI" 
                    checked={formData.paymentMethod === 'NEQUI'}
                    onChange={handleInputChange}
                  />
                  <div className="payment-option-icon">
                    <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>Nq</span>
                  </div>
                  <div className="payment-option-details">
                    <span className="payment-title">Nequi</span>
                    <span className="payment-desc">Paga al instante de forma móvil con tu celular Nequi.</span>
                  </div>
                </label>

                <label className={`payment-option-card ${formData.paymentMethod === 'DAVIPLATA' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="DAVIPLATA" 
                    checked={formData.paymentMethod === 'DAVIPLATA'}
                    onChange={handleInputChange}
                  />
                  <div className="payment-option-icon">
                    <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>Dp</span>
                  </div>
                  <div className="payment-option-details">
                    <span className="payment-title">Daviplata</span>
                    <span className="payment-desc">Paga de forma fácil y segura usando tu cuenta Daviplata.</span>
                  </div>
                </label>
              </div>

              {formData.paymentMethod === 'PSE' && (
                <div className="pse-bank-select-box">
                  <label>Selecciona tu banco:</label>
                  <select name="pseBank" value={formData.pseBank} onChange={handleInputChange} required>
                    <option value="">-- Seleccionar Banco --</option>
                    <option value="Bancolombia">Bancolombia</option>
                    <option value="Banco de Bogotá">Banco de Bogotá</option>
                    <option value="Davivienda">Davivienda</option>
                    <option value="Banco Popular">Banco Popular</option>
                    <option value="Banco Itaú">Banco Itaú</option>
                    <option value="BBVA Colombia">BBVA Colombia</option>
                    <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
                  </select>
                </div>
              )}

              <div className="form-actions-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button type="button" onClick={handlePrevStep} className="btn btn-outline-green" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ArrowLeft size={16} /> Volver
                </button>
                <button type="submit" className="btn btn-secondary">Pagar ahora</button>
              </div>
            </form>
          </div>

          {/* Cart Summary Mini */}
          <SideOrderSummary total={total} items={items} formatCOP={formatCOP} shippingCost={getShippingCost()} discount={discount} />
        </div>
      )}

      {/* STEP 4: PSE Mock Portal */}
      {step === 4 && (
        <div className="pse-mock-portal-overlay">
          <div className="pse-portal-card">
            <div className="pse-portal-header">
              <span className="pse-logo-badge">pse</span>
              <h3>PSE - Portal de Pagos Seguros</h3>
            </div>
            <div className="pse-portal-body">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                Serás redirigido al portal seguro del banco para realizar el pago.
              </p>
              
              <div className="pse-transaction-info">
                <h4>Detalle de la transacción</h4>
                <div className="pse-info-row">
                  <span>Comercio:</span>
                  <strong>Artesanías Chigorodó S.A.S</strong>
                </div>
                <div className="pse-info-row">
                  <span>Banco:</span>
                  <strong>{formData.pseBank || 'Bancolombia'}</strong>
                </div>
                <div className="pse-info-row">
                  <span>Titular:</span>
                  <strong>{formData.name}</strong>
                </div>
                <div className="pse-info-row">
                  <span>Monto:</span>
                  <strong className="pse-amount">{formatCOP(grandTotal)}</strong>
                </div>
              </div>

              <div className="pse-terms-checkbox">
                <input type="checkbox" id="pse-terms" required />
                <label htmlFor="pse-terms" style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Acepto los términos y condiciones y la política de privacidad de la pasarela.
                </label>
              </div>

              <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total a pagar:</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b428c', marginTop: '0.25rem' }}>{formatCOP(grandTotal)}</div>
              </div>

              <div className="pse-portal-actions">
                <button onClick={() => setStep(3)} className="btn btn-outline-orange">Cancelar</button>
                <button onClick={processMockOrder} className="btn btn-pse-blue" style={{ borderRadius: '8px', padding: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  Pagar con PSE
                </button>
              </div>
            </div>
            <div className="pse-portal-footer">
              <Lock size={14} />
              <span>Transacción segura cifrada SSL</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Success / Confirmation Screen */}
      {step === 5 && (
        <div className="order-success-panel">
          <div className="success-check-badge">
            <Check size={42} strokeWidth={2.5} />
          </div>
          <h1>¡Gracias por tu compra!</h1>
          <p className="success-message">Tu pedido ha sido recibido correctamente.</p>

          <div className="success-invoice-box">
            <h3>Resumen del pedido</h3>
            <div className="invoice-details-grid" style={{ marginBottom: '1.5rem' }}>
              <div className="detail-col">
                <span>Número de orden:</span>
                <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>#{orderNumber}</strong>
              </div>
              <div className="detail-col">
                <span>Fecha:</span>
                <strong>{new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </div>
              <div className="detail-col">
                <span>Cliente:</span>
                <strong>{formData.name}</strong>
              </div>
              <div className="detail-col">
                <span>Dirección de envío:</span>
                <strong>{formData.address}, {formData.city}</strong>
              </div>
            </div>

            <div className="invoice-divider"></div>

            <div className="invoice-total-summary">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                <span>Subtotal:</span>
                <span>{formatCOP(total)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                  <span>Descuento:</span>
                  <span>-{formatCOP(discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                <span>Envío:</span>
                <span>{formData.shippingMethod === 'PICKUP' ? 'Gratis' : formatCOP(getShippingCost())}</span>
              </div>
              <div className="invoice-divider" style={{ margin: '0.75rem 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.35rem' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--primary)' }}>{formatCOP(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="success-next-steps">
            <h4 style={{ fontFamily: 'var(--font-serif)' }}>¿Qué sigue?</h4>
            <div className="steps-list" style={{ marginTop: '1.25rem' }}>
              <div className="step-card">
                <div className="step-icon-circle">
                  <Mail size={22} strokeWidth={1.5} />
                </div>
                <h5>Confirmación</h5>
                <p>Te hemos enviado un correo con los detalles de tu factura.</p>
              </div>

              <div className="step-card">
                <div className="step-icon-circle">
                  <RotateCcw size={22} strokeWidth={1.5} />
                </div>
                <h5>Preparación</h5>
                <p>El maestro artesano comenzará a preparar el embalaje de tu pieza.</p>
              </div>

              <div className="step-card">
                <div className="step-icon-circle">
                  <Truck size={22} strokeWidth={1.5} />
                </div>
                <h5>Envío</h5>
                <p>Recibirás un correo con el número de guía para rastrear el paquete.</p>
              </div>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/account" className="btn btn-secondary" style={{ padding: '14px 28px', minWidth: '220px' }}>Ir a mis pedidos</Link>
            <Link to="/products" className="link-secondary" style={{ marginTop: '0.5rem' }}>Seguir comprando</Link>
          </div>
        </div>
      )}
    </main>
  );
};

// Side Order Summary Card Component
const SideOrderSummary = ({ total, items, formatCOP, shippingCost, discount = 0, isInitialStep = false }: any) => {
  return (
    <div className="cart-summary-panel" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
      <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Resumen del pedido</h2>
      
      <div className="summary-items-preview" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {items.map((item: any) => (
          <div key={item.product.id} className="checkout-summary-item-card">
            <img src={item.product.image} alt={item.product.name} className="checkout-summary-item-img" />
            <div className="checkout-summary-item-info">
              <span className="checkout-summary-item-name">{item.product.name}</span>
              <span className="checkout-summary-item-qty">Cantidad: {item.quantity}</span>
              <span className="checkout-summary-item-price">{formatCOP(item.product.price * item.quantity)}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1.5rem 0' }}></div>

      <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
        <span>Subtotal</span>
        <span style={{ fontWeight: 600 }}>{formatCOP(total)}</span>
      </div>
      {discount > 0 && (
        <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--primary)' }}>
          <span>Descuento (10%)</span>
          <span style={{ fontWeight: 600 }}>-{formatCOP(discount)}</span>
        </div>
      )}
      <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        <span>Envío</span>
        <span style={{ color: isInitialStep ? 'var(--text-muted)' : 'var(--text-dark)', fontWeight: isInitialStep ? 400 : 600 }}>
          {isInitialStep ? 'Calculado en siguiente paso' : shippingCost === 0 ? 'Gratis' : formatCOP(shippingCost)}
        </span>
      </div>
      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1.5rem 0' }}></div>
      <div className="summary-row total-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800 }}>
        <span>Total</span>
        <span style={{ color: 'var(--primary)' }}>{formatCOP(Math.max(0, total - discount) + shippingCost)}</span>
      </div>
    </div>
  );
};

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);


export default CartPage;
