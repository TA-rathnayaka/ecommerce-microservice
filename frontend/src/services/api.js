// services/api.js
import { API_BASE_URL } from "../config";
async function request(path, options = {}) {
  const { headers: customHeaders, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(customHeaders || {}),
    },
    ...restOptions,
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Server error: ${response.status} ${response.statusText}`);
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed: ${response.status} ${response.statusText}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data?.data ?? data;
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  getProducts: () => request("/"),

  getProductById: (productId) => request(`/${productId}`),
  // fixed: was /products/${productId} but nginx routes / → products service directly
  // there is no /products prefix in the gateway

  getProductsByCategory: (type) => request(`/category/${type.toLowerCase()}`),
  // fixed: same — no /products prefix needed

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
    request("/customer/shopping-details", {
      headers: authHeaders(token),
    }),

  getCart: (token) =>
    request("/shopping/cart", {
      headers: authHeaders(token),
    }),

  updateCart: (token, payload) => {
  return request("/shopping/cart", {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
},

  removeFromCart: (token, id) =>
    request(`/shopping/cart/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    }),

  placeOrder: (token, txnId) =>
    request("/shopping/order", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ txnNumber: txnId }),
    }),

  getWishlist: (token) =>
    request("/customer/wishlist", {
      headers: authHeaders(token),
    }),

  addToWishlist: (token, productId) =>
    request("/wishlist", {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ _id: productId }),
    }),

  removeFromWishlist: (token, productId) =>
    request(`/wishlist/${productId}`, {
      method: "DELETE",
      headers: authHeaders(token),
    }),

  createProduct: (token, payload) =>
    request("/product/create", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    }),
};