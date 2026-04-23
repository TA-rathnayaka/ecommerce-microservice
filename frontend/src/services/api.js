import { API_BASE_URL } from "../config";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  getProducts: () => request("/"),
  getProductById: (productId) => request(`/${productId}`),
  getProductsByCategory: (type) => request(`/category/${type}`),

  signup: (payload) =>
    request("/customer/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/customer/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getProfile: (token) =>
    request("/customer/profile", {
      headers: authHeaders(token),
    }),

  getOrders: (token) =>
    request("/customer/orders", {
      headers: authHeaders(token),
    }),

  getCart: (token) =>
    request("/shopping/cart", {
      headers: authHeaders(token),
    }),

  updateCart: (token, payload) =>
    request("/shopping/cart", {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    }),

  removeFromCart: (token, id) =>
    request("/shopping/cart", {
      method: "DELETE",
      headers: authHeaders(token),
      body: JSON.stringify({ _id: id }),
    }),

  placeOrder: (token, txnId) =>
    request("/shopping/order", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ txnId }),
    }),
};
