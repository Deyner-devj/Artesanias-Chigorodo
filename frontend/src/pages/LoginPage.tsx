import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Shield } from 'lucide-react';
import { loginApi, registerApi } from '../services/auth';

const LoginPage = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await loginApi({ email: loginEmail, password: loginPassword });
    if (user && (user.role === 'vendedor' || user.role === 'admin')) {
      navigate('/dashboard');
    } else {
      navigate('/account');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword === registerConfirmPassword) {
      await registerApi({ name: registerName, email: registerEmail, password: registerPassword });
      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      setLoginEmail(registerEmail);
      // Clear fields
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
    } else {
      alert('Las contraseñas no coinciden');
    }
  };

  return (
    <div className="auth-page-wrapper" style={{ backgroundImage: "url('/assets/bg-login-decorativo.png')" }}>
      <div className="auth-card-container">
        {/* Logo and Header */}
        <div className="auth-logo-header">
          <div className="auth-logo-icon">
            <img src="/assets/logo-vasija.svg" alt="Logo de Artesanías Chigorodó" style={{ width: '56px', height: '56px' }} />
          </div>
          <h2>Artesanías <span className="highlight">Chigorodó</span></h2>
          <p className="auth-tagline">Descubre el arte hecho a mano</p>
        </div>

        {/* Double Columns Form */}
        <div className="auth-columns">
          {/* Column 1: Login */}
          <div className="auth-column">
            <div className="auth-column-title active">
              <User size={20} />
              <span>Iniciar Sesión</span>
            </div>

            <form className="auth-card-form" onSubmit={handleLoginSubmit}>
              <div className="input-group">
                <input 
                  type="email" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  placeholder="Correo electrónico" 
                  required
                />
                <div className="input-icon-wrapper orange">
                  <Mail size={18} />
                </div>
              </div>

              <div className="input-group">
                <input 
                  type="password" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  placeholder="Contraseña" 
                  required
                />
                <div className="input-icon-wrapper orange">
                  <Lock size={18} />
                </div>
              </div>

              <div className="form-options">
                <a href="#" className="forgot-password-link">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" className="auth-submit-btn btn-login">Iniciar Sesión</button>
            </form>
            
            <div className="auth-switch-link">
              ¿No tienes cuenta? <Link to="/register" className="text-green">Regístrate</Link>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="auth-divider-line"></div>

          {/* Column 2: Register */}
          <div className="auth-column">
            <div className="auth-column-title inactive">
              <UserPlus size={20} />
              <span>Registrarse</span>
            </div>

            <form className="auth-card-form" onSubmit={handleRegisterSubmit}>
              <div className="input-group">
                <input 
                  type="text" 
                  value={registerName} 
                  onChange={(e) => setRegisterName(e.target.value)} 
                  placeholder="Nombre completo" 
                  required
                />
                <div className="input-icon-wrapper green">
                  <User size={18} />
                </div>
              </div>

              <div className="input-group">
                <input 
                  type="email" 
                  value={registerEmail} 
                  onChange={(e) => setRegisterEmail(e.target.value)} 
                  placeholder="Correo electrónico" 
                  required
                />
                <div className="input-icon-wrapper green">
                  <Mail size={18} />
                </div>
              </div>

              <div className="input-group">
                <input 
                  type="password" 
                  value={registerPassword} 
                  onChange={(e) => setRegisterPassword(e.target.value)} 
                  placeholder="Contraseña" 
                  required
                />
                <div className="input-icon-wrapper green">
                  <Lock size={18} />
                </div>
              </div>

              <div className="input-group">
                <input 
                  type="password" 
                  value={registerConfirmPassword} 
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)} 
                  placeholder="Confirmar contraseña" 
                  required
                />
                <div className="input-icon-wrapper green">
                  <Lock size={18} />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn btn-register">Crear Cuenta</button>
            </form>

            <div className="auth-switch-link">
              ¿Ya tienes cuenta? <Link to="/login" className="text-orange">Inicia sesión</Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-card-footer">
          <Shield size={16} />
          <span>API REST · JWT Authentication · Artesanías Chigorodó</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
