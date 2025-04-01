
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SocialMediaLinks from "../SocialMediaLinks";
import { BusinessSocialLink, SocialPlatform } from "@/types/business.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fromTable } from "@/integrations/supabase/helper";
import { toast } from "@/components/ui/use-toast";

interface SocialMediaSettingsTabProps {
  businessId: string;
}

const SocialMediaSettingsTab: React.FC<SocialMediaSettingsTabProps> = ({
  businessId
}) => {
  const queryClient = useQueryClient();

  // Query social links
  const { data: socialLinks, isLoading } = useQuery({
    queryKey: ['businessSocialLinks', businessId],
    queryFn: async () => {
      if (!businessId) {
        console.log("No business ID provided for social links query");
        return [];
      }
      
      try {
        const { data, error } = await fromTable('business_social_links')
          .select()
          .eq('business_id', businessId);
        
        if (error) {
          console.error("Error fetching social links:", error);
          throw error;
        }
        
        console.log("Fetched social links:", data);
        return data as BusinessSocialLink[] || [];
      } catch (error) {
        console.error("Exception fetching social links:", error);
        return [];
      }
    },
    enabled: !!businessId
  });

  // Add social link mutation
  const addSocialLinkMutation = useMutation({
    mutationFn: async (linkData: Omit<BusinessSocialLink, 'id' | 'created_at'>) => {
      console.log("Adding social link with data:", linkData);
      const { data, error } = await fromTable('business_social_links')
        .insert({ ...linkData, business_id: businessId })
        .select()
        .single();
      
      if (error) {
        console.error("Error adding social link:", error);
        throw error;
      }
      
      return data as BusinessSocialLink;
    },
    onSuccess: () => {
      toast({ title: "Social link added successfully" });
      queryClient.invalidateQueries({ queryKey: ['businessSocialLinks', businessId] });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive",
        title: "Failed to add social link", 
        description: error.message 
      });
    }
  });

  // Update social link mutation
  const updateSocialLinkMutation = useMutation({
    mutationFn: async (linkData: Partial<BusinessSocialLink> & { id: string }) => {
      console.log("Updating social link:", linkData);
      const { id, ...updates } = linkData;
      const { data, error } = await fromTable('business_social_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating social link:", error);
        throw error;
      }
      
      return data as BusinessSocialLink;
    },
    onSuccess: () => {
      toast({ title: "Social link updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['businessSocialLinks', businessId] });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive",
        title: "Failed to update social link", 
        description: error.message 
      });
    }
  });

  // Delete social link mutation
  const deleteSocialLinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      console.log("Deleting social link:", linkId);
      const { error } = await fromTable('business_social_links')
        .delete()
        .eq('id', linkId);
      
      if (error) {
        console.error("Error deleting social link:", error);
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast({ title: "Social link removed" });
      queryClient.invalidateQueries({ queryKey: ['businessSocialLinks', businessId] });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive",
        title: "Failed to delete social link", 
        description: error.message 
      });
    }
  });

  // Wrapper functions to match the expected function signatures
  const handleAddSocialLink = (data: { platform: SocialPlatform, url: string }) => {
    addSocialLinkMutation.mutate({
      platform: data.platform,
      url: data.url,
      business_id: businessId
    });
  };

  const handleUpdateSocialLink = (data: { id: string, url: string }) => {
    updateSocialLinkMutation.mutate({
      id: data.id,
      url: data.url
    });
  };

  const handleDeleteSocialLink = (id: string) => {
    deleteSocialLinkMutation.mutate(id);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>
          Add your social media profiles to display on your business page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SocialMediaLinks 
          socialLinks={socialLinks || []} 
          onAdd={handleAddSocialLink}
          onUpdate={handleUpdateSocialLink}
          onDelete={handleDeleteSocialLink}
        />
      </CardContent>
    </Card>
  );
};

export default SocialMediaSettingsTab;
