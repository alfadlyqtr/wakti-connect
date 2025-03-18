
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Direction = 'ltr' | 'rtl';

interface DirectionContextType {
  direction: Direction;
  isRtl: boolean;
}

const DirectionContext = createContext<DirectionContextType>({
  direction: 'ltr',
  isRtl: false,
});

export const useDirection = () => useContext(DirectionContext);

export const DirectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState<Direction>(
    i18n.language === 'ar' ? 'rtl' : 'ltr'
  );

  useEffect(() => {
    const handleLanguageChange = () => {
      const newDirection = i18n.language === 'ar' ? 'rtl' : 'ltr';
      setDirection(newDirection);
    };

    handleLanguageChange(); // Set initial direction
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <DirectionContext.Provider value={{ direction, isRtl: direction === 'rtl' }}>
      {children}
    </DirectionContext.Provider>
  );
};
