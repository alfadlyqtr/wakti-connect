
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    
    // Set the dir attribute on the html element for RTL support
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Add a class to the body for additional RTL styling if needed
    if (language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // Save the language preference in local storage
    localStorage.setItem('wakti-language', language);
  };

  // Check current language on component mount and set direction
  useEffect(() => {
    // Try to load language preference from local storage first
    const savedLanguage = localStorage.getItem('wakti-language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
    
    const currentLang = i18n.language;
    if (currentLang === 'ar' && document.documentElement.dir !== 'rtl') {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
    } else if (currentLang !== 'ar' && document.documentElement.dir !== 'ltr') {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl');
    }
  }, [i18n]);

  const languages = [
    { code: 'en', name: 'English', flag: 'en-flag', dir: 'ltr' },
    { code: 'ar', name: 'العربية', flag: 'ar-flag', dir: 'rtl' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
          {i18n.language !== 'en' && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
            >
              {i18n.language.toUpperCase()}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
          {t('common.selectLanguage', 'Select Language')}
        </div>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center">
              <div className={`h-4 w-6 relative overflow-hidden mr-2 rounded-sm flex-shrink-0 ${lang.code === 'en' ? 'en-flag' : 'ar-flag'}`}>
                {lang.code === 'en' && (
                  <div className="absolute inset-0" style={{ 
                    background: 'linear-gradient(180deg, #bf0a30 0%, #bf0a30 15.38%, white 15.38%, white 30.77%, #bf0a30 30.77%, #bf0a30 46.15%, white 46.15%, white 61.54%, #bf0a30 61.54%, #bf0a30 76.92%, white 76.92%, white 92.31%, #bf0a30 92.31%, #bf0a30 100%)'
                  }}>
                    <div 
                      className="absolute top-0 left-0 bottom-0" 
                      style={{ 
                        background: '#002868',
                        width: '40%'
                      }}
                    ></div>
                  </div>
                )}
                {lang.code === 'ar' && (
                  <div className="absolute inset-0">
                    <div className="absolute inset-0" style={{ background: 'white' }}></div>
                    <div 
                      className="absolute top-0 bottom-0 right-0" 
                      style={{ 
                        background: '#8d1b3d', 
                        width: '70%',
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 11% 90%, 0 80%, 11% 70%, 0 60%, 11% 50%, 0 40%, 11% 30%, 0 20%, 11% 10%)'
                      }}
                    ></div>
                  </div>
                )}
              </div>
              <span className={lang.dir === 'rtl' ? 'mr-auto font-arabic' : ''}>{lang.name}</span>
            </div>
            {i18n.language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          {t('common.languagePreference', 'Language preference will be saved')}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
