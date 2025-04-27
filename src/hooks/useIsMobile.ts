
import { useState, useEffect } from 'react';

export const useIsMobile = (): boolean => {
  // Start with a default value based on window width if available
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    // Only execute in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Function to check if window width is mobile sized
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial detection
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  return isMobile;
};

// For backward compatibility with default exports
export default useIsMobile;
