
import { useState, useCallback } from 'react';

export const useColorInput = (initialColor: string = '#000000') => {
  const [color, setColor] = useState(initialColor);
  
  const handleChange = useCallback((newColor: string) => {
    setColor(newColor);
  }, []);
  
  return {
    color,
    setColor: handleChange
  };
};
