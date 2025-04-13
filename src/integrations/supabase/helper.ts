
import { supabase } from '@/lib/supabase';

/**
 * Tests if a Supabase edge function is available and responding
 * @param functionName Name of the edge function to test
 * @returns Promise<boolean> True if the function is available, false otherwise
 */
export const testEdgeFunction = async (functionName: string): Promise<boolean> => {
  try {
    // Simple ping to test connection
    const { data, error } = await supabase.functions.invoke(functionName, {
      method: 'OPTIONS'
    });
    
    // If we got a response without error, the function is available
    // Even if it's a CORS preflight response, that means the function exists
    return !error;
  } catch (err) {
    console.error(`Error testing edge function ${functionName}:`, err);
    return false;
  }
};
