
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a table exists in the database
 * @param tableName The name of the table to check
 * @returns A boolean indicating if the table exists
 */
export async function checkIfTableExists(tableName: string): Promise<boolean> {
  try {
    // Use RPC to check if table exists to avoid type issues with dynamic table names
    const { data, error } = await supabase.rpc('check_table_exists', { table_name: tableName });
    
    if (error) {
      console.error(`Error checking if table '${tableName}' exists:`, error);
      
      // Try an alternative approach with a raw query if RPC fails
      try {
        const { data: tableData, error: countError } = await supabase
          .from('_metadata')
          .select('*')
          .eq('table_name', tableName)
          .maybeSingle();
          
        if (countError) {
          console.error(`Fallback check for table '${tableName}' failed:`, countError);
          return false;
        }
        
        return tableData != null;
      } catch (fallbackError) {
        console.error(`Fallback for table check failed:`, fallbackError);
        return false;
      }
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
