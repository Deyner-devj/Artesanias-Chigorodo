// js/auth.js

const TEST_USERS = [
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
];

function loginUser(email, password) {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Buscar usuario (test o registrado)
  let foundUser = TEST_USERS.find(
    (u) => u.email === normalizedEmail && u.password === password,
  );

  if (!foundUser) {
    const registeredUsersStr = localStorage.getItem("registered_users");
    if (registeredUsersStr) {
      const users = JSON.parse(registeredUsersStr);
      foundUser = users.find(
        (u) =>
          u.email.toLowerCase().trim() === normalizedEmail &&
          u.password === password,
      );
    }
  }

  // 2. Establecer sesión en sessionStorage (esencial para que nueva pestaña = nueva sesión)
  const sessionUser = foundUser
    ? {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role || "cliente",
      }
    : {
        id: "guest-" + Date.now(),
        name: email.split("@")[0],
        email: email,
        role: "cliente",
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
}

function registerUser(name, email, password) {
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
    password,
    role: "cliente",
  });
  localStorage.setItem("registered_users", JSON.stringify(users));
  return true;
}
