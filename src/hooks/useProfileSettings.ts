
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/features/auth";

export type ProfileWithEmail = Tables<"profiles"> & {
  email?: string;
  business_email?: string;
  business_phone?: string;
  business_website?: string;
};

export const useProfileSettings = () => {
  const queryClient = useQueryClient();
  const { user, userId, isAuthenticated } = useAuth();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['settingsProfile'],
    queryFn: async (): Promise<ProfileWithEmail | null> => {
      try {
        console.log("Fetching profile data in useProfileSettings...");
        
        if (!userId || !isAuthenticated) {
          console.log("No authenticated user found");
          return null;
        }
        
        console.log("Fetching profile for user:", userId);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          // If profile not found, create a skeleton profile object
          if (error.code === 'PGRST116') {
            console.log("Profile not found, returning default profile");
            const defaultProfile: ProfileWithEmail = {
              id: userId,
              account_type: 'individual',
              is_searchable: true,
              auto_approve_contacts: false,
              auto_add_staff_to_contacts: true,
              avatar_url: '',
              business_name: '',
              created_at: new Date().toISOString(),
              display_name: '',
              full_name: '',
              occupation: '',
              theme_preference: 'light',
              updated_at: new Date().toISOString(),
              currency_preference: 'USD',
              telephone: '',
              gender: 'prefer_not_to_say',
              date_of_birth: '',
              country: '',
              state_province: '',
              city: '',
              postal_code: '',
              street_address: '',
              po_box: '',
              business_type: '',
              business_address: '',
              // Add the missing properties that were added in our SQL migration
              is_active: true,
              last_login_at: null,
              email: user?.email
            };
            return defaultProfile;
          }
          
          throw error;
        }
        
        console.log("Profile fetched successfully:", data);
        
        // Create a proper profile object with typed properties
        const profileWithEmail: ProfileWithEmail = {
          ...data,
          auto_add_staff_to_contacts: data.auto_add_staff_to_contacts ?? true, // Ensure field exists
          email: user?.email
        };
        
        return profileWithEmail;
      } catch (error) {
        console.error("Error in profile settings fetch:", error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 60000, // 1 minute
    enabled: !!userId && isAuthenticated,
  });

  const updateProfile = useMutation({
    mutationFn: async (updatedData: Partial<ProfileWithEmail>): Promise<ProfileWithEmail> => {
      try {
        console.log("Updating profile with data:", updatedData);
        
        if (!userId) throw new Error("No authenticated user");
        
        // Remove email property as it's not in the profiles table
        const { email, ...profileData } = updatedData;
        
        // Update the profile
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()
          .single();
          
        if (error) {
          console.error("Error updating profile in Supabase:", error);
          throw error;
        }
        
        console.log("Profile updated successfully:", data);
        
        // Update email if provided
        if (email && email !== user?.email) {
          console.log("Updating user email to:", email);
          const { error: emailError } = await supabase.auth.updateUser({
            email
          });
          
          if (emailError) {
            console.error("Error updating email:", emailError);
            throw emailError;
          }
        }
        
        // Combine the updated profile with the email
        const updatedProfile: ProfileWithEmail = {
          ...data,
          auto_add_staff_to_contacts: data.auto_add_staff_to_contacts ?? true, // Ensure field exists
          email: email || user?.email
        };
        
        return updatedProfile;
      } catch (error) {
        console.error("Error in updateProfile mutation:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidate the profile query to refetch with updated data
      queryClient.invalidateQueries({ queryKey: ['settingsProfile'] });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  });

  return {
    data,
    isLoading,
    error,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isPending
  };
};
