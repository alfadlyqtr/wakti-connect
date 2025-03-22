
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useTranslation } from "@/components/mocks/translationMock";

const Auth = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
