import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Auth APIs
export const login = (credentials) => api.post('/users/login/', credentials);
export const register = (userData) => api.post('/users/register/', userData);
export const logout = () => api.post('/auth/logout/');

// User APIs
export const getCurrentUser = () => api.get('/users/me/');
export const toggleSMS = (userId) => api.post(`/users/${userId}/toggle_sms/`);

// Village APIs
export const getVillages = () => api.get('/villages/');
export const getVillage = (id) => api.get(`/villages/${id}/`);

// Outage APIs
export const getOutages = (params) => api.get('/outages/', { params });
export const getActiveOutages = () => api.get('/outages/active/');
export const getOutageHistory = (params) => api.get('/outages/history/', { params });
export const createOutage = (data) => api.post('/outages/', data);
export const resolveOutage = (id) => api.post(`/outages/${id}/resolve/`);
export const updateOutage = (id, data) => api.put(`/outages/${id}/`, data);
export const deleteOutage = (id) => api.delete(`/outages/${id}/`);

export default api; 