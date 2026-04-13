import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;

// ═══ AUTH ═══
export const adminLogin = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

// ═══ CATEGORIES ═══
export const getCategories = () => api.get('/categories/all');
export const getCategoryTree = () => api.get('/categories');
export const createCategory = (data: any) => api.post('/admin/categories', data);
export const updateCategory = (id: string, data: any) => api.patch(`/admin/categories/${id}`, data);
export const deleteCategory = (id: string) => api.delete(`/admin/categories/${id}`);
export const reorderCategory = (id: string, sortOrder: number) => api.patch(`/admin/categories/${id}/reorder`, { sort_order: sortOrder });

// ═══ VENDORS ═══
export const getVendors = () => api.get('/vendors');
export const getVendor = (slug: string) => api.get(`/vendors/${slug}`);
export const verifyVendor = (id: string) => api.patch(`/admin/vendors/${id}/verify`);
export const suspendVendor = (id: string) => api.patch(`/admin/vendors/${id}/suspend`);

// ═══ ORDERS ═══
export const getAllOrders = (params?: any) => api.get('/admin/orders', { params });
export const getOrder = (id: string) => api.get(`/orders/${id}`);

// ═══ RIDERS ═══
export const getRiders = () => api.get('/admin/riders');

// ═══ CUSTOMERS ═══
export const getCustomers = () => api.get('/admin/customers');

// ═══ ANALYTICS ═══
export const getDashboardKPIs = () => api.get('/admin/analytics/dashboard');
export const getRevenueChart = (days?: number) => api.get('/admin/analytics/revenue', { params: { days } });
export const getOrdersByCategory = () => api.get('/admin/analytics/categories');

// ═══ PAYMENTS ═══
export const getPayments = (params?: any) => api.get('/admin/payments', { params });

// ═══ PROMOTIONS ═══
export const getPromotions = () => api.get('/admin/promotions');
export const createPromotion = (data: any) => api.post('/admin/promotions', data);
export const updatePromotion = (id: string, data: any) => api.patch(`/admin/promotions/${id}`, data);
export const deletePromotion = (id: string) => api.delete(`/admin/promotions/${id}`);

// ═══ UPLOADS ═══
export const uploadImage = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/uploads/image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};

// ═══ SEARCH ═══
export const search = (q: string, params?: any) => api.get('/search', { params: { q, ...params } });
