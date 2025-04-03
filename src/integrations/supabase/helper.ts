
// Add common helper functions for Supabase

import { supabase } from './client';

// Create a type-safe version of the supabase client that uses the database schema
export const fromTable = (tableName: string) => {
  return supabase.from(tableName);
};

export default { fromTable };
