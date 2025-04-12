
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
      triggerArabicTranslation();
    }
  }, []);

  const triggerArabicTranslation = () => {
    try {
      // First try to use Google Translate API if available on the page
      if (window.google && window.google.translate) {
        const translateElement = document.getElementById('google_translate_element');
        if (!translateElement) {
          // Create the element if it doesn't exist
          const div = document.createElement('div');
          div.id = 'google_translate_element';
          div.style.display = 'none';
          document.body.appendChild(div);
        }
        
        // Use Google's translation widget
        if (window.google.translate.TranslateElement) {
          new window.google.translate.TranslateElement(
            { pageLanguage: 'en', includedLanguages: 'ar' },
            'google_translate_element'
          );
        }
      } else {
        // Fallback to redirect through Google Translate
        window.location.href = 'https://translate.google.com/translate?sl=en&tl=ar&u=' + 
          encodeURIComponent(window.location.href);
      }
      
      // Save language preference
      localStorage.setItem('wakti-language', 'ar');
      
      toast(
        <div className="flex items-center gap-2">
          <span>Switched to Arabic</span>
          <br />
          <span dir="rtl">تم التبديل إلى اللغة العربية</span>
          <Flag className="h-4 w-4" />
        </div>
      );
    } catch (error) {
      console.error("Translation error:", error);
      toast("Could not load translation. Please try again.");
    }
  };

  const switchToEnglish = () => {
    // For switching back to English, simply reload the page
    localStorage.setItem('wakti-language', 'en');
    window.location.href = window.location.origin + window.location.pathname;
  };

  const handleLanguageChange = () => {
    if (currentLanguage === 'en') {
      setCurrentLanguage('ar');
      triggerArabicTranslation();
    } else {
      setCurrentLanguage('en');
      switchToEnglish();
    }
  };

  return (
    <>
      {/* Hidden container for Google Translate widget */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      <Button 
        onClick={handleLanguageChange}
        variant="ghost" 
        size="sm" 
        className="w-8 px-0"
      >
        {currentLanguage === 'en' ? 'العربية' : 'English'}
      </Button>
    </>
  );
};

export default LanguageSwitcher;
