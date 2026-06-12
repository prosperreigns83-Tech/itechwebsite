export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function setToken(token) {
  if (token) localStorage.setItem('itechToken', token);
  else localStorage.removeItem('itechToken');
}

export function getToken() {
  return localStorage.getItem('itechToken');
}

async function apiFetch(path, opts = {}) {
  const headers = opts.headers || {};
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'API error');
  }
  return res.json();
}

export async function loginApi(email, password, extra = {}) {
  return apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password, ...extra }) });
}

export async function me() {
  return apiFetch('/api/auth/me');
}

export async function createOrder(payload) {
  return apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getOrder(orderId) {
  return apiFetch(`/api/orders/${encodeURIComponent(orderId)}`);
}

export async function chatBot(question) {
  return apiFetch('/api/chatbot', { method: 'POST', body: JSON.stringify({ question }) });
}

export async function initializeWalletFunding(payload) {
  return apiFetch('/api/wallets/initialize-funding', { method: 'POST', body: JSON.stringify(payload) });
}

export async function sendWebhookSim(body) {
  return apiFetch('/api/payments/webhook', { method: 'POST', body: JSON.stringify(body) });
}
