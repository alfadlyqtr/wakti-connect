
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { ensureProfileExists } from "@/services/profileService";

// Import our new smaller components
import EmailField from "./login/EmailField";
import PasswordField from "./login/PasswordField";
import RememberMeCheckbox from "./login/RememberMeCheckbox";
import LoginButton from "./login/LoginButton";

interface LoginFormProps {
  setError: (error: string) => void;
}

const LoginForm = ({ setError }: LoginFormProps) => {
  const { t } = useTranslation();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log("User is authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  // Check if there's a remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting login with email:", email);
      
      // First, let's directly use the supabase client to login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Only try to ensure profile exists if login was successful
        try {
          console.log("Checking profile for existing user:", data.user.id);
          const profileCreated = await ensureProfileExists(data.user.id);
          
          if (!profileCreated) {
            console.warn("Could not ensure profile exists, but continuing login flow");
          } else {
            console.log("Profile exists or was created successfully");
          }
        } catch (profileError) {
          // Don't block login if profile check fails
          console.error("Profile check error:", profileError);
        }
        
        console.log("Login successful, session established:", !!data.session);
        
        // Store login time in localStorage to help debug session issues
        localStorage.setItem('lastLoginAttempt', new Date().toISOString());
        
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        // Show toast for successful login
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Navigate to the destination
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error("Login form error:", error);
      setError(error.message || "Failed to log in. Please try again.");
      
      // Show toast for better visibility
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Check your email and password and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

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
