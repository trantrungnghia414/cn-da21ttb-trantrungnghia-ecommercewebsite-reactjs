import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_DOMAIN_SERVER_API || 'http://localhost:5000',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosClient.get('/api/auth/check');
        if (response.data.user && response.data.user.role === 'Customer') {
          return axiosClient(originalRequest);
        } else {
          localStorage.removeItem('token');
          // window.location.href = '/login';
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
