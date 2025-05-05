
import React, { useEffect } from "react";
import AuthForm from "@/features/auth/components/AuthForm"; // Use the component from features

const LoginPage = () => {
  useEffect(() => {
    console.log("LoginPage component mounted");
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm defaultTab="login" />
      </div>
    </div>
  );
};

export default LoginPage;
