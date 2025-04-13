
import { supabase } from '@/lib/supabase';

/**
 * Helper function to access Supabase tables with better type safety
 * @param tableName The name of the table to query
 * @returns A query builder for the specified table
 */
export const fromTable = (tableName: string) => {
  return supabase.from(tableName);
};

/**
 * Tests if a Supabase edge function is available and responding
 * @param functionName Name of the edge function to test
 * @returns Promise<boolean> True if the function is available, false otherwise
 */
export const testEdgeFunction = async (functionName: string): Promise<boolean> => {
  try {
    // Simple ping to test connection
    const { data, error } = await supabase.functions.invoke(functionName, {
      method: 'GET' // Changed from 'OPTIONS' to 'GET' to fix type error
    });
    
    // If we got a response without error, the function is available
    return !error;
  } catch (err) {
    console.error(`Error testing edge function ${functionName}:`, err);
    return false;
  }
};
