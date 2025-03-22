
import { supabase } from '@/integrations/supabase/client';

export const STAFF_PLAN_LIMITS = {
  free: 0,
  individual: 0,
  business: 6
};

export const CO_ADMIN_LIMIT = 2;

export async function checkStaffLimits(): Promise<{ canAdd: boolean; message?: string }> {
  // Mock implementation - always allow adding staff
  return { canAdd: true };
}

export async function checkCoAdminLimit(businessId?: string): Promise<boolean> {
  // Mock implementation - always allow adding co-admin
  return true;
}
