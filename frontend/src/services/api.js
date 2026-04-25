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
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("Invalid JSON response from server");
    // fixed: JSON.parse was unguarded — HTML error pages would throw a confusing parse error
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  // fixed: backend wraps everything in { data: ... } via FormateData()
  // unwrap it here once so callers always get the inner payload directly
  return data?.data ?? data;
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
      // fixed: was /customer/profile but route is /profile under customer router
    }),

  getOrders: (token) =>
    request("/customer/shopping-details", {
      // fixed: was /customer/orders which doesn't exist — correct route is /shopping-details
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