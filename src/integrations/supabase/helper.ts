
import { supabase } from './client';
import { Database } from './types';

// Create a type-safe version of the supabase client that uses the database schema
export const fromTable = <T extends keyof Database['public']['Tables']>(tableName: T) => {
  return supabase.from(tableName);
};

export default { fromTable };
