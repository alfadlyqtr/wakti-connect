
import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Hook to check if the current viewport is mobile
 * @returns Boolean indicating if the viewport is mobile-sized
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoints.md);
    };

    // Check on initial load
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
}

/**
 * Hook to check if the current viewport is tablet or larger
 * @returns Boolean indicating if the viewport is tablet-sized or larger
 */
export function useIsTabletOrLarger(): boolean {
  return !useIsMobile();
}

/**
 * Hook that returns an array of breakpoints that are currently active
 * @returns Array of active breakpoints
 */
export function useBreakpoints(): Breakpoint[] {
  const [activeBreakpoints, setActiveBreakpoints] = useState<Breakpoint[]>(['xs']);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const active: Breakpoint[] = [];
      
      // Add all breakpoints that are smaller than or equal to the current width
      if (width >= 0) active.push('xs');
      if (width >= breakpoints.sm) active.push('sm');
      if (width >= breakpoints.md) active.push('md');
      if (width >= breakpoints.lg) active.push('lg');
      if (width >= breakpoints.xl) active.push('xl');
      if (width >= breakpoints['2xl']) active.push('2xl');
      
      setActiveBreakpoints(active);
    };

    // Set initial breakpoints
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return activeBreakpoints;
}

/**
 * Hook to check if the current breakpoint is at or above a specified breakpoint
 * @param breakpoint Minimum breakpoint to check for
 * @returns Boolean indicating if current width meets or exceeds the specified breakpoint
 */
export function useBreakpointValue(minBreakpoint: Breakpoint): boolean {
  const currentBreakpoints = useBreakpoints();
  return currentBreakpoints.includes(minBreakpoint);
}

/**
 * Hook to determine the current device type
 * @returns Object with boolean values for different device types
 */
export function useDeviceType() {
  const breakpoints = useBreakpoints();
  
  return {
    isMobile: !breakpoints.includes('md'),
    isTablet: breakpoints.includes('md') && !breakpoints.includes('lg'),
    isDesktop: breakpoints.includes('lg'),
    isTouch: !breakpoints.includes('lg'), // Mobile or tablet
  };
}

// For backward compatibility
export { useIsMobile as useMobile };
export { useBreakpoints as useBreakpoint };

export default useBreakpoints;
