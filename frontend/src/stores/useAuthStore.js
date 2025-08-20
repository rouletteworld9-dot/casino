import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import api from "../utils/axios";

export const useAuthStore = create((set) => ({
  user: null,
  // userData: null,
  accessToken: null,
  isLoading: false,
  userDataLoading: false,
  isRefreshing: false,
  otpToken: null,
  isPhoneVerified: false,
  registrationData: {},
  // setUser: (userData) => set({ userData }),
  setOtpToken: (token) => set({ otpToken: token }),
  setIsPhoneVerified: (status) => set({ isPhoneVerified: status }),
  setRegistrationData: (data) => set({ registrationData: data }),
  resetAuth: () =>
    set({
      otpToken: null,
      isPhoneVerified: false,
      registrationData: {},
    }),

  setAuth: (data) => {
    console.log(data , "data")
    if (data.token) {
      // const user = jwtDecode(token);
      if (!data.token) throw new Error("Invalid token");
      set({ user: data.user, accessToken: data.token, isLoading: false });
    }
  },

  logout: async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    set({ accessToken: null, user: null, isLoading: false });
  },

  checkAuth: async () => {
    const state = useAuthStore.getState();

    if (state.isRefreshing || state.accessToken) return;

    try {
      set({ isLoading: true, userDataLoading: true, isRefreshing: true });

      const response = await api.post("/auth/refresh-token", {
        withCredentials: true,
      });
      const { token, user } = response.data;

      if (user) {
        // const decodedUser = jwtDecode(token);
        set({
          accessToken: token,
          user,
          isLoading: false,
          userDataLoading: false,
        });
      } else {
        set({
          user: null,
          accessToken: null,
          isLoading: false,
          userDataLoading: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        accessToken: null,
        isLoading: false,
        userDataLoading: false,
      });
    } finally {
      set({ isRefreshing: false });
    }
  },
}));
