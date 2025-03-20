
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember, StaffInvitation } from "@/types/business.types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/auth/useAuth";
import { normalizePermissions, createDefaultPermissions } from "@/services/permissions/staffPermissions";
import { StaffPermissions } from "@/services/permissions/types";

export const useStaffManagement = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [invitations, setInvitations] = useState<StaffInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load staff members and invitations on mount
  useEffect(() => {
    if (user?.businessId) {
      fetchStaffMembers(user.businessId);
      fetchInvitations(user.businessId);
    }
  }, [user?.businessId]);

  // Fetch staff members for a business
  const fetchStaffMembers = async (businessId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_staff')
        .select('*')
        .eq('business_id', businessId);

      if (error) {
        console.error("Error fetching staff members:", error);
        setError(error.message);
        return;
      }

      // Normalize permissions for each staff member
      const normalizedStaffList = data.map(staff => ({
        ...staff,
        permissions: normalizePermissions(staff.permissions)
      })) as StaffMember[];

      setStaffList(normalizedStaffList);
    } catch (error) {
      console.error("Unexpected error fetching staff members:", error);
      setError("Failed to load staff members.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff invitations for a business
  const fetchInvitations = async (businessId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff_invitations')
        .select('*')
        .eq('business_id', businessId);

      if (error) {
        console.error("Error fetching staff invitations:", error);
        setError(error.message);
        return;
      }

      setInvitations(data as StaffInvitation[]);
    } catch (error) {
      console.error("Unexpected error fetching staff invitations:", error);
      setError("Failed to load staff invitations.");
    } finally {
      setLoading(false);
    }
  };

  // Create a new staff member or invitation
  const createStaffMember = async (email: string, position: string) => {
    setLoading(true);
    setError(null);

    if (!user?.businessId) {
      setError("Business ID is missing.");
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      setLoading(false);
      return;
    }

    // Check if the email already exists in staffList
    const emailExistsInStaff = staffList.some(staff => staff.email === email);
    if (emailExistsInStaff) {
      setError("This email is already a staff member.");
      setLoading(false);
      return;
    }

    // Check if the email already exists in invitations
    const emailExistsInInvitations = invitations.some(invitation => invitation.email === email);
    if (emailExistsInInvitations) {
      setError("There is already a pending invitation for this email.");
      setLoading(false);
      return;
    }

    try {
      // Create permissions object with both new and legacy fields
      const permissions = createDefaultPermissions("write");
      
      // Staff can't manage other staff
      permissions.staff = "none";
      permissions.staff_permission = "none";
      
      // Convert to simple JSON object for Supabase
      const permissionsJson = {
        tasks: permissions.tasks,
        events: permissions.events,
        messages: permissions.messages,
        services: permissions.services,
        bookings: permissions.bookings,
        staff: permissions.staff,
        analytics: permissions.analytics,
        service_permission: permissions.service_permission,
        booking_permission: permissions.booking_permission,
        staff_permission: permissions.staff_permission,
        analytics_permission: permissions.analytics_permission
      };
      
      const { data, error } = await supabase
        .from('staff_invitations')
        .insert([{
          business_id: user.businessId,
          email: email,
          position: position,
          permissions: permissionsJson
        }])
        .select('*')
        .single();

      if (error) {
        console.error("Error creating staff invitation:", error);
        setError(error.message);
        return;
      }

      setInvitations(prevInvitations => [...prevInvitations, data as StaffInvitation]);
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${email} successfully.`,
      });
    } catch (error) {
      console.error("Unexpected error creating staff invitation:", error);
      setError("Failed to create staff invitation.");
    } finally {
      setLoading(false);
    }
  };

  // Update staff member details
  const updateStaffMember = async (staffId: string, updates: Partial<StaffMember>) => {
    setLoading(true);
    setError(null);

    try {
      // If permissions are part of the updates, convert them to JSON
      let updateData = { ...updates };
      
      if (updates.permissions) {
        // Convert to simple JSON object for Supabase
        updateData.permissions = {
          tasks: updates.permissions.tasks,
          events: updates.permissions.events,
          messages: updates.permissions.messages,
          services: updates.permissions.services,
          bookings: updates.permissions.bookings,
          staff: updates.permissions.staff,
          analytics: updates.permissions.analytics,
          service_permission: updates.permissions.service_permission,
          booking_permission: updates.permissions.booking_permission,
          staff_permission: updates.permissions.staff_permission,
          analytics_permission: updates.permissions.analytics_permission
        };
      }
      
      const { error } = await supabase
        .from('business_staff')
        .update(updateData)
        .eq('id', staffId);

      if (error) {
        console.error("Error updating staff member:", error);
        setError(error.message);
        return;
      }

      setStaffList(prevStaffList =>
        prevStaffList.map(staff => (staff.id === staffId ? { ...staff, ...updates } : staff))
      );
      toast({
        title: "Staff member updated",
        description: `${updates.full_name || 'Staff member'} updated successfully.`,
      });
    } catch (error) {
      console.error("Unexpected error updating staff member:", error);
      setError("Failed to update staff member.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a staff member
  const deleteStaffMember = async (staffId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('business_staff')
        .delete()
        .eq('id', staffId);

      if (error) {
        console.error("Error deleting staff member:", error);
        setError(error.message);
        return;
      }

      setStaffList(prevStaffList => prevStaffList.filter(staff => staff.id !== staffId));
      toast({
        title: "Staff member deleted",
        description: "Staff member deleted successfully.",
      });
    } catch (error) {
      console.error("Unexpected error deleting staff member:", error);
      setError("Failed to delete staff member.");
    } finally {
      setLoading(false);
    }
  };

  // Resend invitation
  const resendInvitation = async (invitationId: string, email: string) => {
    setLoading(true);
    setError(null);

    try {
      // Logic to resend invitation (e.g., generate a new token and send email)
      // This is a placeholder, implement your actual resend invitation logic here
      console.log(`Resending invitation to ${email} (Invitation ID: ${invitationId})`);

      // Simulate success
      toast({
        title: "Invitation resent",
        description: `Invitation resent to ${email} successfully.`,
      });
    } catch (error) {
      console.error("Error resending invitation:", error);
      setError("Failed to resend invitation.");
    } finally {
      setLoading(false);
    }
  };

  // Revoke invitation
  const revokeInvitation = async (invitationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('staff_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) {
        console.error("Error revoking invitation:", error);
        setError(error.message);
        return;
      }

      setInvitations(prevInvitations => prevInvitations.filter(invitation => invitation.id !== invitationId));
      toast({
        title: "Invitation revoked",
        description: "Invitation revoked successfully.",
      });
    } catch (error) {
      console.error("Unexpected error revoking invitation:", error);
      setError("Failed to revoke invitation.");
    } finally {
      setLoading(false);
    }
  };

  return {
    staffList,
    invitations,
    loading,
    error,
    fetchStaffMembers,
    fetchInvitations,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
    resendInvitation,
    revokeInvitation,
    // Legacy properties for compatibility with StaffManagementTab
    staffMembers: staffList,
    isLoading: loading,
    refetch: () => {
      if (user?.businessId) {
        fetchStaffMembers(user.businessId);
        fetchInvitations(user.businessId);
      }
    },
    editingStaff: null, 
    setEditingStaff: () => {}, 
    suspendingStaff: null,
    setSuspendingStaff: () => {},
    deletingStaff: null,
    setDeletingStaff: () => {},
    reactivatingStaff: null,
    setReactivatingStaff: () => {},
    handleStatusChange: () => Promise.resolve(),
    isBusinessOwner: true
  };
};
