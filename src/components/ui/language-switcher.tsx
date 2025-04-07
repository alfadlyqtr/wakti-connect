
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (language: string) => {
    console.log(`Changing language to: ${language}`);
    i18n.changeLanguage(language);
    
    // The direction and other settings are now handled by the i18n.on('languageChanged') listener
    // in the main i18n.ts file, so we don't need to duplicate that logic here
    
    // Save the language preference in local storage with consistent key name
    localStorage.setItem('wakti-language', language);
  };

  // Check current language on component mount
  useEffect(() => {
    // Try to load language preference from local storage first
    const savedLanguage = localStorage.getItem('wakti-language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      console.log('Applying saved language from localStorage:', savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
    
    // No need to manually set direction here as it's handled in i18n.ts
  }, [i18n]);

  // Show different buttons based on current language
  if (i18n.language === 'ar') {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="px-3 flex items-center gap-1.5" 
        onClick={() => changeLanguage('en')}
        title="Switch to English"
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
        title="التبديل إلى اللغة العربية"
      >
        <Globe className="h-4 w-4" />
        <span>العربية</span>
      </Button>
    );
  }
}

export default LanguageSwitcher;
