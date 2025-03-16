
// Helper functions for Supabase API

import { supabase } from "./client";

/**
 * This is a workaround to allow typing newly created tables that aren't yet in generated types
 */
export const fromTable = <T = any>(tableName: string) => {
  return {
    select: (query = '*') => {
      return supabase.from(tableName).select(query);
    },
    insert: (values: any) => {
      return supabase.from(tableName).insert(values);
    },
    update: (values: any, conditions?: Record<string, any>) => {
      let query = supabase.from(tableName).update(values);
      if (conditions) {
        Object.entries(conditions).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      return query;
    },
    delete: (conditions?: Record<string, any>) => {
      let query = supabase.from(tableName).delete();
      if (conditions) {
        Object.entries(conditions).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      return query;
    },
    upsert: (values: any) => {
      return supabase.from(tableName).upsert(values);
    }
  };
};
