
// Helper functions for Supabase API

/**
 * This is a workaround to allow typing newly created tables that aren't yet in generated types
 */
export const fromTable = <T = any>(tableName: string) => {
  return {
    select: (query = '*') => ({
      table: tableName,
      query,
      type: 'select' as const,
    }),
    insert: (values: any) => ({
      table: tableName,
      values,
      type: 'insert' as const,
    }),
    update: (values: any) => ({
      table: tableName,
      values,
      type: 'update' as const,
    }),
    delete: () => ({
      table: tableName,
      type: 'delete' as const,
    }),
  };
};
