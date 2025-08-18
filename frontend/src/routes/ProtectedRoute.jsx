import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    // If not logged in, always go to home
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // Redirect based on role
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === "user") {
      return <Navigate to="/" replace />;
    } else {
      // Any other role just goes to home
      return <Navigate to="/" replace />;
    }
  }

  // Allowed → render children
  return children;
};
