
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { StaffMember } from "./StaffMemberCard";
import { PermissionLevel, StaffPermissions } from "@/services/permissions/accessControlService";

export const useStaffManagement = () => {
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [suspendingStaff, setSuspendingStaff] = useState<StaffMember | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null);
  const [reactivatingStaff, setReactivatingStaff] = useState<StaffMember | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Helper function to ensure we have a valid permission level
  const getPermissionLevel = (value: any): PermissionLevel => {
    if (value === 'admin' || value === 'write' || value === 'read') {
      return value;
    }
    return 'none';
  };

  // Fetch staff members
  const { data: staffMembers, isLoading, error, refetch } = useQuery({
    queryKey: ['businessStaff'],
    queryFn: async () => {
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (staffError) throw staffError;
      
      // Cast to StaffMember[] type with default values for new fields
      return (staffData || []).map(staff => {
        // Define default permissions
        const defaultPermissions: StaffPermissions = {
          service_permission: 'none',
          booking_permission: 'none',
          staff_permission: 'none',
          analytics_permission: 'none'
        };
        
        // Get permissions from staff.permissions or use defaults
        let permissions = defaultPermissions;
        
        // If staff has a role, set permissions accordingly
        if (staff.role === 'co-admin') {
          permissions = {
            service_permission: 'admin',
            booking_permission: 'admin',
            staff_permission: 'admin',
            analytics_permission: 'admin'
          };
        } else if (staff.role === 'admin') {
          permissions = {
            service_permission: 'admin',
            booking_permission: 'admin',
            staff_permission: 'write',
            analytics_permission: 'admin'
          };
        } else if (staff.permissions && typeof staff.permissions === 'object') {
          const perms = staff.permissions as Record<string, any>;
          
          permissions = {
            service_permission: getPermissionLevel(perms.service_permission),
            booking_permission: getPermissionLevel(perms.booking_permission),
            staff_permission: getPermissionLevel(perms.staff_permission),
            analytics_permission: getPermissionLevel(perms.analytics_permission)
          };
        }
        
        return {
          ...staff,
          staff_number: staff.staff_number || `TEMP_${staff.id.substring(0, 5)}`,
          is_service_provider: staff.is_service_provider || false,
          status: (staff.status as 'active' | 'suspended' | 'deleted') || 'active',
          profile_image_url: staff.profile_image_url || null,
          permissions
        };
      }) as StaffMember[];
    }
  });

  const handleStatusChange = async (staff: StaffMember, newStatus: 'active' | 'suspended' | 'deleted') => {
    try {
      const { error } = await supabase
        .from('business_staff')
        .update({ status: newStatus })
        .eq('id', staff.id);
        
      if (error) throw error;
      
      let message = '';
      switch (newStatus) {
        case 'active':
          message = `${staff.name} has been reactivated`;
          break;
        case 'suspended':
          message = `${staff.name} has been suspended`;
          break;
        case 'deleted':
          message = `${staff.name} has been deleted`;
          break;
      }
      
      toast({
        title: "Staff status updated",
        description: message,
      });
      
      refetch();
    } catch (error) {
      console.error("Error updating staff status:", error);
      toast({
        title: "Error",
        description: "Failed to update staff member status",
        variant: "destructive"
      });
    } finally {
      setSuspendingStaff(null);
      setDeletingStaff(null);
      setReactivatingStaff(null);
    }
  };

  return {
    staffMembers,
    isLoading,
    error,
    refetch,
    editingStaff,
    setEditingStaff,
    suspendingStaff,
    setSuspendingStaff,
    deletingStaff,
    setDeletingStaff,
    reactivatingStaff,
    setReactivatingStaff,
    createDialogOpen,
    setCreateDialogOpen,
    handleStatusChange
  };
};
