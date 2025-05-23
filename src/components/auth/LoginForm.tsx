
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { verifyBiometricLogin } from "@/lib/webauthn";
import { toast } from "@/components/ui/use-toast";

interface LoginFormProps {
  setError: (error: string) => void;
}

const LoginForm = ({ setError }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  
  const location = useLocation();
  const { login } = useAuth();
  
  // Extract return URL from query params if it exists
  const queryParams = new URLSearchParams(location.search);
  const returnUrl = queryParams.get('returnUrl') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const result = await login(email, password);
      
      if (result.error) {
        throw result.error;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to log in. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to use biometric login",
        variant: "destructive"
      });
      return;
    }

    setIsBiometricLoading(true);
    try {
      const result = await verifyBiometricLogin(email);
      if (!result) {
        throw new Error("Biometric authentication failed");
      }
    } catch (error: any) {
      console.error("Biometric login error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Biometric login failed. Please try again or use password.",
        variant: "destructive"
      });
    } finally {
      setIsBiometricLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 w-full"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 w-full"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Link to="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
          Forgot Password?
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Logging in...</span>
            </div>
          ) : (
            <span>Login</span>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleBiometricLogin}
          disabled={isBiometricLoading}
        >
          <Fingerprint className="mr-2 h-4 w-4" />
          {isBiometricLoading ? "Authenticating..." : "Login with Biometrics"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
