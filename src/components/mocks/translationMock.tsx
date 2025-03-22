import React from 'react';

// This is a mock component for use in development
// It mimics the behavior of the useTranslation hook from react-i18next
// but doesn't actually do any translations

export const useTranslation = () => {
  const t = (key: string, options?: any) => {
    // If the key is an object path (e.g. 'namespace.key')
    if (key.includes('.')) {
      const parts = key.split('.');
      return parts[parts.length - 1];
    }
    
    // If options is an object with returnObjects: true, return an empty array
    if (options && options.returnObjects) {
      return [];
    }
    
    // Otherwise just return the key itself
    return key;
  };

  return {
    t,
    i18n: {
      language: 'en',
      changeLanguage: (lng: string) => Promise.resolve(),
    }
  };
};

export default { useTranslation };
