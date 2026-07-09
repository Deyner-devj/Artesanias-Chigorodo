import { Link } from 'react-router-dom';
import { Sparkles, Truck, CreditCard, Heart } from 'lucide-react';

const HomePage = () => {
  const categories = [
    { name: 'Tejidos', description: 'Tradición que se entrelaza', image: '/assets/categoria-tejidos.png', link: '/products?category=Tejidos' },
    { name: 'Cerámica', description: 'Arte que perdura', image: '/assets/categoria-ceramica.png', link: '/products?category=Cerámica' },
    { name: 'Joyería', description: 'Belleza artesanal', image: '/assets/categoria-joyeria.png', link: '/products?category=Joyería' },
    { name: 'Madera', description: 'Tallado con historia', image: '/assets/categoria-madera.png', link: '/products?category=Madera' },
    { name: 'Hogar y Decoración', description: 'Dale vida a tus espacios', image: '/assets/categoria-hogar-decoracion.png', link: '/products?category=Hogar y Decoración' },
    { name: 'Accesorios', description: 'Detalles que enamoran', image: '/assets/categoria-accesorios.png', link: '/products?category=Accesorios' }
  ];

  return (
    <main className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-dark)' }}>
            Descubre el arte <br />
            <span className="accent-text" style={{ color: 'var(--primary)' }}>hecho a mano</span>
          </h1>
          <p className="hero-description" style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: '1.5rem 0 2.5rem', lineHeight: 1.6 }}>
            Apoya a nuestros artesanos locales y lleva a casa piezas únicas cargadas de amor, tradición e identidad cultural.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/products" className="btn btn-primary" style={{ padding: '14px 28px' }}>Comprar ahora</Link>
            <Link to="/products" className="btn btn-outline-green" style={{ padding: '14px 28px' }}>Conocer más</Link>
          </div>
        </div>
        <div className="hero-image-container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#E6EFEA', padding: '1.5rem', borderRadius: '2.5rem', display: 'inline-block', width: '100%', maxWidth: '480px' }}>
            <img 
              src="/assets/hero-mochilas-ceramica.png" 
              alt="Mochilas Wayuu y cerámica de Artesanías Chigorodó" 
              className="hero-banner-image" 
              style={{ width: '100%', height: 'auto', maxHeight: '420px', objectFit: 'cover', borderRadius: '1.75rem', display: 'block' }} 
            />
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="trust-badges-bar">
        <div className="badge-item">
          <span className="badge-icon" style={{ backgroundColor: '#E0F2FE', color: '#0284C7' }}>
            <Sparkles size={26} strokeWidth={1.5} />
          </span>
          <div className="badge-text">
            <h4 style={{ color: 'var(--text-dark)' }}>Hecho a mano</h4>
            <p>Por artesanos colombianos</p>
          </div>
        </div>
        <div className="badge-item">
          <span className="badge-icon" style={{ backgroundColor: '#FFEDD5', color: '#D97706' }}>
            <Truck size={26} strokeWidth={1.5} />
          </span>
          <div className="badge-text">
            <h4 style={{ color: 'var(--text-dark)' }}>Envíos a todo el país</h4>
            <p>Colombia y el mundo</p>
          </div>
        </div>
        <div className="badge-item">
          <span className="badge-icon" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
            <CreditCard size={26} strokeWidth={1.5} />
          </span>
          <div className="badge-text">
            <h4 style={{ color: 'var(--text-dark)' }}>Pagos 100% seguros</h4>
            <p>PSE, tarjetas, otros</p>
          </div>
        </div>
        <div className="badge-item">
          <span className="badge-icon" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
            <Heart size={26} strokeWidth={1.5} />
          </span>
          <div className="badge-text">
            <h4 style={{ color: 'var(--text-dark)' }}>Apoyo a comunidades</h4>
            <p>Comercio justo directo</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Categorías</h2>
          <p>Explora nuestras categorías y encuentra piezas únicas.</p>
        </div>

        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <Link to={cat.link} key={idx} className="category-card">
              <div className="category-image-wrapper">
                <img src={cat.image} alt={cat.name} className="category-img" />
              </div>
              <div className="category-text-box">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Banner / Quote */}
      <section className="featured-quote-banner">
        <div className="quote-content">
          <span className="quote-mark">“</span>
          <h2>Cada pieza artesanal cuenta una historia de tradición, esfuerzo y cultura que perdura en el tiempo.</h2>
          <p>Comprando en nuestra plataforma apoyas de forma directa la sustentabilidad económica de más de 120 familias artesanas.</p>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
