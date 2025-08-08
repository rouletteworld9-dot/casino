import { useMutation } from "@tanstack/react-query";
import authApi from "../api/authApi"
import { useAuthStore } from "../stores/useAuthStore";

export const useAuth = ()=>{
    const { setAuth, setRegistrationData } = useAuthStore.getState();
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.accessToken);
      setRegistrationData(data);
    },
    onError: (error)=>{
        console.log("Registration error:", error);
    }
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.accessToken);
    },
    onError: (error)=>{
        console.log("Login error:", error);
    }
  });

  return {
    registerUser : registerMutation.mutate,
    loginUser : loginMutation.mutate,
    loginLoading:loginMutation.isPending
  }
}