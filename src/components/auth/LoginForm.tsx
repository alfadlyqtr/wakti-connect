
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
  setError: (error: string) => void;
}

const LoginForm = ({ setError }: LoginFormProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting login with:", email);
      await login(email, password);
      
      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
      });

      // Navigate to dashboard
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Login error in form handler:", error);
      
      // Track login attempts
      setLoginAttempts(prev => prev + 1);
      
      // Provide more contextual error messages based on number of attempts
      let errorMessage = error.message || "Failed to log in. Please try again.";
      
      if (loginAttempts >= 2) {
        if (error.message?.includes("database") || error.message?.includes("profiles") || 
            error.message?.includes("Auth service") || error.message?.includes("connection")) {
          errorMessage = "We're experiencing technical difficulties. Please try again later or contact support.";
        }
      }
      
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('auth.email')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Link 
            to="/auth/forgot-password" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox 
          id="remember" 
          checked={rememberMe} 
          onCheckedChange={(checked) => 
            setRememberMe(checked as boolean)
          }
        />
        <Label 
          htmlFor="remember" 
          className="text-sm font-normal cursor-pointer"
        >
          {t('auth.rememberMe')}
        </Label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{t('auth.loggingIn')}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            <span>{t('auth.login')}</span>
          </div>
        )}
      </Button>

      {loginAttempts >= 2 && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-sm">
          <p>Having trouble logging in? Try these steps:</p>
          <ul className="list-disc ml-5 mt-1">
            <li>Make sure you've entered the correct email and password</li>
            <li>Try clearing your browser cache and cookies</li>
            <li>Try using a different browser</li>
            <li>Check if your internet connection is stable</li>
            {loginAttempts >= 3 && (
              <li>If the problem persists, <a href="/auth/signup" className="underline font-medium">create a new account</a> or contact support</li>
            )}
          </ul>
        </div>
      )}
    </form>
  );
};

export default LoginForm;
