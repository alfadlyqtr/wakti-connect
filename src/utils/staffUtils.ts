import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/user";
import { toast } from "@/components/ui/use-toast";

// Cache for staff permissions to minimize DB calls
let staffPermissionsCache: Record<string, any> | null = null;
let staffBusinessIdCache: string | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const clearStaffCache = async () => {
  staffPermissionsCache = null;
  staffBusinessIdCache = null;
  lastCacheTime = 0;
  return true;
};

export const getStaffPermissions = async (): Promise<Record<string, boolean>> => {
  try {
    // Check if we have a recent cache
    const now = Date.now();
    if (staffPermissionsCache && (now - lastCacheTime < CACHE_TTL)) {
      return staffPermissionsCache;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not logged in');
    }
    
    const { data, error } = await supabase
      .from('business_staff')
      .select('permissions, role')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching staff permissions:', error);
      throw error;
    }
    
    if (!data) {
      console.warn('No staff record found for current user');
      return {};
    }
    
    // Store in cache
    staffPermissionsCache = data.permissions || {};
    lastCacheTime = now;
    
    // Add role-based permissions
    if (data.role === 'co-admin') {
      staffPermissionsCache.can_manage_tasks = true;
      staffPermissionsCache.can_view_analytics = true;
      staffPermissionsCache.can_manage_bookings = true;
    }
    
    return staffPermissionsCache;
  } catch (error) {
    console.error('Error in getStaffPermissions:', error);
    return {};
  }
};

export const getStaffBusinessId = async (): Promise<string | null> => {
  try {
    // Check if we have a cached value
    const now = Date.now();
    if (staffBusinessIdCache && (now - lastCacheTime < CACHE_TTL)) {
      return staffBusinessIdCache;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not logged in');
    }
    
    const { data, error } = await supabase
      .from('business_staff')
      .select('business_id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching business ID:', error);
      throw error;
    }
    
    if (!data) {
      console.warn('No staff record found for current user');
      return null;
    }
    
    // Store in cache
    staffBusinessIdCache = data.business_id;
    
    return data.business_id;
  } catch (error) {
    console.error('Error in getStaffBusinessId:', error);
    return null;
  }
};

export const getUserRole = async (): Promise<UserRole> => {
  try {
    // First check if user is a business owner
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .maybeSingle();
      
    // If they are a business account, they're a business owner
    if (profile?.account_type === 'business') {
      return 'business';
    }
    
    // Next, check if they're staff
    const { data: staffData } = await supabase
      .from('business_staff')
      .select('id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    // If they have a staff record, they're staff
    if (staffData) {
      return 'staff';
    }
    
    // Otherwise, return their account type
    return (profile?.account_type || 'free') as UserRole;
  } catch (error) {
    console.error('Error determining user role:', error);
    return 'free';
  }
};
