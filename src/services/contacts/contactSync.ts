
import { supabase } from '@/integrations/supabase/client';
import { getStaffBusinessId } from '@/utils/staffUtils';
import { toast } from '@/components/ui/use-toast';

/**
 * Synchronizes staff and business contacts
 * Ensures staff members can communicate with the business owner and other staff members
 */
export async function syncStaffBusinessContacts() {
  try {
    const { data: result, error } = await supabase.functions.invoke('sync-staff-contacts');
    
    if (error) {
      console.error('Error syncing staff contacts:', error);
      throw error;
    }
    
    return result;
  } catch (error) {
    console.error('Error syncing staff contacts:', error);
    throw error;
  }
}

/**
 * Forcibly synchronizes staff contacts
 * This is a more direct method used when regular sync fails
 */
export async function forceSyncStaffContacts() {
  try {
    const { data: result, error } = await supabase.functions.invoke('force-sync-staff-contacts');
    
    if (error) {
      console.error('Error force syncing staff contacts:', error);
      throw error;
    }
    
    return result;
  } catch (error) {
    console.error('Error force syncing staff contacts:', error);
    throw error;
  }
}

/**
 * Ensures that staff contacts are properly established
 * Used when setting up a new staff member
 */
export async function ensureStaffContacts() {
  try {
    const businessId = await getStaffBusinessId();
    if (!businessId) return;
    
    const { data, error } = await supabase
      .from('user_contacts')
      .select('*')
      .eq('staff_relation_id', businessId)
      .limit(1);
      
    if (error) throw error;
    
    // If no staff contacts are found, sync them
    if (!data || data.length === 0) {
      await syncStaffBusinessContacts();
    }
  } catch (error) {
    console.error('Error ensuring staff contacts:', error);
    // Silent failure - will try again next time
  }
}

/**
 * Gets the auto-add staff setting
 */
export async function getAutoAddStaffSetting(): Promise<boolean> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('auto_add_staff_to_contacts')
      .single();
      
    if (error) throw error;
    
    // Default to true if not set
    return profile?.auto_add_staff_to_contacts ?? true;
  } catch (error) {
    console.error('Error getting auto-add staff setting:', error);
    return true; // Default to true on error
  }
}
