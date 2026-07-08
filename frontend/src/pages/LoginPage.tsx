import { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="page auth-page">
      <section className="auth-panel">
        <p className="eyebrow">Bienvenido</p>
        <h1>Iniciar sesión</h1>
        <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            Correo electrónico
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
          </label>
          <label>
            Contraseña
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
          </label>
          <button type="submit" className="button primary">Entrar</button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
