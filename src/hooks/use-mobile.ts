
import { useState, useEffect } from 'react';

/**
 * Custom hook to check if viewport is mobile-sized
 * @returns boolean indicating if viewport is mobile sized
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Function to check if window width is mobile sized
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check on initial load
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

// For backward compatibility with default imports
export default useIsMobile;
