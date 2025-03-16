
import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { BusinessPage } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save, Share2, Upload } from "lucide-react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import SocialMediaLinks from "./SocialMediaLinks";
import { updateBusinessLogo } from "@/services/profile/updateProfileService";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";

interface PageSettingsTabProps {
  pageData: {
    page_title: string;
    page_slug: string;
    description: string;
    is_published: boolean;
    chatbot_enabled: boolean;
    chatbot_code?: string;
    primary_color: string;
    secondary_color: string;
    logo_url?: string;
  };
  businessId?: string;
  handlePageDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
  handleSavePageSettings: () => void;
  updatePage: ReturnType<typeof useMutation<BusinessPage, Error, any>>;
  autoSavePageSettings?: (pageData: Partial<BusinessPage>) => void;
  getPublicPageUrl: () => string;
}

const PageSettingsTab: React.FC<PageSettingsTabProps> = ({
  pageData,
  businessId,
  handlePageDataChange,
  handleToggleChange,
  handleSavePageSettings,
  updatePage,
  autoSavePageSettings,
  getPublicPageUrl
}) => {
  const [isDirty, setIsDirty] = React.useState(false);
  const [uploadingLogo, setUploadingLogo] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const publicUrl = getPublicPageUrl();
  const { socialLinks, addSocialLink, updateSocialLink, deleteSocialLink } = useBusinessSocialLinks(businessId);
  
  // Set up debounced auto-save
  const debouncedAutoSave = useDebouncedCallback((data) => {
    if (autoSavePageSettings) {
      autoSavePageSettings(data);
      setIsDirty(false);
    }
  }, 2000);
  
  // Custom input change handler that triggers auto-save
  const handleInputChangeWithAutoSave = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handlePageDataChange(e);
    setIsDirty(true);
    
    if (autoSavePageSettings) {
      const { name, value } = e.target;
      debouncedAutoSave({
        ...pageData,
        [name]: value
      });
    }
  };
  
  // Custom toggle change handler that triggers auto-save
  const handleToggleWithAutoSave = (name: string, checked: boolean) => {
    handleToggleChange(name, checked);
    setIsDirty(true);
    
    if (autoSavePageSettings) {
      debouncedAutoSave({
        ...pageData,
        [name]: checked
      });
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !businessId) return;
    
    try {
      setUploadingLogo(true);
      const logoUrl = await updateBusinessLogo(businessId, file);
      
      // Update the page data with the new logo URL
      handleToggleChange('logo_url', logoUrl);
      
      if (autoSavePageSettings) {
        autoSavePageSettings({
          ...pageData,
          logo_url: logoUrl
        });
      }
      
      toast({
        title: "Logo uploaded",
        description: "Your business logo has been updated successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload logo"
      });
    } finally {
      setUploadingLogo(false);
    }
  };
  
  // Handle copy to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link copied",
      description: "Business page link copied to clipboard"
    });
  };
  
  return (
    <Tabs defaultValue="general">
      <TabsList className="mb-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="social">Social Media</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure basic settings for your business landing page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <Label className="mb-2 block">Business Logo</Label>
                <div className="relative">
                  <Avatar className="w-20 h-20 border">
                    <AvatarImage src={pageData.logo_url} />
                    <AvatarFallback className="bg-primary/10">LOGO</AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    disabled={uploadingLogo}
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    {uploadingLogo ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {uploadingLogo ? "Uploading..." : "Upload Logo"}
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="page_title">Page Title</Label>
                  <Input
                    id="page_title"
                    name="page_title"
                    value={pageData.page_title}
                    onChange={handleInputChangeWithAutoSave}
                    placeholder="My Business"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="page_slug">
                    Page URL Slug
                    <span className="text-xs text-muted-foreground ml-2">
                      (e.g. my-business)
                    </span>
                  </Label>
                  <div className="flex items-center">
                    <div className="text-sm text-muted-foreground mr-2">
                      /business/
                    </div>
                    <Input
                      id="page_slug"
                      name="page_slug"
                      value={pageData.page_slug}
                      onChange={handleInputChangeWithAutoSave}
                      placeholder="my-business"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Page Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={pageData.description || ""}
                    onChange={handleInputChangeWithAutoSave}
                    placeholder="Describe your business in a few sentences"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={pageData.is_published}
                  onCheckedChange={(checked) => handleToggleWithAutoSave('is_published', checked)}
                />
                <Label htmlFor="is_published">
                  Publish Page
                </Label>
              </div>
              
              <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Your Business Page</DialogTitle>
                    <DialogDescription>
                      Share your business page with customers and on social media
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Page Link</Label>
                      <div className="flex">
                        <Input 
                          value={publicUrl} 
                          readOnly 
                          className="rounded-r-none"
                        />
                        <Button 
                          className="rounded-l-none" 
                          onClick={handleCopyLink}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Share on Social Media</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={`https://wa.me/?text=${encodeURIComponent(`Check out my business: ${publicUrl}`)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Facebook
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            X (Twitter)
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>Appearance Settings</CardTitle>
            <CardDescription>
              Customize the look and feel of your business page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primary_color"
                    name="primary_color"
                    type="color"
                    value={pageData.primary_color}
                    onChange={handleInputChangeWithAutoSave}
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    type="text"
                    value={pageData.primary_color}
                    onChange={handleInputChangeWithAutoSave}
                    name="primary_color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="secondary_color"
                    name="secondary_color"
                    type="color"
                    value={pageData.secondary_color}
                    onChange={handleInputChangeWithAutoSave}
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    type="text"
                    value={pageData.secondary_color}
                    onChange={handleInputChangeWithAutoSave}
                    name="secondary_color"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="social">
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
              Add your social media profiles to display on your business page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SocialMediaLinks 
              socialLinks={socialLinks || []} 
              onAdd={addSocialLink.mutate}
              onUpdate={updateSocialLink.mutate}
              onDelete={deleteSocialLink.mutate}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="advanced">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>
              Configure additional settings for your business page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="chatbot_enabled"
                  checked={pageData.chatbot_enabled}
                  onCheckedChange={(checked) => handleToggleWithAutoSave('chatbot_enabled', checked)}
                />
                <Label htmlFor="chatbot_enabled" className="font-medium">
                  Enable TMW AI Chatbot
                </Label>
              </div>
              
              {pageData.chatbot_enabled && (
                <div className="ml-7 space-y-2 border-l-2 pl-4 border-primary/20">
                  <Label htmlFor="chatbot_code">TMW AI Chatbot Installation Code</Label>
                  <Textarea
                    id="chatbot_code"
                    name="chatbot_code"
                    value={pageData.chatbot_code || ""}
                    onChange={handleInputChangeWithAutoSave}
                    placeholder="Paste your TMW AI Chatbot installation code here"
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    Don't have a TMW AI Chatbot yet? <a 
                      href="https://tmw.qa/ai-chat-bot/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Get one here
                    </a> to enhance your business with AI-powered customer service.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <div className="flex justify-between mt-6">
        {isDirty && (
          <p className="text-xs text-muted-foreground">
            Auto-saving changes...
          </p>
        )}
        <Button 
          onClick={handleSavePageSettings} 
          disabled={updatePage.isPending}
          className="ml-auto"
        >
          {updatePage.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </Tabs>
  );
};

export default PageSettingsTab;
