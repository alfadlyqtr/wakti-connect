
import React, { useEffect } from 'react';

interface LanguageChangeListenerProps {
  onLanguageChange: () => void;
}

const LanguageChangeListener: React.FC<LanguageChangeListenerProps> = ({ onLanguageChange }) => {
  useEffect(() => {
    const handleLanguageChange = () => {
      console.log('Language change detected, triggering component updates');
      onLanguageChange();
    };
    
    window.addEventListener('language-change', handleLanguageChange);
    return () => window.removeEventListener('language-change', handleLanguageChange);
  }, [onLanguageChange]);

  return null; // This component doesn't render anything
};

export default LanguageChangeListener;
