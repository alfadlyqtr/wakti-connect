
import { renderHook, act, waitFor } from '@testing-library/react';
import { useStaffMembers } from '../useStaffMembers';
import { supabase } from '@/integrations/supabase/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { toast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      refreshSession: jest.fn(),
    },
    functions: {
      invoke: jest.fn(),
    },
  },
}));

jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

// Wrapper for the hook to provide react-query context
const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useStaffMembers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock implementations
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user-id' },
          access_token: 'test-token',
        },
      },
      error: null,
    });
  });

  it('should return loading state initially', async () => {
    // Mock a pending API call
    (supabase.functions.invoke as jest.Mock).mockResolvedValue(
      new Promise(() => {})
    );

    const { result } = renderHook(() => useStaffMembers(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.staffMembers).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('should fetch staff members successfully', async () => {
    // Mock successful response
    const mockStaffMembers = [
      {
        id: 'staff-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'staff',
      },
    ];

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        staffMembers: mockStaffMembers,
      },
      error: null,
    });

    const { result } = renderHook(() => useStaffMembers(), {
      wrapper,
    });

    // Wait for the hook to finish fetching
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.staffMembers).toEqual(mockStaffMembers);
    expect(result.current.error).toBeNull();
    expect(result.current.authError).toBe(false);
  });

  it('should handle fetch error correctly', async () => {
    // Mock error response
    const mockError = new Error('Failed to fetch staff members');
    (supabase.functions.invoke as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useStaffMembers(), {
      wrapper,
    });

    // Wait for the hook to finish attempting to fetch
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.staffMembers).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error loading staff members',
        variant: 'destructive',
      })
    );
  });

  it('should handle authentication error correctly', async () => {
    // Mock auth error
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: { message: 'Not authenticated' },
    });

    const { result } = renderHook(() => useStaffMembers(), {
      wrapper,
    });

    // Wait for the hook to finish attempting to fetch
    await waitFor(() => expect(result.current.authError).toBe(true));

    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error loading staff members',
        variant: 'destructive',
      })
    );
  });

  it('should handle edge function error correctly', async () => {
    // Mock edge function error
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      error: { message: 'Edge function error', code: 500 },
      data: null,
    });

    const { result } = renderHook(() => useStaffMembers(), {
      wrapper,
    });

    // Wait for the hook to finish attempting to fetch
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeTruthy();
    expect(toast).toHaveBeenCalled();
  });

  it('should handle edge function 401 error correctly', async () => {
    // Mock edge function unauthorized error
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      error: { message: 'Unauthorized', code: 401 },
      data: null,
    });
    
    // Mock successful token refresh
    (supabase.auth.refreshSession as jest.Mock).mockResolvedValue({
      error: null,
    });

    const { result } = renderHook(() => useStaffMembers(), {
      wrapper,
    });

    // Wait for the hook to finish attempting to fetch
    await waitFor(() => expect(result.current.authError).toBe(true));

    expect(supabase.auth.refreshSession).toHaveBeenCalled();
  });

  it('should refetch when handleManualRefetch is called', async () => {
    // Mock successful response
    const mockStaffMembers = [
      {
        id: 'staff-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'staff',
      },
    ];

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        staffMembers: mockStaffMembers,
      },
      error: null,
    });

    const { result } = renderHook(() => useStaffMembers(), {
      wrapper,
    });

    // Wait for the initial fetch to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Reset the mock to track the refetch
    jest.clearAllMocks();

    // Call refetch
    act(() => {
      result.current.handleManualRefetch();
    });

    // Verify that the refetch was triggered
    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(supabase.functions.invoke).toHaveBeenCalled();
  });
});
