
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type SocialPlatform = 
  | "website"
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "tiktok";

export interface BusinessSocialLink {
  id: string;
  business_id: string;
  platform: SocialPlatform;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessSocialSettings {
  id: string;
  business_id: string;
  display_style: 'icons' | 'buttons';
  created_at: string;
  updated_at: string;
}

export const useBusinessSocialLinks = (businessId?: string) => {
  const queryClient = useQueryClient();
  
  // Fetch the social links for a business
  const { data: socialLinks, isLoading: isLoadingSocialLinks } = useQuery({
    queryKey: ['businessSocialLinks', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('business_social_links')
        .select('*')
        .eq('business_id', businessId);
        
      if (error) throw error;
      
      return data as BusinessSocialLink[];
    },
    enabled: !!businessId
  });
  
  // Fetch the social settings for a business
  const { data: socialSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['businessSocialSettings', businessId],
    queryFn: async () => {
      if (!businessId) return null;
      
      const { data, error } = await supabase
        .from('business_social_settings')
        .select('*')
        .eq('business_id', businessId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No settings found, not an error
        }
        throw error;
      }
      
      return data as BusinessSocialSettings;
    },
    enabled: !!businessId
  });
  
  // Add a new social link
  const addSocialLink = useMutation({
    mutationFn: async ({ platform, url }: { platform: SocialPlatform, url: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await supabase
        .from('business_social_links')
        .insert({
          business_id: businessId || session.user.id,
          platform,
          url
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data as BusinessSocialLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessSocialLinks', businessId] });
      toast({
        title: "Social link added",
        description: "Your social media link has been added successfully"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add social link: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });
  
  // Update an existing social link
  const updateSocialLink = useMutation({
    mutationFn: async ({ id, url }: { id: string, url: string }) => {
      const { data, error } = await supabase
        .from('business_social_links')
        .update({ url, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return data as BusinessSocialLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessSocialLinks', businessId] });
      toast({
        title: "Social link updated",
        description: "Your social media link has been updated successfully"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update social link: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });
  
  // Delete a social link
  const deleteSocialLink = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_social_links')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessSocialLinks', businessId] });
      toast({
        title: "Social link deleted",
        description: "Your social media link has been removed"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete social link: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  // Update or create social settings
  const updateSocialSettings = useMutation({
    mutationFn: async ({ displayStyle }: { displayStyle: 'icons' | 'buttons' }) => {
      if (!businessId) {
        throw new Error("Business ID is required");
      }
      
      if (socialSettings?.id) {
        // Update existing settings
        const { data, error } = await supabase
          .from('business_social_settings')
          .update({
            display_style: displayStyle,
            updated_at: new Date().toISOString()
          })
          .eq('id', socialSettings.id)
          .select();
          
        if (error) throw error;
        
        return data;
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from('business_social_settings')
          .insert({
            business_id: businessId,
            display_style: displayStyle
          })
          .select();
          
        if (error) throw error;
        
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessSocialSettings', businessId] });
      toast({
        title: "Social display settings updated",
        description: "Your social media display preferences have been saved."
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update social settings: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });
  
  return {
    socialLinks,
    socialSettings,
    isLoading: isLoadingSocialLinks || isLoadingSettings,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    updateSocialSettings
  };
};
