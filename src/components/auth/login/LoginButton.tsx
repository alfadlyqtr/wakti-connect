
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LoginButtonProps {
  isLoading: boolean;
  authLoading: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ isLoading, authLoading }) => {
  const { t } = useTranslation();
  
  return (
    <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
      {(isLoading || authLoading) ? (
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
  );
};

export default LoginButton;
