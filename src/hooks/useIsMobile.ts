
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is mobile based on screen width
 * @param breakpoint - Width threshold in pixels (default: 768)
 * @returns boolean indicating if the device is considered mobile
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);
  
  return isMobile;
};

export default useIsMobile;
