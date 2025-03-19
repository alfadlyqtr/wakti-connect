
import { supabase } from "@/integrations/supabase/client";
import { fromTable as dynamicFromTable } from "@/integrations/supabase/helper";

/**
 * Helper function to perform a more flexible select from a table
 * @param tableName The name of the table to query
 * @returns A database query builder
 */
export function fromTable(tableName: string) {
  return dynamicFromTable(tableName);
}

/**
 * Check if a table exists in the database
 * @param tableName The name of the table to check
 * @returns A boolean indicating if the table exists
 */
export async function checkIfTableExists(tableName: string): Promise<boolean> {
  try {
    // Use RPC to check if table exists
    const { data, error } = await supabase.rpc('check_table_exists', { table_name: tableName });
    
    if (error) {
      console.error(`Error checking if table '${tableName}' exists:`, error);
      return false;
    }
    
    return data === true;
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
