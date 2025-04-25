
import { renderHook } from '@testing-library/react';
import { useStaffListOperations } from '../useStaffListOperations';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { createWrapper } from '@/test-utils/test-wrapper';

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn()
}));

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn()
    }))
  }
}));

describe('useStaffListOperations', () => {
  const wrapper = createWrapper();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides staff operations functions', () => {
    const { result } = renderHook(() => useStaffListOperations(), { wrapper });

    expect(result.current.deleteStaff).toBeDefined();
    expect(result.current.toggleStaffStatus).toBeDefined();
    expect(result.current.isSyncing).toBeDefined();
    expect(result.current.syncStaffRecords).toBeDefined();
  });

  it('handles staff deletion', async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ data: { id: '123' }, error: null })
    }));

    const { result } = renderHook(() => useStaffListOperations(), { wrapper });

    const deletePromise = result.current.deleteStaff.mutateAsync('123');
    await expect(deletePromise).resolves.not.toThrow();
  });

  it('handles staff status toggle', async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ 
        data: { id: '123', status: 'active' }, 
        error: null 
      })
    }));

    const { result } = renderHook(() => useStaffListOperations(), { wrapper });

    const togglePromise = result.current.toggleStaffStatus.mutateAsync({ 
      staffId: '123', 
      newStatus: 'active' 
    });
    await expect(togglePromise).resolves.not.toThrow();
  });
});

