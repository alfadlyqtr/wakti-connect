
import { renderHook } from '@testing-library/react';
import { useStaffStatus } from '../useStaffStatus';
import { supabase } from '@/integrations/supabase/client';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { createWrapper } from '@/test-utils/test-wrapper';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn()
    }))
  }
}));

describe('useStaffStatus', () => {
  const wrapper = createWrapper();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state initially', () => {
    const { result } = renderHook(() => useStaffStatus(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it('returns staff status when successful', async () => {
    const mockData = {
      id: '123',
      business_id: 'bus123',
      staff_id: 'staff123',
      status: 'active'
    };

    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: mockData, error: null })
    }));

    const { result } = renderHook(() => useStaffStatus(), { wrapper });

    // Use a promise to wait for the async operations to complete
    await new Promise(process.nextTick);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.staffRelationId).toBe('123');
  });

  it('handles errors gracefully', async () => {
    const mockError = new Error('Failed to fetch staff status');

    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockRejectedValue(mockError)
    }));

    const { result } = renderHook(() => useStaffStatus(), { wrapper });

    // Use a promise to wait for the async operations to complete
    await new Promise(process.nextTick);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeTruthy();
  });
});
