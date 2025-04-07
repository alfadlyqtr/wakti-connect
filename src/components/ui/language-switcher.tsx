
import React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { Loader2 } from "lucide-react";

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, loadingTranslation } = useTranslationContext();
  
  if (loadingTranslation) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="px-3 flex items-center gap-1.5"
        disabled
      >
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Loading...</span>
      </Button>
    );
  }
  
  // Show different buttons based on current language
  if (currentLanguage === 'ar') {
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
        title="التبديل إلى العربية"
      >
        <Globe className="h-4 w-4" />
        <span>العربية</span>
      </Button>
    );
  }
}

export default LanguageSwitcher;
