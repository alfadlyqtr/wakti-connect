
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Plus, Facebook, Instagram, Twitter, Linkedin, Globe, Youtube } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialPlatform } from "@/types/business.types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BusinessSocialSettings } from "@/types/business-settings.types";

interface SocialLinksManagementProps {
  profileId: string;
  readOnly?: boolean;
}

const platformOptions: { value: SocialPlatform; label: string; icon: React.ReactNode }[] = [
  { value: 'facebook', label: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
  { value: 'instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
  { value: 'twitter', label: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
  { value: 'youtube', label: 'YouTube', icon: <Youtube className="h-4 w-4" /> },
  { value: 'website', label: 'Website', icon: <Globe className="h-4 w-4" /> },
];

const SocialLinksManagement: React.FC<SocialLinksManagementProps> = ({ profileId, readOnly = false }) => {
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('website');
  const [newUrl, setNewUrl] = useState('');
  const [displayStyle, setDisplayStyle] = useState<'icons' | 'buttons'>('icons');
  const queryClient = useQueryClient();
  
  const { 
    socialLinks, 
    isLoading, 
    addSocialLink, 
    updateSocialLink, 
    deleteSocialLink 
  } = useBusinessSocialLinks(profileId);
  
  // Fetch display style settings
  const { data: socialSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['socialSettings', profileId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('business_social_settings')
          .select('*')
          .eq('business_id', profileId)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching social settings:", error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error("Error in social settings query:", error);
        return null;
      }
    },
    enabled: !!profileId,
  });

  // Update display style when settings are loaded
  useEffect(() => {
    if (socialSettings) {
      setDisplayStyle(socialSettings.display_style as 'icons' | 'buttons');
    }
  }, [socialSettings]);

  // Save display style preferences
  const saveDisplayStyleMutation = useMutation({
    mutationFn: async (newStyle: 'icons' | 'buttons') => {
      const { data: existingSettings } = await supabase
        .from('business_social_settings')
        .select('id')
        .eq('business_id', profileId)
        .maybeSingle();
      
      if (existingSettings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('business_social_settings')
          .update({
            display_style: newStyle,
            updated_at: new Date().toISOString()
          })
          .eq('business_id', profileId)
          .select();
          
        if (error) throw error;
        return data;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('business_social_settings')
          .insert({
            business_id: profileId,
            display_style: newStyle
          })
          .select();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast({
        title: "Display style updated",
        description: "Your social links display preferences have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['socialSettings', profileId] });
    },
    onError: (error) => {
      console.error("Error saving display style:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was a problem saving your display preferences.",
      });
    }
  });

  const handleAddLink = () => {
    if (!newPlatform || !newUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a platform and enter a URL."
      });
      return;
    }
    
    addSocialLink.mutate({ platform: newPlatform, url: newUrl });
    setNewUrl('');
  };

  const handleDisplayStyleChange = (value: string) => {
    if (value === 'icons' || value === 'buttons') {
      setDisplayStyle(value);
      saveDisplayStyleMutation.mutate(value);
    }
  };

  if (isLoading || isLoadingSettings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Loading your social media links...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>Add links to your social media profiles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {readOnly && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You are viewing social media links in read-only mode.
            </AlertDescription>
          </Alert>
        )}

        {!readOnly && (
          <>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Display Style</Label>
                <ToggleGroup 
                  type="single" 
                  value={displayStyle} 
                  onValueChange={handleDisplayStyleChange}
                  className="justify-start"
                >
                  <ToggleGroupItem value="icons">Icons Only</ToggleGroupItem>
                  <ToggleGroupItem value="buttons">Button Style</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-wrap gap-2">
                <Select value={newPlatform} onValueChange={(value) => setNewPlatform(value as SocialPlatform)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          {option.icon}
                          <span className="ml-2">{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="url"
                  placeholder="https://"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1"
                />
                
                <Button onClick={handleAddLink} disabled={addSocialLink.isPending}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </>
        )}
        
        {socialLinks && socialLinks.length > 0 ? (
          <div className="space-y-2">
            {socialLinks.map((link) => {
              const platform = platformOptions.find(p => p.value === link.platform);
              return (
                <div key={link.id} className="flex items-center justify-between border p-2 rounded">
                  <div className="flex items-center">
                    {platform?.icon}
                    <span className="ml-2 truncate max-w-[200px] sm:max-w-[300px]">
                      {link.url}
                    </span>
                  </div>
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSocialLink.mutate(link.id)}
                      disabled={deleteSocialLink.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            No social links added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialLinksManagement;
