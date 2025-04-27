
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

  return { breakpoint, width };
};

export const useMobileBreakpoint = () => {
  const { breakpoint } = useBreakpoint();
  return breakpoint === 'sm' || breakpoint === 'md';
};

export default useBreakpoint;
