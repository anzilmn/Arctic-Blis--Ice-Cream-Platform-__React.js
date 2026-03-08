const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  const user = localStorage.getItem('authToken');
  return user || null;
};

const request = async (method, endpoint, data = null) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (data) config.body = JSON.stringify(data);

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const result = await response.json();

  if (!response.ok) {
    const message = result.errors
      ? result.errors.map(e => e.msg).join(', ')
      : result.message || 'Something went wrong';
    throw new Error(message);
  }

  return result;
};

export const api = {
  get: (endpoint) => request('GET', endpoint),
  post: (endpoint, data) => request('POST', endpoint, data),
  put: (endpoint, data) => request('PUT', endpoint, data),
  delete: (endpoint) => request('DELETE', endpoint),
};

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Flavors
export const flavorsApi = {
  getAll: (params = '') => api.get(`/flavors${params}`),
  getBySlug: (slug) => api.get(`/flavors/${slug}`),
  create: (data) => api.post('/flavors', data),
  update: (id, data) => api.put(`/flavors/${id}`, data),
  delete: (id) => api.delete(`/flavors/${id}`),
};

// Orders
export const ordersApi = {
  place: (data) => api.post('/orders', data),
  getMine: () => api.get('/orders/my'),
  track: (orderId) => api.get(`/orders/track/${orderId}`),
  getAll: (params = '') => api.get(`/orders${params}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Reviews
export const reviewsApi = {
  getForFlavor: (flavorId) => api.get(`/reviews/${flavorId}`),
  submit: (flavorId, data) => api.post(`/reviews/${flavorId}`, data),
  getAll: () => api.get('/reviews'),
  toggleApprove: (id) => api.put(`/reviews/${id}/approve`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Complaints
export const complaintsApi = {
  submit: (data) => api.post('/complaints', data),
  getMine: () => api.get('/complaints/my'),
  getAll: (params = '') => api.get(`/complaints${params}`),
  update: (id, data) => api.put(`/complaints/${id}`, data),
};

// Contact
export const contactApi = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markRead: (id, reply) => api.put(`/contact/${id}/read`, { reply }),
};

// Admin
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};
