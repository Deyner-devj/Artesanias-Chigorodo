// js/core/auth.js
// Autenticación real contra el backend Spring Boot.
// Fallback a DEV_USERS cuando el backend no está disponible (modo offline/dev).
//
// Mapeo de roles backend → frontend:
//   CLIENT  → "cliente"
//   VENDOR  → "vendedor"
//   ADMIN   → "admin"

const DEV_USERS_ENABLED = true; // poner false en producción

const DEV_USERS = DEV_USERS_ENABLED
  ? [
      {
        email: 'cliente@chigorodo.test',
        password: 'Cliente123',
        name: 'Juan Pérez',
        role: 'cliente',
        id: 'client-test',
      },
      {
        email: 'vendedor@chigorodo.test',
        password: 'Vendedor123',
        name: 'María Elena',
        role: 'vendedor',
        id: 'seller-test',
      },
      {
        email: 'admin@chigorodo.test',
        password: 'Admin123',
        name: 'Deyner Chaverra',
        role: 'admin',
        id: 'admin-test',
      },
    ]
  : [];

// Mapea el rol del backend (ADMIN/VENDOR/CLIENT) al rol del frontend
function _mapRole(backendRole) {
  switch ((backendRole || '').toUpperCase()) {
    case 'ADMIN':  return 'admin';
    case 'VENDOR': return 'vendedor';
    case 'CLIENT': return 'cliente';
    default:       return 'cliente';
  }
}

// Guarda la sesión del usuario en sessionStorage
function _setSession(sessionUser) {
  sessionStorage.setItem('user', JSON.stringify(sessionUser));
}

// ─── Funciones públicas ───────────────────────────────────────────────────────

/**
 * Intenta login contra el backend; fallback a DEV_USERS si el backend no responde.
 * @returns {Promise<{id, name, email, role}|null>}
 */
async function loginUser(email, password) {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Intentar API real
  if (window.API) {
    try {
      const data = await window.API.auth.login(normalizedEmail, password);
      // data = { token, email, fullName, role }
      const sessionUser = {
        id: data.id || data.email,
        name: data.fullName,
        email: data.email,
        role: _mapRole(data.role),
        token: data.token,
      };
      _setSession(sessionUser);
      sessionStorage.setItem('auth_token', data.token);
      return sessionUser;
    } catch (err) {
      // Si es 401, credenciales incorrectas → no hacer fallback
      if (err.status === 401 || err.status === 403) return null;
      // Otro error (backend caído, CORS, etc.) → intentar DEV_USERS
      console.warn('[auth] Backend no disponible, usando DEV_USERS. Error:', err.message);
    }
  }

  // 2. Fallback DEV_USERS
  const devUser = DEV_USERS.find(
    (u) => u.email === normalizedEmail && u.password === password,
  );
  if (devUser) {
    const sessionUser = { id: devUser.id, name: devUser.name, email: devUser.email, role: devUser.role };
    _setSession(sessionUser);
    return sessionUser;
  }

  // 3. Fallback usuarios registrados localmente (modo offline)
  try {
    const registered = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const hashedInput = await _hashPassword(password);
    const found = registered.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.passwordHash === hashedInput,
    );
    if (found) {
      const sessionUser = { id: found.id, name: found.name, email: found.email, role: found.role || 'cliente' };
      _setSession(sessionUser);
      return sessionUser;
    }
  } catch (_) {}

  return null;
}

/**
 * Registra un nuevo usuario. Intenta API real; fallback a localStorage.
 * @returns {Promise<boolean>}
 */
async function registerUser(name, email, password) {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Intentar API real
  if (window.API) {
    try {
      await window.API.auth.register(name, normalizedEmail, password, 'CLIENT');
      return true;
    } catch (err) {
      if (err.status === 409 || err.status === 400) {
        // Correo ya registrado o validación fallida
        return false;
      }
      console.warn('[auth] Backend no disponible para registro. Usando localStorage. Error:', err.message);
    }
  }

  // 2. Fallback localStorage (modo offline)
  try {
    const registered = JSON.parse(localStorage.getItem('registered_users') || '[]');
    if (registered.some((u) => u.email.toLowerCase() === normalizedEmail)) return false;
    registered.push({
      id: 'user-' + Date.now(),
      name,
      email: normalizedEmail,
      passwordHash: await _hashPassword(password),
      role: 'cliente',
    });
    localStorage.setItem('registered_users', JSON.stringify(registered));
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Devuelve el usuario de la sesión actual o null.
 */
function getLoggedInUser() {
  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (_) {
    return null;
  }
}

/**
 * Cierra la sesión.
 */
function logoutUser() {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_role');
  if (window._API_clearToken) window._API_clearToken();
}

// ─── Hash SHA-256 (solo para fallback offline; backend usa BCrypt) ───────────
async function _hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
