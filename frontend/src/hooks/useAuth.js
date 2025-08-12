import { useMutation } from "@tanstack/react-query";
import authApi from "../api/authApi";
import { useAuthStore } from "../stores/useAuthStore";

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
      setUser(data.user)
    },
    onError: (error) => {
      console.log("Login error:", error);
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: (data) => {
      setOtpToken(data.token);
      setIsPhoneVerified(true);
    },
    onError: () => {
      console.log("OTP verification error");
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onError: (error) => {
      console.log("Forgot password error:", error);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onError: (error) => {
      console.log("Reset password error:", error);
    },
  });


  // const accountSettingsMutation = useMutation({
  //   mutationFn: authApi.account,
  //   onSuccess: (data) =>{
  //     setAuth(data.token);
  //     setAccountData(data);
  //   },
  //   onError: (error) =>{
  //     console.log("Account settings error:", error);
  //   }
  // }).

  const accountSettingsMutation = useMutation({
    mutationFn: authApi.account,
    onSuccess: (data) =>{
      setAuth(data.token);
      setAccountData(data);
    },
    onError: (error) =>{
      console.log("Account settings error:", error);
    }
  })

  return {
    registerUser: registerMutation.mutate,
    registerLoading: registerMutation.isPending,
    loginUser: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    verifyOtpFn: verifyOTPMutation.mutate,
    verifyOtpLoading: verifyOTPMutation.isPending,

    logoutUser: logout,
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
