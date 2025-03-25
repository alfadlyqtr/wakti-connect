
import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Hook that returns an array of breakpoints that are currently active
 * @returns Array of active breakpoints
 */
export function useBreakpoint(): Breakpoint[] {
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
  const currentBreakpoints = useBreakpoint();
  return currentBreakpoints.includes(minBreakpoint);
}

/**
 * Hook that returns whether the current viewport is 'mobile' (below sm breakpoint)
 * For direct boolean usage in components
 */
export function useMobileBreakpoint(): { isMobile: boolean } {
  const breakpoints = useBreakpoint();
  const isMobile = !breakpoints.includes('sm');
  return { isMobile };
}

export default useBreakpoint;
