import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajusta la URL según tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agrega un interceptor para incluir el token en las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // O utiliza useAuth si es posible
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
