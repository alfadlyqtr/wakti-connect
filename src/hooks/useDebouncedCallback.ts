import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param callback - The function to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced version of the callback that returns a Promise
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => Promise<any> {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>): Promise<any> => {
      return new Promise<any>((resolve, reject) => {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set a new timeout
        timeoutRef.current = setTimeout(async () => {
          try {
            // Execute the callback and handle both Promise and non-Promise returns
            const result = callback(...args);
            // If the result is a Promise, await it
            if (result instanceof Promise) {
              resolve(await result);
            } else {
              // Otherwise just resolve with the result
              resolve(result);
            }
          } catch (error) {
            console.error("Error in debounced callback:", error);
            reject(error);
          }
        }, delay);
      });
    },
    [callback, delay]
  );

  return debouncedCallback;
}
