import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import { BusinessSocialLink, SocialPlatform } from "@/types/business.types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import SocialIconsGroup from "@/components/business/landing/SocialIconsGroup";

const SocialMediaTab = () => {
  const { user } = useAuth();
  const businessId = user?.id;
  const {
    socialLinks = [],
    isLoading,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink
  } = useBusinessSocialLinks(businessId);

  const [newLink, setNewLink] = useState({
    platform: "facebook" as SocialPlatform,
    url: ""
  });
  const [editLinks, setEditLinks] = useState<Record<string, string>>({});
  
  // Handle adding a new social link
  const handleAddLink = async () => {
    if (!newLink.url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL for the social media link.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await addSocialLink.mutateAsync(newLink);
      setNewLink({ ...newLink, url: "" });
    } catch (error) {
      // Error is handled in the mutation
    }
  };
  
  // Handle updating an existing link
  const handleUpdateLink = async (id: string) => {
    const newUrl = editLinks[id];
    
    if (!newUrl) {
      toast({
        title: "No Changes",
        description: "No changes to save.",
        variant: "default"
      });
      return;
    }
    
    try {
      await updateSocialLink.mutateAsync({ id, url: newUrl });
      
      // Clear the edit state for this link
      setEditLinks(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      // Error is handled in the mutation
    }
  };
  
  // Handle deleting a link
  const handleDeleteLink = async (id: string) => {
    try {
      await deleteSocialLink.mutateAsync(id);
    } catch (error) {
      // Error is handled in the mutation
    }
  };
  
  // Start editing a link
  const startEdit = (link: BusinessSocialLink) => {
    setEditLinks(prev => ({
      ...prev,
      [link.id]: link.url
    }));
  };
  
  // Cancel editing a link
  const cancelEdit = (id: string) => {
    setEditLinks(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add new social link */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Add New Social Link</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <Label htmlFor="platform">Platform</Label>
                <select
                  id="platform"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value as SocialPlatform })}
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="pinterest">Pinterest</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="website">Website</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <Label htmlFor="url">URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder={`https://${newLink.platform}.com/yourpage`}
                  />
                  <Button onClick={handleAddLink} disabled={addSocialLink.isPending}>
                    {addSocialLink.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview */}
          {socialLinks.length > 0 && (
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium">Preview</h3>
              <SocialIconsGroup 
                socialLinks={socialLinks}
                style="colored"
                size="default"
                className="justify-start"
              />
            </div>
          )}
          
          {/* Existing social links */}
          {socialLinks.length > 0 ? (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium">Your Social Links</h3>
              <div className="space-y-3">
                {socialLinks.map((link) => (
                  <div key={link.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <div className="font-medium text-sm capitalize w-24">
                      {link.platform}:
                    </div>
                    
                    {editLinks[link.id] !== undefined ? (
                      <>
                        <Input
                          value={editLinks[link.id]}
                          onChange={(e) => setEditLinks(prev => ({
                            ...prev,
                            [link.id]: e.target.value
                          }))}
                          className="flex-1"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateLink(link.id)}
                            disabled={updateSocialLink.isPending}
                          >
                            {updateSocialLink.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Save"
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => cancelEdit(link.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 truncate text-sm">
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline"
                          >
                            {link.url}
                          </a>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(link)}>
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteLink(link.id)}
                            disabled={deleteSocialLink.isPending}
                          >
                            {deleteSocialLink.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No social media links added yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaTab;
