
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for debounced data refreshing without UI flickering
 * @param refreshFn - The function to call for refreshing data
 * @param delay - Debounce delay in milliseconds
 * @returns Object with refresh function and loading state
 */
export function useDebouncedRefresh<T = void>(
  refreshFn: () => Promise<T>,
  delay: number = 500
): { 
  refresh: () => Promise<T>; 
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
  
  const refresh = useCallback(async (): Promise<T> => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a flag indicating a refresh is pending
    setIsRefreshing(true);
    
    return new Promise<T>((resolve) => {
      // Create a new debounced refresh
      timeoutRef.current = setTimeout(async () => {
        try {
          const result = await refreshFn();
          resolve(result);
        } catch (error) {
          console.error("Error in debounced refresh:", error);
          throw error;
        } finally {
          // Only update state if component is still mounted
          if (isMountedRef.current) {
            setIsRefreshing(false);
          }
        }
      }, delay);
    });
  }, [refreshFn, delay]);
  
  return { refresh, isRefreshing };
}
