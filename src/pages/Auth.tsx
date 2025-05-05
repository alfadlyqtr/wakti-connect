
import React from "react";
import { Navigate } from "react-router-dom";

const Auth = () => {
  console.log("Auth page rendering with redirect to /auth/login");
  
  // Redirect directly to the login page
  return <Navigate to="/auth/login" replace />;
};

export default Auth;
