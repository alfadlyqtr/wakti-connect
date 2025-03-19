
import React from "react";
import { useTranslation } from "react-i18next";

interface WelcomeMessageProps {
  user: any;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ user }) => {
  const { t } = useTranslation();
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) return t('dashboard.welcome.morning');
    if (hour < 18) return t('dashboard.welcome.afternoon');
    return t('dashboard.welcome.evening');
  };
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">
        {getTimeBasedGreeting()}, {user?.displayName || user?.name || t('common.there')}!
      </h1>
      <p className="text-muted-foreground mt-1">
        {t('dashboard.welcome.overview')}
      </p>
    </div>
  );
};

export default WelcomeMessage;
