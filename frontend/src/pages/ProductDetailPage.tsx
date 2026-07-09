import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { mockProducts } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import { Star, CheckCircle, Truck, RotateCcw } from 'lucide-react';
import type { Product } from '../types';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Multicolor');
  const [activeImage, setActiveImage] = useState('');
  const { addProduct } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProductById(id)
        .then((data) => {
          if (data && data.name) {
            setProduct(data);
            setActiveImage(data.image);
          } else {
            const found = mockProducts.find((p) => p.id === id);
            setProduct(found || null);
            if (found) setActiveImage(found.image);
          }
        })
        .catch((err) => {
          console.warn('Fallo al conectar al backend, buscando localmente:', err);
          const found = mockProducts.find((p) => p.id === id);
          setProduct(found || null);
          if (found) setActiveImage(found.image);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return (
      <main className="page product-detail-page-container">
        <div className="empty-state">
          <div className="loader-spinner"></div>
          <p>Cargando detalles de la artesanía...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page product-detail-page-container">
        <div className="empty-state">
          <p>No se pudo encontrar la artesanía especificada.</p>
          <Link to="/products" className="btn btn-primary">Volver al catálogo</Link>
        </div>
      </main>
    );
  }

  // Gallery images (main image + thumbnails)
  const galleryImages = product.id === '1'
    ? [
        '/assets/producto-mochila-wayuu-1.png',
        '/assets/producto-mochila-wayuu-2.png',
        '/assets/producto-mochila-wayuu-3.png'
      ]
    : [
        product.image,
        '/assets/individual_tejido.png',
        '/assets/jarron_barro.png'
      ];

  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          fill={i <= floorRating ? 'var(--primary)' : 'none'} 
          color={i <= floorRating ? 'var(--primary)' : 'var(--border-color)'} 
          strokeWidth={2}
        />
      );
    }
    return <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>{stars}</div>;
  };

  return (
    <main className="page product-detail-page-container" style={{ width: 'min(1200px, calc(100% - 2rem))', margin: '0 auto', padding: '2.5rem 0' }}>
      <div className="detail-breadcrumb" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Inicio</Link> / <Link to={`/products?category=${product.category}`} style={{ color: 'var(--text-muted)' }}>{product.category}</Link> / Mochilas / <span className="active-item" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>{product.name}</span>
      </div>

      <article className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Left Column: Gallery */}
        <div className="detail-gallery-container" style={{ display: 'flex', gap: '1.25rem' }}>
          <div className="detail-thumbnails" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {galleryImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(img)}
                style={{ 
                  width: '74px', 
                  height: '74px', 
                  border: activeImage === img ? '2.5px solid var(--primary)' : '1px solid var(--border-color)',
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  padding: 0,
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
          <div className="detail-image-main" style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#ffffff', aspectRatio: '1/1' }}>
            <img src={activeImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="detail-info-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 className="detail-product-title" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>{product.name}</h1>
          
          <div className="detail-rating-box" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {renderStars(product.rating)}
            <span className="reviews-count" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>({product.reviewsCount} reseñas)</span>
          </div>

          <div className="detail-price-box" style={{ marginBottom: '1.5rem' }}>
            <span className="detail-price" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCOP(product.price)}</span>
          </div>

          <div className="detail-divider" style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1.5rem 0' }}></div>

          <div className="detail-description" style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '1rem', color: 'var(--text-dark)', lineHeight: 1.6 }}>{product.description}</p>
          </div>

          {/* Green check attributes */}
          <div className="detail-meta-checked-list">
            <div className="detail-meta-checked-item">
              <CheckCircle size={18} strokeWidth={2.5} />
              <span>100% hecho a mano</span>
            </div>
            <div className="detail-meta-checked-item">
              <CheckCircle size={18} strokeWidth={2.5} />
              <span>Material: Palma de Iraca y algodón orgánico</span>
            </div>
            <div className="detail-meta-checked-item">
              <CheckCircle size={18} strokeWidth={2.5} />
              <span>Técnica: Tejeduría tradicional colombiana</span>
            </div>
          </div>

          <div className="detail-divider" style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1.5rem 0' }}></div>

          {/* Color Selection */}
          <div className="detail-color-selection" style={{ marginBottom: '1.5rem' }}>
            <span className="selection-label" style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>Color: <strong style={{ color: 'var(--text-dark)' }}>{selectedColor}</strong></span>
            <div className="color-circles" style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                type="button" 
                className={`color-circle ${selectedColor === 'Multicolor' ? 'active' : ''}`}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  border: selectedColor === 'Multicolor' ? '2.5px solid var(--primary)' : '1px solid var(--border-color)',
                  background: 'linear-gradient(45deg, #e82c2c, #ff7f00, #ffd700, #1B7A4D, #00c1d5, #0b428c)',
                  cursor: 'pointer',
                  padding: 0
                }}
                onClick={() => setSelectedColor('Multicolor')}
                aria-label="Multicolor"
              ></button>
              <button 
                type="button" 
                className={`color-circle ${selectedColor === 'Terracota' ? 'active' : ''}`}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  border: selectedColor === 'Terracota' ? '2.5px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: '#E8632C',
                  cursor: 'pointer',
                  padding: 0
                }}
                onClick={() => setSelectedColor('Terracota')}
                aria-label="Terracota"
              ></button>
              <button 
                type="button" 
                className={`color-circle ${selectedColor === 'Negro' ? 'active' : ''}`}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  border: selectedColor === 'Negro' ? '2.5px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: '#2B2118',
                  cursor: 'pointer',
                  padding: 0
                }}
                onClick={() => setSelectedColor('Negro')}
                aria-label="Negro"
              ></button>
              <button 
                type="button" 
                className={`color-circle ${selectedColor === 'Arena' ? 'active' : ''}`}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  border: selectedColor === 'Arena' ? '2.5px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: '#E5DFD6',
                  cursor: 'pointer',
                  padding: 0
                }}
                onClick={() => setSelectedColor('Arena')}
                aria-label="Arena"
              ></button>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="detail-qty-selection" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="selection-label" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Cantidad:</span>
            <div className="qty-selector-group" style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', padding: '0.15rem' }}>
              <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="detail-qty-btn" style={{ border: 'none', background: 'none', width: '36px', height: '36px', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}>-</button>
              <input 
                type="text" 
                value={quantity} 
                readOnly 
                style={{ width: '40px', textAlign: 'center', border: 'none', background: 'transparent', fontWeight: 700, padding: 0, fontSize: '0.95rem' }} 
              />
              <button type="button" onClick={() => setQuantity(q => q + 1)} className="detail-qty-btn" style={{ border: 'none', background: 'none', width: '36px', height: '36px', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}>+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="detail-actions" style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem' }}>
            <button 
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addProduct(product);
                }
                alert(`${product.name} (${quantity}) agregado al carrito!`);
              }} 
              className="btn btn-outline-orange btn-add-cart"
              style={{ flex: 1, padding: '14px 20px' }}
              disabled={product.stock <= 0}
            >
              Agregar al carrito
            </button>
            
            <button 
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addProduct(product);
                }
                navigate('/cart');
              }} 
              className="btn btn-secondary btn-buy-now"
              style={{ flex: 1, padding: '14px 20px' }}
              disabled={product.stock <= 0}
            >
              Comprar ahora
            </button>
          </div>

          {/* Shipping and Refund badging */}
          <div className="detail-shipping-info-badge" style={{ display: 'flex', gap: '1.25rem', backgroundColor: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <Truck size={24} strokeWidth={1.5} style={{ color: 'var(--secondary)', marginTop: '0.15rem' }} />
              <div className="shipping-text">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>Envío a todo el país</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>Entrega estimada entre 2 a 5 días hábiles</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.85rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.25rem' }}>
              <RotateCcw size={24} strokeWidth={1.5} style={{ color: 'var(--secondary)', marginTop: '0.15rem' }} />
              <div className="shipping-text">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>Devoluciones</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>Garantía de devolución hasta por 7 días</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
};

export default ProductDetailPage;
