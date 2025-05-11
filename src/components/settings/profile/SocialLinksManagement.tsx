import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Link2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useBusinessSocialLinks, SocialPlatform } from "@/hooks/useBusinessSocialLinks";
import { supabase } from "@/integrations/supabase/client";

interface SocialLinksManagementProps {
  profileId: string;
  readOnly?: boolean;
}

interface SocialLinkSettings {
  id?: string;
  display_style: 'icons' | 'buttons';
}

const SocialLinksManagement: React.FC<SocialLinksManagementProps> = ({ profileId, readOnly = false }) => {
  const { socialLinks, isLoading, addSocialLink, updateSocialLink, deleteSocialLink } = useBusinessSocialLinks(profileId);
  
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>("website");
  const [newUrl, setNewUrl] = useState("");
  const [displayStyle, setDisplayStyle] = useState<'icons' | 'buttons'>('icons');
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  
  // Fetch display style settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('business_social_settings')
          .select('*')
          .eq('business_id', profileId)
          .single();
          
        if (error) {
          if (error.code !== "PGRST116") { // Not found is okay
            console.error("Error fetching social settings:", error);
          }
          return;
        }
        
        if (data) {
          setSettingsId(data.id);
          setDisplayStyle(data.display_style as 'icons' | 'buttons');
        }
      } catch (error) {
        console.error("Error in social settings fetch:", error);
      }
    };
    
    fetchSettings();
  }, [profileId]);
  
  const handleAddLink = async () => {
    if (!newUrl || !newPlatform) return;
    
    try {
      await addSocialLink.mutateAsync({ platform: newPlatform, url: newUrl });
      setNewUrl("");
      setNewPlatform("website");
    } catch (error) {
      console.error("Error adding social link:", error);
    }
  };
  
  const handleUpdateLink = async (id: string, url: string) => {
    try {
      await updateSocialLink.mutateAsync({ id, url });
    } catch (error) {
      console.error("Error updating social link:", error);
    }
  };
  
  const handleDeleteLink = async (id: string) => {
    try {
      await deleteSocialLink.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting social link:", error);
    }
  };
  
  const handleSaveSettings = async () => {
    if (readOnly) return;
    
    try {
      setIsSettingsSaving(true);
      
      if (settingsId) {
        // Update existing settings
        const { error } = await supabase
          .from('business_social_settings')
          .update({ 
            display_style: displayStyle,
            updated_at: new Date().toISOString()
          })
          .eq('id', settingsId);
          
        if (error) throw error;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('business_social_settings')
          .insert({ 
            business_id: profileId,
            display_style: displayStyle
          })
          .select()
          .single();
          
        if (error) throw error;
        setSettingsId(data.id);
      }
      
      toast({
        title: "Display settings saved",
        description: "Your social media display settings have been updated"
      });
    } catch (error) {
      console.error("Error saving social display settings:", error);
      toast({
        variant: "destructive",
        title: "Settings error",
        description: "Failed to save display settings"
      });
    } finally {
      setIsSettingsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Loading social links...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Social Media Links</CardTitle>
        <CardDescription>Add links to your social media profiles</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Display style selection */}
        <div className="border-b pb-4">
          <h3 className="text-sm font-medium mb-2">Display Style</h3>
          <div className="flex items-center space-x-3">
            <Select
              value={displayStyle}
              onValueChange={(value: 'icons' | 'buttons') => setDisplayStyle(value)}
              disabled={readOnly}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select display style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="icons">Icons Only</SelectItem>
                <SelectItem value="buttons">Buttons with Text</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveSettings}
              disabled={readOnly || isSettingsSaving}
            >
              {isSettingsSaving ? "Saving..." : "Save Display Settings"}
            </Button>
          </div>
        </div>
        
        {/* Existing links */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium mb-2">Your Links</h3>
          
          {socialLinks && socialLinks.length > 0 ? (
            socialLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-2">
                <Select
                  value={link.platform}
                  disabled={true}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Content not needed since it's disabled */}
                  </SelectContent>
                </Select>
                
                <Input
                  type="url"
                  defaultValue={link.url}
                  className="flex-1"
                  disabled={readOnly}
                  onChange={(e) => {
                    if (e.target.value !== link.url) {
                      handleUpdateLink(link.id, e.target.value);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value !== link.url) {
                      handleUpdateLink(link.id, e.target.value);
                    }
                  }}
                />
                
                {!readOnly && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteLink(link.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-center p-4 border rounded-md">
              No social links added yet
            </div>
          )}
        </div>
        
        {/* Add new link */}
        {!readOnly && (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Add New Link</h3>
            <div className="flex items-center gap-2">
              <Select
                value={newPlatform}
                onValueChange={(value: SocialPlatform) => setNewPlatform(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                type="url"
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1"
              />
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleAddLink}
                disabled={!newUrl}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialLinksManagement;
