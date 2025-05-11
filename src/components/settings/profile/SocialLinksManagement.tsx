
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import { Link2, Trash2 } from "lucide-react";
import { BusinessSocialSettings } from "@/types/business-settings.types";

interface SocialLinksManagementProps {
  profileId: string;
  readOnly?: boolean;
}

const platformOptions = [
  { value: "website", label: "Website" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
];

const SocialLinksManagement: React.FC<SocialLinksManagementProps> = ({ profileId, readOnly = false }) => {
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [displayStyle, setDisplayStyle] = useState<"icons" | "buttons">("icons");
  const [isSaving, setIsSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  
  const { 
    socialLinks, 
    isLoading, 
    addSocialLink, 
    updateSocialLink, 
    deleteSocialLink 
  } = useBusinessSocialLinks(profileId);

  // Fetch display settings from database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("business_social_settings")
          .select("*")
          .eq("business_id", profileId)
          .single();

        if (error) {
          if (error.code !== "PGRST116") { // Not found is okay
            console.error("Error fetching social settings:", error);
          }
          return;
        }

        if (data) {
          setSettingsId(data.id);
          setDisplayStyle(data.display_style as "icons" | "buttons");
        }
      } catch (error) {
        console.error("Error in social settings fetch:", error);
      }
    };

    fetchSettings();
  }, [profileId]);

  const handleAddLink = async () => {
    if (!newPlatform || !newUrl.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a platform and enter a URL",
        variant: "destructive",
      });
      return;
    }

    try {
      await addSocialLink.mutateAsync({
        platform: newPlatform,
        url: newUrl.trim()
      });
      
      // Reset form
      setNewPlatform("");
      setNewUrl("");
    } catch (error) {
      console.error("Error adding social link:", error);
    }
  };

  const handleSaveDisplayStyle = async () => {
    try {
      setIsSaving(true);
      
      if (settingsId) {
        // Update existing settings
        const { error } = await supabase
          .from("business_social_settings")
          .update({
            display_style: displayStyle,
            updated_at: new Date().toISOString()
          })
          .eq("id", settingsId);

        if (error) throw error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from("business_social_settings")
          .insert({
            business_id: profileId,
            display_style: displayStyle
          });

        if (error) throw error;
      }

      toast({
        title: "Display style updated",
        description: "Your social links display settings have been saved."
      });
    } catch (error) {
      console.error("Error saving social settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your display settings.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Social Media Links</CardTitle>
          <CardDescription>Manage your social media presence</CardDescription>
        </div>
        <Link2 className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        {/* Display style selection */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Display Style</h3>
            <RadioGroup 
              value={displayStyle} 
              onValueChange={(value: "icons" | "buttons") => !readOnly && setDisplayStyle(value)}
              className="flex space-x-4"
              disabled={readOnly}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="icons" id="icons" />
                <Label htmlFor="icons">Icons</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buttons" id="buttons" />
                <Label htmlFor="buttons">Buttons</Label>
              </div>
            </RadioGroup>
          </div>
          
          {!readOnly && (
            <Button onClick={handleSaveDisplayStyle} disabled={isSaving} size="sm">
              {isSaving ? "Saving..." : "Save Display Style"}
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Your Social Links</h3>
          
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading social links...</p>
          ) : socialLinks?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No social links added yet.</p>
          ) : (
            <div className="space-y-2">
              {socialLinks?.map((link) => (
                <div key={link.id} className="flex items-center justify-between border p-2 rounded-md">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium capitalize">{link.platform}</span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 truncate max-w-[200px]">
                      {link.url}
                    </a>
                  </div>
                  {!readOnly && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteSocialLink.mutate(link.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {!readOnly && (
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium pt-2">Add New Social Link</h3>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-2">
              <Select value={newPlatform} onValueChange={setNewPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Enter URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
              
              <Button onClick={handleAddLink} disabled={addSocialLink.isPending}>
                Add Link
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialLinksManagement;
