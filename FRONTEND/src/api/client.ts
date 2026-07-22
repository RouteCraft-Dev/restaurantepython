import axios from 'axios';

// Detectamos si la app corre local o en Vercel para asignar la URL correcta automáticamente
const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export const api = axios.create({
  baseURL: isLocal ? 'http://localhost:5000/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor por si manejas tokens de autenticación en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('restaurante_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});