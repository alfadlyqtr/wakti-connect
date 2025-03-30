
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
  const activePromiseRef = useRef<Promise<T> | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
  
  const refresh = useCallback(async (): Promise<T> => {
    // If a refresh is already in progress, return the existing promise to avoid duplicates
    if (activePromiseRef.current) {
      return activePromiseRef.current;
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Set a flag indicating a refresh is pending
    if (isMountedRef.current) {
      setIsRefreshing(true);
    }
    
    return new Promise<T>((resolve, reject) => {
      // Create a new debounced refresh
      timeoutRef.current = setTimeout(async () => {
        try {
          const promise = refreshFn();
          activePromiseRef.current = promise;
          
          const result = await promise;
          
          // Only update state if component is still mounted
          if (isMountedRef.current) {
            setIsRefreshing(false);
          }
          
          resolve(result);
        } catch (error) {
          console.error("Error in debounced refresh:", error);
          
          // Only update state if component is still mounted
          if (isMountedRef.current) {
            setIsRefreshing(false);
          }
          
          reject(error);
        } finally {
          activePromiseRef.current = null;
        }
      }, delay);
    });
  }, [refreshFn, delay]);
  
  return { refresh, isRefreshing };
}
