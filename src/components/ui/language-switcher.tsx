
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Check if there's a saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('wakti-language');
    if (savedLanguage === 'ar') {
      setCurrentLanguage('ar');
      // If the page loads with Arabic preference, apply Arabic settings
      applyArabicSettings();
    }
  }, []);

  const applyArabicSettings = () => {
    try {
      setIsChangingLanguage(true);
      
      // Set proper HTML attributes for Arabic
      document.documentElement.setAttribute('lang', 'ar');
      document.documentElement.setAttribute('dir', 'rtl');
      
      // Remove notranslate meta tag to encourage browser translation
      const metaTag = document.querySelector('meta[name="google"]');
      if (metaTag) metaTag.remove();
      
      // Save language preference
      localStorage.setItem('wakti-language', 'ar');
      
      setTimeout(() => {
        setIsChangingLanguage(false);
        
        // Show a clean, professional toast with minimal text
        toast(
          <div className="flex items-center justify-center gap-2">
            <span>Switched to Arabic</span>
            <Check className="h-4 w-4 text-green-500" />
          </div>
        );
      }, 800);
      
      // Force a re-render of components
      window.dispatchEvent(new Event('language-change'));
    } catch (error) {
      console.error("Translation error:", error);
      setIsChangingLanguage(false);
      toast("Could not change language. Please try again.");
    }
  };

  const applyEnglishSettings = () => {
    setIsChangingLanguage(true);
    
    // Set proper HTML attributes for English
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
    
    // Add notranslate meta tag for English (default language)
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'google');
    metaTag.setAttribute('content', 'notranslate');
    document.head.appendChild(metaTag);
    
    // Save language preference
    localStorage.setItem('wakti-language', 'en');
    
    // Force a re-render of components
    window.dispatchEvent(new Event('language-change'));
    
    setTimeout(() => {
      setIsChangingLanguage(false);
      
      // Clean, professional toast without technical details
      toast(
        <div className="flex items-center justify-center gap-2">
          <span>Switched to English</span>
          <Check className="h-4 w-4 text-green-500" />
        </div>
      );
    }, 800);
  };

  const handleLanguageChange = () => {
    if (currentLanguage === 'en') {
      setCurrentLanguage('ar');
      applyArabicSettings();
    } else {
      setCurrentLanguage('en');
      applyEnglishSettings();
    }
  };

  return (
    <Button 
      onClick={handleLanguageChange}
      variant="ghost" 
      size="sm" 
      className="w-8 px-0 relative"
      disabled={isChangingLanguage}
    >
      {isChangingLanguage ? (
        <LoadingSpinner size="sm" />
      ) : (
        currentLanguage === 'en' ? 'العربية' : 'English'
      )}
    </Button>
  );
};

export default LanguageSwitcher;
