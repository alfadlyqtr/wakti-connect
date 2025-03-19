
import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface PasswordFieldProps {
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ 
  password, 
  setPassword, 
  showPassword, 
  setShowPassword 
}) => {
  const { t } = useTranslation();
  
  return (
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
  );
};

export default PasswordField;
