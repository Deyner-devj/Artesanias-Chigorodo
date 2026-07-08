import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import type { Product } from '../types';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <main className="page products-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h1>Artesanías disponibles</h1>
        </div>
      </header>

      <section className="product-grid">
        {products.length === 0 ? (
          <div className="empty-state">Cargando productos...</div>
        ) : (
          products.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-image">Imagen</div>
              <div className="product-info">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <div className="product-meta">
                  <span className="price">${product.price}</span>
                  <Link to={`/products/${product.id}`} className="button secondary">Ver detalles</Link>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default ProductsPage;
