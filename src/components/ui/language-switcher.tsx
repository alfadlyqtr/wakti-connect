
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (language: string) => {
    console.log(`Changing language to: ${language}`);
    
    // Save to localStorage first, then change language
    localStorage.setItem('wakti-language', language);
    i18n.changeLanguage(language);
  };

  // We only need to check for stored language on initial mount
  // This way we don't fight with the i18n system's own state management
  useEffect(() => {
    // This only checks on component mount - no need for dependencies
    const savedLanguage = localStorage.getItem('wakti-language');
    if (savedLanguage && i18n.language !== savedLanguage) {
      console.log('Applying saved language from localStorage:', savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Show different buttons based on current language
  if (i18n.language === 'ar') {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="px-3 flex items-center gap-1.5" 
        onClick={() => changeLanguage('en')}
        title={t('language.switchToEnglish')}
      >
        <Globe className="h-4 w-4" />
        <span>English</span>
      </Button>
    );
  } else {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="px-3 flex items-center gap-1.5" 
        onClick={() => changeLanguage('ar')}
        title={t('language.switchToArabic')}
      >
        <Globe className="h-4 w-4" />
        <span>العربية</span>
      </Button>
    );
  }
}

export default LanguageSwitcher;
