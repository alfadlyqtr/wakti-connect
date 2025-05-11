import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkIcon, Loader2, Trash2, Plus, ExternalLink } from "lucide-react";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SocialPlatform } from "@/types/business.types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SocialLinksManagementProps {
  profileId: string;
  readOnly?: boolean;
}

type SocialLink = {
  id?: string;
  platform: SocialPlatform;
  url: string;
};

const platformOptions: SocialPlatform[] = [
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
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  pinterest: "Pinterest",
  website: "Website",
  whatsapp: "WhatsApp"
};

const SocialLinksManagement: React.FC<SocialLinksManagementProps> = ({ profileId, readOnly = false }) => {
  const [newLink, setNewLink] = useState<SocialLink>({ platform: "website", url: "" });
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [displayAsButtons, setDisplayAsButtons] = useState<boolean>(false);
  const [isLoadingSetting, setIsLoadingSettings] = useState<boolean>(true);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  
  const { 
    socialLinks, 
    isLoading: isLoadingLinks, 
    addSocialLink, 
    updateSocialLink, 
    deleteSocialLink
  } = useBusinessSocialLinks(profileId);

  // Load display settings from the database
  useEffect(() => {
    const loadDisplaySettings = async () => {
      try {
        const { data } = await supabase
          .from('business_pages')
          .select('social_icons_style')
          .eq('business_id', profileId)
          .single();
        
        if (data) {
          setDisplayAsButtons(data.social_icons_style === 'button');
        }
      } catch (error) {
        console.error('Error loading social links display settings:', error);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    if (profileId) {
      loadDisplaySettings();
    }
  }, [profileId]);

  const handleAddLink = async () => {
    if (!newLink.url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    try {
      await addSocialLink.mutateAsync({
        platform: newLink.platform,
        url: newLink.url
      });

      setNewLink({ platform: "website", url: "" });
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

  const confirmDelete = (id: string) => {
    setLinkToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteLink = async () => {
    if (linkToDelete) {
      try {
        await deleteSocialLink.mutateAsync(linkToDelete);
        setShowDeleteDialog(false);
        setLinkToDelete(null);
      } catch (error) {
        console.error("Error deleting social link:", error);
      }
    }
  };

  const handleDisplaySettingChange = async (value: boolean) => {
    setDisplayAsButtons(value);
    setIsSavingSettings(true);
    
    try {
      const { data: existingPage } = await supabase
        .from('business_pages')
        .select('id')
        .eq('business_id', profileId)
        .single();
      
      if (existingPage) {
        await supabase
          .from('business_pages')
          .update({
            social_icons_style: value ? 'button' : 'default',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPage.id);
      } else {
        await supabase
          .from('business_pages')
          .insert({
            business_id: profileId,
            social_icons_style: value ? 'button' : 'default',
            page_title: 'My Business',
            page_slug: 'my-business',
            is_published: false,
          });
      }
      
      toast({
        title: "Display settings updated",
        description: `Social links will now display as ${value ? 'buttons' : 'icons'} on your public page.`
      });
    } catch (error) {
      console.error('Error saving social links display setting:', error);
      toast({
        title: "Error",
        description: "Failed to save display settings",
        variant: "destructive"
      });
      setDisplayAsButtons(!value); // Revert the switch if saving fails
    } finally {
      setIsSavingSettings(false);
    }
  };

  const isLoading = isLoadingLinks || isLoadingSetting;

  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            <CardTitle>Social Links</CardTitle>
          </div>
          <CardDescription>Loading social links...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            <CardTitle>Social Links</CardTitle>
          </div>
          <CardDescription>Manage your social media presence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display Settings */}
          {!readOnly && (
            <div className="flex items-center space-x-2 pb-4">
              <Switch
                id="display-as-buttons"
                checked={displayAsButtons}
                onCheckedChange={handleDisplaySettingChange}
                disabled={readOnly || isSavingSettings}
              />
              <Label htmlFor="display-as-buttons">
                {isSavingSettings ? "Saving..." : "Display social links as buttons on public page"}
              </Label>
            </div>
          )}

          {/* Existing Links */}
          {socialLinks && socialLinks.length > 0 ? (
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-2">
                  <div className="min-w-[100px] font-medium">
                    {platformLabels[link.platform as SocialPlatform] || link.platform}
                  </div>
                  <Input
                    value={link.url}
                    onChange={(e) => {
                      // Only update in UI, we'll save on blur
                      const updatedLinks = socialLinks.map(l =>
                        l.id === link.id ? { ...l, url: e.target.value } : l
                      );
                    }}
                    onBlur={(e) => link.id && handleUpdateLink(link.id, e.target.value)}
                    className="flex-1"
                    disabled={readOnly}
                  />
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => link.id && confirmDelete(link.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md bg-muted p-4 text-center text-muted-foreground">
              No social links found. Add your first social link below.
            </div>
          )}

          {/* Add New Link */}
          {!readOnly && (
            <div className="flex items-end gap-2 pt-4">
              <div className="w-1/3">
                <Select
                  value={newLink.platform}
                  onValueChange={(value) => setNewLink({ ...newLink, platform: value as SocialPlatform })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platformLabels[platform]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Input
                  placeholder={`Enter ${platformLabels[newLink.platform]} URL`}
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                />
              </div>
              <Button onClick={handleAddLink} disabled={addSocialLink.isPending}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this social link from your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLink} className="bg-destructive">
              {deleteSocialLink.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SocialLinksManagement;
