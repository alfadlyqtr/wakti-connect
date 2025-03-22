
import React from "react";
import { useTranslation } from "@/components/mocks/translationMock";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
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
  };

  // Check current language on component mount and set direction
  React.useEffect(() => {
    const currentLang = i18n.language;
    if (currentLang === 'ar' && document.documentElement.dir !== 'rtl') {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
    } else if (currentLang !== 'ar' && document.documentElement.dir !== 'ltr') {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl');
    }
  }, [i18n.language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={i18n.language === 'en' ? 'bg-muted' : ''}
        >
          <div className="h-4 w-6 relative overflow-hidden mr-2 rounded-sm" style={{ 
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
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('ar')}
          className={i18n.language === 'ar' ? 'bg-muted' : ''}
        >
          <div className="h-4 w-6 relative overflow-hidden mr-2 rounded-sm">
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
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
