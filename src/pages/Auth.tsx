
import React from "react";
import { Navigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  console.log("Auth page rendering with redirect to /auth/login");
  
  // We'll just render a redirect to the login page
  return <Navigate to="/auth/login" replace />;
};

export default Auth;
