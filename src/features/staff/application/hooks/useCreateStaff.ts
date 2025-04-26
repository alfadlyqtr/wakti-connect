
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { staffService } from "../../domain/services/staffService";
import { StaffFormValues } from "../../domain/types";
import { StaffFormSchema } from "../../presentation/components/StaffFormSchema";

export const useCreateStaff = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  
  // Use react-hook-form with zod validation
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(StaffFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      position: "",
      isCoAdmin: false,
      isServiceProvider: false,
      permissions: {
        can_manage_tasks: false,
        can_manage_bookings: false,
        can_track_hours: true,
        can_log_earnings: false,
        can_view_analytics: false,
        can_view_tasks: true,
        can_update_task_status: false,
        can_view_customer_bookings: false,
        can_update_booking_status: false,
        can_create_job_cards: false,
        can_message_staff: true,
        can_edit_profile: true,
        can_update_profile: false
      },
      addToContacts: true
    }
  });
  
  const createStaff = async (data: StaffFormValues) => {
    try {
      setIsCreating(true);
      
      // Extract field data
      const {
        fullName,
        email,
        password,
        position,
        isCoAdmin,
        isServiceProvider,
        permissions,
        avatar,
        addToContacts
      } = data;
      
      // Create the staff member
      const newStaff = await staffService.createStaffMember({
        fullName,
        email,
        password,
        position,
        isCoAdmin,
        isServiceProvider,
        permissions,
        avatar,
        addToContacts
      });
      
      toast({
        title: "Staff Created",
        description: `${fullName} has been added to your staff.`
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error Creating Staff",
        description: error.message || "Failed to create staff member",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  };
  
  const onSubmit = async (values: StaffFormValues) => {
    return await createStaff(values);
  };
  
  return {
    form,
    onSubmit,
    isCreating,
    createStaff
  };
};
