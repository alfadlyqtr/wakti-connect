
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
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      return new Promise<ReturnType<T>>((resolve) => {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set a new timeout
        timeoutRef.current = setTimeout(async () => {
          try {
            const result = await callback(...args);
            resolve(result);
          } catch (error) {
            console.error("Error in debounced callback:", error);
            throw error;
          }
        }, delay);
      });
    },
    [callback, delay]
  );

  return debouncedCallback;
}
