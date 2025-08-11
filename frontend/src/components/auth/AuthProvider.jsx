import { useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

export const AuthProvider = ({ children }) => {
    const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return <>{children}</>;
};
