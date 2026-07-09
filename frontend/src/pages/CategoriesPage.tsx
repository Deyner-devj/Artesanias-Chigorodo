// src/pages/CategoriesPage.tsx
import { Link } from 'react-router-dom';

const CategoriesPage = () => {
  const categories = [
    { name: 'Tejidos', description: 'Tradición que se entrelaza', image: '/assets/categoria-tejidos.png', link: '/products?category=Tejidos' },
    { name: 'Cerámica', description: 'Arte que perdura', image: '/assets/categoria-ceramica.png', link: '/products?category=Cerámica' },
    { name: 'Joyería', description: 'Belleza artesanal', image: '/assets/categoria-joyeria.png', link: '/products?category=Joyería' },
    { name: 'Madera', description: 'Tallado con historia', image: '/assets/categoria-madera.png', link: '/products?category=Madera' },
    { name: 'Hogar y Decoración', description: 'Dale vida a tus espacios', image: '/assets/categoria-hogar-decoracion.png', link: '/products?category=Hogar y Decoración' },
    { name: 'Accesorios', description: 'Detalles que enamoran', image: '/assets/categoria-accesorios.png', link: '/products?category=Accesorios' }
  ];

  return (
    <main className="page categories-page-container" style={{ width: 'min(1200px, calc(100% - 2rem))', margin: '0 auto', padding: '2.5rem 0' }}>
      <header className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Categorías</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Explora nuestras categorías y encuentra piezas únicas</p>
      </header>

      <section className="categories-grid">
        {categories.map((cat, idx) => (
          <Link to={cat.link} key={idx} className="category-card" style={{ textDecoration: 'none' }}>
            <div className="category-image-wrapper" style={{ aspectRatio: '4/3', width: '100%', overflow: 'hidden', borderRadius: '12px' }}>
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="category-img" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} 
              />
            </div>
            <div className="category-text-box" style={{ padding: '1.25rem 0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>{cat.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{cat.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default CategoriesPage;
