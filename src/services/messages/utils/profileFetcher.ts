
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, StaffProfile } from "@/types/message.types";

/**
 * Fetches user profiles for message senders/recipients
 * @param userIds Array of user IDs to fetch profiles for
 * @returns Map of user IDs to profile data
 */
export const fetchUserProfiles = async (userIds: string[]): Promise<Map<string, UserProfile>> => {
  const uniqueIds = [...new Set(userIds)].filter(id => id);
  
  if (uniqueIds.length === 0) return new Map();
  
  try {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, display_name, business_name, avatar_url')
      .in('id', uniqueIds);
      
    // Create a map of profiles for easy lookup
    const profilesMap = new Map();
    if (profilesData) {
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
    }
    
    return profilesMap;
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    return new Map();
  }
};

/**
 * Fetches staff profiles for message senders/recipients using RPC function
 * @param userIds Array of user IDs to fetch staff profiles for
 * @returns Object mapping user IDs to staff profile data
 */
export const fetchStaffProfiles = async (userIds: string[]): Promise<Record<string, StaffProfile>> => {
  const uniqueIds = [...new Set(userIds)].filter(id => id);
  
  if (uniqueIds.length === 0) return {};
  
  try {
    // Use the RPC function for a more efficient query
    const { data: staffData, error } = await supabase
      .rpc('get_active_staff_profiles', { ids: uniqueIds });
    
    console.log("✅ RPC returned staffData:", staffData?.length, staffData);
    
    if (error) {
      console.error("❌ Error fetching staff profiles via RPC:", error);
      return {};
    }
    
    const staffProfiles: Record<string, StaffProfile> = {};
    if (staffData && Array.isArray(staffData)) {
      staffData.forEach(staff => {
        if (staff.staff_id) {
          staffProfiles[staff.staff_id] = {
            id: staff.staff_id,
            name: staff.name,
            profile_image_url: staff.profile_image_url
          };
        }
      });
    }
    
    return staffProfiles;
  } catch (error) {
    console.error("❌ Unexpected error in fetchStaffProfiles:", error);
    return {};
  }
};
