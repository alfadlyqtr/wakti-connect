import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/user";
import { toast } from "@/components/ui/use-toast";

// Cache for staff permissions to minimize DB calls
let staffPermissionsCache: Record<string, any> | null = null;
let staffBusinessIdCache: string | null = null;
let staffRelationIdCache: string | null = null;
let activeWorkSessionCache: any | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const clearStaffCache = async () => {
  staffPermissionsCache = null;
  staffBusinessIdCache = null;
  staffRelationIdCache = null;
  activeWorkSessionCache = null;
  lastCacheTime = 0;
  return true;
};

/**
 * Check if the current user is a staff member
 */
export const isUserStaff = async (): Promise<boolean> => {
  try {
    // Check if we have a cached value
    if (localStorage.getItem('isStaff') === 'true') {
      return true;
    }
    
    // Otherwise, check the database
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }
    
    const { data } = await supabase
      .from('business_staff')
      .select('id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    const isStaff = !!data;
    
    // Cache the result
    if (isStaff) {
      localStorage.setItem('isStaff', 'true');
    }
    
    return isStaff;
  } catch (error) {
    console.error('Error checking staff status:', error);
    return false;
  }
};

export const getStaffPermissions = async (): Promise<Record<string, boolean>> => {
  try {
    // Check if we have a recent cache
    const now = Date.now();
    if (staffPermissionsCache && (now - lastCacheTime < CACHE_TTL)) {
      return staffPermissionsCache;
    }
    
    // Check localStorage for cached permissions
    const cachedPermissions = localStorage.getItem('staffPermissions');
    if (cachedPermissions && (now - Number(localStorage.getItem('permissionsCacheTime') || 0) < CACHE_TTL)) {
      try {
        staffPermissionsCache = JSON.parse(cachedPermissions);
        return staffPermissionsCache as Record<string, boolean>;
      } catch (e) {
        // If parsing fails, continue with database query
        console.warn('Failed to parse cached permissions');
      }
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
    
    // Also store in localStorage for faster access
    localStorage.setItem('staffPermissions', JSON.stringify(staffPermissionsCache));
    localStorage.setItem('permissionsCacheTime', now.toString());
    
    return staffPermissionsCache;
  } catch (error) {
    console.error('Error in getStaffPermissions:', error);
    return {};
  }
};

export const hasStaffPermission = async (permission: string): Promise<boolean> => {
  const permissions = await getStaffPermissions();
  return !!permissions[permission];
};

export const getStaffBusinessId = async (): Promise<string | null> => {
  try {
    // Check if we have a cached value
    const now = Date.now();
    if (staffBusinessIdCache && (now - lastCacheTime < CACHE_TTL)) {
      return staffBusinessIdCache;
    }
    
    // Check localStorage for cached business ID
    const cachedBusinessId = localStorage.getItem('staffBusinessId');
    if (cachedBusinessId && (now - Number(localStorage.getItem('businessIdCacheTime') || 0) < CACHE_TTL)) {
      staffBusinessIdCache = cachedBusinessId;
      return cachedBusinessId;
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
    lastCacheTime = now;
    
    // Also store in localStorage
    localStorage.setItem('staffBusinessId', data.business_id);
    localStorage.setItem('businessIdCacheTime', now.toString());
    
    return data.business_id;
  } catch (error) {
    console.error('Error in getStaffBusinessId:', error);
    return null;
  }
};

/**
 * Get the staff relation ID for the current user
 */
export const getStaffRelationId = async (): Promise<string | null> => {
  try {
    // Check if we have a cached value
    const now = Date.now();
    if (staffRelationIdCache && (now - lastCacheTime < CACHE_TTL)) {
      return staffRelationIdCache;
    }
    
    // Check localStorage for cached relation ID
    const cachedRelationId = localStorage.getItem('staffRelationId');
    if (cachedRelationId && (now - Number(localStorage.getItem('relationIdCacheTime') || 0) < CACHE_TTL)) {
      staffRelationIdCache = cachedRelationId;
      return cachedRelationId;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not logged in');
    }
    
    const { data, error } = await supabase
      .from('business_staff')
      .select('id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching staff relation ID:', error);
      throw error;
    }
    
    if (!data) {
      console.warn('No staff relation found for current user');
      return null;
    }
    
    // Store in cache
    staffRelationIdCache = data.id;
    lastCacheTime = now;
    
    // Also store in localStorage
    localStorage.setItem('staffRelationId', data.id);
    localStorage.setItem('relationIdCacheTime', now.toString());
    
    return data.id;
  } catch (error) {
    console.error('Error in getStaffRelationId:', error);
    return null;
  }
};

/**
 * Get active work session for the staff member
 */
export const getActiveWorkSession = async (staffRelationId: string): Promise<any | null> => {
  try {
    // Check if we have a cached value
    const now = Date.now();
    if (activeWorkSessionCache && (now - lastCacheTime < CACHE_TTL)) {
      return activeWorkSessionCache;
    }
    
    if (!staffRelationId) {
      throw new Error('Staff relation ID is required');
    }
    
    const { data, error } = await supabase
      .from('staff_work_logs')
      .select('*')
      .eq('staff_relation_id', staffRelationId)
      .is('end_time', null)
      .eq('status', 'active')
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching active work session:', error);
      throw error;
    }
    
    // Store in cache
    activeWorkSessionCache = data;
    lastCacheTime = now;
    
    return data;
  } catch (error) {
    console.error('Error in getActiveWorkSession:', error);
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
