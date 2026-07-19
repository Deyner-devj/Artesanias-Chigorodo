// js/auth.js
//
// AVISO IMPORTANTE:
// Este archivo simula autenticación 100% en el navegador porque el
// proyecto todavía no tiene un backend real. Esto es *inherentemente*
// inseguro (cualquiera puede leer/editar localStorage con las devtools),
// así que NO debe usarse tal cual en producción. Lo correcto es que
// loginUser/registerUser llamen a una API que verifique las credenciales
// contra una base de datos con contraseñas cifradas (bcrypt/argon2) y
// devuelva una sesión mediante cookie HttpOnly o JWT firmado.
//
// Mientras tanto, se aplican dos mitigaciones dentro de lo que permite
// el frontend:
//   1. Las contraseñas ya no se guardan en texto plano: se guarda un
//      hash SHA-256 (ver hashPassword). Sigue sin ser tan seguro como un
//      backend real (SHA-256 es rápido y no lleva "salt" por usuario),
//      pero ya no expone la contraseña real al inspeccionar localStorage.
//   2. Las cuentas de prueba (DEV_USERS) quedan claramente marcadas como
//      solo para desarrollo. Bórralas por completo antes de desplegar a
//      producción.

const DEV_USERS_ENABLED = true; // <-- Poner en `false` (o borrar el bloque) antes de producción.

const DEV_USERS = DEV_USERS_ENABLED
  ? [
      {
        email: "cliente@chigorodo.test",
        password: "Cliente123",
        name: "Juan Pérez",
        role: "cliente",
        id: "client-test",
      },
      {
        email: "vendedor@chigorodo.test",
        password: "Vendedor123",
        name: "María Elena",
        role: "vendedor",
        id: "seller-test",
      },
      {
        email: "admin@chigorodo.test",
        password: "Admin123",
        name: "Deyner Chaverra",
        role: "admin",
        id: "admin-test",
      },
    ]
  : [];

// Hash simple con SubtleCrypto (SHA-256). Solo para no guardar la
// contraseña en texto plano en localStorage; no reemplaza un hash con
// salt hecho en servidor (bcrypt/argon2).
async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function loginUser(email, password) {
  const normalizedEmail = email.toLowerCase().trim();
  const hashedInput = await hashPassword(password);

  // 1. Buscar usuario (dev o registrado)
  let foundUser = DEV_USERS.find(
    (u) => u.email === normalizedEmail && u.password === password,
  );

  if (!foundUser) {
    const registeredUsersStr = localStorage.getItem("registered_users");
    if (registeredUsersStr) {
      const users = JSON.parse(registeredUsersStr);
      foundUser = users.find(
        (u) =>
          u.email.toLowerCase().trim() === normalizedEmail &&
          u.passwordHash === hashedInput,
      );
    }
  }

  // Si no coincide con ningún usuario (de prueba o registrado), las
  // credenciales son inválidas: NO se crea sesión de invitado.
  // Antes esto siempre devolvía un usuario "guest-..." con rol "cliente"
  // aunque el correo/contraseña estuvieran mal, así que login.html nunca
  // mostraba el error y terminabas logueado (y redirigido) como cliente
  // sin importar qué hubieras escrito.
  if (!foundUser) {
    return null;
  }

  // 2. Establecer sesión en sessionStorage (esencial para que nueva pestaña = nueva sesión)
  const sessionUser = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
    role: foundUser.role || "cliente",
  };

  sessionStorage.setItem("user", JSON.stringify(sessionUser));
  return sessionUser;
}

function getLoggedInUser() {
  const userStr = sessionStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

function logoutUser() {
  sessionStorage.removeItem("user");
  localStorage.removeItem("user");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_role");
}

async function registerUser(name, email, password) {
  const registeredUsersStr = localStorage.getItem("registered_users");
  let users = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];

  if (
    users.some(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim(),
    )
  )
    return false;

  users.push({
    id: "user-" + Date.now(),
    name,
    email: email.toLowerCase().trim(),
    passwordHash: await hashPassword(password),
    role: "cliente",
  });
  localStorage.setItem("registered_users", JSON.stringify(users));
  return true;
}
