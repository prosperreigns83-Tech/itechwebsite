const USERS_KEY = "itechUsers";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUsers() {
  return loadUsers();
}

export function getUserByEmail(email) {
  return loadUsers().find((u) => u.email === email);
}

export function addOrUpdateUser(user) {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === user.id || (u.email && user.email && u.email === user.email));
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...user };
  } else {
    users.push(user);
  }
  saveUsers(users);
}

export function banUser(id) {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx >= 0) {
    users[idx] = { ...users[idx], banned: true };
    saveUsers(users);
  }
}

export function unbanUser(id) {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx >= 0) {
    users[idx] = { ...users[idx], banned: false };
    saveUsers(users);
  }
}

// ensure there is a default admin account
(function ensureAdmin() {
  try {
    const users = loadUsers();
    if (!users.some((u) => u.role === "admin")) {
      users.push({ id: "admin-1", name: "Admin", email: "admin@itech.com", password: "itechadmin", role: "admin" });
      saveUsers(users);
    }
  } catch (e) {
    // ignore
  }
})();

export default {
  getUsers,
  getUserByEmail,
  addOrUpdateUser,
  banUser,
  unbanUser
};
