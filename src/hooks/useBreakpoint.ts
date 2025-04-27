
import { useState, useEffect } from 'react';

const breakpoints = {
  'xs': '(min-width: 475px)',
  'sm': '(min-width: 640px)',
  'md': '(min-width: 768px)',
  'lg': '(min-width: 1024px)',
  'xl': '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)'
};

type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint(): Breakpoint[] {
  const [activeBreakpoints, setActiveBreakpoints] = useState<Breakpoint[]>([]);

  useEffect(() => {
    // Create MediaQueryList objects
    const mediaQueries = Object.entries(breakpoints).map(([key, value]) => ({
      key: key as Breakpoint,
      mql: window.matchMedia(value)
    }));

    // Function to update active breakpoints
    const updateActiveBreakpoints = () => {
      const active = mediaQueries
        .filter(({ mql }) => mql.matches)
        .map(({ key }) => key);
      
      setActiveBreakpoints(active);
    };

    // Initial check
    updateActiveBreakpoints();

    // Add listeners
    mediaQueries.forEach(({ mql }) => {
      mql.addEventListener('change', updateActiveBreakpoints);
    });

    // Cleanup
    return () => {
      mediaQueries.forEach(({ mql }) => {
        mql.removeEventListener('change', updateActiveBreakpoints);
      });
    };
  }, []);

  return activeBreakpoints;
}

export function useBreakpointValue<T>(breakpoint: Breakpoint): boolean {
  const activeBreakpoints = useBreakpoint();
  return activeBreakpoints.includes(breakpoint);
}

// Mobile breakpoint utility hook
export function useMobileBreakpoint(): boolean {
  const activeBreakpoints = useBreakpoint();
  return !activeBreakpoints.includes('md');
}

// Export explicitly to avoid confusion
export { useMobileBreakpoint };
