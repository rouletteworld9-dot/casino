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
      toast.success(data?.message || "Registered Successfully!");
    },
    onError: (error) => {
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
      toast.success(data.message || "Login successfully!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: (data) => {
      setOtpToken(data.token);
      setIsPhoneVerified(true);
      toast.success(data.message || "Verified Successfully!");
    },
    onError: () => {
      toast.error(
        error?.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) => {
      toast.success(data?.message || "OTP sent via whatsapp");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Forgot password failed. Please try again."
      );
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onError: (error) => {
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
