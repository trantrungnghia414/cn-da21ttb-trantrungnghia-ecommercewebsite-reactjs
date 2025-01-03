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

// Thêm interceptor để tự động gửi token
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
