
import { useCallback, useRef } from 'react';

/**
 * Creates a debounced version of a callback function
 * that returns a Promise
 * 
 * @param callback The function to debounce
 * @param delay Delay in milliseconds
 * @returns A debounced version of the callback
 */
export function useDebouncedCallback<T extends any[]>(
  callback: (...args: T) => Promise<void> | void,
  delay: number = 500
): (...args: T) => Promise<void> {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const debouncedFn = useCallback(
    (...args: T): Promise<void> => {
      return new Promise<void>((resolve) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(async () => {
          try {
            const result = callback(...args);
            // Handle both Promise and non-Promise returns
            if (result instanceof Promise) {
              await result;
            }
            resolve();
          } catch (error) {
            console.error("Error in debounced callback:", error);
            resolve();
          }
        }, delay);
      });
    },
    [callback, delay]
  );
  
  return debouncedFn;
}
