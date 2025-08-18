import { useMutation } from "@tanstack/react-query";
import authApi from "../api/authApi";
import { useAuthStore } from "../stores/useAuthStore";
import { toast } from "react-hot-toast";

export const useAuth = () => {
  const {
    setAuth,
    setUser,
    setRegistrationData,
    setOtpToken,
    setIsPhoneVerified,
    logout,
  } = useAuthStore.getState();
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setRegistrationData(data);
      toast.success("Registration successful");
    },
    onError: (error) => {
      console.log("Registration error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);
      toast.success("Login successful!");
    },
    onError: (error) => {
      console.log("Login error:", error);
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    },
  });

  // const logoutMutation = useMutation({
  //   mutationFn: authApi.logout,
  //   onSuccess: () => {
  //     logout();
  //     toast.success("Logout successful!");
  //   },
  //   onError: (error) => {
  //     console.log("Logout error:", error);
  //     toast.error("Logout failed");
  //   },
  // });

  const verifyOTPMutation = useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: (data) => {
      setOtpToken(data.token);
      setIsPhoneVerified(true);
      toast.success("Verification successfull!!.. Please login Here.");
    },
    onError: () => {
      console.log("OTP verification error");
      toast.error(
        error?.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onError: (error) => {
      console.log("Forgot password error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Forgot password failed. Please try again."
      );
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onError: (error) => {
      console.log("Reset password error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Reset password failed. Please try again."
      );
    },
  });

  const accountSettingsMutation = useMutation({
    mutationFn: authApi.getPaymentSettings,
    onSuccess: (data) => {
      setAuth(data.token);
      setAccountData(data);
    },
    onError: (error) => {
      console.log("Account settings error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Account settings failed. Please try again."
      );
    },
  });

  return {
    registerUser: registerMutation.mutate,
    registerLoading: registerMutation.isPending,
    loginUser: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    logoutUser: logout,
    verifyOtpFn: verifyOTPMutation.mutate,
    verifyOtpLoading: verifyOTPMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutate,
    forgotPasswordLoading: forgotPasswordMutation.isPending,
    // verifyResetOtp: verifyResetOtpMutation.mutate,
    // verifyResetOtpLoading: verifyResetOtpMutation.isPending,
    resetPassword: resetPasswordMutation.mutate,
    resetPasswordLoading: resetPasswordMutation.isPending,
    // accountSettings: accountSettingsMutation.mutate,
    // accountSettingsLoading: accountSettingsMutation.isPending,
  };
};
