import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('vendor_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('vendor_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;

// ═══ AUTH ═══
export const vendorLogin = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

// ═══ VENDOR PROFILE ═══
export const getMyVendor = () => api.get('/vendor/me');
export const updateMyVendor = (data: any) => api.patch('/vendor/me', data);

// ═══ ORDERS ═══
export const getVendorOrders = (vendorId: string, status?: string) =>
  api.get('/vendor/orders', { params: { vendor_id: vendorId, status } });
export const acceptOrder = (id: string) => api.patch(`/vendor/orders/${id}/accept`);
export const rejectOrder = (id: string, reason?: string) => api.patch(`/vendor/orders/${id}/reject`, { reason });
export const markPreparing = (id: string) => api.patch(`/vendor/orders/${id}/preparing`);
export const markReady = (id: string) => api.patch(`/vendor/orders/${id}/ready`);

// ═══ MENU ═══
export const addItem = (data: any) => api.post('/vendor/items', data);
export const updateItem = (id: string, data: any) => api.patch(`/vendor/items/${id}`, data);
export const deleteItem = (id: string) => api.delete(`/vendor/items/${id}`);

// ═══ UPLOADS ═══
export const uploadImage = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/uploads/image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};
