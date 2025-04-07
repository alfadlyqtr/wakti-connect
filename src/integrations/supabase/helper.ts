
import { supabase } from './client';
import { Database } from './types';

/**
 * Type-safe helper for accessing Supabase tables
 * 
 * This function wraps the Supabase client's 'from' method to provide better type safety
 * when interacting with database tables.
 * 
 * @param tableName The name of the table to query
 * @returns A query builder for the specified table with proper types
 */
export const fromTable = <T extends keyof Database['public']['Tables']>(tableName: T) => {
  return supabase.from(tableName);
};

/**
 * Safely executes a function that makes a Supabase API call
 * 
 * @param operation A function that makes a Supabase API call
 * @param errorMessage A custom error message to display if the operation fails
 * @returns A Promise that resolves to the data returned by the operation, or throws an error
 */
export const safeSupabaseCall = async <T>(
  operation: () => Promise<{ data: T | null; error: Error | null }>,
  errorMessage = 'Supabase operation failed'
): Promise<T> => {
  try {
    const { data, error } = await operation();
    if (error) throw error;
    if (data === null) throw new Error('No data returned');
    return data;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    throw new Error(errorMessage);
  }
};

/**
 * Validates and tests a Supabase Edge Function connection
 * 
 * @param functionName The name of the Edge Function to test
 * @param testPayload Optional test payload to send to the function
 * @returns A Promise that resolves to true if the function is working, false otherwise
 */
export const testEdgeFunction = async (
  functionName: string,
  testPayload: Record<string, any> = { test: true }
): Promise<boolean> => {
  try {
    console.log(`Testing edge function: ${functionName}`);
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: testPayload
    });
    
    if (error) {
      console.error(`Edge function test failed for ${functionName}:`, error);
      return false;
    }
    
    console.log(`Edge function ${functionName} is working:`, data);
    return true;
  } catch (error) {
    console.error(`Edge function test error for ${functionName}:`, error);
    return false;
  }
};

// Add a utility to check if Supabase is properly initialized
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // A simple query to verify connection
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection check failed:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

export default { fromTable, safeSupabaseCall, testEdgeFunction, checkSupabaseConnection };
