
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useBusinessPageQueries } from "@/hooks/business-page/useBusinessPageQueries";
import { SocialPlatform } from "@/types/business.types";

interface SocialLinksManagementProps {
  profileId: string;
  readOnly?: boolean;
}

const platformOptions: { value: SocialPlatform; label: string; placeholder: string }[] = [
  { value: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
  { value: "instagram", label: "Instagram", placeholder: "https://instagram.com/youraccount" },
  { value: "twitter", label: "Twitter", placeholder: "https://twitter.com/youraccount" },
  { value: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile" },
  { value: "youtube", label: "YouTube", placeholder: "https://youtube.com/channel/your-channel" },
  { value: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@youraccount" },
  { value: "pinterest", label: "Pinterest", placeholder: "https://pinterest.com/youraccount" },
  { value: "website", label: "Website", placeholder: "https://yourwebsite.com" },
  { value: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/1234567890" }
];

const SocialLinksManagement: React.FC<SocialLinksManagementProps> = ({
  profileId,
  readOnly = false
}) => {
  const queryClient = useQueryClient();
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>("website");
  const [newUrl, setNewUrl] = useState("");
  const [displayAsButtons, setDisplayAsButtons] = useState(false);
  
  // Use our custom hooks for queries
  const { useBusinessSocialLinksQuery, useOwnerBusinessPageQuery } = useBusinessPageQueries();
  const { data: socialLinks, isLoading: isLoadingSocialLinks } = useBusinessSocialLinksQuery(profileId);
  const { data: businessPage } = useOwnerBusinessPageQuery();

  // Load display preference from business page settings if available
  useEffect(() => {
    if (businessPage) {
      // Check if social_icons_style is set to 'rounded' or 'button' which indicates buttons
      const isButtonStyle = businessPage.social_icons_style === 'rounded' || 
                            businessPage.social_icons_style === 'button';
      setDisplayAsButtons(isButtonStyle);
    }
  }, [businessPage]);

  // Add social link
  const addSocialLink = useMutation({
    mutationFn: async ({ platform, url }: { platform: SocialPlatform; url: string }) => {
      const { data, error } = await supabase
        .from('business_social_links')
        .insert({
          business_id: profileId,
          platform,
          url
        })
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessSocialLinks', profileId] });
      setNewUrl("");
      toast({ title: "Link added", description: "Social link has been added successfully." });
    },
    onError: (error) => {
      console.error("Error adding social link:", error);
      toast({ 
        title: "Error adding link", 
        description: "There was a problem adding your social link.", 
        variant: "destructive" 
      });
    }
  });
  
  // Delete social link
  const deleteSocialLink = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from('business_social_links')
        .delete()
        .eq('id', linkId);
        
      if (error) throw error;
      return linkId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessSocialLinks', profileId] });
      toast({ title: "Link removed", description: "Social link has been removed successfully." });
    },
    onError: (error) => {
      console.error("Error removing social link:", error);
      toast({ 
        title: "Error removing link", 
        description: "There was a problem removing your social link.", 
        variant: "destructive" 
      });
    }
  });
  
  // Update display preference
  const updateDisplayPreference = useMutation({
    mutationFn: async (asButtons: boolean) => {
      if (!businessPage?.id) {
        throw new Error("Business page not found");
      }
      
      // Map the boolean to the appropriate style
      const styleValue = asButtons ? 'rounded' : 'default';
      
      const { error } = await supabase
        .from('business_pages')
        .update({
          social_icons_style: styleValue
        })
        .eq('id', businessPage.id);
        
      if (error) throw error;
      return styleValue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
      toast({ 
        title: "Display preference updated", 
        description: "Your social links display preference has been saved." 
      });
    },
    onError: (error) => {
      console.error("Error updating display preference:", error);
      toast({ 
        title: "Error updating preference", 
        description: "There was a problem saving your display preference.", 
        variant: "destructive" 
      });
    }
  });

  const handleAddLink = () => {
    if (!newUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a valid URL for the social link.",
        variant: "destructive"
      });
      return;
    }
    
    addSocialLink.mutate({ platform: newPlatform, url: newUrl });
  };
  
  const handleDeleteLink = (linkId: string) => {
    deleteSocialLink.mutate(linkId);
  };
  
  const handleToggleDisplayMode = (checked: boolean) => {
    setDisplayAsButtons(checked);
    updateDisplayPreference.mutate(checked);
  };
  
  const getPlatformLabel = (platform: SocialPlatform): string => {
    const found = platformOptions.find(opt => opt.value === platform);
    return found ? found.label : platform;
  };

  if (isLoadingSocialLinks) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Loading your social links...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="px-4 sm:px-6 pb-4 bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-wakti-blue" />
          <div>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Manage your business social media profiles</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pt-4 pb-6">
        <div className="space-y-4">
          {/* Display preference toggle */}
          {!readOnly && businessPage && (
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="display-as-buttons">Display social links as buttons</Label>
              <Switch 
                id="display-as-buttons" 
                checked={displayAsButtons} 
                onCheckedChange={handleToggleDisplayMode}
              />
            </div>
          )}
          
          {/* List existing social links */}
          {socialLinks && socialLinks.length > 0 ? (
            <div className="space-y-3">
              {socialLinks.map(link => (
                <div key={link.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{getPlatformLabel(link.platform as SocialPlatform)}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  </div>
                  {!readOnly && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteLink(link.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No social links added yet.
            </div>
          )}

          {/* Add new social link form */}
          {!readOnly && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium mb-3">Add New Social Link</p>
              <div className="grid grid-cols-[1fr_2fr_auto] gap-2">
                <Select 
                  value={newPlatform} 
                  onValueChange={(value) => setNewPlatform(value as SocialPlatform)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  className="h-10"
                  placeholder={platformOptions.find(p => p.value === newPlatform)?.placeholder || "Enter URL"}
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
                
                <Button onClick={handleAddLink} size="sm" className="h-10 px-3">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLinksManagement;
