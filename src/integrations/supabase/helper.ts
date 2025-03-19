
// Helper functions for Supabase API

import { supabase } from "./client";

/**
 * This is a workaround to allow typing newly created tables that aren't yet in generated types
 * Uses type assertions to handle dynamic table names
 */
export const fromTable = <T = any>(tableName: string) => {
  return {
    select: (query = '*') => {
      // Type assertion to handle dynamic table names
      return supabase.from(tableName as any).select(query) as any;
    },
    insert: (values: any) => {
      // Type assertion to handle dynamic table names
      return supabase.from(tableName as any).insert(values) as any;
    },
    update: (values: any) => {
      // Type assertion to handle dynamic table names
      let query = supabase.from(tableName as any).update(values) as any;
      return query;
    },
    delete: () => {
      // Type assertion to handle dynamic table names
      let query = supabase.from(tableName as any).delete() as any;
      return query;
    },
    upsert: (values: any) => {
      // Type assertion to handle dynamic table names
      return supabase.from(tableName as any).upsert(values) as any;
    },
    // Add other operations as needed
    eq: (column: string, value: any) => {
      return supabase.from(tableName as any).select().eq(column, value) as any;
    }
  };
};
