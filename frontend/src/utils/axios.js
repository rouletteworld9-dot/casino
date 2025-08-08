import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const api = axios.create({
  // baseURL: "https://craveon-backend.onrender.com/api", // eskills development
  baseURL: 'http://localhost:8080/api', // for development
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const state = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (state.isRefreshing) return Promise.reject(error); 
      originalRequest._retry = true;

      try {
        state.isRefreshing = true;
        const response = await api.get('/auth/refresh', { withCredentials: true });
        state.isRefreshing = false;

        const { accessToken } = response.data;
        useAuthStore.getState().setAuth(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
       

        return api(originalRequest);
      } catch (err) {
        state.isRefreshing = false;
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
