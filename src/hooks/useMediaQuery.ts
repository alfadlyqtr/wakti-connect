
import { useState, useEffect } from "react";

/**
 * Hook to check if a media query matches
 * @param query CSS media query to check
 * @returns Boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // For SSR compatibility, initialize with false and update after mount
    if (typeof window === 'undefined') return;
    
    const media = window.matchMedia(query);
    
    // Update the state with the match
    const updateMatches = () => {
      setMatches(media.matches);
      if (!isInitialized) setIsInitialized(true);
    };
    
    // Run once initially
    updateMatches();
    
    // Add the listener for subsequent updates
    if (typeof media.addEventListener === 'function') {
      // Modern browsers
      media.addEventListener("change", updateMatches);
      return () => media.removeEventListener("change", updateMatches);
    } else {
      // Safari < 14 support
      media.addListener(updateMatches);
      return () => media.removeListener(updateMatches);
    }
  }, [query, isInitialized]);

  return matches;
}

/**
 * Hook to check if the device is a touch device
 * @returns Boolean indicating if the device uses touch as primary input
 */
export function useTouchDevice(): boolean {
  return useMediaQuery('(hover: none)');
}

/**
 * Hook to check if the device has a coarse pointer (like touch)
 * @returns Boolean indicating if the device has a coarse pointer
 */
export function useCoarsePointer(): boolean {
  return useMediaQuery('(pointer: coarse)');
}

/**
 * Hook to check if the device has a fine pointer (like mouse)
 * @returns Boolean indicating if the device has a fine pointer
 */
export function useFinePointer(): boolean {
  return useMediaQuery('(pointer: fine)');
}

export default useMediaQuery;
