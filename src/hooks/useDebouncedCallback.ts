
import { useCallback, useRef, useState, useEffect } from 'react';

/**
 * Creates a debounced version of a callback function
 * that returns a Promise
 * 
 * @param callback The function to debounce
 * @param delay Delay in milliseconds
 * @returns A debounced version of the callback
 */
export function useDebouncedCallback<T extends any[], R>(
  callback: (...args: T) => Promise<R> | R,
  delay: number = 500
): (...args: T) => Promise<R> {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const debouncedFn = useCallback(
    (...args: T): Promise<R> => {
      return new Promise<R>((resolve) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(async () => {
          try {
            const result = callback(...args);
            // Handle both Promise and non-Promise returns
            if (result instanceof Promise) {
              const awaitedResult = await result;
              resolve(awaitedResult);
            } else {
              resolve(result as R);
            }
          } catch (error) {
            console.error("Error in debounced callback:", error);
            throw error;
          }
        }, delay);
      });
    },
    [callback, delay]
  );
  
  return debouncedFn;
}

/**
 * A hook that debounces a value
 * 
 * @param value The value to debounce
 * @param delay Delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
