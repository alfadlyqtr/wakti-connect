
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

export const useBusinessSocialLinks = (businessId?: string) => {
  const queryClient = useQueryClient();
  
  // Fetch the social links for a business
  const { data: socialLinks, isLoading } = useQuery({
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
          business_id: session.user.id,
          platform,
          url
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data as BusinessSocialLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessSocialLinks'] });
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
      queryClient.invalidateQueries({ queryKey: ['businessSocialLinks'] });
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
      queryClient.invalidateQueries({ queryKey: ['businessSocialLinks'] });
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
  
  return {
    socialLinks,
    isLoading,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink
  };
};
