
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    
    // Set the dir attribute on the html element for RTL support
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add a class to the body for additional RTL styling if needed
    if (language === 'ar') {
      document.body.classList.add('rtl');
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('rtl');
      document.body.classList.remove('font-arabic');
    }
    
    // Save the language preference in local storage with consistent key name
    localStorage.setItem('wakti-language', language);
  };

  // Check current language on component mount and set direction
  useEffect(() => {
    // Try to load language preference from local storage first
    const savedLanguage = localStorage.getItem('wakti-language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      console.log('Applying saved language from localStorage:', savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
    
    const currentLang = i18n.language;
    console.log('Current language:', currentLang);
    if (currentLang === 'ar' && document.documentElement.dir !== 'rtl') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.body.classList.add('rtl');
      document.body.classList.add('font-arabic');
    } else if (currentLang !== 'ar' && document.documentElement.dir !== 'ltr') {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
      document.body.classList.remove('rtl');
      document.body.classList.remove('font-arabic');
    }
  }, [i18n]);

  // Directly display both language options as buttons with flags
  if (i18n.language === 'ar') {
    return (
      <Button variant="outline" size="sm" className="px-3" onClick={() => changeLanguage('en')}>
        <span className="mr-1">🇺🇸</span>
        <span>English</span>
      </Button>
    );
  } else {
    return (
      <Button variant="outline" size="sm" className="px-3" onClick={() => changeLanguage('ar')}>
        <span className="mr-1">🇶🇦</span>
        <span>العربية</span>
      </Button>
    );
  }
}

export default LanguageSwitcher;
