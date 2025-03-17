
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";

export type ProfileWithEmail = Tables<"profiles"> & {
  email?: string;
};

export const useProfileSettings = () => {
  const queryClient = useQueryClient();
  
  const fetchProfile = async (): Promise<ProfileWithEmail | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    // Create a proper profile object with all required fields even if data is null
    const profileWithEmail: ProfileWithEmail = data || {
      id: session.user.id,
      account_type: 'free',
      is_searchable: true,
      auto_approve_contacts: false,
      avatar_url: '',
      business_name: '',
      created_at: new Date().toISOString(),
      display_name: '',
      full_name: '',
      occupation: '',
      theme_preference: 'light',
      updated_at: new Date().toISOString()
    };
    
    if (session.user) {
      profileWithEmail.email = session.user.email;
    }
      
    return profileWithEmail;
  };

  const updateProfile = async (updatedData: Partial<ProfileWithEmail>): Promise<ProfileWithEmail> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No active session");
    
    // Remove email property as it's not in the profiles table
    const { email, ...profileData } = updatedData;
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Update email if provided
    if (email && email !== session.user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email
      });
      
      if (emailError) throw emailError;
    }
    
    // Combine the updated profile with the email
    const updatedProfile: ProfileWithEmail = data;
    updatedProfile.email = email || session.user.email;
    
    return updatedProfile;
  };
  
  const mutation = useMutation({
    mutationFn: updateProfile,
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
        description: "There was a problem updating your profile.",
        variant: "destructive"
      });
    }
  });

  return {
    data: useQuery<ProfileWithEmail>({
      queryKey: ['settingsProfile'],
      queryFn: fetchProfile
    }).data,
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending
  };
};
