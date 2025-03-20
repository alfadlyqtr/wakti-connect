
import React from "react";
import { useLoginForm } from "@/hooks/auth/useLoginForm";

// Import our smaller components
import EmailField from "./login/EmailField";
import PasswordField from "./login/PasswordField";
import RememberMeCheckbox from "./login/RememberMeCheckbox";
import LoginButton from "./login/LoginButton";

interface LoginFormProps {
  setError: (error: string) => void;
}

const LoginForm = ({ setError }: LoginFormProps) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    authLoading,
    handleLogin
  } = useLoginForm(setError);

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <EmailField email={email} setEmail={setEmail} />
      
      <PasswordField 
        password={password} 
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
      
      <RememberMeCheckbox 
        rememberMe={rememberMe} 
        setRememberMe={setRememberMe} 
      />
      
      <LoginButton isLoading={isLoading} authLoading={authLoading} />
    </form>
  );
};

export default LoginForm;
