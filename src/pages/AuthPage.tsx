
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import AuthShell from "@/components/auth/AuthShell";

interface AuthPageProps {
  mode?: "login" | "signup";
}

const AuthPage: React.FC<AuthPageProps> = ({ mode = "login" }) => {
  const { authType } = useParams<{ authType: string }>();
  const currentMode = authType === "signup" ? "signup" : mode;
  const [error, setError] = useState("");
  
  return (
    <AuthShell>
      {currentMode === "login" ? 
        <LoginForm setError={setError} /> : 
        <SignupForm setError={setError} />
      }
    </AuthShell>
  );
};

export default AuthPage;
