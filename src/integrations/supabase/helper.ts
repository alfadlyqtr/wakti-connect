
import { supabase } from '@/lib/supabase';

/**
 * Tests if a Supabase Edge Function is accessible
 * @param functionName The name of the Edge Function to test
 * @returns Promise<boolean> True if the function responds with 200 status
 */
export const testEdgeFunction = async (functionName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      method: 'OPTIONS'
    });
    
    return !error;
  } catch (e) {
    console.warn(`Error testing edge function ${functionName}:`, e);
    return false;
  }
};
