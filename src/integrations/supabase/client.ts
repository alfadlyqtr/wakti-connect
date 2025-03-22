
import { createClient } from '@supabase/supabase-js';

// Create a placeholder for the supabase client that mocks all the required methods
const createMockSupabaseClient = () => {
  // Create a base function to return in the chain
  const chainableFunction = () => {
    const obj = {
      // Data query methods
      select: () => obj,
      insert: () => obj,
      update: () => obj,
      upsert: () => obj,
      delete: () => obj,
      eq: () => obj,
      neq: () => obj,
      gt: () => obj,
      lt: () => obj,
      gte: () => obj,
      lte: () => obj,
      like: () => obj,
      ilike: () => obj,
      in: () => obj,
      is: () => obj,
      or: () => obj,
      and: () => obj,
      order: () => obj,
      limit: () => obj,
      range: () => obj,
      single: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      throwOnError: () => Promise.resolve({ data: null, error: null }),
      then: (callback: any) => Promise.resolve({ data: null, error: null }).then(callback),
    };
    return obj;
  };

  // Create a mock supabase client
  return {
    // Auth methods
    auth: {
      getSession: () => Promise.resolve({ data: { session: { user: { id: 'mock-user-id' } } }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: { id: 'mock-user-id' } }, error: null }),
      signInWithOAuth: () => Promise.resolve({ data: { provider: 'google' }, error: null }),
      signUp: () => Promise.resolve({ data: { user: { id: 'mock-user-id' } }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ data: { user: { id: 'mock-user-id' } }, error: null }),
      verifyOtp: () => Promise.resolve({ error: null }),
      resend: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: { id: 'mock-user-id' } }, error: null }),
    },
    
    // Storage methods
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: 'mock-path' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'mock-url' } }),
        remove: () => Promise.resolve({ error: null }),
      }),
    },
    
    // Realtime methods
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    }),
    removeChannel: () => Promise.resolve(),
    
    // RPC methods
    rpc: (name: string) => Promise.resolve({ data: null, error: null }),
    
    // Table operation methods
    from: (table: string) => chainableFunction(),
  };
};

// Export the mock client
export const supabase = createMockSupabaseClient();
