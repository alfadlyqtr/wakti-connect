
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useAuthListener } from '../useAuthListener';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn().mockReturnValue({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      }),
    },
  },
}));

// Mock react-router-dom's useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useAuthListener', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets up auth state listener on mount', () => {
    const { supabase } = require('@/integrations/supabase/client');
    
    renderHook(() => useAuthListener());
    
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
  });

  it('unsubscribes from auth state listener on unmount', () => {
    const unsubscribeMock = vi.fn();
    const { supabase } = require('@/integrations/supabase/client');
    
    supabase.auth.onAuthStateChange.mockReturnValueOnce({
      data: {
        subscription: {
          unsubscribe: unsubscribeMock,
        },
      },
    });
    
    const { unmount } = renderHook(() => useAuthListener());
    unmount();
    
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it('navigates to auth page on sign out', () => {
    const { supabase } = require('@/integrations/supabase/client');
    
    // Mock the auth state change callback
    supabase.auth.onAuthStateChange.mockImplementationOnce((callback) => {
      // Immediately call the callback with a sign out event
      callback('SIGNED_OUT', null);
      
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      };
    });
    
    renderHook(() => useAuthListener());
    
    // Verify localStorage item was removed
    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });
});
