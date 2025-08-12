import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import api from "../utils/axios";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  isRefreshing: false,
  otpToken: null,
  isPhoneVerified: false,
  registrationData: {},
  setOtpToken: (token) => set({ otpToken: token }),
  setIsPhoneVerified: (status) => set({ isPhoneVerified: status }),
  setRegistrationData: (data) => set({ registrationData: data }),
  resetAuth: () =>
    set({
      otpToken: null,
      isPhoneVerified: false,
      registrationData: {},
    }),

  setAuth: (token) => {
    if (token) {
      const user = jwtDecode(token);
      console.log(user, "user from setAuth");
      if (!user) throw new Error("Invalid token");
      set({ user, accessToken: token, isLoading: false });
    }
  },

  logout: async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    set({ accessToken: null, user: null, isLoading: false });
  },

  // checkAuth: async () => {
  //   try {
  //     // set({ isLoading: true });

  //     const state = useAuthStore.getState();
  //     if (state.isRefreshing) return;
  //     set({ isRefreshing: true });

  //     const response = await api.get("/auth/refresh-token", {
  //       withCredentials: true,
  //     });
  //     const { accessToken } = response.data;

  //     if (accessToken) {
  //       const user = jwtDecode(accessToken);
  //       set({ accessToken, user, isLoading: false });
  //     }
  //   } catch (error) {
  //     set({ user: null, accessToken: null, isLoading: false });
  //     throw new Error(error);
  //   } finally {
  //     set({ isRefreshing: false });
  //   }
  // },
  checkAuth: async () => {
    const state = useAuthStore.getState();

    if (state.isRefreshing || state.accessToken) return;

    try {
      set({ isLoading: true, isRefreshing: true });

      const response = await api.get("/auth/refresh-token", {
        withCredentials: true,
      });
      const { accessToken } = response.data;

      if (accessToken) {
        const user = jwtDecode(accessToken);
        set({ accessToken, user, isLoading: false });
      } else {
        set({ user: null, accessToken: null, isLoading: false });
      }
    } catch (error) {
      set({ user: null, accessToken: null, isLoading: false });
    } finally {
      set({ isRefreshing: false });
    }
  },
}));
