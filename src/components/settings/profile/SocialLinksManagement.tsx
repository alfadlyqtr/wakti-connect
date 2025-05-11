
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Plus, Trash2, Save, Facebook, Instagram, Twitter, Linkedin, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import { SocialPlatform } from "@/types/business.types";
import { Switch } from "@/components/ui/switch";

interface SocialLinksManagementProps {
  profileId: string;
  readOnly?: boolean;
}

const platformOptions: { value: SocialPlatform; label: string; icon: React.ReactNode }[] = [
  { value: 'facebook', label: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
  { value: 'instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
  { value: 'twitter', label: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
  { value: 'googleMaps', label: 'Google Maps', icon: <MapPin className="h-4 w-4" /> },
  { value: 'website', label: 'Website', icon: <Globe className="h-4 w-4" /> },
];

const SocialLinksManagement: React.FC<SocialLinksManagementProps> = ({ 
  profileId,
  readOnly = false 
}) => {
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('website');
  const [newUrl, setNewUrl] = useState<string>('');
  const [useIconsOnly, setUseIconsOnly] = useState<boolean>(true);
  const { toast } = useToast();
  
  const { 
    socialLinks, 
    isLoading, 
    addSocialLink, 
    updateSocialLink, 
    deleteSocialLink 
  } = useBusinessSocialLinks(profileId);

  const handleAddLink = async () => {
    if (!newUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a URL for the social media link",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Validate URL format
      let url = newUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      await addSocialLink.mutateAsync({
        platform: newPlatform,
        url
      });
      
      // Reset form
      setNewUrl('');
    } catch (error) {
      console.error("Error adding social link:", error);
    }
  };
  
  const handleUpdateLink = async (id: string, url: string) => {
    if (!url.trim()) return;
    
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
  
  const getDisplayName = (platform: string): string => {
    const option = platformOptions.find(opt => opt.value === platform);
    return option ? option.label : platform.charAt(0).toUpperCase() + platform.slice(1);
  };
  
  const getIcon = (platform: string): React.ReactNode => {
    const option = platformOptions.find(opt => opt.value === platform);
    return option?.icon || <Globe className="h-4 w-4" />;
  };
  
  const formatUrl = (url: string): string => {
    // Get domain name from URL for display
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <div>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                {readOnly 
                  ? "View business social media links"
                  : "Add and manage your business social media profiles"
                }
              </CardDescription>
            </div>
          </div>
          
          {!readOnly && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show as buttons</span>
              <Switch 
                checked={!useIconsOnly} 
                onCheckedChange={(checked) => setUseIconsOnly(!checked)}
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 border-2 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
          </div>
        ) : socialLinks && socialLinks.length > 0 ? (
          <div className="space-y-4">
            <div className="grid gap-4">
              {socialLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-3 p-3 border rounded-md bg-card">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {getIcon(link.platform)}
                  </div>
                  
                  <div className="flex-grow">
                    <Label className="text-sm font-medium">{getDisplayName(link.platform)}</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        value={link.url}
                        onChange={(e) => handleUpdateLink(link.id, e.target.value)}
                        placeholder={`Enter ${link.platform} URL`}
                        disabled={readOnly}
                        className="h-8"
                      />
                    </div>
                  </div>
                  
                  {!readOnly && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteLink(link.id)}
                      className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="pt-2">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Display style:</span>
                <div className="flex gap-2 items-center">
                  {useIconsOnly ? (
                    <div className="flex gap-2">
                      {socialLinks.map((link) => (
                        <div key={link.id} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {getIcon(link.platform)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {socialLinks.map((link) => (
                        <Button key={link.id} variant="outline" size="sm" className="flex items-center gap-2">
                          {getIcon(link.platform)}
                          <span>{getDisplayName(link.platform)}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center border border-dashed rounded-md">
            <p className="text-muted-foreground">No social media links added yet.</p>
          </div>
        )}
        
        {!readOnly && (
          <div className="pt-4 border-t">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:w-1/3">
                <Label htmlFor="platform">Platform</Label>
                <Select value={newPlatform} onValueChange={(val) => setNewPlatform(val as SocialPlatform)}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Label htmlFor="url">URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="url" 
                    value={newUrl} 
                    onChange={(e) => setNewUrl(e.target.value)} 
                    placeholder={`Enter ${getDisplayName(newPlatform)} URL`}
                  />
                  <Button 
                    onClick={handleAddLink} 
                    className="flex items-center gap-1"
                    disabled={!newUrl.trim()}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialLinksManagement;
