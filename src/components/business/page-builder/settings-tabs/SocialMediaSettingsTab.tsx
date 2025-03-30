
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SocialMediaLinks from "../SocialMediaLinks";
import { BusinessSocialLink } from "@/types/business.types";
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
      const { data, error } = await fromTable('business_social_links')
        .select()
        .eq('business_id', businessId);
      
      if (error) {
        console.error("Error fetching social links:", error);
        throw error;
      }
      
      return data as BusinessSocialLink[] || [];
    },
    enabled: !!businessId
  });

  // Add social link mutation
  const addSocialLink = useMutation({
    mutationFn: async (linkData: Omit<BusinessSocialLink, 'id' | 'created_at'>) => {
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
  const updateSocialLink = useMutation({
    mutationFn: async (linkData: Partial<BusinessSocialLink> & { id: string }) => {
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
  const deleteSocialLink = useMutation({
    mutationFn: async (linkId: string) => {
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
          onAdd={addSocialLink}
          onUpdate={updateSocialLink}
          onDelete={deleteSocialLink}
        />
      </CardContent>
    </Card>
  );
};

export default SocialMediaSettingsTab;
