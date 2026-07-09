import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Search, User, ShoppingCart, ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { items } = useCart();
  const [showCategories, setShowCategories] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setMenuOpen(false);
    }
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Read user dynamically from localStorage
  const userStr = localStorage.getItem('user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const profileLink = loggedInUser && (loggedInUser.role === 'vendedor' || loggedInUser.role === 'admin') ? '/dashboard' : '/account';
  const profileText = loggedInUser ? loggedInUser.name : 'Mi cuenta';

  return (
    <nav className="navbar-container">
      {/* Fila Superior */}
      <div className="navbar-main">
        <div className="nav-brand">
          <Link to="/" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/assets/logo-vasija.svg" alt="Logo de Artesanías Chigorodó" style={{ width: '38px', height: '38px' }} />
            <span className="brand-text" style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ color: 'var(--text-dark)' }}>Artesanías</span>
              <span style={{ color: 'var(--secondary)' }}>Chigorodó</span>
            </span>
          </Link>
        </div>

        <form className="nav-search" onSubmit={handleSearchSubmit}>
          <div className="nav-search-wrapper">
            <Search className="nav-search-icon" size={18} />
            <input
              type="text"
              placeholder="Buscar artesanías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nav-search-input"
            />
          </div>
        </form>

        <div className="nav-user-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <Link to={profileLink} onClick={() => setMenuOpen(false)} className="user-account-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <User size={20} strokeWidth={1.75} />
            <span className="user-text" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{profileText}</span>
            <ChevronDown size={14} strokeWidth={2} style={{ opacity: 0.8 }} />
          </Link>

          <Link to="/cart" onClick={() => setMenuOpen(false)} className="cart-badge-container" aria-label="Carrito de compras">
            <div className="cart-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <ShoppingCart size={20} strokeWidth={1.75} />
              {totalQuantity > 0 && (
                <span className="cart-counter" style={{ backgroundColor: 'var(--primary)' }}>{totalQuantity}</span>
              )}
            </div>
          </Link>

          <button 
            type="button" 
            className="mobile-menu-toggle-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-dark)', padding: '4px' }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Fila Inferior - Menú de Navegación */}
      <div className={`navbar-menu ${menuOpen ? 'is-open' : ''}`}>
        <ul className="menu-links">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          </li>
          <li 
            className="menu-dropdown-item"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <span className="dropdown-trigger" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Categorías <ChevronDown size={14} strokeWidth={2.5} className="arrow-down" />
            </span>
            {showCategories && (
              <ul className="dropdown-menu">
                <li><Link to="/products?category=Tejidos" onClick={() => { setShowCategories(false); setMenuOpen(false); }}>Tejidos</Link></li>
                <li><Link to="/products?category=Cerámica" onClick={() => { setShowCategories(false); setMenuOpen(false); }}>Cerámica</Link></li>
                <li><Link to="/products?category=Joyería" onClick={() => { setShowCategories(false); setMenuOpen(false); }}>Joyería</Link></li>
                <li><Link to="/products?category=Madera" onClick={() => { setShowCategories(false); setMenuOpen(false); }}>Madera</Link></li>
                <li><Link to="/products?category=Hogar y Decoración" onClick={() => { setShowCategories(false); setMenuOpen(false); }}>Hogar y Decoración</Link></li>
                <li><Link to="/products?category=Accesorios" onClick={() => { setShowCategories(false); setMenuOpen(false); }}>Accesorios</Link></li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/products" onClick={() => setMenuOpen(false)}>Artesanos</Link>
          </li>
          <li>
            <Link to="/products" onClick={() => setMenuOpen(false)}>Nosotros</Link>
          </li>
          <li>
            <Link to="/products" onClick={() => setMenuOpen(false)}>Contacto</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
