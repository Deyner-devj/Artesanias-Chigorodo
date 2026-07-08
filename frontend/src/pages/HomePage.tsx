import { Link } from 'react-router-dom';

const HomePage = () => (
  <main className="page home-page">
    <header className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Artesanías Chigorodó</p>
        <h1>Hecho a mano con amor y tradición.</h1>
        <p>Descubre nuestros productos de decoración, regalos y arte local con envíos rápidos desde Colombia.</p>
        <div className="hero-actions">
          <Link to="/products" className="button primary">Ver catálogo</Link>
          <Link to="/register" className="button secondary">Crear cuenta</Link>
        </div>
      </div>
      <div className="hero-image">
        <div className="placeholder-image">Imagen de producto</div>
      </div>
    </header>

    <section className="features">
      <article>
        <h2>Productos únicos</h2>
        <p>Artesanías seleccionadas para decorar tu hogar y regalar con estilo.</p>
      </article>
      <article>
        <h2>Entrega segura</h2>
        <p>Envío confiable en Colombia con seguimiento en línea.</p>
      </article>
      <article>
        <h2>Soporte local</h2>
        <p>Compra directamente a artesanos de Chigorodó con atención personalizada.</p>
      </article>
    </section>
  </main>
);

export default HomePage;
