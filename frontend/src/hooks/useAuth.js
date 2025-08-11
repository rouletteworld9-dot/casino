import { useMutation } from "@tanstack/react-query";
import authApi from "../api/authApi";
import { useAuthStore } from "../stores/useAuthStore";

export const useAuth = () => {
  const { setAuth, setRegistrationData , setOtpToken , setIsPhoneVerified}  = useAuthStore.getState();
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.token);
      setRegistrationData(data);
    },
    onError: (error) => {
      console.log("Registration error:", error);
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.token);
    },
    onError: (error) => {
      console.log("Login error:", error);
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn:  authApi.verifyOtp,
    onSuccess: (data) => {
      setOtpToken(data.token);
      setIsPhoneVerified(true);
    },
    onError: () => {
      console.log("OTP verification error");
    },
  });

  return {
    registerUser: registerMutation.mutate,
    registerLoading: registerMutation.isPending,
    loginUser: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    verifyOtpFn: verifyOTPMutation.mutate,
    verifyOtpLoading: verifyOTPMutation.isPending,
  };
};
