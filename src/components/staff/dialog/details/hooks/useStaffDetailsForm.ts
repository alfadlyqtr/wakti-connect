
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { QueryClient } from "@tanstack/react-query";
import { editStaffSchema } from "../schemas/staffDetailsSchema";

// Define an interface for the profile data
export interface ProfileData {
  full_name?: string;
  avatar_url?: string;
  email?: string;
  [key: string]: any;
}

// Define an interface for the staff relation data to ensure type safety
export interface StaffRelationData {
  id: string;
  staff_id: string;
  business_id: string;
  name?: string;
  email?: string;
  position?: string;
  role: string;
  is_service_provider: boolean;
  status: string;
  staff_number?: string;
  permissions: any;
  profiles?: ProfileData;
  profile_image_url?: string;
  [key: string]: any;
}

export type EditStaffFormValues = z.infer<typeof editStaffSchema>;

interface UseStaffDetailsFormProps {
  staffId: string | null;
  queryClient: QueryClient;
  onOpenChange: (open: boolean) => void;
}

export const useStaffDetailsForm = ({ 
  staffId, 
  queryClient, 
  onOpenChange 
}: UseStaffDetailsFormProps) => {
  const [staffData, setStaffData] = useState<StaffRelationData | null>(null);
  
  const form = useForm<EditStaffFormValues>({
    resolver: zodResolver(editStaffSchema),
    defaultValues: {
      fullName: "",
      email: "",
      position: "",
      isServiceProvider: false,
      isCoAdmin: false,
      permissions: {
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
      }
    }
  });

  const fetchStaffDetails = async (id: string) => {
    try {
      console.log("Fetching details for staff ID:", id);
      
      // Fetch staff details from business_staff table
      const { data: staffRelation, error: staffError } = await supabase
        .from("business_staff")
        .select(`
          *,
          profiles:staff_id (
            full_name,
            avatar_url,
            email
          )
        `)
        .eq("id", id)
        .single();

      if (staffError) {
        console.error("Error fetching staff relation:", staffError);
        throw staffError;
      }
      
      console.log("Staff relation data:", staffRelation);
      
      if (staffRelation) {
        setStaffData(staffRelation as StaffRelationData);
        
        // Parse permissions if it's a string
        const permissions = typeof staffRelation.permissions === 'string' 
          ? JSON.parse(staffRelation.permissions) 
          : staffRelation.permissions;
        
        // Get profile data safely with optional chaining
        const profileData: ProfileData = staffRelation.profiles || {};

        console.log("Setting form values:", {
          fullName: staffRelation.name || profileData.full_name || "",
          email: staffRelation.email || profileData.email || "",
          position: staffRelation.position || "",
          isServiceProvider: staffRelation.is_service_provider || false,
          isCoAdmin: staffRelation.role === "co-admin",
        });

        // Set form values
        form.reset({
          fullName: staffRelation.name || profileData.full_name || "",
          email: staffRelation.email || profileData.email || "",
          position: staffRelation.position || "",
          isServiceProvider: staffRelation.is_service_provider || false,
          isCoAdmin: staffRelation.role === "co-admin",
          permissions: {
            can_view_tasks: permissions?.can_view_tasks ?? true,
            can_manage_tasks: permissions?.can_manage_tasks ?? false,
            can_message_staff: permissions?.can_message_staff ?? true,
            can_manage_bookings: permissions?.can_manage_bookings ?? false,
            can_create_job_cards: permissions?.can_create_job_cards ?? false,
            can_track_hours: permissions?.can_track_hours ?? true,
            can_log_earnings: permissions?.can_log_earnings ?? false,
            can_edit_profile: permissions?.can_edit_profile ?? true,
            can_view_customer_bookings: permissions?.can_view_customer_bookings ?? false,
            can_view_analytics: permissions?.can_view_analytics ?? false
          }
        });
      }
    } catch (error) {
      console.error("Error fetching staff details:", error);
      toast({
        title: "Error",
        description: "Failed to load staff details. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSaveChanges = async (data: EditStaffFormValues) => {
    if (!staffId || !staffData) return;
    
    try {
      console.log("Saving changes for staff ID:", staffId, data);
      
      // Update permissions and staff info in the staff relation
      const { error: updateError } = await supabase
        .from("business_staff")
        .update({
          name: data.fullName,
          position: data.position,
          role: data.isCoAdmin ? "co-admin" : "staff",
          is_service_provider: data.isServiceProvider,
          permissions: data.permissions,
        })
        .eq("id", staffId);

      if (updateError) throw updateError;

      // If we have a staff_id, also update the user's profile
      if (staffData.staff_id) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: data.fullName,
          })
          .eq("id", staffData.staff_id);

        if (profileError) {
          console.error("Warning: Could not update profile:", profileError);
          // Continue even if profile update fails
        }
      }

      toast({
        title: "Staff Updated",
        description: "Staff member details have been updated successfully.",
        variant: "success",
      });

      // Refresh staff list data
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
      queryClient.invalidateQueries({ queryKey: ["businessStaff"] });
      
      // Close the dialog after successful update
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating staff:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the staff member. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffId || !staffData) return;
    
    try {
      console.log("Deleting staff ID:", staffId);
      
      // Update status to deleted in business_staff table
      const { error: deleteError } = await supabase
        .from("business_staff")
        .update({ status: "deleted" })
        .eq("id", staffId);

      if (deleteError) throw deleteError;

      toast({
        title: "Staff Deleted",
        description: "Staff member has been successfully removed.",
        variant: "success",
      });

      // Refresh staff list
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
      queryClient.invalidateQueries({ queryKey: ["businessStaff"] });
      
      // Close dialogs
      onOpenChange(false);
      return true;
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast({
        title: "Deletion Failed",
        description: "There was an error removing the staff member. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    form,
    staffData,
    setStaffData,
    fetchStaffDetails,
    handleSaveChanges,
    handleDeleteStaff,
  };
};
