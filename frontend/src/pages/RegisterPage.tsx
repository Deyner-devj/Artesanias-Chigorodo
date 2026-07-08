import { useState } from 'react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="page auth-page">
      <section className="auth-panel">
        <p className="eyebrow">Crear cuenta</p>
        <h1>Regístrate</h1>
        <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            Nombre
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
          </label>
          <label>
            Correo electrónico
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
          </label>
          <label>
            Contraseña
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
          </label>
          <button type="submit" className="button primary">Registrarse</button>
        </form>
      </section>
    </main>
  );
};

export default RegisterPage;
