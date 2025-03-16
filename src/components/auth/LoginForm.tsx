
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (rememberMe) {
        // Set session expiry to 30 days instead of the default
        // This is handled by Supabase automatically based on the rememberMe option
      }

      // Get user profile to redirect based on account type
      const { data: profileData } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', data.user?.id)
        .single();

      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
      });

      // Redirect based on account type
      if (profileData?.account_type) {
        navigate(`/dashboard/${profileData.account_type}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || "Failed to log in. Please try again.");
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Failed to log in. Please try again.",
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
            to="/forgot-password" 
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
    </form>
  );
};

export default LoginForm;
