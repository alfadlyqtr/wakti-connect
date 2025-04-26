
import { supabase } from "@/integrations/supabase/client";
import { StaffMember, CreateStaffParams } from "../types";

export class StaffRepository {
  /**
   * Fetches all staff members for the current business
   */
  async fetchStaffMembers(): Promise<StaffMember[]> {
    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session");
      }
      
      // Fetch staff members
      const { data, error } = await supabase
        .from('business_staff')
        .select(`
          *,
          profile:profiles(full_name, avatar_url)
        `)
        .eq('business_id', session.user.id)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Map to StaffMember type
      return (data || []).map(item => ({
        id: item.id,
        staff_id: item.staff_id,
        business_id: item.business_id,
        name: item.name,
        email: item.email || '',
        position: item.position || '',
        role: item.role || 'staff',
        status: item.status || 'active',
        is_service_provider: item.is_service_provider || false,
        permissions: item.permissions || {},
        staff_number: item.staff_number || '',
        profile_image_url: item.profile_image_url,
        created_at: item.created_at,
        profile: item.profile
      }));
      
    } catch (error) {
      console.error("Error fetching staff members:", error);
      throw error;
    }
  }
  
  /**
   * Creates a new staff member
   */
  async createStaffMember(params: CreateStaffParams): Promise<StaffMember> {
    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session");
      }
      
      // Get business details for staff creation
      const { data: businessProfile } = await supabase
        .from('profiles')
        .select('business_name, full_name')
        .eq('id', session.user.id)
        .single();
        
      if (!businessProfile) {
        throw new Error("Business profile not found");
      }
      
      // Determine if they already have an account
      let staffUserId = null;
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', params.email)
        .maybeSingle();
      
      if (existingUser) {
        staffUserId = existingUser.id;
      } else if (params.password) {
        // Create a new user account if they don't exist and password was provided
        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
          email: params.email,
          password: params.password,
          options: {
            data: {
              full_name: params.fullName,
              account_type: 'staff',
              business_id: session.user.id
            }
          }
        });
        
        if (signUpError) throw signUpError;
        staffUserId = newUser.user?.id;
      } else {
        throw new Error("Cannot create staff without existing account or password");
      }
      
      // Create staff entry
      const staffData = {
        business_id: session.user.id,
        staff_id: staffUserId,
        name: params.fullName,
        email: params.email,
        position: params.position || null,
        role: params.isCoAdmin ? 'co-admin' : 'staff',
        status: 'active',
        is_service_provider: params.isServiceProvider,
        permissions: params.permissions,
        business_name: businessProfile.business_name || businessProfile.full_name
      };
      
      const { data: newStaff, error } = await supabase
        .from('business_staff')
        .insert(staffData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Add to contacts if requested
      if (params.addToContacts) {
        await this.addStaffToContacts(session.user.id, staffUserId, newStaff.id);
      }
      
      // Upload avatar if provided
      if (params.avatar) {
        const avatarUrl = await this.uploadStaffAvatar(newStaff.id, params.avatar);
        
        if (avatarUrl) {
          await supabase
            .from('business_staff')
            .update({ profile_image_url: avatarUrl })
            .eq('id', newStaff.id);
            
          newStaff.profile_image_url = avatarUrl;
        }
      }
      
      return {
        id: newStaff.id,
        staff_id: newStaff.staff_id,
        business_id: newStaff.business_id,
        name: newStaff.name,
        email: newStaff.email || '',
        position: newStaff.position || '',
        role: newStaff.role || 'staff',
        status: newStaff.status || 'active',
        is_service_provider: newStaff.is_service_provider || false,
        permissions: newStaff.permissions || {},
        staff_number: newStaff.staff_number || '',
        profile_image_url: newStaff.profile_image_url,
        created_at: newStaff.created_at,
        profile: null
      };
      
    } catch (error) {
      console.error("Error creating staff member:", error);
      throw error;
    }
  }
  
  /**
   * Adds staff member to contacts
   */
  private async addStaffToContacts(
    businessId: string, 
    staffId: string, 
    staffRelationId: string
  ): Promise<void> {
    try {
      // Create contacts in both directions
      await supabase.rpc('update_existing_staff_contacts');
    } catch (error) {
      console.error("Error adding staff to contacts:", error);
      // Non-critical error, don't throw
    }
  }
  
  /**
   * Uploads a staff avatar image
   */
  private async uploadStaffAvatar(staffId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `staff-avatars/${staffId}-${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading staff avatar:", error);
      return null;
    }
  }
  
  /**
   * Updates a staff member's status (active/suspended)
   */
  async updateStaffStatus(staffId: string, newStatus: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('business_staff')
        .update({ status: newStatus })
        .eq('id', staffId);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating staff status:", error);
      return false;
    }
  }
  
  /**
   * Deletes a staff member (soft delete)
   */
  async deleteStaffMember(staffId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('business_staff')
        .update({ status: 'deleted' })
        .eq('id', staffId);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting staff member:", error);
      return false;
    }
  }
}

export const staffRepository = new StaffRepository();
