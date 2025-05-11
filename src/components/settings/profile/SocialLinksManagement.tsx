
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Globe, MessageCircle, Trash2, MapPin } from "lucide-react";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import { SocialPlatform } from "@/types/business.types";
import { Switch } from "@/components/ui/switch";

interface SocialLinksManagementProps {
  profileId: string;
  readOnly?: boolean;
}

const SocialLinksManagement: React.FC<SocialLinksManagementProps> = ({ 
  profileId,
  readOnly = false 
}) => {
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>("website");
  const [newUrl, setNewUrl] = useState<string>("");
  const [displayAsButtons, setDisplayAsButtons] = useState(false);
  
  const { 
    socialLinks, 
    isLoading, 
    addSocialLink, 
    updateSocialLink, 
    deleteSocialLink 
  } = useBusinessSocialLinks(profileId);

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      case "website":
        return <Globe className="h-5 w-5" />;
      case "whatsapp":
        return <MessageCircle className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const handleAddLink = async () => {
    if (!newUrl || !newPlatform) return;
    
    try {
      await addSocialLink.mutateAsync({
        platform: newPlatform,
        url: newUrl
      });
      
      // Reset form
      setNewPlatform("website");
      setNewUrl("");
    } catch (error) {
      console.error("Failed to add social link:", error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteSocialLink.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete social link:", error);
    }
  };

  const handleUpdateLink = async (id: string, url: string) => {
    try {
      await updateSocialLink.mutateAsync({ id, url });
    } catch (error) {
      console.error("Failed to update social link:", error);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="px-4 sm:px-6 pb-4 bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Social Media Links
        </CardTitle>
        <CardDescription>
          {readOnly 
            ? "View your business's social media links"
            : "Add and manage links to your social media profiles and website"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Display Style Toggle */}
        {!readOnly && (
          <div className="flex items-center justify-between">
            <Label htmlFor="display-style">Display social links as buttons</Label>
            <Switch 
              id="display-style" 
              checked={displayAsButtons} 
              onCheckedChange={setDisplayAsButtons} 
            />
          </div>
        )}
        
        {/* Current Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Your Social Links</h3>
          
          {isLoading ? (
            <div className="text-center py-4">Loading social links...</div>
          ) : socialLinks && socialLinks.length > 0 ? (
            <div className="space-y-3">
              {socialLinks.map(link => (
                <div key={link.id} className="flex items-center justify-between gap-4 p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(link.platform)}
                    <span className="font-medium capitalize">{link.platform}</span>
                  </div>
                  
                  {readOnly ? (
                    <div className="text-sm truncate max-w-[60%]">
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link.url}
                      </a>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-2">
                      <Input 
                        value={link.url}
                        onChange={(e) => handleUpdateLink(link.id, e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No social links added yet
            </div>
          )}
        </div>
        
        {/* Add New Link Form */}
        {!readOnly && (
          <div className="border rounded-md p-4 mt-4">
            <h3 className="text-sm font-medium mb-4">Add a New Link</h3>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select 
                  value={newPlatform} 
                  onValueChange={(value) => setNewPlatform(value as SocialPlatform)}
                >
                  <SelectTrigger id="platform" className="w-full">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="pinterest">Pinterest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              
              <Button
                onClick={handleAddLink}
                disabled={!newUrl || !newPlatform}
                className="w-full"
              >
                Add Link
              </Button>
            </div>
          </div>
        )}
        
        {/* Google Maps Location Section */}
        <div className="border rounded-md p-4 mt-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <h3 className="text-sm font-medium">Google Maps Location</h3>
          </div>
          
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Add your business location to help customers find you on Google Maps.
            </p>
            
            {!readOnly && (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="maps-url">Google Maps URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="maps-url"
                    placeholder="https://maps.google.com/..."
                  />
                  <Button>Save</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Paste your Google Maps business URL here. You can get this by searching for your business on Google Maps and copying the link.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLinksManagement;
