
import React, { useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";

const RegisterPage = () => {
  useEffect(() => {
    console.log("RegisterPage component mounted");
  }, []);
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm defaultTab="register" />
      </div>
    </div>
  );
};

export default RegisterPage;
