
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a table exists in the database
 * @param tableName The name of the table to check
 * @returns A boolean indicating if the table exists
 */
export async function checkIfTableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('count(*)', { count: 'exact', head: true });
      
    // If the error code is PGRST116, the table doesn't exist
    if (error && error.code === 'PGRST116') {
      console.log(`Table '${tableName}' does not exist`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking if table '${tableName}' exists:`, error);
    return false;
  }
}

/**
 * Safely execute a query that might fail if a table doesn't exist
 * @param tableName The name of the table to query
 * @param queryFn The function that executes the query
 * @param fallbackValue The value to return if the table doesn't exist
 * @returns The result of the query or the fallback value
 */
export async function safeQueryExecution<T>(
  tableName: string, 
  queryFn: () => Promise<T>, 
  fallbackValue: T
): Promise<T> {
  try {
    // Check if the table exists first
    const tableExists = await checkIfTableExists(tableName);
    if (!tableExists) {
      console.log(`Safe query execution: Table '${tableName}' does not exist, returning fallback value`);
      return fallbackValue;
    }
    
    // Execute the query if the table exists
    return await queryFn();
  } catch (error) {
    console.error(`Error in safe query execution for table '${tableName}':`, error);
    return fallbackValue;
  }
}
