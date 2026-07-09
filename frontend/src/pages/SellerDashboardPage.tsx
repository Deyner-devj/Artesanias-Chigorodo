import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ClipboardList, PlusCircle, LogOut, DollarSign, Package, TrendingUp, Star, ShieldAlert } from 'lucide-react';

interface SellerProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
  category: string;
}

interface SellerOrder {
  id: string;
  customer: string;
  product: string;
  date: string;
  amount: number;
  status: 'Entregado' | 'En tránsito' | 'Pendiente';
}

const SellerDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'resumen' | 'productos' | 'pedidos'>('resumen');
  
  // Dashboard data in state
  const [products, setProducts] = useState<SellerProduct[]>([
    { id: '1', name: 'Mochila Wayuu Colores del Sol', price: 280000, stock: 15, sales: 8, category: 'Tejidos' },
    { id: '2', name: 'Hamaca San Jacinto', price: 350000, stock: 5, sales: 3, category: 'Tejidos' }
  ]);

  const [orders, setOrders] = useState<SellerOrder[]>([
    { id: 'AC-2024-88032', customer: 'Carlos Gómez', product: 'Mochila Wayuu Colores del Sol', date: '2024-07-08', amount: 280000, status: 'Pendiente' },
    { id: 'AC-2024-77123', customer: 'Lucía Ortiz', product: 'Hamaca San Jacinto', date: '2024-07-05', amount: 350000, status: 'En tránsito' },
    { id: 'AC-2024-66432', customer: 'Mateo Restrepo', product: 'Mochila Wayuu Colores del Sol', date: '2024-06-28', amount: 280000, status: 'Entregado' }
  ]);

  // Form states for adding a new product
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Tejidos');

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductStock) {
      alert('Por favor complete todos los campos');
      return;
    }
    const priceNum = parseFloat(newProductPrice);
    const stockNum = parseInt(newProductStock);
    if (isNaN(priceNum) || isNaN(stockNum)) {
      alert('Precio y stock deben ser valores numéricos');
      return;
    }

    const newProd: SellerProduct = {
      id: String(products.length + 1),
      name: newProductName,
      price: priceNum,
      stock: stockNum,
      sales: 0,
      category: newProductCategory
    };

    setProducts((prev) => [...prev, newProd]);
    setShowAddForm(false);
    
    // Reset fields
    setNewProductName('');
    setNewProductPrice('');
    setNewProductStock('');
    
    alert('¡Producto agregado con éxito al catálogo de venta!');
  };

  // Derive metrics dynamically from state
  const totalSalesAmount = orders.reduce((sum, order) => sum + order.amount, 0);
  const activeProductsCount = products.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pendiente').length;

  const handleLogout = () => {
    alert('Cerrando sesión de artesano...');
    navigate('/');
  };

  return (
    <main className="page seller-dashboard-container" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 140px)', width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem', gap: '2rem' }}>
      {/* Sidebar Navigation */}
      <aside className="account-sidebar" style={{ height: 'fit-content' }}>
        <div className="sidebar-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, margin: '0 auto 0.75rem' }}>
            ME
          </div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)' }}>María Elena</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Artesana Tejedora</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '1rem 0' }}>
          <button 
            onClick={() => setActiveTab('resumen')} 
            className={`account-menu-item ${activeTab === 'resumen' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.5rem', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}
          >
            <LayoutDashboard size={18} /> Resumen
          </button>
          <button 
            onClick={() => setActiveTab('productos')} 
            className={`account-menu-item ${activeTab === 'productos' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.5rem', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}
          >
            <ShoppingBag size={18} /> Mis Productos
          </button>
          <button 
            onClick={() => setActiveTab('pedidos')} 
            className={`account-menu-item ${activeTab === 'pedidos' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.5rem', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}
          >
            <ClipboardList size={18} /> Pedidos Recibidos
          </button>
          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1rem 0' }}></div>
          <button 
            onClick={handleLogout} 
            className="account-menu-item"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.5rem', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#c2410c' }}
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <section className="dashboard-content-panel" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
        
        {/* TAB 1: Resumen Dashboard */}
        {activeTab === 'resumen' && (
          <div>
            <header style={{ marginBottom: '2.5rem' }}>
              <span className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.85rem' }}>Panel de Control</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-serif)', margin: '0.25rem 0 0.5rem' }}>Bienvenida, María Elena</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Rastrea el impacto de tus piezas tejidas y administra tus ventas de comercio justo.</p>
            </header>

            {/* Metrics Row */}
            <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
              <div className="metric-card" style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#FDFCFB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Ventas Totales</span>
                  <DollarSign size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)' }}>{formatCOP(totalSalesAmount)}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <TrendingUp size={12} /> +12.5% este mes
                </span>
              </div>

              <div className="metric-card" style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#FDFCFB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Productos Activos</span>
                  <Package size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)' }}>{activeProductsCount}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>Listos en el catálogo</span>
              </div>

              <div className="metric-card" style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#FDFCFB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pedidos Pendientes</span>
                  <ClipboardList size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)' }}>{pendingOrdersCount}</div>
                <span style={{ fontSize: '0.75rem', color: '#c2410c', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <ShieldAlert size={12} /> Requieren preparación
                </span>
              </div>

              <div className="metric-card" style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#FDFCFB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Calificación Artesana</span>
                  <Star size={20} fill="var(--primary)" color="var(--primary)" />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)' }}>4.9</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>Basada en 52 reseñas</span>
              </div>
            </div>

            {/* Sales Chart Section */}
            <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#FDFCFB' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-serif)', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Ventas de los últimos 6 meses</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '180px', padding: '0 1rem', borderBottom: '2px solid var(--border-color)', gap: '1rem', overflowX: 'auto' }}>
                {[
                  { month: 'Ene', sales: 450000 },
                  { month: 'Feb', sales: 720000 },
                  { month: 'Mar', sales: 600000 },
                  { month: 'Abr', sales: 890000 },
                  { month: 'May', sales: 1100000 },
                  { month: 'Jun', sales: 1850000 }
                ].map((item, index) => {
                  const heightPercent = `${Math.round((item.sales / 1850000) * 100)}%`;
                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1', minWidth: '45px', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>{formatCOP(item.sales)}</span>
                      <div style={{ width: '100%', height: heightPercent, backgroundColor: 'var(--secondary)', borderRadius: '6px 6px 0 0', opacity: 0.85, transition: 'all 0.3s ease' }}></div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-serif)', marginBottom: '1.25rem', color: 'var(--text-dark)' }}>Pedidos Recientes</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="account-orders-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>ID Pedido</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Cliente</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Producto</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Fecha</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Monto</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>#{o.id}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>{o.customer}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>{o.product}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>{o.date}</td>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{formatCOP(o.amount)}</td>
                        <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                          <span className={`status-badge ${o.status === 'Entregado' ? 'delivered' : o.status === 'En tránsito' ? 'transit' : 'pending'}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Mis Productos */}
        {activeTab === 'productos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-serif)', margin: 0 }}>Mis Productos</h2>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 18px', fontSize: '0.9rem' }}
              >
                <PlusCircle size={18} /> {showAddForm ? 'Cerrar Formulario' : 'Agregar Producto'}
              </button>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
              <form onSubmit={handleAddProduct} style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Agregar artesanía al catálogo</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div className="input-field">
                    <label>Nombre de la artesanía</label>
                    <input 
                      type="text" 
                      value={newProductName} 
                      onChange={(e) => setNewProductName(e.target.value)} 
                      placeholder="Ej. Mochila Wayuu Girasol"
                      required 
                    />
                  </div>
                  <div className="input-field">
                    <label>Categoría</label>
                    <select 
                      value={newProductCategory} 
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
                    >
                      <option value="Tejidos">Tejidos</option>
                      <option value="Cerámica">Cerámica</option>
                      <option value="Joyería">Joyería</option>
                      <option value="Madera">Madera</option>
                      <option value="Hogar y Decoración">Hogar y Decoración</option>
                      <option value="Accesorios">Accesorios</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div className="input-field">
                    <label>Precio (COP)</label>
                    <input 
                      type="number" 
                      value={newProductPrice} 
                      onChange={(e) => setNewProductPrice(e.target.value)} 
                      placeholder="Ej. 180000"
                      required 
                    />
                  </div>
                  <div className="input-field">
                    <label>Unidades en Stock</label>
                    <input 
                      type="number" 
                      value={newProductStock} 
                      onChange={(e) => setNewProductStock(e.target.value)} 
                      placeholder="Ej. 10"
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline-orange" style={{ padding: '10px 20px' }}>Cancelar</button>
                  <button type="submit" className="btn btn-secondary" style={{ padding: '10px 20px' }}>Guardar Artesanía</button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="account-orders-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Nombre</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Categoría</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Precio</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Unidades vendidas</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Stock actual</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>{p.name}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{p.category}</td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{formatCOP(p.price)}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{p.sales} u</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{p.stock} u</td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <span className={`status-badge ${p.stock > 0 ? 'delivered' : 'pending'}`}>
                          {p.stock > 0 ? 'Activo' : 'Agotado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Pedidos Recibidos */}
        {activeTab === 'pedidos' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>Pedidos Recibidos</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Gestiona los despachos de tus pedidos. Recuerda embalar con cuidado las piezas únicas de arte.</p>

            <div style={{ overflowX: 'auto' }}>
              <table className="account-orders-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>ID Pedido</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Cliente</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Artesanía</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Fecha</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Monto recibido</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Acción despacho</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>#{o.id}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{o.customer}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{o.product}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{o.date}</td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{formatCOP(o.amount)}</td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        {o.status === 'Pendiente' ? (
                          <button 
                            onClick={() => {
                              setOrders(prev => prev.map(item => item.id === o.id ? { ...item, status: 'En tránsito' } : item));
                              alert(`El pedido #${o.id} ha sido despachado y está en tránsito.`);
                            }}
                            className="btn btn-outline-green" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px' }}
                          >
                            Despachar pedido
                          </button>
                        ) : (
                          <span className={`status-badge ${o.status === 'Entregado' ? 'delivered' : 'transit'}`}>
                            {o.status === 'Entregado' ? 'Entregado al cliente' : 'En tránsito al destino'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default SellerDashboardPage;
