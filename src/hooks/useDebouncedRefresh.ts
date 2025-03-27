
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for debounced data refreshing without UI flickering
 * @param refreshFn - The function to call for refreshing data
 * @param delay - Debounce delay in milliseconds
 * @returns Object with refresh function and loading state
 */
export function useDebouncedRefresh(
  refreshFn: () => Promise<void>,
  delay: number = 500
): { 
  refresh: () => void; 
  isRefreshing: boolean;
} {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const refresh = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a flag indicating a refresh is pending
    setIsRefreshing(true);
    
    // Create a new debounced refresh
    timeoutRef.current = setTimeout(async () => {
      try {
        await refreshFn();
      } catch (error) {
        console.error("Error in debounced refresh:", error);
      } finally {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setIsRefreshing(false);
        }
      }
    }, delay);
  }, [refreshFn, delay]);
  
  return { refresh, isRefreshing };
}
