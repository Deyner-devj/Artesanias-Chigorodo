import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ShoppingBag, Settings, MapPin, CreditCard, Heart, LogOut, Check, Truck, CreditCard as CardIcon, X } from 'lucide-react';

interface OrderDetail {
  id: string;
  date: string;
  status: 'delivered' | 'transit';
  statusText: string;
  total: number;
  items: { name: string; qty: number; price: number }[];
  address: string;
  city: string;
}

const AccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pedidos' | 'datos' | 'direcciones' | 'pagos' | 'favoritos'>('pedidos');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  // Profile states
  const [profileData, setProfileData] = useState({
    name: 'Juan Pérez',
    email: 'juanperez@mail.com',
    phone: '3001234567',
    city: 'Medellín',
    address: 'Calle 12 #45-67'
  });

  const orders: OrderDetail[] = [
    { 
      id: '#AC-2024-000125', 
      date: 'Mayo 28, 2024', 
      status: 'delivered', 
      statusText: 'Entregado', 
      total: 505000, 
      address: 'Calle 12 #45-67',
      city: 'Medellín',
      items: [
        { name: 'Mochila Wayuu Colores del Sol', qty: 1, price: 280000 },
        { name: 'Jarrón de Barro Negro', qty: 1, price: 120000 },
        { name: 'Individual Tejido Multicolor (x2)', qty: 2, price: 45000 }
      ]
    },
    { 
      id: '#AC-2024-000098', 
      date: 'Abril 14, 2024', 
      status: 'transit', 
      statusText: 'En tránsito', 
      total: 320000, 
      address: 'Carrera 45 #89-12',
      city: 'Envigado',
      items: [
        { name: 'Hamaca San Jacinto', qty: 1, price: 350000 }
      ]
    },
    { 
      id: '#AC-2024-000075', 
      date: 'Marzo 10, 2024', 
      status: 'delivered', 
      statusText: 'Entregado', 
      total: 118000, 
      address: 'Calle 12 #45-67',
      city: 'Medellín',
      items: [
        { name: 'Aretes de Filigrana Momposina', qty: 1, price: 150000 }
      ]
    }
  ];

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val);
  };

  const handleLogout = () => {
    alert('Cerrando sesión de usuario...');
    navigate('/');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Tus datos han sido guardados con éxito.');
  };

  return (
    <main className="page account-page-container" style={{ width: 'min(1200px, calc(100% - 2rem))', margin: '0 auto', padding: '2.5rem 0' }}>
      <div className="account-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Sidebar Menu */}
        <aside className="account-sidebar" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <nav className="account-sidebar-menu" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
              <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--text-dark)' }}>{profileData.name}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{profileData.email}</span>
            </div>
            
            <button 
              onClick={() => { setActiveTab('pedidos'); setSelectedOrder(null); }} 
              className={`account-menu-item ${activeTab === 'pedidos' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}
            >
              <ShoppingBag size={18} /> Mis pedidos
            </button>
            
            <button 
              onClick={() => { setActiveTab('datos'); setSelectedOrder(null); }} 
              className={`account-menu-item ${activeTab === 'datos' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}
            >
              <Settings size={18} /> Mis datos
            </button>
            
            <button 
              onClick={() => { setActiveTab('direcciones'); setSelectedOrder(null); }} 
              className={`account-menu-item ${activeTab === 'direcciones' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}
            >
              <MapPin size={18} /> Direcciones
            </button>
            
            <button 
              onClick={() => { setActiveTab('pagos'); setSelectedOrder(null); }} 
              className={`account-menu-item ${activeTab === 'pagos' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}
            >
              <CreditCard size={18} /> Métodos de pago
            </button>
            
            <button 
              onClick={() => { setActiveTab('favoritos'); setSelectedOrder(null); }} 
              className={`account-menu-item ${activeTab === 'favoritos' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}
            >
              <Heart size={18} /> Favoritos
            </button>

            <button 
              onClick={handleLogout} 
              className="account-menu-item"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#c2410c', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem' }}
            >
              <LogOut size={18} /> Cerrar sesión
            </button>
          </nav>
        </aside>

        {/* Right Main Content */}
        <section className="account-main-content" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
          
          {/* TAB 1: Orders */}
          {activeTab === 'pedidos' && !selectedOrder && (
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>Mis pedidos</h2>
              <div className="orders-list-table">
                {orders.map((order, idx) => (
                  <div key={idx} className="order-row-item" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr 1fr', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div className="order-col-id" style={{ fontWeight: 700 }}>{order.id}</div>
                    <div className="order-col-date" style={{ color: 'var(--text-muted)' }}>{order.date}</div>
                    <div>
                      <span className={`order-badge ${order.status}`}>
                        {order.statusText}
                      </span>
                    </div>
                    <div className="order-col-total" style={{ fontWeight: 700 }}>{formatCOP(order.total)}</div>
                    <div className="order-col-link" style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => setSelectedOrder(order)} 
                        className="btn btn-outline-green" 
                        style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '6px' }}
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-view: Order Detail Panel */}
          {activeTab === 'pedidos' && selectedOrder && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setSelectedOrder(null)} 
                style={{ position: 'absolute', top: 0, right: 0, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>Detalle de Pedido {selectedOrder.id}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Artículos del pedido</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{item.name}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>Cantidad: {item.qty}</span>
                        </div>
                        <span style={{ fontWeight: 600 }}>{formatCOP(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Resumen de envío</h4>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Ciudad:</strong> {selectedOrder.city}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Dirección:</strong> {selectedOrder.address}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Fecha compra:</strong> {selectedOrder.date}</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Estado:</strong> <span className={`order-badge ${selectedOrder.status}`}>{selectedOrder.statusText}</span></p>
                  
                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1rem 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem' }}>
                    <span>Total pagado:</span>
                    <span style={{ color: 'var(--primary)' }}>{formatCOP(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Mis Datos Profile */}
          {activeTab === 'datos' && (
            <form onSubmit={handleProfileSave}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>Mis datos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="input-field">
                  <label>Nombre completo</label>
                  <input 
                    type="text" 
                    value={profileData.name} 
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))} 
                    required 
                  />
                </div>
                <div className="input-field">
                  <label>Correo electrónico</label>
                  <input 
                    type="email" 
                    value={profileData.email} 
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))} 
                    required 
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div className="input-field">
                  <label>Teléfono</label>
                  <input 
                    type="tel" 
                    value={profileData.phone} 
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))} 
                    required 
                  />
                </div>
                <div className="input-field">
                  <label>Contraseña nueva</label>
                  <input type="password" placeholder="Escribe para cambiar tu contraseña..." />
                </div>
              </div>
              <button type="submit" className="btn btn-secondary" style={{ padding: '12px 24px' }}>Guardar cambios</button>
            </form>
          )}

          {/* TAB 3: Direcciones */}
          {activeTab === 'direcciones' && (
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>Direcciones de envío</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ padding: '1.25rem', border: '2px solid var(--secondary)', backgroundColor: '#F4FAF7', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Check size={14} strokeWidth={3} /> Dirección Predeterminada
                  </span>
                  <h4 style={{ margin: 0, fontWeight: 700 }}>{profileData.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{profileData.address}</p>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{profileData.city}, Colombia</span>
                </div>
                
                <div style={{ padding: '1.25rem', border: '1px dashed var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '130px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>+ Agregar nueva dirección</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Métodos de Pago */}
          {activeTab === 'pagos' && (
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>Tarjetas guardadas</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#FAF9F7' }}>
                  <CardIcon size={24} style={{ color: 'var(--secondary)' }} />
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 700 }}>Visa terminada en 4321</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expira: 12 / 2028</span>
                  </div>
                </div>
                
                <div style={{ padding: '1.25rem', border: '1px dashed var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '80px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>+ Agregar tarjeta</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Favoritos */}
          {activeTab === 'favoritos' && (
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>Mis piezas favoritas</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', display: 'flex', gap: '1rem', padding: '1rem' }}>
                  <img src="/assets/producto-mochila-wayuu-1.png" alt="Mochila Wayuu" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ margin: 0, fontWeight: 700 }}>Mochila Wayuu Colores del Sol</h4>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, margin: '0.25rem 0' }}>{formatCOP(280000)}</span>
                    <Link to="/products/1" style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600 }}>Ver pieza en catálogo</Link>
                  </div>
                </div>
              </div>
            </div>
          )}

        </section>
      </div>
    </main>
  );
};

export default AccountPage;
