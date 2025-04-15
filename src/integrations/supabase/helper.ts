
import { supabase } from '@/integrations/supabase/client';

/**
 * Tests if a Supabase Edge Function is accessible
 * @param functionName The name of the Edge Function to test
 * @returns Promise<boolean> True if the function responds with 200 status
 */
export const testEdgeFunction = async (functionName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      method: 'GET' // Changed from 'OPTIONS' to valid HTTP method
    });
    
    return !error;
  } catch (e) {
    console.warn(`Error testing edge function ${functionName}:`, e);
    return false;
  }
};

/**
 * Helper function to simplify Supabase table operations
 * Returns a reference to the specified table in the Supabase database
 * @param tableName The name of the table to operate on
 * @returns Supabase query builder for the specified table
 */
export const fromTable = <T extends keyof typeof supabase.from>(tableName: T) => {
  return supabase.from(tableName);
};
