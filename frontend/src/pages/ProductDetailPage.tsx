import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import type { Product } from '../types';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetchProductById(id).then(setProduct).catch(console.error);
    }
  }, [id]);

  if (!product) {
    return <main className="page product-detail-page"><div className="empty-state">Cargando detalle...</div></main>;
  }

  return (
    <main className="page product-detail-page">
      <header className="page-header">
        <p className="eyebrow">Detalle del producto</p>
        <h1>{product.name}</h1>
      </header>
      <article className="product-detail-card">
        <div className="product-detail-image">Imagen</div>
        <div className="product-detail-copy">
          <p>{product.description}</p>
          <p className="price">${product.price}</p>
          <button className="button primary">Agregar al carrito</button>
        </div>
      </article>
    </main>
  );
};

export default ProductDetailPage;
