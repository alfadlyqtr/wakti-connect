
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStaffMember } from "@/utils/createStaffRecord";
import { StaffFormSchema, type StaffFormValues } from "@/components/staff/dialog/StaffFormSchema";
import { toast } from "@/components/ui/use-toast";

type CreateStaffParams = Omit<StaffFormValues, "confirmPassword"> & {
  password?: string;
};

export function useCreateStaff() {
  const queryClient = useQueryClient();

  const createStaffMutation = useMutation({
    mutationFn: async (staffData: CreateStaffParams) => {
      // Extract and map data to the correct structure for the API
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
      } = staffData;

      // Create the staff record and handle any permissions
      const result = await createStaffMember({
        name: fullName,
        email,
        password,
        position,
        role: isCoAdmin ? "co-admin" : "staff",
        isServiceProvider,
        permissions: {
          can_manage_tasks: permissions.can_manage_tasks,
          can_manage_bookings: permissions.can_manage_bookings,
          can_track_hours: permissions.can_track_hours,
          can_log_earnings: permissions.can_log_earnings,
          can_view_analytics: permissions.can_view_analytics
        },
        profileImage: avatar,
        addToContacts
      });

      return result;
    },
    onSuccess: () => {
      toast({
        title: "Staff member created",
        description: "The staff member has been successfully added to your team.",
      });
      // Invalidate staff queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create staff member",
        description: error.message || "There was an error creating the staff member",
        variant: "destructive",
      });
    },
  });

  return {
    createStaff: createStaffMutation.mutateAsync,
    isCreating: createStaffMutation.isPending,
    error: createStaffMutation.error,
  };
}
