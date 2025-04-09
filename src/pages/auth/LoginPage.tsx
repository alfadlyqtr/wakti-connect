
import React from "react";
import AuthForm from "@/components/auth/AuthForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm defaultTab="login" />
      </div>
    </div>
  );
};

export default LoginPage;
