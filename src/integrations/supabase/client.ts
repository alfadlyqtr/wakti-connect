
// Add a temporary placeholder to avoid TypeScript errors
// The real implementation will be added when we install @supabase/supabase-js

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => Promise.resolve({ data: null, error: null }),
    insert: () => ({
      select: () => ({
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  }),
};
