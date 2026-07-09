import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { mockProducts } from '../data/mockProducts';
import { Star } from 'lucide-react';
import type { Product } from '../types';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const categoryFilter = searchParams.get('category');
  const searchFilter = searchParams.get('search');

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(mockProducts);
        }
      })
      .catch((err) => {
        console.warn('Fallo al conectar al backend, usando productos mock:', err);
        setProducts(mockProducts);
      })
      .finally(() => setLoading(false));
  }, [categoryFilter, searchFilter]);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val);
  };

  const filteredProducts = products.filter((prod) => {
    if (categoryFilter && prod.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (searchFilter && !prod.name.toLowerCase().includes(searchFilter.toLowerCase()) && !prod.description.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <main className="page products-page-container">
      <header className="products-header">
        <p className="eyebrow">Catálogo</p>
        <h1>
          {categoryFilter ? `Colección ${categoryFilter}` : searchFilter ? `Resultados para "${searchFilter}"` : 'Artesanías Disponibles'}
        </h1>
        <p className="products-subtitle">
          Explora piezas únicas diseñadas y elaboradas a mano por maestros artesanos colombianos.
        </p>
      </header>

      {loading ? (
        <div className="empty-state">
          <div className="loader-spinner"></div>
          <p>Cargando catálogo...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron artesanías para este filtro.</p>
          <Link to="/products" className="btn btn-primary">Ver todas las artesanías</Link>
        </div>
      ) : (
        <section className="catalog-grid">
          {filteredProducts.map((product) => (
            <article key={product.id} className="catalog-product-card">
              <div className="catalog-img-wrapper">
                <img src={product.image} alt={product.name} className="catalog-product-img" />
                <span className="catalog-product-category">{product.category}</span>
              </div>
              <div className="catalog-product-info">
                <span className="catalog-product-seller">Por: {product.sellerName}</span>
                <h2>{product.name}</h2>
                <div className="catalog-product-rating" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Star size={16} fill="var(--primary)" color="var(--primary)" strokeWidth={2} />
                  <span className="star-rating" style={{ fontWeight: 600 }}>{product.rating.toFixed(1)}</span>
                  <span className="reviews-count">({product.reviewsCount} reseñas)</span>
                </div>
                <p className="catalog-product-desc">{product.description}</p>
                <div className="catalog-product-footer">
                  <span className="catalog-product-price">{formatCOP(product.price)}</span>
                  <Link to={`/products/${product.id}`} className="btn btn-secondary">Ver detalles</Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default ProductsPage;
