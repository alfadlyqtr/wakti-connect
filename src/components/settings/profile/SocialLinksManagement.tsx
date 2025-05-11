import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Globe, 
  Plus, 
  Trash2, 
  Edit, 
  Save,
  Link as LinkIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import SocialIcon from "@/components/business/landing/SocialIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SocialPlatform } from "@/types/business.types";

interface SocialLinkFormValues {
  id?: string;
  platform: SocialPlatform;
  url: string;
}

interface SocialLinksManagementProps {
  profileId?: string;
  readOnly?: boolean;
}

const SocialLinksManagement: React.FC<SocialLinksManagementProps> = ({ 
  profileId,
  readOnly = false 
}) => {
  const { socialLinks, isLoading, addSocialLink, updateSocialLink, deleteSocialLink } = 
    useBusinessSocialLinks(profileId);
  
  const [editingLink, setEditingLink] = useState<SocialLinkFormValues | null>(null);
  const [newLink, setNewLink] = useState<SocialLinkFormValues>({
    platform: "website",
    url: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const availablePlatforms: SocialPlatform[] = [
    "facebook", 
    "instagram", 
    "twitter", 
    "linkedin", 
    "youtube", 
    "tiktok", 
    "pinterest", 
    "website",
    "whatsapp"
  ];

  const platformLabels: Record<SocialPlatform, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    twitter: "Twitter",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok",
    pinterest: "Pinterest",
    website: "Website",
    whatsapp: "WhatsApp"
  };

  // Used platforms that are not available for adding new links
  const usedPlatforms = socialLinks?.map(link => link.platform) || [];
  
  const handleAddLink = async () => {
    if (readOnly) return;
    
    if (!newLink.url.trim()) {
      toast({
        title: "URL is required",
        description: "Please enter a valid URL for your social media link.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newLink.url.startsWith("http")) {
      newLink.url = `https://${newLink.url}`;
    }
    
    setIsSubmitting(true);
    try {
      await addSocialLink.mutateAsync(newLink);
      setNewLink({
        platform: "website",
        url: ""
      });
      toast({
        title: "Link added",
        description: "Your social media link has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add social media link.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateLink = async () => {
    if (readOnly || !editingLink?.id) return;
    
    if (!editingLink.url.trim()) {
      toast({
        title: "URL is required",
        description: "Please enter a valid URL for your social media link.",
        variant: "destructive"
      });
      return;
    }
    
    if (!editingLink.url.startsWith("http")) {
      editingLink.url = `https://${editingLink.url}`;
    }
    
    setIsSubmitting(true);
    try {
      await updateSocialLink.mutateAsync({
        id: editingLink.id,
        url: editingLink.url
      });
      setEditingLink(null);
      toast({
        title: "Link updated",
        description: "Your social media link has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update social media link.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteLink = async (id: string) => {
    if (readOnly) return;
    
    setIsSubmitting(true);
    try {
      await deleteSocialLink.mutateAsync(id);
      toast({
        title: "Link deleted",
        description: "Your social media link has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete social media link.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Social Media Links
        </CardTitle>
        <CardDescription>
          Add your business social media links. These will appear on your public business page.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-5">
          {/* Existing social links */}
          {isLoading ? (
            <div className="py-4 text-center">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading social links...</p>
            </div>
          ) : socialLinks && socialLinks.length > 0 ? (
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 border rounded-md">
                  {editingLink?.id === link.id ? (
                    <div className="flex-1 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <SocialIcon 
                          platform={link.platform} 
                          url="#" 
                          size="small" 
                          style="colored"
                        />
                        <span className="font-medium">{platformLabels[link.platform as SocialPlatform]}</span>
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <Input
                          value={editingLink.url}
                          onChange={(e) => setEditingLink({...editingLink, url: e.target.value})}
                          placeholder="Enter URL"
                          className="w-full"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="default" 
                          onClick={handleUpdateLink}
                          disabled={isSubmitting}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setEditingLink(null)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <SocialIcon 
                          platform={link.platform} 
                          url={link.url} 
                          size="small" 
                          style="colored"
                        />
                        <div>
                          <div className="font-medium">{platformLabels[link.platform as SocialPlatform]}</div>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-muted-foreground hover:underline"
                          >
                            {link.url}
                          </a>
                        </div>
                      </div>
                      {!readOnly && (
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setEditingLink({
                              id: link.id,
                              platform: link.platform as SocialPlatform,
                              url: link.url
                            })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteLink(link.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">No social links added yet.</p>
            </div>
          )}

          {/* Add new social link */}
          {!readOnly && (
            <div className="mt-4 p-4 border rounded-md">
              <h3 className="font-medium mb-3">Add New Social Link</h3>
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <Label htmlFor="platform" className="mb-1 block text-sm">Platform</Label>
                  <Select
                    value={newLink.platform}
                    onValueChange={(value) => setNewLink({...newLink, platform: value as SocialPlatform})}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-[150px]" id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePlatforms.map(platform => (
                        <SelectItem 
                          key={platform} 
                          value={platform}
                          disabled={usedPlatforms.includes(platform)}
                        >
                          {platformLabels[platform]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="url" className="mb-1 block text-sm">URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={newLink.url}
                    onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                </div>
                <Button
                  onClick={handleAddLink}
                  disabled={isSubmitting || usedPlatforms.includes(newLink.platform)}
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
