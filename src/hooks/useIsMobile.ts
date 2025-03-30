
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current viewport is mobile-sized
 */
export const useIsMobile = (breakpoint = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Check initially
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
};

// Legacy export for backward compatibility
export default useIsMobile;
