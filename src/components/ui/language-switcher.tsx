
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { toast } = useToast();
  
  const changeLanguage = (language: string) => {
    console.log(`Changing language to: ${language}`);
    
    try {
      // Save the language preference in local storage with consistent key name
      localStorage.setItem('wakti-language', language);
      
      // Change the language in i18n
      i18n.changeLanguage(language);
      
      // Show success toast
      toast({
        title: language === 'ar' ? 'تم تغيير اللغة' : 'Language changed',
        description: language === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English',
        variant: "default",
      });
      
      // Note: The page will reload due to the event listener in i18n.ts
    } catch (error) {
      console.error("Error changing language:", error);
      
      // Show error toast
      toast({
        title: "Error changing language",
        description: "There was an issue changing the language. Please try again.",
        variant: "destructive",
      });
    }
  };

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
        title="التبديل إلى العربية"
      >
        <Globe className="h-4 w-4" />
        <span>العربية</span>
      </Button>
    );
  }
}

// Add a default export that points to the same component
export default LanguageSwitcher;
