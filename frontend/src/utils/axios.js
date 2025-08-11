import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const api = axios.create({

  baseURL: "https://casino-6w78.onrender.com/api", // eskills development
  // baseURL: "http://localhost:8080/api", // for development
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
      // Do not attempt token refresh for /auth/* routes (like login, register, forgot-password)
      if (originalRequest?.url?.startsWith("/auth/")) {
        return Promise.reject(error);
      }

      if (state.isRefreshing) return Promise.reject(error);
      originalRequest._retry = true;

      try {
        state.isRefreshing = true;
        const response = await api.post("/auth/refresh-token", {}, {
          withCredentials: true,
        });
        state.isRefreshing = false;

        const { token } = response.data;
        if (!token) throw new Error("No token received from refresh-token endpoint");
        useAuthStore.getState().setAuth(token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

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
