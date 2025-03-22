
import { createClient } from '@supabase/supabase-js';

// Create a mock Supabase client that matches the required API shape
const createMockSupabaseClient = () => {
  // Create a chainable response to handle method chaining
  const createChainableResponse = () => {
    const response: any = {
      // Data method
      data: null,
      error: null,
      // Promise chaining
      then: (callback: any) => Promise.resolve({ data: null, error: null }).then(callback),
    };

    // Basic chainable methods
    const chainableMethods = ['select', 'limit', 'single', 'maybeSingle', 'csv', 'throwOnError'];
    chainableMethods.forEach(method => {
      response[method] = () => createChainableResponse();
    });

    // Filter methods
    const filterMethods = ['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'like', 'ilike', 'in', 'is', 'not', 'or', 'and'];
    filterMethods.forEach(method => {
      response[method] = () => createChainableResponse();
    });

    // Order methods
    response.order = () => createChainableResponse();
    response.range = () => createChainableResponse();

    return response;
  };

  // Table query builder
  const createQueryBuilder = () => {
    const builder: any = {};
    
    // Basic table operations
    builder.select = () => createChainableResponse();
    builder.insert = () => createChainableResponse();
    builder.update = () => createChainableResponse();
    builder.upsert = () => createChainableResponse();
    builder.delete = () => createChainableResponse();
    
    return builder;
  };

  // Create a mock supabase client with the required structure
  return {
    // Auth methods
    auth: {
      getSession: () => Promise.resolve({ 
        data: { 
          session: { 
            user: { 
              id: 'mock-user-id', 
              email: 'user@example.com', 
              user_metadata: { 
                full_name: 'Mock User',
                display_name: 'Mock',
                account_type: 'free',
                business_name: 'Mock Business'
              }, 
              app_metadata: { provider: 'email' } 
            } 
          } 
        }, 
        error: null 
      }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ 
        data: { 
          user: { 
            id: 'mock-user-id', 
            email: 'user@example.com',
            user_metadata: {
              full_name: 'Mock User',
              display_name: 'Mock',
              account_type: 'free',
              business_name: 'Mock Business'
            },
            app_metadata: { provider: 'email' }
          },
          session: { 
            user: { 
              id: 'mock-user-id', 
              email: 'user@example.com',
              access_token: 'mock-token',
              user_metadata: {
                full_name: 'Mock User',
                display_name: 'Mock',
                account_type: 'free',
                business_name: 'Mock Business'
              },
              app_metadata: { provider: 'email' }
            } 
          }
        }, 
        error: null 
      }),
      signInWithOAuth: () => Promise.resolve({ data: { provider: 'google' }, error: null }),
      signUp: () => Promise.resolve({ 
        data: { 
          user: { 
            id: 'mock-user-id', 
            email: 'user@example.com',
            user_metadata: {
              full_name: 'Mock User',
              display_name: 'Mock',
              account_type: 'free',
              business_name: 'Mock Business'
            },
            app_metadata: { provider: 'email' }
          } 
        }, 
        error: null 
      }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ 
        data: { 
          user: { 
            id: 'mock-user-id', 
            email: 'user@example.com',
            user_metadata: {
              full_name: 'Mock User',
              display_name: 'Mock',
              account_type: 'free',
              business_name: 'Mock Business'
            },
            app_metadata: { provider: 'email' }
          } 
        }, 
        error: null 
      }),
      verifyOtp: () => Promise.resolve({ error: null }),
      resend: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ 
        data: { 
          user: { 
            id: 'mock-user-id', 
            email: 'user@example.com',
            user_metadata: {
              full_name: 'Mock User',
              display_name: 'Mock',
              account_type: 'free',
              business_name: 'Mock Business'
            },
            app_metadata: { provider: 'email' }
          } 
        }, 
        error: null 
      }),
      admin: {
        createUser: () => Promise.resolve({ data: null, error: null }),
        deleteUser: () => Promise.resolve({ data: null, error: null }),
      }
    },
    
    // Storage methods
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: 'mock-path' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'mock-url' } }),
        remove: () => Promise.resolve({ error: null }),
        listBuckets: () => Promise.resolve({ data: [], error: null }),
      }),
    },
    
    // Realtime methods
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    }),
    removeChannel: () => Promise.resolve(),
    
    // RPC methods
    rpc: () => Promise.resolve({ data: null, error: null }),
    
    // Table operations
    from: () => createQueryBuilder(),
  };
};

// Export the mock client
export const supabase = createMockSupabaseClient();
