
import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param callback - The function to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced version of the callback that returns a Promise
 */
export function useDebouncedCallback<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
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
            reject(error);
          }
        }, delay);
      });
    },
    [callback, delay]
  );

  return debouncedCallback;
}
