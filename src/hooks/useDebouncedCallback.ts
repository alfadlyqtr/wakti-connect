
import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param callback - The function to debounce (can return a Promise or a regular value)
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced version of the callback that returns a Promise
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => Promise<ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>> {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>): Promise<ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>> => {
      return new Promise((resolve, reject) => {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set a new timeout
        timeoutRef.current = setTimeout(() => {
          try {
            // Execute the callback
            const result = callback(...args);
            
            // Handle both Promise and non-Promise returns
            if (result instanceof Promise) {
              // If it's a Promise, resolve with its result
              result
                .then(value => resolve(value as any))
                .catch(error => reject(error));
            } else {
              // If it's not a Promise, just resolve with the value
              resolve(result as any);
            }
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    },
    [callback, delay]
  );

  return debouncedCallback;
}
