import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { items } = useCart();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Chigorodó</Link>
      </div>
      <div className="nav-actions">
        <Link to="/products">Catálogo</Link>
        <Link to="/cart">Carrito ({items.length})</Link>
        <Link to="/login">Ingresar</Link>
      </div>
    </nav>
  );
};

export default Navbar;
