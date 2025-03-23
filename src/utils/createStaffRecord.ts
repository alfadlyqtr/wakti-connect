
import { supabase } from "@/integrations/supabase/client";

interface StaffData {
  fullName: string;
  email: string;
  password: string;
  position?: string;
  isServiceProvider?: boolean;
  isCoAdmin?: boolean;
  permissions?: Record<string, boolean>;
}

/**
 * Creates a new staff account and sets up the necessary database records
 */
export const createStaffRecord = async (staffData: StaffData) => {
  try {
    // Get current business ID
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    
    const businessId = session.user.id;
    
    // Check if a co-admin already exists
    if (staffData.isCoAdmin) {
      const { data: coAdmins, error: coAdminError } = await supabase
        .from('business_staff')
        .select('id')
        .eq('business_id', businessId)
        .eq('role', 'co-admin')
        .eq('status', 'active');
        
      if (coAdminError) throw coAdminError;
      
      if (coAdmins && coAdmins.length > 0) {
        throw new Error("Only one Co-Admin is allowed per business");
      }
    }
    
    // Create the auth user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: staffData.email,
      password: staffData.password,
      email_confirm: true,
      user_metadata: {
        full_name: staffData.fullName
      }
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error("Failed to create user account");
    
    // Get business information for generating staff number
    const { data: businessData, error: businessError } = await supabase
      .from('profiles')
      .select('business_name')
      .eq('id', businessId)
      .single();
      
    if (businessError) throw businessError;
    
    // Generate staff number
    const businessName = businessData.business_name || 'BUS';
    const prefix = businessName
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
      
    // Get current staff count for numbering
    const { count, error: countError } = await supabase
      .from('business_staff')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId);
      
    if (countError) throw countError;
    
    const staffNumber = `${prefix}_Staff${String(count || 0).padStart(3, '0')}`;
    
    // Add staff record to business_staff table
    const { data: staffRecord, error: staffError } = await supabase
      .from('business_staff')
      .insert({
        business_id: businessId,
        staff_id: authData.user.id,
        name: staffData.fullName,
        email: staffData.email,
        position: staffData.position || 'Staff Member',
        role: staffData.isCoAdmin ? 'co-admin' : 'staff',
        is_service_provider: staffData.isServiceProvider || false,
        staff_number: staffNumber,
        permissions: staffData.permissions || {
          can_view_tasks: true,
          can_manage_tasks: false,
          can_message_staff: true,
          can_manage_bookings: false,
          can_create_job_cards: false,
          can_track_hours: true,
          can_log_earnings: false,
          can_edit_profile: true,
          can_view_customer_bookings: false,
          can_view_analytics: false
        },
        status: 'active'
      })
      .select()
      .single();
      
    if (staffError) throw staffError;
    
    // Create automatic contact relationship for messaging
    await supabase
      .from('user_contacts')
      .insert({
        user_id: businessId,
        contact_id: authData.user.id,
        status: 'accepted',
        staff_relation_id: staffRecord.id
      });
      
    // Add reverse relationship to automatically add business account to staff contacts
    await supabase
      .from('user_contacts')
      .insert({
        user_id: authData.user.id,
        contact_id: businessId,
        status: 'accepted'
      });
      
    // Also add contacts between existing staff and the new staff member
    const { data: existingStaff, error: existingStaffError } = await supabase
      .from('business_staff')
      .select('staff_id, id')
      .eq('business_id', businessId)
      .neq('staff_id', authData.user.id)
      .eq('status', 'active');
      
    if (existingStaffError) throw existingStaffError;
    
    // Create contact relationships between all staff members
    if (existingStaff && existingStaff.length > 0) {
      const staffContacts = existingStaff.map(staff => ({
        user_id: staff.staff_id,
        contact_id: authData.user.id,
        status: 'accepted',
        staff_relation_id: staffRecord.id
      }));
      
      const reverseStaffContacts = existingStaff.map(staff => ({
        user_id: authData.user.id,
        contact_id: staff.staff_id,
        status: 'accepted',
        staff_relation_id: staff.id
      }));
      
      await supabase
        .from('user_contacts')
        .insert([...staffContacts, ...reverseStaffContacts]);
    }
    
    return staffRecord;
  } catch (error: any) {
    console.error("Error creating staff record:", error);
    throw new Error(error.message || "Failed to create staff account");
  }
};
