
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";

const Auth = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    console.log("Auth page rendering with redirect to /auth/login", { isAuthenticated });
  }, [isAuthenticated]);
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Redirect directly to the login page
  return <Navigate to="/auth/login" replace />;
};

export default Auth;
