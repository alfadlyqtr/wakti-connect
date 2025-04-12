
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Flag } from "lucide-react";

const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');

  // Check if there's a saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('wakti-language');
    if (savedLanguage === 'ar') {
      setCurrentLanguage('ar');
      // If the page loads with Arabic preference, trigger translation
      triggerBrowserTranslation();
    }
  }, []);

  const triggerBrowserTranslation = () => {
    try {
      // Set data-language attribute on html tag to help browsers detect language
      document.documentElement.setAttribute('lang', 'en');
      document.documentElement.setAttribute('data-translate-target', 'ar');
      
      // Show browser translation bar - this works in Chrome, Edge, and some other browsers
      // by leveraging the browser's detection of language mismatch
      const metaTag = document.querySelector('meta[name="google"]') || document.createElement('meta');
      metaTag.setAttribute('name', 'google');
      metaTag.setAttribute('value', 'notranslate');
      metaTag.remove(); // Remove if exists, which triggers browser to re-evaluate
      
      setTimeout(() => {
        document.head.appendChild(metaTag);
      }, 100);
      
      // Save language preference
      localStorage.setItem('wakti-language', 'ar');
      
      // Show a toast to guide the user if browser doesn't automatically prompt
      toast(
        <div className="flex items-center gap-2 flex-col">
          <div className="flex items-center">
            <span>Switched to Arabic</span>
            <Flag className="h-4 w-4 ml-2" />
          </div>
          <span dir="rtl">تم التبديل إلى اللغة العربية</span>
          <small className="text-xs mt-1">
            If translation doesn't appear, check your browser's translation options
          </small>
        </div>
      );
    } catch (error) {
      console.error("Translation error:", error);
      toast("Could not trigger translation. Try using your browser's translate feature.");
    }
  };

  const resetToEnglish = () => {
    // Remove translation attributes
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.removeAttribute('data-translate-target');
    
    // Remove meta tag to restore original state
    const metaTag = document.querySelector('meta[name="google"]');
    if (metaTag) metaTag.remove();
    
    // Save language preference
    localStorage.setItem('wakti-language', 'en');
    
    // Force a re-render of components without reloading
    window.dispatchEvent(new Event('language-change'));
    
    toast("Switched back to English");
  };

  const handleLanguageChange = () => {
    if (currentLanguage === 'en') {
      setCurrentLanguage('ar');
      triggerBrowserTranslation();
    } else {
      setCurrentLanguage('en');
      resetToEnglish();
    }
  };

  return (
    <Button 
      onClick={handleLanguageChange}
      variant="ghost" 
      size="sm" 
      className="w-8 px-0"
    >
      {currentLanguage === 'en' ? 'العربية' : 'English'}
    </Button>
  );
};

export default LanguageSwitcher;
