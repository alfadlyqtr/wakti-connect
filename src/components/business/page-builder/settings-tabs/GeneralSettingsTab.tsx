import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Copy, ExternalLink, Edit, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";

interface GeneralSettingsTabProps {
  pageData: {
    id?: string;
    page_title: string;
    page_slug: string;
    description: string;
    is_published: boolean;
    chatbot_enabled: boolean;
    chatbot_code?: string;
    primary_color: string;
    secondary_color: string;
    logo_url?: string;
    show_subscribe_button?: boolean;
    subscribe_button_text?: string;
  };
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleWithAutoSave: (name: string, checked: boolean) => void;
  handleLogoUpload: (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => void;
  getPublicPageUrl: () => string;
  uploadingLogo: boolean;
  updatePage: any;
}

// Schema for the URL change request
const urlChangeSchema = z.object({
  requestedSlug: z.string().min(3, "URL must be at least 3 characters").max(60, "URL cannot exceed 60 characters")
    .regex(/^[a-z0-9-]+$/, "URL can only contain lowercase letters, numbers, and hyphens"),
  reason: z.string().min(10, "Please provide a brief reason for this change").max(500, "Reason is too long")
});

const GeneralSettingsTab = ({ 
  pageData, 
  handleInputChangeWithAutoSave, 
  handleToggleWithAutoSave,
  handleLogoUpload,
  getPublicPageUrl,
  uploadingLogo,
  updatePage
}: GeneralSettingsTabProps) => {
  const [urlChangeOpen, setUrlChangeOpen] = React.useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localChanges, setLocalChanges] = useState<Partial<GeneralSettingsTabProps['pageData']>>({});
  const [isDirty, setIsDirty] = useState(false);
  
  // For handling local changes
  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalChanges(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    
    // Also trigger auto-save
    handleInputChangeWithAutoSave(e);
  };
  
  const handleLocalToggleChange = (name: string, checked: boolean) => {
    setLocalChanges(prev => ({ ...prev, [name]: checked }));
    setIsDirty(true);
    
    // Also trigger auto-save
    handleToggleWithAutoSave(name, checked);
  };
  
  const handleSaveChanges = async () => {
    if (!pageData.id || !isDirty) {
      toast({
        title: "No changes to save",
        description: "No changes were detected in the general settings."
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await updatePage.mutateAsync({
        pageId: pageData.id,
        data: localChanges
      });
      
      toast({
        title: "General settings saved",
        description: "Your changes have been successfully saved."
      });
      
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving general settings:", error);
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description: "There was a problem saving your changes. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const copyPageUrl = () => {
    const url = getPublicPageUrl();
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "Page URL has been copied to clipboard",
    });
  };
  
  const visitPage = () => {
    const url = getPublicPageUrl();
    window.open(url, '_blank');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleLogoUpload(e);
  };
  
  // URL change request form
  const urlChangeForm = useForm<z.infer<typeof urlChangeSchema>>({
    resolver: zodResolver(urlChangeSchema),
    defaultValues: {
      requestedSlug: pageData.page_slug,
      reason: ""
    },
  });
  
  const onSubmitUrlChange = (values: z.infer<typeof urlChangeSchema>) => {
    // In a real implementation, this would send the request to an admin
    // For now, we'll just show a success toast
    toast({
      title: "URL change requested",
      description: "Your request has been submitted and is pending review",
    });
    setUrlChangeOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="page_title">Page Title</Label>
          <Input 
            id="page_title"
            name="page_title"
            value={pageData.page_title || ''}
            onChange={handleLocalInputChange}
            placeholder="Your Business Name"
          />
          <p className="text-sm text-muted-foreground mt-1">
            This will be displayed as the title of your business page.
          </p>
        </div>

        <div>
          <Label htmlFor="page_slug">Page URL</Label>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-1">/business/</span>
            <Input 
              id="page_slug"
              name="page_slug"
              value={pageData.page_slug || ''}
              readOnly
              placeholder="your-business-name"
              className="flex-1 bg-muted cursor-not-allowed"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">
              <span className="text-amber-500">Note:</span> URL changes require admin approval.
            </p>
            <div className="flex gap-2">
              <Dialog open={urlChangeOpen} onOpenChange={setUrlChangeOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Request Change
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Request URL Change</DialogTitle>
                    <DialogDescription>
                      Submit a request to change your page URL. This is subject to availability and approval.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...urlChangeForm}>
                    <form onSubmit={urlChangeForm.handleSubmit(onSubmitUrlChange)} className="space-y-4 py-4">
                      <FormField
                        control={urlChangeForm.control}
                        name="requestedSlug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requested URL</FormLabel>
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-1">/business/</span>
                              <FormControl>
                                <Input placeholder="your-business-name" {...field} />
                              </FormControl>
                            </div>
                            <FormDescription>
                              Use lowercase letters, numbers, and hyphens only
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={urlChangeForm.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason for change</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please explain why you want to change your URL"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Briefly explain why you need this change
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit">Submit Request</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm" onClick={copyPageUrl}>
                <Copy className="h-4 w-4 mr-1" />
                Copy URL
              </Button>
              <Button variant="outline" size="sm" onClick={visitPage}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Page Description</Label>
          <Textarea 
            id="description"
            name="description"
            value={pageData.description || ''}
            onChange={handleLocalInputChange}
            placeholder="Brief description of your business"
            rows={3}
          />
          <p className="text-sm text-muted-foreground mt-1">
            This will be used for SEO and may appear in search results.
          </p>
        </div>
        
        <div>
          <Label htmlFor="logo">Business Logo</Label>
          <div className="mt-2 flex items-center space-x-4">
            {pageData.logo_url && (
              <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                <img 
                  src={pageData.logo_url} 
                  alt="Business Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <Button
                type="button"
                variant="outline"
                disabled={uploadingLogo}
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                {uploadingLogo ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    {pageData.logo_url ? 'Change Logo' : 'Upload Logo'}
                  </>
                )}
              </Button>
              <input
                id="logo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended size: 200x200px
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <div className="space-y-0.5">
            <Label htmlFor="is_published">Publish Page</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, your page will be visible to the public.
            </p>
          </div>
          <Switch
            id="is_published"
            checked={pageData.is_published}
            onCheckedChange={(checked) => handleLocalToggleChange('is_published', checked)}
          />
        </div>

        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <div className="space-y-0.5">
            <Label htmlFor="show_subscribe_button">Show Subscribe Button</Label>
            <p className="text-sm text-muted-foreground">
              Allow visitors to subscribe to your business updates.
            </p>
          </div>
          <Switch
            id="show_subscribe_button"
            checked={pageData.show_subscribe_button !== false} // Default to true if undefined
            onCheckedChange={(checked) => handleLocalToggleChange('show_subscribe_button', checked)}
          />
        </div>

        {pageData.show_subscribe_button !== false && (
          <div className="mt-2 pl-4 border-l-2 border-muted">
            <Label htmlFor="subscribe_button_text">Subscribe Button Text</Label>
            <Input 
              id="subscribe_button_text"
              name="subscribe_button_text"
              value={pageData.subscribe_button_text || 'Subscribe'}
              onChange={handleLocalInputChange}
              placeholder="Subscribe"
            />
          </div>
        )}
      </div>
      
      <Button
        type="button"
        onClick={handleSaveChanges}
        disabled={isSaving || !isDirty}
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save General Settings
          </>
        )}
      </Button>
    </div>
  );
};

export default GeneralSettingsTab;
