
import React from 'react';
import { useTranslation as actualUseTranslation } from 'react-i18next';

// This is a wrapper around useTranslation to provide fallbacks and avoid errors
export const useTranslation = () => {
  try {
    // Try to use the actual useTranslation hook from react-i18next
    return actualUseTranslation();
  } catch (error) {
    // Provide a fallback mock implementation if there's an error
    console.warn('Translation service not available, using mock implementation');
    return {
      t: (key: string) => key,
      i18n: {
        language: 'en',
        changeLanguage: (lng: string) => Promise.resolve(),
        exists: () => true,
      },
    };
  }
};

export default useTranslation;
