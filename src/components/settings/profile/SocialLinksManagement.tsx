import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Facebook,
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube,
  Globe,
  Plus,
  Trash2, 
  MapPin,
  Save
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import { useUpdatePageMutation } from "@/hooks/business-page/useBusinessPageMutations";
import { useOwnerBusinessPageQuery } from "@/hooks/business-page/useBusinessPageQueries";
import { BusinessSocialLink, SocialPlatform } from "@/types/business.types";

interface SocialLinksManagementProps {
  profileId?: string;
  readOnly?: boolean;
}

// Map of social platform icons
const platformIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />,
  whatsapp: <div className="h-5 w-5 flex items-center justify-center">Wa</div>,
  tiktok: <div className="h-5 w-5 flex items-center justify-center">TT</div>,
  pinterest: <div className="h-5 w-5 flex items-center justify-center">Pin</div>,
};

const SocialLinksManagement: React.FC<SocialLinksManagementProps> = ({ 
  profileId,
  readOnly = false 
}) => {
  const [newPlatform, setNewPlatform] = useState<string>("");
  const [newUrl, setNewUrl] = useState<string>("");
  const [locationUrl, setLocationUrl] = useState<string>("");
  const [displayAsButtons, setDisplayAsButtons] = useState<boolean>(false);
  
  const { socialLinks, isLoading, addSocialLink, updateSocialLink, deleteSocialLink } = useBusinessSocialLinks(profileId);
  const { toast } = useToast();
  
  // Get business page data for social links style settings
  const { data: businessPage } = useOwnerBusinessPageQuery();
  const updatePage = useUpdatePageMutation();

  // Initialize display preference from business page settings
  useEffect(() => {
    if (businessPage) {
      // Check if the social_icons_style is 'default' (icons) or 'button'
      setDisplayAsButtons(businessPage.social_icons_style === 'button');
    }
  }, [businessPage]);

  const handleAddLink = async () => {
    if (readOnly) return;
    
    if (!newPlatform) {
      toast({
        title: "Platform required",
        description: "Please select a social media platform",
        variant: "destructive",
      });
      return;
    }
    
    if (!newUrl) {
      toast({
        title: "URL required",
        description: "Please enter the URL for your social media profile",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Validate URL format
      let urlToAdd = newUrl;
      if (!urlToAdd.startsWith('http://') && !urlToAdd.startsWith('https://')) {
        urlToAdd = 'https://' + urlToAdd;
      }
      
      await addSocialLink.mutateAsync({ 
        platform: newPlatform as SocialPlatform, 
        url: urlToAdd 
      });
      
      setNewPlatform("");
      setNewUrl("");
    } catch (error) {
      console.error("Error adding social link:", error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (readOnly) return;
    
    try {
      await deleteSocialLink.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting social link:", error);
    }
  };

  const handleUpdateLink = async (id: string, url: string) => {
    if (readOnly) return;
    
    try {
      await updateSocialLink.mutateAsync({ id, url });
    } catch (error) {
      console.error("Error updating social link:", error);
    }
  };

  const handleSaveLocationUrl = async () => {
    if (readOnly) return;
    
    try {
      // Find if we already have a maps URL in our social links
      const existingMapsLink = socialLinks?.find(link => link.platform === "website" && link.url.includes("maps.google.com"));
      
      if (locationUrl) {
        let urlToAdd = locationUrl;
        if (!urlToAdd.startsWith('http://') && !urlToAdd.startsWith('https://')) {
          urlToAdd = 'https://' + urlToAdd;
        }
        
        if (existingMapsLink) {
          // Update existing maps link
          await updateSocialLink.mutateAsync({
            id: existingMapsLink.id,
            url: urlToAdd
          });
        } else {
          // Add new maps link
          await addSocialLink.mutateAsync({
            platform: "website" as SocialPlatform,
            url: urlToAdd
          });
        }
        
        toast({
          title: "Location saved",
          description: "Your location URL has been saved successfully.",
        });
      }
    } catch (error) {
      console.error("Error saving location URL:", error);
      toast({
        title: "Error",
        description: "Failed to save location URL.",
        variant: "destructive",
      });
    }
  };

  // Save the display preference to the database
  const handleDisplayToggle = async (value: boolean) => {
    setDisplayAsButtons(value);
    
    if (businessPage && !readOnly) {
      try {
        await updatePage.mutateAsync({
          pageId: businessPage.id,
          data: {
            social_icons_style: value ? 'button' : 'default'
          }
        });
        
        toast({
          title: "Display preference updated",
          description: "Your social links display preference has been saved.",
        });
      } catch (error) {
        console.error("Error updating display preference:", error);
        toast({
          title: "Error",
          description: "Failed to update display preference.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Find maps URL from links if it exists
  useEffect(() => {
    if (socialLinks && socialLinks.length > 0) {
      const mapsLink = socialLinks.find(link => link.url.includes("maps.google.com"));
      if (mapsLink) {
        setLocationUrl(mapsLink.url);
      }
    }
  }, [socialLinks]);

  // Available platforms excluding already added ones
  const getAvailablePlatforms = () => {
    const allPlatforms = ["facebook", "instagram", "twitter", "linkedin", "youtube", "tiktok", "pinterest", "website", "whatsapp"];
    const usedPlatforms = socialLinks?.map(link => link.platform) || [];
    return allPlatforms.filter(platform => !usedPlatforms.includes(platform as SocialPlatform));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Social Media Links
        </CardTitle>
        <CardDescription>
          {readOnly 
            ? "View social media links for this business"
            : "Add your social media profiles so customers can connect with you"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Location Input (Google Maps) */}
          <div className="space-y-2 border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <Label className="text-base font-medium">Google Maps Location</Label>
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Add your business location from Google Maps to help customers find you
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Input
                type="text"
                placeholder="Paste your Google Maps URL here"
                value={locationUrl}
                onChange={(e) => setLocationUrl(e.target.value)}
                disabled={readOnly}
                className="flex-1"
              />
              
              {!readOnly && (
                <Button 
                  onClick={handleSaveLocationUrl}
                  disabled={!locationUrl}
                  className="whitespace-nowrap"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Location
                </Button>
              )}
            </div>
          </div>
          
          <Separator />

          {/* Display Toggle */}
          {!readOnly && (
            <div className="flex items-center justify-between">
              <Label htmlFor="display-toggle">Display social links as buttons</Label>
              <Switch
                id="display-toggle"
                checked={displayAsButtons}
                onCheckedChange={handleDisplayToggle}
              />
            </div>
          )}
          
          {/* Existing Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Your social links</h3>
            {isLoading ? (
              <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin mx-auto"></div>
            ) : socialLinks && socialLinks.length > 0 ? (
              <div className="space-y-3">
                {socialLinks.map(link => (
                  <div key={link.id} className="flex flex-wrap items-center gap-2 border rounded-lg p-3">
                    <div className="flex items-center gap-2 min-w-[160px]">
                      <span className="text-primary">
                        {platformIcons[link.platform] || <Globe className="h-5 w-5" />}
                      </span>
                      <span className="capitalize">{link.platform}</span>
                    </div>
                    
                    {!readOnly ? (
                      <div className="flex flex-1 gap-2">
                        <Input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleUpdateLink(link.id, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteLink(link.id)}
                          title="Remove link"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ) : (
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline truncate flex-1"
                      >
                        {link.url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm italic">
                No social links added yet
              </div>
            )}
          </div>
          
          {/* Add New Link Form */}
          {!readOnly && (
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Add a social media link</h3>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={newPlatform}
                  onValueChange={setNewPlatform}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePlatforms().length > 0 ? (
                      getAvailablePlatforms().map(platform => (
                        <SelectItem key={platform} value={platform}>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">
                              {platformIcons[platform] || <Globe className="h-4 w-4" />}
                            </span>
                            <span className="capitalize">{platform}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No more platforms available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                
                <Input
                  type="text"
                  placeholder="Enter URL (e.g., https://facebook.com/youraccount)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1"
                />
                
                <Button 
                  onClick={handleAddLink} 
                  disabled={!newPlatform || !newUrl}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Link
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
