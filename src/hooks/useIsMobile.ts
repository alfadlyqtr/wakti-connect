
import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if window is available (client-side rendering)
    if (typeof window !== 'undefined') {
      const checkIsMobile = () => {
        const mobileBreakpoint = 640; // sm breakpoint in Tailwind
        setIsMobile(window.innerWidth < mobileBreakpoint);
      };
      
      // Initial check
      checkIsMobile();
      
      // Add listener for window resize
      window.addEventListener('resize', checkIsMobile);
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', checkIsMobile);
      };
    }
  }, []);
  
  return isMobile;
};

// Alias for backward compatibility with code that uses 'use-mobile'
export const useMobile = useIsMobile;

// Export default for simpler imports
export default useIsMobile;
