
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useProfileOperations = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Updates the user profile in both auth and profiles table
   */
  const updateProfile = async (profileData: any) => {
    try {
      setIsUpdating(true);
      
      // Get current session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive"
        });
        return false;
      }

      const userId = sessionData.session.user.id;
      
      // Update user metadata in auth
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name,
          display_name: profileData.display_name || profileData.full_name,
          business_name: profileData.business_name,
          account_type: profileData.account_type
        }
      });
      
      if (authUpdateError) {
        toast({
          title: "Error updating profile",
          description: authUpdateError.message,
          variant: "destructive"
        });
        return false;
      }
      
      // Update profile table
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          display_name: profileData.display_name || profileData.full_name,
          bio: profileData.bio,
          website: profileData.website,
          avatar_url: profileData.avatar_url,
          occupation: profileData.occupation,
          business_name: profileData.business_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (profileUpdateError) {
        toast({
          title: "Error updating profile data",
          description: profileUpdateError.message,
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  /**
   * Fetches the user's metadata from auth
   */
  const getUserMetadata = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;
      
      // Ensure we have default values for metadata
      const metadata = data.user.user_metadata || {};
      return {
        full_name: metadata.full_name || data.user.email?.split('@')[0] || '',
        account_type: metadata.account_type || 'free',
        business_name: metadata.business_name || '',
        display_name: metadata.display_name || metadata.full_name || data.user.email?.split('@')[0] || '',
      };
    } catch (error) {
      console.error('Error fetching user metadata:', error);
      return null;
    }
  };
  
  return {
    isUpdating,
    updateProfile,
    getUserMetadata
  };
};
