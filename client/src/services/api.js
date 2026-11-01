import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// ---- Restaurant / default id helper ----
// The default restaurant id used across the app (set after seeding, or read from env)
export const DEFAULT_RESTAURANT_ID = import.meta.env.VITE_RESTAURANT_ID || '';

// ---- Auth ----
export const loginAdmin = (email, password) => api.post('/auth/login', { email, password });
export const getMe = () => api.get('/auth/me');

// ---- Restaurant ----
export const getRestaurant = (id) => api.get(`/restaurant/${id}`);
export const updateRestaurant = (id, data) => api.put(`/restaurant/${id}`, data);
export const getDashboardStats = (id) => api.get(`/restaurant/${id}/dashboard`);
export const getQrCode = (id) => api.get(`/restaurant/${id}/qr`);

// ---- Categories ----
export const getCategories = (restaurantId) => api.get('/categories', { params: { restaurantId } });
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// ---- Menu Items ----
export const getMenuItems = (params) => api.get('/menu', { params });
export const getMenuItem = (id) => api.get(`/menu/${id}`);
export const createMenuItem = (data) => api.post('/menu', data);
export const updateMenuItem = (id, data) => api.put(`/menu/${id}`, data);
export const toggleMenuItemAvailability = (id, isAvailable) =>
  api.patch(`/menu/${id}/availability`, { isAvailable });
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);

// ---- Chatbot ----
export const getChatbotQuestions = (params) => api.get('/chatbot/questions', { params });
export const askChatbot = (data) => api.post('/chatbot/questions/ask', data);
export const createChatbotQuestion = (data) => api.post('/chatbot/questions', data);
export const updateChatbotQuestion = (id, data) => api.put(`/chatbot/questions/${id}`, data);
export const deleteChatbotQuestion = (id) => api.delete(`/chatbot/questions/${id}`);
