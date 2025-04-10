
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
 * Fetches staff profiles for message senders/recipients
 * @param userIds Array of user IDs to fetch staff profiles for
 * @returns Object mapping user IDs to staff profile data
 */
export const fetchStaffProfiles = async (userIds: string[]): Promise<Record<string, StaffProfile>> => {
  const uniqueIds = [...new Set(userIds)].filter(id => id);
  
  if (uniqueIds.length === 0) return {};
  
  try {
    const staffProfiles: Record<string, StaffProfile> = {};
    
    // Use the official Supabase-supported query without fallback logic
    const { data: staffData, error } = await supabase
      .from('business_staff')
      .select('staff_id, name, profile_image_url')
      .in('staff_id', uniqueIds)
      .eq('status', 'active');
    
    console.log("✅ Clean staff query returned:", staffData?.length, staffData);
    
    if (error) {
      console.error("Error fetching staff profiles:", error);
    } else if (staffData && Array.isArray(staffData)) {
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
    console.error("Error fetching staff profiles:", error);
    return {};
  }
};
