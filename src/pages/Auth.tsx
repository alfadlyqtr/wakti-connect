
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page, as this is a legacy route
    navigate("/auth/login", { replace: true });
  }, [navigate]);
  
  // This will render briefly before the redirect happens
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
