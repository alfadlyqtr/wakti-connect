
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Flag, Check } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

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
      setIsChangingLanguage(true);
      
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
        setIsChangingLanguage(false);
      }, 800);
      
      // Save language preference
      localStorage.setItem('wakti-language', 'ar');
      
      // Show a clean, professional toast with minimal text
      toast(
        <div className="flex items-center justify-center gap-2">
          <span>Switched to Arabic</span>
          <Check className="h-4 w-4 text-green-500" />
        </div>
      );
    } catch (error) {
      console.error("Translation error:", error);
      setIsChangingLanguage(false);
      // Simplified error message without technical details
      toast("Could not change language. Please try again.");
    }
  };

  const resetToEnglish = () => {
    setIsChangingLanguage(true);
    
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
