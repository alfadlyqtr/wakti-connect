
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Instagram, Facebook, Twitter, Linkedin, Globe, PlusCircle, Share2, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";

interface SocialLink {
  id?: string;
  business_id: string;
  platform: string;
  url: string;
}

interface SocialLinksManagementProps {
  profileId: string;
  readOnly?: boolean;
}

const SocialLinksManagement: React.FC<SocialLinksManagementProps> = ({
  profileId,
  readOnly = false
}) => {
  const queryClient = useQueryClient();
  const { isStaff } = useStaffPermissions();
  const isReadOnly = readOnly || isStaff;
  
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState<string>("");
  const [newUrl, setNewUrl] = useState<string>("");
  const [displayStyle, setDisplayStyle] = useState<"icons" | "buttons">("icons");
  const [isLoading, setIsLoading] = useState(true);
  
  // Mutation for saving social links
  const updateSocialLinks = useMutation({
    mutationFn: async (links: SocialLink[]) => {
      // First delete existing links
      await supabase
        .from('business_social_links')
        .delete()
        .eq('business_id', profileId);
      
      // Then insert new ones if there are any
      if (links.length > 0) {
        const { data, error } = await supabase
          .from('business_social_links')
          .insert(links)
          .select();
          
        if (error) throw error;
        return data;
      }
      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessSocialLinks', profileId] });
      toast({
        title: "Social links updated",
        description: "Your social media links have been saved successfully."
      });
    },
    onError: (error) => {
      console.error("Failed to update social links:", error);
      toast({
        title: "Update failed",
        description: "There was an error saving your social media links.",
        variant: "destructive"
      });
    }
  });

  // Mutation for saving display preference
  const updateDisplayPreference = useMutation({
    mutationFn: async (style: "icons" | "buttons") => {
      const { data, error } = await supabase
        .from('business_social_settings')
        .upsert({
          business_id: profileId,
          display_style: style
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessSocialSettings', profileId] });
      toast({
        title: "Display preference updated",
        description: "Your social links display preference has been saved."
      });
    },
    onError: (error) => {
      console.error("Failed to update display preference:", error);
      toast({
        title: "Update failed",
        description: "There was an error saving your display preference.",
        variant: "destructive"
      });
    }
  });
  
  // Fetch existing social links and display preferences
  useEffect(() => {
    const fetchSocialData = async () => {
      setIsLoading(true);
      try {
        // Fetch social links
        const { data: linksData, error: linksError } = await supabase
          .from('business_social_links')
          .select('*')
          .eq('business_id', profileId);
          
        if (linksError) throw linksError;
        
        // Fetch display preferences
        const { data: settingsData, error: settingsError } = await supabase
          .from('business_social_settings')
          .select('*')
          .eq('business_id', profileId)
          .single();
          
        if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 means no rows returned
          throw settingsError;
        }
        
        setSocialLinks(linksData || []);
        
        if (settingsData) {
          setDisplayStyle(settingsData.display_style || "icons");
        }
      } catch (error) {
        console.error("Error fetching social data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSocialData();
  }, [profileId]);
  
  const handleAddLink = () => {
    if (!newPlatform || !newUrl) {
      toast({
        title: "Invalid input",
        description: "Please select a platform and enter a URL.",
        variant: "destructive"
      });
      return;
    }
    
    // Simple URL validation
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      setNewUrl(`https://${newUrl}`);
    }
    
    const newLink: SocialLink = {
      business_id: profileId,
      platform: newPlatform,
      url: newUrl
    };
    
    setSocialLinks([...socialLinks, newLink]);
    setNewPlatform("");
    setNewUrl("");
    
    // Save immediately
    updateSocialLinks.mutate([...socialLinks, newLink]);
  };
  
  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
    
    // Save immediately
    updateSocialLinks.mutate(updatedLinks);
  };
  
  const handleDisplayStyleChange = (value: "icons" | "buttons") => {
    setDisplayStyle(value);
    updateDisplayPreference.mutate(value);
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="px-4 sm:px-6 pb-4 bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-wakti-blue" />
          <div>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
              {isReadOnly 
                ? "View business social media links" 
                : "Connect your business to social media platforms"
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pt-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {socialLinks.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No social media links added yet.</p>
                {!isReadOnly && (
                  <p className="text-sm mt-1">Add your first link below.</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {socialLinks.map((link, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(link.platform)}
                      <div>
                        <div className="font-medium capitalize">{link.platform}</div>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                    {!isReadOnly && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveLink(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {!isReadOnly && (
              <>
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Add New Social Link</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr_auto]">
                    <div>
                      <Label htmlFor="platform" className="mb-1 block">Platform</Label>
                      <Select 
                        value={newPlatform} 
                        onValueChange={setNewPlatform}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="url" className="mb-1 block">URL</Label>
                      <Input 
                        id="url" 
                        value={newUrl} 
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={handleAddLink} 
                        disabled={!newPlatform || !newUrl}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Display Preference</h3>
                  <RadioGroup 
                    value={displayStyle} 
                    onValueChange={(value) => handleDisplayStyleChange(value as "icons" | "buttons")}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="icons" id="icons" />
                      <Label htmlFor="icons">Show as icons only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buttons" id="buttons" />
                      <Label htmlFor="buttons">Show as buttons with labels</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
            
            {updateSocialLinks.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  There was an error saving your social links. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialLinksManagement;
