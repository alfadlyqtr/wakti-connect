
import { useState, useEffect } from 'react';

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('');
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      
      if (window.innerWidth < 640) {
        setBreakpoint('sm');
      } else if (window.innerWidth < 768) {
        setBreakpoint('md');
      } else if (window.innerWidth < 1024) {
        setBreakpoint('lg');
      } else if (window.innerWidth < 1280) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };

    // Initial call
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add a method to check if current breakpoint matches or exceeds a given breakpoint
  const includes = (bp: string): boolean => {
    const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpoints.indexOf(breakpoint);
    const targetIndex = breakpoints.indexOf(bp);
    return currentIndex >= targetIndex;
  };

  return { breakpoint, width, includes };
};

export const useMobileBreakpoint = () => {
  const { breakpoint } = useBreakpoint();
  return breakpoint === 'sm' || breakpoint === 'md';
};

// Adding useBreakpointValue helper to match the import in ModeSwitcher.tsx
export const useBreakpointValue = (bp: string): boolean => {
  const { includes } = useBreakpoint();
  return includes(bp);
};

export default useBreakpoint;
