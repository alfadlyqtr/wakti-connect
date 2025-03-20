
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useProfileData } from '../useProfileData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Create a wrapper for the query client
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: { id: 'test-user-id', email: 'test@example.com' }
          }
        }
      }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    single: vi.fn(),
  },
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

describe('useProfileData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return profile data when successfully fetched', async () => {
    // Mock successful profile fetch
    const { supabase } = require('@/integrations/supabase/client');
    supabase.maybeSingle.mockResolvedValueOnce({
      data: {
        account_type: 'individual',
        display_name: 'Test User',
        business_name: null,
        full_name: 'Test User',
        theme_preference: 'dark',
      },
      error: null,
    });

    const { result } = renderHook(() => useProfileData(), {
      wrapper: createWrapper(),
    });

    // Initially should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check results
    expect(result.current.profileData).toEqual({
      account_type: 'individual',
      display_name: 'Test User',
      business_name: null,
      full_name: 'Test User',
      theme_preference: 'dark',
    });
    
    // Verify localStorage was updated
    expect(localStorage.getItem('userRole')).toBe('individual');
  });

  it('should navigate to auth page when no session is found', async () => {
    // Mock no session
    const { supabase } = require('@/integrations/supabase/client');
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null }
    });

    renderHook(() => useProfileData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth');
    });
  });

  it('should attempt to create a profile if not found', async () => {
    // Mock profile not found error
    const { supabase } = require('@/integrations/supabase/client');
    supabase.maybeSingle.mockResolvedValueOnce({
      data: null,
      error: { code: 'PGRST116', message: 'Profile not found' },
    });
    
    // Mock successful profile creation
    supabase.single.mockResolvedValueOnce({
      data: {
        id: 'test-user-id',
        account_type: 'free',
        full_name: 'test',
        display_name: 'test',
      },
      error: null,
    });

    const { result } = renderHook(() => useProfileData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify insert was called with correct data
    expect(supabase.insert).toHaveBeenCalled();
  });
});
