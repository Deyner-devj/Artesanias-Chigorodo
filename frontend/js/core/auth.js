// Autenticacion real contra el backend Spring Boot.
// La aplicacion no crea sesiones ni usuarios locales: el servidor es la fuente
// de verdad para credenciales, roles y permisos.

function mapRole(backendRole) {
  switch ((backendRole || '').toUpperCase()) {
    case 'ADMIN': return 'admin';
    case 'VENDOR': return 'vendedor';
    case 'CLIENT': return 'cliente';
    default: return 'cliente';
  }
}

function setSession(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
}

async function loginUser(email, password) {
  if (!window.API) throw new Error('El servicio de autenticacion no esta disponible.');

  try {
    const data = await window.API.auth.login(email.toLowerCase().trim(), password);
    const user = {
      id: data.id || data.email,
      name: data.fullName,
      email: data.email,
      role: mapRole(data.role),
      token: data.token,
    };
    setSession(user);
    sessionStorage.setItem('auth_token', data.token);
    return user;
  } catch (error) {
    if (error.status === 401 || error.status === 403) return null;
    throw error;
  }
}

async function registerUser(name, email, password) {
  if (!window.API) throw new Error('El servicio de registro no esta disponible.');
  try {
    await window.API.auth.register(name, email.toLowerCase().trim(), password, 'CLIENT');
    return true;
  } catch (error) {
    if (error.status === 400 || error.status === 409) return false;
    throw error;
  }
}

function getLoggedInUser() {
  try {
    const raw = sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function logoutUser() {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_role');
  if (window._API_clearToken) window._API_clearToken();
}
